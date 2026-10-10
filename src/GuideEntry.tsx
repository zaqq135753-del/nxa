import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GuiaCaraivaApp from './screens/GuiaCaraivaApp';
import { MerchantSetup } from './components/partner/MerchantSetup';
import { PartnerPremiumDashboard } from './components/partner/PartnerPremiumDashboard';
import './index.css';
import './theme/caraiva-design-system.css';
import './components/guia/caraiva-mobile-layout.css';
function GuideRoute() {
  const id = new URLSearchParams(location.search).get('cadastro');
  return id !== null ? <Navigate to={'/parceiros/cadastro?cadastro=' + encodeURIComponent(id)} replace /> : <GuiaCaraivaApp />;
}
function MerchantRegistrationPage() {
  return <main className="merchant-registration-page"><MerchantSetup onClose={() => location.assign('/guia')} /></main>;
}
function PartnerDashboardPage() {
  return <main style={{minHeight:'100vh',background:'#FAF6EE'}}><PartnerPremiumDashboard onBackToGuide={() => location.assign('/guia')} /></main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Routes><Route path="/parceiros/painel" element={<PartnerDashboardPage />} /><Route path="/parceiros/cadastro" element={<MerchantRegistrationPage />} /><Route path="/guia" element={<GuideRoute />} /><Route path="/" element={<Navigate to="/guia" replace />} /><Route path="*" element={<main style={{padding:40,color:'white'}}>Página indisponível. <a href="/guia">Abrir guia</a></main>} /></Routes></BrowserRouter></StrictMode>);
