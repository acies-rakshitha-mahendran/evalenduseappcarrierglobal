// src/vadMetadata.ts
export interface VADMeta {
  category: string;
  dimension: string;
  weight: string;
  variables: string[];
  expression: string;
  description?: string;
}

export const VAD_METADATA: Record<string, VADMeta> = {
  "Reduced Energy and Fuel Costs": {
    category: "Direct Cost Reduction",
    dimension: "Operational Cost Savings",
    weight: "12%",
    variables: ["Annual Energy Cost / Unit (D10)", "Fleet / Unit Count (D8)"],
    expression: "D10 × 0.25 × D8",
    description: "Energy savings from upgraded primary equipment combined with secondary equipment. Assumes 25% average efficiency improvement.",
  },

  "Product Loss Prevention": {
    category: "Direct Cost Reduction",
    dimension: "Spoilage Reduction",
    weight: "12%",
    variables: ["Cargo / Product Value / Unit (D12)", "Current Spoilage Rate % (D13)", "Fleet / Unit Count (D8)"],
    expression: "D12 × (D13 / 100) × 0.60 × D8",
    description: "Better monitoring reduces spoilage. Post-upgrade spoilage estimated at 40% of current rate (60% reduction).",
  },

  "Revenue Protected from Downtime": {
    category: "Revenue Protection",
    dimension: "Avoided Downtime Loss",
    weight: "10%",
    variables: ["Downtime Cost / Hour (D14)", "Fleet / Unit Count (D8)", "Breakdown Probability % (D15)"],
    expression: "D14 × 24 × D8 × (D15 / 100)",
    description: "Predictive maintenance avoids 24 hours of downtime per unit per year, probability-weighted by breakdown likelihood.",
  },

  "Workforce Productivity": {
    category: "Workforce Productivity",
    dimension: "Labor Cost Savings",
    weight: "8%",
    variables: ["Staff Cost / Hour (D18)", "Fleet / Unit Count (D8)"],
    expression: "(4 × 52) × D18 × D8",
    description: "Service contract automates compliance logging, replacing 4 manual hours per week per unit.",
  },

  "Operator Error Reduction": {
    category: "Workforce Productivity",
    dimension: "Error Cost Elimination",
    weight: "6%",
    variables: ["Error Incidents / Unit / Year (D23)", "Cost per Error Incident (D24)", "Fleet / Unit Count (D8)"],
    expression: "D23 × D24 × 0.60 × D8",
    description: "Sensors and real-time monitoring reduce human operator errors by 60%.",
  },

  "Compliance and Penalty Avoidance": {
    category: "Compliance and Risk",
    dimension: "Risk Mitigation",
    weight: "5%",
    variables: ["Fleet / Unit Count (D8)"],
    expression: "5000 × D8",
    description: "Software + service contract provide automated compliance, avoiding audit costs, fines, and certification losses. Estimated $5,000/unit/year.",
  },

  "Insurance Premium Reduction": {
    category: "Compliance and Risk",
    dimension: "Premium Savings",
    weight: "4%",
    variables: ["Insurance Premium / Unit (D25)", "Fleet / Unit Count (D8)"],
    expression: "D25 × 0.08 × D8",
    description: "Monitoring + software documentation reduces insurance premiums by 8%.",
  },

  "Competitive Win Rate": {
    category: "Competitive Advantage",
    dimension: "Revenue Growth",
    weight: "6%",
    variables: ["Revenue / Unit (D28)", "Fleet / Unit Count (D8)"],
    expression: "D28 × 0.03 × D8",
    description: "Software capabilities (telematics, BAS, EMS) differentiate bids and improve contract win rate by 3%.",
  },

  "Customer SLA Compliance": {
    category: "Competitive Advantage",
    dimension: "Penalty Avoidance",
    weight: "5%",
    variables: ["SLA Penalties / Unit (D29)", "Fleet / Unit Count (D8)"],
    expression: "D29 × 0.60 × D8",
    description: "Real-time monitoring prevents SLA breaches, reducing penalty charges by 60%.",
  },

  "Equipment Life Extension": {
    category: "Capital Efficiency",
    dimension: "Deferred CAPEX",
    weight: "6%",
    variables: ["Equipment Replacement Cost (D20)", "Equipment Life (D21)", "Fleet / Unit Count (D8)"],
    expression: "D20 × (0.20 / D21) × D8",
    description: "Predictive maintenance extends equipment life by 20%, deferring replacement CAPEX.",
  },

  "Fleet / Building Utilization": {
    category: "Operational Efficiency",
    dimension: "Productivity Gains",
    weight: "6%",
    variables: ["Route / Ops Cost / Unit (D19)", "Fleet / Unit Count (D8)"],
    expression: "D19 × 0.12 × D8",
    description: "Software improves route/operations efficiency by 12%. Returns $0 for solutions with no route cost.",
  },

  "Carbon Emissions Reduction": {
    category: "Sustainability",
    dimension: "ESG / Carbon",
    weight: "8%",
    variables: ["CO2 Emissions / Unit / Year (D26)", "Carbon Credit Value / Ton (D27)", "Fleet / Unit Count (D8)"],
    expression: "D26 × 0.25 × D27 × D8",
    description: "Equipment efficiency reduces CO2 by 25%, valued at carbon credit market price.",
  },

  "Refrigerant Leak Prevention": {
    category: "Sustainability",
    dimension: "Environmental Risk",
    weight: "4%",
    variables: ["Fleet / Unit Count (D8)"],
    expression: "2000 × D8",
    description: "Modern sealed systems and sensor detection reduce refrigerant losses. Estimated $2,000/unit/year avoided cost.",
  },

  "Energy Intensity Reduction": {
    category: "Sustainability",
    dimension: "ESG Reporting",
    weight: "8%",
    variables: ["Compressor Energy / Unit (D11)", "Fleet / Unit Count (D8)"],
    expression: "D11 × 0.15 × D8",
    description: "Lower kWh per unit of output from efficient equipment. Supports ESG reporting targets with 15% intensity reduction.",
  },
};
