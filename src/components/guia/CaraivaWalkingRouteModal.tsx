import React, { useState, useEffect } from "react";
import {
  X,
  Compass,
  Footprints,
  MapPin,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { type Business } from "../../data/caraivaDigitalData";
import {
  CARAIVA_KEY_ORIGINS,
  calculateVillageWalkingRoute,
  type VillageRoute,
  type RouteLandmark,
} from "../../services/maps/caraivaRoutingService";
import { type LatLngLiteral } from "../../services/maps/types";

interface CaraivaWalkingRouteModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePovCamera?: (camera: {
    coords: LatLngLiteral;
    bearing: number;
    pitch: number;
    zoom: number;
  }) => void;
  onClearPovRoute?: () => void;
  onSetRoutePath?: (coords: LatLngLiteral[]) => void;
}

export const CaraivaWalkingRouteModal: React.FC<CaraivaWalkingRouteModalProps> = ({
  business,
  isOpen,
  onClose,
  onUpdatePovCamera,
  onClearPovRoute,
  onSetRoutePath,
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<RouteLandmark>(CARAIVA_KEY_ORIGINS[0]);
  const [route, setRoute] = useState<VillageRoute | null>(null);
  const [isPovMode, setIsPovMode] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAutoWalk, setIsPlayingAutoWalk] = useState<boolean>(false);

  // Recalcula a rota sempre que a origem ou o estabelecimento mudar
  useEffect(() => {
    if (!business || !isOpen) return;

    const r = calculateVillageWalkingRoute(
      { name: selectedOrigin.name, coords: selectedOrigin.coords },
      business
    );
    setRoute(r);
    setCurrentStepIndex(0);
    setIsPlayingAutoWalk(false);

    if (onSetRoutePath) {
      onSetRoutePath(r.pathCoordinates);
    }
  }, [business, selectedOrigin, isOpen]);

  // Atualiza a câmera POV quando o passo muda
  useEffect(() => {
    if (!isPovMode || !route || !onUpdatePovCamera) return;

    const step = route.steps[currentStepIndex];
    if (step) {
      onUpdatePovCamera({
        coords: step.coords,
        bearing: step.heading,
        pitch: 74, // Ângulo rente ao chão (altura dos olhos do pedestre)
        zoom: 18.2, // Zoom imersivo na rua de areia
      });
    }
  }, [isPovMode, currentStepIndex, route]);

  // Auto-walk (simulação contínua do trajeto passo a passo)
  useEffect(() => {
    if (!isPlayingAutoWalk || !route || !isPovMode) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < route.steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlayingAutoWalk(false);
          return prev;
        }
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlayingAutoWalk, route, isPovMode]);

  const handleTogglePovMode = () => {
    const next = !isPovMode;
    setIsPovMode(next);
    if (!next) {
      setIsPlayingAutoWalk(false);
    }
  };

  const handleClose = () => {
    setIsPovMode(false);
    setIsPlayingAutoWalk(false);
    if (onClearPovRoute) onClearPovRoute();
    onClose();
  };

  if (!isOpen || !business || !route) return null;

  const currentStep = route.steps[currentStepIndex];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all ${
        isPovMode
          ? "pointer-events-none bg-transparent"
          : "bg-black/75 backdrop-blur-md p-0 sm:p-4 animate-in fade-in"
      }`}
    >
      {/* 1. MODO POV MINIMALISTA (HUD DE PRIMEIRA PESSOA SOBREPOSTO AO MAPA 3D) */}
      {isPovMode ? (
        <div className="pointer-events-auto w-full max-w-lg mx-auto p-4 sm:p-6 mb-24 sm:mb-8">
          <div
            className="p-4 sm:p-5 rounded-3xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-300"
            style={{
              background: "rgba(12, 23, 29, 0.92)",
              borderColor: "rgba(20, 184, 166, 0.35)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(20, 184, 166, 0.2)",
            }}
          >
            {/* Top Bar do POV */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-extrabold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                  <Compass className="w-4 h-4 text-teal-400" /> Visão POV (1ª Pessoa)
                </span>
              </div>
              <button
                type="button"
                onClick={handleTogglePovMode}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[11px] transition-colors"
              >
                Voltar à Visão Geral ✕
              </button>
            </div>

            {/* Instrução do Passo Atual */}
            <div className="py-3.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>
                  Passo {currentStepIndex + 1} de {route.steps.length}
                </span>
                <span>Direção: {Math.round(currentStep.heading)}°</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                {currentStep.instruction}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                💡 {currentStep.tip}
              </p>
            </div>

            {/* Controles de Caminhada na Areia */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentStepIndex === 0}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                  title="Passo Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlayingAutoWalk((prev) => !prev)}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    isPlayingAutoWalk
                      ? "bg-amber-400 text-slate-950 shadow-amber-400/25"
                      : "bg-teal-500 text-slate-950 shadow-teal-500/25"
                  }`}
                >
                  {isPlayingAutoWalk ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Caminhar Sozinho</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentStepIndex((prev) => Math.min(route.steps.length - 1, prev + 1))
                  }
                  disabled={currentStepIndex === route.steps.length - 1}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                  title="Próximo Passo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right text-[11px] text-slate-300 font-semibold">
                <div>{route.formattedDistance}</div>
                <div className="text-teal-400">~{route.totalWalkingMinutes} min na areia</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. MODAL PADRÃO DE SELEÇÃO E RESUMO DA ROTA */
        <div
          className="relative w-full max-w-xl bg-[#0c141a] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-6 space-y-5 max-h-[88vh] overflow-y-auto no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white font-serif">
                  Rota a Pé para {business.name}
                </h2>
                <p className="text-xs text-slate-400">Navegador Pedonal da Vila de Caraíva</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Seletor de Origem POV (Onde o Turista Está) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Ponto de Partida (Onde você está):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CARAIVA_KEY_ORIGINS.map((origin) => {
                const isSelected = selectedOrigin.id === origin.id;
                return (
                  <button
                    key={origin.id}
                    type="button"
                    onClick={() => setSelectedOrigin(origin)}
                    className={`p-2.5 rounded-2xl text-left border transition-all text-xs flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-400 text-white shadow-md shadow-teal-500/15"
                        : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-xl shrink-0">{origin.icon}</span>
                    <div className="min-w-0">
                      <p className="font-bold truncate text-white">{origin.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{origin.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards de Métricas da Rota */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Distância Total</p>
              <p className="text-lg font-black text-amber-400">{route.formattedDistance}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Tempo na Areia</p>
              <p className="text-lg font-black text-teal-300">~{route.totalWalkingMinutes} min a pé</p>
            </div>
          </div>

          {/* Passo a Passo Descritivo com Referências Locais */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Trajeto Recomendado pela Areia:
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {route.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-100">{st.instruction}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{st.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ações: Iniciar POV ou Abrir Google Maps Externo */}
          <div className="pt-2 flex items-center gap-2.5 flex-col sm:flex-row">
            <button
              type="button"
              onClick={handleTogglePovMode}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 fill-slate-950" />
              <span>Iniciar Modo POV (1ª Pessoa) 🚶‍♂️</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${selectedOrigin.coords.lat},${selectedOrigin.coords.lng}&destination=${business.latitude},${business.longitude}&travelmode=walking`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
