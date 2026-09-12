import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Globe,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Building,
  ShieldCheck
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';

export const SettingsPage: React.FC = () => {
  const {
    factory,
    updateFactoryProfile,
    currency,
    setCurrency,
    resetToDemo
  } = useFactory();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [profileName, setProfileName] = useState(factory.name);
  const [industry, setIndustry] = useState(factory.industry);
  const [location, setLocation] = useState(factory.location);
  const [budget, setBudget] = useState(factory.budget_inr);
  const [targetPct, setTargetPct] = useState(factory.reduction_target_pct);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFactoryProfile({
      name: profileName,
      industry,
      location,
      budget_inr: Number(budget),
      reduction_target_pct: Number(targetPct)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 bg-forest-50 border border-forest-100 px-3 py-1 rounded-full uppercase tracking-wide mb-2">
              <Settings className="w-3.5 h-3.5 text-mint-600" />
              <span>Configuration & Preferences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-950 font-display">
              Platform & Factory Settings
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-industrial-600">
              Customize calculation standards, currency formats, and facility operational limits.
            </p>
          </div>

          <button
            onClick={resetToDemo}
            className="flex items-center gap-2 bg-sage-100 hover:bg-sage-200 text-forest-950 font-semibold text-xs px-4 py-2.5 rounded-xl border border-sage-200 transition-all self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to GreenTex Demo</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Regional & Standard Calculations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
          <div className="flex items-center gap-2 pb-4 border-b border-sage-100 mb-5">
            <Globe className="w-4 h-4 text-forest-700" />
            <h3 className="text-base font-bold text-forest-950 font-display">
              Calculation Standards & Currency
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                Grid Electricity Emission Factor Source
              </label>
              <div className="w-full px-4 py-3 rounded-xl border border-sage-200 text-xs sm:text-sm bg-sage-50 font-medium text-forest-950">
                India (Central Electricity Authority Baseline: 0.82 kg CO₂e/kWh)
              </div>
              <span className="text-[11px] text-industrial-500 mt-1 block">
                Adjusts electricity calculation factor across all dashboard views.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-xs sm:text-sm bg-white font-medium"
              >
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
              </select>
              <span className="text-[11px] text-industrial-500 mt-1 block">
                Currency formatting for implementation capex and financial savings.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Facility Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-card">
          <div className="flex items-center gap-2 pb-4 border-b border-sage-100 mb-5">
            <Building className="w-4 h-4 text-forest-700" />
            <h3 className="text-base font-bold text-forest-950 font-display">
              Facility Information & Targets
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                Factory Legal Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                Industry Sector
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                Plant Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wide mb-1.5">
                Declared Sustainability Budget (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
                className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm font-medium font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Save Button & Status */}
        <div className="flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-mint-700 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-mint-600" />
                <span>Settings saved and applied successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-forest-900 hover:bg-forest-850 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-soft transition-all"
          >
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
