import { useCallback, useEffect, useState } from 'react';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
import { CARAIVA_BUSINESSES } from '../../../data/caraivaDigitalData';
import { readPlan, reservationMode } from '../../../services/journeyModel';
type Trip = { id: string; title: string; owner_id: string };
type Item = { id: string; business_id: string; added_by: string; note: string };
type Vote = { item_id: string; user_id: string };
export function JourneyGroups({ userId }: { userId: string }) {
  const [trips, setTrips] = useState<Trip[]>([]), [tripId, setTripId] = useState(''), [title, setTitle] = useState('Nossa Caraíva');
  const [items, setItems] = useState<Item[]>([]), [votes, setVotes] = useState<Vote[]>([]), [businessId, setBusinessId] = useState(CARAIVA_BUSINESSES[0]?.id ?? '');
  const [invite, setInvite] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    if (!db) return;
    const { data, error } = await db.from('cd_trips').select('id,title,owner_id').order('created_at', { ascending: false });
    if (error) throw error;
    setTrips(data ?? []); setTripId(previous => data?.some(trip => trip.id === previous) ? previous : data?.[0]?.id ?? '');
  }, []);
  useEffect(() => {
    setLoading(true); void refresh().catch(() => setNotice('Não foi possível carregar seus grupos.')).finally(() => setLoading(false));
    const token = new URLSearchParams(location.search).get('convite');
    if (token) { setInvite(token); try { sessionStorage.setItem('caraiva:trip-invite', token); } catch { /* Optional storage. */ } history.replaceState(null, '', '/guia/viagem?aba=grupo'); }
    else try { setInvite(sessionStorage.getItem('caraiva:trip-invite') ?? ''); } catch { /* Optional storage. */ }
  }, [refresh]);
  const refreshItems = useCallback(async () => {
    if (!db || !tripId) { setItems([]); setVotes([]); return; }
    const result = await db.from('cd_trip_items').select('id,business_id,added_by,note').eq('trip_id', tripId).order('id');
    if (result.error) throw result.error;
    const list = result.data ?? []; setItems(list);
    if (list.length) {
      const resultVotes = await db.from('cd_trip_votes').select('item_id,user_id').in('item_id', list.map(item => item.id));
      if (resultVotes.error) throw resultVotes.error;
      setVotes(resultVotes.data ?? []);
    } else setVotes([]);
  }, [tripId]);
  useEffect(() => {
    setItems([]); setVotes([]);
    const load = () => void refreshItems().catch(() => setNotice('Não foi possível atualizar a votação.'));
    load(); const timer = setInterval(load, 15000); return () => clearInterval(timer);
  }, [refreshItems]);
  async function run(action: () => Promise<void>) {
    if (busy || !navigator.onLine) { setNotice('Conecte-se à internet para alterar o grupo.'); return; }
    setBusy(true); setNotice('');
    try { await action(); } catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível concluir. Tente novamente.'); } finally { setBusy(false); }
  }
  async function create() {
    if (!db) return;
    const result = await db.from('cd_trips').insert({ owner_id: userId, title: title.trim() }).select('id').single();
    if (result.error) throw result.error;
    await refresh(); setTripId(result.data.id); setNotice('Grupo criado. Adicione lugares e convide sua turma.');
  }
  async function share() {
    if (!db || !tripId) return;
    const result = await db.from('cd_trip_invites').upsert({ trip_id: tripId, token: crypto.randomUUID(), expires_at: new Date(Date.now() + 7 * 86400000).toISOString() }, { onConflict: 'trip_id' }).select('token').single();
    if (result.error) throw result.error;
    const url = new URL('/guia/viagem', location.origin); url.searchParams.set('aba', 'grupo'); url.searchParams.set('convite', result.data.token);
    try { await navigator.clipboard.writeText(url.href); setNotice('Convite copiado. Válido por sete dias; o convite anterior foi substituído. Quem entrar verá os lugares e votos do grupo, sem seus pedidos ou dados de contato.'); }
    catch { setNotice(`Copie seu convite: ${url.href}`); }
  }
  async function join() {
    if (!db || !invite) return;
    const { data, error } = await db.rpc('cd_join_trip', { p_token: invite }); if (error) throw error;
    await refresh(); setTripId(data); setInvite(''); try { sessionStorage.removeItem('caraiva:trip-invite'); } catch { /* Optional storage. */ }
    setNotice('Você entrou no grupo.');
  }
  async function add(id: string) {
    if (!db || !tripId) return;
    const { error } = await db.from('cd_trip_items').upsert({ trip_id: tripId, business_id: id, added_by: userId }, { onConflict: 'trip_id,business_id', ignoreDuplicates: true });
    if (error) throw error; await refreshItems();
  }
  async function vote(item: Item) {
    if (!db) return;
    const own = votes.some(vote => vote.item_id === item.id && vote.user_id === userId);
    const result = own ? await db.from('cd_trip_votes').delete().eq('item_id', item.id).eq('user_id', userId) : await db.from('cd_trip_votes').insert({ item_id: item.id, user_id: userId });
    if (result.error) throw result.error; await refreshItems();
  }
  return <section className="cj-panel"><small>JUNTOS NA VILA</small><h2>Caraíva com a turma</h2><p>Salvem ideias e votem. Uma pessoa pode abrir a reserva; votar não reserva nem cobra ninguém.</p>
    {notice && <p role="status" className="cj-notice">{notice}</p>}{loading && <p role="status">Carregando grupos…</p>}
    {invite && <button className="cj-primary" disabled={busy} onClick={() => void run(join)}>Aceitar convite do grupo</button>}
    <form className="cj-row" onSubmit={event => { event.preventDefault(); void run(create); }}><label>Nome do novo grupo<input required maxLength={100} value={title} onChange={event => setTitle(event.target.value)} /></label><button disabled={busy || !title.trim()}>Criar grupo</button></form>
    {!!trips.length && <><label>Seu grupo<select value={tripId} onChange={event => setTripId(event.target.value)}>{trips.map(trip => <option key={trip.id} value={trip.id}>{trip.title}</option>)}</select></label>
      {trips.find(trip => trip.id === tripId)?.owner_id === userId && <button disabled={busy} onClick={() => void run(share)}>Gerar convite de sete dias</button>}
      <div className="cj-row"><label>Lugar para propor<select value={businessId} onChange={event => setBusinessId(event.target.value)}>{CARAIVA_BUSINESSES.map(business => <option value={business.id} key={business.id}>{business.name}</option>)}</select></label><button disabled={busy || !businessId} onClick={() => void run(() => add(businessId))}>Propor lugar</button></div>
      <button disabled={busy || !readPlan().length} onClick={() => void run(async () => { for (const item of readPlan()) await add(item.businessId); setNotice('Seu roteiro foi proposto para o grupo.'); })}>Propor meu roteiro</button>
      <div className="cj-stack">{[...items].sort((a, b) => votes.filter(v => v.item_id === b.id).length - votes.filter(v => v.item_id === a.id).length).map(item => <article className="cj-line" key={item.id}><div><strong>{CARAIVA_BUSINESSES.find(business => business.id === item.business_id)?.name ?? item.business_id}</strong><p>{votes.filter(vote => vote.item_id === item.id).length} voto(s)</p></div><button aria-pressed={votes.some(vote => vote.item_id === item.id && vote.user_id === userId)} disabled={busy} onClick={() => void run(() => vote(item))}>♥ Votar</button><a href={`/guia/checkout/${encodeURIComponent(item.business_id)}?modo=${reservationMode(CARAIVA_BUSINESSES.find(business => business.id === item.business_id)?.category ?? "goods")}`}>Ver opções</a>{(item.added_by === userId || trips.find(trip => trip.id === tripId)?.owner_id === userId) && <button aria-label="Remover proposta" disabled={busy} onClick={() => void run(async () => { const result = await db!.from('cd_trip_items').delete().eq('id', item.id); if (result.error) throw result.error; await refreshItems(); })}>×</button>}</article>)}</div>
    </>}
  </section>;
}
