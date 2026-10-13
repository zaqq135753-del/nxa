"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glare?: boolean;
}

/**
 * 21st-dev 3D Interactive Tilt Card.
 * Reage à posição do cursor com rotação em perspectiva 3D, reflexo e profundidade em camadas.
 */
export function Card3D({
  children,
  className,
  depth = 12,
  glare = true,
  ...props
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${depth}deg`, `-${depth}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${depth}deg`, `${depth}deg`]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative transition-transform"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl transition-shadow duration-300",
          isHovered ? "shadow-2xl shadow-coral-500/10" : "shadow-md",
          className
        )}
        {...(props as any)}
      >
        {children}

        {/* 3D Glare Reflection Effect */}
        {glare && (
          <motion.div
            style={{
              left: glareX,
              top: glareY,
              opacity: isHovered ? 0.15 : 0,
            }}
            className="pointer-events-none absolute -inset-20 rounded-full bg-gradient-to-r from-transparent via-white to-transparent blur-xl transition-opacity duration-300"
          />
        )}
      </motion.div>
    </div>
  );
}
