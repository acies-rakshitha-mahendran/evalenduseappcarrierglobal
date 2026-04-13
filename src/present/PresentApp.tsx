// src/present/PresentApp.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { loadBuildConfig } from "../api";
import type { ProjectBuildConfig, ThemeConfig } from "../types";
import { HomePage } from "./HomePage";
import { SolutionsPage, type SolutionsState } from "./SolutionsPage";
import { ResultsPage } from "./ResultsPage";
import { RoiResultsPage } from "./RoiResultsPage";
import { InputPage } from "./InputPage";
import type { VADInputValue } from "../evalContext";
import { detectSelectedVADsFromLayout } from "../vadSelection";
import { VAD_INPUT_CONFIGS } from "../vadInputs";
import { SOLUTION_DEFAULTS, SOLUTION_SCALE, type SolutionId } from "../solutionsData";

type PresentTab = "home" | "solutions" | "vads" | "results" | "roi";

// ── v3 Spec lookup tables ──────────────────────────────────────────────────────

const SPEC_TIERS_MAP: Record<string, Record<string, number>> = {
  S1C1: { "Standard": 1, "High-Efficiency": 2, "Variable-Speed": 3 },
  S2C1: { "Single-Temp": 1, "Multi-Temp": 2, "E-Drive": 3 },
  S3C1: { "PrimeLINE": 1, "NaturaLINE": 2, "OptimaLINE": 3 },
  S4C1: { "Standard VRF": 1, "Heat Recovery": 2, "Premium VRF": 3 },
  S5C1: { "Standard HFC": 1, "Transcritical CO2": 2 },
  S1C2: { "50mm": 1, "75mm": 2, "100mm": 3 },
  S2C2: { "Standard": 1, "Enhanced": 2, "Premium": 3 },
  S3C2: { "None": 0, "Standard CA": 1, "Advanced CA": 2 },
  S4C2: { "Basic IAQ": 1, "Advanced IAQ": 2, "Premium IAQ": 3 },
  S5C2: { "Standard Cases": 1, "Low-Energy Cases": 2 },
  S1C3: { "Basic Sensors": 1, "Advanced Sensors": 2, "Premium Sensors": 3 },
  S2C3: { "Basic Sensors": 1, "Advanced Sensors": 2, "Premium Sensors": 3 },
  S3C3: { "Basic Probes": 1, "Advanced Probes": 2 },
  S4C3: { "Basic Thermostat": 1, "Smart Thermostat": 2 },
  S5C3: { "None": 0, "Standard Detection": 1, "Advanced Detection": 2 },
  S1C4: { "Standard": 1, "Professional": 2 },
  S2C4: { "Standard": 1, "Professional": 2 },
  S3C4: { "Standard": 1, "Professional": 2 },
  S4C4: { "Basic BAS": 1, "Advanced BAS": 2 },
  S5C4: { "Basic EMS": 1, "Advanced EMS": 2 },
  S1C5: { "Standard PM": 1, "Advanced PM": 2 },
  S2C5: { "None": 0, "Solar Kit": 1 },
  S3C5: { "None": 0, "Voyage Log": 1 },
  S4C5: { "Standard EnMgmt": 1, "Advanced EnMgmt": 2 },
  S5C5: { "Standard Monitor": 1, "Pro Monitor": 2 },
  S1C6: { "Basic Service": 1, "Comprehensive": 2 },
  S2C6: { "Basic Service": 1, "Comprehensive": 2 },
  S3C6: { "Basic Maint": 1, "Comprehensive": 2 },
  S4C6: { "Basic Plan": 1, "Comprehensive": 2 },
  S5C6: { "Basic Maint": 1, "Comprehensive": 2 },
};


const ENERGY_MULT: number[] = [0, 0.0771, 0.1377, 0.1906];
const SPOILAGE_MULT: number[] = [0, 0.1025, 0.1830, 0.2533];
const ERROR_MULT: number[] = [0, 0.2337, 0.4170, 0.5772];
const INSURANCE_MULT: number[] = [0, 0.1669, 0.2978, 0.4123];
const SLA_MULT: number[] = [0, 0.1780, 0.3177, 0.4398];
const CARBON_MULT: number[] = [0, 1.4243, 2.5416, 3.5181];
const REFRIGERANT_MULT: number[] = [0, 534, 953, 1319];
const INTENSITY_MULT: number[] = [0, 0.1526, 0.2723, 0.3769];

const DOWNTIME_MULT: number[] = [0, 1.2106, 2.1180];
const WORKFORCE_MULT: number[] = [0, 0.3725, 0.6517];
const COMPLIANCE_MULT: number[] = [0, 654, 1144];
const WIN_RATE_MULT: number[] = [0, 0.00109, 0.0019];
const EQUIP_LIFE_MULT: number[] = [0, 0.1743, 0.3050];
const FLEET_UTIL_MULT: number[] = [0, 0.02477, 0.0433];
const SLOT_INTENSITY: Record<number, number[]> = {
  1: [0, 0.98, 1.0, 1.02],
  2: [0, 0.97, 1.0, 1.03],
  3: [0, 0.98, 1.0, 1.01],
  4: [0, 0.99, 1.02],
  5: [0, 1.0, 1.02],
  6: [0, 0.99, 1.02],
};
const SOLUTION_SCENARIO_INTENSITY: Record<SolutionId, {
  x0: number; y0: number; // conservative anchor
  x1: number; y1: number; // base anchor
  x2: number; y2: number; // optimistic anchor
}> = {
  1: { x0: 0.0,   y0: 1.02, x1: 0.75,  y1: 1.00, x2: 1.0, y2: 0.99 },
  2: { x0: 0.167, y0: 1.08, x1: 0.70,  y1: 0.93, x2: 1.0, y2: 1.00 },
  3: { x0: 0.167, y0: 1.16, x1: 0.70,  y1: 1.08, x2: 1.0, y2: 1.16 },
  4: { x0: 0.0,   y0: 0.90, x1: 0.833, y1: 0.95, x2: 1.0, y2: 1.00 },
  5: { x0: 0.0,   y0: 0.84, x1: 0.833, y1: 1.08, x2: 1.0, y2: 0.95 },
};

// Maps each VAD name to the slot numbers it requires (per v3 spec VAD Summary table).
// A VAD is hidden when ANY of its required slots has price = 0 (i.e. "None" selected).
const VAD_SLOT_DEPS: Record<string, number[]> = {
  "Reduced Energy and Fuel Costs":    [1, 2],
  "Product Loss Prevention":          [3],
  "Revenue Protected from Downtime":  [4, 6],   // S4+S6
  "Workforce Productivity":           [6],
  "Operator Error Reduction":         [3],
  "Compliance and Penalty Avoidance": [4, 6],
  "Insurance Premium Reduction":      [3, 4],
  "Competitive Win Rate":             [4],
  "Customer SLA Compliance":          [3, 4],
  "Equipment Life Extension":         [6],       // S6
  "Fleet / Building Utilization":     [4],
  "Carbon Emissions Reduction":       [1],
  "Refrigerant Leak Prevention":      [3],
  "Energy Intensity Reduction":       [1, 2],
};

const applyTheme = (theme: ThemeConfig | null) => {
  if (!theme) return;
  const body = document.body;
  if (theme.mode === "light") {
    body.removeAttribute("data-theme");
    body.style.backgroundColor = "#f5f5f5";
    body.style.color = "#000000";
  } else {
    body.setAttribute("data-theme", "dark");
    body.style.backgroundColor = "#1a1a1a";
    body.style.color = "#ffffff";
  }
  const existingStyle = document.getElementById("theme-style");
  if (existingStyle) existingStyle.remove();
  const styleEl = document.createElement("style");
  styleEl.id = "theme-style";
  if (theme.mode === "light") {
    styleEl.textContent = `.canvas-frame { background-color: #ffffff !important; }`;
  } else {
    styleEl.textContent = `.canvas-frame { background-color: #2a2a2a !important; }`;
  }
  document.head.appendChild(styleEl);
};

export const PresentApp: React.FC = () => {
  const [active, setActive] = useState<PresentTab>("home");
  const [config, setConfig] = useState<ProjectBuildConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [inputValues, setInputValues] = useState<VADInputValue>({});

  // ── Solutions screen shared state ────────────────────────────────────────────
  const [solutionsState, setSolutionsState] = useState<SolutionsState>({
    solutionId: 1,
    fleetSize: 5,
    agreementLength: 5,
    specs: { 1: "High-Efficiency", 2: "75mm", 3: "Advanced Sensors", 4: "Professional", 5: "Advanced PM", 6: "Comprehensive" },
    slotPrices: [25000, 7800, 2800, 2400, 1800, 2800], // S1 default mid-tier
    hwAfterDiscount: 178000,
    swAnnualRecurring: 21000,
    ctAnnualRecurring: 14000,
    annualRecurring: 35000,
    year1Investment: 213000,
    totalCost5yr: 353000,
  });

  const handleSolutionsChange = useCallback((state: SolutionsState) => {
    setSolutionsState(state);
  }, []);

  useEffect(() => {
    // Reset input cache on solution switch so each solution reuses its own defaults.
    setInputValues({});
  }, [solutionsState.solutionId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("projectId") ?? "demo-project";
    loadBuildConfig(pid).then((c) => {
      setConfig(c);
      if (c?.theme) applyTheme(c.theme);
      setLoading(false);
    });
  }, []);

  const theme = config?.theme ?? null;
  const homeLayout    = config?.homeLayout    ?? null;
  const vadLayout     = config?.vadLayout     ?? null;
  const resultsLayout = config?.resultsLayout ?? null;
  const roiLayout     = config?.roiLayout     ?? null;

  const selectedVADs = useMemo(() => {
    const fromLayout = detectSelectedVADsFromLayout(vadLayout);
    const validFromLayout = fromLayout.filter(name => !!VAD_INPUT_CONFIGS[name]);
    return validFromLayout.length ? validFromLayout : Object.keys(VAD_INPUT_CONFIGS);
  }, [vadLayout]);

  // VADs whose required slots are all active (price > 0) given current solutions config.
  // When a slot is set to "None", all VADs depending on it are hidden.
  const activeVADs = useMemo(() => {
    const sp = solutionsState.slotPrices;
    return selectedVADs.filter((name) => {
      const deps = VAD_SLOT_DEPS[name];
      if (!deps) return true; // unknown VAD → always show
      return deps.every((slot) => (sp[slot - 1] ?? 0) > 0);
    });
  }, [selectedVADs, solutionsState.slotPrices]);

  // ── Calculation helpers ──────────────────────────────────────────────────────
  const getSolutionDefault = (solutionId: SolutionId, vadName: string, index: number): number | undefined => {
    const d = SOLUTION_DEFAULTS[solutionId];
    if (!d) return undefined;
    switch (vadName) {
      case "Reduced Energy and Fuel Costs":
        return index === 0 ? d.D10 : undefined;
      case "Product Loss Prevention":
        return index === 0 ? d.D12 : index === 1 ? d.D13 : undefined;
      case "Revenue Protected from Downtime":
        return index === 0 ? d.D14 : index === 2 ? d.D15 : undefined;
      case "Workforce Productivity":
        return index === 0 ? d.D18 : undefined;
      case "Operator Error Reduction":
        return index === 0 ? d.D23 : index === 1 ? d.D24 : undefined;
      case "Insurance Premium Reduction":
        return index === 0 ? d.D25 : undefined;
      case "Competitive Win Rate":
        return index === 0 ? d.D28 : undefined;
      case "Customer SLA Compliance":
        return index === 0 ? d.D29 : undefined;
      case "Equipment Life Extension":
        return index === 0 ? d.D20 : index === 1 ? d.D21 : undefined;
      case "Fleet / Building Utilization":
        return index === 0 ? d.D19 : undefined;
      case "Carbon Emissions Reduction":
        return index === 0 ? d.D26 : index === 1 ? d.D27 : undefined;
      case "Energy Intensity Reduction":
        return index === 0 ? d.D11 : undefined;
      default:
        return undefined;
    }
  };

  const getFieldNumber = (
    fields: { [fieldIndex: number]: { value: string | number; uom: string } } | undefined,
    index: number,
    vadName: string,
    solutionId: SolutionId
  ): number => {
    const entry = fields?.[index];
    if (entry != null && entry.value !== "" && entry.value != null) {
      const raw = entry.value;
      if (typeof raw === "number") return raw;
      const cleaned = String(raw).replace(/,/g, "");
      const n = parseFloat(cleaned);
      if (!isNaN(n)) return n;
    }
    const solutionFallback = getSolutionDefault(solutionId, vadName, index);
    if (solutionFallback != null && Number.isFinite(solutionFallback)) {
      return solutionFallback;
    }
    const field = VAD_INPUT_CONFIGS[vadName]?.fields[index];
    if (field?.defaultValue != null) {
      return typeof field.defaultValue === "number"
        ? field.defaultValue
        : parseFloat(String(field.defaultValue)) || 0;
    }
    return 0;
  };

  // ── 14-VAD Calculation Engine (v3 spec-dependent multipliers) ──────────────
  const calculateResultsFromInputs = useCallback((
    values: VADInputValue,
    solState: SolutionsState
  ): Record<string, number> => {
    const sp  = solState.slotPrices;
    const sl  = solState.specs ?? {};
    const sId = solState.solutionId;
    const fs  = solState.fleetSize;  // authoritative fleet size from Solutions page
    const s   = `S${sId}`;
    const scaleFactor = SOLUTION_SCALE[sId] ?? 1;

    // slot(n) → true if slot n has a non-zero price (i.e. not "None")
    const slot = (n: number) => (sp[n - 1] ?? 0) > 0;

    // tier(slotNum) → index into multiplier arrays (1=Tier0, 2=Tier1, 3=Tier2)
    // SPEC_TIERS_MAP stores 1-based values so MULT[tier(n)] picks the right entry.
    const tier = (slotNum: number): number =>
      SPEC_TIERS_MAP[`${s}C${slotNum}`]?.[sl[slotNum] ?? ""] ?? 0;
    const specFactor = (slotNum: number): number => {
      const t = tier(slotNum);
      const table = SLOT_INTENSITY[slotNum] ?? [];
      return table[t] ?? 1;
    };
    const intensity = (refs: Array<[number, number]>): number => {
      let weighted = 0;
      let totalW = 0;
      refs.forEach(([slotNum, w]) => {
        if (!slot(slotNum)) return;
        weighted += specFactor(slotNum) * w;
        totalW += w;
      });
      return totalW > 0 ? weighted / totalW : 1;
    };
    const tierScore = (): number => {
      let sum = 0;
      let count = 0;
      for (let slotNum = 1; slotNum <= 6; slotNum += 1) {
        if (!slot(slotNum)) continue;
        const slotMap = SPEC_TIERS_MAP[`${s}C${slotNum}`];
        const selectedTier = tier(slotNum);
        const validTiers = Object.values(slotMap ?? {}).filter((n) => n > 0);
        if (selectedTier <= 0 || validTiers.length === 0) continue;
        const minTier = Math.min(...validTiers);
        const maxTier = Math.max(...validTiers);
        const normalized = maxTier > minTier ? (selectedTier - minTier) / (maxTier - minTier) : 1;
        sum += normalized;
        count += 1;
      }
      return count > 0 ? sum / count : 0;
    };
    const scenarioIntensity = (score: number): number => {
      const cfg = SOLUTION_SCENARIO_INTENSITY[sId];
      if (!cfg) return 1;
      const x = Math.max(0, Math.min(1, score));
      const { x0, y0, x1, y1, x2, y2 } = cfg;
      const d01 = x0 - x1;
      const d02 = x0 - x2;
      const d10 = x1 - x0;
      const d12 = x1 - x2;
      const d20 = x2 - x0;
      const d21 = x2 - x1;
      if (d01 === 0 || d02 === 0 || d10 === 0 || d12 === 0 || d20 === 0 || d21 === 0) {
        return 1;
      }
      const l0 = ((x - x1) * (x - x2)) / (d01 * d02);
      const l1 = ((x - x0) * (x - x2)) / (d10 * d12);
      const l2 = ((x - x0) * (x - x1)) / (d20 * d21);
      const y = y0 * l0 + y1 * l1 + y2 * l2;
      const clamped = Math.max(0.75, Math.min(1.35, y));
      return Number.isFinite(clamped) ? clamped : 1;
    };
    const scenarioFactor = scenarioIntensity(tierScore());

    const res: Record<string, number> = {};

    selectedVADs.forEach((vadName) => {
      const f = values[vadName] ?? {};
      let total = 0;

      switch (vadName) {

        // VAD 1: energyCost × ENERGY_MULT[tier(S1)] × fleet  (req: S1+S2)
        case "Reduced Energy and Fuel Costs": {
          if (!slot(1) || !slot(2)) break;
          const energyCost = getFieldNumber(f, 0, vadName, sId);
          total = energyCost * ENERGY_MULT[tier(1)] * fs * intensity([[1, 0.65], [2, 0.35]]);
          break;
        }

        // VAD 2: cargo × (spoilRate/100) × SPOILAGE_MULT[tier(S3)] × fleet  (req: S3)
        case "Product Loss Prevention": {
          if (!slot(3)) break;
          const cargo      = getFieldNumber(f, 0, vadName, sId);
          const spoilRate  = getFieldNumber(f, 1, vadName, sId) / 100;
          total = cargo * spoilRate * SPOILAGE_MULT[tier(3)] * fs * intensity([[2, 0.4], [3, 0.6]]);
          break;
        }

        // VAD 3: downtimeCost × DOWNTIME_MULT[tier(S4)] × fleet × (breakdownProb/100)  (req: S4+S6)
        case "Revenue Protected from Downtime": {
          if (!slot(4) || !slot(6)) break;
          const downtimeCost  = getFieldNumber(f, 0, vadName, sId);
          const breakdownProb = getFieldNumber(f, 2, vadName, sId) / 100;
          total = downtimeCost * DOWNTIME_MULT[tier(4)] * fs * breakdownProb * intensity([[1, 0.4], [4, 0.4], [5, 0.2]]);
          break;
        }

        // VAD 4: WORKFORCE_MULT[tier(S6)] × 52 × staffCost × fleet  (req: S6)
        case "Workforce Productivity": {
          if (!slot(6)) break;
          const staffCost = getFieldNumber(f, 0, vadName, sId);
          total = WORKFORCE_MULT[tier(6)] * 52 * staffCost * fs * intensity([[4, 0.55], [6, 0.45]]);
          break;
        }

        // VAD 5: errors × errCost × ERROR_MULT[tier(S3)] × fleet  (req: S3)
        case "Operator Error Reduction": {
          if (!slot(3)) break;
          const errors  = getFieldNumber(f, 0, vadName, sId);
          const errCost = getFieldNumber(f, 1, vadName, sId);
          total = errors * errCost * ERROR_MULT[tier(3)] * fs * intensity([[3, 0.75], [4, 0.25]]);
          break;
        }

        // VAD 6: COMPLIANCE_MULT[tier(S4)] × fleet  (req: S4+S6)
        case "Compliance and Penalty Avoidance": {
          if (!slot(4) || !slot(6)) break;
          total = COMPLIANCE_MULT[tier(4)] * fs * intensity([[4, 0.6], [6, 0.4]]);
          break;
        }

        // VAD 7: insurance × INSURANCE_MULT[tier(S3)] × fleet  (req: S3+S4)
        case "Insurance Premium Reduction": {
          if (!slot(3) || !slot(4)) break;
          const insurance = getFieldNumber(f, 0, vadName, sId);
          total = insurance * INSURANCE_MULT[tier(3)] * fs * intensity([[3, 0.6], [4, 0.4]]);
          break;
        }

        // VAD 8: revenue × WIN_RATE_MULT[tier(S4)] × fleet  (req: S4)
        case "Competitive Win Rate": {
          if (!slot(4)) break;
          const revenue = getFieldNumber(f, 0, vadName, sId);
          total = revenue * WIN_RATE_MULT[tier(4)] * fs * intensity([[4, 0.7], [5, 0.3]]);
          break;
        }

        // VAD 9: slaPenalties × SLA_MULT[tier(S3)] × fleet  (req: S3+S4)
        case "Customer SLA Compliance": {
          if (!slot(3) || !slot(4)) break;
          const slaPenalties = getFieldNumber(f, 0, vadName, sId);
          total = slaPenalties * SLA_MULT[tier(3)] * fs * intensity([[3, 0.6], [4, 0.4]]);
          break;
        }

        // VAD 10: replacementCost × (EQUIP_LIFE_MULT[tier(S6)] / equipLife) × fleet  (req: S6)
        case "Equipment Life Extension": {
          if (!slot(6)) break;
          const replacementCost = getFieldNumber(f, 0, vadName, sId);
          const equipLife       = getFieldNumber(f, 1, vadName, sId);
          total = equipLife > 0 ? replacementCost * (EQUIP_LIFE_MULT[tier(6)] / equipLife) * fs * intensity([[5, 0.55], [6, 0.45]]) : 0;
          break;
        }

        // VAD 11: routeCost × FLEET_UTIL_MULT[tier(S4)] × fleet  (req: S4)
        case "Fleet / Building Utilization": {
          if (!slot(4)) break;
          const routeCost = getFieldNumber(f, 0, vadName, sId);
          total = routeCost * FLEET_UTIL_MULT[tier(4)] * fs * intensity([[4, 0.6], [5, 0.4]]);
          break;
        }

        // VAD 12: co2 × CARBON_MULT[tier(S1)] × carbonPrice × fleet  (req: S1)
        case "Carbon Emissions Reduction": {
          if (!slot(1)) break;
          const co2         = getFieldNumber(f, 0, vadName, sId);
          const carbonPrice = getFieldNumber(f, 1, vadName, sId);
          total = co2 * CARBON_MULT[tier(1)] * carbonPrice * fs * intensity([[1, 0.8], [2, 0.2]]);
          break;
        }

        // VAD 13: REFRIGERANT_MULT[tier(S3)] × fleet  (req: S3)
        case "Refrigerant Leak Prevention": {
          if (!slot(3)) break;
          total = REFRIGERANT_MULT[tier(3)] * fs * intensity([[1, 0.25], [3, 0.75]]);
          break;
        }

        // VAD 14: compressorCost × INTENSITY_MULT[tier(S1)] × fleet  (req: S1+S2)
        case "Energy Intensity Reduction": {
          if (!slot(1) || !slot(2)) break;
          const compressorCost = getFieldNumber(f, 0, vadName, sId);
          total = compressorCost * INTENSITY_MULT[tier(1)] * fs * intensity([[1, 0.6], [2, 0.4]]);
          break;
        }

        default:
          total = 0;
      }

      const scaled = Number.isFinite(total) ? total * scaleFactor * scenarioFactor : 0;
      res[vadName] = scaled;
    });

    const totalAnnualValue = Object.values(res)
      .reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);
    const years = Math.max(1, solState.agreementLength);
    const annualizedInvestment = Math.max(0, solState.totalCost5yr) / years;
    const netBenefitYear1 = Math.max(0, totalAnnualValue - annualizedInvestment);
    const roiRatio = annualizedInvestment > 0 ? netBenefitYear1 / annualizedInvestment : 0;

    return {
      ...res,
      "Total Annual Value":    totalAnnualValue,
      "Total Investments":     annualizedInvestment,
      "Net Benefit (Year 1)":  netBenefitYear1,
      "ROI":                   roiRatio,
    };
  }, [selectedVADs]);

  const handleCalculate = () => {
    const computed = calculateResultsFromInputs(inputValues, solutionsState);
    setResults(computed);
    setActive("results");
  };

  const computedResults = results ? calculateResultsFromInputs(inputValues, solutionsState) : null;

  if (loading) {
    return <div className="present-shell"><div style={{ padding: 24 }}>Loading build config…</div></div>;
  }

  if (!config) {
    return (
      <div className="present-shell">
        <div style={{ padding: 24 }}>No build configuration found. Publish from the Build app first.</div>
      </div>
    );
  }

  const bg   = theme?.background ?? "#020617";
  const text = theme?.text       ?? "#e5e7eb";

  const tab = (id: PresentTab, label: string) => (
    <button
      key={id}
      className={`nav-tab ${active === id ? "active" : ""}`}
      onClick={() => {
        if (id === "results" || id === "roi") {
          const computed = calculateResultsFromInputs(inputValues, solutionsState);
          setResults(computed);
        }
        setActive(id);
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="present-shell" style={{ background: bg, color: text, height: '100vh', overflow: 'auto' }}>
      <div style={{ padding: "0.5rem 0.75rem", display: "flex", alignItems: "center", gap: 8 }}>
        <div className="nav-tabs">
          {tab("home",      "Home")}
          {tab("solutions", "Solutions configuration")}
          {tab("vads",      "Value Drivers")}
          {tab("results",   "Value Estimation")}
          {tab("roi",       "ROI/TCO results")}
        </div>
      </div>

      {active === "home" && <HomePage layout={homeLayout} />}

      {/* SolutionsPage stays mounted so user edits are preserved when switching tabs */}
      <div style={{ display: active === "solutions" ? "contents" : "none" }}>
        <SolutionsPage
          onDataChange={handleSolutionsChange}
          initialFleetSize={solutionsState.fleetSize}
          initialAgreementLength={solutionsState.agreementLength}
        />
      </div>

      {active === "vads" && (
        <InputPage
          vadNames={activeVADs}
          onCalculate={handleCalculate}
          onInputsChange={setInputValues}
          initialInputs={inputValues}
          fleetSize={solutionsState.fleetSize}
        />
      )}

      {active === "results" && (
        <ResultsPage
          results={computedResults}
          layout={resultsLayout}
          selectedVADs={activeVADs}
          inputs={inputValues}
        />
      )}

      {active === "roi" && (
        <RoiResultsPage
          results={computedResults}
          layout={roiLayout}
          selectedVADs={activeVADs}
          inputs={inputValues}
          solutionsState={solutionsState}
        />
      )}
    </div>
  );
};
