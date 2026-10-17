import { Compass, Heart, Home, Map, Sparkles } from "lucide-react";
import type { GuiaTab } from "../../screens/GuiaCaraivaApp";
import type { CaraivaMoment } from "./useCaraivaMoment";

const destinations = [
  { id: "inicio", label: "Início", Icon: Home },
  { id: "explorar", label: "Explorar", Icon: Compass },
  { id: "concierge", label: "Guia IA", Icon: Sparkles, isAiCore: true },
  { id: "mapa", label: "Mapa", Icon: Map },
  { id: "salvos", label: "Salvos", Icon: Heart },
] as const;

export function CaraivaDock({
  activeTab,
  onNavigate,
  favoritesCount,
  moment,
}: {
  activeTab: GuiaTab;
  onNavigate: (tab: GuiaTab) => void;
  favoritesCount: number;
  moment: CaraivaMoment;
}) {
  const handleItemClick = (id: GuiaTab) => {
    // Microinteração de vibração tátil (haptic feedback) nativa
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        /* Ignora se o navegador restringir vibração */
      }
    }
    // Se tocar na aba atual, rola suavemente até o topo
    if (activeTab === id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onNavigate(id);
  };

  return (
    <nav className="caraiva-dock cd-floating-dock" aria-label="Navegação do guia">
      {destinations.map(({ id, label, Icon, ...rest }) => {
        const isAi = "isAiCore" in rest && rest.isAiCore;
        const isActive = activeTab === id || (id === "explorar" && activeTab === "agora");

        return (
          <button
            type="button"
            key={id}
            className={`caraiva-dock-item cd-dock-btn ${isAi ? "cd-dock-ai-center" : ""}`}
            aria-current={isActive ? "page" : undefined}
            aria-label={
              isAi
                ? `Guia Caraíva IA — ${moment.nowLabel}`
                : id === "salvos"
                ? `Salvos — ${favoritesCount} lugares`
                : label
            }
            title={isAi ? "Assistente Inteligente de Caraíva" : label}
            onClick={() => handleItemClick(id as GuiaTab)}
          >
            <span className="caraiva-dock-icon">
              {isAi ? (
                <div className="cd-ai-orb-ring">
                  <Icon size={22} className="cd-ai-icon-pulse" aria-hidden="true" />
                </div>
              ) : (
                <Icon size={20} aria-hidden="true" />
              )}

              {id === "salvos" && favoritesCount > 0 && (
                <span className="caraiva-dock-badge" aria-hidden="true">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </span>

            <span className="cd-dock-label">{label}</span>
            {isAi && <small className="cd-dock-sub">{moment.nowLabel}</small>}
          </button>
        );
      })}
    </nav>
  );
}
