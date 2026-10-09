import React from "react";
import { Waves, Sun, Moon, Wind, X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { CARAIVA_REALTIME_CONTEXT } from "../../data/caraivaIntelligence";

interface TideWeatherAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterTideSpots: (type: "baixa" | "alta") => void;
}

export const TideWeatherAiModal: React.FC<TideWeatherAiModalProps> = React.memo(({
  isOpen,
  onClose,
  onFilterTideSpots,
}) => {
  if (!isOpen) return null;

  const data = CARAIVA_REALTIME_CONTEXT;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-end max-w-md mx-auto animate-in slide-in-from-bottom duration-500"
    >
      <div className="bg-white/98 text-zinc-900 rounded-t-3xl border-t border-white max-h-[88vh] overflow-y-auto p-5 space-y-4 shadow-[0_-16px_40px_rgba(0,0,0,0.22)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 shadow-sm">
              <Waves className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900 leading-tight">
                Tábua das Marés &amp; Clima
              </h3>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Atualizado ao vivo em Caraíva
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition"
            aria-label="Fechar tábua de marés"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Weather & Wind Highlights */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center">
            <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <span className="text-sm font-bold text-zinc-900 block">{data.temperature}°C</span>
            <span className="text-[10px] text-zinc-500">Sensação {data.feelsLike}°C</span>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-50/80 border border-cyan-200/80 text-center">
            <Waves className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
            <span className="text-sm font-bold text-zinc-900 block">{data.currentTide.height}</span>
            <span className="text-[10px] text-cyan-700 font-semibold">{data.currentTide.type}</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-center">
            <Wind className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-sm font-bold text-zinc-900 block">8 nós</span>
            <span className="text-[10px] text-zinc-500">Vento Leste</span>
          </div>
        </div>

        {/* AI Radar Advice for Now */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-400/15 to-emerald-500/15 border border-amber-400/40 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Diagnóstico da IA para o Momento
            </span>
          </div>
          <p className="text-xs text-zinc-800 leading-relaxed">
            {data.currentTide.description}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => {
                onFilterTideSpots("baixa");
                onClose();
              }}
              className="px-3 py-1.5 bg-[#E28444] hover:bg-[#c97135] text-white rounded-xl text-[11px] font-bold shadow transition flex items-center gap-1"
            >
              <span>Ver Melhores Lugares na Maré Baixa</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 24-Hour Tide Timeline */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
            Ciclo das Marés de Hoje (4 Fases):
          </span>
          <div className="space-y-1.5">
            {data.tideTableToday.map((tide, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  tide.time === data.currentTide.time
                    ? "bg-cyan-50 border-cyan-400 font-bold shadow-sm"
                    : "bg-zinc-50 border-zinc-200 text-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-zinc-900 font-semibold">{tide.time}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      tide.type === "baixa"
                        ? "bg-cyan-100 text-cyan-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {tide.type === "baixa" ? "Baixamar" : "Preamar"} ({tide.height})
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 truncate max-w-[170px]">{tide.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sunset & Moon Phenomenon */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
            <span className="text-[10px] font-bold text-orange-800 uppercase flex items-center gap-1">
              <Sun className="w-3 h-3 text-orange-500" />
              Pôr do Sol no Rio
            </span>
            <span className="text-sm font-bold text-zinc-900 block">{data.sunset.time}</span>
            <span className="text-[10px] text-zinc-600 block leading-tight">
              Faltam {data.sunset.minutesRemaining} min para o dourado na água
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
            <span className="text-[10px] font-bold text-indigo-800 uppercase flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-500" />
              Nascer da Lua Cheia
            </span>
            <span className="text-sm font-bold text-zinc-900 block">18:20 na Barra</span>
            <span className="text-[10px] text-zinc-600 block leading-tight">
              {data.moon.phenomenon}
            </span>
          </div>
        </div>

        {/* Tip Footer */}
        <div className="p-2.5 bg-zinc-100 rounded-xl flex items-center gap-2 text-[11px] text-zinc-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dica Nativa: A maré baixa à tarde é o melhor momento para caminhar descalço pela orla.</span>
        </div>
      </div>
    </div>
  );
});

export default TideWeatherAiModal;
