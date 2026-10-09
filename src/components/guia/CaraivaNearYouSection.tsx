import React, { useState, useMemo } from "react";
import { Star, MapPin, MessageCircle, Heart, Navigation, ChevronRight, Award, Compass } from "lucide-react";
import { CARAIVA_BUSINESSES, type Business } from "../../data/caraivaDigitalData";
import { openBusinessWhatsApp } from "../../services/analytics";
import { isFavorite, toggleFavorite } from "../../services/favoritesService";
import { useUserLocation, calculateHaversineDistanceMeters } from "../../services/maps/geolocation";
import { businessToGuidePlace } from "../../services/maps/places";
import { StreetViewModal } from "./StreetViewModal";
import { type GuidePlace } from "../../services/maps/types";

export interface CaraivaNearYouSectionProps {
  onSelectBusiness: (business: Business) => void;
  onOpenMapToBusiness?: (business: Business) => void;
  onOpenMap?: (business: Business) => void;
  selectedCategory?: string | null;
  preferredInterests?: string[];
}

type VibeFilter = "todos" | "casal" | "noite" | "gastronomia" | "praia" | "amigos";

export const CaraivaNearYouSection: React.FC<CaraivaNearYouSectionProps> = ({
  onSelectBusiness,
  onOpenMapToBusiness,
  onOpenMap,
  selectedCategory,
  preferredInterests = [],
}) => {
  const [activeVibe, setActiveVibe] = useState<VibeFilter>("todos");
  const [streetViewTarget, setStreetViewTarget] = useState<GuidePlace | null>(null);
  const userLoc = useUserLocation();

  const [favMap, setFavMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CARAIVA_BUSINESSES.forEach((b) => {
      initial[b.id] = isFavorite(b.id);
    });
    return initial;
  });

  const handleToggleFav = (e: React.MouseEvent, biz: Business) => {
    e.stopPropagation();
    const nextState = toggleFavorite(biz.id, biz.name);
    setFavMap((prev) => ({ ...prev, [biz.id]: nextState }));
  };

  const filteredBusinesses = useMemo(() => {
    const list = CARAIVA_BUSINESSES.filter((b) => {
      if (selectedCategory && selectedCategory !== "agora") {
        if (selectedCategory === "comer" && b.category !== "restaurantes") return false;
        if (selectedCategory === "praias" && b.category !== "praias") return false;
        if (selectedCategory === "passeios" && b.category !== "passeios") return false;
        if (selectedCategory === "noite" && b.category !== "noite") return false;
        if (selectedCategory === "cafe" && b.category !== "cafes") return false;
        if (selectedCategory === "comprar" && b.category !== "lojas") return false;
        if (selectedCategory === "eventos" && b.category !== "noite" && b.category !== "bares") return false;
      }

      if (activeVibe !== "todos" && !b.vibe.includes(activeVibe)) {
        return false;
      }

      return true;
    });

    // Ordena do mais próximo para o mais distante com base na localização atual
    const preferenceVibes: Record<string,string> = { 'Praia e rio': 'praia', 'Gastronomia':'gastronomia', 'Pôr do sol':'por_do_sol', 'Passeios':'passeios', 'Cultura':'cultura', 'Noite e forró':'noite' };
    const score = (business: Business) => preferredInterests.reduce((total, interest) => total + (business.vibe.some(v => v === preferenceVibes[interest]) ? 1 : 0), 0);
    return list.sort((a, b) => {
      const relevance = score(b) - score(a);
      if (relevance) return relevance;
      const distA = calculateHaversineDistanceMeters(userLoc.coords, { lat: a.latitude, lng: a.longitude });
      const distB = calculateHaversineDistanceMeters(userLoc.coords, { lat: b.latitude, lng: b.longitude });
      return distA - distB;
    });
  }, [selectedCategory, activeVibe, userLoc.coords, preferredInterests]);

  const handleCtaClick = (e: React.MouseEvent, biz: Business) => {
    e.stopPropagation();
    if (biz.ctaType === "whatsapp" || biz.ctaType === "reservar" || biz.ctaType === "passeio") {
      openBusinessWhatsApp(biz, "near_you_card");
      return;
    }
    if (biz.ctaType === "rota") {
      if (onOpenMap) onOpenMap(biz);
      else if (onOpenMapToBusiness) onOpenMapToBusiness(biz);
      return;
    }
    onSelectBusiness(biz);
  };

  return (
    <section className="px-4 mt-6">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider leading-tight">
            {preferredInterests.length ? "Escolhidos para você" : "Experiências em Caraíva"}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-400">
            {preferredInterests.length ? "Seus interesses guiam as primeiras descobertas" : "Locais autênticos a poucos passos na areia"}
          </p>
        </div>

        <span className="text-[10px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
          {filteredBusinesses.length} lugares
        </span>
      </div>

      {/* Pílulas de Personalização "Para Você" (Vibe Filter) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none select-none text-[11px] font-semibold">
        {(
          [
            { id: "todos", label: "Todos" },
            { id: "casal", label: "Romântico" },
            { id: "praia", label: "Praia & Rio" },
            { id: "gastronomia", label: "Gastronomia" },
            { id: "noite", label: "Noite & Forró" },
            { id: "amigos", label: "Com Amigos" },
          ] as const
        ).map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActiveVibe(v.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all active:scale-95 ${
              activeVibe === v.id
                ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Grid de Cards Cinematográficos */}
      <div className="space-y-3.5">
        {filteredBusinesses.map((biz) => {
          const isFav = favMap[biz.id] ?? false;
          return (
            <div
              key={biz.id}
              onClick={() => onSelectBusiness(biz)}
              className="bg-[#111921] rounded-2xl sm:rounded-3xl border border-white/10 shadow-lg hover:border-amber-400/40 transition-all active:scale-[0.99] overflow-hidden flex flex-col cursor-pointer group"
            >
              {/* Foto Principal com Badges */}
              <div className="cv-photo relative h-40 sm:h-44 w-full overflow-hidden">
                <img
                  src={biz.heroImage}
                  alt={biz.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111921] via-black/30 to-transparent" />

                {/* Badge de Parceiro Fundador (Discreto) */}
                {biz.isFounderPartner && (
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold shadow-sm">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{biz.founderPartnerBadge || "Parceiro Fundador"}</span>
                  </div>
                )}

                {/* Botão de Favorito */}
                <button
                  type="button"
                  onClick={(e) => handleToggleFav(e, biz)}
                  className={`absolute top-2.5 right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 shadow-md ${
                    isFav
                      ? "bg-rose-500 border-rose-500 text-white"
                      : "bg-black/40 hover:bg-black/60 border-white/20 text-white"
                  }`}
                  title={isFav ? "Remover dos favoritos" : "Salvar em Minha Caraíva"}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-white" : ""}`} />
                </button>

                {/* Status Aberto + Distância na Imagem */}
                <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-white text-[10px] sm:text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        biz.isOpenNow ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"
                      }`}
                    />
                    <span className="font-semibold text-white/95">
                      {biz.isOpenNow ? "Aberto agora" : "Abre em breve"}
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/80">{biz.openingHours}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-300 font-semibold bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{biz.distanceTime}</span>
                  </div>
                </div>
              </div>

              {/* Informações Editoriais e Ações */}
              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {biz.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {biz.subCategory}
                      </p>
                    </div>

                    {/* Rating Confiável */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full shrink-0">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">{biz.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">({biz.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                    {biz.shortDescription}
                  </p>

                  {/* Tags de Destaque */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {biz.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] sm:text-[10px] font-medium text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rodapé com Preço & CTA Primário */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-amber-300">{biz.priceLevel}</span>
                    <span className="text-slate-400 text-[10px] sm:text-[11px] ml-1.5">
                      {biz.priceDescription.split("por")[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Botão Ver Fachada 360° */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStreetViewTarget(businessToGuidePlace(biz, userLoc.coords));
                      }}
                      className="p-1.5 sm:p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 transition active:scale-95 flex items-center gap-1 text-[11px] font-semibold"
                      title="Explorar rua e ver fachada 360°"
                    >
                      <Compass className="w-3.5 h-3.5 text-teal-400" />
                      <span className="hidden sm:inline">Fachada</span>
                    </button>

                    {/* Botão Como Chegar / Ver no Mapa */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenMap) onOpenMap(biz);
                        else if (onOpenMapToBusiness) onOpenMapToBusiness(biz);
                      }}
                      className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition active:scale-95 flex items-center gap-1 text-[11px] font-semibold"
                      title="Ver traçado a pé no mapa"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-400" />
                      <span className="hidden sm:inline">Rota</span>
                    </button>

                    {/* CTA Principal Contextualizado */}
                    <button
                      type="button"
                      onClick={(e) => handleCtaClick(e, biz)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-400/20 transition active:scale-95"
                    >
                      {biz.ctaType === "whatsapp" && <MessageCircle className="w-3 h-3 text-slate-950" />}
                      <span>{biz.ctaLabel || "Conhecer"}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Street View Modal para exploração a partir do feed */}
      <StreetViewModal
        place={streetViewTarget}
        isOpen={Boolean(streetViewTarget)}
        onClose={() => setStreetViewTarget(null)}
        onStartRoute={(place) => {
          setStreetViewTarget(null);
          const originalBiz = CARAIVA_BUSINESSES.find((b) => b.id === place.id);
          if (originalBiz && onOpenMap) {
            onOpenMap(originalBiz);
          }
        }}
      />
    </section>
  );
};

export default CaraivaNearYouSection;
