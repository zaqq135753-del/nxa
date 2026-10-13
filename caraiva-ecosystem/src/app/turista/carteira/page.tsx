"use client";
import { QrCode, CheckCircle2 } from "lucide-react";
import { Back } from "@/components/Back";
import { brl, byId, establishments } from "@/lib/data";
import { useStore, type OrderStatus } from "@/lib/store";

const STEPS: OrderStatus[] = ["novo", "preparando", "em_rota", "entregue"];
const LABEL: Record<OrderStatus, string> = { novo: "Recebido", preparando: "Separando", em_rota: "A caminho", entregue: "Entregue", recusado: "Recusado (estornado)" };

export default function Carteira() {
  const { orders, bookings } = useStore();
  return (
    <main className="mx-auto max-w-md px-5 pb-24 pt-6">
      <Back title="Carteira" sub="Vouchers ficam salvos no aparelho, mesmo sem sinal." />
      {!orders.length && !bookings.length && <p className="text-sm text-areia-300">Nada por aqui ainda.</p>}

      {bookings.map((b) => (
        <div key={b.id} className="card mb-3 flex items-center gap-4 p-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-areia-50 text-noite-900"><QrCode size={56} strokeWidth={1.3} /></div>
          <div className="min-w-0">
            <p className="label">{b.kind === "quarto" ? "Hospedagem" : "Passeio"}</p>
            <p className="truncate font-medium">{b.title}</p>
            <p className="text-xs text-areia-300">{b.start}{b.end ? ` → ${b.end}` : ""}{b.seats ? ` · ${b.seats} pax` : ""}</p>
            <p className="mt-1 font-mono text-sm text-coral-400">{b.id}</p>
            {b.checkedIn && <p className="flex items-center gap-1 text-xs text-mata-400"><CheckCircle2 size={12} /> Check-in feito</p>}
          </div>
        </div>
      ))}

      {orders.map((o) => (
        <div key={o.id} className="card mb-3 p-4">
          <div className="flex justify-between"><p className="font-medium">{byId(establishments, o.establishmentId)?.name} {o.id}</p><p className="text-sm">{brl(o.split.gross)}</p></div>
          <p className="text-xs text-areia-300">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
          <div className="mt-3 flex gap-1">{STEPS.map((s, i) => <div key={s} className={`h-1.5 flex-1 rounded-full ${STEPS.indexOf(o.status) >= i ? "bg-coral-400" : "bg-white/10"}`} />)}</div>
          <p className="mt-2 text-xs text-areia-200">{LABEL[o.status]}{o.etaMin && o.status === "preparando" ? ` · chega em ~${o.etaMin} min` : ""}</p>
        </div>
      ))}
    </main>
  );
}
