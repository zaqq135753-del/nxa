import React from "react";
import { motion } from "motion/react";
import { Home, Compass, Flame, Heart } from "lucide-react";
import { CaraivaLivingOrb, type OrbState } from "./CaraivaLivingOrb";

export type NavTabId = "inicio" | "explorar" | "orb" | "agora" | "salvos";

interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ReactNode;
}

interface CaraivaLiquidTabsProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  orbState?: OrbState;
  onOrbClick?: () => void;
}

export const CaraivaLiquidTabs: React.FC<CaraivaLiquidTabsProps> = ({
  activeTab,
  onTabChange,
  orbState = "standard",
  onOrbClick,
}) => {
  const tabs: NavItem[] = [
    { id: "inicio", label: "Início", icon: <Home className="w-5 h-5" /> },
    { id: "explorar", label: "Explorar", icon: <Compass className="w-5 h-5" /> },
    { id: "orb", label: "Caraíva", icon: null }, // Posição central do Orb
    { id: "agora", label: "Agora", icon: <Flame className="w-5 h-5" /> },
    { id: "salvos", label: "Salvos", icon: <Heart className="w-5 h-5" /> },
  ];

  const handleSelect = (id: NavTabId) => {
    if (id === "orb") {
      onOrbClick?.();
      return;
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(18);
    }
    onTabChange(id);
  };

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto relative flex items-center gap-1 p-2 rounded-full bg-[#141719]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 max-w-md w-full justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.id === "orb") {
            return (
              <div key={tab.id} className="relative -top-3">
                <CaraivaLivingOrb
                  state={orbState}
                  size={52}
                  onClick={onOrbClick}
                />
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className="relative flex flex-col items-center justify-center py-2 px-3.5 rounded-full transition-colors cursor-pointer select-none text-xs"
            >
              {/* Pílula Deslizante Ativa (Liquid Sand Morph) */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/40"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <span
                className={`relative z-10 transition-transform ${
                  isActive
                    ? "text-[#F6C945] scale-110"
                    : "text-[#FFF4ED]/60 hover:text-[#FFF4ED]"
                }`}
              >
                {tab.icon}
              </span>

              <span
                className={`relative z-10 mt-1 text-[10px] font-bold tracking-tight transition-colors ${
                  isActive ? "text-[#F6C945]" : "text-[#FFF4ED]/40"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
