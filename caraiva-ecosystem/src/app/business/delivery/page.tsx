"use client";
import { useEffect, useRef, useState } from "react";
import { 
  Bell, 
  BellOff, 
  Bike, 
  Check, 
  CreditCard, 
  Kanban, 
  Nfc, 
  Sparkles, 
  Package,
  X 
} from "lucide-react";
import { FinancialHub } from "../../../components/FinancialHub";
import { PlaqueStrategyHub } from "../../../components/PlaqueStrategyHub";
import { ProductInventoryManager } from "../../../components/ProductInventoryManager";
import { brl, byId, establishments, ZONES } from "../../../lib/data";
import { demandForecast } from "../../../lib/ai";
import { beep, useStore, type Order, type OrderStatus } from "../../../lib/store";

const COLS: { id: OrderStatus; title: string }[] = [
  { id: "novo", title: "Novos" },
  { id: "preparando", title: "Separando" },
  { id: "em_rota", title: "A caminho" },
  { id: "entregue", title: "Entregues" },
];

export default function DeliveryDashboard() {
  const stores = establishments.filter((e) => e.niche === "delivery");
  const [storeId, setStoreId] = useState(stores[0].id);
  const [activeTab, setActiveTab] = useState<"operacao" | "estoque" | "financeiro" | "placa">("operacao");
  const { orders, products, updateOrder, toggleProductAvailability } = useStore();
  const [sound, setSound] = useState(true);
  const [occ, setOcc] = useState(85);
  const [holiday, setHoliday] = useState(true);

  const mine = orders.filter((o) => o.establishmentId === storeId);
  const pending = mine.filter((o) => o.status === "novo").length;
  const prev = useRef(pending);

  // Alerta sonoro contínuo enquanto houver pedido pendente
  useEffect(() => {
    if (pending > prev.current && sound) beep();
    prev.current = pending;
    if (!pending || !sound) return;
    const t = setInterval(beep, 6000);
    return () => clearInterval(t);
  }, [pending, sound]);

  const card = (o: Order) => (
    <div 
      key={o.id} 
      className={`card animate-rise p-3.5 transition ${
        o.status === "novo" ? "animate-pulsering border-coral-400/60 bg-coral-500/[0.04]" : ""
      }`}
    >
      <div className="flex justify-between items-center text-sm">
        <span className="font-mono font-bold text-areia-100">{o.id}</span>
        <span className="font-semibold text-areia-50">{brl(o.split.gross)}</span>
      </div>
      <ul className="mt-2 space-y-0.5 text-xs text-areia-200">
        {o.items.map((i) => (
          <li key={i.name}>
            <strong className="text-areia-50">{i.qty}×</strong> {i.name}
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-[11px] text-areia-300">
        📍 {o.address} · <span className="text-areia-200">{ZONES.find((z) => z.id === o.zone)?.name}</span>
      </p>
      <p className="mt-1 text-[11px] text-mata-400 font-medium">
        Pagamento simulado (não cobrado) · repasse ilustrativo: <strong>{brl(o.split.merchant)}</strong>
      </p>

      {/* Botões operacionais com touch target >= 44px (UI/UX Pro Max) */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {o.status === "novo" && (
          <>
            {[20, 40].map((m) => (
              <button 
                key={m} 
                className="btn-primary min-h-[44px] px-3.5 text-xs font-semibold"
                onClick={() => updateOrder(o.id, { status: "preparando", etaMin: m })}
              >
                <Check size={14} /> Aceitar ({m}m)
              </button>
            ))}
            <button 
              className="btn-ghost min-h-[44px] px-3 text-xs text-red-400 hover:bg-red-500/10"
              onClick={() => updateOrder(o.id, { status: "recusado" })}
              title="Recusar pedido"
            >
              <X size={14} />
            </button>
          </>
        )}
        {o.status === "preparando" && (
          <button 
            className="btn-primary min-h-[44px] w-full text-xs font-semibold"
            onClick={() => updateOrder(o.id, { status: "em_rota" })}
          >
            <Bike size={14} /> Chamar entregador da vila
          </button>
        )}
        {o.status === "em_rota" && (
          <button 
            className="btn-ghost min-h-[44px] w-full text-xs border-mata-400/40 text-mata-400 hover:bg-mata-400/10"
            onClick={() => updateOrder(o.id, { status: "entregue" })}
          >
            <Check size={14} /> Confirmar entrega · frete {brl(o.split.courier)} ao entregador
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header com seleção de negócio e alerta sonoro */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <p className="label">Caraíva Business · Delivery & Conveniência</p>
          <select 
            className="mt-1 bg-transparent font-display text-3xl sm:text-4xl outline-none cursor-pointer"
            value={storeId} 
            onChange={(e) => setStoreId(e.target.value)}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id} className="bg-noite-900 text-base">
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="btn-ghost min-h-[44px] text-xs px-3.5"
            onClick={() => { setSound(!sound); if (!sound) beep(); }}
          >
            {sound ? <Bell size={14} className="text-coral-400" /> : <BellOff size={14} />} 
            Alerta {sound ? "Ligado" : "Mudo"}
          </button>
        </div>
      </header>

      {/* Tabs Principais do Caraíva Business (UI/UX Pro Max: 44px min height, spacing) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab("operacao")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "operacao" 
              ? "bg-areia-50 text-noite-900 shadow-md" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Kanban size={15} /> Gestão de Pedidos
          {pending > 0 && (
            <span className="rounded-full bg-coral-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {pending}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("estoque")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "estoque" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <Package size={15} /> Estoque & Cardápio
        </button>

        <button
          onClick={() => setActiveTab("financeiro")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition min-h-[44px] shrink-0 ${
            activeTab === "financeiro" 
              ? "bg-areia-50 text-noite-900 shadow-md font-bold" 
              : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
          }`}
        >
          <CreditCard size={15} /> Financeiro & Extrato
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
      {activeTab === "estoque" && (
        <div className="animate-rise">
          <ProductInventoryManager 
            establishmentId={storeId} 
            availableCategories={["Água & Gelo", "Bebidas", "Mercearia", "Carvão & Utilitários"]} 
          />
        </div>
      )}
      {activeTab === "financeiro" && <FinancialHub establishmentId={storeId} />}
      {activeTab === "placa" && <PlaqueStrategyHub establishmentId={storeId} />}

      {activeTab === "operacao" && (
        <div className="space-y-6 animate-rise">
          {!mine.length && (
            <div className="card p-4 text-xs text-areia-300 flex items-center justify-between gap-4 border-coral-400/30 bg-coral-500/[0.03]">
              <p>💡 Abra <strong>/turista/delivery</strong> em outra aba ou no celular e faça um pedido de teste — ele tocará aqui imediatamente.</p>
              <a href="/turista/delivery" target="_blank" className="btn-primary min-h-[44px] text-xs px-3 shrink-0">
                Fazer Pedido Teste
              </a>
            </div>
          )}

          {/* Kanban operacional de 4 colunas */}
          <section className="grid gap-4 md:grid-cols-4">
            {COLS.map((c) => {
              const count = mine.filter((o) => o.status === c.id).length;
              return (
                <div key={c.id} className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5">
                    <p className="label font-bold text-areia-100">{c.title}</p>
                    <span className="chip text-[10px] px-2 py-0.5">{count}</span>
                  </div>
                  <div className="space-y-3">
                    {mine.filter((o) => o.status === c.id).map(card)}
                    {count === 0 && (
                      <p className="py-6 text-center text-xs text-areia-300/40">Nenhum pedido</p>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Seção inferior: Estoque Rápido + Previsão de Demanda IA */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="label font-bold text-areia-100">Estoque Rápido no Balcão</p>
                <span className="text-[11px] text-areia-300">Pausa instantânea no app</span>
              </div>
              <div className="space-y-2.5">
                {products.filter((p) => p.establishmentId === storeId).map((p) => {
                  const on = p.available && (p.stock === undefined || p.stock > 0);
                  return (
                    <label key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 text-sm">
                      <div>
                        <span className="font-medium text-areia-100">{p.emoji} {p.name}</span>
                        {p.stock !== undefined && (
                          <span className="block text-[11px] text-areia-300">Estoque: {p.stock} un</span>
                        )}
                      </div>
                      <button 
                        onClick={() => toggleProductAvailability(p.id)} 
                        className={`min-h-[44px] min-w-[56px] flex items-center justify-center`}
                        aria-label={`Disponibilidade de ${p.name}`}
                      >
                        <span className={`h-6 w-11 rounded-full p-0.5 transition block ${on ? "bg-mata-400" : "bg-white/10"}`}>
                          <span className={`block h-5 w-5 rounded-full bg-areia-50 transition transform ${on ? "translate-x-5" : ""}`} />
                        </span>
                      </button>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="card bg-gradient-to-br from-coral-500/10 via-noite-800 to-noite-900 p-5 border-coral-400/20">
              <p className="label flex items-center gap-1.5 text-coral-400 font-bold">
                <Sparkles size={13} /> IA · Previsão de Demanda de Caraíva
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-areia-300">
                Ocupação estimada da vila:
                <input 
                  type="range" 
                  min={20} 
                  max={100} 
                  value={occ} 
                  onChange={(e) => setOcc(+e.target.value)} 
                  className="flex-1 accent-coral-400 min-h-[36px]" 
                /> 
                <strong className="text-areia-50">{occ}%</strong>
              </div>
              <label className="mt-2.5 flex items-center gap-2 text-xs text-areia-300 cursor-pointer min-h-[36px]">
                <input 
                  type="checkbox" 
                  checked={holiday} 
                  onChange={(e) => setHoliday(e.target.checked)} 
                  className="accent-coral-400 h-4 w-4" 
                /> 
                Fim de semana prolongado / Alta temporada
              </label>

              <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                {demandForecast(occ, holiday).map((f) => (
                  <div key={f.item} className="flex justify-between items-center text-xs p-2 rounded-lg bg-black/20">
                    <span className="text-areia-200">{f.item}</span>
                    <span className="font-semibold text-coral-400">
                      Estocar ~{f.suggested} {f.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
