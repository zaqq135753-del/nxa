import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
import { activationErrors, activationPending, emptyActivation, niches, parseActivation, safeActivationImage, type ActivationDraft, type ActivationNiche } from '../../../services/activationModel';
import type { Json } from '../../../services/database.journey.types';
import { JourneyAuth } from '../../guia/journey/JourneyAuth';
import { useJourneyAccount } from '../../guia/journey/useJourneyAccount';
import { CinematicBusinessBuilder } from './CinematicBusinessBuilder';
import '../../guia/journey/journey.css';
import './activation.css';

const steps = ['Identidade', 'Localização', 'Seu espaço', 'Revisão'];
const key = (id: string) => `caraiva:activation:v1:${id}`;
function initialId(): string {
  const requested = new URLSearchParams(location.search).get('rascunho');
  if (requested && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requested)) return requested;
  try { const current = sessionStorage.getItem('caraiva:activation:current'); if (current) return current; } catch { /* Session persistence is optional. */ }
  return crypto.randomUUID();
}
function readLocal(id: string): ActivationDraft {
  try { return parseActivation(JSON.parse(localStorage.getItem(key(id)) || 'null'), id); } catch { return emptyActivation(id); }
}
export function ActivationOnboarding({ onClose }: { onClose?: () => void }) {
  const [id] = useState(initialId);
  const [draft, setDraft] = useState(() => readLocal(id));
  const { userId, ready } = useJourneyAccount();
  const [loading, setLoading] = useState(false), [busy, setBusy] = useState(false), [notice, setNotice] = useState('');
  const [localStatus, setLocalStatus] = useState(''), [cloudStatus, setCloudStatus] = useState('Ainda não salvo na conta');
  const [revision, setRevision] = useState<number | null>(null), [businessId, setBusinessId] = useState<string | null>(null);
  const [qr, setQr] = useState(''), [reviewArt, setReviewArt] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  const [conflict, setConflict] = useState<{ draft: ActivationDraft; revision: number; businessId: string | null } | null>(null);
  const lastSaved = useRef(''), saving = useRef(false), syncBlocked = useRef(false), heading = useRef<HTMLHeadingElement>(null);
  const account = useRef(userId);
  account.current = userId;
  const serialized = JSON.stringify(draft);
  const resumePath = `/parceiros/cadastro?rascunho=${encodeURIComponent(id)}`;
  const resumeUrl = `${location.origin}${resumePath}`;
  const patch = (value: Partial<ActivationDraft>) => setDraft(previous => ({ ...previous, ...value }));
  useEffect(() => {
    const url = new URL(location.href); url.searchParams.set('rascunho', id); history.replaceState(history.state, '', url);
    try { sessionStorage.setItem('caraiva:activation:current', id); } catch { /* An explicit resume URL still works. */ }
  }, [id]);
  useEffect(() => {
    try { localStorage.setItem(key(id), serialized); setLocalStatus('Rascunho salvo neste navegador'); }
    catch { setLocalStatus('Não foi possível salvar neste navegador. Salve na conta antes de sair.'); }
  }, [id, serialized]);
  useEffect(() => { heading.current?.focus(); }, [draft.step, reviewArt, businessId]);
  useEffect(() => {
    setRevision(null); setBusinessId(null); setConflict(null); lastSaved.current = ''; syncBlocked.current = false;
    if (!userId || !db) { setLoading(false); setCloudStatus('Ainda não salvo na conta'); return; }
    let active = true; setLoading(true);
    void db.from('cd_activation_drafts').select('*').eq('id', id).eq('owner_id', userId).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      setLoading(false);
      if (error) { setNotice('Não foi possível consultar o rascunho na nuvem. Seus dados locais foram preservados.'); return; }
      if (data) {
        const restored = parseActivation(data.payload, id);
        const local = readLocal(id);
        if (local.name && JSON.stringify(local) !== JSON.stringify(restored) && !data.business_id) {
          setConflict({ draft: restored, revision: data.revision, businessId: data.business_id });
          setCloudStatus('Há duas versões. Escolha qual deseja continuar.');
          return;
        }
        setDraft(restored); lastSaved.current = JSON.stringify(restored); setRevision(data.revision); setBusinessId(data.business_id);
        setCloudStatus('Cadastro recuperado da sua conta');
      } else setCloudStatus('Clique em salvar na conta para habilitar a sincronização');
    });
    return () => { active = false; };
  }, [id, userId]);
  const saveCloud = useCallback(async () => {
    if (!db || !userId || saving.current || loading || conflict) return false;
    saving.current = true; setBusy(true); setCloudStatus('Salvando na conta…');
    const owner = userId;
    try {
      const { data, error } = await db.rpc('cd_save_activation', { p_id: id, p_payload: JSON.parse(serialized) as Json, p_revision: revision ?? 0 });
      if (error) throw error;
      if (account.current !== owner) return false;
      syncBlocked.current = false; setRevision(data); lastSaved.current = serialized; setCloudStatus('Salvo na conta · link de retomada disponível'); return true;
    } catch (reason) {
      syncBlocked.current = true;
      if (account.current === owner) { setCloudStatus('Sincronização interrompida · dados locais preservados'); setNotice(reason instanceof Error ? reason.message : 'Não foi possível salvar. Reabra o link para verificar a versão na nuvem.'); }
      return false;
    } finally { saving.current = false; setBusy(false); }
  }, [id, serialized, userId, revision, loading, conflict]);
  useEffect(() => {
    if (revision === null || loading || busy || syncBlocked.current || lastSaved.current === serialized || businessId) return;
    const timer = window.setTimeout(() => { void saveCloud(); }, 1200);
    return () => window.clearTimeout(timer);
  }, [revision, loading, busy, serialized, saveCloud, businessId]);
  // Resume QR contains only a random draft ID. RLS still requires the owning account.
  useEffect(() => {
    if (revision === null) { setQr(''); return; }
    let active = true;
    void QRCode.toDataURL(resumeUrl, { width: 240, margin: 2 }).then(value => { if (active) setQr(value); }).catch(() => { if (active) setNotice('Não foi possível gerar o QR. Copie o link de retomada.'); });
    return () => { active = false; };
  }, [revision, resumeUrl]);
  async function upload(event: ChangeEvent<HTMLInputElement>, field: 'cover' | 'logo') {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 300000) { setNotice('Escolha JPG, PNG ou WebP de até 300 KB.'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string' && safeActivationImage(reader.result)) patch({ [field]: reader.result }); };
    reader.onerror = () => setNotice('Não foi possível ler a imagem. Tente novamente.'); reader.readAsDataURL(file);
  }
  function next() {
    const errors = activationErrors(draft, draft.step);
    if (errors.length) { setNotice(errors.join(' ')); return; }
    setNotice(''); patch({ step: Math.min(3, draft.step + 1) });
  }
  async function createBusiness() {
    const errors = [0,1].flatMap(step => activationErrors(draft, step));
    if (errors.length) { setNotice(errors.join(' ')); return; }
    if (!await saveCloud() || !db) return;
    setBusy(true);
    try {
      const { data, error } = await db.rpc('cd_activate_business', { p_id: id });
      if (error) throw error;
      setBusinessId(data); setNotice('Negócio criado na sua conta. Publicação e recebimento continuam desativados até sua configuração.');
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : 'Não foi possível criar o negócio. Seu rascunho continua salvo.'); }
    finally { setBusy(false); }
  }
  async function copyResume() {
    try { await navigator.clipboard.writeText(resumeUrl); setNotice('Link copiado. Entre com a mesma conta no outro aparelho.'); }
    catch { setNotice(`Copie este link: ${resumeUrl}`); }
  }
  const cover = safeActivationImage(draft.cover), logo = safeActivationImage(draft.logo);
  const category = niches[draft.niche];
  return <main className="cj-page ca-page"><div className="cj-container">
    <header className="cj-top"><Link to="/guia">← Caraíva Digital</Link><span className="cj-eyebrow">SEU NEGÓCIO GANHA PRESENÇA</span>{onClose && <button onClick={onClose}>Sair e continuar depois</button>}</header>
    <div className="cj-heading"><h1 ref={heading} tabIndex={-1}>{businessId ? 'Seu próximo capítulo começa aqui.' : reviewArt ? 'A identidade da sua casa.' : 'Um lugar na vila. Com a sua identidade.'}</h1><p>Comece com o essencial. Complete a operação no seu tempo.</p></div>
    {notice && <p className="ca-notice" role="status">{notice}</p>}
    {conflict && <section className="cj-panel" aria-label="Escolher versão do cadastro"><h2>Encontramos outra versão na sua conta.</h2><p>Neste aparelho: {draft.name}. Na conta: {conflict.draft.name}. Nenhuma versão foi sobrescrita.</p><div className="cj-row"><button onClick={() => { setDraft(conflict.draft); setRevision(conflict.revision); lastSaved.current = JSON.stringify(conflict.draft); setBusinessId(conflict.businessId); setConflict(null); setCloudStatus('Versão da conta recuperada'); }}>Usar versão da conta</button><button onClick={() => { setRevision(conflict.revision); lastSaved.current = ''; setConflict(null); setCloudStatus('Versão local escolhida para sincronização'); }}>Manter e sincronizar esta versão local</button></div></section>}
    {businessId ? <div className="ca-completed">{!revealComplete && ['restaurante','pousada'].includes(draft.niche) && <CinematicBusinessBuilder name={draft.name} niche={draft.niche === 'pousada' ? 'pousada' : 'restaurante'} onContinue={() => setRevealComplete(true)}/>}<section className="cj-panel ca-reveal"><small>NEGÓCIO CRIADO · PERFIL EM RASCUNHO</small><h2>{draft.name}</h2><p>{category.action}</p><p>Seu identificador é permanente. Alterar o nome não muda seu vínculo com os pedidos.</p><code>{businessId}</code><h3>Próximos passos</h3><ul>{activationPending(draft).map(item => <li key={item}>{item}</li>)}</ul><Link className="ca-primary" to={`/parceiros/painel?negocio=${encodeURIComponent(businessId)}`}>Configurar minha operação</Link><p>Pedidos e pagamentos não foram habilitados automaticamente.</p></section></div>
    : reviewArt ? <section className="ca-art"><CinematicBusinessBuilder name={draft.name} niche={draft.niche === 'pousada' ? 'pousada' : 'restaurante'} preview/><button onClick={() => setReviewArt(false)}>Voltar ao cadastro</button></section>
    : <div className="ca-layout"><section className="cj-panel ca-form"><nav className="ca-steps" aria-label="Progresso do cadastro">{steps.map((label, index) => <span key={label} aria-current={draft.step === index ? 'step' : undefined}>{index + 1}<small>{label}</small></span>)}</nav>
      <form onSubmit={event => { event.preventDefault(); if (draft.step < 3) next(); }}>
      <fieldset disabled={!ready || loading || busy}><legend>{steps[draft.step]}</legend><div className="ca-stage" key={draft.step}>
      {draft.step === 0 && <><h2>Como a vila conhece você?</h2><label>Nome do negócio<input required minLength={2} maxLength={120} value={draft.name} autoComplete="organization" onChange={e => patch({ name: e.target.value })}/></label><label>Tipo de negócio<select value={draft.niche} onChange={e => patch({ niche: e.target.value as ActivationNiche })}>{Object.entries(niches).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label><label>Nome do responsável<input required maxLength={120} autoComplete="name" value={draft.ownerName} onChange={e => patch({ ownerName: e.target.value })}/></label><p>Seu nome fica no cadastro privado. Ele não aparece no perfil público.</p></>}
      {draft.step === 1 && <><h2>Onde podemos encontrar você?</h2><label>Endereço ou ponto de referência<textarea required maxLength={500} value={draft.reference} onChange={e => patch({ reference: e.target.value })}/></label><p>Use uma referência reconhecível. Coordenadas são opcionais nesta etapa.</p><div className="cj-row"><label>Latitude<input inputMode="decimal" value={draft.latitude} onChange={e => patch({ latitude: e.target.value })}/></label><label>Longitude<input inputMode="decimal" value={draft.longitude} onChange={e => patch({ longitude: e.target.value })}/></label></div></>}
      {draft.step === 2 && <><h2>Mostre o que torna seu lugar único.</h2><label>Uma descrição breve<textarea maxLength={600} value={draft.description} onChange={e => patch({ description: e.target.value })}/></label><label>{category.item} em destaque (opcional)<input maxLength={160} value={draft.highlight} onChange={e => patch({ highlight: e.target.value })}/></label><label>Foto real da fachada · até 300 KB<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => void upload(e, 'cover')}/></label>{draft.cover && <button type="button" onClick={() => patch({ cover: '' })}>Remover foto</button>}<label>Logo · até 300 KB<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => void upload(e, 'logo')}/></label>{draft.logo && <button type="button" onClick={() => patch({ logo: '' })}>Remover logo</button>}<p>Use imagens suas ou com autorização. Você pode adicionar fotos depois.</p></>}
      {draft.step === 3 && <><h2>Revise antes de criar.</h2><dl><dt>Nome</dt><dd>{draft.name}</dd><dt>Nicho</dt><dd>{category.label}</dd><dt>Localização</dt><dd>{draft.reference}</dd><dt>Módulos a configurar</dt><dd>{category.action}</dd></dl><p>O perfil será criado como rascunho. Não publicamos fotos, ativamos pedidos ou confirmamos pagamentos nesta etapa.</p><label className="ca-check"><input type="checkbox" required id="ca-consent"/>Confirmo que posso cadastrar este negócio e usar as imagens enviadas.</label></>}
      </div><div className="cj-row ca-actions">{draft.step > 0 && <button type="button" onClick={() => patch({ step: draft.step - 1 })}>Voltar</button>}{draft.step < 3 ? <button className="ca-primary" type="submit">Continuar →</button> : <button className="ca-primary" type="button" disabled={!userId} onClick={e => { const form = e.currentTarget.form; if (form?.reportValidity()) void createBusiness(); }}>Criar meu negócio em rascunho</button>}</div></fieldset></form>
      <p className="ca-save" role="status">{loading ? 'Recuperando cadastro da conta…' : localStatus}<br/>{cloudStatus}</p>
      {userId && <button disabled={busy || loading || !!conflict} onClick={() => void saveCloud()}>Salvar na minha conta</button>}
      {revision !== null && <details className="ca-resume"><summary>Continuar depois em outro aparelho</summary><p>Use a mesma conta. O link e o QR não liberam acesso a terceiros.</p><button onClick={() => void copyResume()}>Copiar link de retomada</button>{qr && <img src={qr} alt="QR de retomada privada do cadastro" width={160} height={160}/>}</details>}
      {ready && !userId && <JourneyAuth business returnTo={resumePath}/>}
    </section><aside className="ca-preview"><div className="cj-panel"><small>PRÉVIA · NÃO PUBLICADA</small>{cover ? <img className="ca-cover" src={cover} alt="Foto enviada para o estabelecimento"/> : <div className={`ca-cover ca-scenery ca-${draft.niche}`}><span>{category.scene}</span></div>}{logo && <img className="ca-logo" src={logo} alt="Logo enviado"/>}<h2>{draft.name || 'Seu negócio em Caraíva'}</h2><span className="cj-badge">{category.label}</span><p>{draft.description || 'Sua história, seu espaço e seus próximos encontros.'}</p><p>{draft.reference || 'Localização a confirmar'}</p><strong>{category.action}</strong><p>As ações para clientes aparecem quando os módulos estiverem configurados.</p></div><button onClick={() => setReviewArt(true)}>Experimentar montagem e 3D →</button></aside></div>}
  </div></main>;
}
