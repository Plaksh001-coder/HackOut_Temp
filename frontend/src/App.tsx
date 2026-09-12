import React, { useState } from 'react';
import { FactoryProvider, useFactory } from './context/FactoryContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmissionsPage } from './pages/EmissionsPage';
import { HotspotsPage } from './pages/HotspotsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { AssistantPage } from './pages/AssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, resetToDemo } = useFactory();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleTryDemo = () => {
    resetToDemo();
    setActiveTab('dashboard');
  };

  const handleAuthSuccess = () => {
    setActiveTab('dashboard');
  };

  // Render Landing Page
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onStartOnboarding={() => setActiveTab('onboarding')}
          onTryDemo={handleTryDemo}
        />
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Render Full Onboarding Wizard
  if (activeTab === 'onboarding') {
    return (
      <div className="min-h-screen bg-sage-50 p-4 sm:p-8">
        <OnboardingPage onComplete={() => setActiveTab('dashboard')} />
      </div>
    );
  }

  // Render Main App inside Layout with Sidebar & Header
  return (
    <Layout onOpenOnboarding={() => setActiveTab('onboarding')}>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'emissions' && <EmissionsPage />}
      {activeTab === 'hotspots' && <HotspotsPage />}
      {activeTab === 'recommendations' && <RecommendationsPage />}
      {activeTab === 'simulator' && <WhatIfSimulatorPage />}
      {activeTab === 'assistant' && <AssistantPage />}
      {activeTab === 'reports' && <ReportsPage />}
      {activeTab === 'settings' && <SettingsPage />}

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </Layout>
  );
};

export function App() {
  return (
    <FactoryProvider>
      <AppContent />
    </FactoryProvider>
  );
}

export default App;
