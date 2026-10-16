import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface CaraivaHapticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass" | "outline";
  tidePulse?: "optimal" | "rising" | "none";
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const CaraivaHapticButton: React.FC<CaraivaHapticButtonProps> = ({
  children,
  variant = "primary",
  tidePulse = "none",
  icon = <ArrowRight className="w-4 h-4" />,
  onClick,
  className = "",
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled) return;

    // Dispara padrão sensorial no motor háptico do smartphone
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([12, 35, 18]); // Toque firme da madeira
    }

    onClick?.();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#F6C945] text-[#090B0C] font-extrabold shadow-lg shadow-[#F6C945]/20 hover:bg-[#fed65b]";
      case "secondary":
        return "bg-[#5F7D63] text-[#FFF4ED] font-bold shadow-md shadow-[#5F7D63]/25 hover:bg-[#6e8e72]";
      case "glass":
        return "bg-[#141719]/80 backdrop-blur-md text-[#FFF4ED] border border-white/10 hover:border-[#F6C945]/40 hover:bg-[#1c2124]";
      case "outline":
        return "bg-transparent text-[#F6C945] border-2 border-[#F6C945] hover:bg-[#F6C945]/10";
      default:
        return "bg-[#F6C945] text-[#090B0C]";
    }
  };

  const getTidePulseBorder = () => {
    if (tidePulse === "optimal") {
      return "ring-2 ring-[#5F7D63] ring-offset-2 ring-offset-[#090B0C] animate-pulse";
    }
    if (tidePulse === "rising") {
      return "ring-2 ring-[#FF6B5B] ring-offset-2 ring-offset-[#090B0C] animate-pulse";
    }
    return "";
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm transition-all select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${getTidePulseBorder()} ${className}`}
    >
      <span className="tracking-wide">{children}</span>
      {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
    </motion.button>
  );
};
