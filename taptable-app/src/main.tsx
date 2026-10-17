import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const CloudOperation = lazy(() => import('./CloudOperation'));
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {location.pathname === '/operacao' ? <Suspense fallback={<p>Carregando operação…</p>}><CloudOperation /></Suspense> : <><a href="/operacao" style={{display:'block',background:'#141719',color:'#F6C945',padding:12,textAlign:'center'}}>Abrir operação conectada ao Caraíva Digital →</a><App /></>}
  </StrictMode>,
)
