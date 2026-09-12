import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Sliders,
  Zap,
  Sun,
  Flame,
  Package,
  Trash2,
  TrendingDown,
  DollarSign,
  Clock,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  TreePine,
  Car,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

export const WhatIfSimulatorPage: React.FC = () => {
  const {
    factory,
    simParams,
    simResult,
    savedScenarios,
    updateSimParams,
    saveCurrentScenario,
    formatCurrency
  } = useFactory();

  const [scenarioNameInput, setScenarioNameInput] = useState<string>('');
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

  const handlePreset = (preset: {
    elec: number;
    renew: number;
    fuel: number;
    mat: number;
    waste: number;
  }) => {
    updateSimParams({
      electricity_reduction_pct: preset.elec,
      renewable_shift_pct: preset.renew,
      fuel_reduction_pct: preset.fuel,
      material_reduction_pct: preset.mat,
      waste_reduction_pct: preset.waste
    });
  };

  const handleSave = () => {
    const defaultName = `${simResult.reduction_percentage}% Cut (${simParams.electricity_reduction_pct}% Elec, ${simParams.renewable_shift_pct}% Solar)`;
    saveCurrentScenario(scenarioNameInput.trim() || defaultName);
    setScenarioNameInput('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const comparisonChartData = simResult.comparison_breakdown.map((item) => ({
    name: item.source,
    Current: item.baseline_tco2e,
    Simulated: item.scenario_tco2e
  }));

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-mint-700 bg-mint-50 border border-mint-200 px-3 py-1 rounded-full uppercase tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5 text-mint-600" />
              <span>Core Innovation • Scenario Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 font-display">
              What-If Sustainability Simulator
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-industrial-600 leading-relaxed max-w-2xl">
              Test reduction strategies before capital commitment. Adjust the sliders to simulate changes in electricity,
              rooftop solar, fuels, and materials—calculated with deterministic precision.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-industrial-500 uppercase tracking-wide mr-1">Presets:</span>
            <button
              onClick={() => handlePreset({ elec: 20, renew: 0, fuel: 10, mat: 0, waste: 10 })}
              className="px-3 py-1.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-xs font-semibold text-industrial-700 transition-all"
            >
              Quick Wins
            </button>
            <button
              onClick={() => handlePreset({ elec: 10, renew: 40, fuel: 0, mat: 0, waste: 0 })}
              className="px-3 py-1.5 rounded-xl bg-mint-50 hover:bg-mint-100 text-xs font-semibold text-forest-900 border border-mint-200 transition-all"
            >
              Solar Leap
            </button>
            <button
              onClick={() => handlePreset({ elec: 25, renew: 35, fuel: 25, mat: 15, waste: 30 })}
              className="px-3 py-1.5 rounded-xl bg-forest-900 text-white hover:bg-forest-850 text-xs font-semibold transition-all shadow-soft"
            >
              Deep Decarbonization
            </button>
            <button
              onClick={() => handlePreset({ elec: 0, renew: 0, fuel: 0, mat: 0, waste: 0 })}
              className="p-1.5 rounded-xl text-industrial-400 hover:text-industrial-700 hover:bg-sage-100 transition-all"
              title="Reset Sliders to Zero"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CORE COMPARISON HEADLINE BANNER (Current vs Scenario) */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-6 sm:p-8 text-white shadow-elevated border border-forest-900">
        <div className="text-xs font-bold uppercase tracking-widest text-mint-400 mb-4 flex items-center gap-2">
          <span>Deterministic Impact Forecast</span>
          <span className="text-[10px] bg-mint-500/20 px-2 py-0.5 rounded-full border border-mint-400/30">Live Model</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Current */}
          <div className="bg-forest-900/80 p-5 rounded-2xl border border-forest-800">
            <span className="text-xs uppercase font-semibold text-sage-300 block">Current Footprint</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black font-display text-white">
                {simResult.baseline_total_tco2e}
              </span>
              <span className="text-xs text-sage-300 font-medium">tCO₂e/yr</span>
            </div>
            <span className="text-[11px] text-sage-400 mt-2 block">Factory baseline</span>
          </div>

          {/* Scenario */}
          <div className="bg-forest-900/80 p-5 rounded-2xl border border-forest-800">
            <span className="text-xs uppercase font-semibold text-mint-300 block">Scenario Footprint</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black font-display text-mint-300">
                {simResult.scenario_total_tco2e}
              </span>
              <span className="text-xs text-mint-200/70 font-medium">tCO₂e/yr</span>
            </div>
            <span className="text-[11px] text-mint-300/80 mt-2 block">With active simulation</span>
          </div>

          {/* CO2 Reduction */}
          <div className="bg-forest-900/80 p-5 rounded-2xl border border-forest-800">
            <span className="text-xs uppercase font-semibold text-mint-400 block">CO₂ Abatement</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black font-display text-white">
                -{simResult.co2_reduction_tco2e}
              </span>
              <span className="text-xs text-mint-300 font-medium">tCO₂e</span>
            </div>
            <span className="text-[11px] font-bold text-mint-300 mt-2 block">
              {simResult.reduction_percentage}% reduction
            </span>
          </div>

          {/* Financial Return */}
          <div className="bg-forest-900/80 p-5 rounded-2xl border border-forest-800">
            <span className="text-xs uppercase font-semibold text-sage-300 block">Annual Savings</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-display text-white">
                {formatCurrency(simResult.estimated_annual_savings_inr)}
              </span>
              <span className="text-xs text-sage-300 font-medium">/yr</span>
            </div>
            <span className="text-[11px] text-sage-300 mt-2 block">
              Capex {formatCurrency(simResult.estimated_implementation_cost_inr)} • {simResult.payback_years} yrs payback
            </span>
          </div>
        </div>

        {/* Environmental Equivalency Strip */}
        <div className="mt-6 pt-6 border-t border-forest-800/80 flex flex-wrap items-center gap-6 text-xs text-sage-200">
          <div className="flex items-center gap-2">
            <TreePine className="w-4 h-4 text-mint-400" />
            <span>Equivalent to planting <strong>{simResult.environmental_equivalent.trees_planted_equivalent.toLocaleString()}</strong> mature trees/year</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-mint-400" />
            <span>Equivalent to taking <strong>{simResult.environmental_equivalent.cars_off_road_equivalent}</strong> passenger vehicles off the road</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SLIDERS & DYNAMIC COMPARISON CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Column (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-card space-y-6">
          <div className="pb-4 border-b border-sage-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-forest-950 font-display">
                Intervention Adjustment Levers
              </h3>
              <p className="text-xs text-industrial-500">
                Move levers to test percentage reductions across operations
              </p>
            </div>
            <span className="text-xs font-semibold text-mint-700 bg-mint-50 px-2.5 py-1 rounded-lg border border-mint-200">
              Interactive
            </span>
          </div>

          {/* Slider 1: Electricity Reduction */}
          <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-forest-950">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Electricity Efficiency Cut</span>
              </div>
              <span className="font-mono font-black text-forest-950 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-sage-200">
                {simParams.electricity_reduction_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={simParams.electricity_reduction_pct}
              onChange={(e) => updateSimParams({ electricity_reduction_pct: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-industrial-400 font-medium">
              <span>0% (As Is)</span>
              <span>LED, IE4 motors, VFD compressors</span>
              <span>50% Max</span>
            </div>
          </div>

          {/* Slider 2: Renewable Energy Shift */}
          <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-forest-950">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Shift to Rooftop Solar PV</span>
              </div>
              <span className="font-mono font-black text-mint-700 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-sage-200">
                {simParams.renewable_shift_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={simParams.renewable_shift_pct}
              onChange={(e) => updateSimParams({ renewable_shift_pct: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-industrial-400 font-medium">
              <span>0% (All Grid)</span>
              <span>On-site solar generation</span>
              <span>100% Net-Zero Electricity</span>
            </div>
          </div>

          {/* Slider 3: Natural Gas / Fuel Efficiency */}
          <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-forest-950">
                <Flame className="w-4 h-4 text-coral-500" />
                <span>Fuel / Boiler Heat Recovery</span>
              </div>
              <span className="font-mono font-black text-forest-950 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-sage-200">
                {simParams.fuel_reduction_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={simParams.fuel_reduction_pct}
              onChange={(e) => updateSimParams({ fuel_reduction_pct: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-industrial-400 font-medium">
              <span>0%</span>
              <span>Economizers, pipe insulation</span>
              <span>50% Max</span>
            </div>
          </div>

          {/* Slider 4: Waste Minimization */}
          <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-forest-950">
                <Trash2 className="w-4 h-4 text-indigo-500" />
                <span>Solid Waste & Landfill Diversion</span>
              </div>
              <span className="font-mono font-black text-forest-950 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-sage-200">
                {simParams.waste_reduction_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={simParams.waste_reduction_pct}
              onChange={(e) => updateSimParams({ waste_reduction_pct: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-industrial-400 font-medium">
              <span>0%</span>
              <span>Fabric scrap re-spinning</span>
              <span>60% Max</span>
            </div>
          </div>

          {/* Save Scenario Form */}
          <div className="pt-4 border-t border-sage-100 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Give this scenario a name (optional)..."
              value={scenarioNameInput}
              onChange={(e) => setScenarioNameInput(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2.5 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500"
            />
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-850 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-soft transition-all"
            >
              <Save className="w-4 h-4 text-mint-400" />
              <span>Save Scenario</span>
            </button>
          </div>

          {showSaveSuccess && (
            <div className="p-3 bg-mint-50 border border-mint-200 text-forest-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-mint-600" />
              <span>Scenario saved successfully! Compare below.</span>
            </div>
          )}
        </div>

        {/* Dynamic Comparison Bar Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-sage-100">
              <h3 className="text-base font-bold text-forest-950 font-display">
                Source-by-Source Comparison (Current vs Scenario)
              </h3>
              <p className="text-xs text-industrial-500">
                Deterministic reduction breakdown in tCO₂e/year
              </p>
            </div>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit=" t" />
                  <Tooltip
                    formatter={(val: number) => [`${val} tCO₂e`]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
                  <Bar dataKey="Current" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Current Baseline" />
                  <Bar dataKey="Simulated" fill="#10B981" radius={[4, 4, 0, 0]} name="Simulated Scenario" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Financial Summary Table */}
          <div className="mt-6 pt-4 border-t border-sage-100 grid grid-cols-3 gap-3 text-center bg-sage-50/70 p-3.5 rounded-2xl border border-sage-100">
            <div>
              <span className="text-[10px] uppercase font-semibold text-industrial-500 block">Estimated Capex</span>
              <span className="text-xs sm:text-sm font-bold text-forest-950 font-display">
                {formatCurrency(simResult.estimated_implementation_cost_inr)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-industrial-500 block">Annual Savings</span>
              <span className="text-xs sm:text-sm font-bold text-forest-800 font-display">
                {formatCurrency(simResult.estimated_annual_savings_inr)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-industrial-500 block">Payback Period</span>
              <span className="text-xs sm:text-sm font-bold text-forest-950 font-display">
                {simResult.payback_years} yrs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SAVED SCENARIOS COMPARISON TABLE */}
      {savedScenarios.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
          <div className="pb-5 border-b border-sage-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-forest-900" />
              <div>
                <h3 className="text-lg font-bold text-forest-950 font-display">
                  Saved Scenario Comparison Matrix
                </h3>
                <p className="text-xs text-industrial-500">
                  Compare tested interventions side-by-side for executive planning
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-industrial-500">
              {savedScenarios.length} Saved Scenarios
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sage-200 text-industrial-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Scenario Name</th>
                  <th className="pb-3">Baseline</th>
                  <th className="pb-3">Scenario CO₂e</th>
                  <th className="pb-3">Abatement</th>
                  <th className="pb-3">Estimated Capex</th>
                  <th className="pb-3">Annual Savings</th>
                  <th className="pb-3 pr-2 text-right">Payback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {savedScenarios.map((scen) => (
                  <tr key={scen.id} className="hover:bg-sage-50/60 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-forest-950">
                      {scen.scenario_name}
                    </td>
                    <td className="py-3.5 text-industrial-600 font-mono">
                      {scen.baseline_emissions} t
                    </td>
                    <td className="py-3.5 text-mint-700 font-mono font-bold">
                      {scen.scenario_emissions} t
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-mint-800 bg-mint-50 px-2 py-0.5 rounded-md border border-mint-200">
                        -{scen.reduction} t ({scen.reduction_pct}%)
                      </span>
                    </td>
                    <td className="py-3.5 text-forest-950 font-mono font-medium">
                      {formatCurrency(scen.estimated_cost)}
                    </td>
                    <td className="py-3.5 text-forest-800 font-mono font-bold">
                      {formatCurrency(scen.estimated_savings)}/yr
                    </td>
                    <td className="py-3.5 pr-2 text-right font-mono font-semibold text-forest-950">
                      {scen.payback} years
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
