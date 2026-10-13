"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, 
  Sun, 
  Zap, 
  Bike, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles,
  Compass,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

/**
 * 21st-dev Village Dynamic Island.
 * Pílula flutuante moderna com feedback em tempo real da vila de Caraíva:
 * Tábua de maré, status do delivery Na Areia, sol e entregas ativas.
 */
export function VillageDynamicIsland() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative z-30 flex justify-center w-full">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer select-none rounded-full border border-white/10 bg-noite-950/80 px-4 py-2 backdrop-blur-2xl shadow-2xl hover:border-white/20 transition-colors"
      >
        {/* Barra Compacta */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-areia-100 text-[11px] uppercase tracking-wider">
              Ao Vivo em Caraíva
            </span>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-rio-300 font-medium">
            <Waves size={13} className="text-rio-400" />
            <span>Maré Baixa 11:42 (0.2m)</span>
          </div>

          <span className="text-white/20 hidden md:inline">•</span>

          <div className="hidden md:flex items-center gap-1.5 text-coral-300 font-medium">
            <Bike size={13} className="text-coral-400" />
            <span>Na Areia: Aberto</span>
          </div>

          <span className="text-white/20 hidden lg:inline">•</span>

          <div className="hidden lg:flex items-center gap-1 text-mata-300 font-medium">
            <Zap size={13} className="text-mata-400" />
            <span>Prévia de repasse Pix · gateway não conectado</span>
          </div>

          <div className="ml-1 text-areia-400">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>

        {/* Expansão com Spring Physics */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="overflow-hidden border-t border-white/10 pt-3 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pb-1">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 text-rio-400 font-semibold mb-1">
                    <Waves size={14} /> Tábua de Maré & Barcos
                  </div>
                  <p className="text-[11px] text-areia-300">
                    Ponta do Corumbau acessível até 14:00. Lanchas com saída no Rio Caraíva.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 text-coral-400 font-semibold mb-1">
                    <Bike size={14} /> Entregas na Areia
                  </div>
                  <p className="text-[11px] text-areia-300">
                    4 entregadores ativos na vila. Tempo médio de entrega: 25 min no quarto.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 text-mata-400 font-semibold mb-1">
                    <ShieldCheck size={14} /> Rede & Conexão
                  </div>
                  <p className="text-[11px] text-areia-300">
                    Internet Starlink ativa nas pousadas. Placas NFC funcionam 100% sem app.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-areia-400">Toque fora para recolher</span>
                <Link 
                  href="/turista" 
                  className="font-bold text-coral-400 hover:text-coral-300 inline-flex items-center gap-1"
                >
                  Abrir SuperApp do Turista <ArrowRight size={11} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
