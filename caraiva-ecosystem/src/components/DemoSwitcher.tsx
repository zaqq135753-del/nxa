"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bike,
  BedDouble,
  Building2,
  Compass,
  ExternalLink,
  Layers,
  Pill,
  ShoppingBag,
  Sparkles,
  Store,
  UtensilsCrossed,
} from "lucide-react";

const BUSINESS_LINKS = [
  { href: "/business", label: "Visão geral", shortLabel: "Início", icon: Layers },
  { href: "/business/delivery", label: "Pedidos & estoque", shortLabel: "Pedidos", icon: ShoppingBag },
  { href: "/business/pousada", label: "Hospedagem", shortLabel: "Pousada", icon: BedDouble },
  { href: "/business/passeios", label: "Passeios", shortLabel: "Passeios", icon: Compass },
  { href: "/business/restaurante", label: "Restaurante", shortLabel: "Restaurante", icon: UtensilsCrossed },
  { href: "/business/farmacia", label: "Farmácia", shortLabel: "Farmácia", icon: Pill },
  { href: "/business/servicos", label: "Serviços", shortLabel: "Serviços", icon: Sparkles },
  { href: "/business/loja", label: "Loja", shortLabel: "Loja", icon: Store },
  { href: "/business/entregador", label: "Entregas", shortLabel: "Entregas", icon: Bike },
];

export function DemoSwitcher() {
  const path = usePathname();

  return (
    <header className="safe-top sticky top-0 z-50 border-b border-white/10 bg-noite-950/95 text-areia-100 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-3 sm:px-5">
        <Link href="/business" className="flex min-w-0 items-center gap-2.5" aria-label="Caraíva Business, início">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-mata-400/30 bg-mata-400/10 text-mata-300">
            <Building2 size={18} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold tracking-wide">CARAÍVA <span className="text-mata-300">BUSINESS</span></span>
            <span className="hidden text-[10px] text-areia-400 sm:block">Pedidos, reservas e operação</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold text-amber-200 sm:text-[11px]">
            {process.env.NEXT_PUBLIC_CARAIVA_CLOUD==='true'?'Banco compartilhado':'Demonstração'}
          </span>
          <a
            href="https://caraiva.digital"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-10 items-center gap-1.5 rounded-xl border border-white/10 px-3 text-xs font-semibold text-areia-200 transition hover:bg-white/5 sm:flex"
          >
            Caraíva Digital <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <nav aria-label="Módulos Business" className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 py-1.5 scrollbar-none touch-pan-x overscroll-x-contain sm:gap-1.5 sm:px-5">
          {BUSINESS_LINKS.map(({ href, label, shortLabel, icon: Icon }) => {
            const active = href === "/business" ? path === href : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition active:scale-[0.98] sm:min-h-9 sm:px-3.5 ${
                  active
                    ? "bg-mata-300 text-noite-950 shadow-sm shadow-mata-300/20"
                    : "text-areia-300 hover:bg-white/5 hover:text-areia-50"
                }`}
              >
                <Icon size={15} aria-hidden="true" />
                <span className="sm:hidden">{shortLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
