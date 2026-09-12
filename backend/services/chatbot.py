import os
import re
import json
import logging
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from typing import Dict, List, Any, Optional

from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class GreenMindAssistant:
    def __init__(self, calculation_engine, recommendation_engine, hotspot_detector, simulator):
        self.calculator = calculation_engine
        self.recommender = recommendation_engine
        self.detector = hotspot_detector
        self.simulator = simulator
        self.mistral_api_key = os.getenv("MISTRAL_API_KEY")
        self.mistral_model = os.getenv("MISTRAL_MODEL", "mistral-small-latest")

    def _ask_mistral(
        self,
        message: str,
        context: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None,
        authoritative_reply: Optional[str] = None,
    ) -> Optional[str]:
        """Return a conversational answer while keeping calculations server-authoritative."""
        if not self.mistral_api_key:
            return None

        messages = [
            {
                "role": "system",
                "content": (
                    "You are GreenMind Assistant for a factory sustainability platform. "
                    "Answer clearly and practically in plain text. The user's facility context "
                    "is supplied below. Never invent emissions, costs, or activity values; when "
                    "a calculation is needed, ask the deterministic calculator to handle it. "
                    "Keep replies concise and suggest one useful next step. Do not introduce "
                    "yourself or repeat a generic welcome unless the user explicitly asks who "
                    "you are.\n\n"
                    f"Facility context: {json.dumps(context, default=str)}"
                ),
            }
        ]
        if authoritative_reply:
            messages[0]["content"] += (
                "\n\nThe following draft contains authoritative calculated results. Rewrite it to sound "
                "natural and interactive, but preserve every number, unit, percentage, currency "
                "amount, and factual result exactly. Do not add any new metrics.\n"
                f"Authoritative draft:\n{authoritative_reply}"
            )
        for item in (conversation_history or [])[-6:]:
            role = item.get("sender", item.get("role", "user"))
            messages.append({
                "role": "assistant" if role == "assistant" else "user",
                "content": item.get("content", ""),
            })
        messages.append({"role": "user", "content": message})

        payload = json.dumps({
            "model": self.mistral_model,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 400,
        }).encode("utf-8")
        request = Request(
            "https://api.mistral.ai/v1/chat/completions",
            data=payload,
            headers={
                "Authorization": f"Bearer {self.mistral_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urlopen(request, timeout=20) as response:
                result = json.loads(response.read().decode("utf-8"))
            return result["choices"][0]["message"]["content"].strip()
        except HTTPError as error:
            logger.warning("Mistral API request failed with HTTP %s: %s", error.code, error.reason)
            return None
        except (URLError, TimeoutError, KeyError, IndexError, json.JSONDecodeError) as error:
            logger.warning("Mistral API request failed: %s", error)
            return None

    def parse_natural_language_input(self, message: str) -> Dict[str, Any]:
        """
        Extract numeric activity values and intent from user queries
        """
        extracted = {}
        text = message.lower()

        # Electricity detection: e.g. "100,000 kwh", "50000 units electricity"
        elec_match = re.search(r'([\d,]+(?:\.\d+)?)\s*(?:kwh|units\s+of\s+electricity|kilowatt\s*hours)', text)
        if elec_match:
            val_str = elec_match.group(1).replace(",", "")
            extracted["electricity_kwh"] = float(val_str)

        # Natural gas detection: e.g. "50,000 m3", "50000 natural gas", "50000 cubic meters"
        gas_match = re.search(r'([\d,]+(?:\.\d+)?)\s*(?:m3|m\^3|cubic\s*meters|units\s+of\s+gas|natural\s+gas)', text)
        if gas_match:
            val_str = gas_match.group(1).replace(",", "")
            extracted["natural_gas_m3"] = float(val_str)

        # Waste detection: e.g. "25 tonnes waste", "30 tons"
        waste_match = re.search(r'([\d,]+(?:\.\d+)?)\s*(?:tonnes|tons)\s*(?:of\s*)?(?:waste|landfill)?', text)
        if waste_match:
            val_str = waste_match.group(1).replace(",", "")
            extracted["waste_tonnes"] = float(val_str)

        # Budget detection: e.g. "500,000 inr", "5 lakh budget", "500000 budget"
        budget_match = re.search(r'(?:budget\s*(?:of|is)?\s*|inr\s*|rs\.?\s*|₹\s*)([\d,]+(?:\.\d+)?)', text)
        if budget_match:
            val_str = budget_match.group(1).replace(",", "")
            extracted["budget_inr"] = float(val_str)

        return extracted

    def respond(self, message: str, factory_context: Optional[Dict[str, Any]] = None, conversation_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Handles chat query, extracts structured data if provided, and explains results with zero calculation hallucination.
        """
        text = message.strip().lower()
        extracted = self.parse_natural_language_input(message)
        context = factory_context or {}

        # Update context if new values found
        for k, v in extracted.items():
            context[k] = v

        reply = ""
        structured_action = None

        # 1. Hotspot query
        if "hotspot" in text or "biggest emission" in text or "largest" in text:
            calc = self.calculator.calculate_emissions(context)
            hotspots = self.detector.detect_hotspots(calc, context)
            top = hotspots.get("top_hotspot")
            if top:
                reply = (
                    f"🔎 **Largest Emission Hotspot Identified**:\n\n"
                    f"**{top['source']}** accounts for **{top['percentage']}%** of your annual footprint "
                    f"({top['co2e_tonnes']} tCO₂e/year).\n\n"
                    f"**Why this happened**: Based on your {top['source']} activity level and official emission factors, "
                    f"this source forms the bulk of your operations. {top['reduction_opportunity']}"
                )
                structured_action = {"type": "VIEW_HOTSPOTS", "data": hotspots}
            else:
                reply = "I haven't analyzed your full factory data yet. Would you like to enter your annual electricity and fuel consumption?"

        # 2. What-If Simulation query
        elif "what-if" in text or "simulate" in text or "scenario" in text:
            reduction_match = re.search(r"(\d+(?:\.\d+)?)\s*%\s*(?:cut|reduction|reduction in|less)", text)
            reduction_pct = float(reduction_match.group(1)) if reduction_match else 20.0
            sim = self.simulator.simulate(context, {"electricity_reduction_pct": reduction_pct, "renewable_shift_pct": 0})
            reply = (
                f"📊 **What-If Scenario Simulation ({reduction_pct:g}% Electricity Efficiency)**:\n\n"
                f"- **Baseline Emissions**: {sim['baseline_total_tco2e']} tCO₂e/year\n"
                f"- **Simulated Emissions**: {sim['scenario_total_tco2e']} tCO₂e/year\n"
                f"- **Total Reduction**: {sim['co2_reduction_tco2e']} tCO₂e/year (**{sim['reduction_percentage']}%** reduction)\n"
                f"- **Estimated Annual Savings**: ₹{sim['estimated_annual_savings_inr']:,.0f}/year\n"
                f"- **Estimated Capex**: ₹{sim['estimated_implementation_cost_inr']:,.0f}\n"
                f"- **Payback**: {sim['payback_years']} years\n\n"
                f"You can test live interactive sliders on the dedicated **What-If Simulator** page."
            )
            structured_action = {"type": "SIMULATION_RESULT", "data": sim}

        # 3. Recommendation query
        elif "recommend" in text or "action" in text or "reduce" in text or "cut" in text:
            calc = self.calculator.calculate_emissions(context)
            hotspots = self.detector.detect_hotspots(calc, context)
            recs = self.recommender.generate_recommendations(hotspots, context)
            top_rec = recs["recommendations"][0] if recs["recommendations"] else None
            if top_rec:
                reply = (
                    f"💡 **Top Recommended Action**:\n\n"
                    f"**{top_rec['intervention']}** (Priority #{top_rec['rank']})\n"
                    f"- **Target Hotspot**: {top_rec['target_hotspot']}\n"
                    f"- **Estimated Capex**: ₹{top_rec['estimated_cost_inr']:,.0f} ({top_rec['cost_bracket']})\n"
                    f"- **Expected Abatement**: {top_rec['expected_co2_reduction_tco2e']} tCO₂e/year\n"
                    f"- **Payback Period**: {top_rec['payback_years']} years\n\n"
                    f"**Why it was recommended**: {top_rec['why_recommended']}"
                )
                structured_action = {"type": "VIEW_RECOMMENDATIONS", "data": recs}
            else:
                reply = "Please share your factory's electricity and fuel consumption so I can compute ranked interventions for your budget."

        # 4. Data entry ingestion
        elif extracted:
            parts = []
            if "electricity_kwh" in extracted:
                parts.append(f"Electricity: {extracted['electricity_kwh']:,.0f} kWh/year")
            if "natural_gas_m3" in extracted:
                parts.append(f"Natural Gas: {extracted['natural_gas_m3']:,.0f} m³/year")
            if "waste_tonnes" in extracted:
                parts.append(f"Industrial Waste: {extracted['waste_tonnes']} tonnes/year")
            if "budget_inr" in extracted:
                parts.append(f"Sustainability Budget: ₹{extracted['budget_inr']:,.0f}")

            calc = self.calculator.calculate_emissions(context)
            reply = (
                f"✅ **Recorded Activity Data**:\n" +
                "\n".join([f"- {p}" for p in parts]) +
                f"\n\n**Deterministic Calculation Update**:\n"
                f"- **Updated Annual Footprint**: **{calc['total_co2e_tonnes']} tCO₂e/year**\n"
                f"- **Scope 2 (Electricity)**: {calc['scope_breakdown']['Scope 2']} tCO₂e\n"
                f"- **Scope 1 (Direct Fuel)**: {calc['scope_breakdown']['Scope 1']} tCO₂e\n\n"
                f"Would you like me to detect your top hotspot or suggest budget-aware recommendations?"
            )
            structured_action = {"type": "DATA_UPDATED", "extracted": extracted, "calculation": calc}

        # 5. General / Welcome / Fallback
        else:
            reply = self._ask_mistral(message, context, conversation_history) or (
                "Tell me what you want to analyze: energy use, emission hotspots, "
                "reduction actions, budget options, or a what-if scenario."
            )

        if structured_action and reply:
            reply = self._ask_mistral(
                message,
                context,
                conversation_history,
                authoritative_reply=reply,
            ) or reply

        return {
            "reply": reply,
            "extracted_data": extracted,
            "structured_action": structured_action,
            "updated_context": context
        }
