"""
Utility functions.
"""

import pandas as pd
import os


def ensure_directory(path: str) -> None:
    """Create directory if it doesn't exist."""
    os.makedirs(os.path.dirname(path), exist_ok=True)


def load_data(filepath: str) -> pd.DataFrame:
    """Load CSV data with error handling."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Data file not found: {filepath}")
    return pd.read_csv(filepath)


def save_data(df: pd.DataFrame, filepath: str) -> None:
    """Save DataFrame to CSV."""
    ensure_directory(filepath)
    df.to_csv(filepath, index=False)
    print(f"Data saved to: {filepath}")


def display_summary(df: pd.DataFrame, title: str = "Data Summary") -> None:
    """Display DataFrame summary."""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Shape: {df.shape[0]} rows × {df.shape[1]} columns")
    print(f"\nColumn types:")
    print(df.dtypes)
    print(f"\nFirst 5 rows:")
    print(df.head())
    print(f"\nBasic statistics:")
    print(df.describe())