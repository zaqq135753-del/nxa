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
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const availableRooms = rooms.filter((r) => r.available !== false).length;
  const lastMinuteRooms = rooms.filter((r) => Boolean(r.lastMinute)).length;
  const pendingOrders = orders.filter((o) => o.status === "novo" || o.status === "preparando").length;
  const totalRevenue = orders.filter(o => o.status !== "recusado").reduce((acc, o) => acc + (o.split?.merchant || 0), 0) +
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
      badge: `${products.filter(p => p.establishmentId === "rest-rio").length} itens no menu`,
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
    <div className="min-w-0 space-y-5 animate-fade-in sm:space-y-8">
      {/* Hero Header B2B */}
      <header className="flex min-w-0 flex-col items-start justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:gap-4 sm:pb-6">
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
          <p className="mt-1 max-w-2xl text-sm text-areia-300">
            Organize pedidos, estoque, hospedagens, passeios e serviços recebidos pela vitrine pública do Caraíva Digital.
          </p>
        </div>
      </header>

      {/* KPI Cards Reativos com NumberTicker e SpotlightCard */}
      <section className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <SpotlightCard className="min-w-0 p-3 sm:p-4" spotlightColor="rgba(52, 211, 153, 0.15)">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-areia-300 sm:text-xs sm:tracking-wider">Valores ilustrativos</p>
            <div className="h-8 w-8 rounded-xl bg-mata-500/10 grid place-items-center text-mata-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-areia-50">
            <NumberTicker value={Math.round(totalRevenue / 100)} formatter={(v) => `R$ ${v.toLocaleString("pt-BR")}`} />
          </p>
          <p className="mt-1 text-[11px] text-mata-400 flex items-center gap-1">
            <TrendingUp size={12} /> Pagamentos ainda não conectados
          </p>
        </SpotlightCard>

        <SpotlightCard className="min-w-0 p-3 sm:p-4" spotlightColor="rgba(244, 114, 182, 0.15)">
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

        <SpotlightCard className="min-w-0 p-3 sm:p-4" spotlightColor="rgba(56, 189, 248, 0.15)">
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

        <SpotlightCard className="min-w-0 p-3 sm:p-4" spotlightColor="rgba(251, 191, 36, 0.15)">
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
      <section className="min-w-0 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-areia-50">Verticais de Negócio de Caraíva</h2>
            <p className="max-w-2xl text-xs text-areia-300">Acesse o perfil operacional de cada tipo de negócio para acompanhar as atividades que chegam pelo guia público.</p>
          </div>
          <span className="text-xs text-mata-400 font-semibold hidden sm:inline">
            8 áreas demonstrativas
          </span>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {businessNiches.map((niche) => {
            const Icon = niche.icon;
            return (
              <Card3D key={niche.href} depth={14}>
                <Link
                  href={niche.href}
                  className={`block min-h-full min-w-0 rounded-2xl border bg-gradient-to-br p-4 transition group hover:border-areia-100/40 active:scale-[.99] sm:p-5 ${niche.color} ${niche.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl bg-black/40 ring-1 ring-white/10 ${niche.accent}`}>
                      <Icon size={20} />
                    </div>
                    <span className="max-w-[70%] truncate rounded-full border border-white/10 bg-black/40 px-2 py-1 text-right text-[10px] text-areia-200 sm:max-w-none">
                      {niche.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-areia-50 transition group-hover:text-areia-100 sm:mt-4 sm:text-lg">
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
      <section className="card border-rio-500/30 bg-gradient-to-r from-rio-950/40 via-noite-900 to-mata-950/40 p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="chip border-rio-400/30 text-rio-300 font-bold text-[10px]">
              TECNOLOGIA DE PONTA A PONTA
            </span>
            <h3 className="font-display text-2xl text-areia-50">
              <TextShimmer>Da vitrine pública à operação do negócio</TextShimmer>
            </h3>
            <p className="text-xs text-areia-300 leading-relaxed">
              O painel representa a operação que recebe pedidos e reservas originados em <strong>caraiva.digital</strong>. A sincronização entre usuários depende da conexão do banco de dados e dos serviços de produção.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
            <a href="https://caraiva.digital" target="_blank" rel="noreferrer" className="btn-primary w-full px-4 text-xs sm:w-auto">
              Abrir vitrine pública <ArrowRight size={14} />
            </a>
            <Link href="/business/delivery" className="btn-ghost w-full border-white/10 px-4 text-xs sm:w-auto">
              Ver pedidos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
