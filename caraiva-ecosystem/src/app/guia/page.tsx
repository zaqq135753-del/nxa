"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Waves, 
  Sun, 
  UtensilsCrossed, 
  Moon, 
  Camera, 
  Music, 
  Clock, 
  Search, 
  X, 
  Phone, 
  ExternalLink, 
  Star, 
  Heart, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Bed,
  Sailboat,
  Coffee,
  Store,
  Layers,
  Flame,
  Info
} from "lucide-react";
import { CARAIVA_BUSINESSES, type Business, type BusinessCategory } from "@/lib/guiaData";
import { TextShimmer } from "@/components/ui/TextShimmer";
import { WordRotate } from "@/components/ui/WordRotate";
import { SparklesText } from "@/components/ui/SparklesText";
import { Marquee } from "@/components/ui/Marquee";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { VillageDynamicIsland } from "@/components/ui/VillageDynamicIsland";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Card3D } from "@/components/ui/Card3D";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

// Stories de alta definição da vila
const CARAIVA_STORIES = [
  {
    id: "st-1",
    author: "@julia.caraiva",
    title: "Pôr do Sol no Rio",
    location: "Boteco do Pará, Beira-Rio",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    tag: "Pôr do Sol",
  },
  {
    id: "st-2",
    author: "@marcos.roots",
    title: "Travessia de Canoa",
    location: "Rio Caraíva",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    tag: "Rio",
  },
  {
    id: "st-3",
    author: "@barco.corumbau",
    title: "Ponta do Corumbau",
    location: "Ponta do Corumbau",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    tag: "Maré Baixa",
  },
  {
    id: "st-4",
    author: "@forro.ourico",
    title: "Noite de Forró",
    location: "Forró do Ouriço",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    tag: "Noite",
  },
  {
    id: "st-5",
    author: "@flordecaraiva",
    title: "Bangalô Florido",
    location: "Pousada Flor de Caraíva",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    tag: "Hospedagem",
  },
];

// Destaques de Gastronomia para o Marquee 1
const GASTRONOMIA_MARQUEE = [
  {
    name: "Culinária Central",
    desc: "Moqueca baiana tradicional sob as árvores",
    place: "R. Sete de Setembro",
    rating: 4.8,
    reviews: 718,
    highlight: "Moqueca de Frutos do Mar",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
    tag: "Restaurante",
    color: "border-coral-500/30 text-coral-400",
  },
  {
    name: "Boteco do Pará",
    desc: "O lendário pastel de arraia e o pôr do sol no rio",
    place: "Beira-rio Caraíva",
    rating: 4.6,
    reviews: 1250,
    highlight: "Pastel de Arraia + Caipirinha",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80",
    tag: "Pôr do Sol",
    color: "border-rio-500/30 text-rio-400",
  },
  {
    name: "Bar do Porto",
    desc: "Pizzas artesanais de fermentação lenta e jazz",
    place: "Deck do Rio",
    rating: 4.7,
    reviews: 540,
    highlight: "Pizza na Areia & Drinks",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=500&q=80",
    tag: "Música & Pizza",
    color: "border-amber-500/30 text-amber-400",
  },
  {
    name: "Cantinho da Duca",
    desc: "Doces caseiros nativos e café coado no filtro",
    place: "Rua do Porto",
    rating: 4.9,
    reviews: 380,
    highlight: "Torta de Frutas Tropicais",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80",
    tag: "Café & Doces",
    color: "border-purple-500/30 text-purple-400",
  },
  {
    name: "Coco Brasil",
    desc: "Música ao vivo de frente pro mar e petiscos",
    place: "Praia de Caraíva",
    rating: 4.5,
    reviews: 620,
    highlight: "Isca de Peixe & Cerveja Gelada",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
    tag: "Beira-Mar",
    color: "border-emerald-500/30 text-emerald-400",
  },
];

// Destaques de Praias, Passeios & Noite para o Marquee 2 (Sentido Reverso)
const EXPERIENCIAS_MARQUEE = [
  {
    title: "Ponta do Corumbau",
    desc: "Faixa de areia de 2km mar adentro na maré baixa",
    extra: "Lancha no Rio · Maré 0.2m",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80",
    badge: "🌊 Maré Baixa",
  },
  {
    title: "Praia do Satú",
    desc: "Lagoas de água doce e falésias coloridas preservadas",
    extra: "4km de caminhada pela areia",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
    badge: "🌴 Praia Deserta",
  },
  {
    title: "Forró do Ouriço",
    desc: "O forró pé de serra mais tradicional do Brasil",
    extra: "Começa às 23:30 na areia",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80",
    badge: "🎶 Tradição Viva",
  },
  {
    title: "Descida de Boia no Rio",
    desc: "Descida relaxante com a correnteza suave do Rio Caraíva",
    extra: "Saída no Porto · Água Morna",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80",
    badge: "🛶 Rio Caraíva",
  },
  {
    title: "Aldeia Porto do Boi",
    desc: "Imersão cultural Pataxó, banho de ervas e dança Awê",
    extra: "Passeio de Buggy / Trilha",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80",
    badge: "🏹 Cultura Pataxó",
  },
];

const CATEGORIES = [
  { id: "todos", label: "Tudo", icon: Compass },
  { id: "restaurantes", label: "Restaurantes", icon: UtensilsCrossed },
  { id: "bares", label: "Bares & Drinks", icon: Flame },
  { id: "praias", label: "Praias & Rio", icon: Waves },
  { id: "passeios", label: "Passeios & Lanchas", icon: Sailboat },
  { id: "noite", label: "Forró & Noite", icon: Moon },
  { id: "hospedagens", label: "Pousadas", icon: Bed },
  { id: "cafes", label: "Cafés", icon: Coffee },
];

export default function GuiaPage() {
  const [selectedCat, setSelectedCat] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBusinessModal, setActiveBusinessModal] = useState<Business | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);

  // Toggle Favorito
  const toggleFav = (id: string) => {
    setSavedFavorites((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtragem dos negócios
  const filteredBusinesses = useMemo(() => {
    return CARAIVA_BUSINESSES.filter((b) => {
      if (selectedCat !== "todos" && b.category !== selectedCat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.subcategory.toLowerCase().includes(q) ||
          b.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCat, searchQuery]);

  return (
    <div className="space-y-12 animate-fade-in pb-28">
      
      {/* 1. DYNAMIC ISLAND STATUS NO TOPO */}
      <VillageDynamicIsland />

      {/* 2. HERO CINEMATOGRÁFICO DO GUIA COM EFEITO DE PALAVRAS E ESTRELAS */}
      <section className="relative text-center sm:text-left pt-2 pb-6 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-rio-400/30 bg-rio-500/10 px-4 py-1.5 text-xs font-semibold text-rio-300 backdrop-blur shadow-sm">
          <Compass size={15} className="text-rio-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Guia Oficial Digital de Caraíva · 100% Nativo & Atualizado</span>
        </div>

        {/* Título Principal com WordRotate e SparklesText */}
        <h1 className="max-w-5xl font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-areia-50 leading-[1.08]">
          <SparklesText className="text-areia-50">O Guia de Caraíva</SparklesText>{" "}
          <br className="hidden sm:inline" />
          <WordRotate
            duration={2800}
            words={[
              "onde comer a melhor moqueca na areia.",
              "como ir ao Satú e Corumbau na maré.",
              "onde dançar forró pé de serra hoje.",
              "o pôr do sol mágico no Rio Caraíva.",
              "o que fazer agora sem internet ou sinal.",
            ]}
            className="text-rio-400 font-extrabold italic underline decoration-rio-500/40 decoration-wavy decoration-2"
          />
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-areia-200/90 leading-relaxed font-normal">
          Tudo o que você precisa saber para viver a vila mais charmosa do Brasil: restaurantes autênticos, tábua de maré, praias desertas, agenda de forró e contato direto com os moradores.
        </p>

        {/* Campo de Busca Rápido com Efeito High-Tech */}
        <div className="max-w-xl pt-2">
          <div className="card flex items-center gap-3 p-3 border-white/15 bg-noite-900/80 shadow-2xl focus-within:border-rio-400 focus-within:ring-1 focus-within:ring-rio-400 transition">
            <Search size={18} className="text-rio-400 shrink-0 ml-1" />
            <input 
              type="text" 
              placeholder="Busque por 'moqueca', 'pastel de arraia', 'corumbau', 'forró'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-areia-50 outline-none placeholder:text-areia-400/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-areia-400 hover:text-areia-100 p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Tags Sugeridas */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5 text-xs text-areia-400">
            <span>Sugeridos:</span>
            {["Pastel de Arraia", "Ponta do Corumbau", "Forró do Ouriço", "Maré Baixa"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] text-areia-300 hover:bg-white/10 hover:text-white transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STORIES EM ALTA DEFINIÇÃO DE CARAÍVA */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-400 flex items-center gap-1.5">
              <Camera size={14} /> Stories da Vila Hoje
            </span>
          </div>
          <span className="text-[11px] text-areia-400">Arraste para o lado →</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {CARAIVA_STORIES.map((story) => (
            <div 
              key={story.id} 
              className="group relative h-48 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-noite-900 transition hover:border-coral-500/50 hover:scale-[1.02] cursor-pointer"
            >
              <img src={story.image} alt={story.title} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <span className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-coral-300 backdrop-blur">
                {story.tag}
              </span>

              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-bold text-areia-50 leading-tight">{story.title}</p>
                <p className="text-[10px] text-areia-400 mt-0.5 line-clamp-1">{story.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INFINITE RUNNING MARQUEE DUPLO: OS CARDS CORRENDO */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip border-rio-500/30 text-rio-400 font-bold text-[10px] uppercase tracking-wider">
                CARDÁPIOS & EXPERIÊNCIAS AO VIVO
              </span>
              <span className="flex h-2 w-2 rounded-full bg-rio-400 animate-ping" />
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-areia-50">
              O Melhor de Caraíva em Movimento
            </h2>
          </div>
          <p className="text-xs text-areia-400 max-w-sm">
            Cards animados com conteúdo de demonstração. Encoste o mouse ou o dedo para congelar e ver detalhes.
          </p>
        </div>

        {/* Efeito de Máscara de Gradiente nas Pontas */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] space-y-2">
          
          {/* ESTEIRA 1: RESTAURANTES & SABORES (SENTIDO NORMAL) */}
          <Marquee duration={34} pauseOnHover gap="1.25rem">
            {GASTRONOMIA_MARQUEE.map((item, idx) => (
              <div 
                key={idx}
                className="group relative flex w-80 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-noite-900/90 p-3.5 backdrop-blur hover:border-coral-500/40 transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => {
                  const b = CARAIVA_BUSINESSES.find(biz => biz.name.toLowerCase().includes(item.name.toLowerCase()));
                  if (b) setActiveBusinessModal(b);
                }}
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/60 px-1 text-[9px] text-amber-300 backdrop-blur">
                    <Star size={9} fill="currentColor" /> {item.rating}
                  </span>
                </div>

                <div className="ml-3.5 flex flex-1 flex-col justify-between">
                  <div>
                    <span className={`inline-block rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${item.color}`}>
                      {item.tag}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-areia-50 line-clamp-1 group-hover:text-coral-300 transition">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-areia-300 line-clamp-1 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-bold">{item.highlight}</span>
                    <span className="text-areia-400">{item.place}</span>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>

          {/* ESTEIRA 2: PRAIAS, PASSEIOS & NOITE (SENTIDO REVERSO) */}
          <Marquee duration={36} reverse pauseOnHover gap="1.25rem">
            {EXPERIENCIAS_MARQUEE.map((item, idx) => (
              <div 
                key={idx}
                className="group relative flex w-80 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-noite-900/90 p-3.5 backdrop-blur hover:border-rio-500/40 transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => setSearchQuery(item.title)}
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="ml-3.5 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="inline-block rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-rio-300">
                      {item.badge}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-areia-50 line-clamp-1 group-hover:text-rio-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-areia-300 line-clamp-2 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-rio-400 font-semibold">{item.extra}</span>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* 5. BENTO GRID HIGH-TECH: AS 4 EXPERIÊNCIAS ESSENCIAIS */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-coral-400">
              EXPERIÊNCIAS OBRIGATÓRIAS
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-areia-50">
              Como Viver Caraíva de Verdade
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 Grande com BorderBeam: Pôr do Sol e Pastel no Rio */}
          <div className="relative md:col-span-2 overflow-hidden rounded-3xl border border-rio-500/30 bg-gradient-to-br from-noite-900 via-rio-950/20 to-noite-950 p-6 sm:p-8">
            <BorderBeam size={260} duration={14} colorFrom="#3BA7B8" colorTo="#F08A5D" borderWidth={2} />
            
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="chip border-rio-400/30 text-rio-300 font-bold text-[10px]">
                  TRADIÇÃO NATIVA
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-areia-50 mt-2">
                  O Pôr do Sol no Rio Caraíva
                </h3>
                <p className="text-sm text-areia-200 mt-2 leading-relaxed max-w-xl">
                  Às 17:00, o vilarejo inteiro se reúne na beira do rio. É hora de pedir o pastel de arraia no Boteco do Pará, tomar uma caipirinha de cacau e assistir ao sol descer suavemente na água espelhada sob as amendoeiras.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[10px] text-areia-400">Melhor Horário</p>
                  <p className="text-sm font-bold text-rio-400 mt-0.5">16:45 às 17:40</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[10px] text-areia-400">O que pedir</p>
                  <p className="text-sm font-bold text-areia-50 mt-0.5">Pastel de Arraia</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[10px] text-areia-400">Local Principal</p>
                  <p className="text-sm font-bold text-coral-400 mt-0.5">Beira-Rio Norte</p>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setSearchQuery("Boteco do Pará")}
                  className="btn-primary min-h-[44px] text-xs font-bold px-5"
                >
                  Ver Detalhes do Boteco do Pará →
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Ponta do Corumbau */}
          <div className="relative overflow-hidden rounded-3xl border border-coral-500/30 bg-gradient-to-br from-noite-900 via-coral-950/20 to-noite-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-coral-500/20 text-coral-300">
                  <Waves size={20} />
                </div>
                <span className="chip border-coral-500/30 text-coral-300 text-[10px] font-bold">
                  Passeio Top #1
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-areia-50 mt-4">
                Ponta do Corumbau
              </h3>
              <p className="text-xs text-areia-300 mt-2 leading-relaxed">
                Águas mornas e cristalinas onde o rio encontra o oceano. A ponta de areia só se revela completamente na maré baixa.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-coral-400">Saída de lancha no Rio</span>
              <Link href="/turista/passeios" className="text-xs font-bold text-areia-100 hover:text-white flex items-center gap-1">
                Ver Vagas <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card 3: Forró do Ouriço */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-noite-900 via-amber-950/20 to-noite-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300">
                  <Moon size={20} />
                </div>
                <span className="chip border-amber-500/30 text-amber-300 text-[10px] font-bold">
                  Noite na Areia
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-areia-50 mt-4">
                Forró Pé de Serra
              </h3>
              <p className="text-xs text-areia-300 mt-2 leading-relaxed">
                Toda noite o vilarejo descalço dança forró. Forró do Ouriço e Pelé se alternam com trios de sanfona até o amanhecer.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Começa às 23:30</span>
              <button onClick={() => setSearchQuery("Forró do Ouriço")} className="text-xs font-bold text-areia-100 hover:text-white flex items-center gap-1">
                Conhecer <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Card 4: Na Areia Delivery no Guia */}
          <div className="relative md:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-noite-900/60 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-white/10 text-areia-50">
                  <Zap size={20} />
                </div>
                <span className="chip text-[10px] font-bold">
                  Tecnologia na Praia
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-areia-50 mt-4">
                Na Areia Delivery Integrado ao Guia
              </h3>
              <p className="text-xs text-areia-300 mt-2 leading-relaxed">
                Bateu preguiça de sair da pousada ou da praia? Peça cerveja trincando, água de coco ou moqueca direto pelo Na Areia. Sem esperar no WhatsApp, com entrega por charreteiros e entregadores locais.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">R$ 15 taxa fixa na vila</span>
              <Link href="/turista/delivery" className="text-xs font-bold text-areia-100 hover:text-white flex items-center gap-1">
                Pedir Agora <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FILTRO TÁTIL DE CATEGORIAS + GRID DOS ESTABELECIMENTOS REAIS */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="chip border-white/10 text-areia-300 text-[10px] font-bold uppercase">
              DIRETÓRIO COMPLETO
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-areia-50">
              Lugares de Caraíva ({filteredBusinesses.length})
            </h2>
          </div>

          {/* Seletor de Categorias com Rolagem Suave */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 touch-pan-x w-full sm:w-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`flex items-center gap-1.5 min-h-[44px] shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                    isActive 
                      ? "bg-rio-500 text-noite-950 font-bold shadow-md shadow-rio-500/20" 
                      : "bg-white/5 text-areia-300 hover:bg-white/10 hover:text-areia-100"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-noite-950" : "text-rio-400"} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Lugares */}
        {filteredBusinesses.length === 0 ? (
          <div className="card p-12 text-center text-areia-400 space-y-3">
            <Compass size={32} className="mx-auto text-areia-400/40" />
            <p className="text-sm">Nenhum lugar encontrado com essa busca.</p>
            <button 
              onClick={() => { setSelectedCat("todos"); setSearchQuery(""); }}
              className="btn-ghost text-xs px-4"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((b) => {
              const isFav = savedFavorites.includes(b.id);
              return (
                <Card3D key={b.id} depth={10}>
                  <div className="card overflow-hidden h-full flex flex-col justify-between hover:border-white/20 transition group">
                    <div>
                      {/* Foto Real */}
                      <div className="relative h-48 w-full overflow-hidden bg-black/40">
                        <img 
                          src={b.cover_image || b.heroImage || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"} 
                          alt={b.name} 
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-noite-950 via-noite-950/20 to-transparent" />
                        
                        {/* Categoria e Favorito */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-areia-200 border border-white/10">
                            {b.subCategory || b.subcategory}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFav(b.id); }}
                            className={`h-8 w-8 rounded-full grid place-items-center backdrop-blur-md border border-white/10 transition ${
                              isFav ? "bg-red-500 text-white" : "bg-black/50 text-white hover:bg-black/70"
                            }`}
                            aria-label="Favoritar"
                          >
                            <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                          </button>
                        </div>

                        {/* Nota e Avaliações */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-areia-50 bg-black/60 backdrop-blur px-2 py-0.5 rounded-lg">
                          <Star size={12} className="text-amber-400" fill="currentColor" />
                          <span>{b.rating}</span>
                          <span className="text-[10px] text-areia-400 font-normal">({b.review_count} avaliações)</span>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-display text-xl font-bold text-areia-50 group-hover:text-rio-300 transition">
                          {b.name}
                        </h3>
                        <p className="text-xs text-areia-300/80 line-clamp-2 leading-relaxed">
                          {b.shortDescription || b.description}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-areia-400">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} className="text-rio-400" /> {b.locationReference || "Vila de Caraíva"}
                          </span>
                          {b.price_range && (
                            <span className="text-emerald-400 font-semibold">• {b.price_range}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações Rápidas & Transação Direta no App */}
                    <div className="p-4 pt-0 border-t border-white/5 mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveBusinessModal(b)}
                        className="btn-ghost min-h-[40px] text-xs px-3 border-white/10"
                      >
                        Ver Detalhes
                      </button>

                      {/* Botão de Ação Direta no App */}
                      {b.category === "hospedagens" ? (
                        <Link
                          href={`/turista/pousadas?room=${b.id}`}
                          className="btn-primary min-h-[40px] text-xs px-3 font-bold flex-1 flex items-center justify-center gap-1 shadow-md bg-amber-500 hover:bg-amber-400 text-noite-950"
                        >
                          <span>Reservar Quarto</span>
                          <ArrowRight size={13} />
                        </Link>
                      ) : b.category === "passeios" || b.category === "noite" ? (
                        <Link
                          href={`/turista/passeios?tour=${b.id}`}
                          className="btn-primary min-h-[40px] text-xs px-3 font-bold flex-1 flex items-center justify-center gap-1 shadow-md bg-cyan-500 hover:bg-cyan-400 text-noite-950"
                        >
                          <span>Garantir Vaga</span>
                          <ArrowRight size={13} />
                        </Link>
                      ) : (
                        <Link
                          href={`/turista/delivery?store=${b.id}`}
                          className="btn-primary min-h-[40px] text-xs px-3 font-bold flex-1 flex items-center justify-center gap-1 shadow-md bg-coral-500 hover:bg-coral-400 text-noite-950"
                        >
                          <span>Pedir no App</span>
                          <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. MODAL DE DETALHES COMPLETO DO ESTABELECIMENTO */}
      {activeBusinessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-noite-950 p-6 shadow-2xl text-areia-100 scrollbar-none">
            {/* Fechar */}
            <button 
              onClick={() => setActiveBusinessModal(null)}
              className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-black/60 border border-white/10 text-areia-300 hover:text-white grid place-items-center"
            >
              <X size={16} />
            </button>

            {/* Imagem Cover */}
            <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-black/40 -mt-2 -mx-2 mb-4">
              <img 
                src={activeBusinessModal.cover_image || activeBusinessModal.heroImage} 
                alt={activeBusinessModal.name} 
                className="h-full w-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noite-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="chip bg-black/60 border-white/10 text-areia-200 text-xs">
                  {activeBusinessModal.subCategory || activeBusinessModal.subcategory}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-areia-50 mt-1">
                  {activeBusinessModal.name}
                </h2>
              </div>
            </div>

            {/* Avaliações e Endereço */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Star size={14} fill="currentColor" /> {activeBusinessModal.rating}
                <span className="text-areia-400 font-normal">({activeBusinessModal.review_count} avaliações oficiais)</span>
              </div>
              <span className="text-areia-400 flex items-center gap-1">
                <MapPin size={12} className="text-rio-400" /> {activeBusinessModal.address}
              </span>
            </div>

            {/* Descrição Longa */}
            <div className="mt-4 space-y-3">
              <p className="text-sm text-areia-200 leading-relaxed">
                {activeBusinessModal.description}
              </p>
              
              {activeBusinessModal.openingHours && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-areia-300">
                  <Clock size={14} className="text-rio-400 shrink-0" />
                  <span><strong>Horário de Funcionamento:</strong> {activeBusinessModal.openingHours}</span>
                </div>
              )}
            </div>

            {/* Pratos / Destaques do Cardápio se houver */}
            {activeBusinessModal.menuHighlights && activeBusinessModal.menuHighlights.length > 0 && (
              <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-coral-400">
                  Pratos & Experiências Recomendadas
                </h4>
                <div className="space-y-2">
                  {activeBusinessModal.menuHighlights.map((dish, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-areia-50">{dish.name}</p>
                        {dish.description && <p className="text-areia-400 text-[11px] mt-0.5">{dish.description}</p>}
                      </div>
                      <span className="font-bold text-emerald-400 shrink-0">{dish.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botões de Ação & Transação no App */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
              {activeBusinessModal.category === "hospedagens" ? (
                <Link
                  href={`/turista/pousadas?room=${activeBusinessModal.id}`}
                  className="btn-primary flex-1 min-h-[46px] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xl bg-amber-500 hover:bg-amber-400 text-noite-950"
                >
                  <Sparkles size={15} />
                  <span>Reservar Quarto no App (Disponibilidade Real)</span>
                  <ArrowRight size={14} />
                </Link>
              ) : activeBusinessModal.category === "passeios" || activeBusinessModal.category === "noite" ? (
                <Link
                  href={`/turista/passeios?tour=${activeBusinessModal.id}`}
                  className="btn-primary flex-1 min-h-[46px] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xl bg-cyan-500 hover:bg-cyan-400 text-noite-950"
                >
                  <Waves size={15} />
                  <span>Garantir Vaga no Passeio / Evento</span>
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link
                  href={`/turista/delivery?store=${activeBusinessModal.id}`}
                  className="btn-primary flex-1 min-h-[46px] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xl bg-coral-500 hover:bg-coral-400 text-noite-950"
                >
                  <Zap size={15} />
                  <span>Fazer Pedido no App (Sem Fila)</span>
                  <ArrowRight size={14} />
                </Link>
              )}

              {activeBusinessModal.instagram && (
                <a
                  href={`https://instagram.com/${activeBusinessModal.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost min-h-[46px] text-xs px-4 border-white/10"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
