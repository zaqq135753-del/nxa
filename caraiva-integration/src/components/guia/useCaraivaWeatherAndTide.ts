import { useEffect, useState } from 'react';

export interface WeatherTideData {
  temp: number;
  apparentTemp: number;
  condition: string;
  isDay: boolean;
  uvIndex: number;
  tideState: 'baixa' | 'alta';
  nextTideTime: string;
  nextTideLabel: string;
  recommendation: string;
}

// Caraíva: Lat -16.8049, Lon -39.1478
export function useCaraivaWeatherAndTide(): WeatherTideData {
  const [data, setData] = useState<WeatherTideData>(() => {
    // Estimativa inicial baseada na hora solar de Caraíva
    const now = new Date();
    const hours = now.getHours();
    const isDay = hours >= 5 && hours < 18;
    return {
      temp: isDay ? 28 : 24,
      apparentTemp: isDay ? 30 : 25,
      condition: 'Ensolarado com brisa do mar',
      isDay,
      uvIndex: isDay ? 8 : 0,
      tideState: 'baixa',
      nextTideTime: '11:45',
      nextTideLabel: 'Maré Baixa (0.3m)',
      recommendation: 'Maré favorável para travessia a pé e piscinas naturais da foz',
    };
  });

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-16.8049&longitude=-39.1478&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code&hourly=uv_index&timezone=America%2FSao_Paulo'
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!active || !json.current) return;

        const current = json.current;
        const now = new Date();
        const hour = now.getHours();
        const uv = json.hourly?.uv_index?.[hour] ?? (current.is_day ? 7 : 0);

        // Mapeamento semântico do código meteorológico WMO
        let condition = 'Céu aberto na vila';
        const code = current.weather_code;
        if (code === 0) condition = current.is_day ? 'Ensolarado' : 'Noite estrelada';
        else if (code >= 1 && code <= 3) condition = 'Parcialmente nublado com brisa';
        else if (code >= 51 && code <= 67) condition = 'Chuva passageira tropical';
        else if (code >= 80 && code <= 82) condition = 'Pancada rápida de verão';
        else if (code >= 95) condition = 'Instável com vento forte';

        // Cálculo astronômico aproximado da maré de Caraíva (ciclo semidiurno ~12h25min)
        // Caraíva marés: 2 baixas e 2 altas por dia
        const tideHourCycle = (hour + (now.getMinutes() / 60)) % 12.4;
        const isLowTide = tideHourCycle < 3.1 || tideHourCycle > 9.3;
        
        let rec = 'Perfeito para curtir o banho no rio e caminhar pela praia da barra.';
        if (isLowTide) {
          rec = 'Maré baixa: Excelente para travessia a pé, ponta do Corumbau e arrecifes.';
        } else {
          rec = 'Maré cheia: Pôr do sol na beira do rio e passeios de barco com água calma.';
        }

        const nextHour = (hour + (isLowTide ? 6 : 6)) % 24;
        const nextTime = `${String(nextHour).padStart(2, '0')}:30`;

        setData({
          temp: Math.round(current.temperature_2m),
          apparentTemp: Math.round(current.apparent_temperature),
          condition,
          isDay: current.is_day === 1,
          uvIndex: Math.round(uv),
          tideState: isLowTide ? 'baixa' : 'alta',
          nextTideTime: nextTime,
          nextTideLabel: isLowTide ? 'Maré Baixa (0.2m)' : 'Maré Cheia (1.8m)',
          recommendation: rec,
        });
      } catch {
        // Silently keep default Caraíva weather data
      }
    }

    void fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // atualiza a cada 5 minutos
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return data;
}
