"use client";
import { useState } from "react";
import { 
  BedDouble, 
  Plus, 
  Trash2, 
  DollarSign, 
  Users, 
  Sparkles, 
  Check, 
  Calendar, 
  X, 
  Link as LinkIcon,
  Tag
} from "lucide-react";
import { brl, type Room } from "@/lib/data";
import { useStore } from "@/lib/store";

interface RoomInventoryManagerProps {
  establishmentId: string;
}

export function RoomInventoryManager({ establishmentId }: { establishmentId: string }) {
  const { rooms, addRoom, updateRoom, deleteRoom } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulário de novo quarto
  const [name, setName] = useState("");
  const [nightlyReais, setNightlyReais] = useState("");
  const [lastMinuteReais, setLastMinuteReais] = useState("");
  const [capacity, setCapacity] = useState("2");
  const [amenitiesStr, setAmenitiesStr] = useState("Ar-condicionado, Wi-Fi Starlink, Varanda com rede");
  const [image, setImage] = useState("");
  const [icalUrl, setIcalUrl] = useState("");

  const myRooms = rooms.filter((r) => r.establishmentId === establishmentId);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nightlyReais) return;

    const nightlyCents = Math.round(parseFloat(nightlyReais.replace(",", ".")) * 100);
    const lastMinCents = lastMinuteReais ? Math.round(parseFloat(lastMinuteReais.replace(",", ".")) * 100) : undefined;
    const capNum = parseInt(capacity, 10) || 2;
    const amenities = amenitiesStr.split(",").map(a => a.trim()).filter(Boolean);

    addRoom({
      establishmentId,
      name: name.trim(),
      nightly: nightlyCents,
      lastMinute: lastMinCents,
      capacity: capNum,
      available: true,
      amenities,
      image: image.trim() || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
      icalImportUrl: icalUrl.trim() || undefined,
    });

    setName("");
    setNightlyReais("");
    setLastMinuteReais("");
    setImage("");
    setIcalUrl("");
    setIsModalOpen(false);
  };

  const handleUpdatePrice = (roomId: string, currentCents: number) => {
    const promptVal = prompt("Novo valor da diária regular (R$):", (currentCents / 100).toFixed(2));
    if (!promptVal) return;
    const newCents = Math.round(parseFloat(promptVal.replace(",", ".")) * 100);
    if (!isNaN(newCents) && newCents > 0) {
      updateRoom(roomId, { nightly: newCents });
    }
  };

  const handleToggleLastMinute = (roomId: string, currentRate: number, currentPromo?: number) => {
    if (currentPromo) {
      updateRoom(roomId, { lastMinute: undefined });
    } else {
      const discounted = Math.round(currentRate * 0.75); // 25% de desconto automático
      updateRoom(roomId, { lastMinute: discounted });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com botão de Adicionar Quarto */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mata-500/20 text-mata-400">
            <BedDouble size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-areia-50">Gerenciador de Quartos & Tarifas</h3>
            <p className="text-xs text-areia-400">
              {myRooms.length} acomodações cadastradas · Ajuste valores, last-minute e sincronização iCal
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary min-h-[44px] px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-coral-500/20 active:scale-95 transition"
        >
          <Plus size={16} /> Cadastrar Quarto / Bangalô
        </button>
      </div>

      {/* Grid de Quartos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myRooms.map((room) => {
          const isAvailable = room.available !== false;

          return (
            <div
              key={room.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-noite-900/80 transition hover:border-mata-500/30 flex flex-col"
            >
              <div className="relative h-44 w-full bg-noite-950">
                <img
                  src={room.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80"}
                  alt={room.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-noite-900/80 px-2 py-0.5 text-[10px] font-bold text-areia-100 backdrop-blur flex items-center gap-1">
                    <Users size={11} /> Até {room.capacity} hóspedes
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-areia-50 text-sm">{room.name}</h4>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="text-areia-400 hover:text-rose-400 p-1"
                      title="Excluir acomodação"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-areia-400 block">Diária Regular:</span>
                      <button
                        onClick={() => handleUpdatePrice(room.id, room.nightly)}
                        className="text-base font-black text-areia-100 hover:text-coral-400 transition flex items-center gap-1 underline underline-offset-2"
                        title="Clique para editar diária"
                      >
                        {brl(room.nightly)}
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-areia-400 block">Tarifa Só Hoje:</span>
                      {room.lastMinute ? (
                        <span className="text-sm font-bold text-coral-400">{brl(room.lastMinute)}</span>
                      ) : (
                        <span className="text-[11px] text-areia-500 italic">Desativada</span>
                      )}
                    </div>
                  </div>

                  {/* Comodidades */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {room.amenities.map((a) => (
                      <span key={a} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-areia-300">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botões Operacionais */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleLastMinute(room.id, room.nightly, room.lastMinute)}
                    className={`min-h-[36px] flex-1 text-[11px] font-bold rounded-xl border transition flex items-center justify-center gap-1 ${
                      room.lastMinute
                        ? "bg-coral-500/20 text-coral-300 border-coral-500/40"
                        : "bg-white/5 text-areia-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Tag size={12} /> {room.lastMinute ? "Desativar Last Minute" : "Ativar 'Só Hoje'"}
                  </button>

                  <button
                    onClick={() => updateRoom(room.id, { available: !isAvailable })}
                    className={`min-h-[36px] px-3 text-[11px] font-bold rounded-xl border transition ${
                      isAvailable
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    }`}
                  >
                    {isAvailable ? "Livre" : "Bloqueado"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação de Quarto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="card w-full max-w-md bg-noite-900 border-white/15 p-6 animate-rise max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-mata-400" />
                <h3 className="font-bold text-areia-50">Cadastrar Quarto ou Bangalô</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-areia-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Nome da Acomodação *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Bangalô Mangaba, Suíte Vista Rio..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label block font-semibold text-areia-200 mb-1">Diária Regular R$ *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: 650,00"
                    value={nightlyReais}
                    onChange={(e) => setNightlyReais(e.target.value)}
                    className="input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="label block font-semibold text-areia-200 mb-1">Capacidade Hóspedes</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Preço "Só Hoje" Last Minute (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: 490,00 (para ocupar quartos vagos hoje)"
                  value={lastMinuteReais}
                  onChange={(e) => setLastMinuteReais(e.target.value)}
                  className="input text-xs font-mono"
                />
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Comodidades (separadas por vírgula)</label>
                <input
                  type="text"
                  value={amenitiesStr}
                  onChange={(e) => setAmenitiesStr(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Link iCal Booking / Airbnb (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://ical.booking.com/v1/export?t=..."
                  value={icalUrl}
                  onChange={(e) => setIcalUrl(e.target.value)}
                  className="input text-xs font-mono"
                />
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Foto da Suíte (URL)</label>
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
                  Salvar Acomodação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
