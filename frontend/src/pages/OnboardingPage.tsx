import React, { useState } from 'react';
import {
  Factory,
  Zap,
  Flame,
  Package,
  Trash2,
  DollarSign,
  Target,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { DEMO_FACTORY } from '../services/fallbackEngine';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { updateFactoryProfile, updateActivityData, factory } = useFactory();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [formData, setFormData] = useState({
    name: factory.name,
    industry: factory.industry,
    location: factory.location,
    production_type: factory.production_type,
    production_volume: factory.production_volume,
    electricity_kwh: factory.activity_data.electricity_kwh,
    natural_gas_m3: factory.activity_data.natural_gas_m3,
    raw_materials_kg: factory.activity_data.raw_materials_kg,
    waste_tonnes: factory.activity_data.waste_tonnes,
    sustainability_goals: factory.sustainability_goals,
    reduction_target_pct: factory.reduction_target_pct,
    budget_inr: factory.budget_inr,
  });

  const handlePreFillDemo = () => {
    setFormData({
      name: DEMO_FACTORY.name,
      industry: DEMO_FACTORY.industry,
      location: DEMO_FACTORY.location,
      production_type: DEMO_FACTORY.production_type,
      production_volume: DEMO_FACTORY.production_volume,
      electricity_kwh: DEMO_FACTORY.activity_data.electricity_kwh,
      natural_gas_m3: DEMO_FACTORY.activity_data.natural_gas_m3,
      raw_materials_kg: DEMO_FACTORY.activity_data.raw_materials_kg,
      waste_tonnes: DEMO_FACTORY.activity_data.waste_tonnes,
      sustainability_goals: DEMO_FACTORY.sustainability_goals,
      reduction_target_pct: DEMO_FACTORY.reduction_target_pct,
      budget_inr: DEMO_FACTORY.budget_inr,
    });
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateFactoryProfile({
      name: formData.name,
      industry: formData.industry,
      location: formData.location,
      production_type: formData.production_type,
      production_volume: Number(formData.production_volume),
      sustainability_goals: formData.sustainability_goals,
      reduction_target_pct: Number(formData.reduction_target_pct),
      budget_inr: Number(formData.budget_inr),
    });

    updateActivityData({
      electricity_kwh: Number(formData.electricity_kwh),
      natural_gas_m3: Number(formData.natural_gas_m3),
      raw_materials_kg: Number(formData.raw_materials_kg),
      waste_tonnes: Number(formData.waste_tonnes),
    });

    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header with Step Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-sage-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sage-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-mint-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Factory Onboarding</span>
            </div>
            <h2 className="text-2xl font-bold text-forest-950 font-display">
              {step === 1 && 'Step 1: Facility Profile'}
              {step === 2 && 'Step 2: Annual Activity & Energy Data'}
              {step === 3 && 'Step 3: Sustainability Budget & Targets'}
            </h2>
            <p className="text-xs text-industrial-500 mt-0.5">
              Fill in your manufacturing metrics to generate authoritative carbon baselines.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePreFillDemo}
            className="flex items-center gap-2 text-xs font-semibold bg-mint-50 hover:bg-mint-100/80 text-forest-900 border border-mint-200 px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-mint-600" />
            <span>Load GreenTex Demo Data</span>
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center justify-between mt-6 max-w-md mx-auto">
          {[
            { num: 1, label: 'Profile' },
            { num: 2, label: 'Activity' },
            { num: 3, label: 'Targets' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === s.num
                    ? 'bg-forest-900 text-white ring-4 ring-mint-100'
                    : step > s.num
                    ? 'bg-mint-500 text-forest-950 font-black'
                    : 'bg-sage-100 text-industrial-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs font-semibold ${step === s.num ? 'text-forest-950' : 'text-industrial-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleFinish} className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-sage-200">
        {/* STEP 1: Factory Profile */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                  Factory Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. GreenTex Manufacturing Pvt Ltd"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                  Industry Sector
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm bg-white"
                >
                  <option value="Textile Manufacturing">Textile Manufacturing</option>
                  <option value="Automotive Components">Automotive Components</option>
                  <option value="Chemicals & Plastics">Chemicals & Plastics</option>
                  <option value="Food & Agro Processing">Food & Agro Processing</option>
                  <option value="Metal Fabrication & Machining">Metal Fabrication & Machining</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                  Plant Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="e.g. Surat, Gujarat, India"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                  Production Type
                </label>
                <input
                  type="text"
                  value={formData.production_type}
                  onChange={(e) => setFormData({ ...formData, production_type: e.target.value })}
                  placeholder="e.g. Woven & Knit Textiles"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                  Annual Production Output
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.production_volume}
                    onChange={(e) => setFormData({ ...formData, production_volume: Number(e.target.value) })}
                    placeholder="500000"
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
                  />
                  <span className="absolute right-4 top-3 text-xs text-industrial-400 font-medium">units/year</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-forest-900 hover:bg-forest-850 text-white font-semibold px-6 py-3 rounded-xl shadow-soft transition-all"
              >
                <span>Continue to Activity Data</span>
                <ArrowRight className="w-4 h-4 text-mint-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Activity Data */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Electricity */}
              <div className="bg-sage-50/60 p-4 rounded-2xl border border-sage-200">
                <div className="flex items-center gap-2 text-forest-900 font-bold text-xs uppercase mb-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Annual Grid Electricity</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.electricity_kwh}
                    onChange={(e) => setFormData({ ...formData, electricity_kwh: Number(e.target.value) })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm bg-white font-semibold text-forest-950"
                  />
                  <span className="absolute right-4 top-3 text-xs text-industrial-500 font-semibold">kWh/year</span>
                </div>
                <div className="mt-1.5 text-[11px] text-industrial-500">Benchmark Scope 2 grid electricity (0.82 kg CO₂e/kWh)</div>
              </div>

              {/* Natural Gas */}
              <div className="bg-sage-50/60 p-4 rounded-2xl border border-sage-200">
                <div className="flex items-center gap-2 text-forest-900 font-bold text-xs uppercase mb-2">
                  <Flame className="w-4 h-4 text-coral-500" />
                  <span>Natural Gas / Fuel</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.natural_gas_m3}
                    onChange={(e) => setFormData({ ...formData, natural_gas_m3: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm bg-white font-semibold text-forest-950"
                  />
                  <span className="absolute right-4 top-3 text-xs text-industrial-500 font-semibold">m³/year</span>
                </div>
                <div className="mt-1.5 text-[11px] text-industrial-500">Boiler & stationary combustion (2.03 kg CO₂e/m³)</div>
              </div>

              {/* Raw Materials */}
              <div className="bg-sage-50/60 p-4 rounded-2xl border border-sage-200">
                <div className="flex items-center gap-2 text-forest-900 font-bold text-xs uppercase mb-2">
                  <Package className="w-4 h-4 text-forest-600" />
                  <span>Raw Materials / Yarn</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.raw_materials_kg}
                    onChange={(e) => setFormData({ ...formData, raw_materials_kg: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm bg-white font-semibold text-forest-950"
                  />
                  <span className="absolute right-4 top-3 text-xs text-industrial-500 font-semibold">kg/year</span>
                </div>
                <div className="mt-1.5 text-[11px] text-industrial-500">Upstream Scope 3 textile footprint (4.50 kg CO₂e/kg)</div>
              </div>

              {/* Industrial Waste */}
              <div className="bg-sage-50/60 p-4 rounded-2xl border border-sage-200">
                <div className="flex items-center gap-2 text-forest-900 font-bold text-xs uppercase mb-2">
                  <Trash2 className="w-4 h-4 text-industrial-500" />
                  <span>Solid Waste Generation</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.waste_tonnes}
                    onChange={(e) => setFormData({ ...formData, waste_tonnes: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm bg-white font-semibold text-forest-950"
                  />
                  <span className="absolute right-4 top-3 text-xs text-industrial-500 font-semibold">tonnes/year</span>
                </div>
                <div className="mt-1.5 text-[11px] text-industrial-500">Landfill & process waste (580 kg CO₂e/tonne)</div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-sage-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-industrial-600 hover:text-industrial-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-forest-900 hover:bg-forest-850 text-white font-semibold px-6 py-3 rounded-xl shadow-soft transition-all"
              >
                <span>Continue to Goals & Budget</span>
                <ArrowRight className="w-4 h-4 text-mint-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Goals & Sustainability Budget */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                  Sustainability Target / Goal
                </label>
                <input
                  type="text"
                  value={formData.sustainability_goals}
                  onChange={(e) => setFormData({ ...formData, sustainability_goals: e.target.value })}
                  placeholder="e.g. Cut emissions by 20% in FY 2026-2027"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                    Target Emission Reduction (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={formData.reduction_target_pct}
                      onChange={(e) => setFormData({ ...formData, reduction_target_pct: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm font-semibold"
                    />
                    <span className="absolute right-4 top-3 text-xs text-industrial-500 font-semibold">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                    Available Sustainability Budget (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.budget_inr}
                      onChange={(e) => setFormData({ ...formData, budget_inr: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm font-semibold"
                    />
                    <span className="absolute right-4 top-3 text-xs text-industrial-500 font-semibold">INR</span>
                  </div>
                  <div className="mt-1 text-[11px] text-industrial-500">Recommendations are scored against this budget.</div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-sage-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-industrial-600 hover:text-industrial-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-mint-500 hover:bg-mint-400 text-forest-950 font-bold px-7 py-3 rounded-xl shadow-soft transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-forest-950" />
                <span>Launch Analysis & Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
