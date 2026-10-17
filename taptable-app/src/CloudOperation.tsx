import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.journey.types';
const db = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) : null;
type Order = { id: string; status: string; customer_name: string; total_cents: number; payment_status: string; created_at: string; cd_order_lines: { name: string; quantity: number }[]; cd_bookings: { starts_at: string; seats: number }[] };
export default function CloudOperation() {
  const [userId, setUserId] = useState<string | null>(null), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([]), [businessId, setBusinessId] = useState(''), [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!db) return; let active = true;
    void db.auth.getUser().then(({ data }) => { if (active) setUserId(data.user?.id ?? null); });
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => { if (active) setUserId(session?.user.id ?? null); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    setBusinesses([]); setOrders([]); if (!db || !userId) return; let active = true;
    void db.from('cd_members').select('cd_businesses(id,name,niche)').eq('user_id', userId).then(({ data, error }) => {
      if (!active) return; if (error) { setNotice('Não foi possível consultar seus restaurantes.'); return; }
      const list = (data ?? []).flatMap(member => member.cd_businesses && ['restaurante','noite'].includes(member.cd_businesses.niche) ? [member.cd_businesses] : []);
      setBusinesses(list); setBusinessId(list[0]?.id ?? '');
    }); return () => { active = false; };
  }, [userId]);
  useEffect(() => {
    setOrders([]); if (!db || !userId || !businessId) return; let active = true;
    const refresh = async () => {
      const result = await db!.from('cd_orders').select('id,status,customer_name,total_cents,payment_status,created_at,cd_order_lines(name,quantity),cd_bookings(starts_at,seats)').eq('business_id', businessId).order('created_at', { ascending: false }).limit(100);
      if (!active) return; if (result.error) { setNotice('Consulta indisponível. As informações anteriores podem estar desatualizadas.'); return; } setOrders(result.data ?? []);
    };
    void refresh(); const timer = setInterval(() => void refresh(), 15000); return () => { active = false; clearInterval(timer); };
  }, [userId, businessId]);
  async function login() {
    if (!db || busy) return; setBusy(true); setNotice('');
    try { const result = await db.auth.signInWithPassword({ email, password }); if (result.error) throw result.error; setPassword(''); }
    catch { setNotice('Não foi possível entrar. Confira e-mail e senha.'); } finally { setBusy(false); }
  }
  async function advance(order: Order, status: string) {
    if (!db || busy) return; setBusy(true); setNotice('');
    try { const result = await db.rpc('cd_set_order_status', { p_order: order.id, p_status: status }); if (result.error) throw result.error; setOrders(previous => previous.map(item => item.id === order.id ? { ...item, status } : item)); }
    catch { setNotice('Não foi possível alterar o estado. Consulte o pedido e tente novamente.'); } finally { setBusy(false); }
  }
  const style = { minHeight:'100dvh',background:'#090B0C',color:'#FFF4ED',padding:24,fontFamily:'system-ui' } as const;
  const field = { padding:14,borderRadius:12,background:'#141719',border:'1px solid #5F7D63',color:'#FFF4ED',width:'100%',boxSizing:'border-box' } as const;
  return <main style={style}><div style={{ maxWidth:1180,margin:'auto' }}><a href="/" style={{ color:'#F6C945' }}>← Demonstração do TapTable</a><h1 style={{ fontSize:32,margin:'24px 0 12px' }}>TapTable · pedidos do Caraíva</h1><p>Operação conectada ao mesmo sistema do Guia e do Business. Atualização a cada 15 segundos.</p>{notice && <p role="status" style={{ padding:16,border:'1px solid #F6C945',borderRadius:12 }}>{notice}</p>}{!db ? <p>Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para operar.</p> : !userId ? <form onSubmit={event => { event.preventDefault(); void login(); }} style={{ maxWidth:420,display:'grid',gap:16,marginTop:24 }}><label>E-mail<input style={field} required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Senha<input style={field} required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /></label><button disabled={busy} style={field}>{busy ? 'Entrando…' : 'Entrar na operação'}</button></form> : <><div style={{ display:'flex',gap:14,margin:'24px 0' }}><select aria-label="Restaurante" value={businessId} onChange={event => setBusinessId(event.target.value)} style={field}>{businesses.map(business => <option key={business.id} value={business.id}>{business.name}</option>)}</select><button style={field} onClick={() => void db.auth.signOut()}>Sair</button></div>{!businesses.length && <p>Nenhum restaurante vinculado a esta conta.</p>}<div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:18 }}>{orders.filter(order => !['recusado','cancelado','entregue'].includes(order.status)).map(order => <article key={order.id} style={{ background:'#141719',border:'1px solid #5F7D63',padding:20,borderRadius:22 }}><small style={{ overflowWrap:'anywhere' }}>{order.id}</small><h2>{order.customer_name}</h2><p>{({novo:'Aguardando aceite',preparando:order.cd_bookings.length?'Reserva aceita':'Em preparação',em_rota:'Em entrega'} as Record<string,string>)[order.status] ?? order.status}</p>{order.cd_order_lines.map((line,index) => <p key={index}>{line.quantity} × {line.name}</p>)}{order.cd_bookings.map((booking,index) => <p key={index}>{new Date(booking.starts_at).toLocaleString('pt-BR')} · {booking.seats} pessoas</p>)}<strong>{(order.total_cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong><p>{order.payment_status === 'paid' ? 'Pagamento confirmado' : 'Pagamento não confirmado'}</p>{order.status === 'novo' && <div style={{ display:'flex',gap:10 }}><button style={field} disabled={busy} onClick={() => void advance(order,'preparando')}>Aceitar</button><button style={field} disabled={busy} onClick={() => void advance(order,'recusado')}>Recusar</button></div>}{order.status !== 'novo' && <button style={field} disabled={busy || (!!order.cd_bookings.length && order.total_cents > 0 && order.payment_status !== 'paid')} onClick={() => void advance(order,'entregue')}>Concluir atendimento</button>}</article>)}</div>{!orders.some(order => !['entregue','recusado','cancelado'].includes(order.status)) && <p>Nenhuma solicitação em andamento.</p>}</>}</div></main>;
}
