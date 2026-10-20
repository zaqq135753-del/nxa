import { StrictMode, Suspense, lazy, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GuiaCaraivaApp from './screens/GuiaCaraivaApp';
import { MerchantSetup } from './components/partner/MerchantSetup';
import { PartnerPremiumDashboard } from './components/partner/PartnerPremiumDashboard';
import { JourneyPage } from './components/guia/journey/JourneyPage';
import { GuideBusinessWorkspace } from './components/guia/journey/GuideBusinessWorkspace';
import { MvpDemoBoundary } from './components/partner/MvpDemoBoundary';
import { RiderAvailability } from './components/rider/RiderAvailability';
import { CheckoutPage } from './components/guia/CheckoutPage';
import { CaraivaGuestNfcView } from './components/guia/CaraivaGuestNfcView';

import { CaraivaExperienceShowcase } from './components/experience/CaraivaExperienceShowcase';
import { CaraivaMagicOnboardingExperience } from './components/partner/onboarding-magic';
import { BubbleNavigationShowcase } from './components/navigation/BubbleNavigationShowcase';
import { CaraivaDeliveryApp } from './components/delivery/CaraivaDeliveryApp';
import { ProjectAccessGate } from './components/security/ProjectAccessGate';
import { ProjectLockBadge } from './components/security/ProjectLockBadge';
import { isProjectUnlocked, initConsoleSecurityBanner } from './services/projectSecurityService';
import './index.css';
import './theme/caraiva-design-system.css';
import './components/guia/caraiva-mobile-layout.css';

function GuideRoute() {
  const query = new URLSearchParams(location.search);
  if (query.has('checkout')) return <Navigate to={'/guia/checkout/' + encodeURIComponent(query.get('checkout')!) + '?modo=' + encodeURIComponent(query.get('modo') || 'goods')} replace />;
  const id = new URLSearchParams(location.search).get('cadastro');
  return id !== null ? <Navigate to={'/parceiros/cadastro?cadastro=' + encodeURIComponent(id)} replace /> : <GuiaCaraivaApp />;
}
function MerchantRegistrationPage() {
  const query = new URLSearchParams(location.search);
  const isClassic = query.get('modo') === 'classic';
  if (isClassic) {
    return <main className="merchant-registration-page"><MerchantSetup onClose={() => location.assign('/guia')} /></main>;
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090B0C' }}>
      <CaraivaMagicOnboardingExperience
        onClose={() => location.assign('/guia')}
        onExploreMap={() => location.assign('/guia?tab=mapa')}
        onOpenDashboard={() => location.assign('/parceiros/painel')}
        inviteCode={query.get('invite') || 'CARAIVA-2026-VIP'}
      />
    </div>
  );
}
function MagicPresentationPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090B0C' }}>
      <CaraivaMagicOnboardingExperience
        onClose={() => location.assign('/guia')}
        onExploreMap={() => location.assign('/guia?tab=mapa')}
        onOpenDashboard={() => location.assign('/parceiros/painel')}
      />
    </div>
  );
}
const DemoBusiness = lazy(() => import('./components/partner/CaraivaUniversalBusinessApp').then(module => ({default: module.CaraivaUniversalBusinessApp})));
const DemoRider = lazy(() => import('./components/rider/RiderSmartCockpitApp').then(module => ({default: module.RiderSmartCockpitApp})));
const DemoRadar = lazy(() => import('./components/guia/CaraivaRealtimeRadarView').then(module => ({default: module.CaraivaRealtimeRadarView})));
function DemoPage({type}: {type: 'business'|'rider'|'radar'}) {
  return <MvpDemoBoundary title={type === 'business' ? 'Business' : type === 'rider' ? 'Entregas' : 'Radar local'}><Suspense fallback={<p role="status">Preparando demonstração…</p>}>{type === 'business' ? <DemoBusiness/> : type === 'rider' ? <DemoRider/> : <DemoRadar/>}</Suspense></MvpDemoBoundary>;
}


import { CaraivaUniversalBusinessApp } from './components/partner/CaraivaUniversalBusinessApp';

function PartnerDashboardPage() {
  return <main style={{minHeight:'100vh'}}><CaraivaUniversalBusinessApp /></main>;
}
function PartnerDashboardWorkspacePage() {
  return <main style={{minHeight:'100vh'}}><GuideBusinessWorkspace /></main>;
}
function PartnerDashboardClassicPage() {
  return <main style={{minHeight:'100vh'}}><MvpDemoBoundary title="Business clássico"><PartnerPremiumDashboard onBackToGuide={() => location.assign('/parceiros/painel')} /></MvpDemoBoundary></main>;
}
function RootApp() {
  const [unlocked, setUnlocked] = useState(() => isProjectUnlocked());

  useEffect(() => {
    initConsoleSecurityBanner();
    }, []);

  if (!unlocked) {
    return <ProjectAccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <>
      <ProjectLockBadge />
      <BrowserRouter>
        <Routes>
        <Route path="/delivery" element={<CaraivaDeliveryApp />} />
        <Route path="/ifood" element={<CaraivaDeliveryApp />} />
        <Route path="/demonstracao/business" element={<DemoPage type="business" />} />
        <Route path="/demonstracao/entregas" element={<DemoPage type="rider" />} />
        <Route path="/demonstracao/radar" element={<DemoPage type="radar" />} />
        <Route path="/entregas" element={<RiderAvailability />} />
        <Route path="/motoboy" element={<RiderAvailability />} />
        <Route path="/entregador" element={<RiderAvailability />} />
        <Route path="/rider" element={<RiderAvailability />} />
        <Route path="/apresentacao" element={<MagicPresentationPage />} />
        <Route path="/parceiros/apresentacao" element={<MagicPresentationPage />} />
        <Route path="/parceiros/magic" element={<MagicPresentationPage />} />
        <Route path="/experience" element={<CaraivaExperienceShowcase />} />
        <Route path="/navegacao" element={<BubbleNavigationShowcase onBack={() => location.assign('/guia')} />} />
        <Route path="/bubble" element={<BubbleNavigationShowcase onBack={() => location.assign('/guia')} />} />
        <Route path="/admin/radar" element={<Navigate to="/demonstracao/radar" replace />} />
        <Route path="/hospede" element={<CaraivaGuestNfcView />} />
        <Route path="/guia/viagem" element={<JourneyPage />} />
        <Route path="/guia/pedidos" element={<Navigate to="/guia/viagem?aba=pedidos" replace />} />
        <Route path="/pedidos" element={<CaraivaDeliveryApp />} />
        <Route path="/guia/checkout/:businessId" element={<CheckoutPage />} />
        <Route path="/parceiros/painel-workspace" element={<PartnerDashboardWorkspacePage />} />
        <Route path="/parceiros/painel-classico" element={<PartnerDashboardClassicPage />} />
        <Route path="/parceiros/painel" element={<PartnerDashboardPage />} />
        <Route path="/business" element={<PartnerDashboardPage />} />
        <Route path="/parceiros/cadastro" element={<MerchantRegistrationPage />} />
        <Route path="/guia" element={<GuideRoute />} />
        <Route path="/" element={<Navigate to="/guia" replace />} />
        <Route path="*" element={<main style={{padding:40,color:'white'}}>Página indisponível. <a href="/guia">Abrir guia</a></main>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
 window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js').catch(() => {}); }, {once:true});
}
