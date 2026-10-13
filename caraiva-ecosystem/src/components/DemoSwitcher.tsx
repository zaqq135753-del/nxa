"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Compass, 
  ShoppingBag, 
  BedDouble, 
  Sailboat, 
  LayoutGrid, 
  UtensilsCrossed, 
  Pill, 
  Sparkles, 
  Store, 
  Bike,
  Smartphone,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

const TURISTA_LINKS = [
  { href: "/turista", label: "Hub Turista", icon: Compass, desc: "Feed da vila, maré & concierge" },
  { href: "/turista/delivery", label: "Na Areia Delivery", icon: Smartphone, desc: "Pede no quarto, chega na areia" },
  { href: "/turista/pousadas", label: "Quartos & Pousadas", icon: BedDouble, desc: "Diárias sem taxa de 27%" },
  { href: "/turista/passeios", label: "Barcos & Passeios", icon: Sailboat, desc: "Vagas por tábua de maré" },
  { href: "/turista/carteira", label: "Carteira & Pix", icon: Sparkles, desc: "Saldo e comprovantes" },
];

const BUSINESS_LINKS = [
  { href: "/business", label: "Business Hub OS", icon: Layers, desc: "Visão executiva consolidada" },
  { href: "/business/delivery", label: "Na Areia (KDS/Estoque)", icon: ShoppingBag, desc: "Cozinha & estoque de bebidas" },
  { href: "/business/pousada", label: "Pousadas (Quartos/Tarifas)", icon: BedDouble, desc: "Quartos, Só Hoje & iCal" },
  { href: "/business/passeios", label: "Barqueiros (Vagas/Maré)", icon: Sailboat, desc: "Assentos & saídas de lancha" },
  { href: "/business/restaurante", label: "Restaurante (Fila Digital)", icon: UtensilsCrossed, desc: "Buzzer virtual & ingressos" },
  { href: "/business/farmacia", label: "Farmácia (Plantão/Estoque)", icon: Pill, desc: "Balcão noturno & remédios" },
  { href: "/business/servicos", label: "Spa & Terapias (Agenda)", icon: Sparkles, desc: "Massagem, yoga & kitesurf" },
  { href: "/business/loja", label: "Lojas & Artesanato", icon: Store, desc: "Estoque de joias & moda praia" },
  { href: "/business/entregador", label: "App Entregador", icon: Bike, desc: "Rotas nas ruas de areia" },
];

export function DemoSwitcher() {
  const path = usePathname();
  const [filterMode, setFilterMode] = useState<"todos" | "turista" | "business">("todos");

  const isTuristaPage = path.startsWith("/turista");
  const isBusinessPage = path.startsWith("/business");
  const isDashboardPage = path.startsWith("/dashboard");
  const isGuiaPage = path.startsWith("/guia");

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-noite-950/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-3 py-2">
        {/* Barra superior de status e seleção rápida de ecossistema */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-1.5">
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                isDashboardPage 
                  ? "bg-coral-500 text-white shadow-md shadow-coral-500/30" 
                  : "bg-coral-500/15 text-coral-400 hover:bg-coral-500/25"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Painel Geral (Você)</span>
              <span className="hidden sm:inline text-[10px] bg-black/40 px-1.5 py-0.2 rounded font-normal">Comparativo</span>
            </Link>

            <span className="text-white/20">|</span>

            {/* Identificador visual de onde o usuário está agora */}
            <div className="text-[11px] font-medium text-areia-300 flex items-center gap-1">
              <span>Você está vendo:</span>
              {isTuristaPage && (
                <span className="rounded-full bg-coral-400/20 px-2 py-0.5 font-bold text-coral-300 ring-1 ring-coral-400/30">
                  🌴 Ecossistema Turista
                </span>
              )}
              {isBusinessPage && (
                <span className="rounded-full bg-mata-400/20 px-2 py-0.5 font-bold text-mata-300 ring-1 ring-mata-400/30">
                  💼 Ecossistema Dono de Negócio
                </span>
              )}
              {isDashboardPage && (
                <span className="rounded-full bg-purple-400/20 px-2 py-0.5 font-bold text-purple-300 ring-1 ring-purple-400/30">
                  ⚙️ Visão Integrada Dupla
                </span>
              )}
              {!isTuristaPage && !isBusinessPage && !isDashboardPage && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-bold text-areia-200">
                  🌐 Apresentação Institucional
                </span>
              )}
            </div>
          </div>

          {/* Filtro de Abas: Todos / Só Turista / Só Business */}
          <div className="flex items-center gap-1 rounded-xl bg-white/5 p-0.5 ring-1 ring-white/10 text-xs">
            <button
              onClick={() => setFilterMode("todos")}
              className={`min-h-[28px] rounded-lg px-2.5 py-0.5 font-semibold transition ${
                filterMode === "todos" ? "bg-white/15 text-areia-50" : "text-areia-400 hover:text-areia-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterMode("turista")}
              className={`min-h-[28px] rounded-lg px-2.5 py-0.5 font-semibold transition flex items-center gap-1 ${
                filterMode === "turista" ? "bg-coral-500/25 text-coral-300 font-bold" : "text-areia-400 hover:text-coral-300"
              }`}
            >
              🌴 Turista
            </button>
            <button
              onClick={() => setFilterMode("business")}
              className={`min-h-[28px] rounded-lg px-2.5 py-0.5 font-semibold transition flex items-center gap-1 ${
                filterMode === "business" ? "bg-mata-500/25 text-mata-300 font-bold" : "text-areia-400 hover:text-mata-300"
              }`}
            >
              💼 Business
            </button>
          </div>
        </div>

        {/* Links Agrupados com Rolagem Suave Horizontal */}
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none overscroll-x-contain touch-pan-x py-0.5">
          {/* GRUPO 1: TURISTA */}
          {(filterMode === "todos" || filterMode === "turista") && (
            <div className="flex items-center gap-1.5 shrink-0 bg-coral-950/40 border border-coral-500/20 rounded-2xl p-1">
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-coral-400 shrink-0 flex items-center gap-1">
                🌴 Turista:
              </span>
              {TURISTA_LINKS.map(({ href, label, icon: Icon }) => {
                const active = path === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition active:scale-95 touch-manipulation ${
                      active
                        ? "bg-coral-400 text-noite-950 font-bold shadow-md shadow-coral-400/30"
                        : "text-coral-200 hover:bg-coral-500/20 hover:text-white"
                    }`}
                  >
                    <Icon size={13} className={active ? "text-noite-950" : "text-coral-400"} />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* GRUPO 2: DONO DE NEGÓCIO */}
          {(filterMode === "todos" || filterMode === "business") && (
            <div className="flex items-center gap-1.5 shrink-0 bg-mata-950/40 border border-mata-500/20 rounded-2xl p-1">
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-mata-400 shrink-0 flex items-center gap-1">
                💼 Business:
              </span>
              {BUSINESS_LINKS.map(({ href, label, icon: Icon }) => {
                const active = path === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition active:scale-95 touch-manipulation ${
                      active
                        ? "bg-mata-400 text-noite-950 font-bold shadow-md shadow-mata-400/30"
                        : "text-mata-200 hover:bg-mata-500/20 hover:text-white"
                    }`}
                  >
                    <Icon size={13} className={active ? "text-noite-950" : "text-mata-400"} />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* LINK RÁPIDO PARA PLACA FÍSICA */}
          <Link
            href="/tag/flor-q04"
            className="flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-areia-300 hover:bg-white/10 hover:text-areia-50 transition ml-auto"
          >
            🏷️ Placa Quarto #04 (NFC)
          </Link>
        </div>
      </div>
    </nav>
  );
}
