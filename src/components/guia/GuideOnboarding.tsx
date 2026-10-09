import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, Copy, Store, Waves, X } from 'lucide-react';
import './guide-onboarding.css';

type Role = 'visitor' | 'business';
type Draft = { version: 1; step: number; role: Role; name: string; contact: string; title: string; category: string; interests: string[]; pace: string; description: string; address: string; hours: string; website: string; completed: boolean; updatedAt: string };
const KEY = 'caraiva:welcome:v1';
const empty = (): Draft => ({ version: 1, step: 0, role: 'visitor', name: '', contact: '', title: '', category: 'restaurantes', interests: [], pace: 'Sem pressa', description: '', address: '', hours: '', website: '', completed: false, updatedAt: '' });
function load(role?: Role): Draft { try { const value = JSON.parse(localStorage.getItem(role ? KEY + ':' + role : KEY) || 'null'); const draft = empty(); if (role) draft.role = role; if (value?.version !== 1) return draft; draft.role = ['visitor','business'].includes(value.role) ? value.role : draft.role; for (const key of ['name','contact','title','category','pace','description','address','hours','website','updatedAt'] as const) if (typeof value[key] === 'string') draft[key] = value[key].slice(0,1000); draft.interests = Array.isArray(value.interests) ? value.interests.filter((v: unknown) => typeof v === 'string' && interests.includes(v)).slice(0,6) : []; draft.step = Number.isInteger(value.step) ? Math.max(0, Math.min(3, value.step)) : 0; draft.completed = value.completed === true; return draft; } catch { return empty(); } }
export function readGuideInterests(): string[] { return load('visitor').interests; }
export function readGuideGreeting(): string { return load('visitor').name; }

// Share only non-contact preferences. Personal contact information stays on this device.
function resumeUrl(draft: Draft): string {
  const payload = { version: 1, role: draft.role, title: draft.title, category: draft.category, interests: draft.interests, pace: draft.pace };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const url = new URL(window.location.href); url.hash = 'continuar=' + btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
  return url.href;
}
export function hasGuideResume(): boolean { return window.location.hash.startsWith('#continuar='); }
function restoreLink(): Draft | null {
  if (!hasGuideResume()) return null;
  try {
    const encoded = window.location.hash.slice(11); if (encoded.length > 4096) return null;
    const raw = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(encoded), c => c.charCodeAt(0))));
    if (raw.version !== 1 || !['visitor', 'business'].includes(raw.role)) return null;
    const draft = empty(); draft.role = raw.role; draft.title = typeof raw.title === 'string' ? raw.title.slice(0, 100) : ''; draft.category = typeof raw.category === 'string' ? raw.category.slice(0, 40) : 'restaurantes';
    draft.interests = Array.isArray(raw.interests) ? raw.interests.filter((v: unknown) => typeof v === 'string' && interests.includes(v)).slice(0, 6) : [];
    draft.pace = ['Sem pressa', 'Quero explorar', 'Com crianças'].includes(raw.pace) ? raw.pace : 'Sem pressa'; return draft;
  } catch { return null; }
}
const interests = ['Praia e rio', 'Gastronomia', 'Pôr do sol', 'Passeios', 'Cultura', 'Noite e forró'];
export function GuideOnboarding({ onClose, onDone, initialRole }: { onClose: () => void; onDone: () => void; initialRole?: Role }) {
  const [draft, setDraft] = useState<Draft>(() => { return restoreLink() ?? load(initialRole); });
  const [step, setStep] = useState(() => { if (restoreLink()) return 3; const value = load(initialRole); return value.completed ? 0 : value.step; });
  const [direction, setDirection] = useState('forward');
  const [message, setMessage] = useState(''); const [link, setLink] = useState(''); const [storageError, setStorageError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null); const heading = useRef<HTMLHeadingElement>(null);
  const business = draft.role === 'business';
  const patch = (data: Partial<Draft>) => setDraft(value => data.role && data.role !== value.role ? load(data.role) : ({ ...value, ...data, completed: false }));
  useEffect(() => { const prior = document.activeElement as HTMLElement | null; const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; dialog.current?.showModal(); return () => { document.body.style.overflow = overflow; prior?.focus(); }; }, []);
  useEffect(() => { try { const value = JSON.stringify({ ...draft, step, updatedAt: new Date().toISOString() }); localStorage.setItem(KEY + ':' + draft.role, value); localStorage.setItem(KEY, value); setStorageError(false); } catch { setStorageError(true); } }, [draft, step]);
  useEffect(() => { heading.current?.focus(); }, [step]);
  const go = (next: number) => { setMessage(''); setDirection(next > step ? 'forward' : 'back'); setStep(next); };
  const save = () => { const value = { ...draft, completed: true, updatedAt: new Date().toISOString() }; try { localStorage.setItem(KEY, JSON.stringify(value)); localStorage.setItem(KEY + ':' + draft.role, JSON.stringify(value)); setDraft(value); window.dispatchEvent(new Event('caraiva:welcome-updated')); onDone(); } catch { setStorageError(true); setMessage('O navegador não permitiu salvar. Você pode continuar usando o guia.'); } };
  const share = async () => { const url = resumeUrl(draft); setLink(url); try { await navigator.clipboard.writeText(url); setMessage('Link copiado. Envie pelo canal que preferir.'); } catch { setMessage('Copie o link no campo abaixo.'); } };
  const titles = ['A vila começa com você.', business ? 'Seu lugar na vila.' : 'Qual é a sua Caraíva?', business ? 'O essencial, por enquanto.' : 'Vamos no seu ritmo?', business ? 'Mais vida para seu perfil.' : 'Seu guia, do seu jeito.'];
  return <dialog data-step={step} ref={dialog} className="cv-onboarding" aria-labelledby="cv-onboarding-title" onCancel={onClose}>
    <div className="cv-welcome-art" aria-hidden="true"><div className="cv-orbit cv-orbit-one"/><div className="cv-orbit cv-orbit-two"/><div className="cv-floating-card"><Waves size={48}/><span>CARAÍVA</span><strong>Seu tempo.<br/>Sua vila.</strong><small>RIO · AREIA · ENCONTROS</small></div><div className="cv-art-chip"><Compass size={18}/> Descobertas pelo caminho</div></div>
    <section className="cv-welcome-body"><div className="cv-welcome-top"><span>CARAÍVA DIGITAL · BOAS-VINDAS</span><button type="button" onClick={onClose} aria-label="Fechar boas-vindas"><X size={20}/></button></div>
      <div className="cv-step-track" aria-label={`Etapa ${step + 1} de 4`}>{[0,1,2,3].map(i => <span key={i} data-active={i <= step}/>)}</div>
      <form key={step + draft.role} className="cv-step-card" data-direction={direction} onSubmit={e => { e.preventDefault(); step < 3 ? go(step + 1) : save(); }}>
        <p className="cv-welcome-eyebrow">{step === 0 ? 'POUCOS TOQUES. NOVOS ENCONTROS.' : `${business ? 'PARA ESTABELECIMENTOS' : 'PARA VISITANTES'} · ${step + 1}/4`}</p><h2 ref={heading} tabIndex={-1} id="cv-onboarding-title">{titles[step]}</h2>
        <p className="cv-welcome-description">{step === 0 ? 'Escolha seu caminho. O restante pode ficar para depois.' : business ? 'Comece seu rascunho. Nenhuma informação será publicada automaticamente.' : 'Escolhas simples para encontrar experiências que combinam com você.'}</p>
        {step === 0 && <div className="cv-role-grid">{([['visitor', Compass, 'Quero descobrir', 'Um guia no meu ritmo.'], ['business', Store, 'Tenho um negócio', 'Meu lugar faz parte da vila.']] as const).map(([role, Icon, title, text]) => <button type="button" className="cv-choice" aria-pressed={draft.role === role} onClick={() => patch({ role })} key={role}><Icon size={26}/><strong>{title}</strong><span>{text}</span>{draft.role === role && <Check className="cv-choice-check" size={17}/>}</button>)}</div>}
        {step === 1 && (business ? <><label>Nome do estabelecimento<input autoComplete="organization" required maxLength={100} value={draft.title} onChange={e => patch({title:e.target.value})} placeholder="Como a vila conhece seu lugar?"/></label><label>Categoria<select value={draft.category} onChange={e => patch({category:e.target.value})}>{[['restaurantes','Restaurante'],['bares','Bar'],['cafes','Café'],['hospedagens','Hospedagem'],['passeios','Passeios'],['lojas','Loja'],['noite','Noite e cultura']].map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label></> : <><label>Como podemos te chamar? <small>opcional</small><input autoComplete="given-name" maxLength={60} value={draft.name} onChange={e => patch({name:e.target.value})} placeholder="Seu primeiro nome"/></label><span className="cv-field-label">O que te traz até aqui? <small>escolha quantos quiser</small></span><div className="cv-interest-grid">{interests.map(item => <button type="button" key={item} aria-pressed={draft.interests.includes(item)} onClick={() => patch({interests:draft.interests.includes(item)?draft.interests.filter(i=>i!==item):[...draft.interests,item]})}>{item}{draft.interests.includes(item)&&<Check size={14}/>}</button>)}</div></>)}
        {step === 2 && (business ? <><label>Seu nome<input autoComplete="name" required maxLength={100} value={draft.name} onChange={e => patch({name:e.target.value})} placeholder="Responsável pelo cadastro"/></label><label>E-mail para contato<input type="email" autoComplete="email" required maxLength={160} value={draft.contact} onChange={e => patch({contact:e.target.value})} placeholder="voce@seunegocio.com.br"/></label><p className="cv-field-help">Contato salvo neste dispositivo. O envio de convites depende da conexão com o servidor.</p></> : <><span className="cv-field-label">Como você quer explorar?</span><div className="cv-pace-options">{['Sem pressa','Quero explorar','Com crianças'].map(item => <button type="button" key={item} aria-pressed={draft.pace===item} onClick={() => patch({pace:item})}>{item}{draft.pace===item&&<Check size={16}/>}</button>)}</div><p className="cv-field-help">Você pode mudar suas escolhas quando quiser. Sem exigir conta ou localização.</p></>)}
        {step === 3 && (business ? <><div className="cv-draft-summary"><Store size={20}/><span><strong>{draft.title || 'Seu estabelecimento'}</strong><small>Rascunho · completar agora é opcional</small></span></div><label>Sobre o lugar<textarea maxLength={1000} value={draft.description} onChange={e=>patch({description:e.target.value})} placeholder="O que torna seu lugar especial?"/></label><label>Endereço ou ponto de referência<input maxLength={200} value={draft.address} onChange={e=>patch({address:e.target.value})}/></label><label>Horários<input maxLength={200} value={draft.hours} onChange={e=>patch({hours:e.target.value})} placeholder="Ex.: terça a domingo, 12h às 22h"/></label></> : <div className="cv-draft-summary cv-visitor-summary"><Waves size={32}/><h3>{draft.name ? `${draft.name}, a vila te espera.` : 'A vila te espera.'}</h3><p>{draft.interests.length?draft.interests.join(' · '):'Descubra um pouco de tudo.'}</p><span>{draft.pace}</span></div>)}
        {message && <p className="cv-field-help" role="status">{message}</p>}{storageError&&<p className="cv-field-help" role="alert">Não foi possível salvar neste navegador.</p>}
        <div className="cv-welcome-actions">{step>0&&<button className="cv-back" type="button" onClick={()=>go(step-1)} aria-label="Etapa anterior"><ArrowLeft size={19}/></button>}<button className="cv-next" type="submit">{step===3?(business?'Salvar rascunho':'Explorar minha Caraíva'):'Continuar'}{step===3?<Check size={18}/>:<ArrowRight size={18}/>}</button></div>
        {step>=2&&<button className="cv-link-button" type="button" onClick={share}><Copy size={15}/>Copiar link para continuar depois</button>}
        {link&&<label className="cv-link-field">Link de continuação<input readOnly value={link} onFocus={e=>e.target.select()}/><small>Leva apenas escolhas e nome do negócio; nome pessoal e contato ficam neste dispositivo. Em outro dispositivo, esses campos precisam ser preenchidos novamente. O endereço atual precisa estar acessível.</small></label>}
      </form><p className="cv-local-note">{storageError?'':'Progresso salvo neste navegador. '}{business?'Rascunho local; não cria um perfil público.':'Suas escolhas podem ser editadas a qualquer momento.'}</p>
    </section>
  </dialog>;
}
