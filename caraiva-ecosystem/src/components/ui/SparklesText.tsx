"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
  };
}

const DEFAULT_SPARKLE_COLORS = ["#F08A5D", "#F4ECDD", "#3BA7B8", "#FFD700"];

function generateSparkle(colors: string[]): Sparkle {
  return {
    id: String(Math.random()),
    createdAt: Date.now(),
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.floor(Math.random() * 12 + 10),
    style: {
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
    },
  };
}

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: string[];
}

/**
 * 21st-dev SparklesText.
 * Gera partículas douradas cintilantes ao redor do texto,
 * remetendo ao céu estrelado de Caraíva sem poluição luminosa.
 */
export function SparklesText({
  children,
  className,
  sparklesCount = 6,
  colors = DEFAULT_SPARKLE_COLORS,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: sparklesCount }).map(() => generateSparkle(colors));
    setSparkles(initial);

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const next = [...prev];
        const replaceIndex = Math.floor(Math.random() * next.length);
        next[replaceIndex] = generateSparkle(colors);
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [sparklesCount, colors]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="pointer-events-none absolute z-20 block"
          style={sparkle.style}
        >
          <motion.svg
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0], rotate: [0, 90, 180], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 160 160"
            fill="none"
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.5038C118.707 75.7151 160 80 160 80C160 80 118.707 84.2849 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7151 118.707 58.5038 101.496C41.2925 84.2849 0 80 0 80C0 80 41.2925 75.7151 58.5038 58.5038C75.7151 41.2925 80 0 80 0Z"
              fill={sparkle.color}
            />
          </motion.svg>
        </span>
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
