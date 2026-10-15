"use client";
import { useState } from "react";
import { 
  CloudRain, 
  CreditCard, 
  Nfc, 
  Sailboat, 
  ScanLine, 
  Sparkles, 
  Users, 
  Waves 
} from "lucide-react";
import { FinancialHub } from "@/components/FinancialHub";
import { PlaqueStrategyHub } from "@/components/PlaqueStrategyHub";
import { TourInventoryManager } from "@/components/TourInventoryManager";
import { brl, byId, establishments } from "@/lib/data";
import { seatsTaken } from "@/lib/pms";
import { useStore } from "@/lib/store";

const TIDE = [
  { h: "05:40", m: 0.3, low: true }, 
  { h: "11:52", m: 2.1, low: false }, 
  { h: "18:05", m: 0.4, low: true }
];

export default function PasseiosOps() {
  const ops = establishments.filter((e) => e.niche === "tours");
  const [opId, setOpId] = useState(ops[0].id);
  const [activeTab, setActiveTab] = useState<"operacao" | "roteiros" | "financeiro" | "placa">("operacao");
  const { tours, bookings, checkIn, toggleTourAvailability } = useStore();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [alerted, setAlerted] = useState(false);

  const myTours = tours.filter((t) => t.establishmentId === opId);

  function validate() {
    const b = checkIn(code, { kind: "passeio", refIds: myTours.map(t => t.id), allowSimulation: true });
    setResult(
      b && b.kind === "passeio" && myTours.some((t) => t.id === b.refId)
        ? { ok: true, text: `✓ Código de demonstração ${b.id} válido. Nenhum pagamento Pix foi verificado.` }
        : { ok: false, text: "Voucher não encontrado ou inválido para este operador." }
    );
    setCode("");
  }

  return (
    <div className="space-y-6">
      {/* Header com seleção de operador */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <p className="label">Caraíva Business · Passeios & Ecoturismo</p>
          <select 
            className="mt-1 bg-transparent font-display text-3xl sm:text-4xl outline-none cursor-pointer"
            value={opId} 
            onChange={(e) => { setOpId(e.target.value); setResult(null); }}
          >
            {ops.map((o) => (
              <option key={o.id} value={o.id} className="bg-noite-900 text-base">
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="btn-ghost min-h-[44px] text-xs px-3.5 border-rio-400/30 text-rio-400 hover:bg-rio-400/10"
          onClick={() => setAlerted(true)}
        >
          <CloudRain size={14} /> Mar Grosso: Notificar Passageiros
        </button>
      </header>

      {alerted && (
        <div className="card border-rio-400/40 p-4 text-xs text-rio-300 bg-rio-500/[0.05] flex items-center justify-between">
          <p>📣 Alerta disparado aos passageiros com sugestão de reagendamento ou cancelamento sem taxa.</p>
          <button onClick={() => setAlerted(false)} className="underline text-areia-300 text-[11px]">Fechar</button>
        </div>
      )}

      {/* Tabs B2B (UI/UX Pro Max) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab("operacao")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "operacao" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Sailboat size={15} /> Saídas do Dia & Vagas
        </button>

        <button
          onClick={() => setActiveTab("roteiros")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "roteiros" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Sparkles size={15} /> Roteiros & Preços
        </button>

        <button
          onClick={() => setActiveTab("financeiro")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "financeiro" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <CreditCard size={15} /> Financeiro & Vouchers
        </button>

        <button
          onClick={() => setActiveTab("placa")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "placa" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Nfc size={15} /> Placa Caraíva.digital
        </button>
      </div>

      {/* Conteúdo dinâmico da Tab selecionada */}
      {activeTab === "roteiros" && (
        <div className="animate-rise">
          <TourInventoryManager establishmentId={opId} />
        </div>
      )}
      {activeTab === "financeiro" && <FinancialHub establishmentId={opId} />}
      {activeTab === "placa" && <PlaqueStrategyHub establishmentId={opId} />}

      {activeTab === "operacao" && (
        <div className="space-y-6 animate-rise">
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Saídas e Lista de Passageiros */}
            <div className="space-y-4 lg:col-span-2">
              <p className="label font-bold text-areia-100">Escala de Saídas de Amanhã</p>
              {myTours.map((t) => {
                const taken = seatsTaken(t.id, t.booked, bookings);
                const pax = bookings.filter((b) => b.kind === "passeio" && b.refId === t.id);
                return (
                  <div key={t.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-xl text-areia-50">{t.departure} · {t.name}</p>
                        <p className="text-xs text-areia-300">Ponto de encontro: {t.meetingPoint}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTourAvailability(t.id)}
                          className={`text-xs px-2.5 py-1 rounded-full border font-bold transition ${
                            t.available === false
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          {t.available === false ? "Pausado (Fechado)" : "Vagas Abertas"}
                        </button>
                        <span className="chip text-xs">
                          <Users size={12} /> {taken}/{t.seats} vagas ocupadas
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div 
                        className="h-full bg-coral-400 transition-all duration-500" 
                        style={{ width: `${(taken / t.seats) * 100}%` }} 
                      />
                    </div>

                    <div className="mt-4 border-t border-white/5 pt-3">
                      <p className="text-xs font-semibold text-areia-200 mb-2">Lista de Passageiros Confirmados:</p>
                      <ul className="space-y-1.5 text-xs">
                        {t.booked > 0 && (
                          <li className="text-areia-300/80 italic">
                            • {t.booked} vagas reservadas externamente
                          </li>
                        )}
                        {pax.map((b) => (
                          <li key={b.id} className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02]">
                            <span className="font-medium text-areia-100">• {b.guest} ({b.seats} pax)</span>
                            <span className={b.checkedIn ? "text-mata-400 font-semibold" : "text-areia-300 font-mono"}>
                              {b.checkedIn ? "Embarcado ✓" : b.id}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 text-right">
                      <span className="text-xs text-areia-300">
                        Previsão de repasse deste passeio: <strong className="text-mata-400">{brl(pax.reduce((s, b) => s + b.split.merchant, 0))}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Check-in e Tábua de Marés */}
            <div className="space-y-4">
              <div className="card p-5">
                <p className="label flex items-center gap-1.5 font-bold text-areia-100">
                  <ScanLine size={13} className="text-coral-400" /> Check-in de Embarque
                </p>
                <p className="text-xs text-areia-300 mt-1 mb-3">
                  Digite o código do voucher do turista para validar o embarque.
                </p>

                <div className="flex gap-2">
                  <input 
                    className="input font-mono uppercase text-sm" 
                    placeholder="Ex: CD-XXXXX" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && validate()} 
                  />
                  <button 
                    className="btn-primary min-h-[44px] px-4 text-xs font-semibold" 
                    onClick={validate} 
                    disabled={!code}
                  >
                    Validar
                  </button>
                </div>

                {result && (
                  <p className={`mt-3 rounded-xl p-3 text-xs font-medium ${
                    result.ok ? "bg-mata-400/20 text-mata-400 border border-mata-400/30" : "bg-red-500/10 text-red-300 border border-red-500/30"
                  }`}>
                    {result.text}
                  </p>
                )}
              </div>

              <div className="card bg-gradient-to-br from-rio-500/15 via-noite-800 to-noite-900 p-5 border-rio-400/20">
                <p className="label flex items-center gap-1.5 font-bold text-rio-400">
                  <Waves size={13} /> Tábua de Marés de Amanhã
                </p>
                <div className="mt-3 space-y-1.5">
                  {TIDE.map((t) => (
                    <div key={t.h} className="flex justify-between text-xs p-2 rounded-lg bg-black/20">
                      <span className="text-areia-200">{t.h}</span>
                      <span className={t.low ? "text-rio-400 font-semibold" : "text-areia-300"}>
                        {t.m.toFixed(1)}m · {t.low ? "Maré Baixa" : "Maré Alta"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3.5 p-2.5 rounded-xl bg-rio-400/10 border border-rio-400/20 text-xs text-areia-200 flex gap-2">
                  <Sparkles size={14} className="shrink-0 text-coral-400 mt-0.5" />
                  <span>
                    <strong>Dica de Navegação IA:</strong> Maré seca às 05:40 e 18:05. A travessia de buggy para Corumbau pela beira da praia é ideal entre as 07h e 09h30.
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
