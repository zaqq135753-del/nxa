import React, { useState } from "react";
import { motion } from "motion/react";
import { Waves, Sparkles, Clock } from "lucide-react";

export const CaraivaTideScrubber: React.FC = () => {
  // Hora atual simulada ou selecionada (0 a 24)
  const [selectedHour, setSelectedHour] = useState<number>(12.5);

  // Curva senoidal da maré de Caraíva para as 24h (Pico de baixa às 06h e 18h, alta às 12h e 00h)
  const calculateTideHeight = (hour: number) => {
    // Varia entre 0.2m e 1.9m
    const cycle = Math.sin(((hour - 3) / 12) * Math.PI * 2);
    return 1.05 + cycle * 0.85;
  };

  const currentHeight = calculateTideHeight(selectedHour);

  const getTideRecommendation = (height: number) => {
    if (height <= 0.6) {
      return {
        badge: "MARÉ BAIXA (PISCINAS NATURAIS)",
        color: "#5F7D63",
        text: "Momento perfeito para caminhar até a Ponta do Corumbau ou curtir as piscinas naturais da Praia do Satu.",
      };
    }
    if (height >= 1.4) {
      return {
        badge: "MARÉ CHEIA (ÁGUA NO RIO)",
        color: "#F6C945",
        text: "Visual cinematográfico na beira do rio. Ótimo momento para banho calmo e apreciar o pôr do sol nas canoas.",
      };
    }
    return {
      badge: "MARÉ INTERMEDIÁRIA",
      color: "#FFF4ED",
      text: "Ideal para travessia de canoa, caiaque no mangue e caminhadas tranquilas pela areia batida.",
    };
  };

  const recommendation = getTideRecommendation(currentHeight);

  const formatHour = (val: number) => {
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSelectedHour(val);

    // Haptic sutil ao atingir extremos de maré
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (Math.abs(val - 6) < 0.2 || Math.abs(val - 12) < 0.2 || Math.abs(val - 18) < 0.2) {
        navigator.vibrate(10);
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-[#141719] border border-white/10 p-5 shadow-2xl space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#5F7D63]/20 border border-[#5F7D63]/40 text-[#5F7D63]">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#FFF4ED] tracking-wide uppercase">
              Tábua de Marés Viva
            </h3>
            <span className="text-[11px] text-[#FFF4ED]/60">
              O pulso do Rio e do Mar em Caraíva
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-mono font-black text-[#F6C945]">
            {currentHeight.toFixed(2)}m
          </div>
          <span className="text-[10px] text-[#FFF4ED]/50 uppercase tracking-widest">
            Nível d'água
          </span>
        </div>
      </div>

      {/* Gráfico da Curva Senoidal com Nível de Água Dinâmico */}
      <div className="relative h-28 w-full rounded-2xl bg-[#090B0C] border border-white/5 overflow-hidden flex items-end">
        {/* Curva de Maré em SVG */}
        <svg
          viewBox="0 0 240 100"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,50 Q 30,10 60,50 T 120,50 T 180,50 T 240,50 L 240,100 L 0,100 Z"
            fill="rgba(95, 125, 99, 0.2)"
          />
          <path
            d="M 0,50 Q 30,10 60,50 T 120,50 T 180,50 T 240,50"
            fill="none"
            stroke="#5F7D63"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Marcador Vertical da Hora Selecionada */}
        <div
          style={{ left: `${(selectedHour / 24) * 100}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-[#F6C945] shadow-[0_0_12px_#F6C945] z-10 transition-all pointer-events-none"
        >
          <div className="absolute top-1 -left-5 px-1.5 py-0.5 rounded bg-[#F6C945] text-[#090B0C] text-[9px] font-mono font-bold">
            {formatHour(selectedHour)}
          </div>
        </div>

        {/* Camada de Água Flutuante */}
        <motion.div
          animate={{ height: `${((currentHeight - 0.2) / 1.7) * 75 + 15}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 25 }}
          className="w-full bg-gradient-to-t from-[#5F7D63]/40 via-[#5F7D63]/20 to-[#F6C945]/15 border-t border-[#F6C945]/40"
        />
      </div>

      {/* Controle Deslizante de 24h (Scrubber) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] font-mono text-[#FFF4ED]/60">
          <span>00:00 (Madrugada)</span>
          <span className="font-bold text-[#F6C945] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatHour(selectedHour)}
          </span>
          <span>23:59 (Noite)</span>
        </div>

        <input
          type="range"
          min="0"
          max="23.9"
          step="0.1"
          value={selectedHour}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-lg bg-zinc-800 accent-[#F6C945] cursor-pointer"
        />
      </div>

      {/* Caixa de Recomendação IA Contextual */}
      <div className="p-3.5 rounded-2xl bg-[#090B0C]/80 border border-white/10 space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F6C945]" />
          <span
            style={{ color: recommendation.color }}
            className="text-[10px] font-black tracking-wider uppercase"
          >
            {recommendation.badge}
          </span>
        </div>
        <p className="text-xs text-[#FFF4ED]/80 leading-relaxed">
          {recommendation.text}
        </p>
      </div>
    </div>
  );
};
