import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Waves,
  Smartphone,
  Compass,
  WifiOff,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
} from "lucide-react";

export type TourActionType = "mare" | "taptable" | "mapa" | "concluir";

export interface TourStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  actionLabel: string;
  actionType: TourActionType;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "mare",
    badge: "1. O PULSO DA NATUREZA",
    title: "Maré & Travessia a Pé",
    description:
      "A vida na vila pulsa com o rio e o oceano. Acompanhe a maré em tempo real para saber o momento exato de atravessar a pé para a Praia do Satu ou Corumbau.",
    icon: Waves,
    accentColor: "#06B6D4",
    actionLabel: "Ver Tábua de Marés",
    actionType: "mare",
  },
  {
    id: "taptable",
    badge: "2. HOSPITALIDADE DIGITAL",
    title: "Toque Mágico na Mesa (NFC)",
    description:
      "Nos restaurantes e botecos parceiros de Caraíva, encoste o celular no display de madeira da mesa para abrir o cardápio sensorial e pedir sem esperar garçom.",
    icon: Smartphone,
    accentColor: "#F6C945",
    actionLabel: "Testar Mesa TapTable",
    actionType: "taptable",
  },
  {
    id: "mapa",
    badge: "3. ORIENTAÇÃO NOTURNA",
    title: "Ruelas de Areia & Forró",
    description:
      "Caraíva não tem postes de luz pública. Use o Mapa 3D para se guiar descalço pela areia fofa e descobrir onde o forró e a música ao vivo acontecem hoje.",
    icon: Compass,
    accentColor: "#EC4899",
    actionLabel: "Explorar Mapa 3D",
    actionType: "mapa",
  },
  {
    id: "offline",
    badge: "4. ZERO DEPENDÊNCIA DE SINAL",
    title: "Modo Areia (100% Offline)",
    description:
      "O sinal 4G costuma oscilar na beira da praia. O Guia já está salvo no seu smartphone para funcionar mesmo sem sinal de operadora.",
    icon: WifiOff,
    accentColor: "#10B981",
    actionLabel: "Começar Minha Experiência",
    actionType: "concluir",
  },
];

const STORAGE_KEY = "caraiva:tour_island_v1";

// Síntese sonora suave via Web Audio API
class TourAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playChime(index: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords: number[][] = [
      [329.63, 440.0],          // E4, A4 (Maré - Calmo)
      [369.99, 493.88],         // F#4, B4 (NFC - Brilhante)
      [440.0, 554.37],          // A4, C#5 (Mapa - Acolhedor)
      [440.0, 554.37, 659.25],  // A4, C#5, E5 (Conclusão Festiva)
    ];

    const freqs = chords[index % chords.length];
    const now = this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.0001, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.04, now + i * 0.05 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.95);
    });
  }
}

const audioSynth = new TourAudioSynthesizer();

export interface CaraivaDynamicTourIslandProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAction?: (action: TourActionType) => void;
}

export const CaraivaDynamicTourIsland: React.FC<CaraivaDynamicTourIslandProps> = ({
  isOpen: controlledIsOpen,
  onClose,
  onAction,
}) => {
  const [internalOpen, setInternalOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const completed = localStorage.getItem(STORAGE_KEY);
    return !completed;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [direction, setDirection] = useState<number>(1);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const currentStep = TOUR_STEPS[currentIndex];

  const handleClose = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "completed");
    setInternalOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  const goToStep = useCallback(
    (index: number, newDir: number = 1) => {
      setDirection(newDir);
      setCurrentIndex(index);
      audioSynth.playChime(index);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentIndex < TOUR_STEPS.length - 1) {
      goToStep(currentIndex + 1, 1);
    } else {
      handleClose();
      if (onAction) onAction("concluir");
    }
  }, [currentIndex, goToStep, handleClose, onAction]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToStep(currentIndex - 1, -1);
    }
  }, [currentIndex, goToStep]);

  const handleActionButton = () => {
    if (onAction) {
      onAction(currentStep.actionType);
    }
    if (currentStep.actionType === "concluir") {
      handleClose();
    } else if (currentIndex < TOUR_STEPS.length - 1) {
      handleNext();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioSynth.enabled = next;
    if (next) audioSynth.playChime(currentIndex);
  };

  // Pausar timer ao interagir
  useEffect(() => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
  }, [currentIndex]);

  if (!isVisible) return null;

  const IconComponent = currentStep.icon;

  return (
    <aside
      aria-label="Passo a passo inicial de Caraíva"
      className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-lg select-none pointer-events-auto"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -60, opacity: 0, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="relative overflow-hidden rounded-3xl border shadow-2xl"
        style={{
          backgroundColor: "rgba(9, 11, 12, 0.95)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderColor: "rgba(246, 201, 69, 0.35)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(246, 201, 69, 0.18)",
        }}
      >
        {/* Glow Superior Pulsante com a Cor do Passo */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 rounded-full blur-2xl pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: `${currentStep.accentColor}33` }}
        />

        {/* Header da Cápsula */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-3.5 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentStep.accentColor }}
            />
            <span
              className="text-[10px] font-black tracking-widest uppercase"
              style={{ color: currentStep.accentColor }}
            >
              O FAROL DE CARAÍVA
            </span>
          </div>

          {/* Indicadores de Etapa (Dots) */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((step, idx) => {
              const isCurrent = idx === currentIndex;
              const isPast = idx < currentIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(idx, idx > currentIndex ? 1 : -1)}
                  aria-label={`Ir para etapa ${idx + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: isCurrent ? "24px" : "8px",
                    backgroundColor: isCurrent
                      ? currentStep.accentColor
                      : isPast
                      ? "rgba(246, 201, 69, 0.45)"
                      : "rgba(255, 255, 255, 0.15)",
                    boxShadow: isCurrent ? `0 0 10px ${currentStep.accentColor}` : "none",
                  }}
                />
              );
            })}
          </div>

          {/* Botões de Som e Fechar */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? "Silenciar guia" : "Ativar áudio do guia"}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" style={{ color: "#F6C945" }} />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleClose}
              aria-label="Fechar introdução"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Passo com AnimatePresence */}
        <div className="relative px-5 py-3.5 min-h-[140px] flex flex-col justify-between">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep.id}
              initial={{ x: direction * 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 40, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex items-start gap-3.5"
            >
              {/* Ícone com Halo Dourado */}
              <div
                className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-lg transition-colors duration-500"
                style={{
                  backgroundColor: `${currentStep.accentColor}18`,
                  borderColor: `${currentStep.accentColor}44`,
                  boxShadow: `0 8px 20px ${currentStep.accentColor}22`,
                }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: currentStep.accentColor }}
                />
              </div>

              {/* Textos */}
              <div className="flex-1 min-w-0 pr-1">
                <div
                  className="text-[10px] font-bold tracking-wider uppercase mb-0.5"
                  style={{ color: "rgba(255, 244, 237, 0.6)" }}
                >
                  {currentStep.badge}
                </div>
                <h3
                  className="text-base font-black tracking-tight leading-tight"
                  style={{ color: "#FFF4ED" }}
                >
                  {currentStep.title}
                </h3>
                <p
                  className="text-xs leading-relaxed mt-1"
                  style={{ color: "rgba(255, 244, 237, 0.78)" }}
                >
                  {currentStep.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Barra de Ações Inferior */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5">
            {/* Navegação Voltar */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 text-xs font-bold transition-opacity ${
                currentIndex === 0 ? "opacity-0 pointer-events-none" : "text-white/60 hover:text-white"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {/* Ação Principal da Etapa */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleActionButton}
                className="px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
                style={{
                  backgroundColor: currentStep.accentColor,
                  color: "#090B0C",
                  boxShadow: `0 4px 18px ${currentStep.accentColor}40`,
                }}
              >
                <span>{currentStep.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Botão Próximo / Pular */}
              {currentIndex < TOUR_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white transition-colors"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="px-3 py-2 rounded-xl text-xs font-bold border text-emerald-400 border-emerald-500/30 bg-emerald-500/10 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pronto</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

// Botão Discreto de Reabertura (para ser acoplado no Header ou Dock)
export const CaraivaTourReopenButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Abrir dicas de Caraíva"
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all hover:scale-105 active:scale-95 ${className}`}
      style={{
        backgroundColor: "rgba(246, 201, 69, 0.12)",
        borderColor: "rgba(246, 201, 69, 0.35)",
        color: "#F6C945",
        boxShadow: "0 4px 15px rgba(246, 201, 69, 0.15)",
      }}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>Como Usar a Vila</span>
    </button>
  );
};

export default CaraivaDynamicTourIsland;
