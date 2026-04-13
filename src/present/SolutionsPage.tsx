// src/present/SolutionsPage.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  SOLUTIONS,
  SLOT_CONFIGS,
  DROPDOWN_OPTIONS,
  PRICE_TABLE,
  DEFAULT_SPECS,
  SOLUTION_DEFAULTS,
  lookupSlot,
  type SolutionId,
} from "../solutionsData";

const fmtCurrency = (n: number) =>
  "$" + Math.round(n).toLocaleString("en-US");

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  HW: { bg: "#EBF5E1", text: "#2d6a10", border: "#81b558" },
  SW: { bg: "#E8F4FD", text: "#1565C0", border: "#64b5f6" },
  CT: { bg: "#F3E5F5", text: "#6A1B9A", border: "#ce93d8" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "One-Time": { bg: "#FFF8E1", text: "#E65100" },
  "Annual":   { bg: "#E8F5E9", text: "#2E7D32" },
};

const STATUS_COLORS = {
  "New":      { bg: "#e0f2fe", text: "#0369a1", border: "#7dd3fc" },
  "Upgrade":  { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  "Existing": { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
};

// Generic component names per solution/slot
const GENERIC_NAMES: Record<number, Record<number, string>> = {
  1: { 1: "Refrigeration Unit", 2: "Insulation Panels", 3: "Temperature Sensors", 4: "Fleet Telematics", 5: "Predictive Maintenance", 6: "Service Contract" },
  2: { 1: "Refrigeration Unit", 2: "Insulation System", 3: "Temperature Sensors", 4: "Fleet Telematics", 5: "Solar Charging", 6: "Service Contract" },
  3: { 1: "Refrigeration Unit", 2: "Atmosphere Control", 3: "Monitoring Sensors", 4: "Remote Monitoring", 5: "Voyage Recording", 6: "Service Contract" },
  4: { 1: "HVAC System", 2: "Air Quality Sensors", 3: "Thermostat Controls", 4: "Building Automation", 5: "Energy Management", 6: "Maintenance Plan" },
  5: { 1: "Refrigeration System", 2: "Display Cases", 3: "Leak Detection", 4: "Energy Controller", 5: "Store Monitoring", 6: "Service Contract" },
};

// SKU name mapping: solution+slot+option → SKU label shown in UI
const SKU_NAMES: Record<string, Record<string, string>> = {
  "S1C1": { "Standard": "Supra 444", "High-Efficiency": "Supra 644", "Variable-Speed": "X4 7300" },
  "S1C2": { "50mm": "ThermaPanel 50", "75mm": "ThermaPanel 75", "100mm": "ThermaPanel 100" },
  "S1C3": { "Basic Sensors": "TempGuard TG-100", "Advanced Sensors": "TempGuard TG-200", "Premium Sensors": "TempGuard TG-300" },
  "S1C4": { "Standard": "Lynx Std", "Professional": "Lynx Pro" },
  "S1C5": { "Standard PM": "BluEdge PM Basic", "Advanced PM": "BluEdge PM Plus" },
  "S1C6": { "Basic Service": "BluEdge Essential", "Comprehensive": "BluEdge Complete" },

  "S2C1": { "Single-Temp": "Vector 1850", "Multi-Temp": "Vector 1950", "E-Drive": "Vector HE-19" },
  "S2C2": { "Standard": "ThermaPanel S", "Enhanced": "ThermaPanel E", "Premium": "ThermaPanel P" },
  "S2C3": { "Basic Sensors": "TempGuard TG-100", "Advanced Sensors": "TempGuard TG-200", "Premium Sensors": "TempGuard TG-300" },
  "S2C4": { "Standard": "Lynx Std", "Professional": "Lynx Pro" },
  "S2C5": { "None": "—", "Solar Kit": "SolarCharge SK-1" },
  "S2C6": { "Basic Service": "BluEdge Essential", "Comprehensive": "BluEdge Complete" },

  "S3C1": { "PrimeLINE": "PrimeLINE PL-100", "NaturaLINE": "NaturaLINE NL-100", "OptimaLINE": "OptimaLINE OL-200" },
  "S3C2": { "None": "—", "Standard CA": "XtendFRESH STD", "Advanced CA": "XtendFRESH ADV" },
  "S3C3": { "Basic Probes": "DataCORE B-200", "Advanced Probes": "DataCORE A-400" },
  "S3C4": { "Standard": "Lynx iQ Std", "Professional": "Lynx iQ Pro" },
  "S3C5": { "None": "—", "Voyage Log": "VoyageLog VL-1" },
  "S3C6": { "Basic Maint": "BluEdge Essential", "Comprehensive": "BluEdge Complete" },

  "S4C1": { "Standard VRF": "AquaEdge VRF-S", "Heat Recovery": "AquaEdge VRF-HR", "Premium VRF": "AquaEdge VRF-P" },
  "S4C2": { "Basic IAQ": "IAQ-Sense B100", "Advanced IAQ": "IAQ-Sense A200", "Premium IAQ": "IAQ-Sense P300" },
  "S4C3": { "Basic Thermostat": "ComfortLink T1", "Smart Thermostat": "ComfortLink T3" },
  "S4C4": { "Basic BAS": "i-Vu Basic", "Advanced BAS": "i-Vu Advanced" },
  "S4C5": { "Standard EnMgmt": "EnergyWise STD", "Advanced EnMgmt": "EnergyWise ADV" },
  "S4C6": { "Basic Plan": "TotalCare Basic", "Comprehensive": "TotalCare Plus" },

  "S5C1": { "Standard HFC": "CO2OLtec HFC-S", "Transcritical CO2": "CO2OLtec TC-200" },
  "S5C2": { "Standard Cases": "DisplayPro S100", "Low-Energy Cases": "DisplayPro LE200" },
  "S5C3": { "None": "—", "Standard Detection": "LeakGuard STD", "Advanced Detection": "LeakGuard ADV" },
  "S5C4": { "Basic EMS": "EMS-Control B", "Advanced EMS": "EMS-Control A" },
  "S5C5": { "Standard Monitor": "StoreView STD", "Pro Monitor": "StoreView PRO" },
  "S5C6": { "Basic Maint": "BluEdge Essential", "Comprehensive": "BluEdge Complete" },
};

// Customer's existing setup per solution/slot (used in Existing tab & status detection)
// Designed so solution 1 defaults show 3 Upgrades / 2 New / 1 Existing
const EXISTING_SPECS: Record<number, Record<number, string>> = {
  1: { 1: "Standard", 2: "50mm", 3: "Advanced Sensors", 4: "", 5: "", 6: "Basic Service" },
  2: { 1: "Single-Temp", 2: "Standard", 3: "Advanced Sensors", 4: "", 5: "", 6: "Basic Service" },
  3: { 1: "PrimeLINE", 2: "", 3: "Basic Probes", 4: "", 5: "", 6: "Basic Maint" },
  4: { 1: "Standard VRF", 2: "Basic IAQ", 3: "Smart Thermostat", 4: "", 5: "", 6: "Basic Plan" },
  5: { 1: "Standard HFC", 2: "Standard Cases", 3: "Standard Detection", 4: "", 5: "", 6: "Basic Maint" },
};

// Spec tier ordering (low → high) for Upgrade detection
const SPEC_ORDER: Record<string, string[]> = {
  "S1C1": ["Standard", "High-Efficiency", "Variable-Speed"],
  "S1C2": ["50mm", "75mm", "100mm"],
  "S1C3": ["Basic Sensors", "Advanced Sensors", "Premium Sensors"],
  "S1C4": ["Standard", "Professional"],
  "S1C5": ["Standard PM", "Advanced PM"],
  "S1C6": ["Basic Service", "Comprehensive"],

  "S2C1": ["Single-Temp", "Multi-Temp", "E-Drive"],
  "S2C2": ["Standard", "Enhanced", "Premium"],
  "S2C3": ["Basic Sensors", "Advanced Sensors", "Premium Sensors"],
  "S2C4": ["Standard", "Professional"],
  "S2C5": ["None", "Solar Kit"],
  "S2C6": ["Basic Service", "Comprehensive"],

  "S3C1": ["PrimeLINE", "NaturaLINE", "OptimaLINE"],
  "S3C2": ["None", "Standard CA", "Advanced CA"],
  "S3C3": ["Basic Probes", "Advanced Probes"],
  "S3C4": ["Standard", "Professional"],
  "S3C5": ["None", "Voyage Log"],
  "S3C6": ["Basic Maint", "Comprehensive"],

  "S4C1": ["Standard VRF", "Heat Recovery", "Premium VRF"],
  "S4C2": ["Basic IAQ", "Advanced IAQ", "Premium IAQ"],
  "S4C3": ["Basic Thermostat", "Smart Thermostat"],
  "S4C4": ["Basic BAS", "Advanced BAS"],
  "S4C5": ["Standard EnMgmt", "Advanced EnMgmt"],
  "S4C6": ["Basic Plan", "Comprehensive"],

  "S5C1": ["Standard HFC", "Transcritical CO2"],
  "S5C2": ["Standard Cases", "Low-Energy Cases"],
  "S5C3": ["None", "Standard Detection", "Advanced Detection"],
  "S5C4": ["Basic EMS", "Advanced EMS"],
  "S5C5": ["Standard Monitor", "Pro Monitor"],
  "S5C6": ["Basic Maint", "Comprehensive"],
};

// ── Compatibility rules ──────────────────────────────────────────────────────
interface CompatRule {
  requirerSlot: number;
  requirerSpec: string;
  requiredSlot: number;
  minSpecs: string[];
}

const COMPAT_RULES: Record<SolutionId, CompatRule[]> = {
  1: [
    { requirerSlot: 1, requirerSpec: "Variable-Speed",    requiredSlot: 3, minSpecs: ["Advanced Sensors", "Premium Sensors"] },
    { requirerSlot: 3, requirerSpec: "Premium Sensors",   requiredSlot: 4, minSpecs: ["Professional"] },
    { requirerSlot: 5, requirerSpec: "Advanced PM",        requiredSlot: 3, minSpecs: ["Advanced Sensors", "Premium Sensors"] },
  ],
  2: [
    { requirerSlot: 1, requirerSpec: "E-Drive",           requiredSlot: 3, minSpecs: ["Advanced Sensors", "Premium Sensors"] },
    { requirerSlot: 3, requirerSpec: "Premium Sensors",   requiredSlot: 4, minSpecs: ["Professional"] },
  ],
  3: [
    { requirerSlot: 1, requirerSpec: "OptimaLINE",        requiredSlot: 4, minSpecs: ["Professional"] },
    { requirerSlot: 2, requirerSpec: "Advanced CA",        requiredSlot: 3, minSpecs: ["Advanced Probes"] },
    { requirerSlot: 5, requirerSpec: "Voyage Log",         requiredSlot: 4, minSpecs: ["Standard", "Professional"] },
  ],
  4: [
    { requirerSlot: 1, requirerSpec: "Premium VRF",        requiredSlot: 4, minSpecs: ["Advanced BAS"] },
    { requirerSlot: 2, requirerSpec: "Premium IAQ",        requiredSlot: 4, minSpecs: ["Advanced BAS"] },
    { requirerSlot: 3, requirerSpec: "Smart Thermostat",   requiredSlot: 4, minSpecs: ["Basic BAS", "Advanced BAS"] },
    { requirerSlot: 5, requirerSpec: "Advanced EnMgmt",    requiredSlot: 4, minSpecs: ["Basic BAS", "Advanced BAS"] },
  ],
  5: [
    { requirerSlot: 3, requirerSpec: "Advanced Detection", requiredSlot: 4, minSpecs: ["Basic EMS", "Advanced EMS"] },
  ],
};

function applyCompatibility(
  solutionId: SolutionId,
  specs: Record<number, string>
): Record<number, string> {
  const corrected = { ...specs };
  const rules = COMPAT_RULES[solutionId] ?? [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of rules) {
      const requirerSpec = corrected[rule.requirerSlot] ?? "";
      if (requirerSpec !== rule.requirerSpec) continue;
      const dependencySpec = corrected[rule.requiredSlot] ?? "";
      if (!rule.minSpecs.includes(dependencySpec)) {
        corrected[rule.requirerSlot] = "";
        changed = true;
        break;
      }
    }
  }
  return corrected;
}

export interface SolutionsState {
  solutionId: SolutionId;
  fleetSize: number;
  agreementLength: number;
  specs: Record<number, string>;
  slotPrices: number[];
  hwAfterDiscount: number;
  swAnnualRecurring: number;
  ctAnnualRecurring: number;
  annualRecurring: number;
  year1Investment: number;
  totalCost5yr: number;
}

type Props = {
  onDataChange: (state: SolutionsState) => void;
  initialFleetSize?: number;
  initialAgreementLength?: number;
};

export const SolutionsPage: React.FC<Props> = ({
  onDataChange,
  initialFleetSize = 5,
  initialAgreementLength = 5,
}) => {
  const [solutionId, setSolutionId] = useState<SolutionId>(1);
  const [fleetSize, setFleetSize] = useState(initialFleetSize);
  const [agreementLength, setAgreementLength] = useState(initialAgreementLength);
  const [specs, setSpecs] = useState<Record<number, string>>(
    applyCompatibility(1, DEFAULT_SPECS[1])
  );
  const [discounts, setDiscounts] = useState<Record<number, number>>({1:0,2:0,3:0,4:0,5:0,6:0});
  const [filterCat, setFilterCat] = useState<"All" | "HW" | "SW" | "CT">("All");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "value-desc">("default");
  const [viewMode, setViewMode] = useState<"Existing" | "Suggested">("Suggested");

  const changeSolution = (id: SolutionId) => {
    setSolutionId(id);
    const newSpecs = applyCompatibility(id, DEFAULT_SPECS[id]);
    setSpecs(newSpecs);
    const defaults = SOLUTION_DEFAULTS[id];
    setFleetSize(defaults.D8);
    setAgreementLength(defaults.D9);
    setDiscounts({1:0,2:0,3:0,4:0,5:0,6:0});
  };

  const setSpec = (slot: number, value: string) => {
    setSpecs((prev) => {
      const next = applyCompatibility(solutionId, { ...prev, [slot]: value });
      return next;
    });
  };

  const setDiscount = (slot: number, value: number) =>
    setDiscounts((prev) => ({ ...prev, [slot]: value }));

  // Derive New / Upgrade / Existing status for a slot in the Suggested view.
  // A slot is considered "not in Existing" when its existingSpec is empty OR "None"
  // (mirrors the existingSlots filter: es && es !== "None" && es !== "").
  const getComponentStatus = (slotNum: number, selectedSpec: string): "New" | "Upgrade" | "Existing" => {
    // Nothing selected in Suggested → N/A, show nothing
    if (!selectedSpec || selectedSpec === "None") return "Existing";
    const existingSpec = EXISTING_SPECS[solutionId]?.[slotNum] ?? "";
    // No existing component at this slot (empty OR "None") → any selection is New
    if (!existingSpec || existingSpec === "None") return "New";
    // Same spec as existing
    if (selectedSpec === existingSpec) return "Existing";
    // Compare tier position
    const key = `S${solutionId}C${slotNum}`;
    const order = SPEC_ORDER[key] ?? [];
    const existingIdx = order.indexOf(existingSpec);
    const selectedIdx = order.indexOf(selectedSpec);
    return selectedIdx > existingIdx ? "Upgrade" : "Existing";
  };

  const emit = useCallback(() => {
    const slotPrices: number[] = [];
    let hwAfterDiscount = 0;
    let swAnnualRecurring = 0;
    let ctAnnualRecurring = 0;

    SLOT_CONFIGS[solutionId].forEach((slot) => {
      const spec = specs[slot.slotNumber] ?? "";
      const { price } = spec ? lookupSlot(solutionId, slot.slotNumber, spec) : { price: 0 };
      slotPrices.push(price);
      const disc = discounts[slot.slotNumber] ?? 0;
      const amount = price * fleetSize * (1 - disc / 100);
      if (slot.pricingType === "One-Time") {
        hwAfterDiscount += amount;
      } else {
        if (slot.category === "SW") {
          swAnnualRecurring += amount;
        } else if (slot.category === "CT") {
          ctAnnualRecurring += amount;
        }
      }
    });
    const annualRecurring = swAnnualRecurring + ctAnnualRecurring;

    onDataChange({
      solutionId,
      fleetSize,
      agreementLength,
      specs,
      slotPrices,
      hwAfterDiscount,
      swAnnualRecurring,
      ctAnnualRecurring,
      annualRecurring,
      year1Investment: hwAfterDiscount + annualRecurring,
      totalCost5yr: hwAfterDiscount + annualRecurring * agreementLength,
    });
  }, [solutionId, fleetSize, agreementLength, specs, discounts, onDataChange]);

  useEffect(() => { emit(); }, [emit]);

  const allSlots = SLOT_CONFIGS[solutionId];
  const solution = SOLUTIONS.find((s) => s.id === solutionId)!;

  // Apply filter + sort to Suggested table rows
  const slots = React.useMemo(() => {
    let rows = [...allSlots];
    if (filterCat !== "All") {
      rows = rows.filter((s) => s.category === filterCat);
    }
    if (sortBy === "price-asc" || sortBy === "price-desc") {
      rows = rows.sort((a, b) => {
        const specA = specs[a.slotNumber] ?? "";
        const specB = specs[b.slotNumber] ?? "";
        const pA = specA ? lookupSlot(solutionId, a.slotNumber, specA).price : 0;
        const pB = specB ? lookupSlot(solutionId, b.slotNumber, specB).price : 0;
        return sortBy === "price-asc" ? pA - pB : pB - pA;
      });
    } else if (sortBy === "value-desc") {
      rows = rows.sort((a, b) => {
        const specA = specs[a.slotNumber] ?? "";
        const specB = specs[b.slotNumber] ?? "";
        const vA = specA ? lookupSlot(solutionId, a.slotNumber, specA).price : 0;
        const vB = specB ? lookupSlot(solutionId, b.slotNumber, specB).price : 0;
        return vB - vA;
      });
    }
    return rows;
  }, [allSlots, filterCat, sortBy, solutionId, specs]);

  // Suggested footer totals (always from full slot list)
  let hwTotal = 0, hwDiscAmt = 0, annualTotalAfterDisc = 0;
  allSlots.forEach((slot) => {
    const spec = specs[slot.slotNumber] ?? "";
    const { price } = spec ? lookupSlot(solutionId, slot.slotNumber, spec) : { price: 0 };
    const disc = discounts[slot.slotNumber] ?? 0;
    const discountedUnitPrice = price * (1 - disc / 100);
    if (slot.pricingType === "One-Time") {
      hwTotal += price * fleetSize;
      hwDiscAmt += price * fleetSize * (disc / 100);
    } else {
      annualTotalAfterDisc += discountedUnitPrice * fleetSize;
    }
  });
  const hwAfterDisc = hwTotal - hwDiscAmt;
  const year1 = hwAfterDisc + annualTotalAfterDisc;

  // Existing tab — slots where customer has a component
  const existingSlots = allSlots.filter((s) => {
    const es = EXISTING_SPECS[solutionId]?.[s.slotNumber] ?? "";
    return es && es !== "None" && es !== "";
  });
  let exHwTotal = 0, exAnnualTotal = 0;
  existingSlots.forEach((slot) => {
    const es = EXISTING_SPECS[solutionId][slot.slotNumber];
    const { price } = lookupSlot(solutionId, slot.slotNumber, es);
    if (slot.pricingType === "One-Time") exHwTotal += price * fleetSize;
    else exAnnualTotal += price * fleetSize;
  });

  const stepperBtn: React.CSSProperties = {
    width: 28, height: 28,
    border: "1px solid rgba(85,136,59,0.3)",
    borderRadius: 7,
    background: "#fff",
    color: "#55883B",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    lineHeight: 1,
  };

  const thStyle: React.CSSProperties = {
    padding: "9px 10px",
    color: "#475569",
    fontWeight: 700,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "2px solid rgba(85,136,59,0.15)",
    background: "linear-gradient(to bottom, #f8fafc, #f0f4f0)",
    whiteSpace: "nowrap",
    textAlign: "left",
  };

  const sortLabel = sortBy === "default" ? "Sort" : sortBy === "price-asc" ? "Price ↑" : sortBy === "price-desc" ? "Price ↓" : "Value ↓";

  const CAT_LABEL: Record<string, string> = {
    HW: "Hardware",
    SW: "Software",
    CT: "Maintenance Contract",
  };

  return (
    <div
      className="present-body"
      style={{
        padding: "1rem 1.25rem",
        overflowY: "visible",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* ── Controls Row ── */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
          marginBottom: 16,
          padding: "12px 16px",
          background: "linear-gradient(135deg, #f8fafc, #f0f7ea)",
          borderRadius: 12,
          border: "1px solid rgba(85,136,59,0.15)",
        }}
      >
        {/* Solution Selector */}
        <div style={{ flex: "1 1 260px", minWidth: 220 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#334155", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Solution
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={solutionId}
              onChange={(e) => changeSolution(parseInt(e.target.value) as SolutionId)}
              style={{
                width: "100%",
                padding: "0.5rem 2rem 0.5rem 0.75rem",
                borderRadius: 8,
                border: "1.5px solid rgba(85,136,59,0.4)",
                background: "#fff",
                color: "#0f172a",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                appearance: "none",
              }}
            >
              {SOLUTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon}  {s.name} ({s.industry})
                </option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#55883B", fontSize: 11 }}>▼</div>
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>{solution.description}</div>
        </div>

        {/* Fleet Size */}
        <div>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#334155", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Fleet / Units
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <button style={stepperBtn} onClick={() => setFleetSize((n) => Math.max(1, n - 1))}>−</button>
            <input
              type="number" min={1} value={fleetSize}
              onChange={(e) => setFleetSize(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: 60, textAlign: "center", padding: "0.45rem 0.4rem", borderRadius: 7, border: "1.5px solid rgba(85,136,59,0.3)", fontSize: 14, fontWeight: 700, background: "#fff" }}
            />
            <button style={stepperBtn} onClick={() => setFleetSize((n) => n + 1)}>+</button>
          </div>
          <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 3 }}>{solution.unitLabel}s</div>
        </div>

        {/* Agreement Length */}
        <div>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#334155", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Agreement (Yrs)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <button style={stepperBtn} onClick={() => setAgreementLength((n) => Math.max(1, n - 1))}>−</button>
            <input
              type="number" min={1} value={agreementLength}
              onChange={(e) => setAgreementLength(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: 60, textAlign: "center", padding: "0.45rem 0.4rem", borderRadius: 7, border: "1.5px solid rgba(85,136,59,0.3)", fontSize: 14, fontWeight: 700, background: "#fff" }}
            />
            <button style={stepperBtn} onClick={() => setAgreementLength((n) => n + 1)}>+</button>
          </div>
          <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 3 }}>Years</div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: 18 }}>

        {/* Filter / Toggle row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "12px 16px 8px",
          flexWrap: "wrap",
          gap: 10,
        }}>
          {/* LEFT: Existing / Suggested toggle */}
          <div style={{
            display: "flex",
            gap: 3,
            background: "rgba(85,136,59,0.12)",
            borderRadius: 10,
            padding: "5px 8px",
            border: "1px solid rgba(85,136,59,0.2)",
          }}>
            {(["Existing", "Suggested"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: viewMode === mode ? "#55883B" : "transparent",
                  color: viewMode === mode ? "#fff" : "#2d6a10",
                  transition: "all 0.15s",
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* RIGHT: Category filter + Sort (only visible in Suggested) */}
          {viewMode === "Suggested" && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 3, background: "rgba(85,136,59,0.12)", borderRadius: 10, padding: "5px 8px", border: "1px solid rgba(85,136,59,0.2)" }}>
                {(["All", "HW", "SW", "CT"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      background: filterCat === cat ? "#55883B" : "transparent",
                      color: filterCat === cat ? "#fff" : "#2d6a10",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat === "All" ? "All" : cat === "HW" ? "Hardware" : cat === "SW" ? "Software" : "Maintenance"}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSortBy((prev) => {
                  if (prev === "default") return "price-asc";
                  if (prev === "price-asc") return "price-desc";
                  if (prev === "price-desc") return "value-desc";
                  return "default";
                })}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(85,136,59,0.3)",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {sortLabel}
              </button>
            </div>
          )}
        </div>

        {/* Table header strip */}
        <div
          style={{
            padding: "8px 16px",
            background: "#55883B",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <span style={{ fontSize: 15 }}>{solution.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {solution.name}: {viewMode === "Existing" ? "Current Installation" : "Component Configuration"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>
              {fleetSize} {solution.unitLabel}{fleetSize !== 1 ? "s" : ""} · {agreementLength}-Yr Agreement
            </div>
          </div>
          {viewMode === "Existing" && (
            <span style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 600,
            }}>
              Current Setup
            </span>
          )}
        </div>

        {/* ── EXISTING TAB ── */}
        {viewMode === "Existing" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {(["Component", "Type", "SKU / Spec Option", "Price / Unit", "Payment Frequency", "Qty", "Amount"] as const).map((h) => (
                    <th key={h} style={{
                      ...thStyle,
                      textAlign: h === "Amount" || h === "Price / Unit" ? "right" : h === "Qty" ? "center" : "left",
                      paddingRight: h === "Price / Unit" ? 24 : undefined,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {existingSlots.map((slot, idx) => {
                  const es = EXISTING_SPECS[solutionId][slot.slotNumber];
                  const { price } = lookupSlot(solutionId, slot.slotNumber, es);
                  const isHW = slot.pricingType === "One-Time";
                  const qty = isHW ? fleetSize : fleetSize;
                  const amount = price * (isHW ? fleetSize : fleetSize);
                  const catColor = CAT_COLORS[slot.category];
                  const typeColor = TYPE_COLORS[slot.pricingType];
                  const rowBg = idx % 2 === 0 ? "#fff" : "rgba(248,250,252,0.6)";
                  const skuKey = `S${solutionId}C${slot.slotNumber}`;
                  const skuName = SKU_NAMES[skuKey]?.[es] ?? es;
                  const genericName = GENERIC_NAMES[solutionId]?.[slot.slotNumber] ?? slot.componentName;

                  const tdBase: React.CSSProperties = {
                    padding: "9px 10px",
                    borderBottom: idx < existingSlots.length - 1 ? "1px solid rgba(148,163,184,0.1)" : "none",
                    verticalAlign: "middle",
                    fontSize: 12,
                    color: "#0f172a",
                    background: rowBg,
                  };

                  return (
                    <tr key={slot.slotNumber}>
                      {/* Component */}
                      <td style={{ ...tdBase, fontWeight: 600 }}>{genericName}</td>
                      {/* Type */}
                      <td style={tdBase}>
                        <span style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}`, borderRadius: 5, padding: "2px 6px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                          {CAT_LABEL[slot.category] ?? slot.category}
                        </span>
                      </td>
                      {/* SKU / Spec Option */}
                      <td style={tdBase}>
                        <div style={{ fontWeight: 600, fontSize: 12, color: "#0f172a" }}>{skuName}</div>
                        <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{es}</div>
                      </td>
                      {/* Price / Unit */}
                      <td style={{ ...tdBase, textAlign: "right", fontWeight: 600, color: "#334155", paddingRight: 24 }}>
                        {fmtCurrency(price)}
                      </td>
                      {/* Payment Frequency */}
                      <td style={tdBase}>
                        <span style={{ background: typeColor.bg, color: typeColor.text, borderRadius: 5, padding: "2px 6px", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {slot.pricingType}
                        </span>
                      </td>
                      {/* Qty */}
                      <td style={{ ...tdBase, textAlign: "center", color: "#64748b", fontWeight: 600 }}>
                        {qty}
                      </td>
                      {/* Amount */}
                      <td style={{ ...tdBase, textAlign: "right", fontWeight: 700 }}>
                        {fmtCurrency(amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f0f7ea" }}>
                  <td colSpan={4} style={{
                    padding: "8px 10px", textAlign: "right",
                    fontWeight: 700, fontSize: 12, color: "#334155",
                    borderTop: "2px solid rgba(85,136,59,0.15)",
                  }}>
                    <span style={{ marginRight: 20 }}>HW Total: <strong style={{ color: "#E65100" }}>{fmtCurrency(exHwTotal)}</strong></span>
                    <span>Annual Recurring: <strong style={{ color: "#1565C0" }}>{fmtCurrency(exAnnualTotal)}/yr</strong></span>
                  </td>
                  <td style={{ borderTop: "2px solid rgba(85,136,59,0.15)", background: "#f0f7ea" }} />
                  <td style={{ borderTop: "2px solid rgba(85,136,59,0.15)", background: "#f0f7ea" }} />
                  <td style={{
                    padding: "8px 10px", fontWeight: 800, color: "#55883B", fontSize: 14,
                    textAlign: "right", borderTop: "2px solid rgba(85,136,59,0.15)",
                    background: "#f0f7ea",
                  }}>
                    {fmtCurrency(exHwTotal + exAnnualTotal)}
                    <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 400 }}>Year-1 Total</div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* ── SUGGESTED TAB ── */}
        {viewMode === "Suggested" && (
          <div style={{ overflowX: "auto" }}>
            {(() => {
              const activeSlots = allSlots.filter((s) => !!(specs[s.slotNumber] ?? ""));
              const avgDisc = activeSlots.length > 0
                ? Math.round(activeSlots.reduce((sum, s) => sum + (discounts[s.slotNumber] ?? 0), 0) / activeSlots.length)
                : 0;

              return (
                <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {(["#", "Component", "Type", "Intervention Type", "SKU / Spec Option", "Price / Unit", "Frequency", "Qty", "Disc %", "Amount"] as const).map((h) => (
                        <th key={h} style={{
                          ...thStyle,
                          textAlign: h === "Amount" || h === "Price / Unit" ? "right" : (h === "Qty" ? "center" : "left"),
                          minWidth: h === "Price / Unit" ? 130 : h === "Frequency" ? 100 : undefined,
                          paddingRight: h === "Price / Unit" ? 24 : undefined,
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot, idx) => {
                      const spec = specs[slot.slotNumber] ?? "";
                      const { price } = spec ? lookupSlot(solutionId, slot.slotNumber, spec) : { price: 0 };
                      const disc = discounts[slot.slotNumber] ?? 0;
                      const isHW = slot.pricingType === "One-Time";
                      const qty = isHW ? fleetSize : agreementLength;
                      const effectiveQty = isHW ? fleetSize : fleetSize * agreementLength;
                      const amount = price * effectiveQty * (1 - disc / 100);
                      const options = DROPDOWN_OPTIONS[`slot${slot.slotNumber}`]?.[solutionId] ?? [];
                      const catColor = CAT_COLORS[slot.category];
                      const typeColor = TYPE_COLORS[slot.pricingType];
                      const rowBg = idx % 2 === 0 ? "#fff" : "rgba(248,250,252,0.6)";
                      const skuKey = `S${solutionId}C${slot.slotNumber}`;
                      const genericName = GENERIC_NAMES[solutionId]?.[slot.slotNumber] ?? slot.componentName;
                      const status = spec ? getComponentStatus(slot.slotNumber, spec) : null;
                      const statusColor = status ? STATUS_COLORS[status] : null;

                      const rules = COMPAT_RULES[solutionId] ?? [];
                      const hasViolation = rules.some((r) => {
                        if (r.requiredSlot !== slot.slotNumber) return false;
                        const reqSlotSpec = specs[r.requirerSlot] ?? "";
                        if (reqSlotSpec !== r.requirerSpec) return false;
                        return !r.minSpecs.includes(spec);
                      });

                      const tdBase: React.CSSProperties = {
                        padding: "8px 10px",
                        borderBottom: idx < slots.length - 1 ? "1px solid rgba(148,163,184,0.1)" : "none",
                        verticalAlign: "middle",
                        fontSize: 12,
                        color: "#0f172a",
                        background: rowBg,
                      };

                      const cleanedOptions = options.filter((opt) => opt !== "None");

                      return (
                        <tr key={slot.slotNumber} style={{ outline: hasViolation ? "2px solid #fbbf24" : "none" }}>
                          {/* # */}
                          <td style={tdBase}>
                            <div style={{
                              width: 26, height: 26, borderRadius: "50%",
                              background: "#55883B",
                              color: "#fff", fontWeight: 700, fontSize: 11,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: "0 2px 5px rgba(85,136,59,0.3)",
                            }}>
                              {slot.slotNumber}
                            </div>
                          </td>
                          {/* Component (generic name) */}
                          <td style={{ ...tdBase, fontWeight: 600, fontSize: 12 }}>{genericName}</td>
                          {/* Type */}
                          <td style={tdBase}>
                            <span style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}`, borderRadius: 5, padding: "2px 6px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                              {CAT_LABEL[slot.category] ?? slot.category}
                            </span>
                          </td>
                          {/* New / Upgrade — dynamic */}
                          <td style={{ ...tdBase, textAlign: "center" }}>
                            {status && statusColor ? (
                              <span style={{
                                display: "inline-block",
                                background: statusColor.bg,
                                color: statusColor.text,
                                border: `1px solid ${statusColor.border}`,
                                borderRadius: 5,
                                padding: "3px 8px",
                                fontSize: 10,
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}>
                                {status}
                              </span>
                            ) : (
                              <span style={{ fontSize: 10, color: "#d0d7de" }}>—</span>
                            )}
                          </td>
                          {/* SKU / Spec dropdown — shows SKU names */}
                          <td style={tdBase}>
                            <select
                              value={spec}
                              onChange={(e) => setSpec(slot.slotNumber, e.target.value)}
                              style={{
                                padding: "5px 8px", borderRadius: 7,
                                border: `1.5px solid ${hasViolation ? "#fbbf24" : "rgba(85,136,59,0.25)"}`,
                                background: spec === "" ? "#fff8ed" : "#f8fafc",
                                fontSize: 11, fontWeight: 500, cursor: "pointer",
                                minWidth: 160, color: "#0f172a",
                              }}
                            >
                              <option value="">None</option>
                              {cleanedOptions.map((opt) => {
                                const data = PRICE_TABLE[skuKey]?.[opt];
                                const skuLabel = SKU_NAMES[skuKey]?.[opt] ?? opt;
                                return (
                                  <option key={opt} value={opt}>
                                    {skuLabel}{data ? ` (${fmtCurrency(data)})` : ""}
                                  </option>
                                );
                              })}
                            </select>
                            {hasViolation && (
                              <div style={{ fontSize: 9, color: "#d97706", marginTop: 2 }}>
                                ⚠ Required by another slot's spec
                              </div>
                            )}
                          </td>
                          {/* Price / Unit */}
                          <td style={{ ...tdBase, textAlign: "right", fontWeight: 600, color: "#334155", minWidth: 130, paddingRight: 24 }}>
                            {spec ? fmtCurrency(price) : "—"}
                          </td>
                          {/* Frequency */}
                          <td style={tdBase}>
                            <span style={{ background: typeColor.bg, color: typeColor.text, borderRadius: 5, padding: "2px 6px", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>
                              {slot.pricingType}
                            </span>
                          </td>
                          {/* Qty */}
                          <td style={{ ...tdBase, color: "#64748b", fontWeight: 600, textAlign: "center" }}>
                            {qty}
                          </td>
                          {/* Disc % */}
                          <td style={tdBase}>
                            {spec ? (
                              <select
                                value={disc}
                                onChange={(e) => setDiscount(slot.slotNumber, parseInt(e.target.value))}
                                style={{
                                  padding: "4px 6px", borderRadius: 7,
                                  border: "1px solid rgba(148,163,184,0.35)",
                                  background: "#f8fafc", fontSize: 11, cursor: "pointer",
                                  color: disc > 0 ? "#55883B" : "#334155",
                                  fontWeight: disc > 0 ? 700 : 400,
                                }}
                              >
                                {[0, 5, 10, 15, 20].map((d) => <option key={d} value={d}>{d}%</option>)}
                              </select>
                            ) : (
                              <span style={{ fontSize: 10, color: "#d0d7de" }}>—</span>
                            )}
                          </td>
                          {/* Amount — blank for Existing status rows */}
                          <td style={{ ...tdBase, textAlign: "right", fontWeight: 700 }}>
                            {spec && status !== "Existing" ? (
                              <span style={{ color: amount > 0 ? "#0f172a" : "#94a3b8" }}>{fmtCurrency(amount)}</span>
                            ) : <span style={{ color: "#d0d7de" }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#f0f7ea" }}>
                      <td colSpan={5} style={{
                        padding: "8px 10px", textAlign: "right",
                        fontWeight: 700, fontSize: 12, color: "#334155",
                        borderTop: "2px solid rgba(85,136,59,0.15)",
                      }}>
                        <span style={{ marginRight: 20 }}>HW : <strong style={{ color: "#E65100" }}>{fmtCurrency(hwAfterDisc)}</strong></span>
                        <span>Annual SW+CT: <strong style={{ color: "#1565C0" }}>{fmtCurrency(annualTotalAfterDisc)}/yr</strong></span>
                      </td>
                      {/* Price / Unit — empty */}
                      <td style={{ borderTop: "2px solid rgba(85,136,59,0.15)", background: "#f0f7ea" }} />
                      {/* Frequency — empty */}
                      <td style={{ borderTop: "2px solid rgba(85,136,59,0.15)", background: "#f0f7ea" }} />
                      {/* Qty — empty */}
                      <td style={{ borderTop: "2px solid rgba(85,136,59,0.15)", background: "#f0f7ea" }} />
                      {/* Disc % */}
                      <td style={{
                        padding: "8px 10px", borderTop: "2px solid rgba(85,136,59,0.15)",
                        background: "#f0f7ea", textAlign: "left",
                      }}>
                        <span style={{
                          display: "inline-block",
                          background: avgDisc > 0 ? "rgba(85,136,59,0.12)" : "rgba(148,163,184,0.1)",
                          color: avgDisc > 0 ? "#2d6a10" : "#64748b",
                          borderRadius: 5, padding: "2px 7px",
                          fontWeight: 700, fontSize: 11,
                        }}>
                          {avgDisc}% avg
                        </span>
                      </td>
                      {/* Amount */}
                      <td style={{
                        padding: "8px 10px", fontWeight: 800, color: "#55883B", fontSize: 14,
                        textAlign: "right", borderTop: "2px solid rgba(85,136,59,0.15)",
                        background: "#f0f7ea",
                      }}>
                        {fmtCurrency(year1)}
                        <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 400 }}>Year-1 Total</div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap", fontSize: 10, color: "#64748b" }}>
        {Object.entries(CAT_COLORS).map(([cat, c]) => (
          <span key={cat} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: c.bg, border: `1px solid ${c.border}`, display: "inline-block" }} />
            <b style={{ color: c.text }}>{cat === "HW" ? "Hardware" : cat === "SW" ? "Software" : "Maintenance Contract"}</b>
            {" = "}{cat === "HW" ? "One-Time cost · Qty = Fleet Units" : "Annual cost · Qty = Agreement Years"}
          </span>
        ))}
        {viewMode === "Suggested" && (
          <>
            <span style={{ color: "#d97706" }}>⚠ Yellow border = compatibility requirement</span>
            <span style={{ display: "flex", gap: 8 }}>
              {(["New", "Upgrade", "Existing"] as const).map((s) => (
                <span key={s} style={{ background: STATUS_COLORS[s].bg, color: STATUS_COLORS[s].text, border: `1px solid ${STATUS_COLORS[s].border}`, borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{s}</span>
              ))}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
