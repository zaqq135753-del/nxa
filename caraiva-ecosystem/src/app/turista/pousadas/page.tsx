"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Users, Luggage, Clock, CheckCircle } from "lucide-react";
import { Back } from "@/components/Back";
import { UnifiedCheckoutModal } from "@/components/UnifiedCheckoutModal";
import { brl, byId, establishments } from "@/lib/data";
import { overlaps } from "@/lib/ical";
import { addDays, allBlocks, today } from "@/lib/pms";
import { computeSplit } from "@/lib/pricing";
import { useStore } from "@/lib/store";

function Pousadas() {
  const router = useRouter();
  const params = useSearchParams();
  const { rooms, bookings, addBooking } = useStore();
  const [start, setStart] = useState(today());
  const [nights, setNights] = useState(1);
  const [guestsCount, setGuestsCount] = useState(2);
  const [needsLuggageCart, setNeedsLuggageCart] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [guest, setGuest] = useState("");
  const [paying, setPaying] = useState(false);

  const pousadaParam = params.get("pousada") || params.get("est") || params.get("establishmentId");

  useEffect(() => { 
    const r = params.get("room");
    if (r) setSelected(r);
  }, [params]);

  const displayedRooms = pousadaParam 
    ? rooms.filter(r => r.establishmentId === pousadaParam)
    : rooms;

  const end = addDays(start, nights);
  const room = selected ? byId(rooms, selected) : null;
  const est = room ? byId(establishments, room.establishmentId)! : null;
  const nightly = room ? (start === today() && room.lastMinute ? room.lastMinute : room.nightly) : 0;
  const split = computeSplit(nightly * nights, est?.plan ?? "pro");

  return (
    <main className="mx-auto max-w-md px-5 pb-40 pt-6">
      <Back 
        title={pousadaParam ? (byId(establishments, pousadaParam)?.name || "Reserva de Quarto") : "Dormir em Caraíva"} 
        sub={pousadaParam ? "Escolha uma acomodação para simular o fluxo de reserva." : "Prévia de acomodações. A disponibilidade não está conectada ao inventário real."} 
      />
      <div className="card grid grid-cols-3 gap-2 p-3">
        <label className="text-[11px] text-areia-300">
          Check-in
          <input type="date" className="input mt-1 text-xs" value={start} min={today()} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="text-[11px] text-areia-300">
          Noites
          <input type="number" min={1} max={14} className="input mt-1 text-xs" value={nights} onChange={(e) => setNights(Math.max(1, +e.target.value))} />
        </label>
        <label className="text-[11px] text-areia-300">
          Hóspedes
          <input type="number" min={1} max={6} className="input mt-1 text-xs" value={guestsCount} onChange={(e) => setGuestsCount(Math.max(1, +e.target.value))} />
        </label>
      </div>

      <div className="mt-5 space-y-3">
        {displayedRooms.map((r) => {
          const isBlockedByDate = overlaps(start, end, allBlocks(r.id, bookings));
          const isPaused = r.available === false;
          const busy = isBlockedByDate || isPaused;
          const deal = start === today() && r.lastMinute;
          return (
            <button
              key={r.id}
              disabled={busy}
              onClick={() => setSelected(r.id)}
              className={`card w-full overflow-hidden text-left transition disabled:opacity-40 ${
                selected === r.id ? "border-coral-400/60 shadow-lg" : ""
              }`}
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img 
                  src={r.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"} 
                  alt={r.name} 
                  className="h-full w-full object-cover transition duration-500 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noite-950 via-noite-950/20 to-transparent" />
                {deal && (
                  <span className="absolute top-3 right-3 rounded-full bg-coral-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-noite-950 shadow-lg">
                    ⚡ Promoção Só Hoje (-25%)
                  </span>
                )}
                {isPaused && (
                  <span className="absolute top-3 left-3 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Quarto Fechado pela Pousada
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-xl">{r.name}</p>
                    <p className="text-xs text-areia-300">{byId(establishments, r.establishmentId)?.name || "Pousada Nativa"}</p>
                  </div>
                  <div className="text-right">
                    {deal && <p className="text-[11px] text-areia-300 line-through">{brl(r.nightly)}</p>}
                    <p className="font-semibold">{brl(deal ? r.lastMinute! : r.nightly)}</p>
                    <span className="text-[10px] text-areia-300">/ diária</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="chip"><Users size={10} /> Até {r.capacity} pessoas</span>
                  {r.amenities.map((a) => <span key={a} className="chip">{a}</span>)}
                  {deal && <span className="chip border-coral-400/50 text-coral-400">Last minute</span>}
                  {isBlockedByDate && <span className="chip border-red-400/40 text-red-300"><AlertTriangle size={10} /> Ocupado nessas datas</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {room && !overlaps(start, end, allBlocks(room.id, bookings)) && room.available !== false && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-noite-900/95 p-4 backdrop-blur-xl">
          <div className="mx-auto max-w-md space-y-2.5">
            <input
              className="input text-xs"
              placeholder="Nome do hóspede titular"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
            />

            {/* Logística Nativa de Caraíva: Carroceiro na Balsa */}
            <label className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-areia-200 cursor-pointer">
              <input
                type="checkbox"
                checked={needsLuggageCart}
                onChange={(e) => setNeedsLuggageCart(e.target.checked)}
                className="rounded accent-amber-400"
              />
              <Luggage size={14} className="text-amber-400 shrink-0" />
              <span>Avisar pousada para agendar carroceiro de malas na balsa</span>
            </label>

            <button
              className="btn-primary w-full py-3 text-xs font-bold"
              disabled={!guest.trim()}
              onClick={() => setPaying(true)}
            >
              Reservar {nights} noite(s) · {brl(split.gross)}
            </button>
          </div>
        </div>
      )}

      {paying && room && (
        <UnifiedCheckoutModal
          title={room.name}
          subtitle={`${est?.name} • ${nights} noite(s) para ${guestsCount} hóspede(s)`}
          split={split}
          onClose={() => {
            setPaying(false);
            router.push("/turista/carteira");
          }}
          onDemoCompleted={() => {
            addBooking({
              kind: "quarto",
              refId: room.id,
              title: `${room.name} · ${est?.name || "Pousada"}`,
              guest: `${guest} (${guestsCount} hóspedes${needsLuggageCart ? " • C/ Carroça na Balsa" : ""})`,
              start,
              end,
              split,
              paymentStatus: "simulated",
            });
          }}
        />
      )}
    </main>
  );
}

export default function Page() { return <Suspense><Pousadas /></Suspense>; }
