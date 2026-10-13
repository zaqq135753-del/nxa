"use client";
import { useState } from "react";
import { 
  BedDouble, 
  CreditCard, 
  Download, 
  Link2, 
  Nfc, 
  RefreshCw, 
  Sparkles, 
  Tag 
} from "lucide-react";
import { FinancialHub } from "@/components/FinancialHub";
import { PlaqueStrategyHub } from "@/components/PlaqueStrategyHub";
import { RoomInventoryManager } from "@/components/RoomInventoryManager";
import { brl, nfcTags } from "@/lib/data";
import { buildIcs, isBlocked, parseIcs, type Block } from "@/lib/ical";
import { addDays, allBlocks, appBlocks, today } from "@/lib/pms";
import { useStore } from "@/lib/store";

const DAYS = 14;
const COLOR: Record<Block["source"], string> = {
  airbnb: "bg-[#FF5A5F]/80", 
  booking: "bg-[#2B6CE0]/80", 
  caraiva: "bg-coral-400", 
  manual: "bg-areia-300/60", 
  outro: "bg-white/30",
};

export default function PousadaPMS() {
  const { rooms, bookings, toggleRoomAvailability } = useStore();
  const [activeTab, setActiveTab] = useState<"pms" | "quartos" | "financeiro" | "placa">("pms");
  const [imported, setImported] = useState<Record<string, Block[]>>({});
  const [ics, setIcs] = useState("");
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState(rooms[0]?.id || "room-1");
  const [msg, setMsg] = useState("");

  const days = Array.from({ length: DAYS }, (_, i) => addDays(today(), i));
  const blocksOf = (id: string) => [...allBlocks(id, bookings), ...(imported[id] ?? [])];

  const merge = (b: Block[]) => { 
    setImported((s) => ({ ...s, [target]: [...(s[target] ?? []), ...b] })); 
    setMsg(`✓ ${b.length} bloqueio(s) importados para ${rooms.find((r) => r.id === target)!.name}`); 
  };

  async function importUrl() {
    setMsg("Sincronizando link do canal...");
    const r = await fetch("/api/ical/import", { method: "POST", body: JSON.stringify({ url }) });
    const j = await r.json();
    if (j.error) setMsg(`⚠ ${j.error}`); else merge(j.blocks);
  }

  function exportIcs(roomId: string) {
    const room = rooms.find((r) => r.id === roomId)!;
    const blob = new Blob([buildIcs(room.name, appBlocks(roomId, bookings))], { type: "text/calendar" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `caraiva-${roomId}.ics`; a.click();
  }

  const freeTonight = rooms.filter((r) => !isBlocked(today(), blocksOf(r.id)));
  const occupancy = Math.round((rooms.reduce((s, r) => s + days.filter((d) => isBlocked(d, blocksOf(r.id))).length, 0) / (rooms.length * DAYS)) * 100);

  return (
    <div className="space-y-6">
      {/* Header com identificação da Pousada */}
      <header className="border-b border-white/5 pb-4">
        <p className="label">Caraíva Business · Hospedagem & Mini-PMS</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl text-areia-50">Pousada Flor de Caraíva</h1>
      </header>

      {/* Navegação por Tabs B2B (UI/UX Pro Max) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab("pms")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "pms" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <BedDouble size={15} /> Mapa de Ocupação 14d
        </button>

        <button
          onClick={() => setActiveTab("quartos")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "quartos" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Sparkles size={15} /> Quartos & Tarifas
        </button>

        <button
          onClick={() => setActiveTab("financeiro")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "financeiro" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <CreditCard size={15} /> Financeiro & Diárias
        </button>

        <button
          onClick={() => setActiveTab("placa")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "placa" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Nfc size={15} /> Placas NFC dos Quartos
        </button>
      </div>

      {/* Conteúdo dinâmico da Tab selecionada */}
      {activeTab === "quartos" && (
        <div className="animate-rise">
          <RoomInventoryManager establishmentId="pous-flor" />
        </div>
      )}
      {activeTab === "financeiro" && <FinancialHub establishmentId="pous-flor" />}
      {activeTab === "placa" && <PlaqueStrategyHub establishmentId="pous-flor" />}

      {activeTab === "pms" && (
        <div className="space-y-6 animate-rise">
          {/* Mapa de Ocupação de 14 Dias */}
          <section className="card overflow-x-auto p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label font-bold text-areia-100">Grelha de Ocupação · Próximos {DAYS} dias</p>
                <p className="text-xs text-areia-300">Taxa de ocupação estimada: <strong className="text-areia-50">{occupancy}%</strong></p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {(["airbnb", "booking", "caraiva"] as const).map((s) => (
                  <span key={s} className="flex items-center gap-1.5 text-areia-300">
                    <i className={`h-3 w-3 rounded-sm ${COLOR[s]}`} />
                    {s === "caraiva" ? "Reserva Direta App" : s.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <table className="w-full min-w-[720px] border-separate border-spacing-1.5 text-xs">
              <thead>
                <tr>
                  <th className="w-44 text-left font-normal text-areia-300/60 pb-2">Acomodação</th>
                  {days.map((d) => (
                    <th key={d} className="font-medium text-areia-300 text-center pb-2">
                      {new Date(d + "T12:00").toLocaleDateString("pt-BR", { weekday: "narrow", day: "2-digit" })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td className="pr-3 text-sm py-1">
                      <p className="font-semibold text-areia-100">{r.name}</p>
                      <p className="text-[11px] text-areia-300">{brl(r.nightly)} / noite</p>
                    </td>
                    {days.map((d) => { 
                      const b = isBlocked(d, blocksOf(r.id)); 
                      return (
                        <td 
                          key={d} 
                          title={b ? `${b.source.toUpperCase()}: ${b.summary}` : "Disponível para reserva"} 
                          className={`h-10 rounded-lg text-center transition ${
                            b ? `${COLOR[b.source]} shadow-sm` : "bg-white/[0.03] hover:bg-white/[0.08]"
                          }`} 
                        />
                      ); 
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Reservas Diretas Recentes do App (Com Hóspede e Logística de Balsa) */}
          <section className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="label font-bold text-areia-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Reservas Confirmadas no Caraíva App
                </p>
                <p className="text-xs text-areia-300">Entradas automáticas sem comissão de agências externas</p>
              </div>
              <span className="chip text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-bold">
                {bookings.filter((b) => b.kind === "quarto").length} reserva(s)
              </span>
            </div>

            <div className="space-y-2.5">
              {bookings.filter((b) => b.kind === "quarto").length === 0 ? (
                <p className="text-xs text-areia-300/80 p-3 rounded-xl bg-white/5">
                  Nenhuma reserva de demonstração recente. A sincronização entre dispositivos exige o backend.
                </p>
              ) : (
                bookings.filter((b) => b.kind === "quarto").map((b) => (
                  <div key={b.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300">{b.id}</span>
                        <span className="font-semibold text-white">{b.title}</span>
                      </div>
                      <p className="text-areia-200 mt-1 font-medium">
                        👤 Hóspede: <strong>{b.guest}</strong>
                      </p>
                      <p className="text-areia-300 text-[11px]">
                        Período: {b.start} {b.end ? `até ${b.end}` : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-bold text-sm text-emerald-400">
                        {brl(b.split.gross)}
                      </span>
                      <span className="block text-[10px] text-areia-300 uppercase font-semibold">
                        Reserva de demonstração
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Sincronização iCal e IA de Última Hora */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="label flex items-center gap-1 text-areia-100 font-bold">
                  <RefreshCw size={13} /> Sincronização iCal (Booking & Airbnb)
                </p>
                <span className="chip text-[10px] text-mata-400 border-mata-400/30">Sem Overbooking</span>
              </div>
              <p className="text-xs text-areia-300 mb-3">
                Cole o link .ics do seu anúncio no Airbnb ou Booking para sincronizar os bloqueios automaticamente.
              </p>

              <select 
                className="input cursor-pointer" 
                value={target} 
                onChange={(e) => setTarget(e.target.value)}
              >
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>

              <div className="mt-2.5 flex gap-2">
                <input 
                  className="input flex-1 text-xs" 
                  placeholder="https://www.airbnb.com.br/calendar/ical/...ics" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                />
                <button 
                  className="btn-primary min-h-[44px] px-3.5 text-xs font-semibold" 
                  onClick={importUrl} 
                  disabled={!url}
                >
                  <Link2 size={14} /> Sincronizar
                </button>
              </div>

              <textarea 
                className="input mt-2.5 h-20 font-mono text-[11px]" 
                placeholder="...ou cole o conteúdo do calendário .ics aqui" 
                value={ics} 
                onChange={(e) => setIcs(e.target.value)} 
              />
              <button 
                className="btn-ghost mt-2 w-full min-h-[44px] text-xs font-medium" 
                disabled={!ics} 
                onClick={() => merge(parseIcs(ics))}
              >
                Importar Texto Colado
              </button>

              {msg && <p className="mt-2 text-xs text-mata-400 font-medium">{msg}</p>}

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="label font-bold text-areia-100">Exportar Calendário do Caraíva Digital</p>
                <p className="text-xs text-areia-300 mt-0.5">
                  Importe esse link no seu Airbnb e Booking para que eles bloqueiem as datas vendidas aqui.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rooms.map((r) => (
                    <button 
                      key={r.id} 
                      className="btn-ghost min-h-[40px] text-xs px-3" 
                      onClick={() => exportIcs(r.id)}
                    >
                      <Download size={13} /> {r.name}.ics
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna da Direita: IA Last Minute e Plaquinhas */}
            <div className="space-y-4">
              <div className="card bg-gradient-to-br from-mata-500/15 via-noite-800 to-noite-900 p-5 border-mata-400/20">
                <p className="label flex items-center gap-1.5 text-coral-400 font-bold">
                  <Sparkles size={13} /> IA · Oportunidades de Diária Hoje (Last Minute)
                </p>
                <p className="text-xs text-areia-300 mt-1">
                  Quartos que ficariam vagos são ofertados com desconto aos turistas já presentes em Caraíva.
                </p>

                <div className="mt-4 space-y-2.5">
                  {freeTonight.length ? freeTonight.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 text-sm">
                      <div>
                        <p className="font-medium text-areia-100">{r.name}</p>
                        <p className="text-xs text-areia-300 line-through">Diária normal: {brl(r.nightly)}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-coral-400">
                          {brl(r.lastMinute ?? Math.round(r.nightly * 0.72))}
                        </span>
                        <p className="text-[10px] text-mata-400 font-medium">Sugerido para hoje</p>
                      </div>
                    </div>
                  )) : (
                    <p className="p-3 rounded-xl bg-mata-400/10 text-mata-400 text-xs font-medium">
                      Todos os quartos estão ocupados para a noite de hoje! 🎉
                    </p>
                  )}
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="label flex items-center gap-1 font-bold text-areia-100">
                    <Tag size={13} /> Plaquinhas dos Quartos (Afiliado Pousada)
                  </p>
                  <span className="text-[11px] text-mata-400 font-medium">Comissão no consumo</span>
                </div>
                <div className="space-y-2">
                  {nfcTags.filter((t) => t.establishmentId === "pous-flor").map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                      <span className="font-medium text-areia-100">{t.label}</span>
                      <code className="text-coral-400 font-mono bg-coral-400/10 px-2 py-0.5 rounded">
                        /tag/{t.id}
                      </code>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-areia-300/80">
                  Quando o hóspede pede água ou contrata um passeio pela plaquinha do quarto, a pousada ganha comissão de afiliado automaticamente.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
