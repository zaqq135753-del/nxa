import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
  MapPin,
  ChevronRight,
  Compass,
  ArrowRight,
  Share2,
  Check,
} from "lucide-react";
import { CARAIVA_BUSINESSES, type Business } from "../../data/caraivaDigitalData";
import {
  getFavorites,
  toggleFavorite,
  getItinerary,
  removeFromItinerary,
  type ItineraryItem,
} from "../../services/favoritesService";
import { openBusinessWhatsApp } from "../../services/analytics";
import { SafeBusinessImage } from "./SafeBusinessImage";

interface CaraivaSavedScreenProps {
  onSelectBusiness: (business: Business) => void;
  onOpenMap: (business: Business) => void;
  onGoToConcierge: () => void;
  onExplore: () => void;
}

export const CaraivaSavedScreen: React.FC<CaraivaSavedScreenProps> = ({
  onSelectBusiness,
  onOpenMap,
  onGoToConcierge,
  onExplore,
}) => {
  const [activeTab, setActiveTab] = useState<"roteiro" | "favoritos">("roteiro");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [shared, setShared] = useState(false);

  const loadData = () => {
    setFavoriteIds(getFavorites());
    setItinerary(getItinerary());
  };

  useEffect(() => {
    loadData();

    const handleFavUpdate = () => setFavoriteIds(getFavorites());
    const handleItinUpdate = () => setItinerary(getItinerary());

    window.addEventListener("caraiva:favorites-updated", handleFavUpdate);
    window.addEventListener("caraiva:itinerary-updated", handleItinUpdate);

    return () => {
      window.removeEventListener("caraiva:favorites-updated", handleFavUpdate);
      window.removeEventListener("caraiva:itinerary-updated", handleItinUpdate);
    };
  }, []);

  const favoriteBusinesses = CARAIVA_BUSINESSES.filter((b) =>
    favoriteIds.includes(b.id)
  );

  const handleRemoveItinerary = (id: string) => {
    removeFromItinerary(id);
    setItinerary(getItinerary());
  };

  const handleRemoveFavorite = (business: Business) => {
    toggleFavorite(business.id, business.name);
    setFavoriteIds(getFavorites());
  };

  const handleShareItinerary = async () => {
    const text = itinerary
      .map((item) => `• ${item.time} - ${item.spotName}: ${item.activityTitle}`)
      .join("\n");
    const shareText = `🌴 Meu Dia em Caraíva:\n\n${text}\n\nCriado com Caraíva Digital ✨`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Meu Dia em Caraíva", text: shareText });
      } catch {
        // dismissed
      }
    } else {
      navigator.clipboard?.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Seu Espaço Pessoal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif mt-1">
            Minha Caraíva
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Seu roteiro sob medida e os lugares especiais que você guardou.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("roteiro")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "roteiro"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Meu Dia ({itinerary.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("favoritos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "favoritos"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Favoritos ({favoriteBusinesses.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ROTEIRO "MEU DIA EM CARAÍVA" */}
      {activeTab === "roteiro" && (
        <div className="space-y-6">
          {/* Top Bar for Itinerary */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Cronograma no Ritmo da Maré</h3>
                <p className="text-xs text-slate-300">
                  {itinerary.length} paradas sincronizadas entre o rio, o mar e o forró.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareItinerary}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
              >
                {shared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{shared ? "Copiado!" : "Compartilhar"}</span>
              </button>

              <button
                onClick={onGoToConcierge}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Concierge IA</span>
              </button>
            </div>
          </div>

          {/* Timeline List */}
          {itinerary.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Seu roteiro ainda está vazio</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore os lugares de Caraíva ou peça ao Concierge para montar o dia perfeito para você.
              </p>
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 hover:bg-amber-300 transition-all"
              >
                <span>Explorar Caraíva</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-emerald-400 before:to-purple-500">
              {itinerary.map((item, index) => {
                const business = CARAIVA_BUSINESSES.find((b) => b.id === item.spotId);
                return (
                  <div key={item.id} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full bg-[#0c141a] border-2 border-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-300 shadow-md">
                      {index + 1}
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group-hover:bg-white/[0.05] space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                            <Clock className="w-3 h-3" /> {item.time}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded-md bg-white/5">
                            {item.category}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemoveItinerary(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Remover deste roteiro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4
                          onClick={() => business && onSelectBusiness(business)}
                          className="text-base sm:text-lg font-bold text-white hover:text-amber-300 cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          {item.spotName}
                          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
                          {item.activityTitle}
                        </p>
                        {item.tip && (
                          <p className="text-xs text-amber-200/80 bg-amber-500/10 border-l-2 border-amber-400 pl-2.5 py-1 mt-2 italic rounded-r-md">
                            Dica: {item.tip}
                          </p>
                        )}
                      </div>

                      {business && (
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => onOpenMap(business)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-sky-400" />
                            <span>Ver no Mapa</span>
                          </button>

                          <button
                            onClick={() =>
                              openBusinessWhatsApp(
                                business,
                                "itinerary_cta",
                                `Olá! Tenho uma parada planejada no ${business.name} para o meu dia em Caraíva.`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/20"
                          >
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITOS SALVOS */}
      {activeTab === "favoritos" && (
        <div className="space-y-4">
          {favoriteBusinesses.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <Heart className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Nenhum favorito salvo ainda</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Ao explorar restaurantes, pousadas e passeios, toque no ícone de coração para guardar seus locais preferidos.
              </p>
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 hover:bg-amber-300 transition-all"
              >
                <span>Ver Todos os Lugares</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-white/20 transition-all flex flex-col group"
                >
                  <div className="cv-photo relative h-40 w-full overflow-hidden">
                    <SafeBusinessImage
                      src={b.heroImage || b.cover_image}
                      alt={b.name}
                      category={b.category}
                      fallbackSeed={b.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <button
                      onClick={() => handleRemoveFavorite(b)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-rose-400 hover:text-rose-300 border border-white/10 transition-colors"
                      title="Remover dos favoritos"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {b.subCategory}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1 leading-snug">{b.name}</h4>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-slate-300 line-clamp-2">{b.shortDescription}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="text-amber-400 font-semibold">
                        ★ {b.rating.toFixed(1)} <span className="text-slate-500">({b.reviewsCount})</span>
                      </span>
                      <span className="text-slate-400">{b.distanceTime}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onSelectBusiness(b)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-center transition-colors"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() =>
                          openBusinessWhatsApp(
                            b,
                            "favorites_card",
                            `Olá! Salvei o ${b.name} nos meus favoritos do Caraíva Digital e gostaria de falar com vocês.`
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors border border-emerald-500/30"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
