"use client";
import confetti from "canvas-confetti";

/**
 * 21st-dev Confetti Celebration Burst.
 * Dispara confetes coloridos nos tons de Caraíva (Coral, Areia, Mata, Ouro) após pagamento Pix.
 */
export function triggerConfetti() {
  if (typeof window === "undefined") return;

  const count = 180;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#F08A5D", "#2A6F51", "#3BA7B8", "#FBF8F2", "#FBBF24"],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
