import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from services.emission_calculator import EmissionCalculator
from services.hotspot_detector import HotspotDetector
from services.recommendation_engine import RecommendationEngine
from services.simulator import WhatIfSimulator
from services.chatbot import GreenMindAssistant

demo_data = {
    "electricity_kwh": 100000.0,
    "natural_gas_m3": 50000.0,
    "raw_materials_kg": 40000.0,
    "waste_tonnes": 25.0
}

calc = EmissionCalculator()
res = calc.calculate_emissions(demo_data)
print("SUCCESS Total CO2e:", res["total_co2e_tonnes"])
print("SUCCESS Sources:", [s["source"] + ": " + str(s["percentage"]) + "%" for s in res["sources"]])

detector = HotspotDetector()
hotspots = detector.detect_hotspots(res)
print("SUCCESS Top Hotspot:", hotspots["top_hotspot"]["source"], hotspots["top_hotspot"]["percentage"], "%")

recommender = RecommendationEngine()
recs = recommender.generate_recommendations(hotspots, {"budget_inr": 500000})
print("SUCCESS Top Rec:", recs["top_three"][0]["intervention"], "Score:", recs["top_three"][0]["score"])

sim = WhatIfSimulator()
sim_res = sim.simulate(demo_data, {"electricity_reduction_pct": 20})
print("SUCCESS Sim 20% elec reduction:", sim_res["co2_reduction_tco2e"], "tCO2e saved")
