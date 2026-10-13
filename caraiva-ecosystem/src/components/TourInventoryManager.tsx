"use client";
import { useState } from "react";
import { 
  Sailboat, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  Waves, 
  Check, 
  X,
  AlertTriangle
} from "lucide-react";
import { brl, type Tour } from "@/lib/data";
import { useStore } from "@/lib/store";

interface TourInventoryManagerProps {
  establishmentId: string;
}

export function TourInventoryManager({ establishmentId }: { establishmentId: string }) {
  const { tours, addTour, updateTour, deleteTour } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [departure, setDeparture] = useState("08:30");
  const [meetingPoint, setMeetingPoint] = useState("Travessia do rio (lado Caraíva)");
  const [priceReais, setPriceReais] = useState("250,00");
  const [seats, setSeats] = useState("4");
  const [tideSensitive, setTideSensitive] = useState(true);
  const [image, setImage] = useState("");

  const myTours = tours.filter((t) => t.establishmentId === establishmentId);

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !priceReais) return;

    const priceCents = Math.round(parseFloat(priceReais.replace(",", ".")) * 100);
    const seatsNum = parseInt(seats, 10) || 4;

    addTour({
      establishmentId,
      name: name.trim(),
      departure: departure.trim(),
      meetingPoint: meetingPoint.trim(),
      pricePerSeat: priceCents,
      seats: seatsNum,
      booked: 0,
      tideSensitive,
      available: true,
      image: image.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
      tags: ["passeio", "vila", "natureza"],
    });

    setName("");
    setPriceReais("250,00");
    setImage("");
    setIsModalOpen(false);
  };

  const handleAdjustSeats = (tourId: string, currentTotal: number, delta: number) => {
    const next = Math.max(1, currentTotal + delta);
    updateTour(tourId, { seats: next });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
            <Sailboat size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-areia-50">Gestão de Saídas & Lotação de Vagas</h3>
            <p className="text-xs text-areia-400">
              {myTours.length} roteiros cadastrados · Controle horários, assentos e valores por passageiro
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary min-h-[44px] px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-coral-500/20 active:scale-95 transition"
        >
          <Plus size={16} /> Cadastrar Nova Saída / Passeio
        </button>
      </div>

      {/* Grid de Passeios */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myTours.map((t) => {
          const availableSeats = Math.max(0, t.seats - t.booked);
          const isFull = availableSeats === 0;

          return (
            <div
              key={t.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-noite-900/80 transition hover:border-sky-500/30 flex flex-col"
            >
              <div className="relative h-44 w-full bg-noite-950">
                <img
                  src={t.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur ${
                      isFull ? "bg-rose-500/80 text-white" : "bg-emerald-500/80 text-white"
                    }`}
                  >
                    {isFull ? "Esgotado" : `${availableSeats} vagas livres`}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-areia-50 text-sm">{t.name}</h4>
                    <button
                      onClick={() => deleteTour(t.id)}
                      className="text-areia-400 hover:text-rose-400 p-1"
                      title="Excluir passeio"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-areia-300">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-coral-400" /> Saída: <strong className="text-areia-100">{t.departure}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-sky-400" /> Ponto: {t.meetingPoint}
                    </div>
                    {t.tideSensitive && (
                      <div className="flex items-center gap-1.5 text-sky-300 text-[11px]">
                        <Waves size={12} /> Depende da tábua de maré baixa
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-baseline justify-between border-t border-white/5 pt-2">
                    <span className="text-[11px] text-areia-400">Por pessoa:</span>
                    <span className="text-base font-black text-emerald-400">{brl(t.pricePerSeat)}</span>
                  </div>
                </div>

                {/* Ajuste de Vagas */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-areia-400">Capacidade Total:</span>
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/10">
                    <button
                      onClick={() => handleAdjustSeats(t.id, t.seats, -1)}
                      className="h-7 w-7 flex items-center justify-center rounded text-areia-300 hover:bg-white/10"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold text-areia-100 px-2">
                      {t.seats} vagas
                    </span>
                    <button
                      onClick={() => handleAdjustSeats(t.id, t.seats, 1)}
                      className="h-7 w-7 flex items-center justify-center rounded text-areia-300 hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Saída */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="card w-full max-w-md bg-noite-900 border-white/15 p-6 animate-rise max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-sky-400" />
                <h3 className="font-bold text-areia-50">Nova Saída / Roteiro</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-areia-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTour} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Nome do Passeio *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Buggy Ponta do Corumbau, Lancha Corais..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label block font-semibold text-areia-200 mb-1">Horário de Saída</label>
                  <input
                    type="time"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="label block font-semibold text-areia-200 mb-1">Total de Assentos</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="input text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label block font-semibold text-areia-200 mb-1">Preço por Assento R$ *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: 250,00"
                    value={priceReais}
                    onChange={(e) => setPriceReais(e.target.value)}
                    className="input text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tideSensitive}
                      onChange={(e) => setTideSensitive(e.target.checked)}
                      className="rounded accent-coral-400"
                    />
                    <span className="text-areia-300 text-[11px]">Depende da Maré Baixa</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Ponto de Encontro</label>
                <input
                  type="text"
                  placeholder="Ex: Píer da vila, Travessia..."
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Foto do Passeio (URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost flex-1 text-xs min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 text-xs min-h-[44px] font-bold"
                >
                  Salvar Passeio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
