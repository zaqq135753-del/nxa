import React, { useState, useMemo } from "react";
import { Clock, MapPin, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { CARAIVA_NOW_ACTIVITIES, CARAIVA_EVENTS, CARAIVA_BUSINESSES, type NowActivity, type Business } from "../../data/caraivaDigitalData";
import { openBusinessWhatsApp, trackEvent } from "../../services/analytics";
import { SafeBusinessImage } from "./SafeBusinessImage";

export interface CaraivaAgoraScreenProps {
  onSelectBusiness: (business: Business) => void;
  onSelectNowActivity?: (activity: NowActivity) => void;
  onOpenMapToBusiness?: (business: Business) => void;
}

type TimeFilter = "agora" | "proxima_hora" | "hoje" | "noite" | "amanha";
type CategoryFilter = "todos" | "Comer" | "Beber" | "Música" | "Passeios" | "Praia";

export const CaraivaAgoraScreen: React.FC<CaraivaAgoraScreenProps> = ({
  onSelectBusiness,
  onSelectNowActivity,
  onOpenMapToBusiness,
}) => {
  const [selectedTime, setSelectedTime] = useState<TimeFilter>("agora");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("todos");

  const filteredActivities = useMemo(() => {
    return CARAIVA_NOW_ACTIVITIES.filter((act) => {
      if (selectedCategory !== "todos" && act.category !== selectedCategory) {
        return false;
      }
      if (selectedTime === "noite" && act.category !== "Música" && act.category !== "Comer" && act.category !== "Noite") {
        return false;
      }
      if (selectedTime === "amanha" && !act.timeWindow.includes("amanhã")) {
        return false;
      }
      return true;
    });
  }, [selectedTime, selectedCategory]);

  const handleAction = (activity: NowActivity) => {
    trackEvent("event_click", {
      businessId: activity.business_id,
      businessName: activity.title,
      source: "agora_screen",
    });

    if (activity.ctaType === "whatsapp" || activity.ctaType === "reservar" || activity.ctaType === "passeio") {
      const biz = CARAIVA_BUSINESSES.find((b) => b.id === activity.business_id);
      if (biz) {
        openBusinessWhatsApp(biz, "agora_screen_cta", `Olá! Vi "${activity.title}" no Caraíva Agora e gostaria de confirmar!`);
        return;
      }
    }

    const biz = CARAIVA_BUSINESSES.find((b) => b.id === activity.business_id);
    if (activity.ctaType === "rota") {
      if (biz && onOpenMapToBusiness) onOpenMapToBusiness(biz);
      return;
    }

    if (biz) onSelectBusiness(biz);
    if (onSelectNowActivity) onSelectNowActivity(activity);
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-24">
      {/* Cabeçalho Editorial com Ícone Pulsante */}
      <div className="bg-gradient-to-br from-[#261B12] via-[#3B2A1A] to-[#102B31] text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-[#E88636]/15 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F6C76A]">
              A vila no seu ritmo
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            O que fazer agora?
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Explore opções para agora e confirme horários e disponibilidade com cada lugar.
          </p>
        </div>
      </div>

      {/* Filtros Temporais Rápidos */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none text-xs font-semibold">
        {(
          [
            { id: "agora", label: "🔥 Agora" },
            { id: "proxima_hora", label: "⏰ Próxima 1h" },
            { id: "hoje", label: "📅 Hoje" },
            { id: "noite", label: "🌙 À Noite" },
            { id: "amanha", label: "☀️ Amanhã" },
          ] as const
        ).map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setSelectedTime(filter.id)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all active:scale-95 ${
              selectedTime === filter.id
                ? "bg-[#C25B2E] text-white shadow-sm"
                : "bg-white text-[#4A3525] border border-black/[0.08] hover:bg-[#F4EDE2]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Categorias */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none text-[11px] font-medium">
        {(["todos", "Comer", "Beber", "Música", "Passeios", "Praia"] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#261B12] text-white font-bold"
                : "bg-white/60 text-[#614126] border border-black/[0.06] hover:bg-white"
            }`}
          >
            {cat === "todos" ? "Todas Categorias" : cat}
          </button>
        ))}
      </div>

      {/* Lista de Atividades do Agora */}
      <div className="space-y-3 mt-2">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            onClick={() => handleAction(act)}
            className="bg-white rounded-2xl border border-black/[0.08] p-3.5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex gap-3.5 cursor-pointer group"
          >
            {/* Foto com Tag de Urgência */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <SafeBusinessImage
                src={act.image}
                alt={act.title}
                category="gastronomia"
                fallbackSeed={act.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#C25B2E] text-white">
                {act.category}
              </span>
            </div>

            {/* Informações */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-[#E88636] uppercase tracking-wide">
                    {act.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#085464] font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>{act.timeWindow}</span>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-[#261B12] group-hover:text-[#C25B2E] transition-colors line-clamp-1 mt-0.5">
                  {act.title}
                </h3>
                <p className="text-[11px] text-[#4A3525]/80 line-clamp-2 mt-1 leading-snug">
                  {act.subtitle}
                </p>
              </div>

              {/* Linha de Ação */}
              <div className="mt-2 pt-2 border-t border-black/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-[#614126] font-medium">
                  <MapPin className="w-3 h-3 text-[#D97706]" />
                  <span>{act.distanceTime}</span>
                </div>

                <span className="font-bold text-[#C25B2E] flex items-center gap-1 text-xs">
                  {act.ctaType === "whatsapp" && <MessageCircle className="w-3 h-3 text-emerald-600" />}
                  <span>{act.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Destaque do Forró Noturno */}
      <div className="mt-6 bg-[#FAF6F0] border border-[#E8DFC8] rounded-3xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#261B12]">
            Programação da Noite & Forró
          </h3>
        </div>

        <div className="space-y-2.5">
          {CARAIVA_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="bg-white p-3 rounded-2xl border border-black/[0.06] flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#E88636] block">
                  {evt.status === "hoje" ? "Hoje às " + evt.start_at : "Amanhã às " + evt.start_at}
                </span>
                <h4 className="text-xs font-bold text-[#261B12]">{evt.title}</h4>
                <p className="text-[11px] text-[#4A3525]/75 line-clamp-1">{evt.business_name}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const biz = CARAIVA_BUSINESSES.find((b) => b.id === evt.business_id);
                  if (biz) openBusinessWhatsApp(biz, "agora_events_highlight");
                }}
                className="px-3 py-1.5 rounded-xl bg-[#261B12] text-white font-bold text-[11px] flex items-center gap-1 shrink-0 active:scale-95"
              >
                <span>{evt.cta}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaraivaAgoraScreen;
