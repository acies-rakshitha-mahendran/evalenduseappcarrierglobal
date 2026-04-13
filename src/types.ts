export type ThemeMode = "light" | "dark" | "custom";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  background: string;
  text: string;
}

export type VADId =
  | "reduced_electricity"
  | "reduced_maintenance"
  | "increased_ticket_sales"
  | "avoided_revenue_loss"
  | "increased_recyclability"
  | "embodied_carbon_reduction";

export interface VADInputValues {
  [key: string]: number | string;
}

export interface EvalResults {
  [key: string]: number;
}

export type CraftLayout = string | null;

export interface ProjectBuildConfig {
  projectId: string;
  theme: ThemeConfig;
  homeLayout: CraftLayout;
  pricingLayout: CraftLayout;
  vadLayout: CraftLayout;
  resultsLayout: CraftLayout;
  roiLayout: CraftLayout;
}
