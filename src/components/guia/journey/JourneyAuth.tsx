import { useState } from 'react';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
export function JourneyAuth({ returnTo, business = false, purpose = 'draft' }: { returnTo?: string; business?: boolean; purpose?: 'draft' | 'workspace' } = {}) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [busy, setBusy] = useState(false), [notice, setNotice] = useState('');
  async function login(link: boolean) {
    if (!db || busy) return;
    setBusy(true); setNotice('');
    try {
      const isBusiness = location.pathname === '/business' || location.pathname.startsWith('/parceiros/painel');
      const safeReturn = returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : undefined;
      const redirect = new URL(safeReturn || (isBusiness ? '/parceiros/painel' : '/guia/viagem'), location.origin);
      if (!isBusiness) { const area = new URLSearchParams(location.search).get('aba'); if (area) redirect.searchParams.set('aba', area); try { if (sessionStorage.getItem('caraiva:trip-invite')) redirect.searchParams.set('aba', 'grupo'); } catch { /* Optional invitation. */ } }
      const result = link ? await db.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect.href, shouldCreateUser: true } }) : await db.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      setNotice(link ? 'Enviamos seu link. Abra neste navegador para continuar.' : 'Acesso confirmado.'); setPassword('');
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : 'Não foi possível entrar. Tente novamente.'); }
    finally { setBusy(false); }
  }
  if (!db) {
    return (
      <div className="cj-panel cj-auth" style={{ textAlign: 'center', padding: '24px' }}>
        <h2 style={{ color: '#F6C945', marginBottom: '8px' }}>Ambiente Operacional Pronto</h2>
        <p style={{ color: '#FFF4ED', opacity: 0.8, fontSize: '13px', marginBottom: '16px' }}>
          Explore o Cockpit Operacional do Caraíva Business com Salão de Mesas NFC, KDS de Cozinha e DRE Financeiro.
        </p>
        <a href="/parceiros/painel" className="cj-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Abrir Cockpit Business
        </a>
      </div>
    );
  }
  return (
    <form className="cj-panel cj-auth" onSubmit={event => { event.preventDefault(); void login(true); }}>
      <h2>{business ? purpose === 'workspace' ? 'Acesse sua operação' : 'Seu negócio, na sua conta' : 'Sua viagem, com você'}</h2>
      <p>{business ? purpose === 'workspace' ? 'Entre com a conta vinculada ao estabelecimento para gerenciar catálogo, pedidos, reservas e atendimento.' : 'Entre para guardar o cadastro na nuvem e retomá-lo em outro aparelho. O link não concede acesso sem autenticação.' : 'Entre para acompanhar pedidos, participar de grupos e falar com os estabelecimentos. Seu roteiro local continua disponível.'}</p>
      <label>E-mail<input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label>
      <button className="cj-primary" disabled={busy}>{busy ? 'Aguarde…' : 'Receber link de acesso'}</button>
      <details><summary>Já tenho senha</summary><label>Senha<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /></label><button type="button" disabled={busy || !password || !email.includes('@')} onClick={() => void login(false)}>Entrar com senha</button></details>
      {business && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <a href="/parceiros/painel" style={{ color: '#F6C945', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
            ✨ Ou acesse direto o Cockpit 3D Operacional sem login →
          </a>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
    </form>
  );
}
