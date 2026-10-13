"use client";
import { useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { brl } from "@/lib/data";
import type { Split } from "@/lib/pricing";

/** Demonstração local. Uma cobrança real só deve ser confirmada por webhook do provedor. */
export function PixCheckout({ split, title, onDemoCompleted, onClose }: { split: Split; title: string; onDemoCompleted: () => void; onClose: () => void }) {
  const [done, setDone] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center">
      <div className="card w-full max-w-sm animate-rise bg-noite-800 p-6">
        <div className="flex items-center justify-between">
          <p className="label flex items-center gap-2"><ShieldCheck size={14} /> Demonstração · sem cobrança</p>
          <button onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        </div>
        <h3 className="mt-2 font-display text-2xl">{title}</h3>
        {done ? (
          <div className="mt-6 grid place-items-center gap-2 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-mata-400 text-noite-900"><Check size={32} /></div>
            <p className="font-semibold">Fluxo de demonstração concluído</p>
            <p className="text-xs text-areia-300">Nenhum pagamento foi feito ou confirmado.</p>
            <button className="btn-primary mt-3 w-full" onClick={onClose}>Concluir</button>
          </div>
        ) : (
          <>
            <p className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-areia-200">
              O provedor Pix ainda não está conectado. Não existe QR Code válido para esta demonstração.
            </p>
            <dl className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-xs text-areia-300">
              <div className="flex justify-between"><dt>Valor ilustrativo</dt><dd className="font-semibold text-areia-50">{brl(split.gross)}</dd></div>
              <div className="flex justify-between"><dt>Estabelecimento</dt><dd>{brl(split.merchant)}</dd></div>
              {split.courier > 0 && <div className="flex justify-between"><dt>Entregador da vila</dt><dd>{brl(split.courier)}</dd></div>}
              <div className="flex justify-between"><dt>Caraíva Digital</dt><dd>{brl(split.platform)}</dd></div>
            </dl>
            <button className="btn-primary mt-5 w-full" onClick={() => { setDone(true); onDemoCompleted(); }}>Simular fluxo sem cobrar</button>
          </>
        )}
      </div>
    </div>
  );
}
