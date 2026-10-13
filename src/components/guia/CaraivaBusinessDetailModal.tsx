import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Share2,
  Navigation,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Building,
  Palette,
  Anchor,
  Compass,
  Footprints,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import type { Business, EventItem, OfferItem } from "../../data/caraivaDigitalData";
import { CARAIVA_EVENTS, CARAIVA_OFFERS, claimBusinessProfile } from "../../data/caraivaDigitalData";
import { trackEvent } from "../../services/analytics";
import { isFavorite, toggleFavorite, addToItinerary } from "../../services/favoritesService";
import { StreetViewModal } from "./StreetViewModal";
import { businessToGuidePlace } from "../../services/maps/places";
import { getBusinessProfileDetail } from "../../data/caraivaExtendedProfiles";
import { BusinessMenuTab, BusinessBookingTab } from "./business-detail/BusinessExtendedSections";
import { CaraivaBusinessShowcaseTab } from "./business-detail/CaraivaBusinessShowcaseTab";
import { CaraivaCartCheckoutModal } from "./business-detail/CaraivaCartCheckoutModal";
import { getBusinessCatalog, getCartItems, clearCartForBusiness, type CartItem } from "../../services/catalogCartService";
import { SafeBusinessImage } from "./SafeBusinessImage";

interface CaraivaBusinessDetailModalProps {
  business: Business | null;
  onClose: () => void;
  onOpenMap?: (business: Business) => void;
  onStartRoute?: (business: Business) => void;
  initialTab?: "visao-geral" | "cardapio" | "vitrine" | "reserva";
}

export const CaraivaBusinessDetailModal: React.FC<CaraivaBusinessDetailModalProps> = ({
  business,
  onClose,
  onOpenMap,
  onStartRoute,
  initialTab,
}) => {
  const [detailTab, setDetailTab] = useState<"visao-geral" | "cardapio" | "vitrine" | "reserva">(initialTab || "visao-geral");
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [addedToDay, setAddedToDay] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStreetViewOpen, setIsStreetViewOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCartItems());

  // Atualiza sacola quando há mudanças globais
  useEffect(() => {
    const handleCartUpdate = (e: any) => {
      setCartItems(e.detail || getCartItems());
    };
    window.addEventListener("caraiva:cart-updated", handleCartUpdate);
    return () => window.removeEventListener("caraiva:cart-updated", handleCartUpdate);
  }, []);

  // Claim Profile Form State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimName, setClaimName] = useState("");
  const [claimPhone, setClaimPhone] = useState("");
  const [claimEmail, setClaimEmail] = useState("");
  const [claimRole, setClaimRole] = useState("Proprietário");
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  useEffect(() => {
    if (business) {
      setActivePhotoIdx(0);
      setFavorite(isFavorite(business.id));
      setAddedToDay(false);
      setIsClaimModalOpen(false);
      setClaimSubmitted(false);
      setDetailTab(initialTab === "reserva" && !["restaurantes", "bares", "cafes"].includes(business.category) ? "visao-geral" : initialTab || "visao-geral");
      trackEvent("business_view", {
        businessId: business.id,
        businessName: business.name,
        source: "business_modal",
      });
    }
  }, [business, initialTab]);

  if (!business) return null;

  const photos = business.gallery && business.gallery.length > 0 
    ? [business.cover_image || business.heroImage || "", ...business.gallery] 
    : [business.cover_image || business.heroImage || ""];

  // Eventos vinculados a este estabelecimento
  const businessEvents: EventItem[] = CARAIVA_EVENTS.filter(
    (ev) => ev.business_id === business.id
  );

  // Ofertas ativas vinculadas
  const businessOffers: OfferItem[] = CARAIVA_OFFERS.filter(
    (off) => off.business_id === business.id && off.status !== "expirado"
  );

  const handleToggleFavorite = () => {
    const next = toggleFavorite(business.id, business.name);
    setFavorite(next);
  };

  const handleAddToItinerary = () => {
    addToItinerary({
      time: business.category === "cafes" ? "09:00" : business.category === "praias" ? "11:30" : business.category === "restaurantes" ? "19:30" : "22:30",
      spotId: business.id,
      spotName: business.name,
      activityTitle: business.subcategory || business.subCategory || "Visita",
      category: business.category,
      tip: `Visitar ${business.name}. Referência: ${business.locationReference}`,
    });
    setAddedToDay(true);
    setTimeout(() => setAddedToDay(false), 2500);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${business.name} — Caraíva Digital`,
      text: `Conheça ${business.name} em Caraíva: ${business.shortDescription}`,
      url: window.location.href,
    };
    try {
      if (!navigator.clipboard) return;
      await navigator.clipboard.writeText(shareData.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch { /* Clipboard permission may be denied; keep the profile usable. */ }
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimName || !claimPhone) return;
    claimBusinessProfile(business.id, {
      name: claimName,
      phone: claimPhone,
      email: claimEmail,
      role: claimRole,
    });
    setClaimSubmitted(true);
    setTimeout(() => {
      setIsClaimModalOpen(false);
      setClaimSubmitted(false);
    }, 2800);
  };

  return (
    <div 
      className="cv-business-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="cv-business-panel relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-[#0c141a] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-y-auto flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 border border-white/10 transition-all shadow-lg active:scale-95"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleAddToItinerary}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all shadow-lg active:scale-95 ${
                addedToDay 
                  ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/50" 
                  : "bg-black/60 text-white/90 hover:text-white hover:bg-black/80 border-white/10"
              }`}
              title={addedToDay ? "Adicionado ao itinerário!" : "Adicionar ao itinerário (+ Dia)"}
            >
              {addedToDay ? <Check className="w-4 h-4 text-emerald-400" /> : <Calendar className="w-4 h-4 text-amber-300" />}
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 border border-white/10 transition-all shadow-lg active:scale-95"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all shadow-lg active:scale-95 ${
                favorite 
                  ? "bg-rose-500/30 text-rose-400 border-rose-500/50" 
                  : "bg-black/60 text-white/90 hover:text-white hover:bg-black/80 border-white/10"
              }`}
              title={favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
            >
              <Heart className={`w-4 h-4 ${favorite ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Gallery Hero Carousel */}
        <div className="cv-photo relative w-full h-72 sm:h-80 bg-slate-900 shrink-0 select-none">
          <SafeBusinessImage
            src={photos[activePhotoIdx]}
            alt={business.name}
            category={business.category}
            fallbackSeed={business.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c141a] via-[#0c141a]/30 to-black/40" />

          {/* Carousel Arrows if > 1 photo */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white/90 backdrop-blur-sm border border-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white/90 backdrop-blur-sm border border-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activePhotoIdx ? "w-5 bg-amber-400" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Data Tier Badge (Transparência de Demonstração) */}
          <div className="absolute top-4 left-16 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-semibold shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Dados Públicos Verificados</span>
          </div>

          {/* Fachada 360° disponível sobre a foto */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsStreetViewOpen(true);
            }}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-teal-300 border border-teal-500/30 text-[11px] font-semibold shadow-lg transition-all active:scale-95 cursor-pointer"
            title="Abrir Fachada 360°"
          >
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>360°</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6 -mt-4 relative z-10 bg-[#0c141a] rounded-t-3xl">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {business.subcategory || business.subCategory}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                business.isOpenNow
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}>
                {business.isOpenNow ? "● Aberto Agora" : "○ Fechado no momento"}
              </span>
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 ml-auto">
                ★ {business.rating.toFixed(1)} <span className="text-slate-400">({business.review_count || business.reviewsCount} avaliações {business.rating_source?.split(" ")[0]})</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
              {business.name}
            </h1>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              {business.shortDescription}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Horário</p>
                <p className="font-medium text-slate-200 truncate">
                  {typeof business.opening_hours === "string" ? business.opening_hours : business.openingHours}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Faixa de Preço</p>
                <p className="font-medium text-slate-200">{business.price_range || business.priceLevel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <Navigation className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Distância</p>
                <p className="font-medium text-slate-200">{business.distanceTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Endereço</p>
                <p className="font-medium text-slate-200 truncate">{business.locationReference || business.address}</p>
              </div>
            </div>
          </div>

          {/* Tabs do Estabelecimento: Visão Geral, Cardápio/Vitrine (se aplicável) e Reservas */}
          {(() => {
            const isFood = business.category === "restaurantes" || business.category === "bares" || business.category === "cafes";
            const currentCatalog = getBusinessCatalog(business.id, business.category, business.subcategory || business.subCategory);
            const hasShowcase = isFood || Boolean(currentCatalog);
            const showcaseTabLabel = isFood ? "🍽️ Cardápio" : currentCatalog?.tabLabel || "🛍️ Vitrine";
            const businessCartCount = cartItems.filter(i => i.businessId === business.id).reduce((acc, i) => acc + i.quantity, 0);

            return (
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.05] border border-white/10 select-none overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setDetailTab("visao-geral")}
                  className={`flex-1 min-w-[76px] py-2 px-2 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap ${
                    detailTab === "visao-geral"
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Visão Geral
                </button>

                {/* Aba de Cardápio (se restaurante) ou Vitrine (se mercado, artes, passeios) — NÃO aparece em pousadas! */}
                {hasShowcase && (
                  <button
                    onClick={() => setDetailTab(isFood ? "cardapio" : "vitrine")}
                    className={`flex-1 min-w-[90px] py-2 px-2 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap relative ${
                      (detailTab === "cardapio" || detailTab === "vitrine")
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{showcaseTabLabel}</span>
                    {businessCartCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                        {businessCartCount}
                      </span>
                    )}
                  </button>
                )}
                {isFood && (
<button
                  onClick={() => setDetailTab("reserva")}
                  className={`flex-1 min-w-[80px] py-2 px-2 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap ${
                    detailTab === "reserva"
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  📅 Reservas
                </button>
                )}
              </div>
            );
          })()}

          {detailTab === "cardapio" && (
            <div className="pt-2">
              <BusinessMenuTab
                businessId={business.id}
                businessName={business.name}
                menuItems={getBusinessProfileDetail(business.slug || business.id, business.name).menuItems}
                onOpenCartModal={() => setIsCartModalOpen(true)}
              />
            </div>
          )}

          {detailTab === "vitrine" && (
            <div className="pt-2">
              {(() => {
                const catalog = getBusinessCatalog(business.id, business.category, business.subcategory || business.subCategory);
                if (!catalog) return null;
                return (
                  <CaraivaBusinessShowcaseTab
                    catalog={catalog}
                    businessName={business.name}
                    cartItems={cartItems}
                    onOpenCartModal={() => setIsCartModalOpen(true)}
                  />
                );
              })()}
            </div>
          )}

          {detailTab === "reserva" && ["restaurantes", "bares", "cafes"].includes(business.category) && (
            <div className="pt-2">
              <BusinessBookingTab
                businessName={business.name}
                schedule={getBusinessProfileDetail(business.slug || business.id, business.name).schedule}
              />
            </div>
          )}

          {detailTab === "visao-geral" && (
            <>
          {/* Authentic Description */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Sobre o Estabelecimento
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
          </div>

          {/* Bloco Exclusivo de Arte & Cultura para o Canto da Duca */}
          {business.slug === "canto-da-duca" && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Palette className="w-4 h-4" /> Arte & Cultura Viva de Caraíva
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Além de restaurante vegetariano, o Canto da Duca funciona como atelier e galeria das pinturas a óleo e azulejos artísticos de Duca. Um patrimônio cultural que preserva a memória ancestral dos pescadores e da natureza da foz.
              </p>
            </div>
          )}

          {/* Bloco Especial de Pacotes de Passeios (Ex: Caraíva Brasil) */}
          {business.toursSnapshot && business.toursSnapshot.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Anchor className="w-4 h-4 text-sky-400" /> Passeios Publicados (Snapshot)
                </h3>
                <span className="text-[10px] text-slate-400">Consulte valor atualizado</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {business.toursSnapshot.map((tour, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white leading-snug">{tour.title}</h4>
                      <span className="text-xs font-extrabold text-amber-400 shrink-0">{tour.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{tour.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>⏱ {tour.duration}</span>
                      <span>📍 {tour.meetingPoint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Offers If Any */}
          {businessOffers.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  🔥 Oferta Especial Caraíva Digital
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
                  Demonstração
                </span>
              </div>
              {businessOffers.map((off) => (
                <div key={off.id} className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{off.title}</h4>
                    <p className="text-xs text-slate-300">{off.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-extrabold text-amber-400">R$ {off.price}</p>
                    {off.original_price && (
                      <p className="text-xs text-slate-400 line-through">R$ {off.original_price}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agenda / Events If Any */}
          {businessEvents.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Programação Especial
                </span>
              </div>
              {businessEvents.map((ev) => (
                <div key={ev.id} className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{ev.description}</p>
                    <p className="text-[11px] text-purple-300 font-semibold mt-1">
                      Horário: {ev.start_at}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-200 text-xs font-bold">
                      {typeof ev.price === "number" ? `R$ ${ev.price}` : ev.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Menu Highlights (Cardápio Selecionado) */}
          {business.menuHighlights && business.menuHighlights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Destaques do Cardápio & Serviços
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {business.menuHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                        {item.name}
                        {item.isHighlight && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-400/20 text-amber-300 font-bold">
                            Famoso
                          </span>
                        )}
                      </p>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-amber-400 shrink-0">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment & Amenities */}
          <div className="space-y-3 pt-2 text-xs">
            {business.paymentMethods && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" /> Pagamento:
                </span>
                {business.paymentMethods.map((pm, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    {pm}
                  </span>
                ))}
              </div>
            )}

            {business.amenities && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {business.amenities.map((amenity, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px]">
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bloco de Transparência e Fonte Pública Obrigatória */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2 text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Transparência de Fontes
              </span>
              <span>Verificado em: {business.data_source?.verified_at || business.verified_at || "28/09/2026"}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Fonte de referência: {business.data_source?.provider || "Consulta pública"}. Os dados desta ficha são apresentados dentro do Caraíva Digital.
            </p>
            <p className="text-[10px] text-slate-500 italic">
              "Visualização demonstrativa — informações sujeitas a confirmação pelo estabelecimento."
            </p>

            {/* Botão: Este negócio é seu? Reivindicar Perfil */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-slate-400 text-xs">É o proprietário ou gerente deste local?</span>
              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 font-bold text-xs transition-colors border border-amber-400/30"
              >
                Este negócio é seu? Reivindicar perfil
              </button>
            </div>
          </div>
          </>
          )}
        </div>

        {/* Sticky Action Footer */}
        {(() => {
          const businessCartItems = cartItems.filter((i) => i.businessId === business.id);
          const businessCartCount = businessCartItems.reduce((acc, i) => acc + i.quantity, 0);
          const businessCartTotal = businessCartItems.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0);
          const isFood = business.category === "restaurantes" || business.category === "bares" || business.category === "cafes";
          const currentCatalog = getBusinessCatalog(business.id, business.category, business.subcategory || business.subCategory);
          const hasShowcase = isFood || Boolean(currentCatalog);

          return (
            <div className="sticky bottom-0 p-3 sm:p-4 bg-[#080d12]/95 backdrop-blur-xl border-t border-white/10 flex items-center gap-2.5 z-30">
              {/* Botão 'Rota a Pé' com ícone de passos */}
              <button
                type="button"
                onClick={() => {
                  if (onStartRoute) onStartRoute(business);
                  else if (onOpenMap) onOpenMap(business);
                  onClose();
                }}
                className="py-3 px-3.5 sm:px-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] text-teal-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-teal-500/30 hover:border-teal-400/50 transition-all shadow-md active:scale-98 shrink-0 cursor-pointer"
                title="Traçar rota a pé na areia com modo POV"
              >
                <Footprints className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="whitespace-nowrap">Rota a Pé</span>
              </button>

              {/* Botão principal dinâmico */}
              {businessCartCount > 0 ? (
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCartModalOpen(true)}
                    className="flex-1 min-w-0 py-3 px-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span className="truncate">Sacola</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[11px] font-black shrink-0">
                        {businessCartCount}
                      </span>
                    </div>
                    <span className="text-xs font-black bg-slate-950/20 px-2 py-0.5 rounded-lg shrink-0">
                      R$ {businessCartTotal.toFixed(2)}
                    </span>
                  </button>

                  {/* Botão secundário discreto para 'Limpar Sacola' */}
                  <button
                    type="button"
                    onClick={() => clearCartForBusiness(business.id)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all shrink-0 active:scale-95 cursor-pointer"
                    title="Limpar sacola deste comércio"
                    aria-label="Limpar Sacola"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (business.category === "hospedagens") {
                      setDetailTab("reserva");
                    } else if (hasShowcase) {
                      if (detailTab === "cardapio" || detailTab === "vitrine") {
                        setIsCartModalOpen(true);
                      } else {
                        setDetailTab(isFood ? "cardapio" : "vitrine");
                      }
                    } else {
                      setDetailTab("reserva");
                    }
                  }}
                  className="flex-1 min-w-0 py-3 px-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-98 transition-all cursor-pointer"
                >
                  {business.category === "hospedagens" ? (
                    <>
                      <Calendar className="w-4 h-4 shrink-0 text-slate-950" />
                      <span className="truncate">Reservar Hospedagem</span>
                    </>
                  ) : detailTab === "cardapio" || detailTab === "vitrine" ? (
                    <>
                      <ShoppingBag className="w-4 h-4 shrink-0 fill-slate-950" />
                      <span className="truncate">Ver Sacola</span>
                    </>
                  ) : hasShowcase ? (
                    <>
                      <Sparkles className="w-4 h-4 shrink-0 fill-slate-950" />
                      <span className="truncate">
                        {isFood ? "Ver Cardápio & Pedir" : "Explorar Produtos & Serviços"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 shrink-0 text-slate-950" />
                      <span className="truncate">Ver Detalhes</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })()}

        {/* Modal de Reivindicação de Perfil (Claim Business) */}
        {isClaimModalOpen && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-40 p-6 flex flex-col justify-center animate-in fade-in">
            <div className="bg-[#101b24] p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 max-w-md mx-auto w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Building className="w-4 h-4" /> Reivindicar {business.name}
                </div>
                <button onClick={() => setIsClaimModalOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Para ter acesso ao portal de métricas em tempo real e atualizar cardápios e promoções, confirme seus dados para verificação administrativa.
              </p>

              {claimSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold space-y-1 text-center animate-in zoom-in-95">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                  <p className="text-sm font-bold text-white">Solicitação enviada com sucesso!</p>
                  <p className="text-slate-300">Sua solicitação foi registrada neste dispositivo e ficará disponível para análise no portal do estabelecimento após a integração.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitClaim} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={claimName}
                      onChange={(e) => setClaimName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Telefone para contato</label>
                      <input
                        type="tel"
                        required
                        placeholder="(73) 99999-9999"
                        value={claimPhone}
                        onChange={(e) => setClaimPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Cargo / Função</label>
                      <select
                        value={claimRole}
                        onChange={(e) => setClaimRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option>Proprietário</option>
                        <option>Gerente Geral</option>
                        <option>Sócio Operacional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">E-mail Comercial (opcional)</label>
                    <input
                      type="email"
                      placeholder="contato@restaurante.com"
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <p className="text-[10px] text-slate-500">
                    Nota: O acesso não é concedido automaticamente. Há verificação manual prévia para segurança do estabelecimento.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsClaimModalOpen(false)}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20"
                    >
                      Enviar Solicitação
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {copiedLink && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2 z-40 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4" /> Link copiado para a área de transferência!
          </div>
        )}
      </div>

      {/* Street View 360° Modal Nativo */}
      <StreetViewModal
        place={businessToGuidePlace(business)}
        isOpen={isStreetViewOpen}
        onClose={() => setIsStreetViewOpen(false)}
        onStartRoute={() => {
          setIsStreetViewOpen(false);
          if (onOpenMap) onOpenMap(business);
          onClose();
        }}
      />

      {/* Modal de Sacola & Fechamento Direto de Pedido */}
      <CaraivaCartCheckoutModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        businessId={business.id}
        businessName={business.name}
        cartItems={cartItems}
      />
    </div>
  );
};
