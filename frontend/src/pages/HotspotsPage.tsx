import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Flame,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

const HOTSPOT_BAR_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#6366F1'];

export const HotspotsPage: React.FC = () => {
  const { hotspots, setActiveTab, factory } = useFactory();

  const barData = hotspots.hotspots.map((h, idx) => ({
    name: h.source,
    co2e: h.co2e_tonnes,
    percentage: h.percentage,
    color: HOTSPOT_BAR_COLORS[idx % HOTSPOT_BAR_COLORS.length]
  }));

  const top = hotspots.top_hotspot;

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Top Banner with Clear Hotspot Identification */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-coral-700 bg-coral-50 border border-coral-200 px-3 py-1 rounded-full uppercase tracking-wide mb-2">
              <Flame className="w-3.5 h-3.5 text-coral-600" />
              <span>Prioritized Hotspot Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-950 font-display">
              Emission Hotspot Detection
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-industrial-600 leading-relaxed max-w-2xl">
              Focusing on your largest carbon contributor delivers maximum decarbonization per rupee spent.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 bg-forest-900 hover:bg-forest-850 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-soft transition-all self-start md:self-auto"
          >
            <Sliders className="w-4 h-4 text-mint-400" />
            <span>Simulate Cuts on {top?.source || 'Top Hotspot'}</span>
          </button>
        </div>

        {/* Primary Hotspot Callout Box */}
        {top && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-coral-50 via-amber-50/50 to-mint-50/40 border border-coral-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-coral-600 text-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-coral-800">
                  Primary Abatement Target (Rank #1)
                </span>
                <h3 className="text-xl font-extrabold text-forest-950 font-display mt-0.5">
                  {top.source} is your largest emission hotspot
                </h3>
                <p className="mt-1 text-xs text-industrial-700 leading-relaxed max-w-xl">
                  Contributing approximately <strong>{top.percentage}%</strong> of your estimated facility footprint
                  (<strong>{top.co2e_tonnes} tCO₂e/year</strong>). Focused mitigation on this area will produce the most dramatic reduction curve.
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-coral-200/80 text-center min-w-[150px] self-stretch md:self-auto">
              <span className="text-[10px] uppercase font-bold text-industrial-500 block">Hotspot Volume</span>
              <span className="text-2xl font-black text-coral-600 font-display">{top.co2e_tonnes}</span>
              <span className="text-[11px] text-industrial-500 font-semibold block">tCO₂e / year</span>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Bar Chart for Ranking */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="pb-5 border-b border-sage-100">
          <h3 className="text-lg font-bold text-forest-950 font-display">
            Hotspot Ranking Comparison
          </h3>
          <p className="text-xs text-industrial-500 mt-0.5">
            Annual footprint (tCO₂e) ranked in descending order of magnitude
          </p>
        </div>

        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={barData} margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" stroke="#64748B" fontSize={12} unit=" t" />
              <YAxis dataKey="name" type="category" stroke="#0F172A" fontSize={12} fontWeight={600} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [`${val} tCO₂e`, 'Emissions']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <Bar dataKey="co2e" radius={[0, 8, 8, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Hotspots Grid with Explainability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotspots.hotspots.map((item) => (
          <div
            key={item.source}
            className="bg-white rounded-3xl p-6 border border-sage-200 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sage-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-forest-900 text-white font-mono text-xs font-bold flex items-center justify-center shadow-soft">
                    #{item.rank}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-forest-950 font-display">{item.source}</h4>
                    <span className="text-[11px] text-industrial-500 font-medium">{item.scope}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      item.badge_color === 'red'
                        ? 'bg-coral-50 text-coral-700 border-coral-200'
                        : item.badge_color === 'amber'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>

              {/* Volume metrics */}
              <div className="mt-4 grid grid-cols-2 gap-3 p-3.5 bg-sage-50/70 rounded-2xl border border-sage-100 text-center">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-industrial-500 block">Footprint</span>
                  <span className="text-lg font-bold text-forest-950 font-display">{item.co2e_tonnes} tCO₂e</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-industrial-500 block">Plant Share</span>
                  <span className="text-lg font-bold text-forest-950 font-display">{item.percentage}%</span>
                </div>
              </div>

              {/* Explainability Section */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-industrial-700 leading-relaxed">
                  <HelpCircle className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest-950">Why is this a hotspot?</strong>
                    <p className="text-industrial-600 mt-0.5">{item.explanation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-industrial-700 leading-relaxed pt-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest-950">Reduction Opportunity:</strong>
                    <p className="text-industrial-600 mt-0.5">{item.reduction_opportunity}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sage-100 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('recommendations')}
                className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1"
              >
                <span>View {item.source} Interventions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className="text-xs font-semibold bg-forest-50 hover:bg-forest-100 text-forest-950 px-3 py-1.5 rounded-xl border border-forest-200 transition-colors"
              >
                Simulate Cuts
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
