"use client";
import { useState } from "react";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Copy, 
  DollarSign, 
  Download, 
  Filter, 
  Layers, 
  TrendingUp, 
  Wallet 
} from "lucide-react";
import { brl, byId, establishments, rooms, tours, services } from "@/lib/data";
import { useStore, type Booking, type Order } from "@/lib/store";
import { NumberTicker } from "@/components/ui/NumberTicker";

export function FinancialHub({ establishmentId }: { establishmentId: string }) {
  const { orders, bookings } = useStore();
  const [filterType, setFilterType] = useState<"all" | "delivery" | "booking">("all");
  const [copied, setCopied] = useState(false);

  const est = byId(establishments, establishmentId);
  const myOrders = orders.filter((o) => o.establishmentId === establishmentId && o.status !== "recusado");
  const myBookings = bookings.filter((b) => {
    const parentId = b.kind === "quarto" 
      ? byId(rooms, b.refId)?.establishmentId 
      : b.kind === "servico"
      ? byId(services, b.refId)?.establishmentId
      : byId(tours, b.refId)?.establishmentId;
    return parentId === establishmentId;
  });

  const allTx = [
    ...myOrders.map((o) => ({
      id: o.id,
      kind: "delivery" as const,
      label: `Pedido ${o.id}`,
      sub: o.items.map((i) => `${i.qty}x ${i.name}`).join(", "),
      date: new Date(o.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      gross: o.split.gross,
      platformFee: o.split.platform,
      courierFee: o.split.courier,
      net: o.split.merchant,
      status: o.status === "entregue" ? "liquidado" : "em_processamento",
    })),
    ...myBookings.map((b) => ({
      id: b.id,
      kind: "booking" as const,
      label: b.title,
      sub: `Hóspede/Pax: ${b.guest}${b.seats ? ` · ${b.seats} pax` : ""}`,
      date: new Date(b.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      gross: b.split.gross,
      platformFee: b.split.platform,
      courierFee: b.split.courier,
      net: b.split.merchant,
      status: "liquidado",
    })),
  ].sort((a, b) => b.id.localeCompare(a.id));

  const filtered = filterType === "all" ? allTx : allTx.filter((t) => t.kind === filterType);

  const totalGross = allTx.reduce((s, x) => s + x.gross, 0);
  const totalPlatformFee = allTx.reduce((s, x) => s + x.platformFee, 0);
  const totalCourierFee = allTx.reduce((s, x) => s + x.courierFee, 0);
  const totalNet = allTx.reduce((s, x) => s + x.net, 0);

  const copyPix = () => {
    if (est?.pixKey) {
      navigator.clipboard?.writeText(est.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-rise">
      {/* Top Banner de Resumo Financeiro */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 border-l-4 border-l-areia-300">
          <div className="flex items-center justify-between text-areia-300">
            <span className="text-xs font-semibold uppercase tracking-wider">Volume Faturado</span>
            <TrendingUp size={18} className="text-areia-200" />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-areia-50">
            <NumberTicker value={totalGross} formatter={(val) => brl(Math.round(val))} />
          </p>
          <p className="mt-1 text-xs text-areia-300/80">Total transacionado pelo app</p>
        </div>

        <div className="card p-5 border-l-4 border-l-mata-400 bg-mata-500/10">
          <div className="flex items-center justify-between text-mata-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Líquido a Receber</span>
            <Wallet size={18} />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-mata-400">
            <NumberTicker value={totalNet} formatter={(val) => brl(Math.round(val))} />
          </p>
          <p className="mt-1 text-xs text-areia-300/80">Repasse livre de taxas</p>
        </div>

        <div className="card p-5 border-l-4 border-l-coral-400">
          <div className="flex items-center justify-between text-coral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa Caraíva Digital</span>
            <DollarSign size={18} />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-coral-400">
            <NumberTicker value={totalPlatformFee} formatter={(val) => brl(Math.round(val))} />
          </p>
          <p className="mt-1 text-xs text-areia-300/80">Comissão acordada retida no split</p>
        </div>

        <div className="card p-5 border-l-4 border-l-rio-400">
          <div className="flex items-center justify-between text-rio-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Repasse Entregadores</span>
            <Layers size={18} />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-rio-400">
            <NumberTicker value={totalCourierFee} formatter={(val) => brl(Math.round(val))} />
          </p>
          <p className="mt-1 text-xs text-areia-300/80">Frete integral para a vila</p>
        </div>
      </div>

      {/* Conta Pix de Destino e Dados de Split */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-mata-900/40 via-noite-800 to-noite-900">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-mata-400/20 text-mata-400">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold">Chave Pix de Repasse Automático</p>
            <p className="text-xs text-areia-300 font-mono">{est?.pixKey || "chave-nao-configurada@pix"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={copyPix}
            className="btn-ghost min-h-[44px] px-3.5 text-xs text-areia-100 hover:text-areia-50"
          >
            <Copy size={14} /> {copied ? "Copiada!" : "Copiar Chave"}
          </button>
          <div className="chip border-mata-400/40 text-mata-400 text-xs py-1.5 px-3">
            <span className="h-2 w-2 rounded-full bg-mata-400 animate-pulse mr-1" /> Split Instantâneo Ativo
          </div>
        </div>
      </div>

      {/* Tabela de Extrato de Vendas */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-xl">Extrato Detalhado de Vendas</h3>
            <p className="text-xs text-areia-300">Cada transação com o cálculo de comissão e repasse</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
              <button 
                onClick={() => setFilterType("all")} 
                className={`px-3 py-1.5 rounded-lg transition min-h-[36px] ${filterType === "all" ? "bg-areia-50 text-noite-900 font-semibold" : "text-areia-300 hover:text-areia-50"}`}
              >
                Todas ({allTx.length})
              </button>
              <button 
                onClick={() => setFilterType("delivery")} 
                className={`px-3 py-1.5 rounded-lg transition min-h-[36px] ${filterType === "delivery" ? "bg-areia-50 text-noite-900 font-semibold" : "text-areia-300 hover:text-areia-50"}`}
              >
                Delivery
              </button>
              <button 
                onClick={() => setFilterType("booking")} 
                className={`px-3 py-1.5 rounded-lg transition min-h-[36px] ${filterType === "booking" ? "bg-areia-50 text-noite-900 font-semibold" : "text-areia-300 hover:text-areia-50"}`}
              >
                Reservas/Passeios
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-areia-300/70 border border-dashed border-white/10 rounded-xl">
            <Clock size={28} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Nenhuma transação registrada neste filtro.</p>
            <p className="text-xs mt-1">Faça um teste pedindo ou reservando no app do Turista para ver o extrato.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-areia-300/70 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">ID / Transação</th>
                  <th className="py-3 px-2">Horário</th>
                  <th className="py-3 px-2">Detalhes</th>
                  <th className="py-3 px-2 text-right">Bruto</th>
                  <th className="py-3 px-2 text-right">Taxa App</th>
                  <th className="py-3 px-2 text-right">Seu Líquido</th>
                  <th className="py-3 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-2 font-mono font-semibold text-areia-100">{tx.id}</td>
                    <td className="py-3 px-2 text-areia-300">{tx.date}</td>
                    <td className="py-3 px-2 max-w-xs">
                      <p className="font-medium text-areia-100 truncate">{tx.label}</p>
                      <p className="text-[11px] text-areia-300/80 truncate">{tx.sub}</p>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-areia-100">{brl(tx.gross)}</td>
                    <td className="py-3 px-2 text-right text-coral-400">-{brl(tx.platformFee)}</td>
                    <td className="py-3 px-2 text-right font-semibold text-mata-400">+{brl(tx.net)}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        tx.status === "liquidado" 
                          ? "bg-mata-400/10 text-mata-400 border border-mata-400/30" 
                          : "bg-coral-400/10 text-coral-400 border border-coral-400/30"
                      }`}>
                        {tx.status === "liquidado" ? "Liquidado Pix" : "Em preparo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
