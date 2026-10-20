import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Cursor Magnético Líquido + Motor Global de Tilt 3D para Cards (United Carriers Style)
 * - Segue o ponteiro a 120 FPS com interpolação GSAP quickSetter
 * - Anel SVG que preenche conforme o progresso de scroll da página
 * - Injeção automática de Tilt 3D físico e reflexo especular dourado em todos os cards
 */
export const CaraivaMagneticCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detecta se é dispositivo exclusivamente touch para não exibir cursor fantasma no celular
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (hasCoarsePointer) {
      setIsTouchDevice(true);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const progressCircle = progressCircleRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !progressCircle) return;

    const circumference = 2 * Math.PI * 22; // r = 22 -> ~138.23
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;

    // Posições reais e interpoladas (Lerp físico)
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isHoveringInteractive = false;
    let isHoveringCard = false;
    let activeCardEl: HTMLElement | null = null;

    // GSAP quickSetter para zero Garbage Collection a 120 FPS
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      const offset = circumference - progress * circumference;
      progressCircle.style.strokeDashoffset = `${offset}`;
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      setDotX(mouse.x);
      setDotY(mouse.y);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Verifica se está sobre um card 3D para aplicar Tilt Físico em Tempo Real
      const card = target.closest(
        ".cd-card-3d, .cv-explore-place, [data-cv-depth='true']"
      ) as HTMLElement | null;

      if (card) {
        if (activeCardEl && activeCardEl !== card) {
          activeCardEl.style.transform = "";
        }
        activeCardEl = card;
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        const rotateY = (relX - 0.5) * 10; // -5deg a +5deg
        const rotateX = (0.5 - relY) * 8; // -4deg a +4deg

        card.style.transition = "transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
        card.style.setProperty("--cursor-x", `${(relX * 100).toFixed(1)}%`);
        card.style.setProperty("--cursor-y", `${(relY * 100).toFixed(1)}%`);

        if (!isHoveringCard) {
          isHoveringCard = true;
          gsap.to(ring, {
            scale: 1.55,
            backgroundColor: "rgba(246, 201, 69, 0.14)",
            borderColor: "rgba(246, 201, 69, 0.65)",
            duration: 0.3,
            ease: "power3.out",
          });
          if (label) {
            label.style.opacity = "1";
          }
        }
      } else {
        if (activeCardEl) {
          activeCardEl.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
          activeCardEl.style.transform = "";
          activeCardEl = null;
        }
        if (isHoveringCard) {
          isHoveringCard = false;
          if (label) {
            label.style.opacity = "0";
          }
        }

        // 2. Verifica se está sobre botão ou link comum
        const interactive = target.closest("button, a, [role='button'], input, select");
        if (interactive && !isHoveringInteractive) {
          isHoveringInteractive = true;
          gsap.to(ring, {
            scale: 1.3,
            backgroundColor: "rgba(246, 201, 69, 0.1)",
            borderColor: "rgba(246, 201, 69, 0.8)",
            duration: 0.25,
            ease: "power2.out",
          });
          gsap.to(dot, { scale: 0.5, duration: 0.2 });
        } else if (!interactive && (isHoveringInteractive || !isHoveringCard)) {
          isHoveringInteractive = false;
          gsap.to(ring, {
            scale: 1,
            backgroundColor: "rgba(246, 201, 69, 0.03)",
            borderColor: "rgba(246, 201, 69, 0.32)",
            duration: 0.3,
            ease: "power3.out",
          });
          gsap.to(dot, { scale: 1, duration: 0.25 });
        }
      }
    };

    // Ticker de física inercial acoplado ao GSAP (mesma arquitetura do United Carriers)
    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      setRingX(ringPos.x);
      setRingY(ringPos.y);
    };

    gsap.ticker.add(tick);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", updateScrollProgress);
      if (activeCardEl) {
        activeCardEl.style.transform = "";
      }
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none hidden sm:block">
      {/* Ponto Central Dourado */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full bg-[#F6C945] shadow-[0_0_12px_#F6C945] will-change-transform"
      />

      {/* Anel Magnético com Medidor de Progresso de Scroll */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-6 -mt-6 w-12 h-12 rounded-full border border-[#F6C945]/35 bg-[#F6C945]/[0.03] backdrop-blur-[1px] flex items-center justify-center will-change-transform"
      >
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="rgba(246, 201, 69, 0.12)"
            strokeWidth="1.5"
          />
          <circle
            ref={progressCircleRef}
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="#F6C945"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span
          ref={labelRef}
          className="absolute text-[6px] font-black tracking-widest uppercase text-[#F6C945] opacity-0 transition-opacity duration-200"
        >
          VER
        </span>
      </div>
    </div>
  );
};
