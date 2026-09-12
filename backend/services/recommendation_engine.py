import os
from typing import Dict, Any, Optional

import pandas as pd

from emission_system.src.recommendation_engine import (
    generate_recommendations as generate_attached_recommendations,
)
from emission_system.src.config import INTERVENTIONS_BY_HOTSPOT, INTERVENTION_IMPACTS

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(
    BACKEND_DIR, "emission_system", "data", "industrial_emissions_enhanced.csv"
)


def _industry_name(value: str) -> str:
    """Normalize profile names such as 'Textile Manufacturing' to dataset labels."""
    value = str(value or "").lower()
    if "textile" in value:
        return "textile"
    if "chemical" in value:
        return "chemical"
    if "electronic" in value:
        return "electronics"
    if "automotive" in value:
        return "automotive parts"
    return value


def _hotspot_name(value: str) -> str:
    value = str(value or "").lower()
    if "waste" in value:
        return "waste"
    if "gas" in value:
        return "natural gas"
    if "material" in value:
        return "raw materials"
    return "electricity"

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

        # Run the attached recommendation engine first. Its intervention choice,
        # impact factor, and ROI are the source of truth for the leading result.
        top_hotspot = _hotspot_name(top_hotspot_name)
        source_row = {
            "electricity_emissions_kgco2e": 0,
            "natural_gas_emissions_kgco2e": 0,
            "diesel_emissions_kgco2e": 0,
            "petrol_emissions_kgco2e": 0,
            "landfill_emissions_kgco2e": 0,
            "compost_emissions_kgco2e": 0,
            "total_emissions_tco2e": 0,
            "budget": user_budget,
        }
        for source in hotspot_info.get("hotspots", []):
            source_key = {
                "Electricity": "electricity_emissions_kgco2e",
                "Natural Gas": "natural_gas_emissions_kgco2e",
                "Waste Generation": "landfill_emissions_kgco2e",
            }.get(source.get("source"))
            if source_key:
                source_row[source_key] = float(source.get("co2e_tonnes", 0)) * 1000
            source_row["total_emissions_tco2e"] += float(source.get("co2e_tonnes", 0))
        attached_result = generate_attached_recommendations(pd.DataFrame([source_row]))
        attached_intervention = attached_result.iloc[0]["recommended_intervention"]

        recommendations = []

        industry_key = _industry_name(industry)
        candidates = self.interventions_df[
            self.interventions_df["industry"].astype(str).str.lower().eq(industry_key)
            & self.interventions_df["top_hotspot"].astype(str).str.lower().eq(top_hotspot)
        ].copy()
        if candidates.empty:
            candidates = self.interventions_df[
                self.interventions_df["top_hotspot"].astype(str).str.lower().eq(top_hotspot)
            ].copy()
        if candidates.empty:
            total_emissions = float(source_row["total_emissions_tco2e"])
            fallback_hotspot = next(
                (name for name in INTERVENTIONS_BY_HOTSPOT if name.lower() == top_hotspot),
                "Electricity",
            )
            candidates = pd.DataFrame([
                {
                    "recommended_intervention": intervention,
                    "top_hotspot": fallback_hotspot,
                    "budget": min(user_budget, 100000 + index * 50000),
                    "potential_reduction_tonnes": round(
                        total_emissions * INTERVENTION_IMPACTS.get(intervention, 0.10), 2
                    ),
                    "roi_score": max(
                        total_emissions * INTERVENTION_IMPACTS.get(intervention, 0.10)
                        / max(min(user_budget, 100000 + index * 50000), 1)
                        * 100000,
                        0.01,
                    ),
                    "recommendation_priority": "High",
                }
                for index, intervention in enumerate(
                    INTERVENTIONS_BY_HOTSPOT[fallback_hotspot]
                )
            ])
        candidates = candidates.sort_values("roi_score", ascending=False).drop_duplicates(
            subset=["recommended_intervention"]
        )

        # Find max impact and cost in dataset for normalized scoring
        max_impact = candidates["potential_reduction_tonnes"].astype(float).max() or 35.0
        min_payback = 0.5
        max_payback = 5.0

        for _, row in candidates.iterrows():
            cost = float(row["budget"])
            impact = float(row["potential_reduction_tonnes"])
            payback = max(cost / max(float(row["roi_score"]), 0.0001) / 100000, 0.1)
            feasibility_str = str(row["recommendation_priority"]).strip()
            target_hotspot = str(row["top_hotspot"]).strip()

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
                "intervention": row["recommended_intervention"],
                "target_hotspot": target_hotspot,
                "category": "Energy Efficiency",
                "estimated_cost_inr": cost,
                "expected_co2_reduction_tco2e": impact,
                "feasibility": feasibility_str,
                "payback_years": payback,
                "estimated_annual_savings_inr": annual_savings,
                "cost_bracket": cost_bracket,
                "within_budget": within_budget,
                "score": min(99.4, round(composite_score, 1)),
                "source": "GreenMind attached industrial benchmark dataset",
                "why_recommended": explanation
            })

        # Ensure the exact attached-engine choice receives the leading score.
        for recommendation in recommendations:
            if recommendation["intervention"] == attached_intervention:
                recommendation["score"] = 99.5
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        for index, recommendation in enumerate(recommendations):
            recommendation["rank"] = index + 1

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
