import { useEffect, useRef, useState } from 'react';
import { Compass, Waves } from 'lucide-react';
const labels: Record<string,string> = {inicio:'Sua Caraíva',explorar:'Descobrindo a vila',agora:'No ritmo da vila',mapa:'Abrindo os caminhos',salvos:'Seus lugares favoritos',concierge:'Seu próximo encontro',business:'Seu espaço na vila'};
/** Arrival is a visual transition, never a delay to mounting or a fabricated progress bar. */
export function GuideTabArrival({tab}:{tab:string}){
 const previous=useRef(tab);const [arrival,setArrival]=useState<string|null>(null);
 useEffect(()=>{if(previous.current===tab)return;previous.current=tab;if(matchMedia('(prefers-reduced-motion: reduce)').matches){setArrival(null);return;}setArrival(tab);const timer=setTimeout(()=>setArrival(null),520);return()=>clearTimeout(timer);},[tab]);
 return arrival ? <div key={arrival} className="cv-tab-arrival" role="status" aria-live="polite"><div className="cv-arrival-compass"><Compass size={24}/><Waves size={17}/></div><span>{labels[arrival]||'Caraíva Digital'}</span><span className="cv-arrival-wave" aria-hidden="true"/></div> : null;
}

export function GuideLoadingScene(){return <div className="cv-guide-loading" role="status" aria-live="polite"><div className="cv-loading-rings" aria-hidden="true"><Compass size={36}/></div><strong>Encontrando os caminhos da vila</strong><span>Preparando o mapa de Caraíva…</span><Waves size={32} aria-hidden="true"/></div>;}
