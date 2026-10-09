import React from "react";
import { asset } from "../../lib/asset";

export type IntentionId =
  | "agora"
  | "comer"
  | "praias"
  | "passeios"
  | "noite"
  | "comprar"
  | "cafe"
  | "eventos";

interface IntentionItem {
  id: IntentionId;
  label: string;
  icon: string;
  image: string;
  badge?: string;
}

const INTENTIONS: IntentionItem[] = [
  {
    id: "agora",
    label: "Agora",
    icon: "🔥",
    image: asset("assets/caraiva-photos/caraiva-07-640.webp"),
    badge: "Ao vivo",
  },
  {
    id: "comer",
    label: "Comer",
    icon: "🍽️",
    image: asset("assets/caraiva-photos/caraiva-12-640.webp"),
  },
  {
    id: "praias",
    label: "Praias",
    icon: "🏖️",
    image: asset("assets/caraiva-photos/caraiva-09-640.webp"),
  },
  {
    id: "passeios",
    label: "Passeios",
    icon: "🛶",
    image: asset("assets/caraiva-photos/caraiva-05-640.webp"),
  },
  {
    id: "noite",
    label: "Noite & Forró",
    icon: "🌙",
    image: asset("assets/caraiva-photos/caraiva-02-640.webp"),
  },
  {
    id: "cafe",
    label: "Café",
    icon: "☕",
    image: asset("assets/caraiva-photos/caraiva-11-640.webp"),
  },
  {
    id: "comprar",
    label: "Comprar",
    icon: "🛍️",
    image: asset("assets/caraiva-photos/caraiva-03-640.webp"),
  },
  {
    id: "eventos",
    label: "Eventos",
    icon: "🎵",
    image: asset("assets/caraiva-photos/caraiva-07-640.webp"),
  },
];

export interface CaraivaIntentionsBarProps {
  selectedIntention?: IntentionId | null;
  onSelectIntention: (id: IntentionId) => void;
}

export const CaraivaIntentionsBar: React.FC<CaraivaIntentionsBarProps> = ({
  selectedIntention,
  onSelectIntention,
}) => {
  return (
    <section className="px-4 mt-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <span>Explore por Intenção</span>
        </h2>
        {selectedIntention && (
          <button
            type="button"
            onClick={() => onSelectIntention("agora")}
            className="text-[11px] font-semibold text-amber-400 hover:underline active:scale-95"
          >
            Limpar filtro
          </button>
        )}
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none -mx-4 px-4 snap-x">
        {INTENTIONS.map((item) => {
          const isSelected = selectedIntention === item.id;
          return (
            <button
              data-cv-depth="true"
              key={item.id}
              type="button"
              onClick={() => onSelectIntention(item.id)}
              className={`relative shrink-0 w-[80px] sm:w-[84px] h-[92px] sm:h-[96px] rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 snap-start shadow-sm border ${
                isSelected
                  ? "border-amber-400 ring-2 ring-amber-400/40 scale-[1.03] shadow-lg shadow-amber-400/20"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              {/* Imagem de Fundo com Gradiente */}
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 transition-colors ${
                  isSelected
                    ? "bg-gradient-to-t from-[#080d12]/95 via-[#080d12]/60 to-amber-500/30"
                    : "bg-gradient-to-t from-black/85 via-black/40 to-black/20 hover:from-black/75"
                }`}
              />

              {/* Badge Dinâmico (ex: Ao vivo) */}
              {item.badge && (
                <span className="absolute top-1.5 left-1.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wide bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}

              {/* Rótulo e Ícone */}
              <div className="absolute bottom-2 inset-x-1.5 text-center text-white">
                <span className="text-base block mb-0.5 filter drop-shadow">{item.icon}</span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-tight block leading-tight truncate drop-shadow">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CaraivaIntentionsBar;
