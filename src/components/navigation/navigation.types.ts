import React from "react";
import type { LucideIcon } from "lucide-react";

export interface BubbleNavItem {
  id: string;
  label: string;
  icon: LucideIcon | React.ComponentType<{ className?: string; size?: number | string }>;
  color: string; // Ex: #84cc16
  accentGlow?: string; // Ex: rgba(132, 204, 22, 0.45)
  badge?: string | number;
  path?: string;
}

export interface SpringPhysicsConfig {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

export interface BubbleNavigationProps {
  items?: BubbleNavItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string, item: BubbleNavItem) => void;
  className?: string;
  theme?: "dark" | "light";
  enableDrag?: boolean;
  showLabels?: boolean;
  showTitleHeader?: boolean;
  springConfig?: Partial<SpringPhysicsConfig>;
  hapticFeedback?: boolean;
  onNavigatePath?: (path: string) => void;
}

export interface BubbleDragState {
  isDragging: boolean;
  dragX: number;
  startX: number;
  pointerId: number | null;
}
