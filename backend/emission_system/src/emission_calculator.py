"""
Core emission calculation module.
"""

import pandas as pd
from typing import Dict, Optional
from .config import FACTOR_IDS, EMISSION_FACTORS_PATH


class EmissionCalculator:
    """Calculate emissions using standardized emission factors."""

    def __init__(self, factors_path: str = EMISSION_FACTORS_PATH):
        """Initialize with emission factors dataframe."""
        self.factors_df = pd.read_csv(factors_path)
        self.factors_dict = self._build_factors_dict()

    def _build_factors_dict(self) -> Dict[str, float]:
        """Build a dictionary of factor_id -> factor value."""
        return dict(
            zip(
                self.factors_df["factor_id"],
                self.factors_df["factor_kgco2e_per_unit"],
            )
        )

    def get_factor(self, factor_id: str) -> float:
        """Get emission factor by ID."""
        if factor_id not in self.factors_dict:
            raise ValueError(f"Emission factor not found: {factor_id}")
        return self.factors_dict[factor_id]

    def calculate_electricity_emissions(
        self, electricity_kwh: float, renewable_kwh: float = 0
    ) -> float:
        """
        Calculate electricity emissions.

        Args:
            electricity_kwh: Total electricity consumed (kWh)
            renewable_kwh: On-site renewable electricity (kWh)

        Returns:
            Emissions in kgCO2e
        """
        grid_factor = self.get_factor(FACTOR_IDS["electricity"])
        solar_factor = self.get_factor(FACTOR_IDS["solar"])

        grid_emissions = (electricity_kwh - renewable_kwh) * grid_factor
        solar_emissions = renewable_kwh * solar_factor

        return round(grid_emissions + solar_emissions, 2)

    def calculate_fuel_emissions(
        self,
        diesel_litre: float = 0,
        petrol_litre: float = 0,
        natural_gas_scm: float = 0,
        lpg_kg: float = 0,
        coal_kg: float = 0,
        furnace_oil_litre: float = 0,
    ) -> Dict[str, float]:
        """
        Calculate fuel combustion emissions.

        Returns:
            Dictionary of emissions by fuel type (kgCO2e)
        """
        emissions = {}

        if diesel_litre > 0:
            emissions["diesel"] = round(
                diesel_litre * self.get_factor(FACTOR_IDS["diesel"]), 2
            )

        if petrol_litre > 0:
            emissions["petrol"] = round(
                petrol_litre * self.get_factor(FACTOR_IDS["petrol"]), 2
            )

        if natural_gas_scm > 0:
            emissions["natural_gas"] = round(
                natural_gas_scm * self.get_factor(FACTOR_IDS["natural_gas"]), 2
            )

        if lpg_kg > 0:
            emissions["lpg"] = round(
                lpg_kg * self.get_factor(FACTOR_IDS["lpg"]), 2
            )

        if coal_kg > 0:
            emissions["coal"] = round(
                coal_kg * self.get_factor(FACTOR_IDS["coal"]), 2
            )

        if furnace_oil_litre > 0:
            emissions["furnace_oil"] = round(
                furnace_oil_litre * self.get_factor(FACTOR_IDS["furnace_oil"]), 2
            )

        return emissions

    def calculate_waste_emissions(
        self,
        organic_landfill_kg: float = 0,
        organic_compost_kg: float = 0,
    ) -> Dict[str, float]:
        """
        Calculate waste treatment emissions.

        Returns:
            Dictionary of emissions by waste pathway (kgCO2e)
        """
        emissions = {}

        if organic_landfill_kg > 0:
            emissions["landfill"] = round(
                organic_landfill_kg * self.get_factor(FACTOR_IDS["waste_landfill"]), 2
            )

        if organic_compost_kg > 0:
            emissions["compost"] = round(
                organic_compost_kg * self.get_factor(FACTOR_IDS["waste_compost"]), 2
            )

        return emissions

    def calculate_material_emissions(
        self,
        steel_kg: float = 0,
        cement_kg: float = 0,
        cotton_kg: float = 0,
    ) -> Dict[str, float]:
        """
        Calculate embodied emissions from materials (Scope 3).

        Returns:
            Dictionary of emissions by material (kgCO2e)
        """
        emissions = {}

        if steel_kg > 0:
            emissions["steel"] = round(
                steel_kg * self.get_factor(FACTOR_IDS["steel"]), 2
            )

        if cement_kg > 0:
            emissions["cement"] = round(
                cement_kg * self.get_factor(FACTOR_IDS["cement"]), 2
            )

        if cotton_kg > 0:
            emissions["cotton"] = round(
                cotton_kg * self.get_factor(FACTOR_IDS["cotton"]), 2
            )

        return emissions

    def calculate_row_emissions(self, row: pd.Series) -> pd.Series:
        """
        Calculate all emissions for a single data row.

        Args:
            row: DataFrame row with activity data

        Returns:
            Series with calculated emission columns
        """
        # Electricity
        electricity_kwh = row.get("electricity_kwh", 0)
        renewable_kwh = row.get("renewable_electricity_kwh", 0)
        electricity_emissions = self.calculate_electricity_emissions(
            electricity_kwh, renewable_kwh
        )

        # Fuels
        fuel_emissions = self.calculate_fuel_emissions(
            diesel_litre=row.get("diesel_litre", 0),
            petrol_litre=row.get("petrol_litre", 0),
            natural_gas_scm=row.get("natural_gas_scm", 0),
            lpg_kg=row.get("lpg_kg", 0),
            coal_kg=row.get("coal_kg", 0),
            furnace_oil_litre=row.get("furnace_oil_litre", 0),
        )

        # Waste
        waste_emissions = self.calculate_waste_emissions(
            organic_landfill_kg=row.get("organic_landfill_waste_kg", 0),
            organic_compost_kg=row.get("organic_compost_waste_kg", 0),
        )

        # Materials (Scope 3)
        material_emissions = self.calculate_material_emissions(
            steel_kg=row.get("steel_kg", 0),
            cement_kg=row.get("cement_kg", 0),
            cotton_kg=row.get("cotton_kg", 0),
        )

        # Aggregate
        scope1_emissions = sum(
            [
                fuel_emissions.get("diesel", 0),
                fuel_emissions.get("petrol", 0),
                fuel_emissions.get("natural_gas", 0),
                fuel_emissions.get("lpg", 0),
                fuel_emissions.get("coal", 0),
                fuel_emissions.get("furnace_oil", 0),
            ]
        )

        scope2_emissions = electricity_emissions

        scope3_emissions = sum(material_emissions.values())

        waste_total = sum(waste_emissions.values())

        total_emissions = scope1_emissions + scope2_emissions + scope3_emissions + waste_total

        return pd.Series(
            {
                "electricity_emissions_kgco2e": electricity_emissions,
                "diesel_emissions_kgco2e": fuel_emissions.get("diesel", 0),
                "petrol_emissions_kgco2e": fuel_emissions.get("petrol", 0),
                "natural_gas_emissions_kgco2e": fuel_emissions.get("natural_gas", 0),
                "lpg_emissions_kgco2e": fuel_emissions.get("lpg", 0),
                "coal_emissions_kgco2e": fuel_emissions.get("coal", 0),
                "furnace_oil_emissions_kgco2e": fuel_emissions.get("furnace_oil", 0),
                "landfill_emissions_kgco2e": waste_emissions.get("landfill", 0),
                "compost_emissions_kgco2e": waste_emissions.get("compost", 0),
                "steel_emissions_kgco2e": material_emissions.get("steel", 0),
                "cement_emissions_kgco2e": material_emissions.get("cement", 0),
                "cotton_emissions_kgco2e": material_emissions.get("cotton", 0),
                "scope1_emissions_kgco2e": round(scope1_emissions, 2),
                "scope2_emissions_kgco2e": round(scope2_emissions, 2),
                "scope3_emissions_kgco2e": round(scope3_emissions, 2),
                "waste_emissions_kgco2e": round(waste_total, 2),
                "total_emissions_kgco2e": round(total_emissions, 2),
                "total_emissions_tco2e": round(total_emissions / 1000, 4),
            }
        )

    def calculate_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate emissions for entire DataFrame.

        Args:
            df: DataFrame with activity data columns

        Returns:
            DataFrame with original + calculated emission columns
        """
        emission_cols = df.apply(self.calculate_row_emissions, axis=1)
        return pd.concat([df.reset_index(drop=True), emission_cols], axis=1)