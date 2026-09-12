export interface ActivityData {
  electricity_kwh: number;
  natural_gas_m3: number;
  raw_materials_kg: number;
  waste_tonnes: number;
}

export interface FactoryProfile {
  id: string;
  name: string;
  industry: string;
  location: string;
  production_type: string;
  production_volume: number;
  production_volume_unit: string;
  activity_data: ActivityData;
  sustainability_goals: string;
  reduction_target_pct: number;
  budget_inr: number;
  created_at?: string;
}

export interface EmissionSource {
  source: string;
  category: string;
  activity: string;
  value: number;
  unit: string;
  emission_factor: number;
  factor_unit: string;
  co2e_tonnes: number;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  confidence: string;
  source_ref: string;
  percentage?: number;
}

export interface ScopeBreakdown {
  'Scope 1': number;
  'Scope 2': number;
  'Scope 3': number;
}

export interface MonthlyTrendItem {
  month: string;
  emissions_tco2e: number;
}

export interface EmissionCalculation {
  total_co2e_tonnes: number;
  sources: EmissionSource[];
  scope_breakdown: ScopeBreakdown;
  monthly_trend: MonthlyTrendItem[];
  assumptions: string[];
  geography: string;
  calculation_status: string;
}

export interface HotspotItem {
  rank: number;
  source: string;
  co2e_tonnes: number;
  percentage: number;
  scope: string;
  priority: string;
  badge_color: 'red' | 'amber' | 'blue' | 'emerald';
  reduction_opportunity: string;
  explanation: string;
}

export interface HotspotAnalysis {
  top_hotspot: HotspotItem | null;
  hotspots: HotspotItem[];
  summary: string;
  total_evaluated_sources: number;
  primary_source_name: string;
}

export interface InterventionRecommendation {
  rank: number;
  intervention: string;
  target_hotspot: string;
  category: string;
  estimated_cost_inr: number;
  expected_co2_reduction_tco2e: number;
  feasibility: string;
  payback_years: number;
  estimated_annual_savings_inr: number;
  cost_bracket: 'Low Cost' | 'Medium Cost' | 'High Investment';
  within_budget: boolean;
  score: number;
  source: string;
  why_recommended: string;
}

export interface RecommendationResult {
  recommendations: InterventionRecommendation[];
  top_three: InterventionRecommendation[];
  total_potential_reduction_tco2e: number;
  recommended_investment_inr: number;
  potential_annual_savings_inr: number;
  user_budget_inr: number;
  weights_used: Record<string, number>;
}

export interface SimulationParams {
  electricity_reduction_pct: number;
  renewable_shift_pct: number;
  fuel_reduction_pct: number;
  material_reduction_pct: number;
  waste_reduction_pct: number;
}

export interface SourceComparisonItem {
  source: string;
  baseline_tco2e: number;
  scenario_tco2e: number;
  reduction_tco2e: number;
}

export interface SimulationResult {
  factory_id?: string;
  scenario_name?: string;
  baseline_total_tco2e: number;
  scenario_total_tco2e: number;
  co2_reduction_tco2e: number;
  reduction_percentage: number;
  estimated_implementation_cost_inr: number;
  estimated_annual_savings_inr: number;
  payback_years: number;
  scenario_params: SimulationParams;
  comparison_breakdown: SourceComparisonItem[];
  new_scope_breakdown: ScopeBreakdown;
  environmental_equivalent: {
    trees_planted_equivalent: number;
    cars_off_road_equivalent: number;
  };
}

export interface SavedScenario {
  id: string;
  factory_id: string;
  scenario_name: string;
  baseline_emissions: number;
  scenario_emissions: number;
  reduction: number;
  reduction_pct: number;
  estimated_cost: number;
  estimated_savings: number;
  payback: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredAction?: any;
}
