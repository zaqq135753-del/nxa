"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  name: string;
  className?: string;
  background?: React.ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  badge?: string;
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  badge,
}: BentoCardProps) {
  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl",
        // Estilo card glassmorphism high-tech
        "bg-noite-900/60 [box-shadow:0_0_0_1px_rgba(255,255,255,0.08)]",
        "hover:[box-shadow:0_0_0_1px_rgba(240,138,93,0.35)] transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-0 z-0">{background}</div>

      <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-areia-50 ring-1 ring-white/10 group-hover:bg-coral-500/20 group-hover:text-coral-300 group-hover:ring-coral-500/30 transition">
            <Icon className="h-6 w-6" />
          </div>
          {badge && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-areia-200 backdrop-blur">
              {badge}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-xl font-bold font-display text-areia-50 group-hover:text-white transition">
          {name}
        </h3>
        <p className="max-w-lg text-xs text-areia-300/80 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pointer-events-none z-10 flex w-full translate-y-3 transform-gpu flex-row items-center p-6 opacity-80 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <a
          href={href}
          className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-bold text-coral-400 group-hover:text-coral-300 transition"
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03]" />
    </div>
  );
}
