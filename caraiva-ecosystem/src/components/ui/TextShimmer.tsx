"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

/**
 * 21st-dev Text Shimmer.
 * Onda de brilho luminoso contínua passando sobre o texto em gradiente.
 */
export function TextShimmer({
  children,
  as: Component = "span",
  className,
  duration = 2.4,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  const MotionComponent = motion(Component as any);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
        "text-transparent [--base-color:#D6BE92] [--base-gradient-color:#ffffff]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        className,
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}
