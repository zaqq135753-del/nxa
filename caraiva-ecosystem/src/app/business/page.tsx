"use client";
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
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Bed, 
  PackageCheck,
  Flame,
  Layers
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Card3D } from "@/components/ui/Card3D";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { TextShimmer } from "@/components/ui/TextShimmer";

export default function BusinessHubPage() {
  const { 
    products, 
    rooms, 
    tours, 
    orders, 
    bookings, 
  } = useStore();

  // Consolidação de métricas em tempo real
  const totalStockItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;
  const availableRooms = rooms.filter((r) => r.available !== false).length;
  const lastMinuteRooms = rooms.filter((r) => Boolean(r.lastMinute)).length;
  const pendingOrders = orders.filter((o) => o.status === "novo" || o.status === "preparando").length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.split?.gross || 0), 0) + 
                       bookings.reduce((acc, b) => acc + (b.split?.merchant || 0), 0);

  const businessNiches = [
    {
      title: "Pousadas & Bangalôs",
      subtitle: "Quartos, Tarifas & Vagas 'Só Hoje'",
      href: "/business/pousada",
      icon: Building2,
      badge: `${rooms.length} quartos cadastrados`,
      color: "from-mata-500/20 to-mata-900/30",
      accent: "text-mata-400",
      border: "border-mata-500/30",
      stats: `${availableRooms} livres · ${lastMinuteRooms} promo relâmpago`
    },
    {
      title: "Na Areia Delivery",
      subtitle: "Cardápio Ao Vivo, KDS & Pedidos",
      href: "/business/delivery",
      icon: UtensilsCrossed,
      badge: `${products.filter(p => p.establishmentId === "rest-silva").length} itens no menu`,
      color: "from-coral-500/20 to-coral-900/30",
      accent: "text-coral-400",
      border: "border-coral-500/30",
      stats: `${pendingOrders} pedidos em preparo agora`
    },
    {
      title: "Passeios & Barqueiros",
      subtitle: "Assentos, Tábua de Maré & Ponta do Corumbau",
      href: "/business/passeios",
      icon: Compass,
      badge: `${tours.length} roteiros ativos`,
      color: "from-rio-500/20 to-rio-900/30",
      accent: "text-rio-400",
      border: "border-rio-500/30",
      stats: `${tours.reduce((acc, t) => acc + Math.max(0, t.seats - t.booked), 0)} assentos disponíveis hoje`
    },
    {
      title: "Restaurante & Casa Noturna",
      subtitle: "Fila Digital (Buzzer) & Ingressos de Forró",
      href: "/business/restaurante",
      icon: UtensilsCrossed,
      badge: "Fila de Espera Ativa",
      color: "from-amber-500/20 to-amber-900/30",
      accent: "text-amber-400",
      border: "border-amber-500/30",
      stats: "3 grupos na fila · Portaria QR Code"
    },
    {
      title: "Farmácia & Saúde",
      subtitle: "Plantão Noturno, Primeiros Socorros & Protetor",
      href: "/business/farmacia",
      icon: Pill,
      badge: "Modo Plantão Disponível",
      color: "from-emerald-500/20 to-emerald-900/30",
      accent: "text-emerald-400",
      border: "border-emerald-500/30",
      stats: "Remédios, repelentes e entregas rápidas"
    },
    {
      title: "Bem-Estar & Terapias",
      subtitle: "Massagens na Areia, Yoga & Kitesurf",
      href: "/business/servicos",
      icon: Sparkles,
      badge: "Agenda Inteligente",
      color: "from-teal-500/20 to-teal-900/30",
      accent: "text-teal-400",
      border: "border-teal-500/30",
      stats: `${bookings.filter(b => b.kind === "servico").length} agendamentos confirmados`
    },
    {
      title: "Artesanato & Moda Praia",
      subtitle: "Estoque de Joias, Vestuário & Cestas",
      href: "/business/loja",
      icon: Store,
      badge: "Controle de Vendas",
      color: "from-purple-500/20 to-purple-900/30",
      accent: "text-purple-400",
      border: "border-purple-500/30",
      stats: "Baixa de estoque em 1 toque na vila"
    },
    {
      title: "Painel do Entregador",
      subtitle: "Rotas nas Ruas de Areia & Repasses Pix",
      href: "/business/entregador",
      icon: Bike,
      badge: "R$ 15/corrida no bolso",
      color: "from-blue-500/20 to-blue-900/30",
      accent: "text-blue-400",
      border: "border-blue-500/30",
      stats: "Navegação por pontos de referência"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header B2B */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip border-mata-400/40 text-mata-400 font-bold text-[11px] uppercase tracking-wider">
              Ecossistema Dono de Negócio
            </span>
            <span className="flex h-2 w-2 rounded-full bg-mata-400 animate-ping" />
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-areia-50">
            Caraíva Business OS
          </h1>
          <p className="text-sm text-areia-300 mt-1 max-w-2xl">
            Gestão centralizada e reativa de estoque, quartos, vagas e faturamento com sincronização instantânea para os turistas no <strong>Caraíva Digital</strong> e <strong>Na Areia Delivery</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/turista">
            <ShimmerButton className="text-xs">
              Alternar para App do Turista →
            </ShimmerButton>
          </Link>
        </div>
      </header>

      {/* KPI Cards Reativos com NumberTicker e SpotlightCard */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SpotlightCard className="p-4" spotlightColor="rgba(52, 211, 153, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Valores ilustrativos · Pix não conectado</p>
            <div className="h-8 w-8 rounded-xl bg-mata-500/10 grid place-items-center text-mata-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={Math.round(totalRevenue / 100)} formatter={(v) => `R$ ${v.toLocaleString("pt-BR")}`} />
          </p>
          <p className="mt-1 text-[11px] text-mata-400 flex items-center gap-1">
            <TrendingUp size={12} /> Repasse D+0 direto na conta jurídica
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(244, 114, 182, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Produtos em Estoque</p>
            <div className="h-8 w-8 rounded-xl bg-coral-500/10 grid place-items-center text-coral-400">
              <PackageCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={totalStockItems} formatter={(v) => `${v} un`} />
          </p>
          <p className="mt-1 text-[11px] text-areia-300">
            {outOfStockCount > 0 ? (
              <span className="text-coral-400 flex items-center gap-1 font-semibold">
                <AlertTriangle size={12} /> {outOfStockCount} itens esgotados
              </span>
            ) : (
              <span className="text-mata-400 flex items-center gap-1">
                <CheckCircle2 size={12} /> Todos itens abastecidos
              </span>
            )}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(56, 189, 248, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Quartos Disponíveis</p>
            <div className="h-8 w-8 rounded-xl bg-rio-500/10 grid place-items-center text-rio-400">
              <Bed size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={availableRooms} formatter={(v) => `${v} livres`} />
          </p>
          <p className="mt-1 text-[11px] text-rio-300 flex items-center gap-1">
            <Flame size={12} className="text-coral-400" /> {lastMinuteRooms} com promoção "Só Hoje" ativa
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4" spotlightColor="rgba(251, 191, 36, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-areia-300">Pedidos & Vagas</p>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 grid place-items-center text-amber-400">
              <Layers size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={pendingOrders + bookings.length} />
          </p>
          <p className="mt-1 text-[11px] text-amber-300">
            Na Areia Delivery + Barcos & Spa
          </p>
        </SpotlightCard>
      </section>

      {/* Seletor de Módulos Operacionais com Efeito 3D Card */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-areia-50">Verticais de Negócio de Caraíva</h2>
            <p className="text-xs text-areia-300">Selecione o segmento para gerenciar estoque, pedidos, quartos e emitir placas físicas QR/NFC</p>
          </div>
          <span className="text-xs text-mata-400 font-semibold hidden sm:inline">
            8 módulos totalmente ativos
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessNiches.map((niche) => {
            const Icon = niche.icon;
            return (
              <Card3D key={niche.href} depth={14}>
                <Link
                  href={niche.href}
                  className={`block h-full card p-5 bg-gradient-to-br ${niche.color} border ${niche.border} hover:border-areia-100/40 transition group`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl bg-black/40 ring-1 ring-white/10 ${niche.accent}`}>
                      <Icon size={20} />
                    </div>
                    <span className="chip text-[10px] bg-black/40 border-white/10 text-areia-200">
                      {niche.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-areia-50 group-hover:text-areia-100 transition">
                    {niche.title}
                  </h3>
                  <p className="text-xs text-areia-300 mt-1 line-clamp-2">
                    {niche.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-areia-400 text-[11px]">{niche.stats}</span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${niche.accent} group-hover:translate-x-0.5 transition-transform`}>
                      Abrir <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* Destaque da Estratégia de Placas Físicas & Sincronização */}
      <section className="card p-6 bg-gradient-to-r from-rio-950/40 via-noite-900 to-mata-950/40 border-rio-500/30">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="chip border-rio-400/30 text-rio-300 font-bold text-[10px]">
              TECNOLOGIA DE PONTA A PONTA
            </span>
            <h3 className="font-display text-2xl text-areia-50">
              <TextShimmer>Como Dono de Negócio e Turista se conectam em tempo real?</TextShimmer>
            </h3>
            <p className="text-xs text-areia-300 leading-relaxed">
              Nesta demonstração, você percorre os fluxos de gestão e de turista no mesmo navegador. Para compartilhar estoque, reservas e status entre pessoas, falta conectar banco, autenticação e provedor de pagamento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/turista/delivery">
              <button className="btn-primary min-h-[44px] text-xs px-4">
                Testar Pedido no Na Areia
              </button>
            </Link>
            <Link href="/tag/flor-q04">
              <button className="btn-ghost min-h-[44px] text-xs px-4 border-white/10">
                Ver Placa Quarto #04
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
