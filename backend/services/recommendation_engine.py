import os
import pandas as pd
from typing import Dict, List, Any, Optional

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "interventions.csv")

class RecommendationEngine:
    def __init__(self, data_path: Optional[str] = None):
        self.data_path = data_path or DATA_PATH
        self.interventions_df = pd.read_csv(self.data_path)

    def generate_recommendations(
        self,
        hotspot_info: Dict[str, Any],
        factory_profile: Dict[str, Any],
        weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Rank interventions using a weighted multi-factor scoring model:
        Score = w_impact * Impact + w_cost * CostEfficiency + w_feasibility * Feasibility + w_payback * Payback + w_budget * BudgetFit
        """
        weights = weights or {
            "impact": 0.35,
            "cost_efficiency": 0.25,
            "feasibility": 0.15,
            "payback": 0.15,
            "budget_fit": 0.10
        }

        user_budget = float(factory_profile.get("budget_inr", 500000) or 500000)
        industry = factory_profile.get("industry", "Textile Manufacturing")
        top_hotspot_name = hotspot_info.get("primary_source_name", "Electricity")

        recommendations = []

        # Find max impact and cost in dataset for normalized scoring
        max_impact = self.interventions_df["expected_CO2_reduction"].max() or 35.0
        min_payback = 0.5
        max_payback = 5.0

        for _, row in self.interventions_df.iterrows():
            cost = float(row["estimated_cost"])
            impact = float(row["expected_CO2_reduction"])
            payback = float(row["payback"])
            feasibility_str = str(row["feasibility"]).strip()
            target_hotspot = str(row["target_hotspot"]).strip()

            # Feasibility score (0-1)
            feasibility_score = 1.0 if feasibility_str == "Very High" else (0.85 if feasibility_str == "High" else 0.6)

            # Impact score normalized (0-1)
            impact_score = min(impact / max_impact, 1.0)

            # Cost efficiency (CO2 reduction per 10k INR)
            cost_efficiency = (impact / (cost / 10000.0))
            cost_eff_score = min(cost_efficiency / 3.0, 1.0)

            # Payback score (shorter is better)
            payback_score = max(0.0, 1.0 - ((payback - min_payback) / (max_payback - min_payback)))

            # Budget fit score
            within_budget = cost <= user_budget
            budget_fit_score = 1.0 if within_budget else max(0.2, 1.0 - ((cost - user_budget) / user_budget))

            # Hotspot relevance bonus (if targets top hotspot)
            hotspot_bonus = 0.2 if target_hotspot.lower() == top_hotspot_name.lower() else 0.0

            # Composite score (0 - 100)
            composite_score = (
                (weights["impact"] * impact_score) +
                (weights["cost_efficiency"] * cost_eff_score) +
                (weights["feasibility"] * feasibility_score) +
                (weights["payback"] * payback_score) +
                (weights["budget_fit"] * budget_fit_score) +
                hotspot_bonus
            ) * 100.0

            # Cost bracket label
            if cost <= 100000:
                cost_bracket = "Low Cost"
            elif cost <= 300000:
                cost_bracket = "Medium Cost"
            else:
                cost_bracket = "High Investment"

            # Annual savings estimate (Cost / payback)
            annual_savings = round(cost / payback, 0) if payback > 0 else 0

            # Why it was recommended explainability text
            explanation = (
                f"Targets your hotspot '{target_hotspot}'. Delivers {impact} tCO₂e annual abatement "
                f"at ₹{cost:,.0f} estimated capex, paying back in {payback} years "
                f"(₹{annual_savings:,.0f}/year in energy savings)."
            )
            if within_budget:
                explanation += " Fits comfortably within your declared sustainability budget."
            else:
                explanation += f" Exceeds current budget by ₹{(cost - user_budget):,.0f}, but offers strong long-term ROI."

            recommendations.append({
                "intervention": row["intervention"],
                "target_hotspot": target_hotspot,
                "category": row.get("category", "Energy Efficiency"),
                "estimated_cost_inr": cost,
                "expected_co2_reduction_tco2e": impact,
                "feasibility": feasibility_str,
                "payback_years": payback,
                "estimated_annual_savings_inr": annual_savings,
                "cost_bracket": cost_bracket,
                "within_budget": within_budget,
                "score": round(composite_score, 1),
                "source": row["source"],
                "why_recommended": explanation
            })

        # Sort descending by composite score
        recommendations.sort(key=lambda x: x["score"], reverse=True)

        # Assign ranks
        for idx, rec in enumerate(recommendations):
            rec["rank"] = idx + 1

        total_potential_reduction = sum(r["expected_co2_reduction_tco2e"] for r in recommendations[:4])
        total_recommended_investment = sum(r["estimated_cost_inr"] for r in recommendations[:4])
        total_potential_savings = sum(r["estimated_annual_savings_inr"] for r in recommendations[:4])

        return {
            "recommendations": recommendations,
            "top_three": recommendations[:3],
            "total_potential_reduction_tco2e": round(total_potential_reduction, 1),
            "recommended_investment_inr": total_recommended_investment,
            "potential_annual_savings_inr": total_potential_savings,
            "user_budget_inr": user_budget,
            "weights_used": weights
        }
