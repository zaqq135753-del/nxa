import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Camera, MapPin, X, Heart, Send, Compass, ChevronUp } from "lucide-react";

export type StoryCategory = "Agora" | "Praia" | "Comer" | "Beber" | "Noite" | "Passeios";

export interface GuiaStory {
  id: string;
  author: string;
  avatar: string;
  location: string;
  timeAgo: string;
  image: string;
  stickerText: string;
  caption: string;
  likes: number;
  category?: StoryCategory;
  spotId?: string;
}

interface StoriesEngineProps {
  stories: GuiaStory[];
  activeStory: GuiaStory | null;
  onSelectStory: (story: GuiaStory | null) => void;
  onOpenPostModal: () => void;
  onSaveToGuide: (story?: GuiaStory) => void;
  onShowToast: (msg: string) => void;
  onSelectSpotByName?: (spotName: string) => void;
}

const CATEGORIES: StoryCategory[] = ["Agora", "Praia", "Comer", "Beber", "Noite", "Passeios"];

export const StoriesEngine: React.FC<StoriesEngineProps> = React.memo(({
  stories,
  activeStory,
  onSelectStory,
  onOpenPostModal,
  onSaveToGuide,
  onShowToast,
  onSelectSpotByName,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory>("Agora");
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");

  // Touch gesture support for vertical swipe
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // Filtragem de stories por categoria
  const filteredStories = useMemo(() => {
    if (selectedCategory === "Agora") return stories;
    return stories.filter((s) => s.category === selectedCategory || !s.category);
  }, [stories, selectedCategory]);

  // Auto-advance progress timer
  useEffect(() => {
    if (!activeStory) {
      setProgress(0);
      return;
    }
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory]);

  // Handle slide advance when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && activeStory) {
      const currentIndex = stories.findIndex((s) => s.id === activeStory.id);
      if (currentIndex < stories.length - 1) {
        onSelectStory(stories[currentIndex + 1]);
      } else {
        onSelectStory(null);
      }
    }
  }, [progress, activeStory, stories, onSelectStory]);

  // Close story with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeStory) {
        onSelectStory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStory, onSelectStory]);

  const handleToggleLike = (storyId: string) => {
    const currentLikes = likesCount[storyId] || stories.find((s) => s.id === storyId)?.likes || 0;
    if (isLiked[storyId]) {
      setLikesCount((prev) => ({ ...prev, [storyId]: currentLikes - 1 }));
      setIsLiked((prev) => ({ ...prev, [storyId]: false }));
    } else {
      setLikesCount((prev) => ({ ...prev, [storyId]: currentLikes + 1 }));
      setIsLiked((prev) => ({ ...prev, [storyId]: true }));
      onShowToast("❤️ Você curtiu este Story!");
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onShowToast(`Mensagem enviada para ${activeStory?.author}!`);
    setReplyText("");
  };

  // Gestos de swipe vertical
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStartY.current || !touchEndY.current) return;
    const diff = touchStartY.current - touchEndY.current;

    // Swipe down (> 60px) fecha o story
    if (diff < -60) {
      onSelectStory(null);
    }
    // Swipe up (> 60px) avança para o próximo local
    else if (diff > 60 && activeStory) {
      const idx = stories.findIndex((s) => s.id === activeStory.id);
      if (idx < stories.length - 1) {
        onSelectStory(stories[idx + 1]);
      } else {
        onSelectStory(null);
      }
    }
    touchStartY.current = null;
    touchEndY.current = null;
  }, [activeStory, stories, onSelectStory]);

  return (
    <>
      {/* LIVE MOMENTS RAIL — SPRINT 5 */}
      <section className="cv-stories relative z-20 px-4 mt-5">
        <header className="cv-stories-heading"><span className="cv-section-eyebrow">PEDACINHOS DA VILA</span><h2>Histórias que encontram você.</h2><small>Momentos demonstrativos da comunidade</small></header>
        {/* Category Pills Header */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-300 shrink-0 spatial-press ${
                selectedCategory === cat
                  ? "bg-amber-400 text-night shadow-sm font-bold scale-105"
                  : "bg-black/35 text-white/85 hover:bg-black/50 border border-white/20"
              }`}
            >
              {cat === "Agora" && "✨ "}
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Horizontal Track */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none items-start">
          {/* Post Story Button */}
          <button
            onClick={onOpenPostModal}
            className="flex flex-col items-center gap-1.5 shrink-0 group text-center spatial-press"
          >
            <div className="w-[70px] h-[70px] rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-teal-300 to-sky-400 caraiva-story-ring-3d">
              <div className="w-full h-full rounded-full bg-night/50 backdrop-blur-md border border-white/60 flex items-center justify-center text-white">
                <Camera className="w-6 h-6 text-white drop-shadow" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md tracking-tight leading-tight">
              + Postar
            </span>
          </button>

          {/* Story Rings */}
          {filteredStories.map((st, idx) => {
            const gradientColors =
              idx % 3 === 0
                ? "from-amber-400 via-coral to-deep-water"
                : idx % 3 === 1
                ? "from-ocean via-teal-400 to-tropical-green"
                : "from-coral via-sun to-amber-300";

            return (
              <button
                key={st.id}
                onClick={() => {
                  setProgress(0);
                  onSelectStory(st);
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 group text-center spatial-press"
              >
                <div className={`w-[70px] h-[70px] rounded-full p-[2.5px] bg-gradient-to-tr ${gradientColors} caraiva-story-ring-3d`}>
                  <img
                    src={st.image}
                    alt={st.author}
                    loading="lazy"
                    decoding="async"
                    width={66}
                    height={66}
                    className="w-full h-full rounded-full object-cover border border-white/90"
                  />
                </div>
                <span className="text-[11px] font-medium text-white drop-shadow-md max-w-[76px] truncate leading-tight">
                  {st.author.split(".")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FULL-SCREEN STORY VIEWER (CINEMATIC WITH VERTICAL SWIPE & ACTIONS) */}
      {activeStory && (() => {
        const activeIdx = stories.findIndex((x) => x.id === activeStory.id);
        return (
          <div
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between max-w-md mx-auto animate-in fade-in duration-300 overflow-hidden select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Image / Video */}
            <div className="absolute inset-0 z-0">
              <img
                src={activeStory.image}
                alt="Caraíva Live Moment"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
            </div>

            {/* TOP BAR: Progress Indicators & Author Capsule */}
            <div className="relative z-10 p-4 pt-3 space-y-3">
              {/* Progress Bars */}
              <div className="flex gap-1.5">
                {stories.map((s, idx) => (
                  <div key={s.id} className="flex-1 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{
                        width:
                          idx < activeIdx
                            ? "100%"
                            : idx === activeIdx
                            ? `${progress}%`
                            : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Author Strip */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full p-[2px] bg-sun shadow-[0_0_12px_rgba(246,199,106,0.8)]">
                    <img
                      src={activeStory.avatar}
                      alt={activeStory.author}
                      className="w-full h-full rounded-full object-cover border border-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white drop-shadow">{activeStory.author}</span>
                      <span className="text-xs text-white/70">· {activeStory.timeAgo}</span>
                    </div>
                    <span className="text-xs text-white/90 flex items-center gap-1 drop-shadow mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {activeStory.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectStory(null)}
                  className="p-2 rounded-full bg-black/45 text-white/80 hover:text-white transition"
                  aria-label="Fechar Story"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CENTER FLOATING STICKERS & QUICK ACTIONS */}
            <div className="relative z-10 my-auto flex flex-col items-center gap-3 px-6">
              {/* Sticker Capsule */}
              <div className="spatial-glass text-night px-5 py-2 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 border border-white/80 animate-in zoom-in-95">
                <span className="text-base">✨</span>
                <span>{activeStory.stickerText || "Momento em Caraíva"}</span>
              </div>

              {/* Action Pill: Ver no Mapa ou no Feed */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectSpotByName) {
                      onSelectSpotByName(activeStory.location.split(",")[0]);
                      onSelectStory(null);
                    }
                  }}
                  className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/30 shadow-lg transition active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5 text-sun" />
                  <span>Ver Detalhes</span>
                </button>

                <button
                  onClick={() => {
                    onSelectSpotByName?.(activeStory.location.split(",")[0]);
                    onSelectStory(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg transition active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Continuar no app</span>
                </button>
              </div>

              {/* Micro-hint de swipe vertical */}
              <div className="flex items-center gap-1 text-[11px] text-white/60 mt-4 animate-bounce">
                <ChevronUp className="w-3 h-3" />
                <span>Deslize para cima para o próximo local</span>
              </div>
            </div>

            {/* BOTTOM BAR: Interaction, Like & in-app save */}
            <div className="relative z-10 p-4 space-y-3">
              <div className="flex items-center gap-2">
                {/* Reply Input */}
                <div className="flex-1 flex items-center bg-black/50 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2.5">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    placeholder="Responder ao story..."
                    className="w-full bg-transparent text-xs text-white placeholder-white/60 focus:outline-none"
                  />
                  {replyText && (
                    <button onClick={handleSendReply} className="text-amber-400 ml-1">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Heart Button */}
                <button
                  onClick={() => handleToggleLike(activeStory.id)}
                  className={`p-3 rounded-full transition shadow-lg backdrop-blur-xl ${
                    isLiked[activeStory.id]
                      ? "bg-rose-600 text-white"
                      : "bg-black/50 border border-white/30 text-white hover:text-rose-400"
                  }`}
                  aria-label="Curtir Story"
                >
                  <Heart className={`w-5 h-5 ${isLiked[activeStory.id] ? "fill-white" : ""}`} />
                </button>

                {/* Ação dentro do guia */}
                <button
                  onClick={() => onSaveToGuide(activeStory)}
                  className="bg-white text-night font-bold text-xs px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 hover:bg-zinc-100 transition shrink-0 active:scale-95"
                >
                  <span className="text-sm">📸</span>
                  <span className="leading-tight text-left">
                    <span className="block text-[10px] text-zinc-600 font-normal">Guardar no</span>
                    <strong className="block text-[11px] font-extrabold text-coral -mt-0.5">Guia</strong>
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
});

export default StoriesEngine;
