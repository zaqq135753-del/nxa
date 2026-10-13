"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  UtensilsCrossed, 
  Compass, 
  Pill, 
  Sparkles, 
  Store, 
  Bike, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Bed, 
  PackageCheck,
  Flame,
  Layers,
  Smartphone,
  Sailboat,
  QrCode,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
  Eye,
  Activity
} from "lucide-react";
import { useStore } from "@/lib/store";
import { brl } from "@/lib/data";
import { Card3D } from "@/components/ui/Card3D";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { TextShimmer } from "@/components/ui/TextShimmer";
import { triggerConfetti } from "@/components/ui/Confetti";

export default function MasterDashboardPage() {
  const { 
    products, 
    rooms, 
    tours, 
    orders, 
    bookings, 
    addOrder, 
    updateRoom, 
    updateProduct 
  } = useStore();

  const [activeView, setActiveView] = useState<"duplo" | "business" | "turista">("duplo");
  const [selectedNiche, setSelectedNiche] = useState<"todos" | "restaurante" | "pousada" | "passeios" | "farmacia_loja">("todos");
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  // Consolidação de métricas
  const totalStockItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;
  const availableRooms = rooms.filter((r) => r.available !== false).length;
  const lastMinuteRooms = rooms.filter((r) => Boolean(r.lastMinute)).length;
  const pendingOrders = orders.filter((o) => o.status === "novo" || o.status === "preparando").length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.split?.gross || 0), 0) + 
                       bookings.reduce((acc, b) => acc + (b.split?.merchant || 0), 0);

  // Ações de Simulação do Laboratório
  const handleSimulateOrder = () => {
    const product = products.find((p) => p.establishmentId === "rest-silva") || products[0];
    const newOrder = addOrder({
      establishmentId: product.establishmentId,
      items: [{ name: product.name, qty: 2, price: product.price }],
      address: "Pousada Flor de Caraíva · Bangalô 04",
      zone: "Vila Beira-Rio",
      split: {
        gross: product.price * 2 + 1500,
        merchant: product.price * 2,
        courier: 1500,
        platform: 0,
      },
    });
    triggerConfetti();
    setSimulatedNotice(`Pedido simulado criado (#${newOrder.id})! Caiu imediatamente no KDS do Na Areia Delivery.`);
    setTimeout(() => setSimulatedNotice(null), 5000);
  };

  const handleTogglePromo = () => {
    const targetRoom = rooms[0];
    if (targetRoom) {
      const nextPromo = targetRoom.lastMinute ? undefined : 49000;
      updateRoom(targetRoom.id, { lastMinute: nextPromo });
      triggerConfetti();
      setSimulatedNotice(
        nextPromo 
          ? `Promoção "Só Hoje" ATIVADA para ${targetRoom.name}! Desconto de R$ 490 ao vivo no app do turista.` 
          : `Promoção "Só Hoje" desativada para ${targetRoom.name}. Preço normal restaurado.`
      );
      setTimeout(() => setSimulatedNotice(null), 5000);
    }
  };

  const handleToggleStock = () => {
    const item = products[0];
    if (item) {
      const nextStock = (item.stock || 0) > 0 ? 0 : 15;
      updateProduct(item.id, { stock: nextStock });
      triggerConfetti();
      setSimulatedNotice(
        nextStock === 0 
          ? `${item.name} marcado como ESGOTADO! O turista não conseguirá mais pedir.` 
          : `${item.name} REABASTECIDO com 15 unidades! Disponível para compra.`
      );
      setTimeout(() => setSimulatedNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* HEADER MASTER */}
      <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-noite-900 via-noite-950 to-noite-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-mata-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="chip border-purple-400/40 text-purple-300 font-bold text-xs uppercase tracking-wider">
                CENTRAL EXCLUSIVA DO PROPRIETÁRIO
              </span>
              <span className="chip border-white/10 bg-white/5 text-areia-300 text-xs">
                Modo Visão Global
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-areia-50 font-bold tracking-tight">
              <TextShimmer>Cockpit Caraíva OS · Business vs Turista</TextShimmer>
            </h1>
            <p className="text-sm text-areia-300 leading-relaxed">
              Explore os fluxos demonstrativos do <strong>Ecossistema Dono de Negócio (B2B)</strong> e do <strong>Ecossistema Turista (B2C)</strong>. Os dados ficam neste navegador e ainda não sincronizam entre usuários.
            </p>
          </div>

          {/* Seletor de Modo de Exibição */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveView("duplo")}
              className={`min-h-[44px] px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeView === "duplo" 
                  ? "bg-white/20 text-white shadow-md" 
                  : "text-areia-400 hover:text-white"
              }`}
            >
              <Layers size={14} /> Visão Dupla Lado a Lado
            </button>
            <button
              onClick={() => setActiveView("business")}
              className={`min-h-[44px] px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeView === "business" 
                  ? "bg-mata-500 text-white shadow-md shadow-mata-500/30" 
                  : "text-mata-400 hover:text-mata-200"
              }`}
            >
              <Building2 size={14} /> Só Dono de Negócio
            </button>
            <button
              onClick={() => setActiveView("turista")}
              className={`min-h-[44px] px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeView === "turista" 
                  ? "bg-coral-500 text-white shadow-md shadow-coral-500/30" 
                  : "text-coral-400 hover:text-coral-200"
              }`}
            >
              <Compass size={14} /> Só Turista
            </button>
          </div>
        </div>

        {/* MODO DEMONSTRAÇÃO POR NEGÓCIO ESPECÍFICO (PARA O LEAD) */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              🎯 Apresentação Personalizada por Negócio:
            </span>
            <span className="text-xs text-areia-300">
              Mostre apenas o que interessa para o cliente:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "todos", label: "Todos os Negócios", emoji: "🌐" },
              { id: "restaurante", label: "Só Restaurantes / Delivery", emoji: "🍔" },
              { id: "pousada", label: "Só Pousadas", emoji: "🏨" },
              { id: "passeios", label: "Só Barcos / Passeios", emoji: "⛵" },
              { id: "farmacia_loja", label: "Só Mercados / Lojas", emoji: "🛒" },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNiche(n.id as any)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition border ${
                  selectedNiche === n.id
                    ? "bg-amber-400 text-noite-950 border-amber-300 font-bold shadow-md shadow-amber-400/20"
                    : "bg-white/5 text-areia-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>{n.emoji} {n.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notificação de Simulação em Tempo Real */}
        {simulatedNotice && (
          <div className="mt-4 p-3.5 rounded-2xl bg-coral-500/20 border border-coral-400/40 text-coral-200 text-xs flex items-center gap-2 animate-bounce">
            <Zap size={16} className="text-coral-400 shrink-0" />
            <span className="font-semibold">{simulatedNotice}</span>
          </div>
        )}

        {/* Laboratório de Testes Reativos */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-areia-400 font-medium flex items-center gap-1.5">
            <Activity size={14} className="text-rio-400" />
            <strong>Laboratório de Sincronização ao Vivo:</strong> Dispare eventos e veja as duas pontas reagirem:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateOrder}
              className="btn-ghost min-h-[38px] px-3 border-coral-400/30 text-coral-300 hover:bg-coral-500/10 text-xs"
            >
              🛒 Simular Pedido Delivery
            </button>
            <button
              onClick={handleTogglePromo}
              className="btn-ghost min-h-[38px] px-3 border-rio-400/30 text-rio-300 hover:bg-rio-500/10 text-xs"
            >
              ⚡ Alternar Promoção "Só Hoje"
            </button>
            <button
              onClick={handleToggleStock}
              className="btn-ghost min-h-[38px] px-3 border-mata-400/30 text-mata-300 hover:bg-mata-500/10 text-xs"
            >
              📦 Esgotar/Abastecer Cerveja
            </button>
          </div>
        </div>
      </header>

      {/* METRICAS CONSOLIDADAS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SpotlightCard className="p-4" spotlightColor="rgba(52, 211, 153, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Valores ilustrativos da demonstração</p>
            <div className="h-8 w-8 rounded-xl bg-mata-500/10 grid place-items-center text-mata-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={Math.round(totalRevenue / 100)} formatter={(v) => `R$ ${v.toLocaleString("pt-BR")}`} />
          </p>
          <p className="mt-1 text-[11px] text-mata-400 flex items-center gap-1">
            <TrendingUp size={12} /> Split Pix planejado · provedor ainda não conectado
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(244, 114, 182, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Estoque Ativo na Vila</p>
            <div className="h-8 w-8 rounded-xl bg-coral-500/10 grid place-items-center text-coral-400">
              <PackageCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={totalStockItems} formatter={(v) => `${v} un`} />
          </p>
          <p className="mt-1 text-[11px] text-areia-300">
            {outOfStockCount > 0 ? (
              <span className="text-coral-400 font-semibold">{outOfStockCount} itens sem estoque</span>
            ) : (
              <span className="text-mata-400">Cardápios 100% abastecidos</span>
            )}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(56, 189, 248, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Quartos & Hospedagem</p>
            <div className="h-8 w-8 rounded-xl bg-rio-500/10 grid place-items-center text-rio-400">
              <Bed size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={availableRooms} formatter={(v) => `${v} livres`} />
          </p>
          <p className="mt-1 text-[11px] text-rio-300 flex items-center gap-1">
            <Flame size={12} className="text-coral-400" /> {lastMinuteRooms} quartos com "Só Hoje"
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(251, 191, 36, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Pedidos & Atendimentos</p>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 grid place-items-center text-amber-400">
              <Layers size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={pendingOrders + bookings.length} />
          </p>
          <p className="mt-1 text-[11px] text-amber-300">
            Delivery + Passeios + Spa
          </p>
        </SpotlightCard>
      </section>

      {/* PAINEL DIVIDIDO: BUSINESS (ESQUERDA) VS TURISTA (DIREITA) */}
      <div className={`grid gap-8 ${activeView === "duplo" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        
        {/* COLUNA 1: ECOSSISTEMA DONO DE NEGÓCIO (BUSINESS) */}
        {(activeView === "duplo" || activeView === "business") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-mata-950/40 border border-mata-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-mata-500/20 text-mata-300 ring-1 ring-mata-500/40">
                  <Building2 size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-mata-400">Back-Office / Operacional</span>
                    <span className="h-2 w-2 rounded-full bg-mata-400 animate-pulse" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-areia-50">
                    Ecossistema Dono de Negócio
                  </h2>
                </div>
              </div>

              <Link href="/business">
                <button className="btn-ghost min-h-[38px] text-xs px-3 border-mata-500/30 text-mata-300 hover:bg-mata-500/20">
                  Abrir Hub B2B <ExternalLink size={12} className="ml-1" />
                </button>
              </Link>
            </div>

            <p className="text-xs text-areia-300 px-1">
              Onde o comerciante, pousadeiro ou barqueiro controla preços, disponibilidade, recebe pedidos no balcão e emite placas físicas.
            </p>

            <div className="space-y-3">
              {/* Business 1: Na Areia Delivery */}
              {(selectedNiche === "todos" || selectedNiche === "restaurante") && (
                <div className="card p-4 border-coral-500/20 bg-coral-950/20 hover:border-coral-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-coral-500/20 text-coral-300">
                        <UtensilsCrossed size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Na Areia Delivery (KDS & Estoque)</h3>
                        <p className="text-[11px] text-areia-400">Cardápio ao vivo, estoque de cerveja/comida e tela de pedidos da cozinha</p>
                      </div>
                    </div>
                    <Link href="/business/delivery">
                      <button className="btn-primary min-h-[34px] text-xs px-3">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Itens no menu: <strong>{products.filter(p => p.establishmentId === "rest-silva").length}</strong></span>
                    <span className="text-coral-400 font-semibold">{pendingOrders} pedidos aguardando despacho</span>
                  </div>
                </div>
              )}

              {/* Business 2: Pousadas & Bangalôs */}
              {(selectedNiche === "todos" || selectedNiche === "pousada") && (
                <div className="card p-4 border-mata-500/20 bg-mata-950/20 hover:border-mata-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-mata-500/20 text-mata-300">
                        <Bed size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Pousadas & Bangalôs (Tarifário & iCal)</h3>
                        <p className="text-[11px] text-areia-400">Gestão de quartos, sincronização Airbnb/Booking e promoção "Só Hoje"</p>
                      </div>
                    </div>
                    <Link href="/business/pousada">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-mata-500/40 text-mata-300">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Quartos cadastrados: <strong>{rooms.length}</strong></span>
                    <span className="text-mata-400 font-semibold">{lastMinuteRooms} com promoção relâmpago</span>
                  </div>
                </div>
              )}

              {/* Business 3: Barqueiros & Passeios */}
              {(selectedNiche === "todos" || selectedNiche === "passeios") && (
                <div className="card p-4 border-rio-500/20 bg-rio-950/20 hover:border-rio-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-rio-500/20 text-rio-300">
                        <Sailboat size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Passeios de Lancha & Buggy</h3>
                        <p className="text-[11px] text-areia-400">Assentos por saída, cálculo de maré baixa e ponto de encontro</p>
                      </div>
                    </div>
                    <Link href="/business/passeios">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-rio-500/40 text-rio-300">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Roteiros ativos: <strong>{tours.length}</strong></span>
                    <span className="text-rio-400 font-semibold">Tábua de maré sincronizada</span>
                  </div>
                </div>
              )}

              {/* Business 4: Restaurante & Forró */}
              {(selectedNiche === "todos" || selectedNiche === "restaurante") && (
                <div className="card p-4 border-amber-500/20 bg-amber-950/20 hover:border-amber-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                        <UtensilsCrossed size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Restaurante & Ingressos de Forró</h3>
                        <p className="text-[11px] text-areia-400">Fila digital (buzzer virtual no celular) e portaria com QR Code</p>
                      </div>
                    </div>
                    <Link href="/business/restaurante">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-amber-500/40 text-amber-300">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Fila de espera: <strong>3 grupos aguardando</strong></span>
                    <span className="text-amber-400 font-semibold">Forró do Ouriço: 48 vendidos</span>
                  </div>
                </div>
              )}

              {/* Business 5: Farmácia */}
              {(selectedNiche === "todos" || selectedNiche === "farmacia_loja") && (
                <div className="card p-4 border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                        <Pill size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Farmácia (Plantão Noturno & Estoque)</h3>
                        <p className="text-[11px] text-areia-400">Balcão de primeiros socorros, repelente e modo plantão</p>
                      </div>
                    </div>
                    <Link href="/business/farmacia">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-emerald-500/40 text-emerald-300">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Alerta IA: <strong>Sol forte e maré baixa</strong></span>
                    <span className="text-emerald-400 font-semibold">Taxa de plantão configurável</span>
                  </div>
                </div>
              )}

              {/* Business 6: Spa & Terapias */}
              {(selectedNiche === "todos" || selectedNiche === "passeios") && (
                <div className="card p-4 border-teal-500/20 bg-teal-950/20 hover:border-teal-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Bem-Estar & Aulas de Kitesurf</h3>
                        <p className="text-[11px] text-areia-400">Agenda diária, sinal de reserva de 50% Pix e terapeutas</p>
                      </div>
                    </div>
                    <Link href="/business/servicos">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-teal-500/40 text-teal-300">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Sessões confirmadas: <strong>3 atendimentos</strong></span>
                    <span className="text-teal-400 font-semibold">Fluxo de demonstração</span>
                  </div>
                </div>
              )}

              {/* Business 7: Lojas & Artesanato */}
              {(selectedNiche === "todos" || selectedNiche === "farmacia_loja") && (
                <div className="card p-4 border-purple-500/20 bg-purple-950/20 hover:border-purple-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                        <Store size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Lojas de Artesanato & Moda Praia</h3>
                        <p className="text-[11px] text-areia-400">Baixa rápida de estoque na vila e catálogo de encomendas</p>
                      </div>
                    </div>
                    <Link href="/business/loja">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-purple-500/40 text-purple-300">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Itens cadastrados: <strong>Biojoias & Cerâmica</strong></span>
                    <span className="text-purple-400 font-semibold">Preço e estoque com 1 clique</span>
                  </div>
                </div>
              )}

              {/* Business 8: App do Entregador */}
              {(selectedNiche === "todos" || selectedNiche === "restaurante") && (
                <div className="card p-4 border-blue-500/20 bg-blue-950/20 hover:border-blue-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                        <Bike size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Painel do Entregador Local</h3>
                        <p className="text-[11px] text-areia-400">Navegação pelas ruas de areia e frete integral de R$ 15 no Pix</p>
                      </div>
                    </div>
                    <Link href="/business/entregador">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-blue-500/40 text-blue-300">
                        Acessar <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Repasse por entrega: <strong>100% para o entregador</strong></span>
                    <span className="text-blue-400 font-semibold">Zero retenção da plataforma</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COLUNA 2: ECOSSISTEMA TURISTA (B2C) */}
        {(activeView === "duplo" || activeView === "turista") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-coral-950/40 border border-coral-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-coral-500/20 text-coral-300 ring-1 ring-coral-500/40">
                  <Compass size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-coral-400">Front-Office / Visitante</span>
                    <span className="h-2 w-2 rounded-full bg-coral-400 animate-pulse" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-areia-50">
                    Ecossistema Turista & Vila
                  </h2>
                </div>
              </div>

              <Link href="/turista">
                <button className="btn-ghost min-h-[38px] text-xs px-3 border-coral-500/30 text-coral-300 hover:bg-coral-500/20">
                  Abrir App Turista <ExternalLink size={12} className="ml-1" />
                </button>
              </Link>
            </div>

            <p className="text-xs text-areia-300 px-1">
              O que o visitante de Caraíva acessa no celular (sem precisar baixar nada na App Store/Play Store), no quarto ou na areia.
            </p>

            <div className="space-y-3">
              {/* Turista 1: Hub do Turista */}
              {selectedNiche === "todos" && (
                <div className="card p-4 border-coral-500/20 bg-coral-950/20 hover:border-coral-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-coral-500/20 text-coral-300">
                        <Compass size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Portal Caraíva Digital (SuperApp)</h3>
                        <p className="text-[11px] text-areia-400">Feed com tábua de maré, notícias da vila, dicas culturais e atalhos</p>
                      </div>
                    </div>
                    <Link href="/turista">
                      <button className="btn-primary min-h-[34px] text-xs px-3">
                        Abrir Tela <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Maré Baixa: <strong>11:42 (0.2m)</strong></span>
                    <span className="text-coral-400 font-semibold">Acesso direto via QR Code</span>
                  </div>
                </div>
              )}

              {/* Turista 2: Na Areia Delivery */}
              {(selectedNiche === "todos" || selectedNiche === "restaurante") && (
                <div className="card p-4 border-coral-500/20 bg-coral-950/20 hover:border-coral-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-coral-500/20 text-coral-300">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Na Areia Delivery ("Pede no quarto, chega na areia")</h3>
                        <p className="text-[11px] text-areia-400">Cardápio 3D interativo, sacola persistente e entrega na praia</p>
                      </div>
                    </div>
                    <Link href="/turista/delivery">
                      <button className="btn-primary min-h-[34px] text-xs px-3">
                        Pedir Agora <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Taxa de entrega única: <strong>R$ 15,00</strong></span>
                    <span className="text-mata-400 font-semibold">Pagamento ainda não conectado</span>
                  </div>
                </div>
              )}

              {/* Turista 3: Pousadas & Quartos */}
              {(selectedNiche === "todos" || selectedNiche === "pousada") && (
                <div className="card p-4 border-mata-500/20 bg-mata-950/20 hover:border-mata-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-mata-500/20 text-mata-300">
                        <Bed size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Pousadas Sem Taxa de Intermediário</h3>
                        <p className="text-[11px] text-areia-400">Reservas diretas com pousadeiros, fotos dos bangalôs e descontos "Só Hoje"</p>
                      </div>
                    </div>
                    <Link href="/turista/pousadas">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-mata-500/40 text-mata-300">
                        Ver Quartos <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Economia para o turista: <strong>Até 25% mais barato</strong></span>
                    <span className="text-mata-400 font-semibold">{availableRooms} quartos disponíveis</span>
                  </div>
                </div>
              )}

              {/* Turista 4: Barcos & Corumbau */}
              {(selectedNiche === "todos" || selectedNiche === "passeios") && (
                <div className="card p-4 border-rio-500/20 bg-rio-950/20 hover:border-rio-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-rio-500/20 text-rio-300">
                        <Sailboat size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Passeios de Barco & Lancha</h3>
                        <p className="text-[11px] text-areia-400">Vagas garantidas para Corumbau e Praia do Espelho com horário da maré</p>
                      </div>
                    </div>
                    <Link href="/turista/passeios">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-rio-500/40 text-rio-300">
                        Ver Vagas <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Garantia de saída: <strong>Apenas em maré segura</strong></span>
                    <span className="text-rio-400 font-semibold">Reserva imediata no Pix</span>
                  </div>
                </div>
              )}

              {/* Turista 5: Carteira Digital Pix */}
              {selectedNiche === "todos" && (
                <div className="card p-4 border-amber-500/20 bg-amber-950/20 hover:border-amber-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">Carteira & Saldo Caraíva</h3>
                        <p className="text-[11px] text-areia-400">Saldo offline com backup, histórico de consumação e chave Pix rápida</p>
                      </div>
                    </div>
                    <Link href="/turista/carteira">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-amber-500/40 text-amber-300">
                        Ver Carteira <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Solução para internet fraca: <strong>Saldo pré-carregado</strong></span>
                    <span className="text-amber-400 font-semibold">Comprovante gerado na hora</span>
                  </div>
                </div>
              )}

              {/* Turista 6: Placa NFC do Quarto */}
              {(selectedNiche === "todos" || selectedNiche === "pousada") && (
                <div className="card p-4 border-white/20 bg-white/[0.03] hover:border-white/40 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/10 text-areia-100">
                        <QrCode size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-areia-50">A Experiência Física: Placa Quarto #04</h3>
                        <p className="text-[11px] text-areia-400">O hóspede encosta o celular na placa de madeira da pousada</p>
                      </div>
                    </div>
                    <Link href="/tag/flor-q04">
                      <button className="btn-ghost min-h-[34px] text-xs px-3 border-white/30 text-areia-100">
                        Simular Toque <ArrowRight size={12} className="ml-1" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-areia-300">
                    <span>Automação: <strong>Endereço preenchido na hora</strong></span>
                    <span className="text-areia-200 font-semibold">Zero atrito de cadastro</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* QUADRO COMPARATIVO: QUEM FAZ O QUÊ */}
      <section className="card p-6 bg-gradient-to-r from-noite-900 via-noite-950 to-noite-900 border-white/10">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-areia-50 mb-2 flex items-center gap-2">
          <Info size={20} className="text-coral-400" />
          Quadro Resumo: O que pertence a cada ecossistema
        </h3>
        <p className="text-xs text-areia-300 mb-6">
          Para que você nunca tenha dúvidas de onde mora cada funcionalidade no código e na demonstração:
        </p>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-areia-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Funcionalidade / Domínio</th>
                <th className="py-3 px-4 text-mata-400">💼 Ecossistema Dono de Negócio (/business)</th>
                <th className="py-3 px-4 text-coral-400">🌴 Ecossistema Turista (/turista)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-areia-200">
              <tr>
                <td className="py-3 px-4 font-bold text-areia-50">Estoque & Produtos</td>
                <td className="py-3 px-4 text-mata-300">Aumenta/diminui unidades, altera preços, pausa itens esgotados</td>
                <td className="py-3 px-4 text-coral-300">Vê itens com foto, adiciona na sacola e é avisado se esgotar</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-areia-50">Quartos & Tarifas</td>
                <td className="py-3 px-4 text-mata-300">Define diária, iCal de calendário e ativa botão "Só Hoje"</td>
                <td className="py-3 px-4 text-coral-300">Reserva com desconto direto sem pagar comissão para o Airbnb</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-areia-50">Passeios de Barco</td>
                <td className="py-3 px-4 text-mata-300">Controla vagas na lancha, horário de saída e maré baixa</td>
                <td className="py-3 px-4 text-coral-300">Garante o assento e ponto de encontro no rio</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-areia-50">Pedidos Delivery</td>
                <td className="py-3 px-4 text-mata-300">KDS de cozinha: Aceita, Prepara e Despacha para o motoboy</td>
                <td className="py-3 px-4 text-coral-300">Acompanha ETA e recebe na porta do quarto ou na areia</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-areia-50">Restaurante & Balcão</td>
                <td className="py-3 px-4 text-mata-300">Chama mesa na fila digital (buzzer) e valida ingressos QR</td>
                <td className="py-3 px-4 text-coral-300">Fica na praia aguardando a mesa vibrar no celular</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-areia-50">Financeiro & Repasses</td>
                <td className="py-3 px-4 text-mata-300">Prévia demonstrativa de split; depende do provedor Pix</td>
                <td className="py-3 px-4 text-coral-300">Paga com chave Pix automática, sem maquininha falhando</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
