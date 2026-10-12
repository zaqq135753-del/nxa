import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Camera,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CARAIVA_BUSINESSES, type Business, type BusinessCategory, type NowActivity } from "../data/caraivaDigitalData";
import { asset } from "../lib/asset";
import { caraivaAudio } from "../utils/caraivaAudio";
import { getFavorites, isFavorite, toggleFavorite } from "../services/favoritesService";
import { trackEvent } from "../services/analytics";
import { checkSalesAdminAccess } from "../services/adminSalesService";

// Modular Subcomponents
import type { GuiaStory } from "../components/guia/StoriesEngine";
import TideWeatherAiModal from "../components/guia/TideWeatherAiModal";
import MultimodalCameraModal from "../components/guia/MultimodalCameraModal";

// New Phase Components
import { CaraivaCinematicHero } from "../components/guia/CaraivaCinematicHero";
import { CaraivaIntentionsBar } from "../components/guia/CaraivaIntentionsBar";
import { CaraivaNowSection } from "../components/guia/CaraivaNowSection";
import { CaraivaNearYouSection } from "../components/guia/CaraivaNearYouSection";
import { CaraivaStoriesRow } from "../components/guia/home/CaraivaStoriesRow";
import { BusinessCard3D } from "../components/guia/home/BusinessCard3D";
import { CaraivaAgoraScreen } from "../components/guia/CaraivaAgoraScreen";
const CaraivaLiveMap = React.lazy(() => import("../components/guia/live-map/CaraivaLiveMap"));
import { CaraivaBusinessDetailModal } from "../components/guia/CaraivaBusinessDetailModal";
import { CaraivaWalkingRouteModal } from "../components/guia/CaraivaWalkingRouteModal";
import { CaraivaSavedScreen } from "../components/guia/CaraivaSavedScreen";
import { CaraivaConciergeAgent } from "../components/guia/concierge/CaraivaConciergeAgent";
import { PartnerPremiumDashboard } from "../components/partner/PartnerPremiumDashboard";
import type { MapCameraCommand } from "../services/maps/liveMapModel";
import type { LatLngLiteral } from "../services/maps/types";

import { CaraivaLivingHeader } from "../components/guia/CaraivaLivingHeader";
import { CaraivaDock } from "../components/guia/CaraivaDock";
import { CaraivaOrb } from "../components/guia/CaraivaOrb";
import { useCaraivaMoment } from "../components/guia/useCaraivaMoment";
import "../components/guia/caraiva-shell.css";
import "../components/guia/caraiva-sand.css";

import "../components/guia/caraiva-theme.css";
import "../components/guia/caraiva-mobile.css";
import "../components/guia/caraiva-tech.css";
import { GuidePlaceMedia } from "../components/guia/GuidePlaceMedia";
import { GuideTabArrival, GuideLoadingScene } from "../components/guia/GuideTabArrival";
import { CaraivaSmartSearch } from "../components/guia/CaraivaSmartSearch";
import "../components/guia/caraiva-life.css";
import "../components/guia/caraiva-responsive.css";
import { GuideRefinePanel } from "../components/guia/GuideRefinePanel";
import { useGuideViewport } from "../components/guia/useGuideViewport";
import { useGuideTheme } from "../components/guia/useGuideTheme";
import { GuideThemeButton } from "../components/guia/GuideThemeButton";
import { GuidePhotoCredits } from "../components/guia/GuidePhotoCredits";
import { useGuideMotion } from "../components/guia/useGuideMotion";
import { GuideOnboarding, hasGuideResume, readGuideGreeting, readGuideInterests } from "../components/guia/GuideOnboarding";
// High-definition Caraíva stories
const HD_CARAIVA_STORIES: GuiaStory[] = [
  {
    id: "st-1",
    author: "@julia.caraiva",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    location: "Boteco do Pará, Rio Caraíva",
    timeAgo: "há 24 min",
    image: asset("assets/caraiva-photos/caraiva-07-640.webp"),
    stickerText: "Pôr do Sol no Rio",
    caption: "@julia no Pôr do Sol",
    likes: 84,
    category: "Comer",
    whatsappNumber: "5573999991001",
  },
  {
    id: "st-2",
    author: "@marcos.roots",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    location: "Canoa no Rio Caraíva",
    timeAgo: "há 42 min",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=85",
    stickerText: "Travessia Mágica",
    caption: "@marcos no Rio Caraíva",
    likes: 72,
    category: "Passeios",
  },
  {
    id: "st-3",
    author: "@barco.corumbau",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    location: "Ponta do Corumbau",
    timeAgo: "há 1h",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1080&q=85",
    stickerText: "Águas Cristalinas",
    caption: "@barco.corumbau",
    likes: 128,
    category: "Praia",
  },
  {
    id: "st-4",
    author: "@forro.ourico",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    location: "Forró do Ouriço",
    timeAgo: "há 3h",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1080&q=85",
    stickerText: "Hoje tem Forró!",
    caption: "@forro.ourico na Areia",
    likes: 195,
    category: "Noite",
    whatsappNumber: "5573999991004",
  },
];

export type GuiaTab = "inicio" | "explorar" | "agora" | "mapa" | "salvos" | "concierge" | "business";

export const GuiaCaraivaApp: React.FC = () => {
  const { theme, toggleTheme } = useGuideTheme();
  const [photoCreditsOpen, setPhotoCreditsOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(hasGuideResume);
  const onboardingRole = "visitor" as const;
  const [welcomeRevision, setWelcomeRevision] = useState(0);
  const visitorName = useMemo(readGuideGreeting, [welcomeRevision]);
  const visitorInterests = useMemo(readGuideInterests, [welcomeRevision]);
  const [activeTab, setActiveTab] = useState<GuiaTab>("inicio");
  const [conciergeRequest, setConciergeRequest] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | "todos">("todos");
  const [selectedVibe, setSelectedVibe] = useState<string | "todas">("todas");
  
  // Modals & Selections
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessInitialTab, setBusinessInitialTab] = useState<"visao-geral" | "cardapio" | "vitrine" | "reserva">("visao-geral");
  const [mapFocusBusiness, setMapFocusBusiness] = useState<Business | null>(null);
  
  const [stories, setStories] = useState<GuiaStory[]>(HD_CARAIVA_STORIES);
  const [activeStory, setActiveStory] = useState<GuiaStory | null>(null);
  const [isPostingStory, setIsPostingStory] = useState(false);
  const [isTideModalOpen, setIsTideModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(() => getFavorites().length);
  const [isTrendingExpanded, setIsTrendingExpanded] = useState(false);

  // Sistema de Rotas Pedonais & POV
  const [routeBusiness, setRouteBusiness] = useState<Business | null>(null);
  const [activeRoutePath, setActiveRoutePath] = useState<LatLngLiteral[]>([]);
  const [externalMapCommand, setExternalMapCommand] = useState<MapCameraCommand | undefined>(undefined);

  useGuideMotion(activeTab);
  useGuideViewport();
  const moment = useCaraivaMoment();
  const overlayOpen = Boolean(photoCreditsOpen || onboardingOpen || selectedBusiness || activeStory || isPostingStory || isTideModalOpen || isCameraModalOpen);
  const navigateGuide = (tab: GuiaTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Suporte a abertura direta de negócio via URL: ?local=boteco-do-para
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bizParam = params.get("restaurante") || params.get("bar") || params.get("local");

      if (bizParam) {
        const found = CARAIVA_BUSINESSES.find(b => b.slug === bizParam || b.id === bizParam);

        if (found) {
          setBusinessInitialTab("visao-geral");
          setSelectedBusiness(found);
        }
      }
    } catch {
      // URL parsing fallback
    }
  }, []);

  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!viewport) return;
    const original = viewport.content;
    if (!original.includes("viewport-fit")) viewport.content = `${original}, viewport-fit=cover`;
    return () => { viewport.content = original; };
  }, []);
  const isSalesAdmin = useMemo(() => checkSalesAdminAccess().isAuthorized, []);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    trackEvent("business_impression", { source: "guia_home" });

    const handleFavUpdate = (e: any) => {
      const list = e.detail || getFavorites();
      setFavoritesCount(list.length);
    };
    window.addEventListener("caraiva:favorites-updated", handleFavUpdate);

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      window.removeEventListener("caraiva:favorites-updated", handleFavUpdate);
      caraivaAudio.stop();
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleToggleGlobalAudio = () => {
    const active = caraivaAudio.toggle();
    setIsAudioActive(active);
    showToast(active ? "🌊 Áudio ambiente de Caraíva ativado!" : "🔇 Áudio pausado.");
  };

  const handleOpenBusinessModal = (business: Business, tab: "visao-geral" | "cardapio" | "vitrine" | "reserva" = "visao-geral") => {
    setBusinessInitialTab(tab);
    setSelectedBusiness(business);
  };

  const handleOpenMapWithBusiness = (business: Business) => {
    setMapFocusBusiness(business);
    setActiveTab("mapa");
  };

  const handleStartRoute = (business: Business) => {
    setMapFocusBusiness(null);
    setRouteBusiness(business);
  };

  const handleIntentionSelect = (intentionId: string) => {
    if (intentionId === "agora") {
      setActiveTab("agora");
    } else if (intentionId === "comer") {
      setSelectedCategory("restaurantes");
      setActiveTab("explorar");
    } else if (intentionId === "praias") {
      setSelectedCategory("praias");
      setActiveTab("explorar");
    } else if (intentionId === "passeios") {
      setSelectedCategory("passeios");
      setActiveTab("explorar");
    } else if (intentionId === "noite") {
      setSelectedCategory("noite");
      setActiveTab("explorar");
    } else if (intentionId === "cafes") {
      setSelectedCategory("cafes");
      setActiveTab("explorar");
    } else if (intentionId === "eventos") {
      setActiveTab("agora");
    } else {
      setActiveTab("explorar");
    }
  };

  // Filtered businesses for the "explorar" tab
  const filteredBusinesses = useMemo(() => {
    return CARAIVA_BUSINESSES.filter((b) => {
      // Category filter
      if (selectedCategory !== "todos" && b.category !== selectedCategory) {
        return false;
      }
      // Vibe filter
      if (selectedVibe !== "todas" && !b.vibe.includes(selectedVibe as any)) {
        return false;
      }
      // Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesDesc = b.description.toLowerCase().includes(q) || b.shortDescription.toLowerCase().includes(q);
        const matchesTags = b.tags.some((t) => t.toLowerCase().includes(q));
        const matchesLocation = b.locationReference.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTags && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedVibe, searchQuery]);

  const handleCreateStory = useCallback(() => {
    if (!postCaption.trim()) {
      showToast("Escreva uma frase sobre seu momento em Caraíva!");
      return;
    }

    const newStory: GuiaStory = {
      id: `st-${Date.now()}`,
      author: "@turista.vivo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      location: "Vila de Caraíva",
      timeAgo: "agora mesmo",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1080&q=85",
      stickerText: "✨ Na Vila Agora",
      caption: postCaption,
      likes: 1,
      category: "Agora",
    };

    setStories((prev) => [newStory, ...prev]);
    showToast("🎉 Seu momento foi publicado no Guia Caraíva!");
    setIsPostingStory(false);
    setPostCaption("");
  }, [postCaption, showToast]);

  return (
    <div data-theme={theme} data-period={moment.period} data-tab={activeTab} className="caraiva-guide min-h-screen bg-[#080d12] text-slate-100 font-sans relative selection:bg-amber-400 selection:text-slate-950">
      {photoCreditsOpen && <GuidePhotoCredits onClose={() => setPhotoCreditsOpen(false)} />}
      {(activeTab === "mapa" || activeTab === "business") && !overlayOpen && <GuideThemeButton theme={theme} onToggle={toggleTheme} floating />}
      {onboardingOpen && <GuideOnboarding initialRole={onboardingRole} onClose={() => { setOnboardingOpen(false); if (hasGuideResume()) history.replaceState(null, "", location.pathname + location.search); }} onDone={() => { setOnboardingOpen(false); setWelcomeRevision(v => v + 1); if (hasGuideResume()) history.replaceState(null, "", location.pathname + location.search); }} />}
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 max-w-sm mx-auto z-50 bg-[#0e1620]/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-white/20 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Visualização Demonstrativa — Transparência Rigorosa */}
      {activeTab !== "business" && activeTab !== "mapa" && (
        <div className="bg-amber-400/10 border-b border-amber-400/20 px-3 py-1 text-center text-[10px] sm:text-[11px] text-amber-300 font-medium tracking-wide">
          <span>✦ Visualização demonstrativa — informações sujeitas a confirmação pelo estabelecimento.</span>
        </div>
      )}

      {activeTab !== "business" && activeTab !== "mapa" && (
        <CaraivaLivingHeader moment={moment} audioActive={isAudioActive} salesAdmin={isSalesAdmin}
          onHome={() => navigateGuide("inicio")} onAudio={handleToggleGlobalAudio}
          onBusiness={() => navigateGuide("business")} theme={theme} onToggleTheme={toggleTheme} />
      )}
      {/* Main Content Render Area */}
      <GuideTabArrival tab={activeTab}/>
      <main key={activeTab} className={`relative z-20${activeTab !== "business" ? " caraiva-content" : ""}`}>
        {/* 1. ABA INÍCIO */}
        {activeTab === "inicio" && (
          <div className="cv-guide-home space-y-6 pb-28">
            {/* Cinematic Hero with Search and Live Tide Pill */}
            <CaraivaCinematicHero
              theme={theme}
              onPhotoCredits={() => setPhotoCreditsOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenTideModal={() => setIsTideModalOpen(true)}
              onOpenSearch={() => setActiveTab("explorar")}
              onOpenMap={() => navigateGuide("mapa")}
              visitorName={visitorName}
              onConcierge={request => { setConciergeRequest(request || ""); navigateGuide("concierge"); }}
            />

            {/* Stories da Vila Redesenhados & Valorizados */}
            <div className="max-w-4xl mx-auto">
              <CaraivaStoriesRow
                stories={stories}
                onSelectStory={setActiveStory}
                onOpenCreateStory={() => setIsPostingStory(true)}
              />
            </div>

            {/* Visual Intentions Bar */}
            <div className="cv-home-intentions max-w-4xl mx-auto px-4 sm:px-6">
              <CaraivaIntentionsBar 
                selectedIntention={null}
                onSelectIntention={handleIntentionSelect} 
              />
            </div>

            {/* Destaques em Alta com Cards 3D Ricos */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    className="text-base font-extrabold tracking-tight flex items-center gap-2"
                    style={{ color: "var(--cv-ink)" }}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Em Alta na Vila</span>
                  </h3>
                  <p className="text-xs" style={{ color: "var(--cv-muted)" }}>
                    Os lugares mais procurados e recomendados pela IA
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTrendingExpanded((prev) => !prev)}
                    className="text-xs font-bold px-2.5 py-1 rounded-full border transition active:scale-95 flex items-center gap-1 cursor-pointer sm:hidden"
                    style={{
                      background: isTrendingExpanded ? "var(--cv-active)" : "var(--cv-soft)",
                      borderColor: "var(--cv-line)",
                      color: "var(--cv-ink)",
                    }}
                    title={isTrendingExpanded ? "Mostrar menos" : "Ver mais em alta"}
                  >
                    <span>{isTrendingExpanded ? "Menos" : "+2 em alta"}</span>
                    {isTrendingExpanded ? (
                      <ChevronUp className="w-3 h-3 text-amber-500" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-amber-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("explorar")}
                    className="text-xs font-bold text-amber-500 hover:text-amber-400"
                  >
                    Ver todos ↗
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(isTrendingExpanded ? CARAIVA_BUSINESSES.slice(0, 4) : CARAIVA_BUSINESSES.slice(0, 2)).map((b) => (
                  <BusinessCard3D
                    key={b.id}
                    business={b}
                    onSelect={handleOpenBusinessModal}
                    onOpenMap={handleStartRoute}
                    onToggleFavorite={(id, name) => {
                      const next = toggleFavorite(id, name);
                      setFavoritesCount(getFavorites().length);
                      showToast(next ? `❤️ ${name} salvo!` : `Removido dos salvos`);
                    }}
                    isFavorite={isFavorite(b.id)}
                    aiBadgeReason={b.category === "restaurantes" ? "Pôr do Sol & Pastel Famoso" : "Recomendado Hoje"}
                  />
                ))}
              </div>
            </div>

            {/* Caraíva Agora Urgency Carousel */}
            <div className="max-w-4xl mx-auto">
              <CaraivaNowSection
                onSelectBusiness={handleOpenBusinessModal}
                onSeeAllNow={() => setActiveTab("agora")}
              />
            </div>

            {/* Near You / Curated Selection Section */}
            <div className="max-w-4xl mx-auto">
              <CaraivaNearYouSection
                preferredInterests={visitorInterests}
                onSelectBusiness={handleOpenBusinessModal}
                onOpenMap={handleStartRoute}
              />
            </div>

            {/* AI Vision Camera Banner */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <button
                onClick={() => setIsCameraModalOpen(true)}
                className="w-full p-4 rounded-3xl transition-all group cd-card-3d flex items-center justify-between shadow-md"
                style={{
                  background: "var(--cv-paper)",
                  border: "1px solid var(--cv-line)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/25 group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3
                      className="text-sm font-bold flex items-center gap-1.5"
                      style={{ color: "var(--cv-ink)" }}
                    >
                      Câmera IA: Aponte e Descubra <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </h3>
                    <p className="text-xs" style={{ color: "var(--cv-muted)" }}>
                      Fotografe qualquer casinha, barco ou prato para saber a história e preço
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border hidden sm:inline"
                  style={{
                    background: "rgba(15, 163, 165, 0.1)",
                    borderColor: "rgba(15, 163, 165, 0.25)",
                    color: "var(--cv-river)",
                  }}
                >
                  Abrir Câmera
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 2. ABA EXPLORAR */}
        {activeTab === "explorar" && (
          <div className="cv-guide-explore max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Explorar Caraíva
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif mt-1">
                Todos os Lugares & Experiências
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                {filteredBusinesses.length} estabelecimentos e atrativos autênticos verificados.
              </p>
            </div>

            <CaraivaSmartSearch compact query={searchQuery} onQueryChange={setSearchQuery} onSubmit={()=>{}} onAskConcierge={request=>{setConciergeRequest(request);navigateGuide("concierge");}}/>
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "todos", label: "Todos" },
                { id: "restaurantes", label: "Restaurantes" },
                { id: "bares", label: "Bares" },
                { id: "praias", label: "Praias" },
                { id: "passeios", label: "Passeios" },
                { id: "noite", label: "Noite & Forró" },
                { id: "cafes", label: "Cafés" },
                { id: "hospedagens", label: "Pousadas" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Secondary filters stay available without crowding phone screens. */}
            <GuideRefinePanel active={selectedVibe !== "todas"}>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <span className="text-slate-500 font-medium text-[11px] shrink-0 mr-1">Vibe:</span>
              {[
                { id: "todas", label: "Todas" },
                { id: "casal", label: "Romântico" },
                { id: "gastronomia", label: "Gourmet" },
                { id: "noite", label: "Forró / Agito" },
                { id: "praia", label: "Pé na Areia" },
                { id: "amigos", label: "Amigos" },
                { id: "tranquilidade", label: "Zen / Relax" },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVibe(v.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    selectedVibe === v.id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            </GuideRefinePanel>

            {/* Grid of Places */}
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-white/[0.02] border border-white/10 space-y-2">
                <Compass className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">Nenhum resultado encontrado</h3>
                <p className="text-xs text-slate-400">Tente ajustar seus filtros de busca ou categoria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredBusinesses.map((b) => (
                  <div
                    key={b.id} data-cv-depth="true"
                    onClick={() => handleOpenBusinessModal(b)}
                    role="button" tabIndex={0} aria-label={`Ver detalhes de ${b.name}`}
                    onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handleOpenBusinessModal(b); } }}
                    className="cv-explore-place p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex gap-3.5 group hover:bg-white/[0.05]"
                  >
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                      <GuidePlaceMedia src={b.cover_image || b.heroImage} name={b.name}/>
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-amber-300 backdrop-blur-sm">
                        ★ {b.rating.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.2 rounded">
                            {b.subCategory}
                          </span>
                          <span className={`text-[9px] font-bold ${b.isOpenNow ? "text-emerald-400" : "text-rose-400"}`}>
                            {b.isOpenNow ? "• Aberto" : "• Fechado"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {b.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {b.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                        <span>{b.priceLevel} • {b.distanceTime}</span>
                        <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                          Ver detalhes →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ABA AGORA */}
        {activeTab === "agora" && (
          <CaraivaAgoraScreen
            onSelectBusiness={handleOpenBusinessModal}
            onSelectNowActivity={(activity: NowActivity) => {
              const b = CARAIVA_BUSINESSES.find((item) => item.id === activity.business_id);
              if (b) handleOpenBusinessModal(b);
            }}
          />
        )}

        {/* 4. CARAÍVA LIVE MAP — FOUNDATION */}
        {activeTab === "mapa" && (
          <React.Suspense fallback={<GuideLoadingScene/>}>
            <CaraivaLiveMap
              businesses={CARAIVA_BUSINESSES}
              selectedBusiness={routeBusiness ? null : mapFocusBusiness}
              onSelectBusiness={setMapFocusBusiness}
              onOpenBusiness={handleOpenBusinessModal}
              onStartRoute={handleStartRoute}
              onHome={() => navigateGuide("inicio")}
              activeRouteCoordinates={activeRoutePath}
              externalCommand={externalMapCommand}
            />
          </React.Suspense>
        )}
        {/* 5. ABA SALVOS (MINHA CARAÍVA) */}
        {activeTab === "salvos" && (
          <CaraivaSavedScreen
            onSelectBusiness={handleOpenBusinessModal}
            onOpenMap={handleOpenMapWithBusiness}
            onGoToConcierge={() => setActiveTab("concierge")}
            onExplore={() => setActiveTab("explorar")}
          />
        )}

        {/* 6. CONCIERGE IA SCREEN (21st.dev Agent Elements Style) */}
        {activeTab === "concierge" && (
          <CaraivaConciergeAgent
            initialRequest={conciergeRequest}
            onSelectBusiness={handleOpenBusinessModal}
            onNavigateToSaved={() => setActiveTab("salvos")}
          />
        )}

        {/* 7. PORTAL DO COMERCIANTE (/business) */}
        {activeTab === "business" && (
          <PartnerPremiumDashboard
            businessId={selectedBusiness?.id || "boteco-do-para"}
            onBackToGuide={() => setActiveTab("inicio")}
          />
        )}
      </main>

      {/* MODAL: ESTABELECIMENTO COMPLETO */}
      <CaraivaBusinessDetailModal
        business={selectedBusiness}
        initialTab={businessInitialTab}
        onClose={() => setSelectedBusiness(null)}
        onOpenMap={handleOpenMapWithBusiness}
        onStartRoute={handleStartRoute}
      />

      {/* MODAL: NAVEGAÇÃO PEDONAL & SIMULADOR POV 3D */}
      <CaraivaWalkingRouteModal
        business={routeBusiness}
        isOpen={Boolean(routeBusiness)}
        onClose={() => {
          setRouteBusiness(null);
          setActiveRoutePath([]);
          setExternalMapCommand(undefined);
        }}
        onUpdatePovCamera={(camera) => {
          setActiveTab("mapa");
          setExternalMapCommand({
            id: Date.now(),
            povCamera: camera,
          });
        }}
        onClearPovRoute={() => {
          setActiveRoutePath([]);
          setExternalMapCommand(undefined);
        }}
        onSetRoutePath={(coords) => {
          setActiveRoutePath(coords);
        }}
      />

      {/* MODAL: TÁBUA DE MARÉS, CLIMA & RADAR IA */}
      <TideWeatherAiModal
        isOpen={isTideModalOpen}
        onClose={() => setIsTideModalOpen(false)}
        onFilterTideSpots={() => {
          setSelectedCategory("praias");
          setActiveTab("explorar");
        }}
      />

      {/* MODAL: CÂMERA IA MULTIMODAL */}
      <MultimodalCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onShowToast={showToast}
        onPostCreatedStory={(story) => {
          const newStory: GuiaStory = {
            id: `st-${Date.now()}`,
            author: "@voce.em.caraiva",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            location: "Vila de Caraíva, Bahia",
            timeAgo: "agora mesmo",
            image: story.image,
            stickerText: story.stickerText,
            caption: story.caption,
            likes: 1,
            category: "Agora",
          };
          setStories((prev) => [newStory, ...prev]);
        }}
      />

      {/* MODAL: POSTAR STORY */}
      {isPostingStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0e1620] text-slate-100 p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <span className="font-serif font-bold text-lg text-white">Postar no Caraíva Agora</span>
              </div>
              <button onClick={() => setIsPostingStory(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Compartilhe uma foto ou momento na areia. Marque o restaurante para desbloquear mimos na vila!
            </p>

            <textarea
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              placeholder="Ex: @julia no Pôr do Sol do Boteco do Pará 🌅"
              className="w-full h-24 p-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />

            <button
              onClick={handleCreateStory}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/20 transition-all active:scale-98"
            >
              Publicar Momento no Guia 🚀
            </button>
          </div>
        </div>
      )}

      {activeTab !== "business" && !overlayOpen && (
        <>
          <CaraivaDock activeTab={activeTab} onNavigate={navigateGuide} favoritesCount={favoritesCount} moment={moment} />
          {activeTab !== "inicio" && activeTab !== "concierge" && activeTab !== "mapa" && <CaraivaOrb key={activeTab}
            onConcierge={() => navigateGuide("concierge")}
            onSearch={() => navigateGuide("explorar")}
            onMap={() => navigateGuide("mapa")}
            onTides={() => setIsTideModalOpen(true)}
            onCamera={() => setIsCameraModalOpen(true)} />}
        </>
      )}    </div>
  );
};

export default GuiaCaraivaApp;
