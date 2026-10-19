import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { BubbleNavigationProps } from "./navigation.types";
import { DEFAULT_BUBBLE_NAV_ITEMS, DEFAULT_SPRING_CONFIG } from "./navigation.config";
import { NavigationItem } from "./NavigationItem";
import { BubbleIndicator } from "./BubbleIndicator";
import "./bubble-navigation.css";

export const BubbleNavigation: React.FC<BubbleNavigationProps> = ({
  items = DEFAULT_BUBBLE_NAV_ITEMS,
  activeId,
  defaultActiveId,
  onChange,
  className = "",
  theme = "dark",
  enableDrag = true,
  showLabels = false,
  showTitleHeader = true,
  springConfig = DEFAULT_SPRING_CONFIG,
  hapticFeedback = true,
  onNavigatePath,
}) => {
  // Estado interno para suportar modo controlado e não-controlado
  const [internalActiveId, setInternalActiveId] = useState<string>(() => {
    return activeId || defaultActiveId || (items[0]?.id ?? "home");
  });

  const currentActiveId = activeId !== undefined ? activeId : internalActiveId;

  // Garante que o ID atual exista na lista de itens
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === currentActiveId)
  );
  const currentItem = items[activeIndex] || items[0];

  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Disparo de haptic feedback
  const triggerHaptic = useCallback(
    (ms: number = 8) => {
      if (!hapticFeedback) return;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(ms);
        } catch {
          /* Ignora */
        }
      }
    },
    [hapticFeedback]
  );

  // Manipulador de Seleção (por clique ou snap do arraste)
  const handleSelect = useCallback(
    (index: number) => {
      const selectedItem = items[index];
      if (!selectedItem) return;

      triggerHaptic(10);

      if (selectedItem.id !== currentActiveId) {
        if (activeId === undefined) {
          setInternalActiveId(selectedItem.id);
        }
        onChange?.(selectedItem.id, selectedItem);

        if (selectedItem.path && onNavigatePath) {
          onNavigatePath(selectedItem.path);
        }
      }
    },
    [items, currentActiveId, activeId, onChange, onNavigatePath, triggerHaptic]
  );

  // Navegação Acessível por Teclado (Tabs Pattern - WAI-ARIA)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let targetIndex: number | null = null;

    switch (e.key) {
      case "ArrowRight":
        targetIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowLeft":
        targetIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case "Home":
        targetIndex = 0;
        break;
      case "End":
        targetIndex = items.length - 1;
        break;
      default:
        break;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      handleSelect(targetIndex);
      // Move o foco para o novo botão selecionado
      itemRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div
      className={`sbn-wrapper ${theme === "light" ? "sbn-theme-light" : "sbn-theme-dark"} ${className}`}
      data-testid="bubble-navigation"
    >
      {/* 1. Título Dinâmico Superior com Transição Suave */}
      {showTitleHeader && currentItem && (
        <header className="sbn-title-header" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentItem.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="sbn-title-text"
              style={{ color: currentItem.color }}
            >
              {currentItem.label}
            </motion.span>
          </AnimatePresence>
        </header>
      )}

      {/* 2. Barra Flutuante com Cantos Arredondados e Fundo Escuro */}
      <nav
        className="sbn-bar"
        role="tablist"
        aria-label="Navegação com bolha deslizante"
      >
        <div ref={railRef} className="sbn-rail">
          {/* Indicador de Bolha Deslizante e Iluminação Glow */}
          <BubbleIndicator
            items={items}
            activeIndex={activeIndex}
            onSelectIndex={handleSelect}
            railRef={railRef}
            enableDrag={enableDrag}
            springConfig={springConfig}
            hapticFeedback={hapticFeedback}
          />

          {/* Lista Uniforme de 5 Ícones */}
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <NavigationItem
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                item={item}
                index={index}
                isActive={isActive}
                onClick={() => handleSelect(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                showLabel={showLabels}
              />
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BubbleNavigation;
