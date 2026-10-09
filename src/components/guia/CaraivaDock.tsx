import { Compass, Heart, Home, Map, Zap } from "lucide-react";
import type { GuiaTab } from "../../screens/GuiaCaraivaApp";
import type { CaraivaMoment } from "./useCaraivaMoment";

const destinations = [
  { id: "inicio", label: "Início", Icon: Home },
  { id: "explorar", label: "Explorar", Icon: Compass },
  { id: "agora", label: "Agora", Icon: Zap },
  { id: "mapa", label: "Mapa", Icon: Map },
  { id: "salvos", label: "Salvos", Icon: Heart },
] as const;

export function CaraivaDock({ activeTab, onNavigate, favoritesCount, moment }: {
  activeTab: GuiaTab; onNavigate: (tab: GuiaTab) => void; favoritesCount: number; moment: CaraivaMoment;
}) {
  return <nav className="caraiva-dock" aria-label="Navegação do guia">
    {destinations.map(({ id, label, Icon }) => <button type="button" key={id}
      className={`caraiva-dock-item${id === "agora" ? " caraiva-dock-now" : ""}`}
      aria-current={activeTab === id ? "page" : undefined}
      aria-label={id === "agora" ? `Agora — ${moment.nowLabel}` : id === "salvos" ? `Salvos — ${favoritesCount} lugares` : label}
      title={id === "agora" ? moment.nowLabel : label} onClick={() => onNavigate(id)}>
      <span className="caraiva-dock-icon"><Icon size={21} aria-hidden="true" />
        {id === "salvos" && favoritesCount > 0 && <span className="caraiva-dock-badge" aria-hidden="true">{favoritesCount > 99 ? "99+" : favoritesCount}</span>}
      </span>
      <span>{label}</span>{id === "agora" && <small>{moment.nowLabel}</small>}
    </button>)}
  </nav>;
}
