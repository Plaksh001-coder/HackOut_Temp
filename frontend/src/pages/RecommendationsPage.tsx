import React, { useState } from 'react';
import {
  Lightbulb,
  DollarSign,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Flame,
  Package,
  Trash2
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { InterventionRecommendation } from '../types';

export const RecommendationsPage: React.FC = () => {
  const {
    recommendations,
    factory,
    formatCurrency,
    setActiveTab,
    updateSimParams
  } = useFactory();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCostBracket, setSelectedCostBracket] = useState<string>('All');
  const [onlyWithinBudget, setOnlyWithinBudget] = useState<boolean>(false);

  // Filter recommendations
  const filtered = recommendations.recommendations.filter(r => {
    if (selectedCategory !== 'All' && r.target_hotspot !== selectedCategory) return false;
    if (selectedCostBracket !== 'All' && r.cost_bracket !== selectedCostBracket) return false;
    if (onlyWithinBudget && !r.within_budget) return false;
    return true;
  });

  const handleSimulateIntervention = (rec: InterventionRecommendation) => {
    // Map intervention to What-If simulator parameters
    if (rec.target_hotspot === 'Electricity') {
      if (rec.intervention.includes('Solar')) {
        updateSimParams({ renewable_shift_pct: 35 });
      } else {
        updateSimParams({ electricity_reduction_pct: 20 });
      }
    } else if (rec.target_hotspot === 'Natural Gas') {
      updateSimParams({ fuel_reduction_pct: 25 });
    } else if (rec.target_hotspot === 'Waste Generation') {
      updateSimParams({ waste_reduction_pct: 30 });
    }
    setActiveTab('simulator');
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Top Banner with Budget Context */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-mint-700 bg-mint-50 border border-mint-200 px-3 py-1 rounded-full uppercase tracking-wide mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-mint-600" />
              <span>Multi-Factor Decision Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-950 font-display">
              Budget-Aware Sustainability Interventions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-industrial-600 leading-relaxed max-w-2xl">
              Ranked dynamically by carbon abatement, capex efficiency, payback speed, and alignment with your available budget.
            </p>
          </div>

          <div className="bg-sage-50 rounded-2xl p-4 border border-sage-200 text-right min-w-[200px]">
            <span className="text-[11px] font-semibold text-industrial-500 uppercase tracking-wider block">
              Declared Sustainability Budget
            </span>
            <span className="text-2xl font-black text-forest-950 font-display block mt-0.5">
              {formatCurrency(factory.budget_inr)}
            </span>
            <span className="text-[11px] text-mint-700 font-semibold block mt-0.5">
              Target: {factory.reduction_target_pct}% reduction
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-6 border-t border-sage-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-industrial-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Hotspot:</span>
            </span>
            {['All', 'Electricity', 'Natural Gas', 'Waste Generation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-forest-900 text-white shadow-soft'
                    : 'bg-sage-100/70 text-industrial-600 hover:bg-sage-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Cost Bracket Selector */}
            <div className="flex items-center gap-1.5 bg-sage-50 border border-sage-200 px-3 py-1.5 rounded-xl">
              <span className="text-industrial-500 font-medium">Capex:</span>
              <select
                value={selectedCostBracket}
                onChange={(e) => setSelectedCostBracket(e.target.value)}
                className="bg-transparent font-bold text-forest-950 focus:outline-none cursor-pointer"
              >
                <option value="All">All Investment Brackets</option>
                <option value="Low Cost">Low Cost (&lt; ₹1L)</option>
                <option value="Medium Cost">Medium Cost (₹1L - ₹3L)</option>
                <option value="High Investment">High Investment (&gt; ₹3L)</option>
              </select>
            </div>

            {/* Within budget toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-forest-900 bg-sage-50 border border-sage-200 px-3 py-1.5 rounded-xl">
              <input
                type="checkbox"
                checked={onlyWithinBudget}
                onChange={(e) => setOnlyWithinBudget(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-mint-600 focus:ring-mint-500"
              />
              <span>Within Budget Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((rec) => (
          <div
            key={rec.intervention}
            className="bg-white rounded-3xl p-6 border border-sage-200 shadow-card flex flex-col justify-between hover:border-mint-300 hover:shadow-elevated transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-sage-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-forest-900 text-white font-mono text-xs font-bold flex items-center justify-center shadow-soft">
                    #{rec.rank}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-forest-950 font-display">
                      {rec.intervention}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-industrial-500 font-medium mt-0.5">
                      <span>Target: <strong className="text-forest-900">{rec.target_hotspot}</strong></span>
                      <span>•</span>
                      <span>{rec.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      rec.cost_bracket === 'Low Cost'
                        ? 'bg-mint-50 text-mint-700 border-mint-200'
                        : rec.cost_bracket === 'Medium Cost'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {rec.cost_bracket}
                  </span>
                  {rec.within_budget ? (
                    <span className="text-[10px] text-mint-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-mint-600" />
                      <span>Fits Budget</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Exceeds Budget</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Key Metrics Strip */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center p-3 bg-sage-50/80 rounded-2xl border border-sage-100">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-industrial-500 block">Capex</span>
                  <span className="text-xs font-black text-forest-950">{formatCurrency(rec.estimated_cost_inr)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-industrial-500 block">CO₂ Cut</span>
                  <span className="text-xs font-black text-mint-700">{rec.expected_co2_reduction_tco2e} t/yr</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-industrial-500 block">Payback</span>
                  <span className="text-xs font-black text-forest-950">{rec.payback_years} yrs</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-industrial-500 block">Feasibility</span>
                  <span className="text-xs font-bold text-forest-800">{rec.feasibility}</span>
                </div>
              </div>

              {/* Why Recommended Explainability Callout */}
              <div className="mt-4 p-3.5 rounded-2xl bg-forest-50/60 border border-forest-100 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-forest-950 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-mint-600" />
                  <span>Why was this recommended?</span>
                </div>
                <p className="text-industrial-700 leading-relaxed">
                  {rec.why_recommended}
                </p>
              </div>

              {/* Technical Source Attribution */}
              <div className="mt-3 text-[11px] text-industrial-400 italic">
                Source benchmark: {rec.source}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-sage-100 flex items-center justify-between">
              <div className="text-xs text-industrial-500 font-semibold">
                Match Score: <span className="font-bold text-forest-950">{rec.score}/100</span>
              </div>

              <button
                onClick={() => handleSimulateIntervention(rec)}
                className="flex items-center gap-1.5 text-xs font-bold bg-mint-500 hover:bg-mint-400 text-forest-950 px-4 py-2 rounded-xl shadow-soft transition-all"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate in What-If</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
