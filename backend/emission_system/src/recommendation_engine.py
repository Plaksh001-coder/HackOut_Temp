"""
Recommendation engine for emission reduction interventions.
"""

import pandas as pd
from typing import List, Tuple, Dict
from .config import INTERVENTIONS_BY_HOTSPOT, INTERVENTION_IMPACTS


def identify_hotspots(row: pd.Series) -> Tuple[str, str]:
    """
    Identify top and second emission hotspots.

    Returns:
        Tuple of (top_hotspot, second_hotspot)
    """
    hotspot_values = {
        "Electricity": row.get("electricity_emissions_kgco2e", 0),
        "Natural Gas": row.get("natural_gas_emissions_kgco2e", 0),
        "Diesel": row.get("diesel_emissions_kgco2e", 0),
        "Petrol": row.get("petrol_emissions_kgco2e", 0),
        "Waste": (
            row.get("landfill_emissions_kgco2e", 0)
            + row.get("compost_emissions_kgco2e", 0)
        ),
    }

    # Sort by emissions
    sorted_hotspots = sorted(
        hotspot_values.items(), key=lambda x: x[1], reverse=True
    )

    top = sorted_hotspots[0][0] if sorted_hotspots[0][1] > 0 else "Electricity"
    second = sorted_hotspots[1][0] if len(sorted_hotspots) > 1 and sorted_hotspots[1][1] > 0 else top

    return top, second


def recommend_intervention(
    hotspot: str,
    budget: float = None,
    intervention_list: List[str] = None,
) -> str:
    """
    Recommend best intervention for a hotspot.

    Args:
        hotspot: Emission hotspot category
        budget: Available budget (optional, for filtering)
        intervention_list: Custom list of interventions to consider

    Returns:
        Recommended intervention name
    """
    if intervention_list is None:
        intervention_list = INTERVENTIONS_BY_HOTSPOT.get(hotspot, INTERVENTIONS_BY_HOTSPOT["Electricity"])

    # Simple logic: return first intervention (can be enhanced with budget constraints)
    return intervention_list[0]


def calculate_intervention_impact(
    intervention: str,
    total_emissions_tco2e: float,
) -> Dict[str, float]:
    """
    Calculate potential impact of an intervention.

    Returns:
        Dictionary with impact metrics
    """
    impact_factor = INTERVENTION_IMPACTS.get(intervention, 0.10)

    potential_reduction = total_emissions_tco2e * impact_factor

    return {
        "intervention": intervention,
        "impact_factor": impact_factor,
        "potential_reduction_tco2e": round(potential_reduction, 2),
        "remaining_emissions_tco2e": round(total_emissions_tco2e - potential_reduction, 2),
    }


def calculate_roi(
    potential_reduction_tco2e: float,
    budget: float,
    carbon_price_per_tco2e: float = 1000,
) -> float:
    """
    Calculate ROI score for an intervention.

    Args:
        potential_reduction_tco2e: Potential emission reduction
        budget: Investment budget
        carbon_price_per_tco2e: Assumed carbon price (default: ₹1000/tCO2e)

    Returns:
        ROI score (benefit/cost ratio)
    """
    if budget <= 0:
        return 0.0

    benefit = potential_reduction_tco2e * carbon_price_per_tco2e
    roi = benefit / budget

    return round(roi, 4)


def generate_recommendations(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generate recommendations for all rows in DataFrame.

    Args:
        df: DataFrame with emission and scoring columns

    Returns:
        DataFrame with recommendation columns added
    """
    recommendations = []

    for idx, row in df.iterrows():
        top_hotspot, second_hotspot = identify_hotspots(row)

        intervention = recommend_intervention(
            hotspot=top_hotspot,
            budget=row.get("budget", None),
        )

        impact = calculate_intervention_impact(
            intervention=intervention,
            total_emissions_tco2e=row.get("total_emissions_tco2e", 0),
        )

        roi = calculate_roi(
            potential_reduction_tco2e=impact["potential_reduction_tco2e"],
            budget=row.get("budget", 1),
        )

        recommendations.append(
            {
                "top_hotspot": top_hotspot,
                "second_hotspot": second_hotspot,
                "recommended_intervention": intervention,
                "intervention_impact_factor": impact["impact_factor"],
                "potential_reduction_tco2e": impact["potential_reduction_tco2e"],
                "remaining_emissions_tco2e": impact["remaining_emissions_tco2e"],
                "roi_score": roi,
            }
        )

    rec_df = pd.DataFrame(recommendations)
    return pd.concat([df.reset_index(drop=True), rec_df], axis=1)