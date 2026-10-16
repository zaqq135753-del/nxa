import React from "react";
import { Waves, Sun, Moon, Wind, X, Sparkles, CheckCircle2, ArrowRight, Compass } from "lucide-react";
import { CARAIVA_REALTIME_CONTEXT } from "../../data/caraivaIntelligence";
import { CaraivaTideScrubber } from "../experience/CaraivaTideScrubber";

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
      className="fixed inset-0 z-50 bg-[#090B0C]/85 backdrop-blur-md flex flex-col justify-end max-w-md mx-auto animate-in slide-in-from-bottom duration-500"
    >
      <div className="bg-[#141719] text-[#FFF4ED] rounded-t-3xl border-t border-white/15 max-h-[88vh] overflow-y-auto p-5 space-y-4 shadow-[0_-16px_40px_rgba(0,0,0,0.6)]">
        {/* Header Dark Luxury */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#090B0C] border border-[#F6C945]/30 flex items-center justify-center text-[#F6C945] shadow-inner">
              <Waves className="w-5 h-5 text-[#F6C945]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#FFF4ED] leading-tight">
                Tábua das Marés &amp; Clima
              </h3>
              <span className="text-[11px] text-[#FFF4ED]/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Inteligência Preditiva ao Vivo · Caraíva
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-[#FFF4ED]/70 hover:text-[#FFF4ED] hover:bg-white/10 transition"
            aria-label="Fechar tábua de marés"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Weather & Wind Highlights */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-[#090B0C] border border-white/10 text-center">
            <Sun className="w-5 h-5 text-[#F6C945] mx-auto mb-1" />
            <span className="text-sm font-bold text-[#FFF4ED] block">{data.temperature}°C</span>
            <span className="text-[10px] text-[#FFF4ED]/60">Sensação {data.feelsLike}°C</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#090B0C] border border-[#F6C945]/30 text-center shadow-sm">
            <Waves className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <span className="text-sm font-bold text-[#FFF4ED] block">{data.currentTide.height}</span>
            <span className="text-[10px] text-[#F6C945] font-semibold">{data.currentTide.type}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#090B0C] border border-white/10 text-center">
            <Wind className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-sm font-bold text-[#FFF4ED] block">8 nós</span>
            <span className="text-[10px] text-[#FFF4ED]/60">Vento Leste</span>
          </div>
        </div>

        {/* AI Radar Advice for Now */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F6C945]/15 via-orange-500/10 to-emerald-500/15 border border-[#F6C945]/30 space-y-1.5 shadow-md">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F6C945]" />
            <span className="text-xs font-bold text-[#F6C945] uppercase tracking-wider">
              Diagnóstico Autônomo da Maré
            </span>
          </div>
          <p className="text-xs text-[#FFF4ED]/90 leading-relaxed">
            {data.currentTide.description}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => {
                onFilterTideSpots("baixa");
                onClose();
              }}
              className="px-3 py-1.5 bg-[#F6C945] hover:bg-[#e5b738] text-[#090B0C] rounded-xl text-[11px] font-bold shadow-md transition flex items-center gap-1"
            >
              <span>Ver Lugares Ideais na Maré Baixa</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ALERTA PREDITIVO DE TRAVESSIA (CORUMBAU & SATU) */}
        <div className="p-3 rounded-2xl bg-[#090B0C] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6C945]">
            <Compass className="w-3.5 h-3.5" />
            <span>Condição de Travessia a Pé</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded-xl bg-white/5 border border-emerald-500/30">
              <span className="text-emerald-400 font-bold block">Praia do Satu</span>
              <span className="text-[#FFF4ED]/70 text-[10px]">Livre para caminhada até às 15:30</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-amber-500/30">
              <span className="text-amber-400 font-bold block">Ponta do Corumbau</span>
              <span className="text-[#FFF4ED]/70 text-[10px]">Barco recomendado após 16:00</span>
            </div>
          </div>
        </div>

        {/* Simulador Interativo de Maré ao Longo do Dia */}
        <div className="pt-1">
          <CaraivaTideScrubber />
        </div>

        {/* 24-Hour Tide Timeline */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFF4ED]/75 block">
            Ciclo das Marés de Hoje (4 Fases):
          </span>
          <div className="space-y-1.5">
            {data.tideTableToday.map((tide, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  tide.time === data.currentTide.time
                    ? "bg-[#090B0C] border-[#F6C945] font-bold shadow-sm"
                    : "bg-[#090B0C]/60 border-white/5 text-[#FFF4ED]/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#FFF4ED] font-semibold">{tide.time}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      tide.type === "baixa"
                        ? "bg-cyan-900/60 text-cyan-300 border border-cyan-500/30"
                        : "bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {tide.type === "baixa" ? "Baixamar" : "Preamar"} ({tide.height})
                  </span>
                </div>
                <span className="text-[11px] text-[#FFF4ED]/60 truncate max-w-[170px]">{tide.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sunset & Moon Phenomenon */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-[#090B0C] border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-[#F6C945] uppercase flex items-center gap-1">
              <Sun className="w-3 h-3 text-[#F6C945]" />
              Pôr do Sol no Rio
            </span>
            <span className="text-sm font-bold text-[#FFF4ED] block">{data.sunset.time}</span>
            <span className="text-[10px] text-[#FFF4ED]/60 block leading-tight">
              Faltam {data.sunset.minutesRemaining} min para o dourado na água
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#090B0C] border border-indigo-500/20 space-y-1">
            <span className="text-[10px] font-bold text-indigo-300 uppercase flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-400" />
              Nascer da Lua Cheia
            </span>
            <span className="text-sm font-bold text-[#FFF4ED] block">18:20 na Barra</span>
            <span className="text-[10px] text-[#FFF4ED]/60 block leading-tight">
              {data.moon.phenomenon}
            </span>
          </div>
        </div>

        {/* Tip Footer */}
        <div className="p-2.5 bg-[#090B0C] border border-white/5 rounded-xl flex items-center gap-2 text-[11px] text-[#FFF4ED]/70">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Dica Nativa: A maré baixa à tarde é o melhor momento para caminhar descalço pela orla.</span>
        </div>
      </div>
    </div>
  );
});

export default TideWeatherAiModal;
