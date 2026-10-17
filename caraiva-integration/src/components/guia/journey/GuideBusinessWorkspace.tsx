import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
import type { Tables } from '../../../services/database.journey.types';
import { allowedKinds, orderStatus } from '../../../services/checkoutModel';
import { BusinessHighlight } from './BusinessHighlight';
import { ConciergeQr } from './ConciergeQr';
import { JourneyAuth } from './JourneyAuth';
import { useJourneyAccount } from './useJourneyAccount';
import './journey.css';
type Business = Pick<Tables<'cd_businesses'>, 'id' | 'name' | 'niche' | 'accepting_orders' | 'delivery_fee_cents'>;
type Order = Tables<'cd_orders'> & { cd_order_lines: { name: string; quantity: number }[]; cd_bookings: { id: string; starts_at: string; seats: number }[] };
const brl = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export function GuideBusinessWorkspace() {
  const { userId, ready } = useJourneyAccount();
  const [businesses, setBusinesses] = useState<Business[]>([]), [businessId, setBusinessId] = useState('');
  const [items, setItems] = useState<Tables<'cd_offerings'>[]>([]), [orders, setOrders] = useState<Order[]>([]), [requests, setRequests] = useState<Tables<'cd_service_requests'>[]>([]);
  const [tab, setTab] = useState('operacao'), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false), [loaded, setLoaded] = useState(false);
  const [name, setName] = useState(''), [price, setPrice] = useState(''), [kind, setKind] = useState('product'), [capacity, setCapacity] = useState(1), [stock, setStock] = useState(''), [fee, setFee] = useState('0');
  const business = businesses.find(item => item.id === businessId);
  const refresh = useCallback(async () => {
    if (!db || !userId || !businessId) return;
    const [catalog, incoming, service, configuration] = await Promise.all([
      db.from('cd_offerings').select('*').eq('business_id', businessId).order('name'),
      db.from('cd_orders').select('*,cd_order_lines(name,quantity),cd_bookings(id,starts_at,seats)').eq('business_id', businessId).order('created_at', { ascending: false }).limit(100),
      db.from('cd_service_requests').select('*').eq('business_id', businessId).order('created_at', { ascending: false }).limit(100),
      db.from('cd_businesses').select('id,name,niche,accepting_orders,delivery_fee_cents').eq('id', businessId).single()
    ]);
    if (catalog.error || incoming.error || service.error || configuration.error) throw Error('Não foi possível consultar a operação.');
    setItems(catalog.data ?? []); setOrders(incoming.data ?? []); setRequests(service.data ?? []);
    if (configuration.data) setBusinesses(previous => previous.map(item => item.id === businessId ? configuration.data : item));
  }, [userId, businessId]);
  useEffect(() => {
    setBusinesses([]); setItems([]); setOrders([]); setRequests([]); setLoaded(false);
    if (!db || !userId) return;
    let active = true;
    void db.from('cd_members').select('business_id,cd_businesses(id,name,niche,accepting_orders,delivery_fee_cents)').eq('user_id', userId).then(({ data, error }) => {
      if (!active) return;
      setLoaded(true); if (error) { setNotice('Não foi possível verificar seus estabelecimentos.'); return; }
      const list = (data ?? []).flatMap(member => member.cd_businesses ? [member.cd_businesses] : []);
      const requested = new URLSearchParams(location.search).get('negocio');
      setBusinesses(list); setBusinessId(previous => list.some(item => item.id === previous) ? previous : list.find(item => item.id === requested)?.id ?? list[0]?.id ?? '');
    }); return () => { active = false; };
  }, [userId]);
  useEffect(() => {
    setItems([]); setOrders([]); setRequests([]);
    const load = () => void refresh().catch(() => setNotice('Atualização indisponível. Tente novamente.'));
    load(); const timer = setInterval(load, 15000); return () => clearInterval(timer);
  }, [refresh]);
  useEffect(() => { if (business) { setKind(allowedKinds(business.niche)[0] ?? 'product'); setFee(String(business.delivery_fee_cents / 100)); } }, [business?.id, business?.niche, business?.delivery_fee_cents]);
  async function run(action: () => Promise<void>) {
    if (busy) return; if (!navigator.onLine) { setNotice('Conecte-se para alterar a operação.'); return; }
    setBusy(true); setNotice(''); try { await action(); await refresh(); } catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível salvar.'); } finally { setBusy(false); }
  }
  async function saveOffering() {
    if (!db || !business) return;
    const cents = Math.round(Number(price.replace(',', '.')) * 100), units = stock.trim() ? Number(stock) : null;
    if (!name.trim() || !Number.isSafeInteger(cents) || cents < 0 || (units !== null && (!Number.isSafeInteger(units) || units < 0)) || !Number.isInteger(capacity) || capacity < 1 || !allowedKinds(business.niche).includes(kind)) throw Error('Revise nome, preço, estoque e capacidade.');
    const { error } = await db.from('cd_offerings').insert({ id: crypto.randomUUID(), business_id: businessId, name: name.trim(), kind, price_cents: cents, stock: ['product','retail'].includes(kind) ? units : null, capacity, duration_min: kind === 'room' ? 1440 : 60, available: true, details: {} });
    if (error) throw error; setName(''); setPrice(''); setStock(''); setNotice('Item publicado no catálogo conectado.');
  }
  async function toggleReceiving() {
    if (!db || !business) return;
    if (!business.accepting_orders && !items.some(item => item.available)) throw Error('Cadastre e ative ao menos um item antes de receber solicitações.');
    const { error } = await db.from('cd_businesses').update({ accepting_orders: !business.accepting_orders }).eq('id', businessId); if (error) throw error;
  }
  async function advance(id: string, status: string) { if (!db) return; const result = await db.rpc('cd_set_order_status', { p_order: id, p_status: status }); if (result.error) throw result.error; }
  const pending = orders.filter(order => order.status === 'novo');
  const completed = orders.filter(order => order.status === 'entregue');
  const paid = orders.filter(order => order.payment_status === 'paid').reduce((total, order) => total + order.total_cents, 0);
  return <main className="cj-page"><div className="cj-container"><header className="cj-top"><Link to="/guia">← Caraíva Digital</Link><Link to="/parceiros/painel-classico">Abrir demonstração visual</Link></header><div className="cj-heading"><small>CARAÍVA BUSINESS · OPERAÇÃO CONECTADA</small><h1>Seu negócio.<span> Dentro da vila.</span></h1><p>Pedidos, reservas, catálogo e atendimento vinculados à sua conta.</p></div>{notice && <p className="cj-notice" role="status">{notice}</p>}{!ready ? <p role="status">Verificando seu acesso…</p> : !userId ? <JourneyAuth /> : <><div className="cj-row"><label>Estabelecimento<select value={businessId} onChange={event => setBusinessId(event.target.value)}>{businesses.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button onClick={() => void db?.auth.signOut()}>Sair</button></div>{!loaded && <p role="status">Consultando seus vínculos…</p>}{loaded && !business && <p>Esta conta ainda não tem um estabelecimento vinculado.</p>}{business && <><nav className="cj-tabs" aria-label="Áreas do Business">{[['operacao','Pedidos e reservas'],['catalogo','Catálogo'],['atendimento','Atendimento'],['inteligencia','Oportunidades']].map(([id, label]) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}>{label}</button>)}</nav><section className="cj-panel"><div className="cj-row"><div><h2>{business.name}</h2><p>{business.accepting_orders ? 'Recebimento ativado' : 'Recebimento pausado'}</p></div><button disabled={busy} onClick={() => void run(toggleReceiving)}>{business.accepting_orders ? 'Pausar recebimento' : 'Ativar recebimento'}</button></div><p>Pagamento online não configurado. Os valores abaixo vêm das solicitações registradas no sistema.</p></section>
    {tab === 'operacao' && <div className="cj-stack" style={{ marginTop: 20 }}>{!orders.length && <p>Nenhum pedido ou reserva recebido.</p>}{orders.map(order => <article className="cj-panel" key={order.id}><small>{order.id}</small><h2>{order.customer_name}</h2><span className="cj-badge">{orderStatus(order.status, !!order.cd_bookings.length, typeof order.destination === 'object' && order.destination !== null && !Array.isArray(order.destination) && order.destination.type === 'entrega')}</span>{order.cd_order_lines.map((line, index) => <p key={index}>{line.quantity} × {line.name}</p>)}{order.cd_bookings.map(booking => <p key={booking.id}>{new Date(booking.starts_at).toLocaleString('pt-BR')} · {booking.seats} pessoa(s)</p>)}<strong>{brl(order.total_cents)}</strong><p>{order.payment_status === 'paid' ? 'Pagamento confirmado' : 'Pagamento não confirmado'}</p><div className="cj-row">{order.status === 'novo' && <><button disabled={busy} onClick={() => void run(() => advance(order.id, 'preparando'))}>Aceitar</button><button disabled={busy} onClick={() => void run(() => advance(order.id, 'recusado'))}>Recusar</button></>}{['preparando','em_rota'].includes(order.status) && <button disabled={busy || (!!order.cd_bookings.length && order.total_cents > 0 && order.payment_status !== 'paid')} onClick={() => void run(() => advance(order.id, 'entregue'))}>Concluir atendimento</button>}</div></article>)}</div>}
    {tab === 'catalogo' && <section className="cj-panel" style={{ marginTop: 20 }}><h2>Catálogo do estabelecimento</h2><form className="cj-stack" onSubmit={event => { event.preventDefault(); void run(saveOffering); }}><label>Nome<input required maxLength={150} value={name} onChange={event => setName(event.target.value)} /></label><div className="cj-row"><label>Tipo<select value={kind} onChange={event => setKind(event.target.value)}>{allowedKinds(business.niche).map(type => <option key={type} value={type}>{({ product:'Produto / cardápio', retail:'Produto da loja', table:'Reserva de mesa', room:'Diária de quarto', tour:'Passeio', service:'Serviço', ticket:'Ingresso' } as Record<string,string>)[type]}</option>)}</select></label><label>Preço em reais<input required inputMode="decimal" value={price} onChange={event => setPrice(event.target.value)} /></label></div>{['product','retail'].includes(kind) ? <label>Estoque (vazio para não controlar)<input type="number" min={0} step={1} value={stock} onChange={event => setStock(event.target.value)} /></label> : <label>Capacidade simultânea<input type="number" min={1} max={10000} required value={capacity} onChange={event => setCapacity(Number(event.target.value))} /></label>}<small>Quartos: preço por diária. Mesas, passeios, ingressos e serviços: preço por pessoa. Duração inicial de uma hora, exceto quartos.</small><button className="cj-primary" disabled={busy}>Publicar item</button></form><div className="cj-stack" style={{ marginTop: 24 }}>{items.map(item => <article className="cj-line" key={item.id}><div><strong>{item.name}</strong><p>{brl(item.price_cents)} · {item.kind} · {item.stock === null ? 'Sem controle de estoque' : `${item.stock} em estoque`}</p></div><button disabled={busy} onClick={() => void run(async () => { const result = await db!.from('cd_offerings').update({ available: !item.available }).eq('id', item.id).eq('business_id', businessId); if (result.error) throw result.error; })}>{item.available ? 'Pausar item' : 'Disponibilizar'}</button></article>)}</div><form className="cj-row" onSubmit={event => { event.preventDefault(); void run(async () => { const cents = Math.round(Number(fee.replace(',','.')) * 100); if (!Number.isSafeInteger(cents) || cents < 0) throw Error('Taxa inválida.'); const result = await db!.from('cd_businesses').update({ delivery_fee_cents: cents }).eq('id', businessId); if (result.error) throw result.error; }); }}><label>Taxa de entrega (R$)<input inputMode="decimal" value={fee} onChange={event => setFee(event.target.value)} /></label><button disabled={busy}>Salvar taxa</button></form></section>}
    {tab === 'atendimento' && business.niche === 'pousada' && <ConciergeQr businessId={businessId} name={business.name}/>}
    {tab === 'atendimento' && <section className="cj-panel" style={{ marginTop: 20 }}><h2>Solicitações de atendimento</h2>{!requests.length && <p>Nenhuma solicitação recebida.</p>}<div className="cj-stack">{requests.map(request => <article className="cj-line" key={request.id}><div><strong>{request.kind}</strong><p>{request.detail}</p><small>{new Date(request.created_at).toLocaleString('pt-BR')} · {request.status}</small></div>{!['concluido','cancelado'].includes(request.status) && <button disabled={busy} onClick={() => void run(async () => { const result = await db!.from('cd_service_requests').update({ status: request.status === 'novo' ? 'em_atendimento' : 'concluido', updated_at: new Date().toISOString() }).eq('id', request.id).eq('business_id', businessId); if (result.error) throw result.error; })}>{request.status === 'novo' ? 'Iniciar atendimento' : 'Concluir'}</button>}</article>)}</div></section>}
    {tab === 'inteligencia' && <BusinessHighlight key={businessId} businessId={businessId} items={items}/>}
    {tab === 'inteligencia' && <section className="cj-panel" style={{ marginTop: 20 }}><h2>Decisões com dados da sua operação</h2><p>Base: até os 100 pedidos mais recentes consultados. Não inclui visitas nem estimativas de receita.</p><div className="cj-row"><span className="cj-badge">{pending.length} aguardando aceite</span><span className="cj-badge">{completed.length} concluídos</span><span className="cj-badge">{brl(paid)} com pagamento confirmado</span></div><ul>{!business.accepting_orders && <li>Seu recebimento está pausado. Ative quando puder atender.</li>}{!items.length && <li>Cadastre seu catálogo para receber solicitações pelo Guia.</li>}{items.some(item => item.stock === 0 && item.available) && <li>Há itens ativos com estoque zerado. Reponha ou pause esses produtos.</li>}{pending.length > 0 && <li>Revise as {pending.length} solicitações que aguardam uma resposta.</li>}{requests.some(request => request.status === 'novo') && <li>Há hóspedes ou visitantes aguardando atendimento.</li>}</ul><p>Não exibimos escassez, clientes próximos ou faturamento estimado sem uma fonte operacional.</p></section>}
    </>}</>}</div></main>;
}
