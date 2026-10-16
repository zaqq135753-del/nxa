import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GuiaCaraivaApp from './screens/GuiaCaraivaApp';
import { MerchantSetup } from './components/partner/MerchantSetup';
import { PartnerPremiumDashboard } from './components/partner/PartnerPremiumDashboard';
import { CustomerOrders } from './components/guia/CustomerOrders';
import { CheckoutPage } from './components/guia/CheckoutPage';
import { CaraivaGuestNfcView } from './components/guia/CaraivaGuestNfcView';
import { CaraivaRealtimeRadarView } from './components/guia/CaraivaRealtimeRadarView';
import { CaraivaExperienceShowcase } from './components/experience/CaraivaExperienceShowcase';
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
  return <main className="merchant-registration-page"><MerchantSetup onClose={() => location.assign('/guia')} /></main>;
}
function PartnerDashboardPage() {
  return <main style={{minHeight:'100vh'}}><PartnerPremiumDashboard onBackToGuide={() => location.assign('/guia')} /></main>;
}
function PartnerDashboardClassicPage() {
  return <main style={{minHeight:'100vh'}}><PartnerPremiumDashboard onBackToGuide={() => location.assign('/parceiros/painel')} /></main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Routes><Route path="/experience" element={<CaraivaExperienceShowcase />} /><Route path="/admin/radar" element={<CaraivaRealtimeRadarView />} /><Route path="/hospede" element={<CaraivaGuestNfcView />} /><Route path="/guia/pedidos" element={<CustomerOrders />} /><Route path="/guia/checkout/:businessId" element={<CheckoutPage />} /><Route path="/parceiros/painel-classico" element={<PartnerDashboardClassicPage />} /><Route path="/parceiros/painel" element={<PartnerDashboardPage />} /><Route path="/business" element={<PartnerDashboardPage />} /><Route path="/parceiros/cadastro" element={<MerchantRegistrationPage />} /><Route path="/guia" element={<GuideRoute />} /><Route path="/" element={<Navigate to="/guia" replace />} /><Route path="*" element={<main style={{padding:40,color:'white'}}>Página indisponível. <a href="/guia">Abrir guia</a></main>} /></Routes></BrowserRouter></StrictMode>);
