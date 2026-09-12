"""
Configuration and constants for emission calculation system.
"""

# File paths
EMISSION_FACTORS_PATH = "data/emission_factors.csv"
INPUT_DATA_PATH = "data/industrial_data.csv"
OUTPUT_EMISSIONS_PATH = "output/emissions_calculated.csv"
OUTPUT_RECOMMENDATIONS_PATH = "output/recommendations.csv"

# Emission factor IDs (must match your emission_factors.csv)
FACTOR_IDS = {
    "electricity": "IND_ELEC_GRID",
    "solar": "IND_ELEC_SOLAR",
    "diesel": "FUEL_DIESEL",
    "petrol": "FUEL_PETROL",
    "natural_gas": "FUEL_NG",
    "lpg": "FUEL_LPG",
    "coal": "FUEL_COAL",
    "furnace_oil": "FUEL_FO",
    "waste_landfill": "WASTE_ORGANIC_LANDFILL",
    "waste_compost": "WASTE_ORGANIC_COMPOST",
    "steel": "MATERIAL_STEEL",
    "cement": "MATERIAL_CEMENT",
    "cotton": "MATERIAL_COTTON_FIBER",
}

# Scoring benchmarks (emissions per unit production in kgCO2e/unit)
# Adjust these based on your industry benchmarks
BENCHMARKS = {
    "emissions_per_unit": {
        "good": 0.5,    # Best-in-class performance
        "bad": 5.0,     # Poor performance threshold
    },
    "energy_intensity": {
        "good": 1.0,
        "bad": 10.0,
    },
}

# Intervention impact factors (fraction of emissions reducible)
INTERVENTION_IMPACTS = {
    "IE4 Motor": 0.15,
    "LED Lighting": 0.08,
    "VFD Installation": 0.12,
    "Solar Rooftop": 0.25,
    "Energy Audit": 0.10,
    "Power Factor Correction": 0.07,
    "HVAC Optimization": 0.10,
    "Compressed Air Optimization": 0.12,
    "Smart Metering": 0.05,
    "Boiler Optimization": 0.18,
    "Heat Recovery": 0.20,
    "Insulation Upgrade": 0.15,
    "Process Optimization": 0.22,
    "Burner Upgrade": 0.16,
    "Steam Trap Maintenance": 0.08,
    "Generator Efficiency": 0.14,
    "Fuel Switching": 0.30,
    "Fleet Optimization": 0.12,
    "Hybrid Systems": 0.25,
    "Maintenance Schedule": 0.06,
    "Waste Segregation": 0.10,
    "Recycling Program": 0.18,
    "Composting": 0.12,
    "Waste-to-Energy": 0.28,
    "Material Recovery": 0.15,
    "Zero Waste Initiative": 0.22,
}

# Intervention recommendations by hotspot
INTERVENTIONS_BY_HOTSPOT = {
    "Electricity": [
        "IE4 Motor",
        "LED Lighting",
        "VFD Installation",
        "Solar Rooftop",
        "Energy Audit",
        "Power Factor Correction",
        "HVAC Optimization",
        "Compressed Air Optimization",
        "Smart Metering",
    ],
    "Natural Gas": [
        "Boiler Optimization",
        "Heat Recovery",
        "Insulation Upgrade",
        "Process Optimization",
        "Burner Upgrade",
        "Steam Trap Maintenance",
    ],
    "Diesel": [
        "Generator Efficiency",
        "Fuel Switching",
        "Fleet Optimization",
        "Hybrid Systems",
        "Maintenance Schedule",
    ],
    "Waste": [
        "Waste Segregation",
        "Recycling Program",
        "Composting",
        "Waste-to-Energy",
        "Material Recovery",
        "Zero Waste Initiative",
    ],
}