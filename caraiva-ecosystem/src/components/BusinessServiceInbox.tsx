"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/database.journey.types';
export function BusinessServiceInbox({ businessId }: { businessId: string }) {
  const [requests, setRequests] = useState<Tables<'cd_service_requests'>[]>([]), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const load = async () => {
      const result = await supabase!.from('cd_service_requests').select('*').eq('business_id', businessId).order('created_at', { ascending: false }).limit(100);
      if (!active) return; if (result.error) { setNotice('Não foi possível consultar o atendimento.'); return; }
      setRequests(result.data ?? []);
    };
    setRequests([]); void load(); const timer = setInterval(() => void load(), 15000);
    return () => { active = false; clearInterval(timer); };
  }, [businessId]);
  async function advance(request: Tables<'cd_service_requests'>) {
    if (!supabase || busy) return; setBusy(true); setNotice('');
    const status = request.status === 'novo' ? 'em_atendimento' : 'concluido';
    try {
      const result = await supabase.from('cd_service_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', request.id).eq('business_id', businessId).eq('status', request.status).select('id').single();
      if (result.error) throw result.error;
      setRequests(previous => previous.map(item => item.id === request.id ? { ...item, status } : item));
    } catch { setNotice('Não foi possível atualizar. Consulte o estado atual e tente novamente.'); } finally { setBusy(false); }
  }
  return <details className="card p-4"><summary className="cursor-pointer font-semibold">Atendimento do Guia ({requests.filter(request => request.status === 'novo').length} novos)</summary><p className="my-3 text-sm text-areia-300">Solicitações enviadas por hóspedes e visitantes ao seu estabelecimento.</p>{notice && <p role="status">{notice}</p>}{!requests.length && <p className="text-sm">Nenhuma solicitação recebida.</p>}<div className="mt-3 grid gap-3 md:grid-cols-2">{requests.map(request => <article className="rounded-xl border border-white/10 p-3" key={request.id}><strong>{request.kind}</strong><p className="my-2 break-words text-sm">{request.detail}</p><small>{new Date(request.created_at).toLocaleString('pt-BR')} · {request.status}</small>{!['cancelado','concluido'].includes(request.status) && <button className="btn-ghost mt-3" disabled={busy} onClick={() => void advance(request)}>{request.status === 'novo' ? 'Iniciar atendimento' : 'Concluir'}</button>}</article>)}</div></details>;
}
