import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ArchitectureNiche } from './architecturalScene';
import './cinematic-builder.css';
const Viewport = lazy(() => import('./ArchitectureViewport').catch(() => ({ default: FailedViewport })));
function FailedViewport({ onFailure }: { onFailure: () => void }) { useEffect(onFailure,[onFailure]); return <div role="status">Alternando para a apresentação leve…</div>; }
export const assemblySteps = ['Areia e caminho','Estrutura e varanda','Cerâmica e cobertura','Jardim e detalhes','Identidade e luz'];
export function CinematicBusinessBuilder({ name, niche, onContinue, preview = false }: {
  name: string; niche: ArchitectureNiche; onContinue?: () => void; preview?: boolean;
}) {
  const [selected,setSelected]=useState(niche),[progress,setProgress]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches?1:0);
  const [playing,setPlaying]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches),[mode,setMode]=useState<'cinema'|'3d'>('cinema');
  const [ready,setReady]=useState(false),[notice,setNotice]=useState('');
  const progressRef=useRef(progress),section=useRef<HTMLElement>(null),inView=useRef(true);progressRef.current=progress;
  const [speed,setSpeed]=useState(1);
  const stage=Math.max(0,Math.min(4,Math.ceil(progress*5)-1));
  const failed=useCallback(()=>{setMode('cinema');setReady(false);setNotice('O 3D não está disponível neste aparelho. A apresentação leve continua funcionando.');},[]);
  const loaded=useCallback(()=>setReady(true),[]);
  useEffect(()=>{const element=section.current;if(!element)return;const observer=new IntersectionObserver(entries=>{inView.current=entries[0]?.isIntersecting??true;});observer.observe(element);return()=>observer.disconnect();},[]);
  useEffect(()=>{
    if(!playing|| (mode==='3d'&&!ready))return;
    let frame=0,last=performance.now(),lastUpdate=last;
    function tick(now:number){
      const delta=Math.min(now-last,100);last=now;
      if(!document.hidden&&inView.current){progressRef.current=Math.min(1,progressRef.current+delta/14000*speed);}
      if(now-lastUpdate>80||progressRef.current>=1){setProgress(progressRef.current);lastUpdate=now;}
      if(progressRef.current>=1){setPlaying(false);return;}frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[playing,speed,mode,ready]);
  function replay(){setProgress(0);progressRef.current=0;setPlaying(true);}
  function changeScene(value:ArchitectureNiche){if(value===selected)return;setSelected(value);setReady(false);setProgress(1);progressRef.current=1;setPlaying(false);}
  return <section className="cb-builder" ref={section} aria-label="Montagem do negócio">
    <header className="cb-header"><div><small>ARQUITETURA DE CARAÍVA · CONCEITO</small><h2>{name || 'Seu lugar na vila'}</h2></div><div className="cb-modes" aria-label="Modo da apresentação"><button aria-pressed={mode==='cinema'} onClick={()=>setMode('cinema')}>Cinema leve</button><button aria-pressed={mode==='3d'} onClick={()=>{if(mode==='3d')return;setReady(false);setMode('3d');}}>Explorar 3D</button></div></header>
    {preview&&<div className="cb-niches" aria-label="Cenas disponíveis"><button aria-pressed={selected==='restaurante'} onClick={()=>changeScene('restaurante')}>Restaurante</button><button aria-pressed={selected==='pousada'} onClick={()=>changeScene('pousada')}>Pousada</button></div>}
    <div className={`cb-stage cb-mode-${mode}`}>
      {mode==='3d'?<Suspense fallback={<div className="cb-loading" role="status">Preparando materiais e arquitetura…</div>}><Viewport niche={selected} name={name} progress={progress} onFailure={failed} onReady={loaded}/></Suspense>
      :<div className="cb-cinema" style={{'--cb-progress':progress} as React.CSSProperties}><div className={`cb-poster cb-poster-${selected}`} role="img" aria-label={`Conceito arquitetônico de ${selected}, com madeira, cerâmica e jardim`}/><div className="cb-reveal-mask" style={{clipPath:`inset(${Math.max(0,100-progress*140)}% 0 0 0)`}}/><div className="cb-glow" style={{opacity:Math.max(0,(progress-.65)/.35)}}/><div className="cb-sign" style={{opacity:Math.max(0,(progress-.75)*4)}}>{name || 'Seu lugar na vila'}</div></div>}
      {mode==='3d'&&!ready&&<div className="cb-loading" role="status">Preparando cena 3D…</div>}
      <div className="cb-caption"><span>{mode==='3d'?'MODELO 3D PARAMÉTRICO':'CENA CINEMATOGRÁFICA · IMAGEM CONCEITUAL'}</span><strong>{assemblySteps[stage]}</strong></div>
    </div>
    <div className="cb-bottom"><div className="cb-timeline" aria-label="Etapas da apresentação">{assemblySteps.map((label,index)=><button key={label} aria-label={`Ver etapa ${index+1}: ${label}`} aria-current={stage===index?'step':undefined} onClick={()=>{setProgress((index+1)/5);progressRef.current=(index+1)/5;setPlaying(false);}}><span style={{transform:`scaleX(${Math.max(0,Math.min(1,progress*5-index))})`}}/></button>)}</div>
      <div className="cb-controls"><button onClick={()=>{if(progress>=1)replay();else setPlaying(value=>!value);}}>{progress>=1?'Rever montagem':playing?'Pausar':'Reproduzir'}</button><button aria-label="Velocidade da montagem" onClick={()=>setSpeed(value=>value===1?2:1)}>{speed}×</button><button onClick={()=>{setProgress(1);progressRef.current=1;setPlaying(false);}}>Ver pronto</button>{onContinue&&<button className="cb-continue" onClick={onContinue}>Continuar para meu perfil →</button>}</div>
      <p>{mode==='3d'?'Arraste para girar a miniatura. A cena usa geometria 3D real.':'Apresentação leve baseada na arte aprovada. Toque em Explorar 3D para girar o modelo.'} A arquitetura representa o nicho; não é uma réplica da fachada real.</p>
      <p className="cb-status" role="status">{notice || 'Animação de apresentação. Não representa progresso de cadastro ou publicação.'}</p>
    </div>
  </section>;
}
