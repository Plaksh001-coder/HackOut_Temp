"""
Emission Calculation System.
"""

from .emission_calculator import EmissionCalculator
from .scoring import add_scoring_columns
from .recommendation_engine import generate_recommendations

__all__ = [
    "EmissionCalculator",
    "add_scoring_columns",
    "generate_recommendations",
]