import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Compass,
  Clock,
  Heart,
  Users,
  Sun,
  Moon,
  ChevronRight,
  CheckCircle2,
  CalendarPlus,
  Loader2,
  Send,
  HelpCircle,
} from "lucide-react";
import {
  activeConcierge,
  type ConciergePlan,
  type ConciergeQuery,
} from "../../services/conciergeProvider";
import { addToItinerary } from "../../services/favoritesService";
import { openBusinessWhatsApp } from "../../services/analytics";
import type { Business } from "../../data/caraivaDigitalData";

import { asset } from "../../lib/asset";
import { guideRequestPreferences } from "./guideRequestPreferences";

interface CaraivaConciergeScreenProps {
  initialRequest?: string;
  onSelectBusiness?: (business: Business) => void;
  onNavigateToSaved?: () => void;
}

export const CaraivaConciergeScreen: React.FC<CaraivaConciergeScreenProps> = ({
  initialRequest = "",
  onSelectBusiness,
  onNavigateToSaved,
}) => {
  const [mood, setMood] = useState<ConciergeQuery["mood"]>("romantico");
  const [timeOfDay, setTimeOfDay] = useState<ConciergeQuery["timeOfDay"]>("dia_completo");
  const [companions, setCompanions] = useState<ConciergeQuery["companions"]>("casal");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ConciergePlan | null>(null);
  const [request, setRequest] = useState(initialRequest);
  const [requestNotice, setRequestNotice] = useState("");
  const [error, setError] = useState("");
  const applyRequest = (text: string) => { const suggested=guideRequestPreferences(text); if(suggested.mood)setMood(suggested.mood); if(suggested.timeOfDay)setTimeOfDay(suggested.timeOfDay); if(suggested.companions)setCompanions(suggested.companions); setRequestNotice(Object.keys(suggested).length ? "Preferências sugeridas. Revise as escolhas abaixo antes de gerar." : "Conte um pouco mais ou escolha suas preferências abaixo."); };
  useEffect(()=>{ if(initialRequest.trim())applyRequest(initialRequest); },[initialRequest]);
  const [addedAll, setAddedAll] = useState(false);

  const handleGenerate = async () => {
    if(loading)return;
    setError("");
    setLoading(true);
    setAddedAll(false);
    try {
      const result = await activeConcierge.createItinerary({
        mood,
        timeOfDay,
        companions,
      });
      setPlan(result);
    } catch (err) {
      setError("Não conseguimos preparar seu roteiro agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToItinerary = () => {
    if (!plan) return;
    plan.steps.forEach((step) => {
      addToItinerary({
        time: step.time,
        spotId: step.business?.id || "custom-spot",
        spotName: step.business?.name || step.title,
        activityTitle: step.title,
        category: "Concierge",
        tip: step.description,
      });
    });
    setAddedAll(true);
    setTimeout(() => {
      if (onNavigateToSaved) onNavigateToSaved();
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-28">
      {/* Hero Header */}
      <div className="cv-concierge-hero relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/80 via-[#0c1a24] to-[#080d12] border border-emerald-500/20 shadow-2xl overflow-hidden">
        <img className="cv-concierge-photo" src={asset("assets/caraiva-photos/caraiva-05-640.webp")} alt="" loading="lazy" aria-hidden="true"/>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Concierge Nativo de Caraíva</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Como você deseja viver Caraíva hoje?
          </h1>
          <p className="text-slate-300 text-xs sm:text-base max-w-2xl leading-relaxed">
            Combine suas preferências com sugestões do guia. Horários, preços e disponibilidade precisam ser confirmados com cada estabelecimento.
          </p>
        </div>
      </div>

      <form className="cv-concierge-request" onSubmit={event=>{event.preventDefault();applyRequest(request);}}><label htmlFor="cv-concierge-request">Conte o que você tem em mente</label><textarea id="cv-concierge-request" rows={3} maxLength={240} value={request} onChange={event=>setRequest(event.target.value)} placeholder="Uma tarde tranquila na praia com minha família…"/><div><small>Sugestões locais · você confirma as preferências</small><span>{request.length}/240</span></div><div className="cv-search-ideas">{['Praia com a família à tarde','Forró à noite com amigos','Um dia econômico viajando solo'].map(idea=><button type="button" key={idea} onClick={()=>{setRequest(idea);applyRequest(idea);}}>{idea}</button>)}</div><button className="cv-request-submit" type="submit" disabled={!request.trim()}>Ajustar minhas preferências <Sparkles size={16}/></button>{requestNotice&&<p role="status">{requestNotice}</p>}</form>
      {error&&<p role="alert" className="text-rose-300 text-sm">{error}</p>}
      {/* Query Form Selectors */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
        {/* Mood Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Qual a atmosfera do dia?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: "romantico", label: "Romântico & Intimista", icon: "🕯️" },
              { id: "festa_forro", label: "Festa & Forró Pé-de-Serra", icon: "🪗" },
              { id: "gastronomico", label: "Gourmet & Alta Gastronomia", icon: "🍤" },
              { id: "natureza_relax", label: "Natureza & Pés Descalços", icon: "🌊" },
              { id: "economico", label: "Econômico & Raiz da Vila", icon: "🥥" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMood(item.id as ConciergeQuery["mood"])}
                className={`p-3 rounded-2xl text-left border transition-all text-xs font-semibold flex items-center gap-2.5 ${
                  mood === item.id
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-md shadow-amber-400/10"
                    : "bg-white/[0.02] text-slate-300 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Companions Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Com quem você está?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "casal", label: "Em Casal", icon: Heart },
              { id: "amigos", label: "Grupo de Amigos", icon: Users },
              { id: "solo", label: "Viajando Solo", icon: Compass },
              { id: "familia", label: "Família com Filhos", icon: HelpCircle },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCompanions(item.id as ConciergeQuery["companions"])}
                  className={`p-3 rounded-2xl border transition-all text-xs font-semibold flex items-center justify-center gap-2 ${
                    companions === item.id
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                      : "bg-white/[0.02] text-slate-300 border-white/5 hover:border-white/15"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time of Day Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Período
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "dia_completo", label: "Dia Completo", icon: Sparkles },
              { id: "manha", label: "Manhã", icon: Sun },
              { id: "tarde", label: "Tarde / Pôr do Sol", icon: Sun },
              { id: "noite", label: "Noite & Madrugada", icon: Moon },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTimeOfDay(item.id as ConciergeQuery["timeOfDay"])}
                  className={`p-3 rounded-2xl border transition-all text-xs font-semibold flex items-center justify-center gap-2 ${
                    timeOfDay === item.id
                      ? "bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-md"
                      : "bg-white/[0.02] text-slate-300 border-white/5 hover:border-white/15"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Organizando suas sugestões…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Gerar Roteiro Inteligente Sob Medida</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Result View */}
      {plan && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1620] border border-amber-500/30 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          {/* Plan Header */}
          <div className="space-y-2 border-b border-white/10 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Roteiro Gerado
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {plan.budgetTotal}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-serif">
              {plan.headline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 italic">"{plan.vibe}"</p>
          </div>

          {/* Local Native Tip Alert */}
          {plan.localTip && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="block text-amber-300 font-semibold mb-0.5">
                  Dica de Ouro de Quem Mora Aqui:
                </strong>
                <span>{plan.localTip}</span>
              </div>
            </div>
          )}

          {/* Steps Timeline */}
          <div className="space-y-4 pt-2">
            {plan.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {step.time}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      • {step.distanceTime}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      • {step.estimatedCost}
                    </span>
                  </div>
                  <h3
                    onClick={() => step.business && onSelectBusiness && onSelectBusiness(step.business)}
                    className="text-base font-bold text-white hover:text-amber-300 cursor-pointer flex items-center gap-1"
                  >
                    {step.title}
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </h3>
                  <p className="text-xs text-slate-300">{step.description}</p>
                </div>

                {step.business && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        openBusinessWhatsApp(
                          step.business!,
                          "concierge_plan",
                          step.whatsappMessage
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>{step.ctaLabel}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add All to Itinerary CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Gostou dessa programação? Salve diretamente na sua aba "Minha Caraíva".
            </span>
            <button
              onClick={handleAddAllToItinerary}
              disabled={addedAll}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all disabled:opacity-80"
            >
              {addedAll ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                  <span>Roteiro Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4" />
                  <span>Adicionar Todas ao Meu Dia</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
