import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  Flame,
  Lightbulb,
  Sliders,
  FileText,
  TrendingDown,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Zap,
  Target,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

const SOURCE_COLORS: Record<string, string> = {
  'Electricity': '#10B981',    // mint
  'Natural Gas': '#EF4444',    // coral
  'Raw Materials': '#F59E0B',  // amber
  'Waste Generation': '#6366F1' // indigo
};

export const DashboardPage: React.FC = () => {
  const {
    factory,
    emissions,
    hotspots,
    recommendations,
    simResult,
    setActiveTab,
    formatCurrency
  } = useFactory();

  // Data for Donut Chart
  const donutData = emissions.sources.map(s => ({
    name: s.source,
    value: s.co2e_tonnes,
    percentage: s.percentage,
    color: SOURCE_COLORS[s.source] || '#10B981'
  }));

  // Target calculations
  const targetEmissions = Number((emissions.total_co2e_tonnes * (1 - factory.reduction_target_pct / 100)).toFixed(1));
  const achievableEmissions = simResult.scenario_total_tco2e;

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-forest-900">
        <div>
          <div className="inline-flex items-center gap-2 bg-mint-500/20 text-mint-300 border border-mint-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-mint-300" />
            <span>Facility Decarbonization Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            {factory.name} Overview
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-sage-200 max-w-xl leading-relaxed">
            Annual footprint model calibrated using {emissions.geography} baseline.
            {hotspots.summary}
          </p>
        </div>

        {/* Quick Action Trigger Buttons */}
        <div className="flex flex-wrap gap-2.5 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 bg-mint-500 hover:bg-mint-400 text-forest-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Launch What-If Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-2 bg-forest-800 hover:bg-forest-750 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-forest-700 transition-all"
          >
            <FileText className="w-4 h-4 text-mint-300" />
            <span>Audit Report</span>
          </button>
        </div>
      </div>

      {/* TOP 5 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total CO2e */}
        <div className="bg-white rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="text-xs font-medium text-industrial-500 uppercase tracking-wide">Total Estimated CO₂e</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-forest-950 font-display">{emissions.total_co2e_tonnes}</span>
            <span className="text-xs text-industrial-500 font-semibold">tCO₂e/yr</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-forest-700 font-medium bg-sage-50 px-2 py-0.5 rounded-md border border-sage-200">
            <span>Scope 1 + 2 + 3 baseline</span>
          </div>
        </div>

        {/* KPI 2: Largest Hotspot */}
        <div className="bg-white rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="text-xs font-medium text-industrial-500 uppercase tracking-wide">Largest Hotspot</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-coral-600 font-display truncate">
              {hotspots.top_hotspot?.source || 'Electricity'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="font-bold text-coral-700 bg-coral-50 border border-coral-200 px-2 py-0.5 rounded-md">
              {hotspots.top_hotspot?.percentage}% of total
            </span>
            <span className="text-industrial-500 font-medium">Priority #1</span>
          </div>
        </div>

        {/* KPI 3: Potential CO2 Reduction */}
        <div className="bg-white rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="text-xs font-medium text-industrial-500 uppercase tracking-wide">Potential CO₂ Reduction</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-mint-600 font-display">
              {recommendations.total_potential_reduction_tco2e}
            </span>
            <span className="text-xs text-industrial-500 font-semibold">tCO₂e/yr</span>
          </div>
          <div className="mt-3 text-[11px] text-forest-800 font-semibold">
            Across top 4 interventions
          </div>
        </div>

        {/* KPI 4: Recommended Investment */}
        <div className="bg-white rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="text-xs font-medium text-industrial-500 uppercase tracking-wide">Recommended Investment</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-forest-950 font-display">
              {formatCurrency(recommendations.recommended_investment_inr)}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-industrial-500 flex items-center justify-between">
            <span>Budget:</span>
            <span className="font-semibold text-forest-900">{formatCurrency(factory.budget_inr)}</span>
          </div>
        </div>

        {/* KPI 5: Potential Annual Savings */}
        <div className="bg-white rounded-2xl p-5 border border-sage-200 shadow-soft">
          <div className="text-xs font-medium text-industrial-500 uppercase tracking-wide">Potential Annual Savings</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-forest-800 font-display">
              {formatCurrency(recommendations.potential_annual_savings_inr)}
            </span>
            <span className="text-xs text-industrial-500 font-semibold">/year</span>
          </div>
          <div className="mt-3 text-[11px] text-forest-700 font-semibold">
            ~1.5 - 2.1 yrs avg payback
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Charts & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Donut Chart - Emission Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-sage-100">
            <div>
              <h3 className="text-base font-bold text-forest-950 font-display">
                Emission Source Breakdown
              </h3>
              <p className="text-xs text-industrial-500 mt-0.5">
                Deterministic contribution per activity category
              </p>
            </div>
            <button
              onClick={() => setActiveTab('emissions')}
              className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Audit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Donut Chart */}
            <div className="md:col-span-6 h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} tCO₂e`, 'Emissions']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs uppercase font-semibold text-industrial-400">Total</span>
                <span className="text-xl font-bold text-forest-950 font-display">{emissions.total_co2e_tonnes}</span>
                <span className="text-[10px] text-industrial-500 font-semibold">tCO₂e</span>
              </div>
            </div>

            {/* Source legend with exact shares */}
            <div className="md:col-span-6 space-y-3">
              {emissions.sources.map((src) => (
                <div key={src.source} className="flex items-center justify-between p-2.5 rounded-xl bg-sage-50/70 border border-sage-100">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: SOURCE_COLORS[src.source] || '#10B981' }}
                    />
                    <div>
                      <div className="text-xs font-bold text-forest-950">{src.source}</div>
                      <div className="text-[10px] text-industrial-500">{src.scope} • {src.value} {src.unit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-forest-950">{src.co2e_tonnes} t</div>
                    <div className="text-[10px] font-semibold text-industrial-500">{src.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Hotspots Ranked List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-sage-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-coral-50 border border-coral-200 flex items-center justify-center text-coral-600">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-forest-950 font-display">
                    Top Emission Hotspots
                  </h3>
                  <p className="text-xs text-industrial-500">Ranked by carbon footprint volume</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('hotspots')}
                className="text-xs font-semibold text-forest-800 hover:text-forest-950"
              >
                All Hotspots →
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {hotspots.hotspots.slice(0, 3).map((item) => (
                <div
                  key={item.source}
                  className="p-3.5 rounded-2xl border border-sage-200 bg-sage-50/50 hover:bg-white hover:shadow-soft transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-forest-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        {item.rank}
                      </span>
                      <span className="text-sm font-bold text-forest-950">{item.source}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.badge_color === 'red'
                          ? 'bg-coral-50 text-coral-700 border-coral-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-industrial-600 line-clamp-2 leading-relaxed">
                    {item.reduction_opportunity}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-sage-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-industrial-500">{item.co2e_tonnes} tCO₂e</span>
                    <span className="font-bold text-forest-900">{item.percentage}% of plant total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-sage-100">
            <button
              onClick={() => setActiveTab('hotspots')}
              className="w-full py-2.5 px-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Hotspot Root-Causes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: Recommended Actions & What-If Best Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Actions (Top 3) - 7 Cols */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-card">
          <div className="flex items-center justify-between pb-5 border-b border-sage-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-mint-50 border border-mint-200 flex items-center justify-center text-mint-700">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-forest-950 font-display">
                  Recommended Interventions
                </h3>
                <p className="text-xs text-industrial-500">
                  Ranked by ROI, payback period, and budget fit
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-xs font-semibold text-forest-800 hover:text-forest-950"
            >
              View All ({recommendations.recommendations.length}) →
            </button>
          </div>

          <div className="mt-5 space-y-3.5">
            {recommendations.top_three.map((rec) => (
              <div
                key={rec.intervention}
                className="p-4 rounded-2xl border border-sage-200 bg-white hover:border-mint-300 hover:shadow-soft transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-mint-700 bg-mint-50 border border-mint-200 px-2 py-0.5 rounded-md">
                      #{rec.rank} Recommended
                    </span>
                    <h4 className="text-sm font-bold text-forest-950">{rec.intervention}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                      rec.cost_bracket === 'Low Cost'
                        ? 'bg-mint-50 text-mint-700 border-mint-200'
                        : rec.cost_bracket === 'Medium Cost'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {rec.cost_bracket}
                  </span>
                </div>

                <p className="mt-2 text-xs text-industrial-600 leading-relaxed">
                  {rec.why_recommended}
                </p>

                <div className="mt-3 pt-3 border-t border-sage-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-industrial-600">
                    <span>
                      Capex: <strong className="text-forest-950">{formatCurrency(rec.estimated_cost_inr)}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      CO₂ cut: <strong className="text-mint-700">{rec.expected_co2_reduction_tco2e} t/yr</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Payback: <strong className="text-forest-950">{rec.payback_years} yrs</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1"
                  >
                    <span>Simulate Impact</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Summary & Sustainability Target Progress (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* What-If Quick Summary Card */}
          <div className="bg-gradient-to-br from-forest-900 to-forest-950 rounded-3xl p-6 text-white shadow-card border border-forest-800">
            <div className="flex items-center justify-between pb-4 border-b border-forest-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-mint-300" />
                <h4 className="text-sm font-bold text-white font-display">
                  Active What-If Scenario
                </h4>
              </div>
              <span className="text-[10px] bg-mint-500/20 text-mint-300 font-semibold px-2 py-0.5 rounded-full border border-mint-400/30">
                Live Simulation
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-center">
              <div className="bg-forest-850/70 p-3.5 rounded-2xl border border-forest-800">
                <div className="text-[10px] uppercase tracking-wider text-sage-300 font-semibold">Baseline</div>
                <div className="text-xl font-bold font-display text-white mt-1">
                  {simResult.baseline_total_tco2e} <span className="text-xs font-normal text-sage-300">t</span>
                </div>
              </div>

              <div className="bg-forest-850/70 p-3.5 rounded-2xl border border-forest-800">
                <div className="text-[10px] uppercase tracking-wider text-mint-300 font-semibold">With Cuts</div>
                <div className="text-xl font-bold font-display text-mint-300 mt-1">
                  {simResult.scenario_total_tco2e} <span className="text-xs font-normal text-mint-200/70">t</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-forest-850/50 border border-forest-800 flex items-center justify-between text-xs">
              <span className="text-sage-200">Carbon Abatement:</span>
              <span className="font-bold text-mint-300">
                -{simResult.co2_reduction_tco2e} tCO₂e ({simResult.reduction_percentage}%)
              </span>
            </div>

            <div className="mt-2.5 p-3 rounded-xl bg-forest-850/50 border border-forest-800 flex items-center justify-between text-xs">
              <span className="text-sage-200">Annual Savings:</span>
              <span className="font-bold text-white">
                {formatCurrency(simResult.estimated_annual_savings_inr)}/yr
              </span>
            </div>

            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-5 w-full py-2.5 bg-mint-500 hover:bg-mint-400 text-forest-950 font-bold text-xs rounded-xl transition-all shadow-soft"
            >
              Adjust Parameters in What-If Simulator →
            </button>
          </div>

          {/* Sustainability Target Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-sage-200 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-forest-800" />
                <h4 className="text-sm font-bold text-forest-950 font-display">
                  Sustainability Target
                </h4>
              </div>
              <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-md">
                {factory.reduction_target_pct}% Goal
              </span>
            </div>

            <p className="text-xs text-industrial-600">
              {factory.sustainability_goals || 'Reduce baseline footprint by 20% in FY 2026.'}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-industrial-500">Baseline ({emissions.total_co2e_tonnes} t)</span>
                <span className="text-forest-950">Target: {targetEmissions} t</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-sage-100 rounded-full h-3 overflow-hidden p-0.5 border border-sage-200">
                <div
                  className="bg-gradient-to-r from-forest-800 to-mint-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (simResult.reduction_percentage / factory.reduction_target_pct) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-industrial-500">
                <span>0% Progress</span>
                <span className="font-bold text-mint-700">
                  {Math.round((simResult.reduction_percentage / factory.reduction_target_pct) * 100)}% of Target Simulated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
