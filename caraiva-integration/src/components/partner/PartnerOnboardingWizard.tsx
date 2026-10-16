import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Utensils,
  Camera,
  MessageCircle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Save,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Instagram,
  ShieldCheck,
  Smartphone,
  Laptop,
  Check,
  X,
  Compass,
} from "lucide-react";
import type {
  BusinessInvite,
} from "../../data/partnerOnboardingTypes";
import {
  saveOnboardingAutosave,
  getOnboardingAutosave,
  calculateBusinessProfileCompletion,
  submitProfileForReview,
} from "../../services/partnerOnboardingService";
import { CARAIVA_BUSINESSES, type Business } from "../../data/caraivaDigitalData";

export interface OperatingSchedule {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  shift1: { open: string; close: string };
  hasSecondShift?: boolean;
}

export interface MenuItemDraft {
  id: string;
  name: string;
  description: string;
  price: number;
  isHighlight: boolean;
  dietaryFlags: string[];
}

export interface PhotoDraft {
  id: string;
  url: string;
  caption: string;
  order: number;
}

export interface WizardDraft extends Partial<Business> {
  tagline?: string;
  schedule: OperatingSchedule[];
  specialSeasonHours?: string;
  galleryPhotos: PhotoDraft[];
  menuList: MenuItemDraft[];
  primaryCtaLabel: string;
  primaryCtaCustomMessage: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  walkingDirections?: string;
}

interface PartnerOnboardingWizardProps {
  invite?: BusinessInvite;
  initialDraft?: Partial<Business>;
  userId: string;
  userRole?: string;
  onSubmitted?: (requestId: string) => void;
  onExit?: () => void;
}

const DEFAULT_SCHEDULE: OperatingSchedule[] = [
  { dayOfWeek: 0, dayName: "Domingo", isOpen: true, shift1: { open: "12:00", close: "23:00" }, hasSecondShift: false },
  { dayOfWeek: 1, dayName: "Segunda-feira", isOpen: true, shift1: { open: "12:00", close: "23:00" }, hasSecondShift: false },
  { dayOfWeek: 2, dayName: "Terça-feira", isOpen: true, shift1: { open: "12:00", close: "23:00" }, hasSecondShift: false },
  { dayOfWeek: 3, dayName: "Quarta-feira", isOpen: true, shift1: { open: "12:00", close: "23:00" }, hasSecondShift: false },
  { dayOfWeek: 4, dayName: "Quinta-feira", isOpen: true, shift1: { open: "12:00", close: "23:00" }, hasSecondShift: false },
  { dayOfWeek: 5, dayName: "Sexta-feira", isOpen: true, shift1: { open: "12:00", close: "00:00" }, hasSecondShift: false },
  { dayOfWeek: 6, dayName: "Sábado", isOpen: true, shift1: { open: "12:00", close: "00:00" }, hasSecondShift: false },
];

const CARAIVA_LANDMARKS = [
  "Beira-Rio Caraíva (Ponto da Balsa)",
  "Largo da Igrejinha de São Sebastião",
  "Rua do Meio",
  "Beco da Lua",
  "Praia da Barra (Encontro do Rio com o Mar)",
  "Praia Principal de Caraíva",
  "Campo de Futebol da Vila",
  "Caminho da Praia do Satú",
  "Ponta do Corumbau (Acesso de Barco)",
  "Porto do Boi (Reserva Pataxó)",
];

export const PartnerOnboardingWizard: React.FC<PartnerOnboardingWizardProps> = ({
  invite,
  initialDraft,
  userId,
  onSubmitted,
  onExit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [autosaveBadge, setAutosaveBadge] = useState<string>("Salvo");
  const [isSaving, setIsSaving] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const businessId = invite?.business_id || initialDraft?.id || "novo-parceiro";
  const verifiedExisting = CARAIVA_BUSINESSES.find((b: Business) => b.id === businessId);

  const [draft, setDraft] = useState<WizardDraft>(() => {
    const saved = getOnboardingAutosave(businessId);
    if (saved && saved.data) {
      return saved.data as WizardDraft;
    }

    return {
      id: businessId,
      name: invite?.business_name || verifiedExisting?.name || initialDraft?.name || "",
      category: invite?.category || verifiedExisting?.category || initialDraft?.category || "restaurantes",
      tagline: verifiedExisting?.shortDescription || "",
      shortDescription: verifiedExisting?.shortDescription || "Experiência autêntica na vila de Caraíva.",
      description: verifiedExisting?.description || "Espaço acolhedor com a energia da Bahia.",
      whatsapp: invite?.contact_whatsapp || verifiedExisting?.whatsapp || "73999999999",
      phone: verifiedExisting?.phone || "",
      instagram: verifiedExisting?.instagram || "@caraivadigital",
      website: verifiedExisting?.website || "",
      address: verifiedExisting?.address || "Rua de Areia, Caraíva - BA",
      locationReference: verifiedExisting?.locationReference || "Beira-Rio Caraíva",
      walkingDirections: "Ao desembarcar na balsa, siga 150m pela rua de areia na direção do rio.",
      latitude: verifiedExisting?.latitude || -16.8145,
      longitude: verifiedExisting?.longitude || -39.1485,
      coordinates: verifiedExisting?.coordinates || { x: 30, y: 40 },
      schedule: DEFAULT_SCHEDULE,
      specialSeasonHours: "Em feriados e réveillon, recomendamos reserva antecipada via WhatsApp.",
      price_range: verifiedExisting?.price_range || "$$",
      priceLevel: verifiedExisting?.priceLevel || "$$",
      tags: verifiedExisting?.tags || ["Aceita Pix", "Wi-Fi Fibra", "Música ao Vivo", "Mesa na Areia"],
      cover_image: verifiedExisting?.cover_image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      galleryPhotos: [
        { id: "1", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", caption: "Ambiente e mesas", order: 0 },
        { id: "2", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", caption: "Entardecer na vila", order: 1 },
        { id: "3", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", caption: "Especialidade da casa", order: 2 },
        { id: "4", url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80", caption: "Drinks & Vinhos", order: 3 },
      ],
      menuList: [
        {
          id: "m-1",
          name: "Pastel Especial de Arraia",
          description: "Massa fininha e crocante, recheio úmido temperado com coentro fresco e pimenta de cheiro local.",
          price: 38,
          isHighlight: true,
          dietaryFlags: [],
        },
        {
          id: "m-2",
          name: "Moqueca de Peixe com Fruto da Estação",
          description: "Acompanha arroz de coco, pirão artesanal e farofa crocante de dendê.",
          price: 140,
          isHighlight: true,
          dietaryFlags: ["sem-gluten"],
        },
      ],
      primaryCtaLabel: "Acessar no app",
      primaryCtaCustomMessage: "",
      secondaryCtaLabel: "Ver Cardápio Completo",
      secondaryCtaUrl: "",
      ...initialDraft,
    };
  });

  const completion = calculateBusinessProfileCompletion(draft);

  // Autosave effect with debounce
  useEffect(() => {
    setIsSaving(true);
    setAutosaveBadge("Salvando...");
    const timeout = setTimeout(() => {
      saveOnboardingAutosave(businessId, currentStep, draft);
      setIsSaving(false);
      setAutosaveBadge("Salvo agora mesmo");
    }, 600);

    return () => clearTimeout(timeout);
  }, [draft, currentStep, businessId]);

  const updateDraft = (updater: (prev: WizardDraft) => WizardDraft) => {
    setDraft((prev: WizardDraft) => updater(prev));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitForReview = () => {
    const result = submitProfileForReview({
      businessId,
      businessName: draft.name || "Novo Estabelecimento",
      submittedBy: userId,
      proposedData: draft,
    });

    setSubmittedSuccess(true);
    if (onSubmitted) {
      onSubmitted(result.id);
    }
  };

  const steps = [
    { number: 1, title: "Seu Negócio", icon: Sparkles },
    { number: 2, title: "Horários", icon: Clock },
    { number: 3, title: "Localização", icon: MapPin },
    { number: 4, title: "Oferta & Cardápio", icon: Utensils },
    { number: 5, title: "Mídias & Fotos", icon: Camera },
    { number: 6, title: "Chamadas (CTA)", icon: MessageCircle },
    { number: 7, title: "Revisão & Envio", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-[#070b0e] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900 pb-20">
      {/* Top Bar with Progress and Autosave */}
      <header className="sticky top-0 z-50 bg-[#090e13]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              onClick={onExit}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title="Voltar ao Painel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight font-serif">
                {draft.name || "Novo Estabelecimento"}
              </h1>
              <span className="hidden sm:inline-block text-[11px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-mono">
                Onboarding Parceiro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Etapa {currentStep} de 7: {steps[currentStep - 1].title}
            </p>
          </div>
        </div>

        {/* Right Info: Autosave Badge & Progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Save className={`w-3.5 h-3.5 ${isSaving ? "text-amber-400 animate-spin" : "text-emerald-400"}`} />
            <span className="text-[11px]">{autosaveBadge}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-32 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">{completion.percentage}%</span>
          </div>
        </div>
      </header>

      {/* Step Navigation Pill Carousel */}
      <div className="bg-[#0b1016]/80 border-b border-white/5 px-4 sm:px-8 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max mx-auto max-w-5xl">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = s.number === currentStep;
            const isDone = s.number < currentStep;

            return (
              <button
                key={s.number}
                onClick={() => setCurrentStep(s.number)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20 scale-102"
                    : isDone
                    ? "bg-white/10 text-emerald-300 hover:bg-white/15"
                    : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]"
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6">
        {submittedSuccess ? (
          <div className="bg-gradient-to-b from-[#0f1722] to-[#0a1017] border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-bold font-serif text-white">
                Cadastro Enviado com Sucesso!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Parabéns! Suas informações foram submetidas para a curadoria do <strong>Caraíva Digital</strong>. Nossa equipe local revisará seu perfil em até 24 horas.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Próximos Passos:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                <li>Você receberá a notificação de publicação via WhatsApp cadastrado.</li>
                <li>Você já pode acessar o Painel do Comerciante para criar Ofertas Relâmpago e baixar seu QR Code oficial de mesa.</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => (window.location.href = "/business")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-400/20"
              >
                Ir para o Painel do Comerciante (/business)
              </button>
              <button
                onClick={() => (window.location.href = "/guia")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all"
              >
                Explorar Guia dos Turistas
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* ETAPA 1: SEU NEGÓCIO */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    1. Identidade do Seu Estabelecimento
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Confirme as informações principais que os turistas verão ao buscar por você na vila.
                  </p>
                </div>

                {verifiedExisting && (
                  <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-amber-300">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Encontramos dados públicos pré-cadastrados para este estabelecimento.</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                      ✓ Verificado Caraíva Digital
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome do Negócio */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Nome Oficial do Estabelecimento *</span>
                      <span className="text-[10px] text-slate-500">Ex: Boteco do Pará</span>
                    </label>
                    <input
                      type="text"
                      value={draft.name || ""}
                      onChange={(e) => updateDraft((d) => ({ ...d, name: e.target.value }))}
                      placeholder="Nome do seu restaurante, pousada ou passeio"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Categoria Principal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Categoria Principal *</label>
                    <select
                      value={draft.category}
                      onChange={(e) => updateDraft((d) => ({ ...d, category: e.target.value as any }))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="restaurantes">Restaurantes & Bares</option>
                      <option value="cafes">Cafés & Lanches</option>
                      <option value="hospedagens">Pousadas & Hostels</option>
                      <option value="passeios">Passeios & Experiências</option>
                      <option value="lojas">Lojas & Serviços Locais</option>
                    </select>
                  </div>

                  {/* Faixa de Preço */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Faixa de Preço Estimada</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["$", "$$", "$$$", "$$$$"] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateDraft((d) => ({ ...d, priceLevel: level, price_range: level }))}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                            draft.priceLevel === level
                              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                              : "bg-slate-900 border border-white/10 text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tagline / Frase Curta */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Frase de Destaque (Tagline - até 120 caracteres) *</span>
                      <span className="text-[10px] text-slate-500">{draft.shortDescription?.length || 0}/120</span>
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      value={draft.shortDescription || ""}
                      onChange={(e) => updateDraft((d) => ({ ...d, shortDescription: e.target.value }))}
                      placeholder="Ex: O mais tradicional pastel de arraia à beira do Rio Caraíva desde 1998."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Descrição Detalhada */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">
                      História & Proposta do Lugar (Descrição Longa)
                    </label>
                    <textarea
                      rows={4}
                      value={draft.description || ""}
                      onChange={(e) => updateDraft((d) => ({ ...d, description: e.target.value }))}
                      placeholder="Conte um pouco da história, atmosfera, ambiente e o que torna o seu espaço imperdível em Caraíva..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                    />
                  </div>

                  {/* WhatsApp Comercial */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Oficial para Contato / Reservas *</span>
                    </label>
                    <input
                      type="text"
                      value={draft.whatsapp || ""}
                      onChange={(e) => updateDraft((d) => ({ ...d, whatsapp: e.target.value }))}
                      placeholder="DDD + Número (ex: 73999998888)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>Perfil no Instagram</span>
                    </label>
                    <input
                      type="text"
                      value={draft.instagram || ""}
                      onChange={(e) => updateDraft((d) => ({ ...d, instagram: e.target.value }))}
                      placeholder="@seunegocio.caraiva"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: HORÁRIOS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                    <Clock className="w-6 h-6 text-amber-400" />
                    2. Horários de Funcionamento
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Mantenha seus horários atualizados para alimentar o status "Aberto Agora" no mapa e no feed dos turistas.
                  </p>
                </div>

                <div className="space-y-3">
                  {draft.schedule.map((item: OperatingSchedule, idx: number) => (
                    <div
                      key={item.dayOfWeek}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.isOpen}
                          id={`day-${item.dayOfWeek}`}
                          onChange={(e) => {
                            const isOpen = e.target.checked;
                            updateDraft((d) => {
                              const newSched = [...d.schedule];
                              newSched[idx] = { ...newSched[idx], isOpen };
                              return { ...d, schedule: newSched };
                            });
                          }}
                          className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-white/20 focus:ring-0 cursor-pointer"
                        />
                        <label
                          htmlFor={`day-${item.dayOfWeek}`}
                          className={`text-xs sm:text-sm font-semibold cursor-pointer ${
                            item.isOpen ? "text-white" : "text-slate-500 line-through"
                          }`}
                        >
                          {item.dayName}
                        </label>
                      </div>

                      {item.isOpen ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-slate-400">Turno 1:</span>
                          <input
                            type="time"
                            value={item.shift1.open}
                            onChange={(e) => {
                              const open = e.target.value;
                              updateDraft((d) => {
                                const newSched = [...d.schedule];
                                newSched[idx] = {
                                  ...newSched[idx],
                                  shift1: { ...newSched[idx].shift1, open },
                                };
                                return { ...d, schedule: newSched };
                              });
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-white/15 text-xs text-white font-mono"
                          />
                          <span className="text-slate-500 text-xs">às</span>
                          <input
                            type="time"
                            value={item.shift1.close}
                            onChange={(e) => {
                              const close = e.target.value;
                              updateDraft((d) => {
                                const newSched = [...d.schedule];
                                newSched[idx] = {
                                  ...newSched[idx],
                                  shift1: { ...newSched[idx].shift1, close },
                                };
                                return { ...d, schedule: newSched };
                              });
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-white/15 text-xs text-white font-mono"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-rose-400/80 font-medium">Fechado o dia todo</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Observação de Alta Temporada ou Feriados
                  </label>
                  <input
                    type="text"
                    value={draft.specialSeasonHours || ""}
                    onChange={(e) => updateDraft((d) => ({ ...d, specialSeasonHours: e.target.value }))}
                    placeholder="Ex: Em feriados e lua cheia funcionamos até 01:00 com música acústica."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* ETAPA 3: LOCALIZAÇÃO & COMO CHEGAR */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-amber-400" />
                    3. Localização & Como Chegar a Pé
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Como Caraíva não possui carros e as ruas são de areia fofa, pontos de referência claros são essenciais para os turistas.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Ponto de Referência em Caraíva *
                    </label>
                    <select
                      value={draft.locationReference || "Beira-Rio Caraíva"}
                      onChange={(e) => updateDraft((d) => ({ ...d, locationReference: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {CARAIVA_LANDMARKS.map((landmark) => (
                        <option key={landmark} value={landmark}>
                          {landmark}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Nome da Rua / Beco ou Descrição do Ponto
                    </label>
                    <input
                      type="text"
                      value={draft.address || ""}
                      onChange={(e) => updateDraft((d) => ({ ...d, address: e.target.value }))}
                      placeholder="Ex: Rua do Meio, em frente à praça"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Instruções Detalhadas de Chegada a Pé
                    </label>
                    <textarea
                      rows={3}
                      value={draft.walkingDirections || ""}
                      onChange={(e) => updateDraft((d) => ({ ...d, walkingDirections: e.target.value }))}
                      placeholder="Ex: Desça no ponto dos barqueiros, entre no segundo beco à esquerda após a lojinha de artesanato e caminhe 80 metros."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-sky-400" /> Coordenadas no Mapa Interativo
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Caraíva GPS Hub</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Latitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={draft.latitude || -16.8145}
                          onChange={(e) =>
                            updateDraft((d) => ({ ...d, latitude: parseFloat(e.target.value) || -16.8145 }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Longitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={draft.longitude || -39.1485}
                          onChange={(e) =>
                            updateDraft((d) => ({ ...d, longitude: parseFloat(e.target.value) || -39.1485 }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 4: CARDÁPIO / OFERTA */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-amber-400" />
                    4. Destaques da Sua Oferta ({String(draft.category).toUpperCase()})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Apresente os pratos chefes, passeios ou acomodações que os hóspedes e turistas mais procuram.
                  </p>
                </div>

                <div className="space-y-4">
                  {(draft.menuList || []).map((item: MenuItemDraft, idx: number) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          updateDraft((d) => ({
                            ...d,
                            menuList: d.menuList.filter((_: MenuItemDraft, i: number) => i !== idx),
                          }));
                        }}
                        className="absolute right-3 top-3 p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remover Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-slate-400 block mb-1">Nome do Item / Prato / Acomodação *</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              updateDraft((d) => {
                                const list = [...d.menuList];
                                list[idx] = { ...list[idx], name };
                                return { ...d, menuList: list };
                              });
                            }}
                            placeholder="Ex: Peixe Grelhado na Folha de Bananeira"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Preço Sugerido (R$)</label>
                          <input
                            type="number"
                            value={item.price || ""}
                            onChange={(e) => {
                              const price = parseFloat(e.target.value) || 0;
                              updateDraft((d) => {
                                const list = [...d.menuList];
                                list[idx] = { ...list[idx], price };
                                return { ...d, menuList: list };
                              });
                            }}
                            placeholder="Ex: 85"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-amber-300 font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Descrição e Ingredientes / Detalhes</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const description = e.target.value;
                            updateDraft((d) => {
                              const list = [...d.menuList];
                              list[idx] = { ...list[idx], description };
                              return { ...d, menuList: list };
                            });
                          }}
                          placeholder="Acompanha legumes na brasa e vinagrete de manga"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const newItem: MenuItemDraft = {
                        id: `item-${Date.now()}`,
                        name: "",
                        description: "",
                        price: 0,
                        isHighlight: true,
                        dietaryFlags: [],
                      };
                      updateDraft((d) => ({
                        ...d,
                        menuList: [...d.menuList, newItem],
                      }));
                    }}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-white/15 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Outro Item / Prato de Destaque</span>
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 5: MÍDIAS & FOTOS */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                    <Camera className="w-6 h-6 text-amber-400" />
                    5. Fotos de Alta Resolução
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Fotos com boa iluminação aumentam em até 3x os cliques de turistas no WhatsApp e reservas.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Foto de Capa Principal (16:9) *</span>
                    <span className="text-[10px] text-slate-500">Aparece nos cards e no topo</span>
                  </label>
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/15 bg-slate-900 group">
                    <img
                      src={draft.cover_image}
                      alt="Capa"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <input
                        type="text"
                        value={draft.cover_image || ""}
                        onChange={(e) => updateDraft((d) => ({ ...d, cover_image: e.target.value }))}
                        placeholder="URL da foto de capa (HTTPS)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Galeria de Fotos ({draft.galleryPhotos.length} fotos cadastradas)
                    </label>
                    <span className="text-[11px] text-amber-300">Mínimo recomendado: 4 fotos</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {draft.galleryPhotos.map((photo: PhotoDraft, pIdx: number) => (
                      <div
                        key={photo.id}
                        className="relative rounded-2xl overflow-hidden aspect-square border border-white/15 bg-slate-900 group"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateDraft((d) => ({
                              ...d,
                              galleryPhotos: d.galleryPhotos.filter((_: PhotoDraft, i: number) => i !== pIdx),
                            }));
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1.5 text-center text-[10px] text-slate-300 truncate">
                          {photo.caption || `Foto ${pIdx + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newPhoto: PhotoDraft = {
                        id: `photo-${Date.now()}`,
                        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
                        caption: `Nova Foto ${draft.galleryPhotos.length + 1}`,
                        order: draft.galleryPhotos.length,
                      };
                      updateDraft((d) => ({
                        ...d,
                        galleryPhotos: [...d.galleryPhotos, newPhoto],
                      }));
                    }}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-white/15 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Adicionar Foto à Galeria</span>
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 6: CHAMADAS PARA AÇÃO (CTA) */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-amber-400" />
                    6. Chamada para Ação (Conversão dos Turistas)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    O Caraíva Digital direciona cada perfil para a função certa dentro do aplicativo.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <MessageCircle className="w-4 h-4" /> Ação principal dentro do app
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Texto do Botão Principal</label>
                    <input
                      type="text"
                      value={draft.primaryCtaLabel}
                      onChange={(e) => updateDraft((d) => ({ ...d, primaryCtaLabel: e.target.value }))}
                      placeholder="Ex: Reservar mesa no app"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-400">Pedidos, cardápio, reservas, hospedagem, passeios e vitrines abrem dentro do Caraíva Digital. Links externos não são usados como ações do perfil.</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="text-xs text-slate-400">O fluxo secundário será exibido dentro do perfil conforme o nicho. Esta ficha não aceita URL de WhatsApp, Instagram ou site externo.</div>
                </div>
              </div>
            )}

            {/* ETAPA 7: PREVIEW EM TEMPO REAL & SUBMISSÃO */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                      <Eye className="w-6 h-6 text-amber-400" />
                      7. Preview Oficial & Submissão
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Veja exatamente como seu perfil aparecerá para turistas e moradores no aplicativo Caraíva Digital.
                    </p>
                  </div>

                  <div className="flex items-center bg-white/10 rounded-xl p-1 shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        previewDevice === "mobile" ? "bg-amber-400 text-slate-950 shadow" : "text-slate-300"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Mobile
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        previewDevice === "desktop" ? "bg-amber-400 text-slate-950 shadow" : "text-slate-300"
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" /> Desktop
                    </button>
                  </div>
                </div>

                {/* Device Frame */}
                <div className="flex justify-center">
                  <div
                    className={`transition-all duration-300 ${
                      previewDevice === "mobile"
                        ? "w-full max-w-[380px] rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden bg-slate-950"
                        : "w-full rounded-3xl border border-white/10 shadow-2xl overflow-hidden bg-slate-950 p-4"
                    }`}
                  >
                    <div className="space-y-4 pb-6">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img src={draft.cover_image} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-amber-400/30">
                              {String(draft.category)} • {draft.price_range}
                            </span>
                            <h3 className="text-lg font-bold font-serif text-white mt-1">
                              {draft.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 space-y-3">
                        <p className="text-xs text-slate-300 italic">"{draft.shortDescription}"</p>

                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                          <Clock className="w-3.5 h-3.5" /> Aberto Agora • Fecha às 23:00
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{draft.locationReference}</span>
                        </div>

                        <div className="pt-2">
                          <div className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                            <MessageCircle className="w-4 h-4" />
                            <span>{draft.primaryCtaLabel || "Acessar no app"}</span>
                          </div>
                        </div>

                        <div className="pt-2 space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Destaques da Casa
                          </h4>
                          {(draft.menuList || []).map((m: MenuItemDraft) => (
                            <div
                              key={m.id}
                              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-semibold text-white">{m.name}</p>
                                <p className="text-[10px] text-slate-400">{m.description}</p>
                              </div>
                              <span className="text-amber-300 font-mono font-bold shrink-0 ml-2">
                                R$ {m.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action Box */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      Pronto para Enviar para Curadoria
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Completude do perfil: <strong>{completion.percentage}%</strong>. As alterações serão salvas como rascunho seguro e publicadas após aprovação.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitForReview}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-extrabold text-xs transition-all shadow-xl shadow-amber-400/20 active:scale-98 shrink-0 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enviar para Revisão Oficial</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentStep === 1
                    ? "opacity-30 cursor-not-allowed text-slate-500"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-400/20"
                >
                  <span>Continuar para Etapa {currentStep + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
