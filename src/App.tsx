import React from 'react';
import { Header } from './components/Header';
import { HomeOnboarding } from './components/HomeOnboarding';
import { UnifiedOnboardingHub } from './components/UnifiedOnboardingHub';
import { IntroLoader } from './components/IntroLoader';
import { MonthlySmartAlerts } from './components/MonthlySmartAlerts';
import { PresencialOnboarding } from './components/PresencialOnboarding';
import { VirtualOnboarding } from './components/VirtualOnboarding';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getPathForRoute, getRouteFromPathname, type AppRoute, type HubTab } from './navigation';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const route = getRouteFromPathname(location.pathname);

  const handleRouteChange = (nextRoute: AppRoute) => {
    navigate(getPathForRoute(nextRoute));
  };

  const handleNavigateToHubTab = (tab: HubTab) => {
    navigate(`/hub?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-brand-green-dark flex flex-col font-sans antialiased text-white relative">
      
      {/* Absolute intro loading view */}
      <IntroLoader />
      
      {/* Global Navigation Header Component */}
      <Header currentRoute={route} setRoute={handleRouteChange} />

      {/* Primary Transition Screen Section */}
      <main className="grow pb-16">
        <Routes>
          
          <Route path="/" element={<UnifiedOnboardingHub />} />
          <Route path="/virtual" element={<VirtualOnboarding onBackToHome={() => handleRouteChange('home')} />} />
          <Route path="/presencial" element={<PresencialOnboarding onBackToHome={() => handleRouteChange('home')} />} />
          <Route path="*" element={<Navigate to={getPathForRoute(route)} replace />} />

        </Routes>
      </main>

      {/* Spontaneous Smart Alert Popups */}
      <MonthlySmartAlerts onNavigateToHubTab={handleNavigateToHubTab} />

    </div>
  );
}

