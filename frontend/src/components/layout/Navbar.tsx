import React from 'react';
import { Leaf, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onTryDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onTryDemo }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-sage-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onTryDemo}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-forest-900 via-forest-800 to-mint-500 flex items-center justify-center shadow-soft text-white">
            <Leaf className="w-6 h-6 text-mint-300 transform -rotate-12" />
          </div>
          <div>
            <span className="font-display font-bold text-2xl tracking-tight text-forest-950">
              Green<span className="text-mint-500">Mind</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest font-semibold text-forest-600 -mt-1">
              Detect • Reduce • Sustain
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-industrial-700">
          <a href="#how-it-works" className="hover:text-forest-800 transition-colors">How It Works</a>
          <a href="#capabilities" className="hover:text-forest-800 transition-colors">Capabilities</a>
          <a href="#usp" className="hover:text-forest-800 transition-colors">Our Edge</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-sm font-semibold text-forest-850 hover:text-forest-950 px-3 py-2 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onTryDemo}
            className="flex items-center gap-2 text-sm font-semibold bg-forest-900 hover:bg-forest-800 text-white px-5 py-2.5 rounded-xl shadow-soft hover:shadow-card transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 text-mint-300" />
            <span>Try Demo Factory</span>
            <ArrowRight className="w-4 h-4 text-mint-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
