import React from "react";
import { Flame, Clock, MapPin, ChevronRight } from "lucide-react";
import { CARAIVA_NOW_ACTIVITIES, CARAIVA_BUSINESSES, type NowActivity, type Business } from "../../data/caraivaDigitalData";
import { openBusinessInApp, trackEvent } from "../../services/analytics";
import { SafeBusinessImage } from "./SafeBusinessImage";

export interface CaraivaNowSectionProps {
  onSelectBusiness: (business: Business) => void;
  onNavigateToNowTab?: () => void;
  onSeeAllNow?: () => void;
}

export const CaraivaNowSection: React.FC<CaraivaNowSectionProps> = ({
  onSelectBusiness,
  onNavigateToNowTab,
  onSeeAllNow,
}) => {
  const handleAction = (activity: NowActivity) => {
    trackEvent("event_click", {
      businessId: activity.business_id,
      businessName: activity.title,
      source: "home_now_carousel",
    });

    const biz = CARAIVA_BUSINESSES.find((b) => b.id === activity.business_id);
    if (activity.ctaType === "whatsapp" || activity.ctaType === "reservar" || activity.ctaType === "passeio") {
      if (biz) {
        openBusinessInApp(biz, "home_now_card");
        return;
      }
    }

    if (biz) onSelectBusiness(biz);
  };

  return (
    <section className="cv-now-section px-4 mt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-400/15 flex items-center justify-center text-amber-500">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h2
              className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-tight"
              style={{ color: "var(--cv-ink)" }}
            >
              Caraíva Agora
            </h2>
            <p className="text-[10px] sm:text-[11px]" style={{ color: "var(--cv-muted)" }}>
              Sugestões do catálogo — confirme os horários no perfil
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (onSeeAllNow ? onSeeAllNow() : onNavigateToNowTab?.())}
          className="text-xs font-bold text-amber-500 flex items-center gap-0.5 hover:underline active:scale-95"
        >
          <span>Ver tudo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Carrossel de Cards Cinematográficos Horizontais */}
      <div className="cv-now-carousel flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 snap-x select-none">
        {CARAIVA_NOW_ACTIVITIES.map((item) => (
          <div
            key={item.id}
            onClick={() => handleAction(item)}
            className="cv-now-card cd-card-3d shrink-0 w-[230px] sm:w-[250px] rounded-2xl shadow-md transition-all active:scale-[0.98] snap-start overflow-hidden flex flex-col justify-between cursor-pointer group"
            style={{
              background: "var(--cv-paper)",
              border: "1px solid var(--cv-line)",
            }}
          >
            {/* Imagem com Tag de Urgência */}
            <div className="relative h-28 w-full overflow-hidden bg-slate-900">
              <SafeBusinessImage
                src={item.image}
                alt={item.title}
                category="gastronomia"
                fallbackSeed={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Tag de Urgência / Status */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-sm">
                  Do cadastro
                </span>
              </div>

              {/* Distância a pé */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-medium bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-md" style={{ color: "#FFFFFF" }}>
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{item.distanceTime}</span>
              </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3
                  className="text-xs font-bold line-clamp-1 group-hover:text-amber-500 transition-colors"
                  style={{ color: "var(--cv-ink)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[11px] line-clamp-2 mt-1 leading-snug"
                  style={{ color: "var(--cv-muted)" }}
                >
                  {item.subtitle}
                </p>
              </div>

              <div
                className="mt-2.5 pt-2 flex items-center justify-between"
                style={{ borderTop: "1px solid var(--cv-line)" }}
              >
                <div
                  className="flex items-center gap-1 text-[10px] font-semibold"
                  style={{ color: "var(--cv-river)" }}
                >
                  <Clock className="w-3 h-3" />
                  <span>{item.timeWindow}</span>
                </div>

                <span
                  className="text-[11px] font-bold flex items-center gap-0.5"
                  style={{ color: "var(--cv-gold)" }}
                >
                  <span>{item.cta}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaraivaNowSection;
