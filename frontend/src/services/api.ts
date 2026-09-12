import {
  FactoryProfile,
  EmissionCalculation,
  HotspotAnalysis,
  RecommendationResult,
  SimulationParams,
  SimulationResult,
  SavedScenario
} from '../types';
import {
  DEMO_FACTORY,
  INITIAL_SAVED_SCENARIOS,
  calculateEmissionsDeterministic,
  detectHotspotsDeterministic,
  generateRecommendationsDeterministic,
  simulateDeterministic
} from './fallbackEngine';

const API_BASE = '/api';

export async function fetchFactory(factoryId: string = "demo-greentex"): Promise<FactoryProfile> {
  try {
    const res = await fetch(`${API_BASE}/factories/${factoryId}`);
    if (!res.ok) throw new Error("Backend response not ok");
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Using local fallback factory profile:", err);
    return DEMO_FACTORY;
  }
}

export async function calculateEmissions(
  activity: FactoryProfile['activity_data'],
  geography: string = "India (CEA)"
): Promise<EmissionCalculation> {
  try {
    const res = await fetch(`${API_BASE}/emissions/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...activity, geography })
    });
    if (!res.ok) throw new Error("Backend calculate error");
    return await res.json();
  } catch (err) {
    console.warn("Using local deterministic calculation fallback:", err);
    return calculateEmissionsDeterministic(activity, geography);
  }
}

export async function fetchHotspots(factoryId: string = "demo-greentex"): Promise<HotspotAnalysis> {
  try {
    const res = await fetch(`${API_BASE}/emissions/${factoryId}/hotspots`);
    if (!res.ok) throw new Error("Backend hotspots error");
    const data = await res.json();
    return data.hotspot_data;
  } catch (err) {
    console.warn("Using local hotspot detection fallback:", err);
    const calc = calculateEmissionsDeterministic(DEMO_FACTORY.activity_data);
    return detectHotspotsDeterministic(calc);
  }
}

export async function fetchRecommendations(
  factoryId: string = "demo-greentex",
  budgetInr: number = 500000
): Promise<RecommendationResult> {
  try {
    const res = await fetch(`${API_BASE}/recommendations/${factoryId}`);
    if (!res.ok) throw new Error("Backend recommendation error");
    return await res.json();
  } catch (err) {
    console.warn("Using local recommendation fallback:", err);
    const calc = calculateEmissionsDeterministic(DEMO_FACTORY.activity_data);
    const hotspots = detectHotspotsDeterministic(calc);
    return generateRecommendationsDeterministic(hotspots, budgetInr);
  }
}

export async function runSimulation(
  factoryId: string = "demo-greentex",
  params: SimulationParams,
  activity?: FactoryProfile['activity_data']
): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/simulations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ factory_id: factoryId, ...params })
    });
    if (!res.ok) throw new Error("Backend simulation error");
    return await res.json();
  } catch (err) {
    console.warn("Using local simulation fallback:", err);
    const currentActivity = activity || DEMO_FACTORY.activity_data;
    return simulateDeterministic(currentActivity, params);
  }
}

export async function fetchSavedScenarios(factoryId: string = "demo-greentex"): Promise<SavedScenario[]> {
  try {
    const res = await fetch(`${API_BASE}/simulations/${factoryId}`);
    if (!res.ok) throw new Error("Backend saved simulations error");
    const data = await res.json();
    return data.saved_scenarios || [];
  } catch (err) {
    console.warn("Using local saved simulations fallback:", err);
    return INITIAL_SAVED_SCENARIOS;
  }
}

export async function saveSimulationScenario(
  factoryId: string = "demo-greentex",
  scenario: Omit<SavedScenario, 'id' | 'factory_id' | 'created_at'>
): Promise<SavedScenario> {
  try {
    const res = await fetch(`${API_BASE}/simulations/${factoryId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario)
    });
    if (!res.ok) throw new Error("Backend save scenario error");
    const data = await res.json();
    return data.saved_scenario;
  } catch (err) {
    console.warn("Using local save fallback:", err);
    return {
      id: `sim-${Date.now().toString().slice(-4)}`,
      factory_id: factoryId,
      ...scenario,
      created_at: new Date().toISOString()
    };
  }
}

export async function sendChatMessage(
  message: string,
  factoryId: string = "demo-greentex",
  history: any[] = []
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, factory_id: factoryId, conversation_history: history })
    });
    if (!res.ok) throw new Error("Backend chat error");
    return await res.json();
  } catch (err) {
    console.warn("Using local chat assistant fallback:", err);
    const text = message.toLowerCase();
    if (text.includes("hotspot")) {
      return {
        reply: "🔎 **Largest Emission Hotspot Identified**:\n\n**Electricity** accounts for **48.2%** of your annual footprint (82.0 tCO₂e/year).\n\n**Why this happened**: Grid electricity forms your highest energy consumption. Rooftop solar, IE4 motor upgrades, and VFD compressors offer rapid payback.",
        extracted_data: {}
      };
    } else if (text.includes("recommend") || text.includes("action")) {
      return {
        reply: "💡 **Top Recommended Action**:\n\n**IE4 Super-Premium Motor Upgrade**\n- **Target Hotspot**: Electricity\n- **Estimated Capex**: ₹1,80,000 (Medium Cost)\n- **Expected Abatement**: 16.5 tCO₂e/year\n- **Payback Period**: 1.8 years\n\nFits within your ₹5,00,000 budget and reduces peak electrical draw.",
        extracted_data: {}
      };
    } else if (text.includes("what-if") || text.includes("simulate")) {
      return {
        reply: "📊 **What-If Simulation (20% Electricity Reduction)**:\n\n- Baseline: 170.1 tCO₂e/year\n- Scenario: 153.7 tCO₂e/year\n- **Reduction**: 16.4 tCO₂e/year (9.6% overall factory reduction)\n- **Annual Savings**: ₹1,70,000/year\n- **Estimated Capex**: ₹44,000\n- **Payback**: 0.3 years\n\nVisit the What-If Simulator tab for real-time slider controls!",
        extracted_data: {}
      };
    }
    return {
      reply: "👋 Hello! I am the **GreenMind Assistant**. You can enter activity numbers (e.g. *'Our factory uses 100,000 kWh of electricity'*), ask for your top hotspots, or test What-If scenarios.",
      extracted_data: {}
    };
  }
}
