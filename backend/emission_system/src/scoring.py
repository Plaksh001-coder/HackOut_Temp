"""
Emission scoring and efficiency metrics.
"""

import pandas as pd
import numpy as np
from typing import Tuple
from .config import BENCHMARKS


def normalize_score(
    value: float,
    good_limit: float,
    bad_limit: float,
    invert: bool = False,
) -> float:
    """
    Normalize a value to 0-100 score.

    Args:
        value: The metric value
        good_limit: Threshold for best performance (score = 0)
        bad_limit: Threshold for worst performance (score = 100)
        invert: If True, lower values get higher scores (for efficiency metrics)

    Returns:
        Score between 0 and 100
    """
    if bad_limit == good_limit:
        return 50.0

    score = 100 * (value - good_limit) / (bad_limit - good_limit)

    if invert:
        score = 100 - score

    return max(0, min(100, score))


def calculate_emission_score(row: pd.Series) -> float:
    """
    Calculate composite emission score (0-100, higher = worse).

    Components:
    - Electricity: 30%
    - Fuels: 30%
    - Waste: 20%
    - Materials (Scope 3): 20%
    """
    total = row.get("total_emissions_kgco2e", 0)
    production = row.get("production", 1)

    if production == 0 or total == 0:
        return 0.0

    emissions_per_unit = total / production

    score = normalize_score(
        emissions_per_unit,
        good_limit=BENCHMARKS["emissions_per_unit"]["good"],
        bad_limit=BENCHMARKS["emissions_per_unit"]["bad"],
    )

    return round(score, 2)


def calculate_efficiency_score(row: pd.Series) -> float:
    """
    Calculate energy efficiency score (0-100, higher = better).
    """
    production = row.get("production", 1)
    electricity = row.get("electricity_kwh", 0)
    gas = row.get("natural_gas_scm", 0)
    diesel = row.get("diesel_litre", 0)

    if production == 0:
        return 0.0

    # Energy intensity (kWh equivalent per unit)
    energy_intensity = (electricity + gas * 10 + diesel * 5) / production

    score = normalize_score(
        energy_intensity,
        good_limit=BENCHMARKS["energy_intensity"]["good"],
        bad_limit=BENCHMARKS["energy_intensity"]["bad"],
        invert=True,  # Lower intensity = better score
    )

    return round(score, 2)


def calculate_component_scores(row: pd.Series) -> pd.Series:
    """Calculate individual emission component scores."""
    total = row.get("total_emissions_kgco2e", 1)

    if total == 0:
        return pd.Series(
            {
                "electricity_component_score": 0,
                "fuel_component_score": 0,
                "waste_component_score": 0,
                "material_component_score": 0,
            }
        )

    electricity_score = (
        row.get("electricity_emissions_kgco2e", 0) / total * 100
    )
    fuel_score = (
        row.get("scope1_emissions_kgco2e", 0) / total * 100
    )
    waste_score = (
        row.get("waste_emissions_kgco2e", 0) / total * 100
    )
    material_score = (
        row.get("scope3_emissions_kgco2e", 0) / total * 100
    )

    return pd.Series(
        {
            "electricity_component_score": round(electricity_score, 2),
            "fuel_component_score": round(fuel_score, 2),
            "waste_component_score": round(waste_score, 2),
            "material_component_score": round(material_score, 2),
        }
    )


def determine_priority(emission_score: float, reduction_target: int) -> str:
    """
    Determine recommendation priority.

    Returns:
        'Low', 'Medium', or 'High'
    """
    if emission_score > 70 and reduction_target >= 30:
        return "High"
    elif emission_score > 50 or reduction_target >= 25:
        return "Medium"
    else:
        return "Low"


def add_scoring_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add all scoring columns to DataFrame.

    Args:
        df: DataFrame with emission columns already calculated

    Returns:
        DataFrame with additional scoring columns
    """
    # Emission score
    df["emission_score"] = df.apply(calculate_emission_score, axis=1)

    # Efficiency score
    df["energy_efficiency_score"] = df.apply(calculate_efficiency_score, axis=1)

    # Component scores
    component_scores = df.apply(calculate_component_scores, axis=1)
    df = pd.concat([df.reset_index(drop=True), component_scores], axis=1)

    # Priority
    df["recommendation_priority"] = df.apply(
        lambda row: determine_priority(row["emission_score"], row.get("reduction_target", 20)),
        axis=1,
    )

    # Emissions per unit (intensity metric)
    df["emissions_per_unit_kgco2e"] = (
        df["total_emissions_kgco2e"] / df["production"].replace(0, 1)
    ).round(4)

    return df