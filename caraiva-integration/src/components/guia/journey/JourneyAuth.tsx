import { useState } from 'react';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
export function JourneyAuth() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [busy, setBusy] = useState(false), [notice, setNotice] = useState('');
  async function login(link: boolean) {
    if (!db || busy) return;
    setBusy(true); setNotice('');
    try {
      const isBusiness = location.pathname === '/business' || location.pathname.startsWith('/parceiros/painel');
      const redirect = new URL(isBusiness ? '/parceiros/painel' : '/guia/viagem', location.origin);
      if (!isBusiness) { const area = new URLSearchParams(location.search).get('aba'); if (area) redirect.searchParams.set('aba', area); try { if (sessionStorage.getItem('caraiva:trip-invite')) redirect.searchParams.set('aba', 'grupo'); } catch { /* Optional invitation. */ } }
      const result = link ? await db.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect.href, shouldCreateUser: true } }) : await db.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      setNotice(link ? 'Enviamos seu link. Abra neste navegador para continuar.' : 'Acesso confirmado.'); setPassword('');
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : 'Não foi possível entrar. Tente novamente.'); }
    finally { setBusy(false); }
  }
  if (!db) return <p role="status">A conexão com o sistema não está configurada neste ambiente.</p>;
  return <form className="cj-panel cj-auth" onSubmit={event => { event.preventDefault(); void login(true); }}><h2>Sua viagem, com você</h2><p>Entre para acompanhar pedidos, participar de grupos e falar com os estabelecimentos. Seu roteiro local continua disponível.</p><label>E-mail<input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label><button className="cj-primary" disabled={busy}>{busy ? 'Aguarde…' : 'Receber link de acesso'}</button><details><summary>Já tenho senha</summary><label>Senha<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /></label><button type="button" disabled={busy || !password || !email.includes('@')} onClick={() => void login(false)}>Entrar com senha</button></details>{notice && <p role="status">{notice}</p>}</form>;
}
