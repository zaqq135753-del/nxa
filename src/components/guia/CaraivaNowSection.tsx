import React from "react";
import { Flame, Clock, MapPin, ChevronRight, MessageCircle } from "lucide-react";
import { CARAIVA_NOW_ACTIVITIES, CARAIVA_BUSINESSES, type NowActivity, type Business } from "../../data/caraivaDigitalData";
import { openBusinessWhatsApp, trackEvent } from "../../services/analytics";

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
        openBusinessWhatsApp(biz, "home_now_card", `Olá! Vi o destaque "${activity.title}" no Caraíva Agora e gostaria de informações!`);
        return;
      }
    }

    if (biz) onSelectBusiness(biz);
  };

  return (
    <section className="cv-now-section px-4 mt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-400/15 flex items-center justify-center text-amber-400">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider leading-tight">
              Caraíva Agora
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400">
              Acontecendo ou começando em breve na vila
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (onSeeAllNow ? onSeeAllNow() : onNavigateToNowTab?.())}
          className="text-xs font-bold text-amber-400 flex items-center gap-0.5 hover:underline active:scale-95"
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
            className="cv-now-card shrink-0 w-[230px] sm:w-[250px] rounded-2xl bg-[#111921] border border-white/10 shadow-lg hover:border-amber-400/40 transition-all active:scale-[0.98] snap-start overflow-hidden flex flex-col justify-between cursor-pointer group"
          >
            {/* Imagem com Tag de Urgência */}
            <div className="relative h-28 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111921] via-black/30 to-transparent" />

              {/* Tag de Urgência / Status */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-sm">
                  {item.tag}
                </span>
              </div>

              {/* Distância a pé */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-white/90 font-medium bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{item.distanceTime}</span>
              </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-cyan-300">
                  <Clock className="w-3 h-3" />
                  <span>{item.timeWindow}</span>
                </div>

                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-0.5">
                  {item.ctaType === "whatsapp" && <MessageCircle className="w-3 h-3 text-emerald-400" />}
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
