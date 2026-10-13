"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, MapPin, Waves, AlertCircle } from "lucide-react";
import { Back } from "@/components/Back";
import { UnifiedCheckoutModal } from "@/components/UnifiedCheckoutModal";
import { brl, byId, establishments } from "@/lib/data";
import { addDays, seatsTaken, today } from "@/lib/pms";
import { computeSplit } from "@/lib/pricing";
import { useStore } from "@/lib/store";

function Passeios() {
  const router = useRouter();
  const params = useSearchParams();
  const { tours, bookings, addBooking } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const [seats, setSeats] = useState(2);
  const [guest, setGuest] = useState("");
  const [paying, setPaying] = useState(false);

  const tourParam = params.get("tour") || params.get("id");
  const estParam = params.get("est") || params.get("barqueiro");

  useEffect(() => { 
    if (tourParam) setSel(tourParam); 
  }, [tourParam]);

  const displayedTours = tourParam 
    ? tours.filter(t => t.id === tourParam)
    : estParam 
    ? tours.filter(t => t.establishmentId === estParam)
    : tours;

  const tour = sel ? byId(tours, sel) : null;
  const isPaused = tour?.available === false;
  const left = tour && !isPaused ? Math.max(0, tour.seats - seatsTaken(tour.id, tour.booked, bookings)) : 0;
  const split = computeSplit((tour?.pricePerSeat ?? 0) * seats, tour ? byId(establishments, tour.establishmentId)?.plan || "essencial" : "essencial");

  return (
    <main className="mx-auto max-w-md px-5 pb-40 pt-6">
      <Back 
        title={tour ? tour.name : "Passear em Caraíva"} 
        sub="Demonstração de reservas. Vagas não são confirmadas e não há cobrança real." 
      />
      <div className="space-y-3">
        {displayedTours.map((t) => {
          const paused = t.available === false;
          const l = paused ? 0 : Math.max(0, t.seats - seatsTaken(t.id, t.booked, bookings));
          const isFull = l <= 0;
          return (
            <button
              key={t.id}
              disabled={isFull}
              onClick={() => {
                setSel(t.id);
                setSeats(Math.min(2, Math.max(1, l)));
              }}
              className={`card w-full overflow-hidden text-left disabled:opacity-40 transition ${
                sel === t.id ? "border-rio-400/60 shadow-lg" : ""
              }`}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img 
                  src={t.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80"} 
                  alt={t.name} 
                  className="h-full w-full object-cover transition duration-500 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noite-950 via-noite-950/20 to-transparent" />
                <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-areia-100 border border-white/10">
                  {brl(t.pricePerSeat)} / pessoa
                </span>
                {paused && (
                  <span className="absolute top-3 left-3 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Saída Pausada
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-display text-xl text-areia-50">{t.name}</p>
                    <p className="text-xs text-areia-300">{byId(establishments, t.establishmentId)?.name || "Condutor Nativo"}</p>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-rio-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, ((t.seats - l) / t.seats) * 100)}%` }}
                  />
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="chip"><Clock size={11} /> Saída: {t.departure}</span>
                  <span className={`chip ${l <= 2 && l > 0 ? "border-coral-400/50 text-coral-400 font-bold" : ""}`}>
                    {paused ? "Indisponível hoje" : l > 0 ? `${l} vaga(s) restantes` : "Lotação Esgotada"}
                  </span>
                  {t.tideSensitive && (
                    <span className="chip border-cyan-400/40 text-cyan-300">
                      <Waves size={11} /> Janela de Maré Baixa
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {tour && left > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-noite-900/95 p-4 backdrop-blur-xl">
          <div className="mx-auto max-w-md space-y-2.5">
            <p className="flex items-center gap-1 text-xs text-areia-300">
              <MapPin size={12} className="text-amber-400" /> Ponto de Encontro: {tour.meetingPoint}
            </p>
            <div className="flex gap-2">
              <input
                className="input text-xs flex-1"
                placeholder="Nome do passageiro titular"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
              />
              <select
                className="input text-xs w-24"
                value={seats}
                onChange={(e) => setSeats(+e.target.value)}
              >
                {Array.from({ length: left }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} vaga{i > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-primary w-full py-3 text-xs font-bold"
              disabled={!guest.trim()}
              onClick={() => setPaying(true)}
            >
              Garantir {seats} vaga(s) · {brl(split.gross)}
            </button>
          </div>
        </div>
      )}

      {paying && tour && (
        <UnifiedCheckoutModal
          title={tour.name}
          subtitle={`Saída às ${tour.departure} • ${seats} vaga(s) reservada(s)`}
          split={split}
          onClose={() => {
            setPaying(false);
            router.push("/turista/carteira");
          }}
          onDemoCompleted={() => {
            addBooking({
              kind: "passeio",
              refId: tour.id,
              title: `${tour.name} · ${tour.departure}`,
              guest: `${guest} (${seats} vaga(s))`,
              start: addDays(today(), 1),
              seats,
              split,
              paymentStatus: "simulated",
            });
          }}
        />
      )}
    </main>
  );
}

export default function Page() { return <Suspense><Passeios /></Suspense>; }
