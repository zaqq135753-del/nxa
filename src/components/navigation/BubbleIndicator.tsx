import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import type { BubbleNavItem, SpringPhysicsConfig } from "./navigation.types";
import { DEFAULT_BUBBLE_NAV_ITEMS, DEFAULT_SPRING_CONFIG } from "./navigation.config";

export interface BubbleIndicatorProps {
  items: BubbleNavItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  railRef: React.RefObject<HTMLDivElement | null>;
  enableDrag?: boolean;
  springConfig?: Partial<SpringPhysicsConfig>;
  hapticFeedback?: boolean;
}

export const BubbleIndicator: React.FC<BubbleIndicatorProps> = ({
  items = DEFAULT_BUBBLE_NAV_ITEMS,
  activeIndex,
  onSelectIndex,
  railRef,
  enableDrag = true,
  springConfig = DEFAULT_SPRING_CONFIG,
  hapticFeedback = true,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const currentActiveItem = items[activeIndex] || items[0] || DEFAULT_BUBBLE_NAV_ITEMS[0];
  const mergedSpring: SpringPhysicsConfig = {
    ...DEFAULT_SPRING_CONFIG,
    ...springConfig,
    ...(prefersReducedMotion ? { stiffness: 1000, damping: 100 } : {}),
  };

  // Coordenadas centrais (em px) de cada aba no trilho
  const [centers, setCenters] = useState<number[]>([]);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartCenterXRef = useRef(0);
  const hasMovedSignificantlyRef = useRef(false);
  const isFirstMeasurementRef = useRef(true);

  // Motion value contínuo que representa a posição central X
  const targetX = useMotionValue(0);
  const smoothX = useSpring(targetX, {
    stiffness: mergedSpring.stiffness,
    damping: mergedSpring.damping,
    mass: mergedSpring.mass,
  });

  // Alinhamento exato: compensa o raio da bolha (23px) e do halo (45px) sem conflito de transform CSS
  const bubbleX = useTransform(smoothX, (val) => val - 23);
  const haloX = useTransform(smoothX, (val) => val - 45);

  const [activeColor, setActiveColor] = useState(currentActiveItem.color);
  const [activeGlow, setActiveGlow] = useState(
    currentActiveItem.accentGlow || `${currentActiveItem.color}88`
  );

  // Calcula a posição central de cada botão no trilho
  const updateCenters = useCallback(() => {
    if (!railRef.current) return;
    const rail = railRef.current;
    const railRect = rail.getBoundingClientRect();
    const itemElements = rail.querySelectorAll<HTMLButtonElement>(".sbn-item");

    if (itemElements.length === 0) return;

    const calculated: number[] = [];
    itemElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const center = rect.left - railRect.left + rect.width / 2;
      calculated.push(center);
    });

    setCenters(calculated);

    // Na primeira medição, dá jump instantâneo para evitar voo inicial da bolha desde o pixel 0
    if (isFirstMeasurementRef.current && calculated[activeIndex] !== undefined) {
      targetX.set(calculated[activeIndex]);
      smoothX.jump(calculated[activeIndex]);
      isFirstMeasurementRef.current = false;
    }
  }, [railRef, targetX, smoothX, activeIndex]);

  // Observer de redimensionamento e montagem
  useEffect(() => {
    updateCenters();
    window.addEventListener("resize", updateCenters);
    const observer = new ResizeObserver(() => updateCenters());
    if (railRef.current) {
      observer.observe(railRef.current);
    }
    return () => {
      window.removeEventListener("resize", updateCenters);
      observer.disconnect();
    };
  }, [updateCenters, railRef]);

  // Atualiza posição e cores quando activeIndex mudar externamente
  useEffect(() => {
    if (!isDraggingRef.current && centers[activeIndex] !== undefined) {
      targetX.set(centers[activeIndex]);
      const item = items[activeIndex];
      if (item) {
        setActiveColor(item.color);
        setActiveGlow(item.accentGlow || `${item.color}88`);
      }
    }
  }, [activeIndex, centers, items, targetX]);

  // Encontra o índice mais próximo de uma coordenada X
  const getClosestIndex = useCallback(
    (currentX: number): number => {
      if (centers.length === 0) return activeIndex;
      let minDistance = Infinity;
      let closest = activeIndex;

      centers.forEach((center, idx) => {
        const distance = Math.abs(currentX - center);
        if (distance < minDistance) {
          minDistance = distance;
          closest = idx;
        }
      });
      return closest;
    },
    [centers, activeIndex]
  );

  // Disparo de haptic feedback
  const triggerHaptic = useCallback(
    (intensity: number = 8) => {
      if (!hapticFeedback) return;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(intensity);
        } catch {
          /* Ignora */
        }
      }
    },
    [hapticFeedback]
  );

  // -----------------------------------------------------------------
  // POINTER EVENTS & GESTO DE ARRASTE + CLIQUE DIRETO
  // -----------------------------------------------------------------
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !enableDrag) return;

    const onPointerDown = (e: PointerEvent) => {
      if (centers.length === 0) return;
      isDraggingRef.current = true;
      hasMovedSignificantlyRef.current = false;
      dragStartXRef.current = e.clientX;
      dragStartCenterXRef.current = targetX.get();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || centers.length === 0) return;

      const deltaX = e.clientX - dragStartXRef.current;
      if (!hasMovedSignificantlyRef.current && Math.abs(deltaX) > 6) {
        hasMovedSignificantlyRef.current = true;
        try {
          rail.setPointerCapture(e.pointerId);
        } catch {
          /* Ignora */
        }
      }

      if (!hasMovedSignificantlyRef.current) return;

      const newX = dragStartCenterXRef.current + deltaX;
      // Clamping rigoroso dentro dos limites do primeiro e último centro
      const minX = centers[0];
      const maxX = centers[centers.length - 1];
      const clampedX = Math.max(minX, Math.min(maxX, newX));

      targetX.set(clampedX);

      // Prévia dinâmica de cor e glow da aba mais próxima durante o movimento
      const closestIdx = getClosestIndex(clampedX);
      const closestItem = items[closestIdx];
      if (closestItem && closestItem.color !== activeColor) {
        setActiveColor(closestItem.color);
        setActiveGlow(closestItem.accentGlow || `${closestItem.color}88`);
        triggerHaptic(6);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (hasMovedSignificantlyRef.current) {
        try {
          rail.releasePointerCapture(e.pointerId);
        } catch {
          /* Ignora */
        }
      }

      if (centers.length === 0) return;

      if (hasMovedSignificantlyRef.current) {
        const currentPos = targetX.get();
        const closestIdx = getClosestIndex(currentPos);
        const snapX = centers[closestIdx];

        targetX.set(snapX);
        const selectedItem = items[closestIdx];
        if (selectedItem) {
          setActiveColor(selectedItem.color);
          setActiveGlow(selectedItem.accentGlow || `${selectedItem.color}88`);
        }

        triggerHaptic(12);
        if (closestIdx !== activeIndex) {
          onSelectIndex(closestIdx);
        }
      } else {
        // Clique ou toque rápido em qualquer ponto da barra: seleciona a aba clicada imediatamente
        const railRect = rail.getBoundingClientRect();
        const tapX = e.clientX - railRect.left;
        const tappedIdx = getClosestIndex(tapX);
        const snapX = centers[tappedIdx];
        if (typeof snapX === "number") {
          targetX.set(snapX);
        }
        const selectedItem = items[tappedIdx];
        if (selectedItem) {
          setActiveColor(selectedItem.color);
          setActiveGlow(selectedItem.accentGlow || `${selectedItem.color}88`);
        }
        triggerHaptic(10);
        if (tappedIdx !== activeIndex) {
          onSelectIndex(tappedIdx);
        }
      }
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      try {
        rail.releasePointerCapture(e.pointerId);
      } catch {
        /* Ignora */
      }
      if (centers[activeIndex] !== undefined) {
        targetX.set(centers[activeIndex]);
      }
    };

    rail.addEventListener("pointerdown", onPointerDown);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerup", onPointerUp);
    rail.addEventListener("pointercancel", onPointerCancel);

    return () => {
      rail.removeEventListener("pointerdown", onPointerDown);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerup", onPointerUp);
      rail.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [railRef, enableDrag, centers, targetX, activeIndex, items, activeColor, getClosestIndex, onSelectIndex, triggerHaptic]);

  return (
    <>
      {/* 1. Iluminação Dinâmica Halo Glow (Centralizado sem conflito de CSS transform) */}
      <motion.div
        className="sbn-glow-halo"
        style={{
          x: haloX,
          // CSS custom property tipada com segurança
          ["--bubble-glow-color" as string]: activeGlow,
        }}
      />

      {/* 2. Bolha Deslizante Circular Flutuante com Reflexo */}
      <motion.div
        className="sbn-bubble-indicator"
        role="presentation"
        aria-hidden="true"
        style={{
          x: bubbleX,
          ["--bubble-color" as string]: activeColor,
          ["--bubble-glow-color" as string]: activeGlow,
        }}
      >
        <div className="sbn-bubble-surface" />
        <div className="sbn-bubble-ring" />
      </motion.div>
    </>
  );
};
