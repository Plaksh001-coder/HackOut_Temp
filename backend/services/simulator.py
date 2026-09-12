from typing import Dict, List, Any
from .emission_calculator import EmissionCalculator

class WhatIfSimulator:
    def __init__(self):
        self.calculator = EmissionCalculator()

    def simulate(self, factory_data: Dict[str, Any], scenario_params: Dict[str, Any], geography: str = "India (CEA)") -> Dict[str, Any]:
        """
        Simulate impact of sustainability interventions:
        scenario_params can include:
        - electricity_reduction_pct (0 - 50%)
        - renewable_shift_pct (0 - 100%)
        - fuel_reduction_pct (0 - 50%)
        - material_reduction_pct (0 - 40%)
        - waste_reduction_pct (0 - 60%)
        """
        # 1. Baseline emissions
        baseline_result = self.calculator.calculate_emissions(factory_data, geography)
        baseline_total = baseline_result["total_co2e_tonnes"]

        # Parse slider parameters
        elec_red_pct = max(0.0, min(float(scenario_params.get("electricity_reduction_pct", 0.0) or 0.0), 80.0))
        renew_shift_pct = max(0.0, min(float(scenario_params.get("renewable_shift_pct", 0.0) or 0.0), 100.0))
        fuel_red_pct = max(0.0, min(float(scenario_params.get("fuel_reduction_pct", 0.0) or 0.0), 80.0))
        mat_red_pct = max(0.0, min(float(scenario_params.get("material_reduction_pct", 0.0) or 0.0), 50.0))
        waste_red_pct = max(0.0, min(float(scenario_params.get("waste_reduction_pct", 0.0) or 0.0), 80.0))

        # 2. Adjusted Activity Data
        orig_elec = float(factory_data.get("electricity_kwh", 0) or 0)
        # Reduced electricity from efficiency
        elec_after_efficiency = orig_elec * (1.0 - (elec_red_pct / 100.0))
        # Renewable portion has zero grid emissions
        grid_elec_final = elec_after_efficiency * (1.0 - (renew_shift_pct / 100.0))

        orig_gas = float(factory_data.get("natural_gas_m3", 0) or 0)
        gas_final = orig_gas * (1.0 - (fuel_red_pct / 100.0))

        orig_mat = float(factory_data.get("raw_materials_kg", 0) or 0)
        mat_final = orig_mat * (1.0 - (mat_red_pct / 100.0))

        orig_waste = float(factory_data.get("waste_tonnes", 0) or 0)
        waste_final = orig_waste * (1.0 - (waste_red_pct / 100.0))

        simulated_factory_data = {
            "electricity_kwh": grid_elec_final,
            "natural_gas_m3": gas_final,
            "raw_materials_kg": mat_final,
            "waste_tonnes": waste_final
        }

        # 3. Recalculate deterministic emissions
        scenario_result = self.calculator.calculate_emissions(simulated_factory_data, geography)
        scenario_total = scenario_result["total_co2e_tonnes"]

        # 4. Deltas & Reductions
        reduction_tco2e = max(0.0, baseline_total - scenario_total)
        reduction_percentage = round((reduction_tco2e / baseline_total * 100.0), 1) if baseline_total > 0 else 0.0

        # 5. Financial Modeling (Estimating Capex & Annual Energy Savings)
        # Cost benchmarks:
        # Electricity reduction capex: ₹9,000 per avoided tCO2e/yr
        # Solar PV capex: ~₹45,000 per kWp (~1.3 tCO2e/yr avoided => ~₹35,000 per tCO2e)
        # Fuel efficiency capex: ₹8,000 per avoided tCO2e/yr
        # Waste reduction capex: ₹6,000 per avoided tCO2e/yr

        elec_avoided_kwh = orig_elec - grid_elec_final
        gas_avoided_m3 = orig_gas - gas_final
        waste_avoided_tonnes = orig_waste - waste_final

        # Commercial Tariffs (India benchmarks):
        # Commercial electricity ~₹8.50 per kWh
        # Natural gas ~₹48.0 per m3
        # Waste disposal cost ~₹2,500 per tonne
        annual_elec_savings_inr = elec_avoided_kwh * 8.50
        annual_fuel_savings_inr = gas_avoided_m3 * 48.00
        annual_waste_savings_inr = waste_avoided_tonnes * 2500.00
        total_annual_savings_inr = round(annual_elec_savings_inr + annual_fuel_savings_inr + annual_waste_savings_inr, 0)

        # Estimated Capex
        elec_eff_capex = (orig_elec * (elec_red_pct / 100.0)) * 2.2  # ~₹2.2 per saved kWh
        solar_capex = (elec_after_efficiency * (renew_shift_pct / 100.0)) * 5.8  # ~₹5.8 per green kWh capacity
        fuel_capex = (orig_gas * (fuel_red_pct / 100.0)) * 28.0
        waste_capex = waste_avoided_tonnes * 4000.0
        total_estimated_capex_inr = round(elec_eff_capex + solar_capex + fuel_capex + waste_capex, 0)

        payback_years = round(total_estimated_capex_inr / total_annual_savings_inr, 1) if total_annual_savings_inr > 0 else 0.0

        # Comparative breakdown for visualization
        comparison_breakdown = []
        for b_src in baseline_result["sources"]:
            src_name = b_src["source"]
            s_match = next((s for s in scenario_result["sources"] if s["source"] == src_name), None)
            s_val = s_match["co2e_tonnes"] if s_match else 0.0
            comparison_breakdown.append({
                "source": src_name,
                "baseline_tco2e": b_src["co2e_tonnes"],
                "scenario_tco2e": s_val,
                "reduction_tco2e": round(b_src["co2e_tonnes"] - s_val, 2)
            })

        return {
            "baseline_total_tco2e": round(baseline_total, 2),
            "scenario_total_tco2e": round(scenario_total, 2),
            "co2_reduction_tco2e": round(reduction_tco2e, 2),
            "reduction_percentage": reduction_percentage,
            "estimated_implementation_cost_inr": total_estimated_capex_inr,
            "estimated_annual_savings_inr": total_annual_savings_inr,
            "payback_years": payback_years,
            "scenario_params": {
                "electricity_reduction_pct": elec_red_pct,
                "renewable_shift_pct": renew_shift_pct,
                "fuel_reduction_pct": fuel_red_pct,
                "material_reduction_pct": mat_red_pct,
                "waste_reduction_pct": waste_red_pct
            },
            "comparison_breakdown": comparison_breakdown,
            "new_scope_breakdown": scenario_result["scope_breakdown"],
            "environmental_equivalent": {
                "trees_planted_equivalent": int(reduction_tco2e * 45),
                "cars_off_road_equivalent": round(reduction_tco2e / 4.6, 1)
            }
        }
