import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GuiaCaraivaApp from './screens/GuiaCaraivaApp';
import { MerchantSetup } from './components/partner/MerchantSetup';
import { PartnerPremiumDashboard } from './components/partner/PartnerPremiumDashboard';
import { JourneyPage } from './components/guia/journey/JourneyPage';
import { GuideBusinessWorkspace } from './components/guia/journey/GuideBusinessWorkspace';
import { CustomerOrders } from './components/guia/CustomerOrders';
import { CheckoutPage } from './components/guia/CheckoutPage';
import { CaraivaGuestNfcView } from './components/guia/CaraivaGuestNfcView';
import { CaraivaRealtimeRadarView } from './components/guia/CaraivaRealtimeRadarView';
import { CaraivaExperienceShowcase } from './components/experience/CaraivaExperienceShowcase';
import { CaraivaMagicOnboardingExperience } from './components/partner/onboarding-magic';
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
function PartnerDashboardPage() {
  return <main style={{minHeight:'100vh'}}><GuideBusinessWorkspace /></main>;
}
function PartnerDashboardClassicPage() {
  return <main style={{minHeight:'100vh'}}><PartnerPremiumDashboard onBackToGuide={() => location.assign('/parceiros/painel')} /></main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Routes><Route path="/apresentacao" element={<MagicPresentationPage />} /><Route path="/parceiros/apresentacao" element={<MagicPresentationPage />} /><Route path="/parceiros/magic" element={<MagicPresentationPage />} /><Route path="/experience" element={<CaraivaExperienceShowcase />} /><Route path="/admin/radar" element={<CaraivaRealtimeRadarView />} /><Route path="/hospede" element={<CaraivaGuestNfcView />} /><Route path="/guia/viagem" element={<JourneyPage />} /><Route path="/guia/pedidos" element={<CustomerOrders />} /><Route path="/guia/checkout/:businessId" element={<CheckoutPage />} /><Route path="/parceiros/painel-classico" element={<PartnerDashboardClassicPage />} /><Route path="/parceiros/painel" element={<PartnerDashboardPage />} /><Route path="/business" element={<PartnerDashboardPage />} /><Route path="/parceiros/cadastro" element={<MerchantRegistrationPage />} /><Route path="/guia" element={<GuideRoute />} /><Route path="/" element={<Navigate to="/guia" replace />} /><Route path="*" element={<main style={{padding:40,color:'white'}}>Página indisponível. <a href="/guia">Abrir guia</a></main>} /></Routes></BrowserRouter></StrictMode>);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
 window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js').catch(() => {}); }, {once:true});
}
