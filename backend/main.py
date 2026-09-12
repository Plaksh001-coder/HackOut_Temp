import os
import uuid
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.emission_calculator import EmissionCalculator
from services.hotspot_detector import HotspotDetector
from services.recommendation_engine import RecommendationEngine
from services.simulator import WhatIfSimulator
from services.chatbot import GreenMindAssistant
from services.ml_engine import GreenMindML

app = FastAPI(
    title="GreenMind Platform API",
    description="Deterministic Industrial Emission Hotspot Detection & Sustainability Recommendation Platform",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize calculation & intelligence services
calculator = EmissionCalculator()
ml_engine = GreenMindML()
hotspot_detector = HotspotDetector(ml_engine)
recommendation_engine = RecommendationEngine()
simulator = WhatIfSimulator()
assistant = GreenMindAssistant(calculator, recommendation_engine, hotspot_detector, simulator)

# In-Memory Store pre-seeded with GreenTex Manufacturing demo factory
factories_db: Dict[str, Dict[str, Any]] = {
    "demo-greentex": {
        "id": "demo-greentex",
        "name": "GreenTex Manufacturing",
        "industry": "Textile Manufacturing",
        "location": "Surat, Gujarat, India",
        "production_type": "Woven & Knit Textiles",
        "production_volume": 500000,
        "production_volume_unit": "meters/year",
        "activity_data": {
            "electricity_kwh": 100000.0,
            "natural_gas_m3": 25000.0,
            "raw_materials_kg": 5500.0,
            "waste_tonnes": 25.0
        },
        "sustainability_goals": "Achieve 20% carbon reduction in FY 2026-2027",
        "reduction_target_pct": 20.0,
        "budget_inr": 500000.0,
        "created_at": "2026-09-12T10:00:00Z"
    }
}

saved_simulations_db: Dict[str, List[Dict[str, Any]]] = {
    "demo-greentex": [
        {
            "id": "sim-demo-1",
            "factory_id": "demo-greentex",
            "scenario_name": "Solar PV + LED Quick-Win",
            "baseline_emissions": 213.0,
            "scenario_emissions": 170.4,
            "reduction": 42.6,
            "reduction_pct": 20.0,
            "estimated_cost": 450000,
            "estimated_savings": 220000,
            "payback": 2.0,
            "created_at": "2026-09-12T10:15:00Z"
        }
    ]
}

# --- Pydantic Request Models ---
class FactoryCreateRequest(BaseModel):
    name: str
    industry: str
    location: str
    production_type: Optional[str] = "Industrial Production"
    production_volume: Optional[float] = 100000.0
    production_volume_unit: Optional[str] = "units/year"
    electricity_kwh: Optional[float] = 0.0
    natural_gas_m3: Optional[float] = 0.0
    raw_materials_kg: Optional[float] = 0.0
    waste_tonnes: Optional[float] = 0.0
    sustainability_goals: Optional[str] = ""
    reduction_target_pct: Optional[float] = 20.0
    budget_inr: Optional[float] = 500000.0

class CalculateEmissionsRequest(BaseModel):
    electricity_kwh: Optional[float] = 0.0
    natural_gas_m3: Optional[float] = 0.0
    raw_materials_kg: Optional[float] = 0.0
    waste_tonnes: Optional[float] = 0.0
    geography: Optional[str] = "India (CEA)"

class SimulationRequest(BaseModel):
    factory_id: Optional[str] = "demo-greentex"
    electricity_reduction_pct: Optional[float] = 0.0
    renewable_shift_pct: Optional[float] = 0.0
    fuel_reduction_pct: Optional[float] = 0.0
    material_reduction_pct: Optional[float] = 0.0
    waste_reduction_pct: Optional[float] = 0.0
    scenario_name: Optional[str] = "Custom What-If Scenario"

class SaveSimulationRequest(BaseModel):
    scenario_name: str
    baseline_emissions: float
    scenario_emissions: float
    reduction: float
    reduction_pct: float
    estimated_cost: float
    estimated_savings: float
    payback: float

class ChatRequest(BaseModel):
    message: str
    factory_id: Optional[str] = "demo-greentex"
    conversation_history: Optional[List[Dict[str, str]]] = []

# --- API Endpoints ---

@app.get("/")
def root():
    return {
        "platform": "GreenMind",
        "tagline": "Detect. Reduce. Sustain.",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "calculation_engine": "DETERMINISTIC_AUTHORITATIVE"
    }

# 1. Factory Endpoints
@app.post("/api/factories")
def create_factory(req: FactoryCreateRequest):
    new_id = f"fact-{uuid.uuid4().hex[:8]}"
    factory_entry = {
        "id": new_id,
        "name": req.name,
        "industry": req.industry,
        "location": req.location,
        "production_type": req.production_type,
        "production_volume": req.production_volume,
        "production_volume_unit": req.production_volume_unit,
        "activity_data": {
            "electricity_kwh": req.electricity_kwh,
            "natural_gas_m3": req.natural_gas_m3,
            "raw_materials_kg": req.raw_materials_kg,
            "waste_tonnes": req.waste_tonnes
        },
        "sustainability_goals": req.sustainability_goals,
        "reduction_target_pct": req.reduction_target_pct,
        "budget_inr": req.budget_inr,
        "created_at": "2026-09-12T10:30:00Z"
    }
    factories_db[new_id] = factory_entry
    return {"status": "success", "factory": factory_entry}

@app.get("/api/factories/{factory_id}")
def get_factory(factory_id: str):
    if factory_id not in factories_db:
        raise HTTPException(status_code=404, detail="Factory not found")
    return factories_db[factory_id]

@app.put("/api/factories/{factory_id}")
def update_factory(factory_id: str, req: FactoryCreateRequest):
    if factory_id not in factories_db:
        raise HTTPException(status_code=404, detail="Factory not found")
    factory = factories_db[factory_id]
    factory.update({
        "name": req.name,
        "industry": req.industry,
        "location": req.location,
        "production_type": req.production_type,
        "production_volume": req.production_volume,
        "activity_data": {
            "electricity_kwh": req.electricity_kwh,
            "natural_gas_m3": req.natural_gas_m3,
            "raw_materials_kg": req.raw_materials_kg,
            "waste_tonnes": req.waste_tonnes
        },
        "sustainability_goals": req.sustainability_goals,
        "reduction_target_pct": req.reduction_target_pct,
        "budget_inr": req.budget_inr
    })
    return {"status": "success", "factory": factory}

# 2. Emission Endpoints
@app.post("/api/emissions/calculate")
def calculate_emissions_direct(req: CalculateEmissionsRequest):
    activity_dict = {
        "electricity_kwh": req.electricity_kwh,
        "natural_gas_m3": req.natural_gas_m3,
        "raw_materials_kg": req.raw_materials_kg,
        "waste_tonnes": req.waste_tonnes
    }
    return calculator.calculate_emissions(activity_dict, geography=req.geography or "India (CEA)")

@app.get("/api/emissions/{factory_id}")
def get_factory_emissions(factory_id: str):
    if factory_id not in factories_db:
        raise HTTPException(status_code=404, detail="Factory not found")
    factory = factories_db[factory_id]
    emissions = calculator.calculate_emissions(factory["activity_data"])
    return {
        "factory_id": factory_id,
        "factory_name": factory["name"],
        "emissions": emissions
    }

@app.get("/api/emissions/{factory_id}/hotspots")
def get_factory_hotspots(factory_id: str):
    if factory_id not in factories_db:
        raise HTTPException(status_code=404, detail="Factory not found")
    factory = factories_db[factory_id]
    emissions = calculator.calculate_emissions(factory["activity_data"])
    hotspots = hotspot_detector.detect_hotspots(emissions, factory)
    return {
        "factory_id": factory_id,
        "factory_name": factory["name"],
        "total_co2e_tonnes": emissions["total_co2e_tonnes"],
        "hotspot_data": hotspots
    }

# 3. Recommendation Endpoints
@app.post("/api/recommendations")
def get_recommendations_custom(factory_id: Optional[str] = "demo-greentex", weights: Optional[Dict[str, float]] = None):
    factory = factories_db.get(factory_id, factories_db["demo-greentex"])
    emissions = calculator.calculate_emissions(factory["activity_data"])
    hotspots = hotspot_detector.detect_hotspots(emissions, factory)
    return recommendation_engine.generate_recommendations(hotspots, factory, weights)

@app.get("/api/recommendations/{factory_id}")
def get_factory_recommendations(factory_id: str):
    if factory_id not in factories_db:
        raise HTTPException(status_code=404, detail="Factory not found")
    factory = factories_db[factory_id]
    emissions = calculator.calculate_emissions(factory["activity_data"])
    hotspots = hotspot_detector.detect_hotspots(emissions, factory)
    return recommendation_engine.generate_recommendations(hotspots, factory)

# 4. What-If Simulation Endpoints
@app.post("/api/simulations")
def run_simulation(req: SimulationRequest):
    factory = factories_db.get(req.factory_id, factories_db["demo-greentex"])
    result = simulator.simulate(
        factory["activity_data"],
        {
            "electricity_reduction_pct": req.electricity_reduction_pct,
            "renewable_shift_pct": req.renewable_shift_pct,
            "fuel_reduction_pct": req.fuel_reduction_pct,
            "material_reduction_pct": req.material_reduction_pct,
            "waste_reduction_pct": req.waste_reduction_pct
        }
    )
    result["factory_id"] = factory["id"]
    result["scenario_name"] = req.scenario_name
    return result

@app.get("/api/simulations/{factory_id}")
def list_saved_simulations(factory_id: str):
    return {
        "factory_id": factory_id,
        "saved_scenarios": saved_simulations_db.get(factory_id, [])
    }

@app.post("/api/simulations/{factory_id}/save")
def save_simulation(factory_id: str, req: SaveSimulationRequest):
    if factory_id not in saved_simulations_db:
        saved_simulations_db[factory_id] = []
    entry = {
        "id": f"sim-{uuid.uuid4().hex[:6]}",
        "factory_id": factory_id,
        "scenario_name": req.scenario_name,
        "baseline_emissions": req.baseline_emissions,
        "scenario_emissions": req.scenario_emissions,
        "reduction": req.reduction,
        "reduction_pct": req.reduction_pct,
        "estimated_cost": req.estimated_cost,
        "estimated_savings": req.estimated_savings,
        "payback": req.payback,
        "created_at": "2026-09-12T10:35:00Z"
    }
    saved_simulations_db[factory_id].append(entry)
    return {"status": "success", "saved_scenario": entry}

# 5. Chatbot Endpoint
@app.post("/api/chat")
def chat_with_assistant(req: ChatRequest):
    factory = factories_db.get(req.factory_id, factories_db["demo-greentex"])
    context = factory["activity_data"].copy()
    context["budget_inr"] = factory.get("budget_inr", 500000)
    context["industry"] = factory.get("industry", "Textile Manufacturing")
    res = assistant.respond(req.message, context, req.conversation_history)

    # If any activity data was extracted, persist it into the factory context
    if res.get("extracted_data"):
        for k, v in res["extracted_data"].items():
            if k in factory["activity_data"]:
                factory["activity_data"][k] = v
            elif k == "budget_inr":
                factory["budget_inr"] = v

    return res

# 6. Report Endpoint
@app.get("/api/reports/{factory_id}")
def generate_audit_report(factory_id: str):
    if factory_id not in factories_db:
        raise HTTPException(status_code=404, detail="Factory not found")
    factory = factories_db[factory_id]
    emissions = calculator.calculate_emissions(factory["activity_data"])
    hotspots = hotspot_detector.detect_hotspots(emissions, factory)
    recs = recommendation_engine.generate_recommendations(hotspots, factory)
    sims = saved_simulations_db.get(factory_id, [])

    return {
        "report_id": f"REP-GM-{factory_id[:8].upper()}-2026",
        "generated_at": "2026-09-12T10:35:00Z",
        "reporting_year": "2025-2026",
        "factory_profile": factory,
        "emissions_summary": emissions,
        "hotspot_analysis": hotspots,
        "recommended_interventions": recs,
        "saved_scenarios": sims,
        "data_limitations_and_assumptions": emissions.get("assumptions", []),
        "certification_standard": "GHG Protocol Corporate Standard (Scope 1, 2, 3 Deterministic)"
    }
