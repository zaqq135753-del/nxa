"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: number; // em segundos
  gap?: string;
}

/**
 * 21st-dev Infinite Running Marquee.
 * Permite que cards, marcas e produtos corram suavemente pela tela de forma infinita,
 * com pausa ao passar o mouse ou tocar, e gradientes de fade nas extremidades.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  duration = 35,
  gap = "1rem",
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={{
        ["--duration" as any]: `${duration}s`,
        ["--gap" as any]: gap,
      }}
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] select-none",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
            "animate-marquee flex-row": !vertical && !reverse,
            "animate-marquee-reverse flex-row": !vertical && reverse,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
