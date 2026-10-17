import { useCallback, useEffect, useState } from 'react';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
import type { Tables } from '../../../services/database.journey.types';
export function JourneyConcierge({ userId }: { userId: string }) {
  const [businesses, setBusinesses] = useState<{ id: string; name: string; niche: string }[]>([]), [businessId, setBusinessId] = useState('');
  const [requests, setRequests] = useState<Tables<'cd_service_requests'>[]>([]), [detail, setDetail] = useState(() => { try { return sessionStorage.getItem('caraiva:service-draft') ?? ''; } catch { return ''; } });
  const [kind, setKind] = useState('informacao'), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const refresh = useCallback(async () => {
    if (!db || !navigator.onLine) return;
    const result = await db.from('cd_service_requests').select('*').eq('customer_id', userId).order('created_at', { ascending: false }).limit(50);
    if (result.error) throw result.error; setRequests(result.data ?? []);
  }, [userId]);
  useEffect(() => {
    let active = true;
    if (db) void db.from('cd_businesses').select('id,name,niche').eq('published', true).order('name').then(({ data, error }) => {
      if (!active) return; if (error) { setNotice('Não foi possível consultar os estabelecimentos.'); return; }
      setBusinesses(data ?? []); const requested = new URLSearchParams(location.search).get('pousada'); setBusinessId(previous => previous || data?.find(business => business.id === requested)?.id || data?.find(business => business.niche === 'pousada')?.id || data?.[0]?.id || '');
    });
    const load = () => void refresh().catch(() => setNotice('Não foi possível atualizar suas solicitações.'));
    load(); const timer = setInterval(load, 20000); return () => { active = false; clearInterval(timer); };
  }, [refresh]);
  useEffect(() => { try { sessionStorage.setItem('caraiva:service-draft', detail); } catch { /* Optional draft. */ } }, [detail]);
  async function submit() {
    if (!db || busy) return;
    if (!navigator.onLine) { setNotice('Sem conexão. O texto permanece neste dispositivo; sua solicitação ainda não foi enviada.'); return; }
    setBusy(true); setNotice('');
    try {
      const result = await db.from('cd_service_requests').upsert({ request_id: requestId, business_id: businessId, customer_id: userId, kind, detail: detail.trim() }, { onConflict: 'customer_id,request_id', ignoreDuplicates: true }).select('id');
      if (result.error) throw result.error;
      setDetail(''); setRequestId(crypto.randomUUID()); await refresh(); setNotice('Solicitação enviada ao estabelecimento. Aguarde o atendimento.');
    } catch { setNotice('Não foi possível enviar. Seu texto foi mantido; tente novamente.'); } finally { setBusy(false); }
  }
  return <section className="cj-panel"><small>ATENDIMENTO DENTRO DO APLICATIVO</small><h2>Como podemos ajudar?</h2><p>Fale com sua pousada ou outro parceiro. Pedidos de comida e reservas continuam no checkout de cada negócio.</p><form className="cj-stack" onSubmit={event => { event.preventDefault(); void submit(); }}><label>Estabelecimento<select required value={businessId} onChange={event => setBusinessId(event.target.value)}>{businesses.map(business => <option key={business.id} value={business.id}>{business.name}</option>)}</select></label><label>O que você precisa?<select value={kind} onChange={event => setKind(event.target.value)}><option value="informacao">Informação</option><option value="atendimento">Atendimento</option>{businesses.find(business => business.id === businessId)?.niche === 'pousada' && <><option value="limpeza">Limpeza do quarto</option><option value="manutencao">Manutenção</option></>}</select></label><label>Mensagem<textarea required minLength={5} maxLength={1000} value={detail} onChange={event => setDetail(event.target.value)} placeholder="Descreva sua solicitação e, se necessário, a referência do quarto. Não informe senhas nem dados de cartão." /></label><button className="cj-primary" disabled={busy || !businessId}>{busy ? 'Enviando…' : 'Enviar solicitação'}</button></form>{notice && <p role="status" className="cj-notice">{notice}</p>}<div className="cj-stack">{requests.map(request => <article className="cj-line" key={request.id}><div><strong>{businesses.find(business => business.id === request.business_id)?.name ?? request.business_id}</strong><p>{request.detail}</p><small>{new Date(request.created_at).toLocaleString('pt-BR')}</small></div><span className="cj-badge">{({ novo: 'Enviada', em_atendimento: 'Em atendimento', concluido: 'Concluída', cancelado: 'Cancelada' } as Record<string, string>)[request.status]}</span></article>)}</div></section>;
}
