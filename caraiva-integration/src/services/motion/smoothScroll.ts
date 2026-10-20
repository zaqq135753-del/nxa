import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let lenisInstance: Lenis | null = null;
let gsapTickerCallback: ((time: number) => void) | null = null;

export interface SmoothScrollOptions {
  duration?: number;
  smoothWheel?: boolean;
  syncGSAP?: boolean;
}

/**
 * Motor de Rolagem Aveludada Inercial + Momentum Elástico (Lenis + GSAP Ticker)
 * Arquitetura inspirada no United Carriers:
 * - Inércia pronunciada (duration 1.55s)
 * - Deformação elástica sutil proporcional à velocidade do scroll
 */
export function initCaraivaSmoothScroll(options?: SmoothScrollOptions): Lenis | null {
  if (typeof window === "undefined") return null;

  if (lenisInstance) return lenisInstance;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return null;

  try {
    const lenis = new Lenis({
      duration: options?.duration ?? 1.55,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: options?.smoothWheel ?? true,
      touchMultiplier: 1.45,
      wheelMultiplier: 1.25,
      autoResize: true,
    });

    lenisInstance = lenis;

    // Aplica momentum físico sutil nos cards conforme a velocidade da rolagem
    lenis.on("scroll", (e: { velocity: number; scroll: number; progress: number }) => {
      ScrollTrigger.update();

      const clampedSkew = Math.max(-2.2, Math.min(2.2, e.velocity * 0.045));
      const clampedShift = Math.max(-10, Math.min(10, e.velocity * 0.18));
      document.documentElement.style.setProperty("--cv-scroll-skew", `${clampedSkew.toFixed(2)}deg`);
      document.documentElement.style.setProperty("--cv-scroll-shift", `${clampedShift.toFixed(1)}px`);
    });

    // Unificação no Ticker do GSAP a 120fps
    gsapTickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTickerCallback);
    gsap.ticker.lagSmoothing(0);

    return lenis;
  } catch (err) {
    console.warn("[CaraivaSmoothScroll] Não foi possível ativar Lenis:", err);
    return null;
  }
}

export function getCaraivaSmoothScroll(): Lenis | null {
  return lenisInstance;
}

export function destroyCaraivaSmoothScroll(): void {
  if (gsapTickerCallback) {
    gsap.ticker.remove(gsapTickerCallback);
    gsapTickerCallback = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
