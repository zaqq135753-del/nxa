import React, { useState } from "react";
import { Waves, Sun, VolumeX, Compass } from "lucide-react";
import { CARAIVA_REALTIME_CONTEXT } from "../../data/caraivaIntelligence";
import { CaraivaSmartSearch } from "./CaraivaSmartSearch";
import { caraivaAudio } from "../../utils/caraivaAudio";
import { asset } from "../../lib/asset";

export interface CaraivaCinematicHeroProps {
  theme?: "light" | "dark";
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
  theme = "dark",
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
  const isLight = theme === "light";

  const handleToggleAudio = () => {
    const active = caraivaAudio.toggle();
    setIsAudioActive(active);
  };

  // Imagem dinâmica: no modo claro, vista solar da praia/rio com céu aberto; no escuro, vista noturna/crepúsculo
  const bgImageSrc = isLight
    ? asset("assets/caraiva-photos/caraiva-11-640.webp")
    : asset("assets/caraiva-photos/caraiva-09-1600.webp");

  return (
    <div
      className={`cv-cinematic-hero relative w-full rounded-b-[28px] sm:rounded-b-[36px] overflow-hidden transition-colors duration-500 ${
        isLight
          ? "bg-[#F7F3E9] border-b border-[#DCE3D5] shadow-md text-[#1E4339]"
          : "bg-[#0D191C] shadow-2xl text-white"
      }`}
    >
      {/* 1. BACKGROUND CINEMATOGRÁFICO DE CARAÍVA COM CARREGAMENTO PROGRESSIVO */}
      <div className="relative h-[360px] sm:h-[390px] w-full select-none overflow-hidden">
        {/* Poster de alta resolução com transição suave */}
        <img
          key={bgImageSrc}
          src={bgImageSrc}
          alt="Vista de Caraíva"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setIsMediaLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 scale-105 ${
            isMediaLoaded ? (isLight ? "opacity-85" : "opacity-90") : "opacity-30"
          }`}
        />

        {/* Gradiente multicamada Tropical Luxury condicionado pelo tema */}
        {isLight ? (
          <>
            {/* Modo Claro: banho solar suave que se integra perfeitamente à areia (#F7F3E9) da página */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E4339]/30 via-[#F7F3E9]/25 to-[#F7F3E9]" />
            <div className="absolute inset-0 bg-radial from-transparent via-amber-950/5 to-[#F7F3E9]/75" />
          </>
        ) : (
          <>
            {/* Modo Escuro: profundidade noturna de oceano e rio */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D191C]/80 via-[#0D191C]/40 to-[#0D191C]" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#0D191C]/30 to-[#0D191C]/90" />
          </>
        )}

        {/* Partículas Atmosféricas Vivas (Brisa & Luz de Caraíva) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          {[
            { top: "22%", left: "12%", delay: "0s", duration: "6.5s", size: "w-2 h-2" },
            { top: "42%", left: "78%", delay: "1.2s", duration: "8s", size: "w-2.5 h-2.5" },
            { top: "62%", left: "28%", delay: "2.4s", duration: "7s", size: "w-1.5 h-1.5" },
            { top: "32%", left: "86%", delay: "3s", duration: "9s", size: "w-2 h-2" },
            { top: "52%", left: "64%", delay: "4.2s", duration: "7.8s", size: "w-2 h-2" },
          ].map((p, idx) => (
            <span
              key={idx}
              className={`cd-firefly absolute rounded-full ${p.size} ${
                isLight
                  ? "bg-amber-300/50 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  : "bg-cyan-300/60 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
              }`}
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        {/* Ondulação Sutil da Maré no Rodapé do Hero */}
        <div className="absolute -bottom-1 inset-x-0 h-6 pointer-events-none overflow-hidden opacity-35 select-none z-[2]">
          <svg
            className="cd-wave-animated w-[200%] h-full"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C150,38 350,2 500,20 C650,38 850,2 1000,20 C1150,38 1350,2 1500,20 L1500,40 L0,40 Z"
              fill={isLight ? "#F7F3E9" : "#0D191C"}
            />
          </svg>
        </div>
      </div>

      {/* 2. CONTEÚDO SUPERIOR & CABEÇALHO */}
      <div
        className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10 ${
          isLight ? "text-[#1E4339]" : "text-white"
        }`}
      >
        {/* Barra de Topo: Badge Editorial & Ações Rápidas */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] sm:text-[10px] tracking-[0.2em] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 transition-all ${
                isLight
                  ? "text-[#8C7132] bg-white/85 backdrop-blur-md border border-[#AA8941]/35 shadow-sm"
                  : "text-[#F6C76A] bg-black/40 backdrop-blur-md border border-amber-400/30"
              }`}
            >
              <span>✦ Península Baiana</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onConcierge?.()}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition active:scale-95 cursor-pointer ${
                isLight
                  ? "text-[#1E4339] bg-white/85 hover:bg-white backdrop-blur-md border-[#DCE3D5] shadow-sm"
                  : "text-emerald-300 hover:text-emerald-200 bg-black/30 backdrop-blur-md border-emerald-400/25"
              }`}
            >
              Dica da vila ✦
            </button>
            <button
              type="button"
              onClick={onPhotoCredits}
              className={`text-[11px] font-medium px-2 py-1 rounded-full border transition active:scale-95 hidden sm:inline cursor-pointer ${
                isLight
                  ? "text-[#697C6D] hover:text-[#1E4339] bg-white/80 backdrop-blur-md border-[#DCE3D5]"
                  : "text-white/70 hover:text-white bg-black/20 backdrop-blur-md border-white/15"
              }`}
            >
              Créditos
            </button>

            {/* Botão de Áudio Ambiente com Visualizador Equalizer & Sonar */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`relative p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 shadow-md flex items-center justify-center cursor-pointer ${
                isAudioActive
                  ? "bg-[#167C5A] border-[#167C5A] text-white shadow-emerald-500/30"
                  : isLight
                  ? "bg-white/85 hover:bg-white border-[#DCE3D5] text-[#1E4339]"
                  : "bg-black/35 hover:bg-black/50 border-white/20 text-white/90"
              }`}
              title={isAudioActive ? "Pausar som ambiente de Caraíva" : "Ativar som suave do mar e rio"}
            >
              {isAudioActive && (
                <span className="cd-sonar-ring absolute inset-0 rounded-full bg-emerald-400/40 pointer-events-none" />
              )}
              {isAudioActive ? (
                <div className="flex items-end gap-0.5 h-3.5 px-0.5 z-10">
                  <span className="w-0.5 bg-white rounded-full cd-eq-bar-1" />
                  <span className="w-0.5 bg-white rounded-full cd-eq-bar-2" />
                  <span className="w-0.5 bg-white rounded-full cd-eq-bar-3" />
                </div>
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Acesso Rápido ao Mapa */}
            <button
              type="button"
              onClick={onOpenMap}
              className={`p-2 rounded-full backdrop-blur-md border active:scale-90 transition shadow-md cursor-pointer hover:rotate-12 ${
                isLight
                  ? "bg-white/85 hover:bg-white border-[#DCE3D5] text-[#8C7132]"
                  : "bg-black/35 hover:bg-black/50 border-white/20 text-[#F6C76A]"
              }`}
              title="Abrir Mapa Vivo de Caraíva"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. CAMPO DE INTENÇÃO PRINCIPAL: [ ✦ O que você quer fazer? ] */}
        <div className="space-y-3 pb-1">
          <CaraivaSmartSearch
            query={searchQuery}
            onQueryChange={onSearchChange}
            greeting={visitorName}
            onSubmit={() => (onSelectSuggestion ? onSelectSuggestion(searchQuery) : onOpenSearch?.())}
            onAskConcierge={(request) => onConcierge?.(request)}
          />

          {/* 4. CHIPS DE CONTEXTO REAL (Tábua de Marés, Clima, Pôr do Sol) */}
          <div
            className={`flex items-center justify-between text-[10px] sm:text-[11px] font-medium ${
              isLight ? "text-[#1E4339]" : "text-white/80"
            }`}
          >
            <button
              type="button"
              onClick={onOpenTideModal}
              className={`flex items-center gap-1.5 sm:gap-2 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border transition active:scale-95 cursor-pointer ${
                isLight
                  ? "bg-white/85 hover:bg-white border-[#DCE3D5] text-[#1E4339] shadow-sm"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
            >
              <Waves className={`w-3 h-3 sm:w-3.5 sm:h-3.5 cd-boat-rock ${isLight ? "text-[#367F89]" : "text-cyan-300"}`} />
              <span>
                {CARAIVA_REALTIME_CONTEXT.currentTide.type} {CARAIVA_REALTIME_CONTEXT.currentTide.height}
              </span>
              <span className={isLight ? "text-stone-400" : "text-white/30"}>·</span>
              <Sun className={`w-3 h-3 sm:w-3.5 sm:h-3.5 cd-sun-spin ${isLight ? "text-[#AA8941]" : "text-[#F6C76A]"}`} />
              <span>{CARAIVA_REALTIME_CONTEXT.temperature}°C</span>
            </button>

            <span
              className={`backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border ${
                isLight
                  ? "bg-white/85 border-[#DCE3D5] text-[#697C6D] shadow-sm"
                  : "bg-black/30 border-white/10 text-white/90"
              }`}
            >
              Pôr do Sol às {CARAIVA_REALTIME_CONTEXT.sunset.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaraivaCinematicHero;
