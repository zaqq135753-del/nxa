"use client";
import { useState } from "react";
import { 
  AlertCircle, 
  Clock, 
  CreditCard, 
  Moon, 
  Nfc, 
  Pill, 
  ShieldAlert, 
  Sparkles, 
  Sun, 
  Truck 
} from "lucide-react";
import { FinancialHub } from "@/components/FinancialHub";
import { PlaqueStrategyHub } from "@/components/PlaqueStrategyHub";
import { ProductInventoryManager } from "@/components/ProductInventoryManager";
import { brl, byId, establishments, products } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function FarmaciaDashboard() {
  const [activeTab, setActiveTab] = useState<"operacao" | "estoque" | "financeiro" | "placa">("operacao");
  const [isNightShift, setIsNightShift] = useState(false);
  const [shiftFee, setShiftFee] = useState(2500); // R$ 25 taxa plantão
  const { orders, updateOrder } = useStore();

  const storeId = "farm-caraiva";
  const est = byId(establishments, storeId);
  const myOrders = orders.filter((o) => o.establishmentId === storeId);
  const farmProducts = products.filter((p) => p.establishmentId === storeId);

  return (
    <div className="space-y-6">
      {/* Header com Modo Plantão */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <p className="label">Caraíva Business · Saúde & Drogaria</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-areia-50">
            {est?.name || "Farmácia Caraíva"}
          </h1>
          <p className="text-xs text-areia-300 mt-0.5">Balcão de medicamentos, primeiros socorros e sol</p>
        </div>

        {/* Interruptor de Plantão Noturno */}
        <div className="flex items-center gap-3 card p-2.5 bg-white/[0.02] border-white/10">
          <div className="text-right">
            <p className="text-xs font-semibold text-areia-50 flex items-center justify-end gap-1">
              {isNightShift ? <Moon size={14} className="text-rio-400" /> : <Sun size={14} className="text-coral-400" />}
              {isNightShift ? "Modo Plantão Noturno" : "Horário Comercial"}
            </p>
            <p className="text-[11px] text-areia-300">
              {isNightShift ? `Taxa de emergência: ${brl(shiftFee)}` : "Loja física aberta na vila"}
            </p>
          </div>
          <button
            onClick={() => setIsNightShift(!isNightShift)}
            className={`min-h-[44px] min-w-[54px] flex items-center justify-center`}
            aria-label="Alternar plantão noturno"
          >
            <span className={`h-6 w-11 rounded-full p-0.5 transition block ${isNightShift ? "bg-rio-400" : "bg-white/15"}`}>
              <span className={`block h-5 w-5 rounded-full bg-areia-50 transition transform ${isNightShift ? "translate-x-5" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Navegação por Tabs B2B (UI/UX Pro Max) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab("operacao")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "operacao" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Pill size={15} /> Balcão & Pedidos de Emergência
        </button>

        <button
          onClick={() => setActiveTab("estoque")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "estoque" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Sparkles size={15} /> Estoque & Preços Ao Vivo
        </button>

        <button
          onClick={() => setActiveTab("financeiro")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "financeiro" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <CreditCard size={15} /> Financeiro & Repasses
        </button>

        <button
          onClick={() => setActiveTab("placa")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "placa" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Nfc size={15} /> Placa de Entrada da Farmácia
        </button>
      </div>

      {activeTab === "estoque" && (
        <ProductInventoryManager 
          establishmentId={storeId} 
          availableCategories={["Proteção Solar", "Repelentes & Insetos", "Pós-sol & Hidratação", "Primeiros Socorros", "Higiene"]} 
        />
      )}
      {activeTab === "financeiro" && <FinancialHub establishmentId={storeId} />}
      {activeTab === "placa" && <PlaqueStrategyHub establishmentId={storeId} />}

      {activeTab === "operacao" && (
        <div className="space-y-6 animate-rise">
          {isNightShift && (
            <div className="card border-rio-400/40 p-4 bg-rio-500/[0.08] flex items-center justify-between text-xs text-rio-200">
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={18} className="text-rio-400 shrink-0" />
                <span>
                  <strong>Plantão de demonstração:</strong> A integração para atualizar a disponibilidade na vitrine pública e alertar o plantonista ainda precisa ser conectada.
                </span>
              </div>
              <span className="chip border-rio-400/30 text-rio-400 font-bold shrink-0">Taxa {brl(shiftFee)}</span>
            </div>
          )}

          {/* Pedidos em Aberto */}
          <section className="card p-5">
            <h3 className="label font-bold text-areia-100 mb-3">Pedidos de Farmácia Recebidos</h3>
            {myOrders.length === 0 ? (
              <div className="py-8 text-center text-areia-300/60 border border-dashed border-white/10 rounded-xl">
                <Clock size={24} className="mx-auto mb-1.5 opacity-40" />
                <p className="text-xs">Nenhum pedido de remédio no momento.</p>
                <p className="mt-0.5 text-[11px]">Os pedidos desta tela são demonstrativos; a vitrine pública ainda não sincroniza com este painel.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map((o) => (
                  <div key={o.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-areia-50">{o.id} · {o.address}</p>
                      <p className="text-xs text-areia-300">{o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-mata-400 text-sm">{brl(o.split.merchant)}</span>
                      {o.status === "novo" && (
                        <button 
                          onClick={() => updateOrder(o.id, { status: "preparando", etaMin: 20 })}
                          className="btn-primary min-h-[40px] text-xs px-3"
                        >
                          Aceitar Pedido
                        </button>
                      )}
                      {o.status === "preparando" && (
                        <button 
                          onClick={() => updateOrder(o.id, { status: "em_rota" })}
                          className="btn-ghost min-h-[40px] text-xs px-3 border-mata-400/30 text-mata-400"
                        >
                          <Truck size={12} /> Despachar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Estoque de Primeiros Socorros & Praia */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <h3 className="label font-bold text-areia-100 mb-3">Estoque Rápido do Balcão</h3>
              <div className="space-y-2">
                {farmProducts.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-areia-100">{p.emoji} {p.name}</p>
                      <p className="text-areia-300">{p.category} · {brl(p.price)}</p>
                    </div>
                    <span className="chip border-mata-400/30 text-mata-400 font-bold">Em Estoque</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-gradient-to-br from-rio-500/10 via-noite-800 to-noite-900 p-5 border-rio-400/20">
              <p className="label flex items-center gap-1 text-rio-400 font-bold">
                <Sparkles size={13} /> IA · Alerta de Saúde em Caraíva
              </p>
              <p className="text-xs text-areia-300 mt-1">
                A IA analisa a previsão de sol forte e maré da semana para sugerir reforço de estoque:
              </p>
              <ul className="mt-3 space-y-2 text-xs">
                <li className="p-2 rounded-lg bg-black/20 text-areia-200 flex justify-between">
                  <span>Protetor solar FPS 50+:</span>
                  <strong className="text-coral-400">Demanda alta (sol pleno)</strong>
                </li>
                <li className="p-2 rounded-lg bg-black/20 text-areia-200 flex justify-between">
                  <span>Repelente Exposis (Borrachudos):</span>
                  <strong className="text-coral-400">Pico no fim de tarde na barra</strong>
                </li>
                <li className="p-2 rounded-lg bg-black/20 text-areia-200 flex justify-between">
                  <span>Antialérgicos & Pós-Sol:</span>
                  <strong className="text-mata-400">Estoque suficiente</strong>
                </li>
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
