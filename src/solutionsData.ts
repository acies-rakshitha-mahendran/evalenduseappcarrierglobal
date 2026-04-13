// src/solutionsData.ts
// Complete data registry for the 5 solutions, 6 slots, price table, and solution defaults.

export type SolutionId = 1 | 2 | 3 | 4 | 5;

export interface Solution {
  id: SolutionId;
  name: string;
  industry: string;
  description: string;
  unitLabel: string;
  icon: string;
}

export const SOLUTIONS: Solution[] = [
  { id: 1, name: "Truck Refrigeration",          industry: "Cold Chain Fleet",       description: "Supra/X4 direct-drive TRU for straight trucks",          unitLabel: "Truck",      icon: "🚛" },
  { id: 2, name: "Trailer Refrigeration",         industry: "Cold Chain Logistics",   description: "Vector HE/E-Drive trailer TRU for semi-trailers",         unitLabel: "Trailer",    icon: "🚚" },
  { id: 3, name: "Container Refrigeration",       industry: "Maritime Cold Chain",    description: "PrimeLINE/NaturaLINE for shipping containers",             unitLabel: "Container",  icon: "📦" },
  { id: 4, name: "Commercial Building HVAC",      industry: "Commercial Real Estate", description: "VRF/AquaEdge chiller for commercial buildings",            unitLabel: "Building",   icon: "🏢" },
  { id: 5, name: "Food Retail Refrigeration",     industry: "Food Retail",            description: "CO2OLtec refrigeration for supermarkets",                 unitLabel: "Store",      icon: "🏪" },
];

export interface SlotConfig {
  slotNumber: number;
  componentName: string;
  category: "HW" | "SW" | "CT";
  pricingType: "One-Time" | "Annual";
  upgradeType: "Replacement" | "New Addition" | "Contract";
}

export const SLOT_CONFIGS: Record<SolutionId, SlotConfig[]> = {
  1: [
    { slotNumber: 1, componentName: "Truck TRU (Supra/X4)",    category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 2, componentName: "Truck Insulation",         category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 3, componentName: "Truck IoT Sensors",        category: "HW", pricingType: "One-Time", upgradeType: "New Addition" },
    { slotNumber: 4, componentName: "Lynx Fleet Telematics",    category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 5, componentName: "Predictive Maintenance",   category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 6, componentName: "BluEdge Truck",            category: "CT", pricingType: "Annual",   upgradeType: "Contract"     },
  ],
  2: [
    { slotNumber: 1, componentName: "Vector Trailer TRU",       category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 2, componentName: "Trailer Insulation",        category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 3, componentName: "Trailer Sensors",           category: "HW", pricingType: "One-Time", upgradeType: "New Addition" },
    { slotNumber: 4, componentName: "Lynx Fleet Telematics",     category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 5, componentName: "Solar Charging",            category: "HW", pricingType: "One-Time", upgradeType: "New Addition" }, // S2C5 is One-Time
    { slotNumber: 6, componentName: "BluEdge Trailer",           category: "CT", pricingType: "Annual",   upgradeType: "Contract"     },
  ],
  3: [
    { slotNumber: 1, componentName: "Container Reefer Unit",     category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 2, componentName: "XtendFRESH Atmosphere",     category: "HW", pricingType: "One-Time", upgradeType: "New Addition" },
    { slotNumber: 3, componentName: "Container Sensors",         category: "HW", pricingType: "One-Time", upgradeType: "New Addition" },
    { slotNumber: 4, componentName: "Lynx iQ Monitoring",        category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 5, componentName: "Voyage Recording",          category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 6, componentName: "Container Maint",           category: "CT", pricingType: "Annual",   upgradeType: "Contract"     },
  ],
  4: [
    { slotNumber: 1, componentName: "VRF / Chiller System",      category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 2, componentName: "IAQ Sensors",               category: "HW", pricingType: "One-Time", upgradeType: "New Addition" },
    { slotNumber: 3, componentName: "Smart Thermostats",         category: "HW", pricingType: "One-Time", upgradeType: "New Addition" },
    { slotNumber: 4, componentName: "Building Automation",       category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 5, componentName: "Energy Management SW",      category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 6, componentName: "Maintenance Plan",          category: "CT", pricingType: "Annual",   upgradeType: "Contract"     },
  ],
  5: [
    { slotNumber: 1, componentName: "CO2 Condensing Unit",       category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 2, componentName: "Display Cases",             category: "HW", pricingType: "One-Time", upgradeType: "Replacement"  },
    { slotNumber: 3, componentName: "Leak Detection",            category: "HW", pricingType: "One-Time", upgradeType: "New Addition" },
    { slotNumber: 4, componentName: "EMS Controller",            category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 5, componentName: "Store Monitoring",          category: "SW", pricingType: "Annual",   upgradeType: "New Addition" },
    { slotNumber: 6, componentName: "Retail Maint",              category: "CT", pricingType: "Annual",   upgradeType: "Contract"     },
  ],
};

export const DROPDOWN_OPTIONS: Record<string, Record<number, string[]>> = {
  slot1: {
    1: ["Standard", "High-Efficiency", "Variable-Speed"],
    2: ["Single-Temp", "Multi-Temp", "E-Drive"],
    3: ["PrimeLINE", "NaturaLINE", "OptimaLINE"],
    4: ["Standard VRF", "Heat Recovery", "Premium VRF"],
    5: ["Standard HFC", "Transcritical CO2"],
  },
  slot2: {
    1: ["50mm", "75mm", "100mm"],
    2: ["Standard", "Enhanced", "Premium"],
    3: ["None", "Standard CA", "Advanced CA"],
    4: ["Basic IAQ", "Advanced IAQ", "Premium IAQ"],
    5: ["Standard Cases", "Low-Energy Cases"],
  },
  slot3: {
    1: ["Basic Sensors", "Advanced Sensors", "Premium Sensors"],
    2: ["Basic Sensors", "Advanced Sensors", "Premium Sensors"],
    3: ["Basic Probes", "Advanced Probes"],
    4: ["Basic Thermostat", "Smart Thermostat"],
    5: ["None", "Standard Detection", "Advanced Detection"],
  },
  slot4: {
    1: ["Standard", "Professional"],
    2: ["Standard", "Professional"],
    3: ["Standard", "Professional"],
    4: ["Basic BAS", "Advanced BAS"],
    5: ["Basic EMS", "Advanced EMS"],
  },
  slot5: {
    1: ["Standard PM", "Advanced PM"],
    2: ["None", "Solar Kit"],
    3: ["None", "Voyage Log"],
    4: ["Standard EnMgmt", "Advanced EnMgmt"],
    5: ["Standard Monitor", "Pro Monitor"],
  },
  slot6: {
    1: ["Basic Service", "Comprehensive"],
    2: ["Basic Service", "Comprehensive"],
    3: ["Basic Maint", "Comprehensive"],
    4: ["Basic Plan", "Comprehensive"],
    5: ["Basic Maint", "Comprehensive"],
  },
};

export const PRICE_TABLE: Record<string, Record<string, number>> = {
  "S1C1": { "Standard": 18000, "High-Efficiency": 25000, "Variable-Speed": 32000 },
  "S1C2": { "50mm": 5500, "75mm": 7800, "100mm": 10500 },
  "S1C3": { "Basic Sensors": 1600, "Advanced Sensors": 2800, "Premium Sensors": 4200 },
  "S1C4": { "Standard": 1200, "Professional": 2400 },
  "S1C5": { "Standard PM": 1000, "Advanced PM": 1800 },
  "S1C6": { "Basic Service": 1500, "Comprehensive": 2800 },

  "S2C1": { "Single-Temp": 35000, "Multi-Temp": 48000, "E-Drive": 62000 },
  "S2C2": { "Standard": 8000, "Enhanced": 12000, "Premium": 18000 },
  "S2C3": { "Basic Sensors": 2200, "Advanced Sensors": 3800, "Premium Sensors": 5600 },
  "S2C4": { "Standard": 1200, "Professional": 2400 },
  "S2C5": { "None": 0, "Solar Kit": 3200 },
  "S2C6": { "Basic Service": 2000, "Comprehensive": 3800 },

  "S3C1": { "PrimeLINE": 12000, "NaturaLINE": 16000, "OptimaLINE": 22000 },
  "S3C2": { "None": 0, "Standard CA": 4500, "Advanced CA": 7800 },
  "S3C3": { "Basic Probes": 1800, "Advanced Probes": 3200 },
  "S3C4": { "Standard": 800, "Professional": 1800 },
  "S3C5": { "None": 0, "Voyage Log": 600 },
  "S3C6": { "Basic Maint": 1200, "Comprehensive": 2400 },

  "S4C1": { "Standard VRF": 85000, "Heat Recovery": 120000, "Premium VRF": 165000 },
  "S4C2": { "Basic IAQ": 8000, "Advanced IAQ": 18000, "Premium IAQ": 32000 },
  "S4C3": { "Basic Thermostat": 5000, "Smart Thermostat": 12000 },
  "S4C4": { "Basic BAS": 4800, "Advanced BAS": 9600 },
  "S4C5": { "Standard EnMgmt": 3600, "Advanced EnMgmt": 7200 },
  "S4C6": { "Basic Plan": 6000, "Comprehensive": 14000 },

  "S5C1": { "Standard HFC": 45000, "Transcritical CO2": 72000 },
  "S5C2": { "Standard Cases": 28000, "Low-Energy Cases": 42000 },
  "S5C3": { "None": 0, "Standard Detection": 3500, "Advanced Detection": 6800 },
  "S5C4": { "Basic EMS": 2400, "Advanced EMS": 5400 },
  "S5C5": { "Standard Monitor": 1800, "Pro Monitor": 3600 },
  "S5C6": { "Basic Maint": 4000, "Comprehensive": 8500 },
};

// Default spec selection per solution per slot (mid-tier)
export const DEFAULT_SPECS: Record<SolutionId, Record<number, string>> = {
  1: { 1: "High-Efficiency",   2: "75mm",           3: "Advanced Sensors", 4: "Professional",    5: "Advanced PM",      6: "Comprehensive" },
  2: { 1: "Multi-Temp",        2: "Enhanced",        3: "Advanced Sensors", 4: "Professional",    5: "None",             6: "Comprehensive" },
  3: { 1: "NaturaLINE",        2: "Standard CA",     3: "Advanced Probes",  4: "Professional",    5: "None",             6: "Comprehensive" },
  4: { 1: "Heat Recovery",     2: "Advanced IAQ",    3: "Smart Thermostat", 4: "Advanced BAS",    5: "Advanced EnMgmt",  6: "Comprehensive" },
  5: { 1: "Transcritical CO2", 2: "Low-Energy Cases",3: "Standard Detection",4: "Advanced EMS",   5: "Pro Monitor",      6: "Comprehensive" },
};

// Default customer input values per solution (D8-D29)
export const SOLUTION_DEFAULTS: Record<SolutionId, Record<string, number>> = {
  1: { D8: 5,  D9: 5, D10: 18000,   D11: 4200,   D12: 250000,   D13: 5,  D14: 1500,  D15: 60, D16: 72, D17: 6,  D18: 45, D19: 22000, D20: 25000,  D21: 8,  D22: 3600, D23: 4, D24: 800,  D25: 3200,  D26: 12, D27: 50, D28: 500000,   D29: 3000  },
  2: { D8: 10, D9: 5, D10: 24000,   D11: 5500,   D12: 350000,   D13: 4,  D14: 2000,  D15: 50, D16: 60, D17: 5,  D18: 45, D19: 28000, D20: 40000,  D21: 10, D22: 4800, D23: 3, D24: 1200, D25: 4500,  D26: 16, D27: 50, D28: 700000,   D29: 5000  },
  3: { D8: 20, D9: 5, D10: 8000,    D11: 3000,   D12: 800000,   D13: 3,  D14: 5000,  D15: 40, D16: 48, D17: 4,  D18: 50, D19: 15000, D20: 15000,  D21: 12, D22: 2000, D23: 2, D24: 2000, D25: 6000,  D26: 8,  D27: 50, D28: 1200000,  D29: 8000  },
  4: { D8: 1,  D9: 5, D10: 120000,  D11: 25000,  D12: 0,        D13: 0,  D14: 8000,  D15: 30, D16: 40, D17: 8,  D18: 55, D19: 0,     D20: 100000, D21: 15, D22: 0,    D23: 6, D24: 500,  D25: 12000, D26: 45, D27: 50, D28: 500000,   D29: 20000 },
  5: { D8: 3,  D9: 5, D10: 95000,   D11: 18000,  D12: 2000000,  D13: 2,  D14: 15000, D15: 25, D16: 30, D17: 10, D18: 40, D19: 0,     D20: 60000,  D21: 12, D22: 0,    D23: 8, D24: 300,  D25: 8000,  D26: 35, D27: 50, D28: 3000000,  D29: 10000 },
};

/** Derive per-unit price and value for a given solution/slot/spec combo */
export function lookupSlot(solutionId: SolutionId, slotNumber: number, spec: string): { price: number } {
  const key = `S${solutionId}C${slotNumber}`;
  return { price: PRICE_TABLE[key]?.[spec] ?? 0 };
}

export const SOLUTION_SCALE: Record<SolutionId, number> = {
  1: 0.99,
  2: 1.09,
  3: 0.49,
  4: 1.56,
  5: 1.14,
};
