"""
Main entry point for emission calculation and recommendation system.
"""

import pandas as pd
from src.config import INPUT_DATA_PATH, OUTPUT_EMISSIONS_PATH, OUTPUT_RECOMMENDATIONS_PATH
from src.emission_calculator import EmissionCalculator
from src.scoring import add_scoring_columns
from src.recommendation_engine import generate_recommendations
from src.utils import load_data, save_data, display_summary


def main():
    """Main pipeline."""
    print("Starting Emission Calculation System...")
    print("=" * 60)

    # Step 1: Load data
    print("\n[1/4] Loading input data...")
    df = load_data(INPUT_DATA_PATH)
    display_summary(df, "Input Data")

    # Step 2: Calculate emissions
    print("\n[2/4] Calculating emissions...")
    calculator = EmissionCalculator()
    df = calculator.calculate_dataframe(df)
    display_summary(df, "After Emission Calculation")

    # Step 3: Add scoring
    print("\n[3/4] Adding emission scores...")
    df = add_scoring_columns(df)
    display_summary(df, "After Scoring")

    # Step 4: Generate recommendations
    print("\n[4/4] Generating recommendations...")
    df = generate_recommendations(df)
    display_summary(df, "Final Output")

    # Save outputs
    print("\n" + "=" * 60)
    print("Saving outputs...")
    save_data(df, OUTPUT_EMISSIONS_PATH)
    save_data(df, OUTPUT_RECOMMENDATIONS_PATH)

    print("\n" + "=" * 60)
    print("Pipeline completed successfully!")
    print(f"Output files:")
    print(f"  - {OUTPUT_EMISSIONS_PATH}")
    print(f"  - {OUTPUT_RECOMMENDATIONS_PATH}")


if __name__ == "__main__":
    main()