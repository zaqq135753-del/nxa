import React, { useEffect, useState } from 'react';

export const MotionHero: React.FC = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const animationConfig = prefersReduced
    ? { opacity: 1, transform: 'none', transition: 'none' }
    : { opacity: 1, transform: 'translate3d(0, 0, 0)', transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease' };

  return (
    <section className="relative overflow-hidden py-24 bg-[#090B0C] text-center">
      <div
        style={animationConfig}
        className="max-w-4xl mx-auto px-6 will-change-transform"
      >
        <h1 className="text-5xl font-extrabold tracking-tight text-[#FFF4ED]">
          Experiência Cinematográfica
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Renderizado a 60fps constantes com respeito à redução de movimento.
        </p>
      </div>
    </section>
  );
};
