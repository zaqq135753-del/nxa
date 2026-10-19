import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { BubbleNavItem, SpringPhysicsConfig } from "./navigation.types";
import { DEFAULT_SPRING_CONFIG } from "./navigation.config";

interface BubbleIndicatorProps {
  items: BubbleNavItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  railRef: React.RefObject<HTMLDivElement | null>;
  enableDrag?: boolean;
  springConfig?: Partial<SpringPhysicsConfig>;
  hapticFeedback?: boolean;
}

export const BubbleIndicator: React.FC<BubbleIndicatorProps> = ({
  items,
  activeIndex,
  onSelectIndex,
  railRef,
  enableDrag = true,
  springConfig = DEFAULT_SPRING_CONFIG,
  hapticFeedback = true,
}) => {
  const currentActiveItem = items[activeIndex] || items[0];
  const mergedSpring: SpringPhysicsConfig = {
    ...DEFAULT_SPRING_CONFIG,
    ...springConfig,
  };

  // Coordenadas calculadas dos centros dos botões
  const [centers, setCenters] = useState<number[]>([]);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartCenterXRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);

  // Motion values para posição contínua e física elástica
  const targetX = useMotionValue(0);
  const smoothX = useSpring(targetX, {
    stiffness: mergedSpring.stiffness,
    damping: mergedSpring.damping,
    mass: mergedSpring.mass,
  });

  const [activeColor, setActiveColor] = useState(currentActiveItem.color);
  const [activeGlow, setActiveGlow] = useState(
    currentActiveItem.accentGlow || `${currentActiveItem.color}88`
  );

  // Calcula a posição central de cada item no trilho
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

    // Reposiciona o targetX se não estiver arrastando
    if (!isDraggingRef.current && calculated[activeIndex] !== undefined) {
      targetX.set(calculated[activeIndex]);
    }
  }, [activeIndex, railRef, targetX]);

  // Recalcula ao montar e no resize
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

  // Quando activeIndex muda externamente, move a mola para o novo centro
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

  // Disparo de haptic feedback seguro
  const triggerHaptic = useCallback(
    (intensity: number = 8) => {
      if (!hapticFeedback) return;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(intensity);
        } catch {
          /* Ignora restrições do navegador */
        }
      }
    },
    [hapticFeedback]
  );

  // -----------------------------------------------------------------
  // POINTER EVENTS: Interação por Arraste
  // -----------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag) return;
    if (centers.length === 0) return;

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartCenterXRef.current = targetX.get();
    activePointerIdRef.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* Ignora fallback */
    }

    triggerHaptic(12);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || centers.length === 0) return;

    const deltaX = e.clientX - dragStartXRef.current;
    let newX = dragStartCenterXRef.current + deltaX;

    // Limites de Clamping dentro do trilho (centro do primeiro ao último item)
    const minX = centers[0];
    const maxX = centers[centers.length - 1];
    const clampedX = Math.max(minX, Math.min(maxX, newX));

    // Atualiza o targetX diretamente para acompanhar o dedo/mouse
    targetX.set(clampedX);

    // Pré-visualização da cor e glow do item mais próximo durante o arraste
    const closestIdx = getClosestIndex(clampedX);
    const closestItem = items[closestIdx];
    if (closestItem && closestItem.color !== activeColor) {
      setActiveColor(closestItem.color);
      setActiveGlow(closestItem.accentGlow || `${closestItem.color}88`);
      triggerHaptic(6);
    }
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>, shouldCommit: boolean) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (activePointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(activePointerIdRef.current);
      } catch {
        /* Ignora */
      }
      activePointerIdRef.current = null;
    }

    if (centers.length === 0) return;

    if (shouldCommit) {
      const currentPos = targetX.get();
      const closestIdx = getClosestIndex(currentPos);
      const snapX = centers[closestIdx];

      // Snap suave para o centro da aba mais próxima
      targetX.set(snapX);
      const selectedItem = items[closestIdx];
      if (selectedItem) {
        setActiveColor(selectedItem.color);
        setActiveGlow(selectedItem.accentGlow || `${selectedItem.color}88`);
      }

      triggerHaptic(15);
      if (closestIdx !== activeIndex) {
        onSelectIndex(closestIdx);
      }
    } else {
      // Reverte para o centro do item ativo anterior
      const fallbackX = centers[activeIndex];
      targetX.set(fallbackX);
      const originalItem = items[activeIndex];
      if (originalItem) {
        setActiveColor(originalItem.color);
        setActiveGlow(originalItem.accentGlow || `${originalItem.color}88`);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e, true);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e, false);
  };

  return (
    <>
      {/* 1. Iluminação Dinâmica Glow de Fundo (Acompanha a posição X da bolha) */}
      <motion.div
        className="sbn-glow-halo"
        style={{
          x: smoothX,
          // Variáveis CSS para interpolação suave de cor
          ["--bubble-glow-color" as string]: activeGlow,
        }}
      />

      {/* 2. Bolha Deslizante Circular com Reflexo e Suporte a Pointer Events */}
      <motion.div
        className="sbn-bubble-indicator"
        role="presentation"
        aria-hidden="true"
        style={{
          x: smoothX,
          ["--bubble-color" as string]: activeColor,
          ["--bubble-glow-color" as string]: activeGlow,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Superfície da Bolha */}
        <div className="sbn-bubble-surface" />

        {/* Anel de Pulso Suave */}
        <div className="sbn-bubble-ring" />
      </motion.div>
    </>
  );
};
