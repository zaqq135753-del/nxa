"use client";
import { useState } from "react";
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Sparkles, 
  Plus, 
  Minus, 
  CheckCircle2, 
  TrendingUp, 
  QrCode, 
  DollarSign, 
  Truck, 
  Clock, 
  Search,
  Filter
} from "lucide-react";
import { retailItems, byId, establishments, brl, type RetailItem } from "@/lib/data";
import { useStore } from "@/lib/store";
import { FinancialHub } from "@/components/FinancialHub";
import { PlaqueStrategyHub } from "@/components/PlaqueStrategyHub";

export default function LojaBusinessPage() {
  const estId = "loja-pataxo";
  const est = byId(establishments, estId) || establishments[0];
  const { orders, retailItems: inventoryItems, updateRetailItem } = useStore();
  const [tab, setTab] = useState<"estoque" | "encomendas" | "financeiro" | "placa">("estoque");
  const items = inventoryItems.filter(item => item.establishmentId === estId);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);

  // Controle de estoque rápido (+ / -)
  const adjustStock = (id: string, delta: number) => {
    const item = items.find(item => item.id === id);
    if (item) updateRetailItem(id, { stock: Math.max(0, item.stock + delta) });
  };

  const filteredItems = filterCategory === "all" ? items : items.filter((i) => i.category === filterCategory);

  // Pedidos de loja no store
  const storeOrders = orders.filter((o) => o.establishmentId === estId);

  return (
    <div className="min-h-screen bg-noite-950 pb-20 text-areia-100">
      {/* Top Banner de Demonstração / Gestão */}
      <div className="border-b border-coral-500/20 bg-coral-950/30 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500/20 text-coral-300 ring-1 ring-coral-500/30">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-areia-50">{est.name}</h1>
                <span className="rounded-full bg-coral-500/20 px-2 py-0.5 text-[10px] font-semibold text-coral-300">
                  Artesanato & Moda Praia
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Vitrine Ativa
                </span>
              </div>
              <p className="text-xs text-areia-300">
                Biojoias · Peças em Madeira Nobre · Moda Praia · Vitrine Digital nas Pousadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-areia-400">
              Estoque Total: <strong className="text-areia-100">{items.reduce((s, i) => s + i.stock, 0)} peças</strong>
            </span>
          </div>
        </div>
      </div>

      {notice && (
        <div className="bg-coral-500/20 border-b border-coral-500/40 px-4 py-2.5 text-center text-xs font-medium text-coral-200">
          {notice}
        </div>
      )}

      {/* Tabs de Navegação */}
      <div className="sticky top-10 z-40 border-b border-white/5 bg-noite-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-2 px-4 py-2 overflow-x-auto scrollbar-none touch-pan-x">
          {[
            { id: "estoque", label: "Vitrine & Estoque", icon: Package, badge: items.length },
            { id: "encomendas", label: "Vendas & Entregas na Pousada", icon: ShoppingBag, badge: storeOrders.length },
            { id: "financeiro", label: "Extrato Pix", icon: DollarSign },
            { id: "placa", label: "Placa NFC na Vitrine", icon: QrCode },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id as any)}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
                tab === id
                  ? "bg-coral-500/20 text-coral-200 ring-1 ring-coral-500/30"
                  : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
              }`}
            >
              <Icon size={15} />
              {label}
              {typeof badge === "number" && badge > 0 && (
                <span className="rounded-full bg-coral-500 px-1.5 py-0.5 text-[10px] font-bold text-noite-950">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <main className="mx-auto max-w-6xl px-4 pt-6">
        {/* TAB 1: ESTOQUE & VITRINE */}
        {tab === "estoque" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Produtos no Catálogo</span>
                <p className="mt-1 text-2xl font-bold text-areia-50">{items.length}</p>
                <span className="text-[10px] text-emerald-400 font-medium">Sincronizado no Caraíva.digital</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Vendas na Pousada</span>
                <p className="mt-1 text-2xl font-bold text-coral-400">62%</p>
                <span className="text-[10px] text-areia-400">Turistas compram do quarto</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Ticket Médio</span>
                <p className="mt-1 text-2xl font-bold text-areia-50">R$ 168,00</p>
                <span className="text-[10px] text-areia-400">Biojoias e peças decorativas</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Taxa Caraíva.digital</span>
                <p className="mt-1 text-2xl font-bold text-mata-400">R$ 1,50 / ped</p>
                <span className="text-[10px] text-areia-400">Sem comissão abusiva</span>
              </div>
            </div>

            {/* Categorias Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: "all", label: "Todas as Peças" },
                  { id: "biojoias", label: "Biojoias & Colares" },
                  { id: "decoracao", label: "Decoração & Madeira" },
                  { id: "vestuario", label: "Linho & Vestuário" },
                  { id: "lembrancas", label: "Lembranças & Cangas" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilterCategory(c.id)}
                    className={`min-h-[40px] rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                      filterCategory === c.id
                        ? "bg-coral-500 text-noite-950 shadow-md shadow-coral-500/20"
                        : "bg-white/5 text-areia-300 hover:bg-white/10"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-noite-900/60 transition hover:border-coral-500/30"
                >
                  <div className="relative h-44 w-full bg-noite-950">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur ${
                          item.stock > 0
                            ? "bg-emerald-500/80 text-white"
                            : "bg-rose-500/80 text-white"
                        }`}
                      >
                        {item.stock > 0 ? `${item.stock} em estoque` : "Esgotado"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-coral-400">
                        Artesão: {item.artisan}
                      </span>
                      <h3 className="text-sm font-bold text-areia-50 mt-0.5 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-areia-300 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] text-areia-400">Preço:</span>
                        <span className="text-base font-black text-emerald-400">{brl(item.price)}</span>
                      </div>

                      {/* Botões de Estoque Rápido */}
                      <div className="flex items-center justify-between rounded-xl bg-white/5 p-1.5">
                        <span className="text-xs text-areia-300 font-medium pl-2">Estoque:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustStock(item.id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-areia-200 hover:bg-rose-500/20 hover:text-rose-300 active:scale-95 transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-mono text-sm font-bold text-areia-50 min-w-[20px] text-center">
                            {item.stock}
                          </span>
                          <button
                            onClick={() => adjustStock(item.id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-areia-200 hover:bg-emerald-500/20 hover:text-emerald-300 active:scale-95 transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ENCOMENDAS */}
        {tab === "encomendas" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-areia-50">Pedidos Recebidos com Entrega na Pousada</h2>
              <p className="text-xs text-areia-400">
                Turistas que escanearam a vitrine na pousada e pediram embrulhado para presente
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-coral-500/30 bg-coral-950/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-areia-50">#LOJA-89</span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        Pagamento ilustrativo · R$ 220,00
                      </span>
                    </div>
                    <p className="text-xs text-areia-200 mt-1 font-semibold">
                      1x Gamela em Madeira Nobre Reaproveitada
                    </p>
                    <p className="text-[11px] text-areia-400 mt-0.5 flex items-center gap-1.5">
                      <Truck size={12} className="text-coral-400" /> Entregar em: Pousada Flor de Caraíva · Bangalô Coqueiro
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert("Entregador acionado para buscar a peça na loja!")}
                      className="min-h-[44px] rounded-xl bg-coral-600 px-4 py-2 text-xs font-semibold text-white hover:bg-coral-500 active:scale-95 transition"
                    >
                      Chamar Entregador na Areia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCEIRO */}
        {tab === "financeiro" && (
          <FinancialHub establishmentId={estId} />
        )}

        {/* TAB 4: PLACA */}
        {tab === "placa" && (
          <PlaqueStrategyHub establishmentId={estId} />
        )}
      </main>
    </div>
  );
}
