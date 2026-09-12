import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FactoryProfile,
  ActivityData,
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
} from '../services/fallbackEngine';

interface FactoryContextType {
  factory: FactoryProfile;
  emissions: EmissionCalculation;
  hotspots: HotspotAnalysis;
  recommendations: RecommendationResult;
  simParams: SimulationParams;
  simResult: SimulationResult;
  savedScenarios: SavedScenario[];
  activeTab: string;
  geography: string;
  currency: string;
  currencySymbol: string;
  setActiveTab: (tab: string) => void;
  setGeography: (geo: string) => void;
  setCurrency: (curr: string) => void;
  updateActivityData: (data: Partial<ActivityData>) => void;
  updateFactoryProfile: (profile: Partial<FactoryProfile>) => void;
  updateSimParams: (params: Partial<SimulationParams>) => void;
  saveCurrentScenario: (name: string) => void;
  resetToDemo: () => void;
  formatCurrency: (amount: number) => string;
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [factory, setFactory] = useState<FactoryProfile>(DEMO_FACTORY);
  const [geography, setGeography] = useState<string>("India (CEA)");
  const [currency, setCurrency] = useState<string>("INR");
  const [activeTab, setActiveTab] = useState<string>("landing");

  // Calculations
  const [emissions, setEmissions] = useState<EmissionCalculation>(() =>
    calculateEmissionsDeterministic(DEMO_FACTORY.activity_data, "India (CEA)")
  );
  const [hotspots, setHotspots] = useState<HotspotAnalysis>(() =>
    detectHotspotsDeterministic(emissions)
  );
  const [recommendations, setRecommendations] = useState<RecommendationResult>(() =>
    generateRecommendationsDeterministic(hotspots, DEMO_FACTORY.budget_inr)
  );

  // Simulator
  const [simParams, setSimParams] = useState<SimulationParams>({
    electricity_reduction_pct: 20,
    renewable_shift_pct: 0,
    fuel_reduction_pct: 0,
    material_reduction_pct: 0,
    waste_reduction_pct: 0
  });

  const [simResult, setSimResult] = useState<SimulationResult>(() =>
    simulateDeterministic(DEMO_FACTORY.activity_data, {
      electricity_reduction_pct: 20,
      renewable_shift_pct: 0,
      fuel_reduction_pct: 0,
      material_reduction_pct: 0,
      waste_reduction_pct: 0
    }, "India (CEA)")
  );

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(INITIAL_SAVED_SCENARIOS);

  // Recalculate whenever activity data or geography changes
  useEffect(() => {
    const newCalc = calculateEmissionsDeterministic(factory.activity_data, geography);
    setEmissions(newCalc);
    const newHotspots = detectHotspotsDeterministic(newCalc);
    setHotspots(newHotspots);
    const newRecs = generateRecommendationsDeterministic(newHotspots, factory.budget_inr);
    setRecommendations(newRecs);
    const newSim = simulateDeterministic(factory.activity_data, simParams, geography);
    setSimResult(newSim);
  }, [factory.activity_data, factory.budget_inr, geography]);

  // Recalculate simulation when simParams change
  useEffect(() => {
    const newSim = simulateDeterministic(factory.activity_data, simParams, geography);
    setSimResult(newSim);
  }, [simParams, factory.activity_data, geography]);

  const updateActivityData = (data: Partial<ActivityData>) => {
    setFactory(prev => ({
      ...prev,
      activity_data: { ...prev.activity_data, ...data }
    }));
  };

  const updateFactoryProfile = (profile: Partial<FactoryProfile>) => {
    setFactory(prev => ({ ...prev, ...profile }));
  };

  const updateSimParams = (params: Partial<SimulationParams>) => {
    setSimParams(prev => ({ ...prev, ...params }));
  };

  const saveCurrentScenario = (name: string) => {
    const newScenario: SavedScenario = {
      id: `sim-${Date.now()}`,
      factory_id: factory.id,
      scenario_name: name || `Scenario (${simResult.reduction_percentage}% reduction)`,
      baseline_emissions: simResult.baseline_total_tco2e,
      scenario_emissions: simResult.scenario_total_tco2e,
      reduction: simResult.co2_reduction_tco2e,
      reduction_pct: simResult.reduction_percentage,
      estimated_cost: simResult.estimated_implementation_cost_inr,
      estimated_savings: simResult.estimated_annual_savings_inr,
      payback: simResult.payback_years,
      created_at: new Date().toISOString()
    };
    setSavedScenarios(prev => [newScenario, ...prev]);
  };

  const resetToDemo = () => {
    setFactory(DEMO_FACTORY);
    setGeography("India (CEA)");
    setSimParams({
      electricity_reduction_pct: 20,
      renewable_shift_pct: 0,
      fuel_reduction_pct: 0,
      material_reduction_pct: 0,
      waste_reduction_pct: 0
    });
  };

  const formatCurrency = (amount: number): string => {
    if (currency === "USD") {
      const usdAmount = amount / 85;
      return `$${Math.round(usdAmount).toLocaleString('en-US')}`;
    }
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  const currencySymbol = currency === "USD" ? "$" : "₹";

  return (
    <FactoryContext.Provider
      value={{
        factory,
        emissions,
        hotspots,
        recommendations,
        simParams,
        simResult,
        savedScenarios,
        activeTab,
        geography,
        currency,
        currencySymbol,
        setActiveTab,
        setGeography,
        setCurrency,
        updateActivityData,
        updateFactoryProfile,
        updateSimParams,
        saveCurrentScenario,
        resetToDemo,
        formatCurrency
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error("useFactory must be used within a FactoryProvider");
  }
  return context;
};
