import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Session } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  onOpenOnboarding: () => void;
  session: Session | null;
  onSignOut: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onOpenOnboarding, session, onSignOut }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sage-50 flex">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenOnboarding={onOpenOnboarding}
          session={session}
          onSignOut={onSignOut}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
