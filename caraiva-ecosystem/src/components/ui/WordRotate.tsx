"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number; // milissegundos
  className?: string;
}

/**
 * 21st-dev Word Rotate.
 * Alterna palavras ou frases no hero com animação fluida 3D de entrada e saída.
 */
export function WordRotate({
  words,
  duration = 2600,
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className="relative inline-block overflow-hidden align-baseline py-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cn("inline-block", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
