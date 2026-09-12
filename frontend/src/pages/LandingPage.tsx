import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Lightbulb,
  Sliders,
  FileCheck,
  TrendingDown,
  CheckCircle2,
  BarChart3,
  Factory,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { useFactory } from '../context/FactoryContext';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onStartOnboarding: () => void;
  onTryDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onStartOnboarding,
  onTryDemo
}) => {
  const { emissions, hotspots, simResult, formatCurrency } = useFactory();

  return (
    <div className="min-h-screen bg-sage-50 text-industrial-900 flex flex-col">
      <Navbar onOpenAuth={onOpenAuth} onTryDemo={onTryDemo} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-sage-200/80">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-mint-100/40 via-sage-100/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900 text-white text-xs font-semibold tracking-wide uppercase shadow-soft mb-6">
              <Sparkles className="w-3.5 h-3.5 text-mint-400" />
              <span>Detect • Reduce • Sustain</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-forest-950 font-display leading-[1.15]">
              Know Where Your Factory Emits.{' '}
              <span className="text-forest-700 bg-gradient-to-r from-forest-800 to-mint-600 bg-clip-text text-transparent">
                Know What to Change.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-industrial-600 leading-relaxed max-w-2xl mx-auto">
              GreenMind analyzes your factory data, identifies major emission hotspots,
              recommends practical reduction actions, and lets you simulate the impact before making a decision.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStartOnboarding}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold bg-forest-900 hover:bg-forest-850 text-white px-7 py-3.5 rounded-xl shadow-card hover:shadow-elevated transition-all"
              >
                <span>Analyze My Factory</span>
                <ArrowRight className="w-4 h-4 text-mint-400" />
              </button>

              <button
                onClick={onTryDemo}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold bg-white hover:bg-sage-100 text-forest-900 border border-sage-300 px-7 py-3.5 rounded-xl shadow-soft hover:shadow-card transition-all"
              >
                <Sparkles className="w-4 h-4 text-mint-600" />
                <span>Try Demo (GreenTex)</span>
              </button>
            </div>

            <div className="mt-4 text-xs text-industrial-500 flex items-center justify-center gap-4">
              <span>✓ 100% Deterministic GHG Calculations</span>
              <span>•</span>
              <span>✓ Standard Emission Factors (CEA/EPA/IPCC)</span>
              <span>•</span>
              <span>✓ No Fake Carbon Offsets</span>
            </div>
          </div>

          {/* Interactive Visual Representation of the Factory Dashboard */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-2xl shadow-elevated border border-sage-200 overflow-hidden">
            {/* Header bar */}
            <div className="bg-forest-950 px-6 py-4 flex items-center justify-between border-b border-forest-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-coral-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-mint-500" />
                <span className="ml-2 text-xs font-medium text-sage-200 font-mono">
                  GreenTex Manufacturing • Live Footprint Model
                </span>
              </div>
              <span className="text-xs bg-mint-500/20 text-mint-300 border border-mint-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Baseline Active
              </span>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="p-6 sm:p-8 bg-sage-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Metric 1 */}
                <div className="bg-white p-5 rounded-xl border border-sage-200 shadow-soft">
                  <div className="text-xs font-medium text-industrial-500 uppercase tracking-wider">Total Annual Footprint</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-forest-950 font-display">{emissions.total_co2e_tonnes}</span>
                    <span className="text-xs text-industrial-500 font-semibold">tCO₂e/year</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-forest-700 bg-mint-50 px-2.5 py-1 rounded-lg border border-mint-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint-600" />
                    <span>Calculated with CEA Grid 2024</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-5 rounded-xl border border-sage-200 shadow-soft">
                  <div className="text-xs font-medium text-industrial-500 uppercase tracking-wider">Largest Hotspot</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-coral-600 font-display">
                      {hotspots.top_hotspot?.source || 'Electricity'}
                    </span>
                    <span className="text-xs font-bold text-coral-700 bg-coral-50 px-2 py-0.5 rounded-md border border-coral-200">
                      {hotspots.top_hotspot?.percentage}% share
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-industrial-600 truncate">
                    {hotspots.top_hotspot?.co2e_tonnes} tCO₂e • Priority #1 target
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white p-5 rounded-xl border border-sage-200 shadow-soft">
                  <div className="text-xs font-medium text-industrial-500 uppercase tracking-wider">Simulated 20% Reduction</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-mint-600 font-display">
                      -{simResult.co2_reduction_tco2e}
                    </span>
                    <span className="text-xs text-industrial-500 font-semibold">tCO₂e saved</span>
                  </div>
                  <div className="mt-3 text-xs text-forest-800 font-semibold">
                    {formatCurrency(simResult.estimated_annual_savings_inr)}/yr in energy savings
                  </div>
                </div>
              </div>

              {/* Bottom Quick-Action Preview Banner */}
              <div className="mt-5 p-4 rounded-xl bg-forest-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mint-500/20 text-mint-300 flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-mint-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Explore the What-If Simulator</div>
                    <div className="text-xs text-sage-200">Slide reduction targets and view instant cost vs payback metrics.</div>
                  </div>
                </div>
                <button
                  onClick={onTryDemo}
                  className="whitespace-nowrap px-4 py-2 bg-mint-500 hover:bg-mint-400 text-forest-950 font-semibold text-xs rounded-lg transition-colors shadow-soft"
                >
                  Open Live Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Value Propositions Grid */}
      <section id="hotspots" className="py-20 bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-2">Platform Capabilities</h2>
            <p className="text-3xl font-extrabold text-forest-950 font-display">
              Designed specifically for SMEs and Manufacturing Units
            </p>
            <p className="mt-3 text-industrial-600 text-sm">
              Factory sustainability should not require expensive enterprise consultants or generic carbon accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-sage-50/70 p-8 rounded-2xl border border-sage-200/80 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-forest-900 text-mint-400 flex items-center justify-center mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-forest-950 font-display">Detect Emission Hotspots</h3>
              <p className="mt-3 text-sm text-industrial-600 leading-relaxed">
                Rank and visualize your largest emission culprits with exact percentage shares across electricity, fuels, and materials.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-sage-50/70 p-8 rounded-2xl border border-sage-200/80 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-forest-900 text-mint-400 flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-forest-950 font-display">Budget-Aware Recommendations</h3>
              <p className="mt-3 text-sm text-industrial-600 leading-relaxed">
                Get practical interventions ranked by a weighted scoring algorithm taking into account your declared budget, ROI, and feasibility.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-sage-50/70 p-8 rounded-2xl border border-sage-200/80 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-forest-900 text-mint-400 flex items-center justify-center mb-6">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-forest-950 font-display">Interactive What-If Simulator</h3>
              <p className="mt-3 text-sm text-industrial-600 leading-relaxed">
                Test scenarios before spending a rupee. Slide electricity or fuel cuts and see dynamic impact on emissions, capex, and annual savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process Section */}
      <section id="how-it-works" className="py-20 bg-sage-50 border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-2">Our Process</h2>
            <p className="text-3xl font-extrabold text-forest-950 font-display">
              From Factory Data to Verified Action in 5 Simple Steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Enter Data', desc: 'Input basic utility bills or upload activity estimates.' },
              { step: '02', title: 'Detect Hotspots', desc: 'Identify your dominant emission source and percentage.' },
              { step: '03', title: 'Get Recommendations', desc: 'Explore prioritized actions matched to your budget.' },
              { step: '04', title: 'Simulate Changes', desc: 'Test reduction scenarios with dynamic sliders and ROI metrics.' },
              { step: '05', title: 'Take Action', desc: 'Export executive-ready action plans for management.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-sage-200 shadow-soft relative">
                <div className="text-2xl font-black text-mint-600/60 font-mono">{item.step}</div>
                <h4 className="mt-2 font-bold text-base text-forest-950 font-display">{item.title}</h4>
                <p className="mt-2 text-xs text-industrial-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USP Section: From Emission Measurement to Action */}
      <section id="usp" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-8 sm:p-14 text-white shadow-elevated relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-mint-400">GreenMind's Unique Value Proposition</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold font-display leading-tight">
                "From Emission Measurement to Action."
              </h2>
              <p className="mt-4 text-base text-sage-200 leading-relaxed">
                Most platforms stop at telling you a total carbon footprint number. GreenMind moves factory leaders from
                mere awareness to profitable decisions: answering <em>where</em> emissions originate, <em>what</em> to change,
                <em>how much</em> it costs, and <em>what happens</em> if you do.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onTryDemo}
                  className="px-6 py-3 bg-mint-500 hover:bg-mint-400 text-forest-950 font-bold rounded-xl shadow-soft transition-all"
                >
                  Explore Demo Factory Now
                </button>
                <button
                  onClick={onStartOnboarding}
                  className="px-6 py-3 bg-forest-800 hover:bg-forest-750 text-white font-semibold rounded-xl border border-forest-700 transition-all"
                >
                  Onboard Your Factory
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-forest-950 text-sage-300 border-t border-forest-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">GreenMind</span>
            <span>• Detect. Reduce. Sustain.</span>
          </div>
          <div>Built for HackOut'26 ClimateTech Challenge</div>
          <div className="text-sage-400">Deterministic GHG Calculations • CEA / EPA / IPCC Standards</div>
        </div>
      </footer>
    </div>
  );
};
