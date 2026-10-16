import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Star, MapPin, Sparkles, Heart } from "lucide-react";

interface CaraivaSensoryCardProps {
  title: string;
  category: string;
  tagline: string;
  imageUrl: string;
  rating?: number;
  walkingMinutes?: number;
  tideTip?: string;
  isOpenNow?: boolean;
  onExplore?: () => void;
}

export const CaraivaSensoryCard: React.FC<CaraivaSensoryCardProps> = ({
  title,
  category,
  tagline,
  imageUrl,
  rating = 4.9,
  walkingMinutes = 4,
  tideTip = "Melhor momento: maré seca às 12:30",
  isOpenNow = true,
  onExplore,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Coordenadas normalizadas do cursor (-0.5 a 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Amortecimento físico de mola suave
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 22 });

  // Rotações 3D
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Posição do feixe de luz especular (Areia Cintilante)
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCardClick = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 30, 20]);
    }
    onExplore?.();
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative w-full max-w-sm select-none"
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleCardClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden rounded-3xl bg-[#141719] border border-white/10 p-4 shadow-2xl cursor-pointer transition-shadow hover:shadow-[#F6C945]/15 hover:border-[#F6C945]/30"
      >
        {/* Camada de Imagem com Profundidade */}
        <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-zinc-900">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* Gradiente Dark Luxury */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141719] via-[#141719]/30 to-transparent" />

          {/* Badges Flutuantes com Elevação 3D */}
          <div
            style={{ transform: "translateZ(25px)" }}
            className="absolute top-3 left-3 right-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090B0C]/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-[#FFF4ED]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpenNow ? "bg-[#5F7D63] animate-pulse" : "bg-zinc-500"
                }`}
              />
              {isOpenNow ? "ABERTO AGORA" : "FECHADO"}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                  navigator.vibrate(25);
                }
              }}
              className="p-2 rounded-full bg-[#090B0C]/70 backdrop-blur-md border border-white/10 text-white transition hover:scale-110 active:scale-95"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorited
                    ? "fill-[#FF6B5B] text-[#FF6B5B]"
                    : "text-[#FFF4ED]/80"
                }`}
              />
            </button>
          </div>

          {/* Categoria e Avaliação */}
          <div
            style={{ transform: "translateZ(20px)" }}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#FFF4ED]"
          >
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#F6C945]">
              {category}
            </span>
            <div className="flex items-center gap-1 font-bold bg-[#090B0C]/80 px-2 py-0.5 rounded-lg border border-white/10">
              <Star className="w-3.5 h-3.5 text-[#F6C945] fill-[#F6C945]" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Camada de Texto e Conteúdo (Projetada para a Frente) */}
        <div style={{ transform: "translateZ(30px)" }} className="mt-3.5 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-[#FFF4ED] tracking-tight">
              {title}
            </h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#5F7D63] bg-[#5F7D63]/15 px-2 py-0.5 rounded-md border border-[#5F7D63]/30">
              <MapPin className="w-3 h-3" />
              {walkingMinutes} min a pé
            </span>
          </div>

          <p className="text-xs text-[#FFF4ED]/70 leading-relaxed line-clamp-2">
            {tagline}
          </p>

          {/* Dica Sensorial da Maré de Caraíva */}
          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#F6C945] font-medium">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#F6C945]" />
            <span className="truncate">{tideTip}</span>
          </div>
        </div>

        {/* Reflexo Especular Dinâmico (Areia Cintilante) */}
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 180px at ${gx} ${gy}, rgba(246, 201, 69, 0.18), transparent 80%)`
            ),
          }}
          className="pointer-events-none absolute inset-0 rounded-3xl"
        />
      </motion.div>
    </div>
  );
};
