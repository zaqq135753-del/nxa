"use client";
import { useState } from "react";
import { Check, CreditCard, QrCode, ShieldCheck, Sparkles, X } from "lucide-react";
import { brl } from "@/lib/data";
import type { Split } from "@/lib/pricing";

interface UnifiedCheckoutModalProps {
  title: string;
  subtitle?: string;
  split: Split;
  voucherCode?: string;
  onDemoCompleted: () => void;
  onClose: () => void;
}

export function UnifiedCheckoutModal({
  title,
  subtitle,
  split,
  voucherCode = `#CAR-${Math.floor(100 + Math.random() * 900)}`,
  onDemoCompleted,
  onClose,
}: UnifiedCheckoutModalProps) {
  const [method, setMethod] = useState<"pix" | "cartao">("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const simulate = () => {
    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      onDemoCompleted();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-3 backdrop-blur-md sm:items-center">
      <div className="w-full max-w-sm animate-rise rounded-3xl border border-white/20 bg-noite-900 p-6 text-areia-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldCheck size={15} />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Demonstração · sem cobrança</span>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="rounded-full p-1 text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <h3 className="mt-3 font-display text-xl text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-areia-300">{subtitle}</p>}

        {!isDone ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMethod("pix")} className={`flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition ${method === "pix" ? "border-amber-400 bg-amber-400/20 text-amber-300" : "border-white/10 bg-white/5 text-areia-300"}`}>
                <QrCode size={14} /> Pix
              </button>
              <button type="button" onClick={() => setMethod("cartao")} className={`flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition ${method === "cartao" ? "border-amber-400 bg-amber-400/20 text-amber-300" : "border-white/10 bg-white/5 text-areia-300"}`}>
                <CreditCard size={14} /> Cartão
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-amber-300">
                {method === "pix" ? <QrCode size={24} /> : <CreditCard size={24} />}
              </div>
              <p className="mt-3 text-sm font-semibold text-white">Checkout de demonstração</p>
              <p className="mt-1 text-xs leading-relaxed text-areia-300">
                O provedor de pagamento ainda não está conectado. Esta etapa não gera cobrança nem confirma pagamento.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-xs text-areia-300">Valor ilustrativo</span>
              <span className="font-display text-xl font-bold text-amber-300">{brl(split.gross)}</span>
            </div>

            <button type="button" disabled={isProcessing} onClick={simulate} className="btn-primary mt-4 flex w-full items-center justify-center gap-1.5 py-3 text-xs font-bold tracking-wide shadow-lg disabled:opacity-60">
              {isProcessing ? <span>Registrando demonstração…</span> : <><Sparkles size={14} /><span>Simular pedido/reserva</span></>}
            </button>
          </>
        ) : (
          <div className="mt-5 space-y-4 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-noite-950 shadow-lg shadow-emerald-500/30">
              <Check size={32} strokeWidth={3} />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-white">Demonstração registrada</h4>
              <p className="mt-1 text-xs text-areia-200">Nenhum pagamento foi feito. O registro existe apenas neste navegador para apresentar o fluxo.</p>
            </div>
            <div className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-3 text-left text-xs">
              <div className="flex justify-between"><span className="text-areia-300">Código de demonstração</span><span className="font-mono font-bold text-amber-400">{voucherCode}</span></div>
              <div className="flex justify-between"><span className="text-areia-300">Pagamento</span><span className="font-bold text-amber-300">Não realizado</span></div>
              <div className="flex justify-between"><span className="text-areia-300">Sincronização</span><span className="font-bold text-areia-200">Este navegador</span></div>
            </div>
            <button type="button" className="btn-primary w-full py-3 text-xs font-bold" onClick={onClose}>Concluir demonstração</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UnifiedCheckoutModal;
