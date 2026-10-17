import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, CalendarDays, Users, WifiOff } from 'lucide-react';
import { readPlan } from '../../../services/journeyModel';
import { CARAIVA_BUSINESSES } from '../../../data/caraivaDigitalData';
import { orderStatus } from '../../../services/checkoutModel';
import { useJourneyAccount } from './useJourneyAccount';
import { useJourneyOrders } from './useJourneyOrders';
import './journey.css';
export function ContextualHome() {
  const { userId } = useJourneyAccount(); const { orders } = useJourneyOrders(userId);
  const [plan, setPlan] = useState(readPlan), [online, setOnline] = useState(navigator.onLine);
  useEffect(() => { const sync = () => { setPlan(readPlan()); setOnline(navigator.onLine); }; window.addEventListener('caraiva:journey', sync); window.addEventListener('online', sync); window.addEventListener('offline', sync); return () => { window.removeEventListener('caraiva:journey', sync); window.removeEventListener('online', sync); window.removeEventListener('offline', sync); }; }, []);
  const active = orders.find(order => !['entregue','recusado','cancelado'].includes(order.status));
  return <section className="cj-home" aria-label="Sua próxima experiência"><div className="cj-home-focus"><span className="cj-eyebrow">{!online ? <><WifiOff size={15} /> CONEXÃO LIMITADA</> : active ? 'ACOMPANHE SEU MOMENTO' : 'SUA CARAÍVA COMEÇA AQUI'}</span><h2>{active ? CARAIVA_BUSINESSES.find(business => business.id === active.business_id)?.name ?? 'Sua próxima experiência' : plan.length ? `Seu roteiro tem ${plan.length} encontros.` : 'Um dia com a sua cara.'}</h2><p>{active ? orderStatus(active.status, !!active.cd_bookings.length) : plan.length ? 'Suas escolhas estão salvas neste dispositivo. Consulte e reserve quando quiser.' : 'Escolha seus interesses e transforme as descobertas em um roteiro para viver a vila.'}</p><Link className="cj-primary" to={active ? '/guia/viagem?aba=pedidos' : '/guia/viagem'}>{active ? 'Acompanhar solicitação' : plan.length ? 'Continuar minha viagem' : 'Monte meu dia em Caraíva'}<ArrowUpRight size={19} /></Link></div><div className="cj-home-shortcuts"><Link to="/guia/viagem"><Compass size={20} /><span>Meu roteiro<small>Suas próximas paradas</small></span></Link><Link to="/guia/viagem?aba=pedidos"><CalendarDays size={20} /><span>Pedidos e reservas<small>Acompanhe cada etapa</small></span></Link><Link to="/guia/viagem?aba=grupo"><Users size={20} /><span>Com a turma<small>Escolham juntos</small></span></Link></div></section>;
}
