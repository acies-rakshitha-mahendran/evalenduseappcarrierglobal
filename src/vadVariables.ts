// src/vadVariables.ts
// Default variable values for the 14 new VADs.
// Used as fallback defaults in InputsRenderer when no user value has been entered yet.
// Field indices MUST match the field order in vadInputs.ts exactly.

export interface VADVariable {
  label: string;
  defaultValue: number;
  defaultUOM: string;
  owner?: string;
  isUserInput: boolean;
  inputFieldIndex?: number;
}

export const VAD_VARIABLES: Record<string, VADVariable[]> = {

  "Reduced Energy and Fuel Costs": [
    { label: "Annual Energy Cost / Unit",      defaultValue: 18000,  defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
  ],

  "Product Loss Prevention": [
    { label: "Cargo / Product Value / Unit",   defaultValue: 250000, defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Current Spoilage Rate",          defaultValue: 5,      defaultUOM: "%",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 2 },
  ],

  "Revenue Protected from Downtime": [
    { label: "Downtime Cost / Hour",           defaultValue: 1500,   defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
    { label: "Breakdown Probability / Year",   defaultValue: 60,     defaultUOM: "%",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 2 },
  ],

  "Workforce Productivity": [
    { label: "Staff Cost / Hour",              defaultValue: 45,     defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
  ],

  "Operator Error Reduction": [
    { label: "Error Incidents / Unit / Year",  defaultValue: 4,      defaultUOM: "incidents",owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Cost per Error Incident",        defaultValue: 800,    defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 2 },
  ],

  "Compliance and Penalty Avoidance": [
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
  ],

  "Insurance Premium Reduction": [
    { label: "Insurance Premium / Unit",       defaultValue: 3200,   defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
  ],

  "Competitive Win Rate": [
    { label: "Revenue / Unit",                 defaultValue: 500000, defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
  ],

  "Customer SLA Compliance": [
    { label: "SLA Penalties / Unit",           defaultValue: 3000,   defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
  ],

  "Equipment Life Extension": [
    { label: "Equipment Replacement Cost",     defaultValue: 25000,  defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Equipment Life",                 defaultValue: 8,      defaultUOM: "years",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 2 },
  ],

  "Fleet / Building Utilization": [
    { label: "Route / Ops Cost / Unit",        defaultValue: 22000,  defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
  ],

  "Carbon Emissions Reduction": [
    { label: "CO2 Emissions / Unit / Year",    defaultValue: 12,     defaultUOM: "tons",     owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Carbon Credit Value / Ton",      defaultValue: 50,     defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 2 },
  ],

  "Refrigerant Leak Prevention": [
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
  ],

  "Energy Intensity Reduction": [
    { label: "Compressor Energy / Unit",       defaultValue: 4200,   defaultUOM: "$",        owner: "End Customer", isUserInput: true,  inputFieldIndex: 0 },
    { label: "Fleet / Unit Count",             defaultValue: 5,      defaultUOM: "units",    owner: "End Customer", isUserInput: true,  inputFieldIndex: 1 },
  ],
};
