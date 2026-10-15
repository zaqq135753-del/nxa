"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
  formatter?: (val: number) => string;
}

/**
 * 21st-dev Number Ticker.
 * Animação suave com física de mola (spring) ao incrementar ou decrementar valores e números.
 */
export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  formatter,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        if (formatter) {
          ref.current.textContent = formatter(Number(latest.toFixed(decimalPlaces)));
        } else {
          ref.current.textContent = Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }
    });
  }, [springValue, decimalPlaces, formatter]);

  return (
    <span
      className={cn("inline-block tabular-nums tracking-wider", className)}
      ref={ref}
    >{formatter ? formatter(value) : value.toLocaleString("pt-BR", { maximumFractionDigits: decimalPlaces })}</span>
  );
}
