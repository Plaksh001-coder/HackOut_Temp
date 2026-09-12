import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  Calculator,
  Calendar,
  Sparkles,
  Zap,
  Flame,
  Package,
  Trash2
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

export const EmissionsPage: React.FC = () => {
  const { factory, emissions } = useFactory();

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 bg-forest-50 border border-forest-100 px-3 py-1 rounded-full uppercase tracking-wide mb-2">
              <Calculator className="w-3.5 h-3.5 text-mint-600" />
              <span>GHG Protocol Scope 1, 2, 3 Model</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-950 font-display">
              Authoritative Emission Analysis
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-industrial-600 leading-relaxed max-w-2xl">
              Every emission figure is computed deterministically using standard verified emission factors.
              No synthetic numbers or ungrounded estimates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-sage-50 border border-sage-200 rounded-2xl p-3 text-xs">
              <span className="text-industrial-500 font-medium block">Baseline Grid Factor:</span>
              <span className="font-bold text-forest-950 mt-0.5 block">India (CEA Baseline: 0.82 kg/kWh)</span>
            </div>
          </div>
        </div>

        {/* Scope 1, 2, 3 Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-sage-100">
          {/* Scope 1 */}
          <div className="bg-sage-50/70 p-5 rounded-2xl border border-sage-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-industrial-500 tracking-wider">Scope 1 (Direct)</span>
              <Flame className="w-4 h-4 text-coral-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-forest-950 font-display">
                {emissions.scope_breakdown['Scope 1']}
              </span>
              <span className="text-xs text-industrial-500 font-semibold">tCO₂e</span>
            </div>
            <div className="mt-2 text-xs text-industrial-600">
              Stationary combustion from onsite boilers and natural gas burners.
            </div>
          </div>

          {/* Scope 2 */}
          <div className="bg-sage-50/70 p-5 rounded-2xl border border-sage-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-industrial-500 tracking-wider">Scope 2 (Indirect)</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-forest-950 font-display">
                {emissions.scope_breakdown['Scope 2']}
              </span>
              <span className="text-xs text-industrial-500 font-semibold">tCO₂e</span>
            </div>
            <div className="mt-2 text-xs text-industrial-600">
              Purchased grid electricity utilized across manufacturing processes.
            </div>
          </div>

          {/* Scope 3 */}
          <div className="bg-sage-50/70 p-5 rounded-2xl border border-sage-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-industrial-500 tracking-wider">Scope 3 (Value Chain)</span>
              <Package className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-forest-950 font-display">
                {emissions.scope_breakdown['Scope 3']}
              </span>
              <span className="text-xs text-industrial-500 font-semibold">tCO₂e</span>
            </div>
            <div className="mt-2 text-xs text-industrial-600">
              Embodied raw materials (yarn/cotton) and solid industrial waste handling.
            </div>
          </div>
        </div>
      </div>

      {/* Activity Data & Audit Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="pb-5 border-b border-sage-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-forest-950 font-display">
              Activity Data & Emission Factor Ledger
            </h3>
            <p className="text-xs text-industrial-500 mt-0.5">
              Exact mathematical formulation: CO₂e (t) = (Activity Volume × Emission Factor) ÷ 1,000
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-forest-800 bg-mint-50 px-3 py-1.5 rounded-xl border border-mint-200 self-start sm:self-auto font-semibold">
            <ShieldCheck className="w-4 h-4 text-mint-600" />
            <span>Audit-Grade Traceability</span>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sage-200 text-industrial-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Emission Source</th>
                <th className="pb-3">Scope</th>
                <th className="pb-3">Activity Volume</th>
                <th className="pb-3">Emission Factor</th>
                <th className="pb-3">Source & Year</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3 text-right pr-2">Calculated Footprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {emissions.sources.map((src) => (
                <tr key={src.source} className="hover:bg-sage-50/60 transition-colors">
                  <td className="py-4 pl-2 font-bold text-forest-950">
                    {src.source}
                  </td>
                  <td className="py-4 font-semibold text-industrial-600">
                    <span className="px-2 py-0.5 rounded-md bg-sage-100 border border-sage-200 text-[11px]">
                      {src.scope}
                    </span>
                  </td>
                  <td className="py-4 font-mono font-medium text-forest-900">
                    {src.value.toLocaleString()} {src.unit}
                  </td>
                  <td className="py-4 font-mono font-medium text-industrial-700">
                    {src.emission_factor} {src.factor_unit}
                  </td>
                  <td className="py-4 text-industrial-600 max-w-xs truncate" title={src.source_ref}>
                    {src.source_ref}
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 text-mint-700 font-semibold bg-mint-50 px-2 py-0.5 rounded-full text-[10px] border border-mint-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {src.confidence}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <span className="font-bold font-display text-forest-950 text-sm">
                      {src.co2e_tonnes} tCO₂e
                    </span>
                    <span className="block text-[10px] text-industrial-500 font-medium">
                      {src.percentage}% share
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trend Simulation Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="pb-5 border-b border-sage-100">
          <h3 className="text-lg font-bold text-forest-950 font-display">
            Monthly Operational Footprint Distribution
          </h3>
          <p className="text-xs text-industrial-500 mt-0.5">
            Reflecting manufacturing seasonality and peak production months
          </p>
        </div>

        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emissions.monthly_trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} unit=" t" />
              <Tooltip
                formatter={(val: number) => [`${val} tCO₂e`, 'Estimated Footprint']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <Bar dataKey="emissions_tco2e" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transparent Assumptions & Boundary Card */}
      <div className="bg-forest-950 rounded-3xl p-6 sm:p-8 text-white border border-forest-900 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-mint-400" />
          <h3 className="text-base font-bold font-display">Calculation Assumptions & Boundaries</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-sage-200">
          {emissions.assumptions.map((assump, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-forest-900/60 border border-forest-800">
              <span className="text-mint-400 font-bold">•</span>
              <span>{assump}</span>
            </div>
          ))}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-forest-900/60 border border-forest-800">
            <span className="text-mint-400 font-bold">•</span>
            <span>Deterministic engine guarantees repeat accuracy across all subsequent simulations.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-forest-900/60 border border-forest-800">
            <span className="text-mint-400 font-bold">•</span>
            <span>No unverified third-party offsets or speculative carbon sequestration credits applied.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
