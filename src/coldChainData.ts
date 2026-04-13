// src/coldChainData.ts
// All cold chain decision engine data models, constants, and lookup functions

export interface ComponentOption {
  value: string;
  price: number;
  valuePerTruck: number;
  performance: string;
}

export interface ColdChainComponent {
  id: string;
  name: string;
  category: 'Hardware' | 'Software' | 'Contract';
  upgradeType: string;
  pricingType: 'One-Time' | 'Annual';
  oldSystem: string;
  newSystem: string;
  mappedFactors: number[];
  priority: string;
  options: ComponentOption[];
}

export const COMPONENTS: ColdChainComponent[] = [
  {
    id: 'tru',
    name: 'Transport Refrigeration Unit (TRU)',
    category: 'Hardware',
    upgradeType: 'Replacement',
    pricingType: 'One-Time',
    oldSystem: 'Legacy fixed-speed diesel TRU',
    newSystem: 'Variable-speed TRU replaces existing unit',
    mappedFactors: [1, 2, 4, 7],
    priority: 'Critical',
    options: [
      { value: 'Standard',       price: 18000, valuePerTruck: 3800,  performance: '10% fuel saving' },
      { value: 'High-Efficiency', price: 25000, valuePerTruck: 8400,  performance: '25% fuel saving' },
      { value: 'Variable-Speed',  price: 32000, valuePerTruck: 12800, performance: '35% fuel saving, best stability' },
    ],
  },
  {
    id: 'insulation',
    name: 'Insulation Panels and Door Seals',
    category: 'Hardware',
    upgradeType: 'Replacement',
    pricingType: 'One-Time',
    oldSystem: 'Aged foam R-25, worn rubber seals',
    newSystem: 'New PUR panels and seals replace old',
    mappedFactors: [1, 2, 4, 7],
    priority: 'Critical',
    options: [
      { value: '50mm',  price: 5500,  valuePerTruck: 2400, performance: '+20min hold, R-30' },
      { value: '75mm',  price: 7800,  valuePerTruck: 4900, performance: '+35min hold, R-35' },
      { value: '100mm', price: 10500, valuePerTruck: 7600, performance: '+50min hold, R-38+' },
    ],
  },
  {
    id: 'sensors',
    name: 'IoT Sensor and Monitoring Kit',
    category: 'Hardware',
    upgradeType: 'New Addition',
    pricingType: 'One-Time',
    oldSystem: 'Single analog thermostat, no door sensor',
    newSystem: 'Multi-zone digital probes, BLE door switches added',
    mappedFactors: [1, 4, 5, 8, 9],
    priority: 'High',
    options: [
      { value: 'Basic',    price: 1600, valuePerTruck: 1200, performance: '2-zone, 40% coverage' },
      { value: 'Advanced', price: 2800, valuePerTruck: 3000, performance: '4-zone, 75%, door sensors' },
      { value: 'Premium',  price: 4200, valuePerTruck: 4800, performance: '8-zone, 95%, full BLE mesh' },
    ],
  },
  {
    id: 'electricStandby',
    name: 'Electric Standby Kit',
    category: 'Hardware',
    upgradeType: 'New Addition',
    pricingType: 'One-Time',
    oldSystem: 'Diesel-only TRU operation at depot',
    newSystem: 'Plug-in mains power at depot added',
    mappedFactors: [2, 7],
    priority: 'High',
    options: [
      { value: 'None',     price: 0,    valuePerTruck: 0,    performance: 'No standby' },
      { value: 'Standard', price: 4200, valuePerTruck: 1800, performance: 'Basic plug-in' },
      { value: 'Advanced', price: 6800, valuePerTruck: 2900, performance: 'Full hybrid with auto-switch' },
    ],
  },
  {
    id: 'driverHMI',
    name: 'Driver HMI Panel (IntelliSet)',
    category: 'Hardware',
    upgradeType: 'Replacement',
    pricingType: 'One-Time',
    oldSystem: 'Simple analog controller, manual setpoint',
    newSystem: 'Digital presets, lockouts, guided workflows',
    mappedFactors: [9],
    priority: 'Medium',
    options: [
      { value: 'Analog',  price: 0,    valuePerTruck: 0,    performance: 'No change' },
      { value: 'Digital', price: 1800, valuePerTruck: 1600, performance: 'Presets, lockouts, guided workflows' },
    ],
  },
  {
    id: 'telematics',
    name: 'Fleet Telematics Platform',
    category: 'Software',
    upgradeType: 'New Addition',
    pricingType: 'Annual',
    oldSystem: 'No telematics or basic standalone logger',
    newSystem: 'Cloud dashboard with GPS, alerts, TMS APIs added',
    mappedFactors: [5, 6, 8, 9],
    priority: 'Critical',
    options: [
      { value: 'Standard',     price: 1200, valuePerTruck: 1500, performance: 'Basic alerts, GPS' },
      { value: 'Professional', price: 2400, valuePerTruck: 3800, performance: 'Full dashboard, route opt, TMS APIs' },
    ],
  },
  {
    id: 'routeOptimization',
    name: 'Route Optimization Module',
    category: 'Software',
    upgradeType: 'New Addition',
    pricingType: 'Annual',
    oldSystem: 'Manual route planning',
    newSystem: 'AI-optimized routing based on load, weather, traffic',
    mappedFactors: [2, 6],
    priority: 'High',
    options: [
      { value: 'None',     price: 0,    valuePerTruck: 0,    performance: 'No route optimization' },
      { value: 'Standard', price: 800,  valuePerTruck: 1100, performance: 'Basic optimization' },
      { value: 'Advanced', price: 1500, valuePerTruck: 2200, performance: 'AI routing + weather + traffic' },
    ],
  },
  {
    id: 'predictiveMaintenance',
    name: 'Predictive Maintenance Engine',
    category: 'Software',
    upgradeType: 'New Addition',
    pricingType: 'Annual',
    oldSystem: 'Time-based PM, reactive repairs only',
    newSystem: 'ML health scoring, failure prediction, auto scheduling',
    mappedFactors: [3, 6],
    priority: 'High',
    options: [
      { value: 'Standard', price: 1000, valuePerTruck: 2500, performance: 'Basic health scoring' },
      { value: 'Advanced', price: 1800, valuePerTruck: 5400, performance: 'Full ML prediction' },
    ],
  },
  {
    id: 'maintenanceContract',
    name: 'Maintenance and Compliance Contract',
    category: 'Contract',
    upgradeType: 'New Addition',
    pricingType: 'Annual',
    oldSystem: 'Ad-hoc repairs, manual paper logs',
    newSystem: 'Quarterly PM, 12hr SLA, digital compliance',
    mappedFactors: [3, 5],
    priority: 'High',
    options: [
      { value: 'Basic',         price: 1500, valuePerTruck: 1500, performance: 'Quarterly PM, 48hr response' },
      { value: 'Comprehensive', price: 2800, valuePerTruck: 3700, performance: 'Quarterly PM, 12hr SLA, digital compliance' },
    ],
  },
  {
    id: 'complianceDocs',
    name: 'Compliance Documentation Package',
    category: 'Contract',
    upgradeType: 'New Addition',
    pricingType: 'Annual',
    oldSystem: 'No formal mapping or one-off tests',
    newSystem: 'Validation runs, SOPs, route-based setup added',
    mappedFactors: [5, 8],
    priority: 'Medium',
    options: [
      { value: 'None',  price: 0,   valuePerTruck: 0,    performance: 'No documentation' },
      { value: 'Basic', price: 400, valuePerTruck: 600,  performance: 'Basic SOPs' },
      { value: 'Full',  price: 900, valuePerTruck: 1400, performance: 'Full validation + route mapping' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Value Accrual Drivers
// ---------------------------------------------------------------------------
export interface VADVariable {
  key: string;
  label: string;
  unit: string;
  source: string;
  given: boolean; // true = customer input, false = derived from config
}

export interface ValueDriver {
  id: string;
  name: string;
  category: string;
  dimension: string;
  description: string;
  variables: VADVariable[];
  derivedVariables: { key: string; label: string; source: string; given: false }[];
  expression: string;
  weight: number;
}

export const VALUE_DRIVERS: ValueDriver[] = [
  {
    id: 'vd_energy',
    name: 'Energy Cost Reduction',
    category: 'Decreased Resource Consumption',
    dimension: 'Operational Cost Savings',
    description:
      'Reduced fuel and electricity consumption from an efficient variable-speed TRU and better insulation that cuts compressor run-time. Fuel is typically the largest single OPEX line for cold chain fleets.',
    variables: [
      { key: 'annualFuelCostPerTruck', label: 'Current Annual Fuel Cost per Truck', unit: '$', source: 'Company Fleet Operations Records', given: true },
      { key: 'annualCompressorCostPerTruck', label: 'Current Annual Compressor Energy Cost per Truck', unit: '$', source: 'Company Utility / Fuel Records', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'truFuelReduction', label: 'TRU Fuel Reduction %', source: 'From TRU component config', given: false },
      { key: 'insulationReduction', label: 'Insulation Heat Gain Reduction %', source: 'From Insulation component config', given: false },
    ],
    expression: '(annualFuelCostPerTruck × truFuelReduction + annualCompressorCostPerTruck × insulationReduction) × fleetSize',
    weight: 0.15,
  },
  {
    id: 'vd_depot',
    name: 'Depot Energy Savings',
    category: 'Decreased Resource Consumption',
    dimension: 'Operational Cost Savings',
    description:
      'Electric standby kit replaces diesel-powered TRU operation at depots during loading and parking. Eliminates 50-67% of depot fuel costs and reduces noise and emissions at facility.',
    variables: [
      { key: 'annualDepotDieselPerTruck', label: 'Annual Depot Diesel Cost for TRU per Truck', unit: '$', source: 'Company Fuel Records', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'standbyPct', label: 'Electric Standby Saving %', source: 'From Electric Standby config', given: false },
    ],
    expression: 'annualDepotDieselPerTruck × standbyPct × fleetSize',
    weight: 0.05,
  },
  {
    id: 'vd_spoilage',
    name: 'Reduced Product Spoilage',
    category: 'Operational Efficiency',
    dimension: 'Direct Cost Savings',
    description:
      'Lower batch spoilage rate from superior temperature control across zones, multi-zone monitoring that detects hot spots, and rapid door recovery that minimizes warm air infiltration at delivery stops.',
    variables: [
      { key: 'annualCargoValuePerTruck', label: 'Annual Cargo Value per Truck', unit: '$', source: 'Financial Records / Cargo Manifests', given: true },
      { key: 'currentSpoilageRate', label: 'Current Spoilage Rate', unit: '%', source: 'Quality Control Records / Production Logs', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'postUpgradeSpoilage', label: 'Post-Upgrade Spoilage Rate', source: 'From Sensor config', given: false },
    ],
    expression: 'annualCargoValuePerTruck × (currentSpoilageRate - postUpgradeSpoilage) × fleetSize',
    weight: 0.15,
  },
  {
    id: 'vd_downtime',
    name: 'Avoided Fleet Downtime',
    category: 'Risk Management',
    dimension: 'Revenue Protection',
    description:
      'Avoided revenue loss and spoilage from unscheduled truck breakdowns. Predictive maintenance identifies failures before they happen, reducing mean time to repair. Value is probability-weighted by historical breakdown frequency.',
    variables: [
      { key: 'downtimeCostPerHour', label: 'Cost of Downtime per Hour (revenue + spoilage)', unit: '$', source: 'Financial and Operational Analysis', given: true },
      { key: 'breakdownProbability', label: 'Probability of Major Breakdown per Truck per Year', unit: '%', source: 'Historical Reliability Data', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'hoursAvoided', label: 'Downtime Hours Avoided per Truck per Year', source: 'From Predictive Maintenance config', given: false },
    ],
    expression: 'downtimeCostPerHour × hoursAvoided × fleetSize × breakdownProbability',
    weight: 0.12,
  },
  {
    id: 'vd_compliance',
    name: 'Reduced Compliance and Reporting Labor',
    category: 'Employee Productivity',
    dimension: 'Labor Cost Savings',
    description:
      'Automated environmental data logging replaces manual paper-based compliance processes. Reduces weekly hours spent on temperature recording, report generation, and audit preparation for regulatory requirements (FDA, FSSAI, HACCP).',
    variables: [
      { key: 'complianceStaffCostPerHour', label: 'Fully Loaded Cost per Hour for Compliance Staff', unit: '$', source: 'HR / Payroll Records', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'hoursReplacedPerWeek', label: 'Manual Hours per Week Replaced by Automation', source: 'From Maintenance Contract config', given: false },
    ],
    expression: '(hoursReplacedPerWeek × 52) × complianceStaffCostPerHour × fleetSize',
    weight: 0.08,
  },
  {
    id: 'vd_audit',
    name: 'Audit Readiness and Avoided Penalties',
    category: 'Compliance',
    dimension: 'Risk Mitigation',
    description:
      'Standardized validation documentation, SOPs, and automated logging reduce audit preparation time and avoid non-compliance penalties, product recalls, and lost certifications. Critical for pharma and food cold chains.',
    variables: [
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'avoidedAuditCost', label: 'Avoided Audit/Penalty Cost per Truck per Year', source: 'From Compliance Docs config', given: false },
    ],
    expression: 'avoidedAuditCost × fleetSize',
    weight: 0.05,
  },
  {
    id: 'vd_fleet',
    name: 'Fleet Utilization and Route Efficiency',
    category: 'Operational Efficiency',
    dimension: 'Productivity Gains',
    description:
      'Combined benefit of telematics-driven dispatch optimization and AI route planning. Reduces empty miles, fuel waste, manual coordination overhead, and enables more deliveries per shift through smarter sequencing.',
    variables: [
      { key: 'annualRouteCostPerTruck', label: 'Annual Route and Dispatch Cost per Truck', unit: '$', source: 'Fleet Operations Records', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'telematicsEff', label: 'Telematics Efficiency Improvement %', source: 'From Telematics config', given: false },
      { key: 'routeOptEff', label: 'Route Optimization Efficiency %', source: 'From Route Opt config', given: false },
    ],
    expression: 'annualRouteCostPerTruck × (telematicsEff + routeOptEff) × fleetSize',
    weight: 0.10,
  },
  {
    id: 'vd_lifespan',
    name: 'Extended Equipment Lifespan',
    category: 'Capital Preservation',
    dimension: 'Deferred CAPEX',
    description:
      'Predictive maintenance extends TRU operational life by identifying wear patterns early, scheduling proactive service, and preventing cascading failures. Defers the capital expense of full TRU replacement.',
    variables: [
      { key: 'truReplacementCost', label: 'TRU Replacement Cost', unit: '$', source: 'Carrier Product Price List', given: true },
      { key: 'currentTruLife', label: 'Current TRU Useful Life', unit: 'years', source: 'Industry Benchmark / OEM Data', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'lifeExtensionPct', label: 'Expected Life Extension %', source: 'From Predictive Maintenance config', given: false },
    ],
    expression: 'truReplacementCost × (lifeExtensionPct / currentTruLife) × fleetSize',
    weight: 0.07,
  },
  {
    id: 'vd_driver',
    name: 'Reduced Driver Error Costs',
    category: 'Safety and Risk Management',
    dimension: 'Error Reduction',
    description:
      'Digital HMI panel with commodity presets, temperature lockouts, and guided workflows reduces operator errors such as mis-set temperatures, incorrect defrost cycles, and wrong setpoint selections that lead to spoilage and re-delivery costs.',
    variables: [
      { key: 'driverErrorIncidentsPerTruck', label: 'Driver Error Incidents per Truck per Year', unit: 'incidents', source: 'Incident Reports / Operations Logs', given: true },
      { key: 'costPerDriverErrorIncident', label: 'Average Cost per Driver Error Incident', unit: '$', source: 'Financial Analysis (spoilage + re-delivery + penalty)', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'errorReductionPct', label: 'Error Reduction % from Digital HMI', source: 'From Driver HMI config', given: false },
    ],
    expression: 'driverErrorIncidentsPerTruck × costPerDriverErrorIncident × errorReductionPct × fleetSize',
    weight: 0.08,
  },
  {
    id: 'vd_insurance',
    name: 'Insurance Premium Reduction',
    category: 'Safety and Risk Management',
    dimension: 'Premium Savings',
    description:
      'Real-time temperature monitoring, compliance documentation, and predictive maintenance create a verifiable risk reduction profile that qualifies for cargo insurance premium discounts. Higher reduction (12%) when both advanced sensors and professional telematics are selected.',
    variables: [
      { key: 'annualInsurancePremiumPerTruck', label: 'Annual Insurance Premium per Truck', unit: '$', source: 'Insurance Policy Records', given: true },
      { key: 'fleetSize', label: 'Fleet Size (trucks)', unit: 'trucks', source: 'Customer Input', given: true },
    ],
    derivedVariables: [
      { key: 'premiumReductionPct', label: 'Insurance Premium Reduction %', source: 'Conditional: 5% basic, 12% with advanced sensors + professional telematics', given: false },
    ],
    expression: 'annualInsurancePremiumPerTruck × premiumReductionPct × fleetSize',
    weight: 0.05,
  },
];

// ---------------------------------------------------------------------------
// Lookup Functions
// ---------------------------------------------------------------------------
export const LOOKUPS = {
  truFuelReduction: (tru: string): number =>
    ({ Standard: 0.10, 'High-Efficiency': 0.25, 'Variable-Speed': 0.35 }[tru] ?? 0),

  insulationReduction: (ins: string): number =>
    ({ '50mm': 0.20, '75mm': 0.30, '100mm': 0.38 }[ins] ?? 0),

  postUpgradeSpoilage: (sensors: string): number =>
    ({ Basic: 0.025, Advanced: 0.015, Premium: 0.008 }[sensors] ?? 0.025),

  standbyPct: (standby: string): number =>
    ({ None: 0, Standard: 0.50, Advanced: 0.67 }[standby] ?? 0),

  hoursAvoided: (predMaint: string): number =>
    ({ Standard: 24, Advanced: 48 }[predMaint] ?? 0),

  hoursReplacedPerWeek: (contract: string): number =>
    ({ Basic: 2, Comprehensive: 5 }[contract] ?? 0),

  avoidedAuditCost: (docs: string): number =>
    ({ None: 0, Basic: 4000, Full: 9000 }[docs] ?? 0),

  telematicsEff: (telem: string): number =>
    ({ Standard: 0.08, Professional: 0.15 }[telem] ?? 0),

  routeOptEff: (route: string): number =>
    ({ None: 0, Standard: 0.08, Advanced: 0.15 }[route] ?? 0),

  lifeExtensionPct: (predMaint: string): number =>
    ({ Standard: 0.15, Advanced: 0.25 }[predMaint] ?? 0),

  errorReductionPct: (hmi: string): number =>
    ({ Analog: 0, Digital: 0.70 }[hmi] ?? 0),

  premiumReductionPct: (sensors: string, telem: string): number =>
    sensors !== 'Basic' && telem !== 'Standard' ? 0.12 : 0.05,
};

// ---------------------------------------------------------------------------
// Default State Values
// ---------------------------------------------------------------------------
export interface CustomerInputs {
  fleetSize: number;
  agreementLength: number;
  annualFuelCostPerTruck: number;
  annualCompressorCostPerTruck: number;
  annualCargoValuePerTruck: number;
  currentSpoilageRate: number;
  downtimeCostPerHour: number;
  breakdownProbability: number;
  currentDowntimeHoursPerTruck: number;
  currentComplianceHoursPerWeek: number;
  complianceStaffCostPerHour: number;
  annualRouteCostPerTruck: number;
  truReplacementCost: number;
  currentTruLife: number;
  annualDepotDieselPerTruck: number;
  depotHoursPerTruck: number;
  driverErrorIncidentsPerTruck: number;
  costPerDriverErrorIncident: number;
  annualInsurancePremiumPerTruck: number;
  currentCO2PerTruck: number;
}

export interface ComponentConfig {
  tru: string;
  insulation: string;
  sensors: string;
  electricStandby: string;
  driverHMI: string;
  telematics: string;
  routeOptimization: string;
  predictiveMaintenance: string;
  maintenanceContract: string;
  complianceDocs: string;
}

export interface Discounts {
  tru: number;
  insulation: number;
  sensors: number;
  electricStandby: number;
  driverHMI: number;
}

export const DEFAULT_CUSTOMER_INPUTS: CustomerInputs = {
  fleetSize: 5,
  agreementLength: 5,
  annualFuelCostPerTruck: 18000,
  annualCompressorCostPerTruck: 4200,
  annualCargoValuePerTruck: 250000,
  currentSpoilageRate: 0.05,
  downtimeCostPerHour: 1500,
  breakdownProbability: 0.60,
  currentDowntimeHoursPerTruck: 72,
  currentComplianceHoursPerWeek: 6,
  complianceStaffCostPerHour: 45,
  annualRouteCostPerTruck: 22000,
  truReplacementCost: 25000,
  currentTruLife: 8,
  annualDepotDieselPerTruck: 3600,
  depotHoursPerTruck: 1200,
  driverErrorIncidentsPerTruck: 4,
  costPerDriverErrorIncident: 800,
  annualInsurancePremiumPerTruck: 3200,
  currentCO2PerTruck: 12,
};

export const DEFAULT_COMPONENT_CONFIG: ComponentConfig = {
  tru: 'High-Efficiency',
  insulation: '75mm',
  sensors: 'Advanced',
  electricStandby: 'Standard',
  driverHMI: 'Digital',
  telematics: 'Professional',
  routeOptimization: 'Standard',
  predictiveMaintenance: 'Advanced',
  maintenanceContract: 'Comprehensive',
  complianceDocs: 'Full',
};

export const DEFAULT_DISCOUNTS: Discounts = {
  tru: 0,
  insulation: 0,
  sensors: 0,
  electricStandby: 0,
  driverHMI: 0,
};

export const DEFAULT_SELECTED_VADS: string[] = VALUE_DRIVERS.map(v => v.id);

// ---------------------------------------------------------------------------
// Pricing Calculation
// ---------------------------------------------------------------------------
export interface HWItem {
  id: string;
  name: string;
  spec: string;
  price: number;
  pricePerTruck: number;
  subtotal: number;
  discount: number;
  netPrice: number;
}

export interface SWItem {
  id: string;
  name: string;
  spec: string;
  price: number;
  pricePerTruck: number;
  annualTotal: number;
}

export interface CTItem {
  id: string;
  name: string;
  spec: string;
  price: number;
  pricePerTruck: number;
  annualTotal: number;
}

export interface PricingResult {
  hwItems: HWItem[];
  swItems: SWItem[];
  ctItems: CTItem[];
  hwTotal: number;
  hwNetTotal: number;
  swAnnualTotal: number;
  ctAnnualTotal: number;
  annualRecurring: number;
  year1Investment: number;
}

const getComponentPrice = (componentId: string, selectedOption: string): number => {
  const comp = COMPONENTS.find(c => c.id === componentId);
  return comp?.options.find(o => o.value === selectedOption)?.price ?? 0;
};

export function calculatePricing(
  config: ComponentConfig,
  inputs: CustomerInputs,
  discounts: Discounts
): PricingResult {
  const fleet = inputs.fleetSize;

  const hwItems: HWItem[] = [
    { id: 'tru', name: 'Transport Refrigeration Unit (TRU)', spec: config.tru, price: getComponentPrice('tru', config.tru), pricePerTruck: 0, subtotal: 0, discount: discounts.tru, netPrice: 0 },
    { id: 'insulation', name: 'Insulation Panels and Door Seals', spec: config.insulation, price: getComponentPrice('insulation', config.insulation), pricePerTruck: 0, subtotal: 0, discount: discounts.insulation, netPrice: 0 },
    { id: 'sensors', name: 'IoT Sensor and Monitoring Kit', spec: config.sensors, price: getComponentPrice('sensors', config.sensors), pricePerTruck: 0, subtotal: 0, discount: discounts.sensors, netPrice: 0 },
    { id: 'electricStandby', name: 'Electric Standby Kit', spec: config.electricStandby, price: getComponentPrice('electricStandby', config.electricStandby), pricePerTruck: 0, subtotal: 0, discount: discounts.electricStandby, netPrice: 0 },
    { id: 'driverHMI', name: 'Driver HMI Panel (IntelliSet)', spec: config.driverHMI, price: getComponentPrice('driverHMI', config.driverHMI), pricePerTruck: 0, subtotal: 0, discount: discounts.driverHMI, netPrice: 0 },
  ];

  hwItems.forEach(item => {
    item.pricePerTruck = item.price;
    item.subtotal = item.pricePerTruck * fleet;
    item.netPrice = item.subtotal * (1 - item.discount);
  });

  const swItems: SWItem[] = [
    { id: 'telematics', name: 'Fleet Telematics Platform', spec: config.telematics, price: getComponentPrice('telematics', config.telematics), pricePerTruck: 0, annualTotal: 0 },
    { id: 'routeOptimization', name: 'Route Optimization Module', spec: config.routeOptimization, price: getComponentPrice('routeOptimization', config.routeOptimization), pricePerTruck: 0, annualTotal: 0 },
    { id: 'predictiveMaintenance', name: 'Predictive Maintenance Engine', spec: config.predictiveMaintenance, price: getComponentPrice('predictiveMaintenance', config.predictiveMaintenance), pricePerTruck: 0, annualTotal: 0 },
  ];

  swItems.forEach(item => {
    item.pricePerTruck = item.price;
    item.annualTotal = item.pricePerTruck * fleet;
  });

  const ctItems: CTItem[] = [
    { id: 'maintenanceContract', name: 'Maintenance and Compliance Contract', spec: config.maintenanceContract, price: getComponentPrice('maintenanceContract', config.maintenanceContract), pricePerTruck: 0, annualTotal: 0 },
    { id: 'complianceDocs', name: 'Compliance Documentation Package', spec: config.complianceDocs, price: getComponentPrice('complianceDocs', config.complianceDocs), pricePerTruck: 0, annualTotal: 0 },
  ];

  ctItems.forEach(item => {
    item.pricePerTruck = item.price;
    item.annualTotal = item.pricePerTruck * fleet;
  });

  const hwTotal = hwItems.reduce((sum, i) => sum + i.subtotal, 0);
  const hwNetTotal = hwItems.reduce((sum, i) => sum + i.netPrice, 0);
  const swAnnualTotal = swItems.reduce((sum, i) => sum + i.annualTotal, 0);
  const ctAnnualTotal = ctItems.reduce((sum, i) => sum + i.annualTotal, 0);
  const annualRecurring = swAnnualTotal + ctAnnualTotal;
  const year1Investment = hwNetTotal + annualRecurring;

  return { hwItems, swItems, ctItems, hwTotal, hwNetTotal, swAnnualTotal, ctAnnualTotal, annualRecurring, year1Investment };
}

// ---------------------------------------------------------------------------
// VAD Calculations
// ---------------------------------------------------------------------------
export function calculateVADValue(vadId: string, inputs: CustomerInputs, config: ComponentConfig): number {
  switch (vadId) {
    case 'vd_energy':
      return (
        inputs.annualFuelCostPerTruck * LOOKUPS.truFuelReduction(config.tru) +
        inputs.annualCompressorCostPerTruck * LOOKUPS.insulationReduction(config.insulation)
      ) * inputs.fleetSize;

    case 'vd_depot':
      return inputs.annualDepotDieselPerTruck * LOOKUPS.standbyPct(config.electricStandby) * inputs.fleetSize;

    case 'vd_spoilage':
      return inputs.annualCargoValuePerTruck *
        (inputs.currentSpoilageRate - LOOKUPS.postUpgradeSpoilage(config.sensors)) *
        inputs.fleetSize;

    case 'vd_downtime':
      return inputs.downtimeCostPerHour *
        LOOKUPS.hoursAvoided(config.predictiveMaintenance) *
        inputs.fleetSize *
        inputs.breakdownProbability;

    case 'vd_compliance':
      return (LOOKUPS.hoursReplacedPerWeek(config.maintenanceContract) * 52) *
        inputs.complianceStaffCostPerHour *
        inputs.fleetSize;

    case 'vd_audit':
      return LOOKUPS.avoidedAuditCost(config.complianceDocs) * inputs.fleetSize;

    case 'vd_fleet':
      return inputs.annualRouteCostPerTruck *
        (LOOKUPS.telematicsEff(config.telematics) + LOOKUPS.routeOptEff(config.routeOptimization)) *
        inputs.fleetSize;

    case 'vd_lifespan':
      return inputs.truReplacementCost *
        (LOOKUPS.lifeExtensionPct(config.predictiveMaintenance) / inputs.currentTruLife) *
        inputs.fleetSize;

    case 'vd_driver':
      return inputs.driverErrorIncidentsPerTruck *
        inputs.costPerDriverErrorIncident *
        LOOKUPS.errorReductionPct(config.driverHMI) *
        inputs.fleetSize;

    case 'vd_insurance':
      return inputs.annualInsurancePremiumPerTruck *
        LOOKUPS.premiumReductionPct(config.sensors, config.telematics) *
        inputs.fleetSize;

    default:
      return 0;
  }
}

// ---------------------------------------------------------------------------
// ROI Calculation
// ---------------------------------------------------------------------------
export interface CashFlowRow {
  year: number | 'TOTAL';
  cost: number;
  value: number;
  net: number;
  cumulative: number;
}

export interface ROIResult {
  vpRatioAnnual: number;
  paybackMonths: number;
  vpRatioFullTerm: number;
  roiPercent: number;
  tco: { hardware: number; software: number; contracts: number; total: number };
  value: { annualPerTruck: number; annualPerFleet: number; totalOverAgreement: number; netGain: number };
  cashFlow: CashFlowRow[];
  totalRow: CashFlowRow;
}

export function calculateROI(
  pricing: PricingResult,
  totalAnnualSavings: number,
  savingsPerTruck: number,
  inputs: CustomerInputs
): ROIResult {
  const duration = inputs.agreementLength;
  const { hwNetTotal, swAnnualTotal, ctAnnualTotal, annualRecurring } = pricing;

  const vpRatioAnnual = annualRecurring > 0 ? totalAnnualSavings / annualRecurring : 0;
  const paybackMonths = totalAnnualSavings > 0 ? hwNetTotal / (totalAnnualSavings / 12) : 0;
  const totalCost = hwNetTotal + annualRecurring * duration;
  const totalSavings = totalAnnualSavings * duration;
  const vpRatioFullTerm = totalCost > 0 ? totalSavings / totalCost : 0;
  const netGain = totalSavings - totalCost;
  const roiPercent = totalCost > 0 ? netGain / totalCost : 0;

  const tco = {
    hardware: hwNetTotal,
    software: swAnnualTotal * duration,
    contracts: ctAnnualTotal * duration,
    total: totalCost,
  };

  const value = {
    annualPerTruck: savingsPerTruck,
    annualPerFleet: totalAnnualSavings,
    totalOverAgreement: totalSavings,
    netGain,
  };

  const cashFlow: CashFlowRow[] = [];
  let cumulative = 0;
  for (let year = 0; year <= duration; year++) {
    const cost = year === 0 ? hwNetTotal : annualRecurring;
    const val = year === 0 ? 0 : totalAnnualSavings;
    const net = val - cost;
    cumulative += net;
    cashFlow.push({ year, cost, value: val, net, cumulative });
  }

  const totalRow: CashFlowRow = {
    year: 'TOTAL',
    cost: cashFlow.reduce((s, r) => s + r.cost, 0),
    value: cashFlow.reduce((s, r) => s + r.value, 0),
    net: cashFlow.reduce((s, r) => s + r.net, 0),
    cumulative,
  };

  return { vpRatioAnnual, paybackMonths, vpRatioFullTerm, roiPercent, tco, value, cashFlow, totalRow };
}
