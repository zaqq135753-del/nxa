import { useEffect } from 'react';
import { X, Waves } from 'lucide-react';
import { CaraivaTideScrubber } from '../experience/CaraivaTideScrubber';
import { useCaraivaWeatherAndTide } from './useCaraivaWeatherAndTide';
interface Props { isOpen: boolean; onClose: () => void; onFilterTideSpots: (type: 'baixa' | 'alta') => void }
export default function TideWeatherAiModal({ isOpen, onClose }: Props) {
  const weather = useCaraivaWeatherAndTide();
  useEffect(() => { if (!isOpen) return; const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, [isOpen, onClose]);
  if (!isOpen) return null;
  return <div role="dialog" aria-modal="true" aria-labelledby="caraiva-weather-title" style={{ position:'fixed',inset:0,zIndex:100,background:'#000b',display:'grid',placeItems:'center',padding:18 }}><section style={{ width:'min(100%,680px)',maxHeight:'85dvh',overflow:'auto',padding:24,borderRadius:24,background:'#141719',color:'#FFF4ED',border:'1px solid #5f7d63' }}><header style={{ display:'flex',alignItems:'center',gap:12 }}><Waves color="#F6C945"/><h2 id="caraiva-weather-title" style={{ flex:1 }}>Clima e marés</h2><button autoFocus aria-label="Fechar clima e marés" onClick={onClose}><X/></button></header><p>{weather.verified ? `${weather.temp}°C · ${weather.condition}. Previsão Open-Meteo consultada às ${new Date(weather.consultedAt).toLocaleTimeString('pt-BR')}.` : 'A previsão meteorológica está indisponível neste momento.'}</p><h3>Tábua local ainda não conectada</h3><p>O aplicativo não confirma horários ou alturas de maré. Consulte uma tábua local datada e orientações da região antes de planejar atividades na água ou travessias.</p><details><summary style={{ cursor:'pointer',padding:'12px 0' }}>Ver animação demonstrativa das marés</summary><p>Simulação visual: os valores e recomendações da animação não representam a previsão local.</p><CaraivaTideScrubber/></details></section></div>;
}
