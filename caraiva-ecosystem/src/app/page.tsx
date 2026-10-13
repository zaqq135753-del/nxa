"use client";
import Link from "next/link";
import { 
  ArrowRight, 
  Compass, 
  ShoppingBag, 
  BedDouble, 
  Sailboat, 
  Sparkles, 
  Nfc, 
  UtensilsCrossed, 
  Pill, 
  Bike, 
  Store, 
  Smartphone, 
  CheckCircle2, 
  Zap, 
  TrendingUp,
  Clock,
  ShieldCheck,
  Waves,
  Star,
  Layers,
  SlidersHorizontal,
  Flame,
  Check
} from "lucide-react";
import { PLANS, SETUP_FEE } from "@/lib/pricing";
import { brl } from "@/lib/data";
import { TextShimmer } from "@/components/ui/TextShimmer";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Marquee } from "@/components/ui/Marquee";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { WordRotate } from "@/components/ui/WordRotate";
import { SparklesText } from "@/components/ui/SparklesText";
import { VillageDynamicIsland } from "@/components/ui/VillageDynamicIsland";
import { Card3D } from "@/components/ui/Card3D";

// Itens da esteira do Na Areia Delivery
const DELIVERY_MARQUEE_ITEMS = [
  {
    name: "Moqueca Baiana Mista",
    place: "Cozinha do Rio",
    price: 14500,
    time: "35-45 min",
    tag: "Prato do Dia",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    badgeColor: "bg-coral-500/20 text-coral-300 border-coral-500/30",
  },
  {
    name: "Pack 6x Corona Long Neck",
    place: "Depósito da Barra",
    price: 5400,
    time: "15-20 min",
    tag: "Trincando na Areia",
    image: "https://images.unsplash.com/photo-1608270546103-975c77ca923f?auto=format&fit=crop&w=400&q=80",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    name: "Pastel de Arraia do Beco",
    place: "Pastel da Vila",
    price: 2800,
    time: "20-25 min",
    tag: "Tradição Caraivana",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
    badgeColor: "bg-rio-500/20 text-rio-300 border-rio-500/30",
  },
  {
    name: "Açaí Especial com Frutas",
    place: "Ponto do Açaí",
    price: 3200,
    time: "15 min",
    tag: "Refrescante",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=400&q=80",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    name: "Protetor FPS 60 + Repelente",
    place: "Farmácia Caraíva",
    price: 6800,
    time: "15 min na pousada",
    tag: "Anti-Borrachudo",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    name: "Caipirinha de Cacau com Biribiri",
    place: "Bar da Praia",
    price: 3600,
    time: "10 min",
    tag: "Drink Autoral",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    badgeColor: "bg-coral-500/20 text-coral-300 border-coral-500/30",
  },
];

// Itens da esteira de Pousadas, Lanchas & Experiências (Sentido Reverso)
const EXPERIENCE_MARQUEE_ITEMS = [
  {
    title: "Bangalô Master Beira-Rio",
    place: "Pousada Flor de Caraíva",
    price: 49000,
    badge: "⚡ Só Hoje: -25%",
    extra: "iCal Sync · Sem Taxa OTA",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
    accent: "text-mata-400",
  },
  {
    title: "Lancha Ponta do Corumbau",
    place: "Associação de Barqueiros",
    price: 18000,
    badge: "🌊 Maré Baixa 11:42",
    extra: "2 vagas restantes",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
    accent: "text-rio-400",
  },
  {
    title: "Aula de Kitesurf & Wing Foil",
    place: "Escola Caraíva Kite",
    price: 28000,
    badge: "💨 Vento 18 nós Leste",
    extra: "Ponta da Barra",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    accent: "text-coral-400",
  },
  {
    title: "Massagem Relaxante com Óleos",
    place: "Espaço Bem-Estar",
    price: 18000,
    badge: "💆 Na Pousada ou Tenda",
    extra: "Sinal 50% no Pix",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
    accent: "text-teal-400",
  },
  {
    title: "Forró do Ouriço de Sábado",
    place: "Casa de Forró do Ouriço",
    price: 6000,
    badge: "🎶 Portaria QR Code",
    extra: "48 ingressos vendidos",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
    accent: "text-amber-400",
  },
  {
    title: "Suíte Jardim com Varanda",
    place: "Pousada da Barra",
    price: 42000,
    badge: "🌿 Vista para a Mata",
    extra: "Café da manhã incluso",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    accent: "text-mata-400",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-28 pt-8 space-y-16">
      
      {/* 1. DYNAMIC ISLAND STATUS BAR NO TOPO */}
      <VillageDynamicIsland />

      {/* 2. HERO ULTRA-TECNOLÓGICO */}
      <section className="relative text-center sm:text-left pt-2 pb-6 space-y-6">
        
        {/* Badge NFC & Solução Local */}
        <div className="inline-flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-500/10 px-4 py-1.5 text-xs font-semibold text-coral-300 backdrop-blur shadow-sm">
          <Nfc size={15} className="text-coral-400 animate-pulse" />
          <span>Placas NFC & QR Code de Madeira e Acrílico nos Quartos de Caraíva</span>
        </div>

        {/* Título com WordRotate dinâmico e SparklesText */}
        <h1 className="max-w-5xl font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-areia-50 leading-[1.08]">
          <SparklesText className="text-areia-50">Caraíva inteira,</SparklesText>{" "}
          <br className="hidden sm:inline" />
          <WordRotate
            duration={2800}
            words={[
              "sem esperar resposta no WhatsApp.",
              "com cerveja gelada na areia.",
              "sem pagar 25% pro Airbnb.",
              "com barcos por tábua de maré.",
              "com previsão de split Pix após conectar o provedor.",
            ]}
            className="text-coral-400 font-extrabold italic underline decoration-coral-500/40 decoration-wavy decoration-2"
          />
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-areia-200/90 leading-relaxed font-normal">
          Um ecossistema comercial duplo: o turista encosta o celular na placa do bangalô e pede comida, reserva pousada ou lancha com Pix instantâneo. O dono de negócio controla estoque, quartos e faturamento com zero taxa predatória.
        </p>

        {/* Quick Launch Buttons com 21st-dev Motion */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
          <Link href="/turista/delivery">
            <ShimmerButton 
              shimmerColor="#F08A5D" 
              className="min-h-[50px] px-6 text-sm font-bold shadow-xl shadow-coral-500/20"
            >
              <Smartphone size={16} className="mr-2 text-coral-300" />
              Experimentar Na Areia Delivery (Turista)
            </ShimmerButton>
          </Link>

          <Link href="/dashboard">
            <button className="flex min-h-[50px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-areia-100 backdrop-blur hover:bg-white/10 active:scale-95 transition">
              <SlidersHorizontal size={16} className="text-rio-400" />
              Abrir Cockpit Duplo (Business vs Turista)
            </button>
          </Link>

          <Link href="/tag/flor-q04">
            <button className="flex min-h-[50px] items-center gap-2 rounded-2xl border border-coral-500/30 bg-coral-500/10 px-5 py-2.5 text-xs font-semibold text-coral-300 hover:bg-coral-500/20 active:scale-95 transition">
              <Nfc size={15} />
              Simular Placa Quarto #04
            </button>
          </Link>
        </div>
      </section>

      {/* 3. METRICS BANNER COM NUMBERTICKER */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-3xl border border-white/5 bg-noite-900/60 p-5 sm:p-6 backdrop-blur shadow-2xl">
        <div className="p-2">
          <span className="text-[11px] font-semibold text-areia-400 uppercase tracking-wider">Negócios no Piloto</span>
          <p className="mt-1 text-2xl sm:text-3xl font-black text-areia-50">
            <NumberTicker value={10} formatter={(v) => `${v} verticais`} />
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">100% de cobertura da vila</span>
        </div>
        <div className="p-2">
          <span className="text-[11px] font-semibold text-areia-400 uppercase tracking-wider">Tempo Médio de Pedido</span>
          <p className="mt-1 text-2xl sm:text-3xl font-black text-coral-400">
            <NumberTicker value={45} formatter={(v) => `${v} seg`} />
          </p>
          <span className="text-[10px] text-areia-400 font-medium">vs 22 min no WhatsApp</span>
        </div>
        <div className="p-2">
          <span className="text-[11px] font-semibold text-areia-400 uppercase tracking-wider">Implantação por Ponto</span>
          <p className="mt-1 text-2xl sm:text-3xl font-black text-areia-50">
            {brl(SETUP_FEE)}
          </p>
          <span className="text-[10px] text-areia-400 font-medium">Placa física NFC inclusa</span>
        </div>
        <div className="p-2">
          <span className="text-[11px] font-semibold text-areia-400 uppercase tracking-wider">Repasse de Pix</span>
          <p className="mt-1 text-2xl sm:text-3xl font-black text-emerald-400">
            0 segundos
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">Split direto na conta do dono</span>
        </div>
      </section>

      {/* 4. INFINITE MARQUEE DUPLO: CARDS CORRENDO AO VIVO */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip border-coral-500/30 text-coral-400 font-bold text-[10px] uppercase tracking-wider">
                FEED AO VIVO DA VILA
              </span>
              <span className="flex h-2 w-2 rounded-full bg-coral-400 animate-ping" />
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-areia-50">
              O que está rodando em Caraíva agora
            </h2>
          </div>
          <p className="text-xs text-areia-400 max-w-sm">
            Passe o mouse ou toque nos cards para pausar a esteira. Conteúdo demonstrativo, sem sincronização entre dispositivos.
          </p>
        </div>

        {/* Efeito de fade nas bordas do marquee */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          
          {/* ESTEIRA 1: NA AREIA DELIVERY (SENTIDO NORMAL) */}
          <Marquee duration={35} pauseOnHover gap="1.25rem">
            {DELIVERY_MARQUEE_ITEMS.map((item, idx) => (
              <Link 
                key={idx} 
                href="/turista/delivery" 
                className="group relative flex w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-noite-900/90 p-3.5 backdrop-blur hover:border-coral-500/40 transition-all hover:scale-[1.02]"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="ml-3 flex flex-1 flex-col justify-between">
                  <div>
                    <span className={`inline-block rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <h3 className="mt-1 text-xs font-bold text-areia-50 line-clamp-1 group-hover:text-coral-300 transition">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-areia-400">{item.place}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-emerald-400">{brl(item.price)}</span>
                    <span className="text-[10px] text-areia-400 flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Marquee>

          {/* ESTEIRA 2: POUSADAS, LANCHAS & NOITE (SENTIDO REVERSO) */}
          <div className="mt-2">
            <Marquee duration={38} reverse pauseOnHover gap="1.25rem">
              {EXPERIENCE_MARQUEE_ITEMS.map((item, idx) => (
                <Link 
                  key={idx} 
                  href="/turista" 
                  className="group relative flex w-80 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-noite-900/90 p-3.5 backdrop-blur hover:border-rio-500/40 transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="ml-3 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-areia-200">
                        {item.badge}
                      </span>
                      <h3 className="mt-1 text-xs font-bold text-areia-50 line-clamp-1 group-hover:text-rio-300 transition">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-areia-400">{item.place}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-xs font-bold ${item.accent}`}>{brl(item.price)}</span>
                      <span className="text-[10px] text-areia-400">{item.extra}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* 5. BENTO GRID HIGH-TECH (ASSIMÉTRICO ESTILO LINEAR / APPLE) */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coral-400">
              ARQUITETURA DE EXPERIÊNCIA
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-4xl font-bold text-areia-50">
              O Ecossistema Completo de Caraíva
            </h2>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-rio-400 hover:text-rio-300 flex items-center gap-1">
            Ver todas as 10 verticais no Cockpit <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* CARD FLAGSHIP GRANDE: NA AREIA DELIVERY COM BORDER BEAM */}
          <div className="relative md:col-span-2 overflow-hidden rounded-3xl border border-coral-500/30 bg-gradient-to-br from-noite-900 via-coral-950/20 to-noite-950 p-6 sm:p-8 shadow-2xl">
            <BorderBeam size={280} duration={12} colorFrom="#F08A5D" colorTo="#3BA7B8" borderWidth={2} />
            
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-3 rounded-2xl bg-coral-500/20 text-coral-300 ring-1 ring-coral-500/40">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <span className="chip border-coral-400/30 text-coral-300 font-bold text-[10px]">
                        DESTAQUE PRINCIPAL
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-display font-bold text-areia-50 mt-1">
                        Na Areia Delivery
                      </h3>
                    </div>
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Pede no quarto, chega na areia
                  </span>
                </div>

                <p className="text-sm text-areia-200 mt-4 leading-relaxed max-w-xl">
                  O delivery oficial de Caraíva que resolve a dor do turista e do lojista: cardápio interativo 3D, taxa fixa de R$ 15 por setor da vila (100% para o entregador) e pagamento direto por Pix com confirmação em 3 segundos.
                </p>
              </div>

              {/* Mockup Interativo Rápido */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[11px] text-areia-400">Tempo de Resposta</p>
                  <p className="text-lg font-bold text-coral-400 mt-0.5">Instantâneo</p>
                  <p className="text-[10px] text-areia-400">Zero espera no WhatsApp</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[11px] text-areia-400">Frete por Setor</p>
                  <p className="text-lg font-bold text-areia-50 mt-0.5">R$ 15 integral</p>
                  <p className="text-[10px] text-emerald-400">100% pro entregador local</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[11px] text-areia-400">KDS de Cozinha</p>
                  <p className="text-lg font-bold text-rio-400 mt-0.5">Painel Balcão</p>
                  <p className="text-[10px] text-areia-400">Comanda pronta em 1 toque</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/turista/delivery">
                  <button className="btn-primary min-h-[46px] px-5 text-xs font-bold">
                    Abrir Na Areia Delivery →
                  </button>
                </Link>
                <Link href="/business/delivery">
                  <button className="btn-ghost min-h-[46px] px-5 text-xs font-semibold border-white/10">
                    Acessar Cozinha & KDS (Lojista)
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 2: MINI-PMS POUSADAS COM ICAL */}
          <div className="relative overflow-hidden rounded-3xl border border-mata-500/30 bg-gradient-to-br from-noite-900 via-mata-950/20 to-noite-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-mata-500/20 text-mata-300 ring-1 ring-mata-500/40">
                  <BedDouble size={20} />
                </div>
                <span className="chip border-mata-500/30 text-mata-300 text-[10px] font-bold">
                  Anti-Overbooking
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-areia-50 mt-4">
                Pousadas & Bangalôs
              </h3>
              <p className="text-xs text-areia-300 mt-2 leading-relaxed">
                Sincronização 2-way iCal com Booking e Airbnb. Botão "Só Hoje" para liquidar quartos ociosos com até 25% de desconto para turistas na vila.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-mata-400">Zero taxa de 27%</span>
              <Link href="/business/pousada" className="text-xs font-bold text-areia-100 hover:text-white flex items-center gap-1">
                Ver PMS <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* CARD 3: BARCOS, MARÉ & CORUMBAU */}
          <div className="relative overflow-hidden rounded-3xl border border-rio-500/30 bg-gradient-to-br from-noite-900 via-rio-950/20 to-noite-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-rio-500/20 text-rio-300 ring-1 ring-rio-500/40">
                  <Sailboat size={20} />
                </div>
                <span className="chip border-rio-500/30 text-rio-300 text-[10px] font-bold">
                  Maré ao Vivo
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-areia-50 mt-4">
                Passeios de Lancha & Buggy
              </h3>
              <p className="text-xs text-areia-300 mt-2 leading-relaxed">
                Controle de assentos reais por saída, horário de maré baixa para Corumbau e Espelho, voucher com check-in QR Code.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-rio-400">Vagas garantidas</span>
              <Link href="/business/passeios" className="text-xs font-bold text-areia-100 hover:text-white flex items-center gap-1">
                Ver Barcos <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* CARD 4: PLACA FÍSICA NFC & HARDWARE */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-noite-900/60 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-white/10 text-areia-50">
                  <Nfc size={20} />
                </div>
                <span className="chip text-[10px] font-bold">
                  Acrílico & Madeira
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-areia-50 mt-4">
                Placas Inteligentes NFC
              </h3>
              <p className="text-xs text-areia-300 mt-2 leading-relaxed">
                Gravadas a laser com o nome do bangalô. O hóspede encosta o celular e o endereço de entrega é preenchido automaticamente.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-coral-400">Zero App Store</span>
              <Link href="/tag/flor-q04" className="text-xs font-bold text-areia-100 hover:text-white flex items-center gap-1">
                Testar Toque <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* CARD 5: RESTAURANTE & FILA DIGITAL BUZZER */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-noite-900 via-amber-950/20 to-noite-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
                  <UtensilsCrossed size={20} />
                </div>
                <span className="chip border-amber-500/30 text-amber-300 text-[10px] font-bold">
                  Buzzer Virtual
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-areia-50 mt-4">
                Restaurantes & Forró
              </h3>
              <p className="text-xs text-areia-300 mt-2 leading-relaxed">
                Fila de espera digital no celular do turista enquanto ele bebe na praia, cardápio nas mesas e venda antecipada de ingressos de forró.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">3 grupos na fila</span>
              <Link href="/business/restaurante" className="text-xs font-bold text-areia-100 hover:text-white flex items-center gap-1">
                Ver Mesas <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANOS COMERCIAIS COM BORDER BEAM NO PLANO PRO */}
      <section className="pt-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-coral-400 flex items-center justify-center gap-1.5">
            <Sparkles size={14} /> Modelo Comercial & Parcerias Locais
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-areia-50">
            Planos sem fidelidade abusiva
          </h2>
          <p className="text-xs text-areia-300">
            Setup inicial de {brl(SETUP_FEE)} inclui as placas físicas de acrílico gravadas com NFC + QR Code para cada acomodação ou mesa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {Object.entries(PLANS).map(([id, p]) => (
            <div 
              key={id} 
              className={`relative rounded-3xl border p-7 transition backdrop-blur flex flex-col justify-between ${
                id === "pro" 
                  ? "border-coral-500/50 bg-gradient-to-b from-coral-950/30 to-noite-900/90 shadow-2xl shadow-coral-500/10 ring-1 ring-coral-500/30" 
                  : "border-white/5 bg-noite-900/60"
              }`}
            >
              {/* Feixe de luz correndo no plano Pro */}
              {id === "pro" && (
                <>
                  <BorderBeam size={220} duration={10} colorFrom="#F08A5D" colorTo="#FFD700" borderWidth={2} />
                  <div className="absolute -top-3.5 right-6 rounded-full bg-coral-500 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-noite-950 shadow-md">
                    Mais Popular
                  </div>
                </>
              )}
              
              <div>
                <h3 className="text-2xl font-display font-bold text-areia-50">{p.name}</h3>
                <p className="mt-1 text-xs text-areia-400 min-h-[32px]">{p.for}</p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-areia-50">{brl(p.monthly)}</span>
                  <span className="ml-1 text-xs text-areia-400">/mês</span>
                </div>

                <div className="mt-3 rounded-xl bg-white/5 p-3 text-xs font-semibold text-emerald-400">
                  {p.commission ? `+ ${p.commission * 100}% de comissão por reserva` : `+ ${brl(p.perOrder!)} por comanda de pedido`}
                </div>

                <ul className="mt-6 space-y-3 text-xs text-areia-300 border-t border-white/5 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> Placa NFC de Acrílico/Madeira Inclusa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> Painel de gestão com prévia de repasses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> Sincronização iCal (Airbnb & Booking)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> Suporte Local no Vilarejo de Caraíva
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link href="/business">
                  <button className={`w-full min-h-[46px] rounded-xl text-xs font-bold transition ${
                    id === "pro" 
                      ? "bg-coral-400 text-noite-950 hover:bg-coral-300 shadow-md" 
                      : "border border-white/10 bg-white/5 text-areia-100 hover:bg-white/10"
                  }`}>
                    Ativar no Meu Estabelecimento
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CHAMADA FINAL DE IMPACTO */}
      <section className="card p-8 sm:p-12 text-center bg-gradient-to-r from-rio-950/40 via-noite-900 to-coral-950/40 border-white/10 space-y-4">
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-areia-50 max-w-2xl mx-auto">
          Pronto para transformar o comércio de Caraíva?
        </h2>
        <p className="text-sm text-areia-300 max-w-xl mx-auto leading-relaxed">
          Sem comissões abusivas de 27%. Sem perder clientes na lentidão do WhatsApp. O turista pede no quarto e recebe na areia.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/dashboard">
            <ShimmerButton className="min-h-[48px] px-8 text-xs font-bold">
              Explorar Todos os Módulos no Cockpit →
            </ShimmerButton>
          </Link>
          <Link href="/turista/delivery">
            <button className="btn-ghost min-h-[48px] px-6 text-xs font-semibold border-white/10">
              Fazer Pedido de Demonstração
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
