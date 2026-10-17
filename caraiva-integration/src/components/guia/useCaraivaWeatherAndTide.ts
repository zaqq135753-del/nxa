import { useEffect, useSyncExternalStore } from 'react';
export interface WeatherTideData { temp: number; apparentTemp: number; condition: string; isDay: boolean; uvIndex: number; tideState: 'baixa' | 'alta' | 'desconhecida'; nextTideTime: string; nextTideLabel: string; recommendation: string; verified: boolean; consultedAt: string }
let value: WeatherTideData = { temp: 0, apparentTemp: 0, condition: 'Clima ainda não consultado', isDay: true, uvIndex: 0, tideState: 'desconhecida', nextTideTime: '', nextTideLabel: 'Tábua de marés não conectada', recommendation: 'Confirme as condições e orientações locais antes de entrar no mar ou realizar travessias.', verified: false, consultedAt: '' };
const listeners = new Set<() => void>(); let pending = false; let lastAttempt = 0;
async function fetchWeather() {
  if (pending || Date.now() - lastAttempt < 240000 || !navigator.onLine) return;
  pending = true; lastAttempt = Date.now(); const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-16.8049&longitude=-39.1478&current=temperature_2m,apparent_temperature,is_day,weather_code&timezone=America%2FSao_Paulo', { signal: controller.signal });
    if (!response.ok) return;
    const json: unknown = await response.json();
    if (typeof json !== 'object' || !json || !('current' in json) || typeof json.current !== 'object' || !json.current) return;
    const current = json.current;
    if (!('temperature_2m' in current) || typeof current.temperature_2m !== 'number' || !('apparent_temperature' in current) || typeof current.apparent_temperature !== 'number') return;
    const code = 'weather_code' in current && typeof current.weather_code === 'number' ? current.weather_code : -1;
    value = { ...value, temp: Math.round(current.temperature_2m), apparentTemp: Math.round(current.apparent_temperature), isDay: 'is_day' in current && current.is_day === 1, condition: code === 0 ? 'Céu aberto' : code <= 3 && code > 0 ? 'Parcialmente nublado' : code >= 51 ? 'Previsão de precipitação' : 'Previsão meteorológica', verified: true, consultedAt: new Date().toISOString() };
    listeners.forEach(listener => listener());
  } catch { /* An unavailable forecast never becomes invented weather or tide data. */ }
  finally { clearTimeout(timeout); pending = false; }
}
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useCaraivaWeatherAndTide(): WeatherTideData {
  const weather = useSyncExternalStore(subscribe, () => value);
  useEffect(() => { void fetchWeather(); const timer = setInterval(() => void fetchWeather(), 300000); return () => clearInterval(timer); }, []);
  return weather;
}
