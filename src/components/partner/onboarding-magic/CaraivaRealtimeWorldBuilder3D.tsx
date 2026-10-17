import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Sparkles,
  FastForward,
  Volume2,
  VolumeX,
  CheckCircle2,
  Building2,
  Compass,
  Play,
  Pause,
} from "lucide-react";

export type WorldBuilderStage =
  | "sand"
  | "walls"
  | "roof"
  | "facade_sign"
  | "orb_blessing"
  | "dive_in"
  | "completed";

export interface CaraivaRealtimeWorldBuilder3DProps {
  businessName?: string;
  category?: string;
  customColor?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

export const CARAIVA_CATEGORY_COLORS: Record<string, string> = {
  restaurantes: "#F59E0B",
  bares: "#EF4444",
  cafes: "#10B981",
  praias: "#06B6D4",
  passeios: "#2563EB",
  hospedagens: "#8B5CF6",
  noite: "#EC4899",
  lojas: "#F97316",
  pontos: "#EAB308",
};

interface StageMetadata {
  id: WorldBuilderStage;
  label: string;
  phrase: string;
  durationMs: number;
  zoomScale: number;
  focalPoint: { x: number; y: number };
}

const STAGES: StageMetadata[] = [
  {
    id: "sand",
    label: "Pedestal de Galeria",
    phrase: "Elevando o pedestal de obsidiana e a ilha de areia de Caraíva...",
    durationMs: 2800,
    zoomScale: 1.0,
    focalPoint: { x: 50, y: 55 },
  },
  {
    id: "walls",
    label: "Casario & Jacarandá",
    phrase: "Modelando a estrutura em jacarandá e as paredes coloniais...",
    durationMs: 3000,
    zoomScale: 1.15,
    focalPoint: { x: 50, y: 50 },
  },
  {
    id: "roof",
    label: "Telhado de Cerâmica",
    phrase: "Assentando o telhado colonial e acendendo os lampiões de latão...",
    durationMs: 3200,
    zoomScale: 1.25,
    focalPoint: { x: 52, y: 48 },
  },
  {
    id: "facade_sign",
    label: "Placa em Ouro 24k",
    phrase: "Entalhando a placa de madeira nobre e letras folheadas a ouro...",
    durationMs: 3000,
    zoomScale: 1.45,
    focalPoint: { x: 55, y: 52 },
  },
  {
    id: "orb_blessing",
    label: "Luz de Museu & Orb",
    phrase: "Ativando os holofotes de galeria e a luz interior aconchegante...",
    durationMs: 3400,
    zoomScale: 1.1,
    focalPoint: { x: 50, y: 50 },
  },
  {
    id: "dive_in",
    label: "Mergulho de Gala",
    phrase: "Seu casario de colecionador ganha vida no ecossistema...",
    durationMs: 2200,
    zoomScale: 1.0,
    focalPoint: { x: 50, y: 50 },
  },
];

// Synth de áudio via Web Audio API
class DioramaAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playChord(frequencies: number[], duration = 1.2, type: OscillatorType = "sine") {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    frequencies.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  playStageSound(stageIndex: number) {
    if (!this.enabled) return;
    const chords: number[][] = [
      [146.83, 220.0, 293.66],       // D3 - Solene
      [164.81, 246.94, 329.63],      // E3 - Construção
      [196.0, 293.66, 392.0],        // G3 - Iluminação
      [220.0, 277.18, 329.63, 440.0],// A Maj - Ouro
      [293.66, 369.99, 440.0, 587.33],// D Maj - Celebração
      [440.0, 554.37, 659.25, 880.0] // D Maj Alto - Conclusão
    ];
    const c = chords[stageIndex % chords.length];
    this.playChord(c, 1.4, "triangle");
  }
}

const audioInstance = new DioramaAudioEngine();

export const CaraivaRealtimeWorldBuilder3D: React.FC<CaraivaRealtimeWorldBuilder3DProps> = ({
  businessName = "Ouriço Forró & Gastronomia",
  category = "restaurantes",
  customColor,
  autoPlay = true,
  onComplete,
  onSkip,
  className = "",
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stage = STAGES[currentStageIndex] || STAGES[0];
  const progressPercent = Math.min(
    100,
    Math.round(((currentStageIndex + 1) / STAGES.length) * 100)
  );

  // Manipulação de áudio
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioInstance.enabled = next;
    if (next) audioInstance.playStageSound(currentStageIndex);
  };

  // Avanço automático de estágios
  const advanceStage = useCallback(() => {
    setCurrentStageIndex((prev) => {
      const next = prev + 1;
      if (next >= STAGES.length) {
        setIsPlaying(false);
        if (onComplete) onComplete();
        return prev;
      }
      audioInstance.playStageSound(next);
      return next;
    });
  }, [onComplete]);

  // Timer do ciclo de animação
  useEffect(() => {
    if (!isPlaying) return;
    const dur = (stage.durationMs || 3000) / playbackSpeed;
    timerRef.current = setTimeout(() => {
      advanceStage();
    }, dur);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStageIndex, playbackSpeed, stage.durationMs, advanceStage]);

  // Efeito de Parallax do Mouse/Toque
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 14, y: -y * 14 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 18, y: -y * 18 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseTilt({ x: 0, y: 0 });
  };

  // Renderização de partículas douradas flutuantes no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    // Criação de partículas de ouro
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += 0.03;

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.fillStyle = `rgba(246, 201, 69, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Brilho suave
        if (p.size > 2) {
          ctx.fillStyle = `rgba(255, 244, 237, ${currentOpacity * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Cores dinâmicas de acordo com categoria
  const themeColor = customColor || CARAIVA_CATEGORY_COLORS[category] || "#F6C945";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none ${className}`}
      style={{
        backgroundColor: "#090B0C",
        borderColor: themeColor,
        perspective: "1200px",
      }}
    >
      {/* HUD HEADER SUPERIOR */}
      <div
        className="relative z-30 flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b"
        style={{
          backgroundColor: "rgba(9, 11, 12, 0.94)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(246, 201, 69, 0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center border"
            style={{
              backgroundColor: `${themeColor}1f`,
              borderColor: `${themeColor}59`,
            }}
          >
            <Building2 className="w-5 h-5" style={{ color: themeColor }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase" style={{ color: themeColor }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>CARAÍVA DIORAMA DARK LUXURY</span>
            </div>
            <h3 className="text-lg font-black tracking-tight" style={{ color: "#FFF4ED" }}>
              {businessName}
            </h3>
          </div>
        </div>

        {/* Controles de Reprodução */}
        <div className="flex items-center gap-2">
          {/* Badge Interativo 360 */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              backgroundColor: isHovered ? "rgba(246, 201, 69, 0.15)" : "rgba(255, 255, 255, 0.05)",
              borderColor: isHovered ? "rgba(246, 201, 69, 0.4)" : "rgba(255, 255, 255, 0.1)",
              color: isHovered ? "#F6C945" : "#FFF4ED",
            }}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isHovered ? "Parallax 3D Ativo" : "Arraste para explorar"}</span>
          </div>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#FFF4ED",
            }}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? "Silenciar áudio" : "Ativar áudio"}
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: soundEnabled ? "#F6C945" : "#FFF4ED",
            }}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Velocidade (1x / 2x) */}
          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
            aria-label="Ajustar velocidade"
            className="px-2.5 h-9 rounded-xl flex items-center justify-center gap-1 border font-bold text-xs transition-all hover:scale-105"
            style={{
              backgroundColor: playbackSpeed === 2 ? "rgba(246, 201, 69, 0.2)" : "rgba(255, 255, 255, 0.06)",
              borderColor: playbackSpeed === 2 ? "#F6C945" : "rgba(255, 255, 255, 0.12)",
              color: playbackSpeed === 2 ? "#F6C945" : "#FFF4ED",
            }}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{playbackSpeed}x</span>
          </button>

          {/* Pular para o Final */}
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-3.5 h-9 rounded-xl flex items-center justify-center font-bold text-xs border transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "rgba(246, 201, 69, 0.15)",
                borderColor: "rgba(246, 201, 69, 0.4)",
                color: "#F6C945",
              }}
            >
              Pular
            </button>
          )}
        </div>
      </div>

      {/* ÁREA CENTRAL DO DIORAMA FOTO-REALISTA */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 50% 30%, #141719 0%, #090B0C 100%)",
        }}
      >
        {/* Camada da Imagem HD com Transform 3D Parallax */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${mouseTilt.y}deg) rotateY(${mouseTilt.x}deg) scale(${stage.zoomScale})`,
            transformOrigin: `${stage.focalPoint.x}% ${stage.focalPoint.y}%`,
          }}
        >
          {/* Imagem Mestre do Diorama Dark Luxury */}
          <img
            src="/assets/diorama-dark-luxury.jpg"
            alt="Diorama Dark Luxury de Caraíva"
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{
              filter: `brightness(${0.85 + currentStageIndex * 0.05}) contrast(1.08) saturate(1.05)`,
            }}
          />

          {/* Holofotes de Galeria Dinâmicos (Luz Volumétrica do Teto) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{
              background: `radial-gradient(ellipse 35% 45% at 28% 10%, rgba(246, 201, 69, ${
                currentStageIndex >= 4 ? 0.35 : 0.15
              }) 0%, transparent 80%), radial-gradient(ellipse 35% 45% at 72% 10%, rgba(246, 201, 69, ${
                currentStageIndex >= 4 ? 0.35 : 0.15
              }) 0%, transparent 80%)`,
              mixBlendMode: "screen",
            }}
          />

          {/* Placa Entalhada Dinâmica Folheada a Ouro (Renderizada no Alpendre da Casa) */}
          {currentStageIndex >= 3 && (
            <div
              className="absolute pointer-events-none transition-all duration-700 ease-out"
              style={{
                top: "52%",
                left: "48%",
                transform: "translate(-50%, -50%) rotate(-1deg)",
                maxWidth: "28%",
                opacity: currentStageIndex >= 3 ? 1 : 0,
                transformOrigin: "center center",
              }}
            >
              <div
                className="px-3 py-1.5 rounded-lg border shadow-2xl text-center"
                style={{
                  backgroundColor: "rgba(18, 14, 11, 0.92)",
                  borderColor: "#F6C945",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(246, 201, 69, 0.3)",
                }}
              >
                <div
                  className="text-[7px] sm:text-[9px] uppercase tracking-widest font-serif font-semibold"
                  style={{ color: "#F6C945" }}
                >
                  • CARAÍVA • BAHIA •
                </div>
                <div
                  className="text-[10px] sm:text-xs font-serif font-black tracking-wider truncate"
                  style={{
                    color: "#FFF4ED",
                    textShadow: "0 1px 4px rgba(246, 201, 69, 0.6)",
                  }}
                >
                  {businessName.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* Brilho Dourado Interior Quente (Glow pelas Janelas) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{
              opacity: currentStageIndex >= 2 ? 1 : 0.2,
              background: "radial-gradient(circle at 50% 53%, rgba(246, 201, 69, 0.22) 0%, transparent 45%)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {/* Canvas de Poeira Dourada Flutuante */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Vinheta Dark Luxury de Galeria */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(9, 11, 12, 0.88) 100%)",
          }}
        />

        {/* Indicador de Carregamento Suave */}
        {!imageLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center z-30"
            style={{ backgroundColor: "#090B0C" }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-10 h-10 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "rgba(246, 201, 69, 0.2)",
                  borderTopColor: "#F6C945",
                }}
              />
              <span className="text-xs font-semibold" style={{ color: "#FFF4ED" }}>
                Revelando Diorama Dark Luxury...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER INFERIOR COM TIMELINE E PROGRESSO */}
      <div
        className="relative z-30 px-6 py-4 border-t"
        style={{
          backgroundColor: "rgba(9, 11, 12, 0.94)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Barra de Progresso Dourada */}
        <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-white/10 mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #F6C945 0%, #FFF4ED 100%)",
              boxShadow: "0 0 12px rgba(246, 201, 69, 0.6)",
            }}
          />
        </div>

        {/* Etapas Enumeradas */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          {STAGES.map((st, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStageIndex(idx);
                  audioInstance.playStageSound(idx);
                }}
                className={`text-left p-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "border-[#F6C945] bg-[#F6C945]/10"
                    : isDone
                    ? "border-emerald-500/30 bg-emerald-500/5 text-white/70"
                    : "border-white/5 bg-transparent text-white/40"
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span style={{ color: isCurrent ? "#F6C945" : "inherit" }}>
                      {idx + 1}.
                    </span>
                  )}
                  <span className="truncate">{st.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Frase Poética & Porcentagem */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: "#FFF4ED" }}>
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: "#F6C945" }}
            />
            <span className="font-medium italic">{stage.phrase}</span>
          </div>

          <div
            className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
            style={{
              backgroundColor: "rgba(246, 201, 69, 0.1)",
              borderColor: "rgba(246, 201, 69, 0.3)",
              color: "#F6C945",
            }}
          >
            {progressPercent}% CONCLUÍDO
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaraivaRealtimeWorldBuilder3D;
