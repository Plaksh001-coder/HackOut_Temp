import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Calendar,
  Sparkles,
  ChevronDown,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenOnboarding }) => {
  const { factory, resetToDemo } = useFactory();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-sage-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-soft">
      {/* Left side: Hamburger + Factory identity */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-industrial-600 hover:bg-sage-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-forest-950 font-display">
              {factory.name}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-mint-50 text-forest-700 border border-mint-200">
              Verified Baseline
            </span>
          </div>
          <div className="text-xs text-industrial-500 flex items-center gap-2">
            <span>{factory.location}</span>
            <span>•</span>
            <span className="text-industrial-600 font-medium">{factory.industry}</span>
          </div>
        </div>
      </div>

      {/* Right side: Period selector, Reset demo button, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Analysis Period Badge */}
        <div className="hidden md:flex items-center gap-2 bg-sage-100/70 border border-sage-200 px-3 py-1.5 rounded-xl text-xs font-medium text-industrial-700">
          <Calendar className="w-3.5 h-3.5 text-forest-700" />
          <span>Annual Audit FY 2025-26</span>
        </div>

        {/* Quick Factory Onboard / Switch button */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 text-xs font-semibold bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200 px-3 py-1.5 rounded-xl transition-colors"
          title="Update or onboard another factory"
        >
          <Sparkles className="w-3.5 h-3.5 text-mint-600" />
          <span className="hidden sm:inline">Edit Data</span>
        </button>

        {/* Reset to Demo Factory Button */}
        <button
          onClick={resetToDemo}
          className="p-2 rounded-xl text-industrial-500 hover:text-forest-900 hover:bg-sage-100 border border-transparent hover:border-sage-200 transition-all"
          title="Reset to Demo Factory Data (GreenTex)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-industrial-600 hover:bg-sage-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-sage-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-sage-100">
                <span className="font-semibold text-xs text-forest-950 uppercase tracking-wider">Alerts & Insights</span>
                <span className="text-[10px] text-mint-600 font-semibold bg-mint-50 px-1.5 py-0.5 rounded">Live</span>
              </div>
              <div className="py-3 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-sage-50 border border-sage-200/60">
                  <div className="font-semibold text-forest-900">Electricity Hotspot Alert</div>
                  <div className="text-industrial-600 text-[11px] mt-0.5">Electricity forms 48.2% of your footprint. 20% efficiency cut saves ~16.4 tCO₂e.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-sage-50 border border-sage-200/60">
                  <div className="font-semibold text-forest-900">Intervention Match</div>
                  <div className="text-industrial-600 text-[11px] mt-0.5">3 high-impact actions found within your ₹5,00,000 budget.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-sage-200">
          <div className="w-9 h-9 rounded-full bg-forest-900 text-white flex items-center justify-center font-semibold text-xs shadow-soft">
            GT
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-forest-950">Plant Engineer</div>
            <div className="text-[10px] text-industrial-500">Facility #04</div>
          </div>
        </div>
      </div>
    </header>
  );
};
