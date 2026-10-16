import React, { useState } from 'react';
import { Sun, CloudSun, Waves, Wind, ShieldAlert, ChevronDown, ChevronUp, Droplets } from 'lucide-react';
import { useCaraivaWeatherAndTide } from './useCaraivaWeatherAndTide';

export const CaraivaWeatherTideWidget: React.FC = () => {
  const weather = useCaraivaWeatherAndTide();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full px-3 pt-1.5 pb-2">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="w-full rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900/60 to-amber-950/30 border border-teal-500/20 backdrop-blur-md p-2.5 sm:p-3 cursor-pointer hover:border-teal-500/40 transition-all shadow-md group"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Lado Esquerdo: Clima Atual */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              {weather.isDay ? <Sun className="w-4 h-4 animate-spin-slow" /> : <CloudSun className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white tracking-tight">
                  {weather.temp}°C
                </span>
                <span className="text-[11px] text-slate-300 truncate font-medium">
                  {weather.condition}
                </span>
              </div>
              <p className="text-[10px] text-teal-300/80 font-medium">
                Sensação {weather.apparentTemp}°C · UV {weather.uvIndex}
              </p>
            </div>
          </div>

          {/* Lado Direito: Maré em Tempo Real */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold">
              <Waves className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>{weather.tideState === 'baixa' ? 'Maré Baixa ⬇' : 'Maré Alta ⬆'}</span>
            </div>
            <div className="text-slate-400 group-hover:text-white transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Detalhes Expansíveis */}
        {expanded && (
          <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2 text-xs animate-in fade-in duration-200">
            <div className="p-2 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2">
              <Wind className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <strong className="text-white block font-semibold">Tábua de Maré de Caraíva:</strong>
                <span className="text-slate-300">{weather.nextTideLabel} por volta das {weather.nextTideTime}.</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-start gap-2">
              <Droplets className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-teal-100 m-0 leading-relaxed">
                💡 <strong className="text-teal-300">Dica do Mar:</strong> {weather.recommendation}
              </p>
            </div>

            {weather.uvIndex >= 7 && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 px-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Índice UV muito alto em Caraíva. Recomendado filtro solar e chapéu na areia.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
