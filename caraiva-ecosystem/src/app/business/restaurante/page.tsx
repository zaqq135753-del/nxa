"use client";
import { useState } from "react";
import { 
  Bell, 
  Check, 
  CreditCard, 
  Music, 
  Nfc, 
  Ticket, 
  UserCheck, 
  Users, 
  UtensilsCrossed 
} from "lucide-react";
import { FinancialHub } from "@/components/FinancialHub";
import { PlaqueStrategyHub } from "@/components/PlaqueStrategyHub";
import { ProductInventoryManager } from "@/components/ProductInventoryManager";
import { brl, byId, establishments } from "@/lib/data";

interface WaitlistParty {
  id: string;
  name: string;
  pax: number;
  phone: string;
  time: string;
  status: "esperando" | "chamado" | "sentado";
}

const INITIAL_WAITLIST: WaitlistParty[] = [
  { id: "W1", name: "Mariana Costa", pax: 2, phone: "(11) 98765-4321", time: "19:40", status: "esperando" },
  { id: "W2", name: "Felipe & Amigos", pax: 5, phone: "(21) 99123-4567", time: "19:50", status: "esperando" },
  { id: "W3", name: "Juliana Santos", pax: 3, phone: "(31) 98888-2211", time: "19:55", status: "chamado" },
];

export default function RestauranteDashboard() {
  const storeId = "rest-rio";
  const est = byId(establishments, storeId);
  const [activeTab, setActiveTab] = useState<"fila" | "cardapio" | "eventos" | "financeiro" | "placa">("fila");
  const [waitlist, setWaitlist] = useState<WaitlistParty[]>(INITIAL_WAITLIST);
  const [ticketSales, setTicketSales] = useState([
    { id: "EV1", title: "Forró do Ouriço Especial Sábado", date: "Hoje · 22:30", price: 6000, sold: 48, total: 100 },
    { id: "EV2", title: "Roda de Samba na Beira do Rio", date: "Amanhã · 17:00", price: 4000, sold: 32, total: 80 },
  ]);

  const callParty = (id: string) => {
    setWaitlist((prev) => prev.map((p) => p.id === id ? { ...p, status: "chamado" } : p));
  };

  const seatParty = (id: string) => {
    setWaitlist((prev) => prev.filter((p) => p.id !== id));
  };

  const waitingCount = waitlist.filter((w) => w.status === "esperando").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <p className="label">Caraíva Business · Gastronomia & Noite</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-areia-50">
            {est?.name || "Cozinha do Rio Caraíva"}
          </h1>
          <p className="text-xs text-areia-300 mt-0.5">Gestor de mesas, fila de espera digital e ingressos</p>
        </div>

        <div className="chip border-coral-400/40 text-coral-400 font-bold px-3 py-1.5">
          <Users size={13} /> {waitingCount} grupos aguardando mesa
        </div>
      </header>

      {/* Tabs B2B (UI/UX Pro Max) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab("fila")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "fila" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <UtensilsCrossed size={15} /> Fila Digital (Buzzer Virtual)
        </button>

        <button
          onClick={() => setActiveTab("cardapio")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "cardapio" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <UtensilsCrossed size={15} /> Cardápio & Estoque Ao Vivo
        </button>

        <button
          onClick={() => setActiveTab("eventos")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "eventos" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Music size={15} /> Forrós & Ingressos Antecipados
        </button>

        <button
          onClick={() => setActiveTab("financeiro")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "financeiro" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <CreditCard size={15} /> Financeiro & Comandas
        </button>

        <button
          onClick={() => setActiveTab("placa")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "placa" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Nfc size={15} /> Placa nas Mesas
        </button>
      </div>

      {activeTab === "cardapio" && (
        <ProductInventoryManager 
          establishmentId={storeId} 
          availableCategories={["Pratos Principais", "Petiscos", "Bebidas & Drinks", "Sobremesas"]} 
        />
      )}
      {activeTab === "financeiro" && <FinancialHub establishmentId={storeId} />}
      {activeTab === "placa" && <PlaqueStrategyHub establishmentId={storeId} />}

      {/* Aba de Fila de Espera Digital */}
      {activeTab === "fila" && (
        <div className="space-y-6 animate-rise">
          <div className="card p-5 bg-gradient-to-r from-coral-500/10 via-noite-800 to-noite-900 border-coral-400/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl text-areia-50">Fila de Espera Digital Ativa</h3>
              <p className="text-xs text-areia-300">
                O turista lê a plaquinha na entrada, entra na fila e aguarda na praia. Quando a mesa libera, o celular dele apita!
              </p>
            </div>
            <div className="flex gap-2">
              <span className="chip text-xs bg-black/40 border-white/10 text-areia-200">
                Tempo médio de espera: <strong>25 min</strong>
              </span>
            </div>
          </div>

          <div className="card p-5">
            <h4 className="label font-bold text-areia-100 mb-3">Grupos na Fila</h4>
            {waitlist.length === 0 ? (
              <p className="text-xs text-areia-300 py-6 text-center">Nenhum cliente na fila agora. Todas as mesas liberadas!</p>
            ) : (
              <div className="divide-y divide-white/5">
                {waitlist.map((w, index) => (
                  <div key={w.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-sm font-bold font-display text-areia-50">
                        {index + 1}º
                      </span>
                      <div>
                        <p className="font-semibold text-sm text-areia-50">{w.name}</p>
                        <p className="text-xs text-areia-300">
                          {w.pax} pessoas · Chegou às {w.time} · {w.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {w.status === "chamado" ? (
                        <>
                          <span className="chip border-mata-400/40 text-mata-400 animate-pulse text-[11px]">
                            Mesa Chamada! Aguardando entrada
                          </span>
                          <button 
                            onClick={() => seatParty(w.id)}
                            className="btn-primary min-h-[40px] text-xs px-3"
                          >
                            <UserCheck size={14} /> Sentou à Mesa
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => callParty(w.id)}
                          className="btn-ghost min-h-[40px] text-xs px-3.5 border-coral-400/40 text-coral-400 hover:bg-coral-500/10"
                        >
                          <Bell size={14} /> Chamar Mesa (Buzzer)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Aba de Ingressos de Forró e Eventos */}
      {activeTab === "eventos" && (
        <div className="space-y-6 animate-rise">
          <div className="card p-5">
            <h3 className="label font-bold text-areia-100 mb-3">Ingressos de Forró & Atrações Musicais</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {ticketSales.map((ev) => (
                <div key={ev.id} className="card p-4 border-white/10 bg-white/[0.02]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-display text-lg text-areia-50 font-bold">{ev.title}</p>
                      <p className="text-xs text-areia-300 mt-0.5">{ev.date}</p>
                    </div>
                    <span className="font-display text-base font-bold text-coral-400">{brl(ev.price)}</span>
                  </div>

                  <div className="mt-3.5">
                    <div className="flex justify-between text-xs text-areia-300 mb-1">
                      <span>Vendas antecipadas:</span>
                      <strong>{ev.sold} de {ev.total} ingressos</strong>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-coral-400" style={{ width: `${(ev.sold / ev.total) * 100}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-mata-400 font-bold">Faturado: {brl(ev.sold * ev.price)}</span>
                    <button className="btn-ghost min-h-[36px] text-xs px-3">
                      <Ticket size={13} /> Portaria QR Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
