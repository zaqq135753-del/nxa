import React, { useState } from "react";
import { Waves, Sun, Volume2, VolumeX, Compass } from "lucide-react";
import { CARAIVA_REALTIME_CONTEXT } from "../../data/caraivaIntelligence";
import { CaraivaSmartSearch } from "./CaraivaSmartSearch";
import { caraivaAudio } from "../../utils/caraivaAudio";
import { asset } from "../../lib/asset";

export interface CaraivaCinematicHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectSuggestion?: (s: string) => void;
  onOpenMap?: () => void;
  onOpenTideModal?: () => void;
  onOpenSearch?: () => void;
  onConcierge?: (request?: string) => void;
  visitorName?: string;
  onPhotoCredits?: () => void;
}

export const CaraivaCinematicHero: React.FC<CaraivaCinematicHeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectSuggestion,
  onOpenMap,
  onOpenTideModal,
  onOpenSearch,
  onConcierge,
  visitorName,
  onPhotoCredits,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const handleToggleAudio = () => {
    const active = caraivaAudio.toggle();
    setIsAudioActive(active);
  };

  return (
    <div className="cv-cinematic-hero relative w-full rounded-b-[28px] sm:rounded-b-[36px] overflow-hidden bg-[#0D191C] shadow-2xl">
      {/* 1. BACKGROUND CINEMATOGRÁFICO DE CARAÍVA COM CARREGAMENTO PROGRESSIVO */}
      <div className="relative h-[360px] sm:h-[390px] w-full select-none overflow-hidden">
        {/* Poster de alta resolução com transição suave */}
        <img
          src={asset("assets/caraiva-photos/caraiva-09-1600.webp")}
          alt="Vista de Caraíva"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setIsMediaLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 scale-105 ${
            isMediaLoaded ? "opacity-90" : "opacity-40"
          }`}
        />

        {/* Gradiente multicamada Tropical Luxury */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D191C]/80 via-[#0D191C]/40 to-[#0D191C]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0D191C]/30 to-[#0D191C]/90" />
      </div>

      {/* 2. CONTEÚDO SUPERIOR & CABEÇALHO */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10 text-white">
        {/* Barra de Topo: Badge Editorial & Ações Rápidas */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-extrabold uppercase text-[#F6C76A] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30 shadow-sm flex items-center gap-1.5">
              <span>✦ Península Baiana</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onConcierge?.()}
              className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/25 transition active:scale-95"
            >
              Dica da vila ✦
            </button>
            <button
              type="button"
              onClick={onPhotoCredits}
              className="text-[11px] font-medium text-white/70 hover:text-white bg-black/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/15 transition active:scale-95 hidden sm:inline"
            >
              Créditos
            </button>

            {/* Botão de Áudio Ambiente */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-95 shadow-md flex items-center justify-center ${
                isAudioActive
                  ? "bg-[#167C5A] border-[#167C5A]/80 text-white animate-pulse"
                  : "bg-black/35 hover:bg-black/50 border-white/20 text-white/90"
              }`}
              title={isAudioActive ? "Pausar som ambiente de Caraíva" : "Ativar som suave do mar e rio"}
            >
              {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Acesso Rápido ao Mapa */}
            <button
              type="button"
              onClick={onOpenMap}
              className="p-2 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white active:scale-95 transition shadow-md"
              title="Abrir Mapa Vivo de Caraíva"
            >
              <Compass className="w-3.5 h-3.5 text-[#F6C76A]" />
            </button>
          </div>
        </div>

        {/* 3. CAMPO DE INTENÇÃO PRINCIPAL: [ ✦ O que você quer fazer? ] */}
        <div className="space-y-3 pb-1">
          <CaraivaSmartSearch query={searchQuery} onQueryChange={onSearchChange} greeting={visitorName} onSubmit={()=>onSelectSuggestion?onSelectSuggestion(searchQuery):onOpenSearch?.()} onAskConcierge={request=>onConcierge?.(request)}/>

          {/* 4. CHIPS DE CONTEXTO REAL (Tábua de Marés, Clima, Pôr do Sol) */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-white/80 font-medium">
            <button
              type="button"
              onClick={onOpenTideModal}
              className="flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/15 transition active:scale-95 text-white"
            >
              <Waves className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" />
              <span>{CARAIVA_REALTIME_CONTEXT.currentTide.type} {CARAIVA_REALTIME_CONTEXT.currentTide.height}</span>
              <span className="text-white/30">·</span>
              <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F6C76A]" />
              <span>{CARAIVA_REALTIME_CONTEXT.temperature}°C</span>
            </button>

            <span className="bg-black/30 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/10 text-white/90">
              Pôr do Sol às {CARAIVA_REALTIME_CONTEXT.sunset.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaraivaCinematicHero;
