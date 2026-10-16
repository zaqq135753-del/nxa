import React from "react";
import { motion } from "motion/react";

export type OrbState = "standard" | "live" | "thinking" | "pin" | "nfc";

interface CaraivaLivingOrbProps {
  state?: OrbState;
  size?: number;
  onClick?: () => void;
  showStatusLabel?: boolean;
}

export const CaraivaLivingOrb: React.FC<CaraivaLivingOrbProps> = ({
  state = "standard",
  size = 56,
  onClick,
  showStatusLabel = false,
}) => {
  const handleClick = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 20]);
    }
    onClick?.();
  };

  const getStateDetails = () => {
    switch (state) {
      case "live":
        return {
          color: "#FF6B5B",
          glow: "rgba(255, 107, 91, 0.45)",
          label: "AO VIVO",
          sub: "Forró ou Maré Agora",
        };
      case "thinking":
        return {
          color: "#F6C945",
          glow: "rgba(246, 201, 69, 0.45)",
          label: "CONCIERGE IA",
          sub: "Descobrindo Caraíva",
        };
      case "pin":
        return {
          color: "#5F7D63",
          glow: "rgba(95, 125, 99, 0.45)",
          label: "MAPA",
          sub: "Ponto na Areia",
        };
      case "nfc":
        return {
          color: "#F6C945",
          glow: "rgba(246, 201, 69, 0.55)",
          label: "NFC / QR",
          sub: "Mesa Conectada",
        };
      case "standard":
      default:
        return {
          color: "#5F7D63",
          glow: "rgba(95, 125, 99, 0.35)",
          label: "CARAÍVA ORB",
          sub: "Guia Conectado",
        };
    }
  };

  const details = getStateDetails();

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 25px ${details.glow}`,
        }}
        className="relative rounded-full cursor-pointer flex items-center justify-center p-0.5 bg-[#090B0C] border border-white/10"
      >
        {/* Anel Externo Concéntrico Rotativo */}
        <motion.div
          animate={{
            rotate: state === "thinking" ? 360 : 0,
            scale: state === "live" || state === "nfc" ? [1, 1.25, 1] : 1,
            opacity: state === "live" || state === "nfc" ? [0.6, 0.1, 0.6] : 0.3,
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 2.5, ease: "linear" },
            scale: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
            opacity: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
          }}
          style={{ borderColor: details.color }}
          className="absolute inset-[-6px] rounded-full border-2 border-dashed pointer-events-none"
        />

        {/* Segundo Anel Expansivo (Modo NFC / QR) */}
        {state === "nfc" && (
          <motion.div
            animate={{ scale: [1, 1.5, 1.8], opacity: [0.8, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
            style={{ borderColor: "#F6C945" }}
            className="absolute inset-[-12px] rounded-full border pointer-events-none"
          />
        )}

        {/* Núcleo do Sol e Onda de Caraíva */}
        <div
          style={{
            background: `radial-gradient(circle at 35% 35%, #FFF2A3 0%, ${details.color} 65%, #141719 100%)`,
          }}
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden shadow-inner"
        >
          {/* Símbolo Vetorial Orgânico */}
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <path
              d="M 10,65 Q 40,45 65,60 T 95,50 L 100,100 L 0,100 Z"
              fill="#090B0C"
            />
            <path
              d="M 15,75 Q 45,62 70,72 T 90,66"
              stroke="#FFF4ED"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        </div>
      </motion.div>

      {showStatusLabel && (
        <div className="text-center">
          <span
            style={{ color: details.color }}
            className="text-[10px] font-black tracking-widest uppercase block"
          >
            {details.label}
          </span>
          <span className="text-[10px] text-[#FFF4ED]/60 font-medium">
            {details.sub}
          </span>
        </div>
      )}
    </div>
  );
};
