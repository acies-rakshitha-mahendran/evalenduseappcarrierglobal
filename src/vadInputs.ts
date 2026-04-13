// src/vadInputs.ts
// 14 VADs from the eVal specification.
// Each VAD has:
//   owner "End Customer" fields  → shown in the input form (user fills these in)
//   owner "Client" fields        → hidden; pre-filled static multipliers
//
// Field index order is critical — PresentApp.ts calculation formulas reference
// fields by index (f[0], f[1], ...).
//
// Variable codes map to spec:
//   D8  = Fleet/Unit Count
//   D9  = Agreement Length
//   D10 = Annual Energy Cost / Unit
//   D11 = Compressor Energy / Unit
//   D12 = Cargo / Product Value / Unit
//   D13 = Current Spoilage Rate (%)
//   D14 = Downtime Cost / Hour
//   D15 = Breakdown Probability / Unit / Year (%)
//   D18 = Staff Cost / Hour
//   D19 = Route / Ops Cost / Unit
//   D20 = Equipment Replacement Cost
//   D21 = Equipment Life (years)
//   D23 = Error Incidents / Unit / Year
//   D24 = Cost per Error Incident
//   D25 = Insurance Premium / Unit
//   D26 = CO2 Emissions / Unit / Year (tons)
//   D27 = Carbon Credit Value / Ton ($50 static default)
//   D28 = Revenue / Unit
//   D29 = SLA Penalties / Unit

export type InputFieldType = "number" | "text" | "dropdown";

export interface InputField {
  label: string;
  type: InputFieldType;
  placeholder?: string;
  defaultValue?: string | number;
  options?: string[];
  defaultUOM?: string;
  owner?: string;   // "End Customer" = shown; anything else = hidden with default
  description?: string;
}

export interface VADInputConfig {
  vadName: string;
  fields: InputField[];
}

export const VAD_INPUT_CONFIGS: Record<string, VADInputConfig> = {

  // ─── 1. Reduced Energy and Fuel Costs ────────────────────────────────────────
  // Formula: D10 * 0.25 * D8
  // Activation: Slot1 > 0 AND Slot2 > 0
  "Reduced Energy and Fuel Costs": {
    vadName: "Reduced Energy and Fuel Costs",
    fields: [
      // f[0] – D10
      { label: "Annual Energy Cost / Unit", type: "number", placeholder: "e.g. 18000", defaultValue: 18000, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Total annual energy cost (fuel/electricity) for each unit." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units in the fleet." },
    ],
  },

  // ─── 2. Product Loss Prevention ──────────────────────────────────────────────
  // Formula: D12 * (D13/100) * 0.60 * D8
  // Activation: Slot3 > 0
  "Product Loss Prevention": {
    vadName: "Product Loss Prevention",
    fields: [
      // f[0] – D12
      { label: "Cargo / Product Value / Unit", type: "number", placeholder: "e.g. 250000", defaultValue: 250000, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Total value of temperature-sensitive product per unit per year." },
      // f[1] – D13
      { label: "Current Spoilage Rate", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["%", "Number"], defaultUOM: "%", owner: "End Customer", description: "Percentage of product currently lost to spoilage or temperature excursions." },
      // f[2] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 3. Revenue Protected from Downtime ──────────────────────────────────────
  // Formula: D14 * 24 * D8 * (D15/100)
  // Activation: Slot5 > 0
  "Revenue Protected from Downtime": {
    vadName: "Revenue Protected from Downtime",
    fields: [
      // f[0] – D14
      { label: "Downtime Cost / Hour", type: "number", placeholder: "e.g. 1500", defaultValue: 1500, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Revenue loss and cost for each hour a unit is out of service." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
      // f[2] – D15
      { label: "Breakdown Probability / Unit / Year", type: "number", placeholder: "e.g. 60", defaultValue: 60, options: ["%", "Number"], defaultUOM: "%", owner: "End Customer", description: "Probability that any single unit suffers a major breakdown per year." },
    ],
  },

  // ─── 4. Workforce Productivity ───────────────────────────────────────────────
  // Formula: (4 * 52) * D18 * D8
  // Activation: Slot6 > 0
  "Workforce Productivity": {
    vadName: "Workforce Productivity",
    fields: [
      // f[0] – D18
      { label: "Staff Cost / Hour", type: "number", placeholder: "e.g. 45", defaultValue: 45, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Fully loaded hourly cost for compliance and operational staff." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 5. Operator Error Reduction ─────────────────────────────────────────────
  // Formula: D23 * D24 * 0.60 * D8
  // Activation: Slot3 > 0
  "Operator Error Reduction": {
    vadName: "Operator Error Reduction",
    fields: [
      // f[0] – D23
      { label: "Error Incidents / Unit / Year", type: "number", placeholder: "e.g. 4", defaultValue: 4, options: ["incidents", "Number"], defaultUOM: "incidents", owner: "End Customer", description: "Number of operator errors per unit per year." },
      // f[1] – D24
      { label: "Cost per Error Incident", type: "number", placeholder: "e.g. 800", defaultValue: 800, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Average cost per error incident including rework, spoilage, and penalties." },
      // f[2] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 6. Compliance and Penalty Avoidance ─────────────────────────────────────
  // Formula: 5000 * D8
  // Activation: Slot4 > 0 AND Slot6 > 0
  "Compliance and Penalty Avoidance": {
    vadName: "Compliance and Penalty Avoidance",
    fields: [
      // f[0] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 7. Insurance Premium Reduction ──────────────────────────────────────────
  // Formula: D25 * 0.08 * D8
  // Activation: Slot3 > 0 AND Slot4 > 0
  "Insurance Premium Reduction": {
    vadName: "Insurance Premium Reduction",
    fields: [
      // f[0] – D25
      { label: "Insurance Premium / Unit", type: "number", placeholder: "e.g. 3200", defaultValue: 3200, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Current annual insurance premium per unit." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 8. Competitive Win Rate ──────────────────────────────────────────────────
  // Formula: D28 * 0.03 * D8
  // Activation: Slot4 > 0
  "Competitive Win Rate": {
    vadName: "Competitive Win Rate",
    fields: [
      // f[0] – D28
      { label: "Revenue / Unit", type: "number", placeholder: "e.g. 500000", defaultValue: 500000, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Annual revenue generated per unit (truck/container/building/store)." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 9. Customer SLA Compliance ──────────────────────────────────────────────
  // Formula: D29 * 0.60 * D8
  // Activation: Slot3 > 0 AND Slot4 > 0
  "Customer SLA Compliance": {
    vadName: "Customer SLA Compliance",
    fields: [
      // f[0] – D29
      { label: "SLA Penalties / Unit", type: "number", placeholder: "e.g. 3000", defaultValue: 3000, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Annual SLA penalty exposure per unit." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 10. Equipment Life Extension ────────────────────────────────────────────
  // Formula: D20 * (0.20 / D21) * D8
  // Activation: Slot5 > 0
  "Equipment Life Extension": {
    vadName: "Equipment Life Extension",
    fields: [
      // f[0] – D20
      { label: "Equipment Replacement Cost", type: "number", placeholder: "e.g. 25000", defaultValue: 25000, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Full purchase price for a replacement unit." },
      // f[1] – D21
      { label: "Equipment Life", type: "number", placeholder: "e.g. 8", defaultValue: 8, options: ["years", "Number"], defaultUOM: "years", owner: "End Customer", description: "Current expected operational life of a unit without predictive maintenance." },
      // f[2] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 11. Fleet / Building Utilization ────────────────────────────────────────
  // Formula: D19 * 0.12 * D8   (returns 0 if D19 = 0 — e.g. S4, S5)
  // Activation: Slot4 > 0
  "Fleet / Building Utilization": {
    vadName: "Fleet / Building Utilization",
    fields: [
      // f[0] – D19
      { label: "Route / Ops Cost / Unit", type: "number", placeholder: "e.g. 22000", defaultValue: 22000, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Annual route planning, dispatch, and operations cost per unit. Enter 0 for buildings/stores with no route cost." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 12. Carbon Emissions Reduction ──────────────────────────────────────────
  // Formula: D26 * 0.25 * D27 * D8
  // Activation: Slot1 > 0
  "Carbon Emissions Reduction": {
    vadName: "Carbon Emissions Reduction",
    fields: [
      // f[0] – D26
      { label: "CO2 Emissions / Unit / Year", type: "number", placeholder: "e.g. 12", defaultValue: 12, options: ["tons", "Number"], defaultUOM: "tons", owner: "End Customer", description: "Annual CO2 equivalent emissions per unit (from fuel records)." },
      // f[1] – D27
      { label: "Carbon Credit Value / Ton", type: "number", placeholder: "e.g. 50", defaultValue: 50, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Market value per ton of CO2 credits. Default is $50/ton." },
      // f[2] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },

  // ─── 13. Refrigerant Leak Prevention ─────────────────────────────────────────
  // Formula: 2000 * D8
  // Activation: Slot3 > 0
  "Refrigerant Leak Prevention": {
    vadName: "Refrigerant Leak Prevention",
    fields: [
      // f[0] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units. Estimated $2,000 avoided refrigerant loss per unit per year." },
    ],
  },

  // ─── 14. Energy Intensity Reduction ──────────────────────────────────────────
  // Formula: D11 * 0.15 * D8
  // Activation: Slot1 > 0 AND Slot2 > 0
  "Energy Intensity Reduction": {
    vadName: "Energy Intensity Reduction",
    fields: [
      // f[0] – D11
      { label: "Compressor Energy / Unit", type: "number", placeholder: "e.g. 4200", defaultValue: 4200, options: ["$", "Number"], defaultUOM: "$", owner: "End Customer", description: "Annual electricity cost for compressor operation per unit." },
      // f[1] – D8
      { label: "Fleet / Unit Count", type: "number", placeholder: "e.g. 5", defaultValue: 5, options: ["units", "Number"], defaultUOM: "units", owner: "End Customer", description: "Total number of units." },
    ],
  },
};
