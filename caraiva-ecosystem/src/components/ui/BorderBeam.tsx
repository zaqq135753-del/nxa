"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

/**
 * 21st-dev Animated Border Beam.
 * Um feixe de luz neon que viaja suavemente pelas bordas do card,
 * conferindo uma estética ultra tecnológica estilo Linear / Vercel.
 */
export function BorderBeam({
  className,
  size = 200,
  duration = 14,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#F08A5D", // Coral de Caraíva
  colorTo = "#3BA7B8",   // Rio de Caraíva
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          ["--size" as any]: `${size}px`,
          ["--duration" as any]: `${duration}s`,
          ["--anchor" as any]: `${anchor}%`,
          ["--border-width" as any]: `${borderWidth}px`,
          ["--color-from" as any]: colorFrom,
          ["--color-to" as any]: colorTo,
          ["--delay" as any]: `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        // Mask to clip only to the border
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        // The moving gradient beam
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className
      )}
    />
  );
}
