"use client";
import { useStore, type Booking } from "@/lib/store";
import { brl, byId, rooms, tours } from "@/lib/data";
import { Wallet } from "lucide-react";

const ownerOf = (b: Booking) => (b.kind === "quarto" ? byId(rooms, b.refId) : byId(tours, b.refId))?.establishmentId;

/** Módulo comum a todos os nichos: quanto entrou, quanto é taxa, quanto é seu. */
export function FinanceStrip({ establishmentIds }: { establishmentIds: string[] }) {
  const { orders, bookings } = useStore();
  const splits = [
    ...orders.filter((o) => establishmentIds.includes(o.establishmentId) && o.status !== "recusado").map((o) => o.split),
    ...bookings.filter((b) => establishmentIds.includes(ownerOf(b) ?? "")).map((b) => b.split),
  ];
  const sold = splits.reduce((s, x) => s + x.gross - x.courier, 0);
  const fee = splits.reduce((s, x) => s + x.platform, 0);
  return (
    <div className="card grid grid-cols-3 divide-x divide-white/5 p-4 text-center">
      <div><p className="label">Vendido</p><p className="mt-1 text-lg font-semibold">{brl(sold)}</p></div>
      <div><p className="label">Taxa app</p><p className="mt-1 text-lg font-semibold text-areia-300">{brl(fee)}</p></div>
      <div><p className="label flex items-center justify-center gap-1"><Wallet size={11} /> Seu Pix</p><p className="mt-1 text-lg font-semibold text-mata-400">{brl(sold - fee)}</p></div>
    </div>
  );
}
