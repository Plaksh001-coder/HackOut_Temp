import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, Factory, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('plant.manager@greentex.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('GreenTex Operator');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { resetToDemo } = useFactory();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);

    try {
      if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (resetError) throw resetError;
        setNotice('Password reset instructions were sent to your email.');
        return;
      }

      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice('Account created. Check your email to confirm your account, then sign in.');
          setMode('login');
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }

      onSuccess();
      onClose();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueDemo = () => {
    resetToDemo();
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-sage-200 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-industrial-400 hover:text-industrial-700 hover:bg-sage-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-forest-900 text-white items-center justify-center shadow-soft mb-3">
            <Factory className="w-6 h-6 text-mint-400" />
          </div>
          <h3 className="text-2xl font-bold text-forest-950 font-display">
            {mode === 'login' && 'Welcome to GreenMind'}
            {mode === 'signup' && 'Create Factory Account'}
            {mode === 'forgot' && 'Reset Access'}
          </h3>
          <p className="text-xs text-industrial-500 mt-1">
            {mode === 'login' && 'Enter your credentials or test with our pre-loaded factory.'}
            {mode === 'signup' && 'Start calculating and mitigating your factory footprint.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Demo Fast-Track Bypass Button */}
        <button
          type="button"
          onClick={handleContinueDemo}
          className="w-full mb-6 py-3 px-4 rounded-xl bg-mint-50 hover:bg-mint-100/80 border border-mint-300 text-forest-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-soft transition-all"
        >
          <Sparkles className="w-4 h-4 text-mint-600" />
          <span>Continue with Demo Factory (GreenTex)</span>
          <ArrowRight className="w-4 h-4 text-mint-700" />
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sage-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-industrial-400 font-medium">Or continue with email</span>
          </div>
        </div>

        {error && <p className="mb-4 rounded-xl bg-coral-50 border border-coral-200 px-3 py-2 text-xs text-coral-700">{error}</p>}
        {notice && <p className="mb-4 rounded-xl bg-mint-50 border border-mint-200 px-3 py-2 text-xs text-forest-800">{notice}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-industrial-700 mb-1">Full Name / Factory Rep</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-industrial-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-industrial-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-forest-700 hover:text-forest-900 font-medium"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-forest-900 hover:bg-forest-850 disabled:opacity-60 text-white font-bold text-sm shadow-card transition-all"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In to Dashboard' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-industrial-500">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-forest-850 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-forest-850 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
