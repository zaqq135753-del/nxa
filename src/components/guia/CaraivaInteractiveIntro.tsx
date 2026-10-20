import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, MapPin, Compass, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { caraivaAudio } from "../../utils/caraivaAudio";
import { Caraiva3DSunLogoCanvas } from "./Caraiva3DSunLogoCanvas";
import { markIntroAsSeen } from "../../services/introLifecycleService";

interface CaraivaInteractiveIntroProps {
  onComplete: () => void;
  autoPlayDelayMs?: number;
}

const POETIC_STEPS = [
  { text: "Onde o Rio Caraíva abraça o Mar...", sub: "Bahia, Brasil • 16.81° S, 39.14° W" },
  { text: "Conectando ao silêncio das ruas de areia...", sub: "Zero buzinas de carro • Iluminação discreta por lampiões" },
  { text: "Sintonizando o ritmo da maré viva...", sub: "Canoas a postos na barra • Brisa nas amendoeiras" },
  { text: "A vila mais mágica do Brasil está acordada.", sub: "Tire os chinelos e sinta o chão." },
];

export const CaraivaInteractiveIntro: React.FC<CaraivaInteractiveIntroProps> = ({
  onComplete,
  autoPlayDelayMs = 3800,
}) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [orbTaps, setOrbTaps] = useState(0);
  const [isReadyPhase, setIsReadyPhase] = useState(false); // Transição "Seu ambiente está pronto"
  const videoRef = useRef<HTMLVideoElement>(null);

  // Grava imediatamente na montagem que a intro já foi exibida (nunca repete no F5!)
  useEffect(() => {
    markIntroAsSeen();
  }, []);

  // Auto-transição inteligente ao chegar em 100% (não trava esperando clique obrigatório)
  useEffect(() => {
    if (!isReadyPhase) return;
    const autoEnterTimer = setTimeout(() => {
      onComplete();
    }, 950);
    return () => clearTimeout(autoEnterTimer);
  }, [isReadyPhase, onComplete]);

  // Permite fechar imediatamente com Escape, Enter ou Espaço
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  // Alterna frases poéticas sincronizadas com o progresso
  useEffect(() => {
    const calculatedStep = Math.min(
      POETIC_STEPS.length - 1,
      Math.floor((progress / 100) * POETIC_STEPS.length)
    );
    setStepIndex(calculatedStep);
  }, [progress]);

  // Cronômetro suave de progresso com ritmo contemplativo e calmo
  useEffect(() => {
    const intervalTime = 35;
    const increment = 100 / (autoPlayDelayMs / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Dispara a fase de revelação "Seu ambiente está pronto"
          setIsReadyPhase(true);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [autoPlayDelayMs]);

  // Gestão do áudio da maré real
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAudioActive) {
      caraivaAudio.playOcean();
      setIsAudioActive(true);
    } else {
      caraivaAudio.stop();
      setIsAudioActive(false);
    }
  };

  // Interatividade: Toque no Sol acelera o carregamento e dispara háptica
  const handleOrbTouch = () => {
    setOrbTaps((prev) => prev + 1);
    setProgress((prev) => Math.min(100, prev + 14));
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 20]);
    }
    if (!isAudioActive) {
      caraivaAudio.playOcean();
      setIsAudioActive(true);
    }
  };

  return (
    <motion.aside
      aria-label="Introdução interativa de Caraíva"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-[#07090A] text-[#FFF4ED] select-none"
    >
      {/* 1. VÍDEO CINEMATOGRÁFICO DE FUNDO & FOTO REAL HD (KEN BURNS) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Camada A: Vídeo MP4 curto do Caraíva Cinematic */}
        <video
          ref={videoRef}
          src="/assets/caraiva-intro-short.mp4"
          poster="/assets/caraiva-photos/caraiva-09-1600.webp"
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover opacity-40 scale-105 filter saturate-[1.2] contrast-[1.1]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />

        {/* Camada B: Foto Real HD com Parallax Suave (Ken Burns) */}
        <motion.div
          initial={{ scale: 1, y: 0 }}
          animate={{ scale: 1.08, y: -10 }}
          transition={{ duration: 8, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-35"
          style={{ backgroundImage: `url('/assets/caraiva-photos/caraiva-09-1600.webp')` }}
        />

        {/* Camada C: Máscara Dark Luxury Degradê */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090A]/85 via-[#07090A]/40 to-[#07090A]/95" />

        {/* Camada D: Poeira Estelar & Vagalumes Dourados */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#F6C945]"
              style={{
                top: `${(i * 7) % 90}%`,
                left: `${(i * 13) % 95}%`,
                filter: "blur(0.5px)",
              }}
              animate={{
                y: [0, -35, 0],
                opacity: [0.15, 0.75, 0.15],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: 3 + (i % 3) * 1.5,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. TOPO: CONTROLES DE ÁUDIO & PULAR INTRO */}
      <header className="relative z-10 flex items-center justify-between p-6 sm:px-10">
        <button
          type="button"
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141719]/80 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-300 hover:text-[#F6C945] hover:border-[#F6C945]/40 transition-all duration-200"
        >
          {isAudioActive ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#F6C945] animate-pulse" />
              <span>Som da Maré: Ligado</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>Ativar Som da Vila</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onComplete}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F6C945]/15 hover:bg-[#F6C945]/25 backdrop-blur-md border border-[#F6C945]/30 text-xs font-semibold text-[#F6C945] hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span>Pisar na Areia</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 3. CENTRO: O SOL 3D VOLUMÉTRICO & TRANSIÇÃO DE AMBIENTE PRONTO */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {!isReadyPhase ? (
            /* FASE 1: O SOL SE MONTANDO EM 3D NO HORIZONTE */
            <motion.div
              key="building-phase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* O Sol & Ondas 3D em WebGL Procedural */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Tocar no sol 3D de Caraíva para acelerar"
                onClick={handleOrbTouch}
                className="relative cursor-pointer group mb-1 flex items-center justify-center"
              >
                {/* Canvas WebGL 3D do Sol em Cúpula e Ondas se Montando */}
                <Caraiva3DSunLogoCanvas progress={progress} />

                {/* Dica de Toque Háptico Flutuante */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                  {orbTaps > 0 && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-[#2DD4BF] font-semibold mb-1"
                    >
                      +{orbTaps * 14}% Maré Acelerada
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Tipografia Master Oficial: Caraíva DIGITAL */}
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="space-y-1 mb-3"
              >
                <div
                  style={{ fontFamily: "'Kaushan Script', cursive" }}
                  className="text-4xl sm:text-5xl text-white tracking-wide drop-shadow-[0_4px_24px_rgba(246,201,69,0.35)]"
                >
                  Caraíva
                </div>
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.45em] text-[#38BDF8] drop-shadow-[0_2px_12px_rgba(56,189,248,0.4)]">
                  DIGITAL
                </div>
                <p className="text-[11px] text-slate-300 font-medium tracking-wide pt-1">
                  Caraíva é mágica. Agora, também é inteligente.
                </p>
              </motion.div>

              {/* Frases Poéticas Rotativas */}
              <div className="h-14 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-1"
                  >
                    <p className="text-sm sm:text-base font-medium text-[#FFF4ED]">
                      {POETIC_STEPS[stepIndex].text}
                    </p>
                    <p className="text-xs text-slate-400 font-normal">
                      {POETIC_STEPS[stepIndex].sub}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* FASE 2: MOMENTO UAU — "SEU AMBIENTE ESTÁ PRONTO" */
            <motion.div
              key="ready-phase"
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-5 py-8"
            >
              {/* Ícone de Pulso Dourado / Conexão Estelar */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute inset-0 -m-3 rounded-full bg-[#F6C945] blur-lg"
                />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#F6C945] to-[#FFAE33] p-1 shadow-[0_0_50px_rgba(246,201,69,0.5)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#07090A] flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-[#F6C945]" />
                  </div>
                </div>
              </div>

              {/* Título de Boas-Vindas */}
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[11px] font-bold text-[#2DD4BF] uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sincronização Concluída</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                >
                  Seu ambiente está pronto.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed"
                >
                  A maré está calculada, as trilhas de areia estão traçadas e o vilarejo te espera.
                </motion.p>

                {/* Instrução Explícita de Toque */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  className="text-[11px] text-[#F6C945] font-semibold tracking-wider uppercase pt-2 flex items-center justify-center gap-1.5"
                >
                  <span>Toque no botão abaixo para ingressar na vila</span>
                </motion.p>
              </div>

              {/* Botão de Entrada Imediata com Pulso Luminoso */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: [1, 1.04, 1] }}
                transition={{
                  scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.4, delay: 0.35 }
                }}
                type="button"
                onClick={onComplete}
                className="mt-3 flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F6C945] via-[#FFAE33] to-[#FF8A3D] text-slate-950 font-extrabold text-sm shadow-[0_8px_35px_rgba(246,201,69,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Entrar em Caraíva</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. BASE: BARRA DE PROGRESSO COM MARÉ & BOTÃO INICIAR */}
      <footer className="relative z-10 p-6 sm:px-10 pb-8 max-w-xl mx-auto w-full space-y-4">
        {/* Barra de Progresso com Correnteza */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#F6C945]" />
              {!isReadyPhase ? "Sincronizando maré e pousadas" : "Vilarejo carregado com sucesso"}
            </span>
            <span className="font-mono text-[#F6C945] font-semibold">{Math.round(progress)}%</span>
          </div>

          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#F6C945] via-[#FF8A3D] to-[#2DD4BF]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Rodapé com Selo Geográfico Autêntico */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2 border-t border-white/5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#2DD4BF]" />
            Barra do Rio Caraíva
          </span>
          <span>•</span>
          <span>Reserva Extrativista</span>
          <span>•</span>
          <span>Patrimônio Natural</span>
        </div>
      </footer>
    </motion.aside>
  );
};

export default CaraivaInteractiveIntro;
