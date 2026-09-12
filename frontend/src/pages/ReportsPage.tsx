import React from 'react';
import {
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  Flame,
  Lightbulb,
  Sliders,
  FileCheck2,
  Leaf
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

export const ReportsPage: React.FC = () => {
  const {
    factory,
    emissions,
    hotspots,
    recommendations,
    simResult,
    savedScenarios,
    formatCurrency
  } = useFactory();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Top Banner with Print / Export CTA (hidden on print) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 bg-forest-50 border border-forest-100 px-3 py-1 rounded-full uppercase tracking-wide mb-2">
              <FileCheck2 className="w-3.5 h-3.5 text-mint-600" />
              <span>GHG Protocol Audit Report</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-950 font-display">
              Executive Sustainability Action Plan
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-industrial-600">
              Audit-ready report summarizing emissions, detected hotspots, budget-aware interventions, and scenario projections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-forest-900 hover:bg-forest-850 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-soft transition-all"
            >
              <Printer className="w-4 h-4 text-mint-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRINTABLE REPORT CONTAINER */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sage-200 shadow-elevated print-container">
        {/* Report Header & Letterhead */}
        <div className="flex items-start justify-between pb-8 border-b-2 border-forest-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center shadow-soft">
              <Leaf className="w-7 h-7 text-mint-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-forest-950 font-display tracking-tight">
                Green<span className="text-mint-600">Mind</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-forest-700">
                Industrial Decarbonization Intelligence
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold font-mono text-forest-950">REP-GM-{factory.id.slice(0, 8).toUpperCase()}-2026</div>
            <div className="text-industrial-500 mt-0.5">Date: {new Date().toLocaleDateString('en-GB')}</div>
            <div className="text-forest-700 font-semibold mt-1 flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-mint-600" />
              <span>Verified Deterministic Baseline</span>
            </div>
          </div>
        </div>

        {/* 1. Facility Information */}
        <div className="py-6 border-b border-sage-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3">
            1. Facility Profile & Scope
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-sage-50/70 p-3 rounded-xl border border-sage-200">
              <span className="text-industrial-500 block">Facility Name</span>
              <strong className="text-forest-950 block mt-0.5">{factory.name}</strong>
            </div>
            <div className="bg-sage-50/70 p-3 rounded-xl border border-sage-200">
              <span className="text-industrial-500 block">Industry Sector</span>
              <strong className="text-forest-950 block mt-0.5">{factory.industry}</strong>
            </div>
            <div className="bg-sage-50/70 p-3 rounded-xl border border-sage-200">
              <span className="text-industrial-500 block">Plant Location</span>
              <strong className="text-forest-950 block mt-0.5">{factory.location}</strong>
            </div>
            <div className="bg-sage-50/70 p-3 rounded-xl border border-sage-200">
              <span className="text-industrial-500 block">Annual Production</span>
              <strong className="text-forest-950 block mt-0.5">
                {factory.production_volume.toLocaleString()} {factory.production_volume_unit}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Total Estimated Emissions & Breakdown */}
        <div className="py-6 border-b border-sage-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3">
            2. Greenhouse Gas (GHG) Footprint Breakdown
          </h3>

          <div className="p-4 bg-forest-950 text-white rounded-2xl mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-sage-300">Total Annual Facility Footprint:</span>
              <div className="text-3xl font-extrabold font-display text-white mt-0.5">
                {emissions.total_co2e_tonnes} <span className="text-sm font-normal text-sage-300">tCO₂e/year</span>
              </div>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="bg-forest-900 px-3 py-2 rounded-xl border border-forest-800">
                <span className="text-sage-300 block">Scope 1 (Direct):</span>
                <strong className="text-white">{emissions.scope_breakdown['Scope 1']} tCO₂e</strong>
              </div>
              <div className="bg-forest-900 px-3 py-2 rounded-xl border border-forest-800">
                <span className="text-sage-300 block">Scope 2 (Grid Power):</span>
                <strong className="text-mint-300">{emissions.scope_breakdown['Scope 2']} tCO₂e</strong>
              </div>
              <div className="bg-forest-900 px-3 py-2 rounded-xl border border-forest-800">
                <span className="text-sage-300 block">Scope 3 (Up/Downstream):</span>
                <strong className="text-white">{emissions.scope_breakdown['Scope 3']} tCO₂e</strong>
              </div>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sage-200 text-industrial-500 font-bold uppercase">
                <th className="pb-2">Activity Source</th>
                <th className="pb-2">Scope</th>
                <th className="pb-2">Consumption Volume</th>
                <th className="pb-2">Standard Factor</th>
                <th className="pb-2 text-right">Emissions (tCO₂e)</th>
                <th className="pb-2 text-right">Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {emissions.sources.map((s) => (
                <tr key={s.source} className="py-2.5">
                  <td className="py-2.5 font-bold text-forest-950">{s.source}</td>
                  <td className="py-2.5 text-industrial-600">{s.scope}</td>
                  <td className="py-2.5 font-mono">{s.value.toLocaleString()} {s.unit}</td>
                  <td className="py-2.5 font-mono text-industrial-600">{s.emission_factor} {s.factor_unit}</td>
                  <td className="py-2.5 text-right font-bold text-forest-950">{s.co2e_tonnes} t</td>
                  <td className="py-2.5 text-right font-semibold text-forest-900">{s.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Top Emission Hotspots Analysis */}
        <div className="py-6 border-b border-sage-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3">
            3. Prioritized Emission Hotspot
          </h3>
          {hotspots.top_hotspot && (
            <div className="p-4 rounded-2xl bg-coral-50/70 border border-coral-200 text-xs">
              <div className="flex items-center justify-between font-bold text-forest-950 mb-1">
                <span className="text-sm text-coral-800">
                  Primary Culprit: {hotspots.top_hotspot.source} ({hotspots.top_hotspot.percentage}% of facility total)
                </span>
                <span className="bg-coral-100 text-coral-800 px-2 py-0.5 rounded">Critical Priority</span>
              </div>
              <p className="text-industrial-700 leading-relaxed mt-1">
                {hotspots.top_hotspot.explanation}
              </p>
              <div className="mt-2 text-forest-900 font-semibold">
                Strategic Recommendation: {hotspots.top_hotspot.reduction_opportunity}
              </div>
            </div>
          )}
        </div>

        {/* 4. Priority Action Plan & Interventions */}
        <div className="py-6 border-b border-sage-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3">
            4. Recommended Decarbonization Roadmap
          </h3>

          <div className="space-y-3">
            {recommendations.top_three.map((rec) => (
              <div key={rec.intervention} className="p-3.5 rounded-xl border border-sage-200 bg-sage-50/40 text-xs">
                <div className="flex items-center justify-between font-bold text-forest-950">
                  <span>#{rec.rank} {rec.intervention}</span>
                  <span className="text-mint-700">{rec.expected_co2_reduction_tco2e} tCO₂e/yr cut</span>
                </div>
                <p className="text-industrial-600 mt-1">{rec.why_recommended}</p>
                <div className="mt-2 flex items-center justify-between text-industrial-500 font-mono text-[11px]">
                  <span>Estimated Capex: <strong>{formatCurrency(rec.estimated_cost_inr)}</strong></span>
                  <span>Estimated Savings: <strong>{formatCurrency(rec.estimated_annual_savings_inr)}/yr</strong></span>
                  <span>Payback: <strong>{rec.payback_years} years</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. What-If Scenario Outcome */}
        <div className="py-6 border-b border-sage-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3">
            5. Projected Impact of Simulated Interventions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
            <div className="p-3 bg-sage-50 rounded-xl border border-sage-200">
              <span className="text-industrial-500 block">Baseline</span>
              <strong className="text-base text-forest-950 block mt-1">{simResult.baseline_total_tco2e} t</strong>
            </div>
            <div className="p-3 bg-mint-50 rounded-xl border border-mint-200">
              <span className="text-forest-700 font-semibold block">Post-Mitigation</span>
              <strong className="text-base text-forest-950 block mt-1">{simResult.scenario_total_tco2e} t</strong>
            </div>
            <div className="p-3 bg-mint-50 rounded-xl border border-mint-200">
              <span className="text-forest-700 font-semibold block">Net Abatement</span>
              <strong className="text-base text-mint-700 block mt-1">
                -{simResult.co2_reduction_tco2e} t ({simResult.reduction_percentage}%)
              </strong>
            </div>
            <div className="p-3 bg-sage-50 rounded-xl border border-sage-200">
              <span className="text-industrial-500 block">Annual Financial Return</span>
              <strong className="text-base text-forest-800 block mt-1">
                {formatCurrency(simResult.estimated_annual_savings_inr)}
              </strong>
            </div>
          </div>
        </div>

        {/* 6. Assumptions & Certification Stamp */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-industrial-500">
          <div>
            <span className="font-bold text-forest-950 uppercase tracking-wide block mb-1">
              Methodology & Standards
            </span>
            <p className="max-w-md text-[11px] leading-relaxed">
              Calculations adhere to the GHG Protocol Corporate Accounting Standard. Grid emission factors derived from
              CEA India Baseline v19 (2024). Stationary combustion based on IPCC Guidelines for National GHG Inventories.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-center self-stretch sm:self-auto min-w-[180px]">
            <CheckCircle2 className="w-6 h-6 text-mint-600 mx-auto mb-1" />
            <span className="font-bold text-forest-950 text-xs block">GreenMind Engine</span>
            <span className="text-[10px] text-industrial-400 font-mono block">Deterministic V1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
