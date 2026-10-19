import { House, UserRound, MessageCircle, Camera, SlidersHorizontal, Home, Compass, Sparkles, Map, Heart } from "lucide-react";
import type { BubbleNavItem, SpringPhysicsConfig } from "./navigation.types";

/**
 * Configuração Inicial Exigida na Especificação
 */
export const DEFAULT_BUBBLE_NAV_ITEMS: BubbleNavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: House,
    color: "#84CC16", // Lime
    accentGlow: "rgba(132, 204, 22, 0.55)",
    path: "/",
  },
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
    color: "#06B6D4", // Cyan
    accentGlow: "rgba(6, 182, 212, 0.55)",
    path: "/profile",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    color: "#F97316", // Orange
    accentGlow: "rgba(249, 115, 22, 0.55)",
    path: "/messages",
    badge: 3,
  },
  {
    id: "media",
    label: "Media",
    icon: Camera,
    color: "#8B5CF6", // Violet
    accentGlow: "rgba(139, 92, 246, 0.55)",
    path: "/media",
  },
  {
    id: "settings",
    label: "Settings",
    icon: SlidersHorizontal,
    color: "#EC4899", // Pink
    accentGlow: "rgba(236, 72, 153, 0.55)",
    path: "/settings",
  },
];

/**
 * Preset Específico para o Ecossistema Caraíva Digital
 */
export const CARAIVA_ECOSYSTEM_NAV_ITEMS: BubbleNavItem[] = [
  {
    id: "inicio",
    label: "Início",
    icon: Home,
    color: "#F6C945", // Dourado Caraíva
    accentGlow: "rgba(246, 201, 69, 0.55)",
    path: "/guia",
  },
  {
    id: "explorar",
    label: "Explorar",
    icon: Compass,
    color: "#38BDF8", // Ciano Maré
    accentGlow: "rgba(56, 189, 248, 0.55)",
    path: "/guia?tab=explorar",
  },
  {
    id: "concierge",
    label: "Guia IA",
    icon: Sparkles,
    color: "#4EEDB2", // Menta Neon
    accentGlow: "rgba(78, 237, 178, 0.55)",
    path: "/guia?tab=concierge",
  },
  {
    id: "mapa",
    label: "Mapa 3D",
    icon: Map,
    color: "#F59E0B", // Âmbar Lampião
    accentGlow: "rgba(245, 158, 11, 0.55)",
    path: "/guia?tab=mapa",
  },
  {
    id: "salvos",
    label: "Salvos",
    icon: Heart,
    color: "#FB7185", // Rosa Pôr do Sol
    accentGlow: "rgba(251, 113, 133, 0.55)",
    path: "/guia?tab=salvos",
  },
];

/**
 * Física de Mola Padrão da Especificação
 */
export const DEFAULT_SPRING_CONFIG: SpringPhysicsConfig = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};
