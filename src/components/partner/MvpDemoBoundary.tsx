import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../guia/journey/journey.css';

export function MvpDemoBoundary({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="mvp-demo-shell">
    <aside className="mvp-demo-banner" role="note"><strong>DEMONSTRAÇÃO · {title}</strong><span>Dados fictícios e locais. Não cria pedidos reais, não transfere Pix nem transmite rádio para outros usuários.</span><Link to="/parceiros/painel">Abrir operação real →</Link></aside>
    {open ? children : <main className="cj-page"><div className="cj-container cj-panel"><h1>Conheça o conceito visual</h1><p>Esta experiência é independente da sua operação. Os valores e indicadores não representam vendas, ganhos ou saldos disponíveis.</p><button className="cj-primary" onClick={() => setOpen(true)}>Entrar na demonstração</button></div></main>}
  </div>;
}
