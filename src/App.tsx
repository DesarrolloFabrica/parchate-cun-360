import React, { Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { UnifiedOnboardingHub } from './components/UnifiedOnboardingHub';
import { IntroLoader } from './components/IntroLoader';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getPathForRoute, getRouteFromPathname, type AppRoute, type HubTab } from './navigation';

// Rutas secundarias: se descargan solo al visitarlas para aligerar la carga inicial.
const PresencialOnboarding = lazy(() =>
  import('./components/PresencialOnboarding').then((module) => ({ default: module.PresencialOnboarding })),
);
const VirtualOnboarding = lazy(() =>
  import('./components/VirtualOnboarding').then((module) => ({ default: module.VirtualOnboarding })),
);
const SedeSelectorMap = lazy(() =>
  import('./components/SedeSelectorMap').then((module) => ({ default: module.SedeSelectorMap })),
);

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
    <div className="app-shell flex flex-col antialiased relative">
      
      {/* Absolute intro loading view */}
      <IntroLoader />
      
      {/* Global Navigation Header Component */}
      <Header currentRoute={route} setRoute={handleRouteChange} />

      {/* Primary Transition Screen Section */}
      <main className="grow pb-16">
        <Suspense fallback={<div className="py-24 text-center text-sm text-white/60">Cargando…</div>}>
          <Routes>
            
            <Route path="/" element={<UnifiedOnboardingHub />} />
            <Route path="/hub" element={<UnifiedOnboardingHub />} />
            <Route path="/sedes" element={<SedeSelectorMap />} />
            <Route path="/virtual" element={<VirtualOnboarding onBackToHome={() => handleRouteChange('home')} />} />
            <Route path="/presencial" element={<PresencialOnboarding onBackToHome={() => handleRouteChange('home')} />} />
            <Route path="*" element={<Navigate to={getPathForRoute(route)} replace />} />

          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

