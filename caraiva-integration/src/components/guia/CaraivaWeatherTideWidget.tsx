import { useState } from 'react';
import { CloudSun, Waves, ChevronDown } from 'lucide-react';
import { useCaraivaWeatherAndTide } from './useCaraivaWeatherAndTide';
export function CaraivaWeatherTideWidget() {
  const weather = useCaraivaWeatherAndTide(); const [expanded, setExpanded] = useState(false);
  return <section style={{ padding: '6px 12px 10px', color: 'var(--cv-ink)' }}><button type="button" aria-expanded={expanded} onClick={() => setExpanded(previous => !previous)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, width: '100%', borderRadius: 16, border: '1px solid var(--cv-line)', background: 'var(--cv-paper)', color: 'inherit', fontSize: 12, textAlign: 'left' }}><CloudSun size={18} /><span>{weather.verified ? `${weather.temp}°C · ${weather.condition}` : 'Previsão meteorológica indisponível'}</span><Waves size={16} /><ChevronDown size={16} style={{ marginLeft: 'auto' }} /></button>{expanded && <div style={{ fontSize: 12, padding: '10px 8px', lineHeight: 1.6 }}><p>{weather.verified ? `Open-Meteo · previsão consultada às ${new Date(weather.consultedAt).toLocaleTimeString('pt-BR')}. Sensação ${weather.apparentTemp}°C.` : 'Sem dados meteorológicos consultados neste momento.'}</p><p>{weather.nextTideLabel}. {weather.recommendation}</p></div>}</section>;
}
