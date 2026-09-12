import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Flame,
  Lightbulb,
  Sliders,
  Bot,
  FileText,
  Settings,
  Leaf,
  Factory,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, factory } = useFactory();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'emissions', label: 'Emission Analysis', icon: BarChart3 },
    { id: 'hotspots', label: 'Hotspot Detection', icon: Flame, badge: 'Key' },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders, highlight: true },
    { id: 'assistant', label: 'GreenMind Assistant', icon: Bot },
    { id: 'reports', label: 'Executive Report', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-industrial-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-forest-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-forest-900 shadow-elevated lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-forest-900">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => { setActiveTab('dashboard'); onCloseMobile?.(); }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint-400 to-forest-600 flex items-center justify-center shadow-soft">
                <Leaf className="w-5 h-5 text-forest-950" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  Green<span className="text-mint-400">Mind</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-mint-200/70 font-semibold -mt-1">
                  ClimateTech SaaS
                </span>
              </div>
            </div>
          </div>

          {/* Active Factory Pill */}
          <div className="px-5 py-4">
            <div className="bg-forest-900/80 rounded-xl p-3 border border-forest-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-mint-300">
                <Factory className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{factory.name}</div>
                <div className="text-[10px] text-sage-300 truncate">{factory.industry}</div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-mint-500 text-forest-950 font-semibold shadow-soft'
                      : 'text-sage-200 hover:text-white hover:bg-forest-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-forest-950' : 'text-sage-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-forest-950/20 text-forest-950'
                          : 'bg-forest-800 text-mint-300 border border-forest-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-mint-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Hackathon attribution */}
        <div className="p-5 border-t border-forest-900/80 bg-forest-950/90">
          <div className="bg-forest-900/60 rounded-xl p-3 border border-forest-800/80 text-xs text-sage-300 space-y-1">
            <div className="flex items-center justify-between font-semibold text-white">
              <span>Demo Platform</span>
              <span className="text-[10px] bg-mint-500/20 text-mint-300 px-1.5 py-0.5 rounded">v1.0</span>
            </div>
            <p className="text-[11px] text-sage-300/80 leading-relaxed">
              HackOut'26 • Deterministic GHG Engine
            </p>
          </div>
          <button
            onClick={() => setActiveTab('landing')}
            className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-sage-300 hover:text-white py-1.5 transition-colors"
          >
            <span>Back to Landing Page</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </aside>
    </>
  );
};
