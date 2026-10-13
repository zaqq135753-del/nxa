import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  MessageCircle,
  MapPin,
  Award,
  Zap,
  Clock,
  ArrowUpRight,
  PlusCircle,
  CheckCircle2,
  ChevronDown,
  QrCode,
  Printer,
  Calendar,
  Edit3,
  ShieldCheck,
} from "lucide-react";
import { CARAIVA_BUSINESSES } from "../../data/caraivaDigitalData";
import { getBusinessStats, type BusinessStats } from "../../services/analytics";
import { generateQrSvgDataUri } from "../../services/partnerOnboardingService";
import { MerchantSetup } from "../partner/MerchantSetup";

interface CaraivaMerchantPanelProps {
  initialBusinessId?: string;
  onBackToGuide?: () => void;
}

export const CaraivaMerchantPanel: React.FC<CaraivaMerchantPanelProps> = ({
  initialBusinessId = "boteco-do-para",
  onBackToGuide,
}) => {
  const [selectedBizId, setSelectedBizId] = useState(initialBusinessId);
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "offers" | "events" | "qrcode">("dashboard");
  const [statsPeriod, setStatsPeriod] = useState<"7d" | "30d" | "temporada">("30d");
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(true);
  const [showEditWizard, setShowEditWizard] = useState(false);

  // Flash offer state
  const [offerCreated, setOfferCreated] = useState(false);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDuration, setOfferDuration] = useState("Próximas 2 horas");

  // Events state
  const [eventCreated, setEventCreated] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("Hoje à noite");

  const currentBusiness =
    CARAIVA_BUSINESSES.find((b) => b.id === selectedBizId) || CARAIVA_BUSINESSES[0];

  const updateStats = () => {
    setStats(getBusinessStats(selectedBizId));
  };

  useEffect(() => {
    updateStats();
    const handleAnalytics = () => updateStats();
    window.addEventListener("caraiva:analytics-event", handleAnalytics);
    return () => {
      window.removeEventListener("caraiva:analytics-event", handleAnalytics);
    };
  }, [selectedBizId]);

  const handlePublishOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle) return;
    setOfferCreated(true);
    setTimeout(() => {
      setOfferCreated(false);
      setOfferTitle("");
      setOfferPrice("");
    }, 4000);
  };

  const handlePublishEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;
    setEventCreated(true);
    setTimeout(() => {
      setEventCreated(false);
      setEventTitle("");
    }, 4000);
  };

  // Metrics calculation
  const impressions = stats?.impressions || 0;
  const profileViews = stats?.profileViews || 0;
  const whatsappClicks = stats?.whatsappClicks || 0;
  const routesSaved = (stats?.routeClicks || 0) + (stats?.favorites || 0);

  // Real CTR calculation
  const ctr = impressions > 0 ? ((profileViews / impressions) * 100).toFixed(1) : "0.0";
  const convRate = profileViews > 0 ? ((whatsappClicks / profileViews) * 100).toFixed(1) : "0.0";

  // ROI estimate (only if there are actual clicks)
  const ticketMedio = (currentBusiness.category as string) === "hospedagens" ? 480 : 165;
  const estimatedRevenue = whatsappClicks * ticketMedio;

  // QR 2 (Turista / Mesa) URL
  const publicPlaceUrl = `${window.location.origin}/guia?place=${currentBusiness.id}`;
  const qrSvgUrl = generateQrSvgDataUri(publicPlaceUrl);

  const handlePrintTableCard = () => {
    window.print();
  };

  if (showEditWizard) {
    return (
      <MerchantSetup initialBusiness={currentBusiness} onClose={() => setShowEditWizard(false)} />
    );
  }

  return (
    <div className="cv-merchant-panel min-h-screen bg-[#080d12] text-slate-100 font-sans pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#080d12]/95 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {onBackToGuide && (
            <button
              onClick={onBackToGuide}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 transition-colors flex items-center gap-1 shrink-0 font-medium active:scale-95"
            >
              ← <span className="hidden xs:inline">Voltar ao Guia</span><span className="xs:hidden">Guia</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-white flex items-center gap-1.5 font-serif truncate">
              Caraíva Business
              <span className="hidden sm:inline-block text-[9px] text-amber-400 font-mono font-normal uppercase bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                Portal do Parceiro
              </span>
            </h1>
          </div>
        </div>

        {/* Business Selector (RLS / Multi-business switch) */}
        <div className="relative shrink-0">
          <select
            value={selectedBizId}
            onChange={(e) => setSelectedBizId(e.target.value)}
            className="appearance-none bg-slate-900 border border-white/15 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 pr-7 text-xs font-semibold text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer shadow-lg max-w-[145px] xs:max-w-[185px] sm:max-w-none truncate"
          >
            {CARAIVA_BUSINESSES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </header>
      <p className="mx-3 sm:mx-6 my-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-relaxed text-amber-100">Demonstração local · sem login, envio ou publicação. Selecione um estabelecimento para testar a edição; o vínculo com cada loja será validado pelo futuro backend.</p>

      {/* Navigation Sub-Header */}
      <div className="border-b border-white/10 bg-[#080c10] px-3 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar text-[11px] sm:text-xs font-semibold">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-2.5 sm:py-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2.5 sm:py-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "profile"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Meu Perfil Oficial</span>
          </button>

          <button
            onClick={() => setActiveTab("offers")}
            className={`py-2.5 sm:py-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "offers"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Ofertas Relâmpago</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`py-2.5 sm:py-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "events"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Eventos & Noites</span>
          </button>

          <button
            onClick={() => setActiveTab("qrcode")}
            className={`py-2.5 sm:py-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "qrcode"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>QR Code de Mesa (Turista)</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Merchant Hero / Badge Card */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-[#0e1620] to-[#080d12] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold text-[10px] sm:text-xs border border-amber-400/30 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" /> Parceiro Verificado Caraíva Digital
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide uppercase">
                {currentBusiness.category} • {currentBusiness.locationReference}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-serif tracking-tight leading-tight">
              {currentBusiness.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Seu estabelecimento conectado diretamente aos turistas qualificados na vila. Dados em tempo real, proteção de rascunhos e QR Code para mesas.
            </p>
          </div>

          {/* Quick Status Toggle */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 self-start md:self-auto shrink-0 w-full sm:w-60">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Status no Aplicativo:</span>
              <span className={isLiveOpen ? "text-emerald-400" : "text-rose-400"}>
                {isLiveOpen ? "● Aberto Agora" : "○ Fechado"}
              </span>
            </div>
            <button
              onClick={() => setIsLiveOpen(!isLiveOpen)}
              className={`w-full py-1.5 sm:py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 ${
                isLiveOpen
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
              }`}
            >
              {isLiveOpen ? "Alternar para Fechado" : "Alternar para Aberto Agora"}
            </button>
            <p className="text-[9px] sm:text-[10px] text-slate-500 text-center">
              Atualiza o halo no Mapa e feed dos turistas
            </p>
          </div>
        </div>

        {/* TAB 1: DASHBOARD & MÉTRICAS */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Period selector */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Desempenho e Tráfego
              </h3>
              <div className="flex items-center bg-white/[0.04] rounded-xl p-0.5 sm:p-1 text-[10px] sm:text-xs">
                {(["7d", "30d", "temporada"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setStatsPeriod(period)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition-all ${
                      statsPeriod === period ? "bg-amber-400 text-slate-950 shadow" : "text-slate-400"
                    }`}
                  >
                    {period === "7d" ? "7 Dias" : period === "30d" ? "30 Dias" : "Temporada"}
                  </button>
                ))}
              </div>
            </div>

            {/* Commercial ROI Banner */}
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-400 font-bold">
                    Retorno Estimado Gerado ({statsPeriod === "7d" ? "7 dias" : statsPeriod === "30d" ? "30 dias" : "Temporada"})
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                    {estimatedRevenue > 0
                      ? `R$ ${estimatedRevenue.toLocaleString("pt-BR")},00`
                      : "Sem conversões registradas"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
                    {whatsappClicks > 0
                      ? `${whatsappClicks} conversões rastreadas (Ticket médio R$ ${ticketMedio}).`
                      : "Compartilhe seu link ou posicione o QR code nas mesas para converter turistas."}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-[10px] sm:text-xs font-bold border border-emerald-500/30">
                  Taxa de Conv: {convRate}%
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">Impressões</span>
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                  {impressions.toLocaleString("pt-BR")}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Exibições no feed e mapa</p>
              </div>

              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">Visualizações</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                  {profileViews.toLocaleString("pt-BR")}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Taxa de Clique: {ctr}%</p>
              </div>

              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-emerald-500/30 bg-emerald-500/[0.02] space-y-1">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">Leads WhatsApp</span>
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-400">
                  {whatsappClicks}
                </p>
                <p className="text-[10px] sm:text-[11px] text-emerald-300/80">Contatos diretos</p>
              </div>

              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">Rotas a Pé</span>
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                  {routesSaved}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Pediram como chegar</p>
              </div>
            </div>

            {/* Empty State vs Real Clicks Log */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Registro de Interações Recentes</h3>
                </div>
                <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 font-semibold">
                  Tempo Real
                </span>
              </div>

              {(stats?.recentClicks || []).length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                  <MessageCircle className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">
                    Nenhum clique no WhatsApp registrado nas últimas horas.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Turistas que clicarem no botão "Falar no WhatsApp" ou escanearem seu QR Code aparecerão aqui instantaneamente.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(stats?.recentClicks || []).map((click, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <div>
                          <p className="font-semibold text-white">Lead Direto WhatsApp</p>
                          <p className="text-[10px] text-slate-400">Origem: {click.source}</p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(click.timestamp).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MEU PERFIL OFICIAL (COM CHANGE REQUEST) */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Prévia do perfil · demonstração
                </span>
                <h3 className="text-xl font-bold font-serif text-white">{currentBusiness.name}</h3>
                <p className="text-xs text-slate-300">
                  A edição salva um rascunho neste aparelho. Envio e aprovação da curadoria dependem da futura integração com o backend.
                </p>
              </div>

              <button
                onClick={() => setShowEditWizard(true)}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 self-start sm:self-auto shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Dados do Estabelecimento</span>
              </button>
            </div>

            {/* Profile summary preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Informações de Contato & Localização
                </h4>
                <div className="space-y-2 text-slate-300">
                  <p><strong>WhatsApp:</strong> {currentBusiness.whatsapp || "(Não informado)"}</p>
                  <p><strong>Instagram:</strong> {currentBusiness.instagram || "@caraivadigital"}</p>
                  <p><strong>Ponto de Referência:</strong> {currentBusiness.locationReference}</p>
                  <p><strong>Faixa de Preço:</strong> {currentBusiness.price_range}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Governança & RLS Multi-Tenant
                </h4>
                <div className="space-y-2 text-slate-300">
                  <p className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Acesso de Proprietário (Owner) Ativo
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Somente membros autorizados deste estabelecimento podem criar ofertas e enviar alterações de perfil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OFERTAS RELÂMPAGO */}
        {activeTab === "offers" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Publicar Oferta Relâmpago</h3>
              </div>
              <span className="text-[11px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-semibold">
                Feed "Agora em Caraíva"
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Ative uma promoção imediata para atrair turistas nas próximas 2 a 4 horas (ex: mesas livres para o pôr do sol, caipirinha de caju em dobro ou desconto no cardápio).
            </p>

            <form onSubmit={handlePublishOffer} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Título da Oferta</label>
                <input
                  type="text"
                  placeholder="Ex: 2 Pastéis de Arraia + 1 Caipirinha de Caju"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Preço Promocional (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 68"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duração</label>
                  <select
                    value={offerDuration}
                    onChange={(e) => setOfferDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option>Próximas 2 horas</option>
                    <option>Até o Pôr do Sol</option>
                    <option>Somente Esta Noite</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Oferta Imediatamente</span>
              </button>

              {offerCreated && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Prévia da oferta criada nesta tela. Ela não foi enviada nem publicada no guia.</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 4: EVENTOS & NOITES */}
        {activeTab === "events" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Divulgar Evento ou Noite Especial</h3>
              </div>
              <span className="text-[11px] text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full border border-sky-400/20 font-semibold">
                Agenda Oficial
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Avise os turistas sobre noites de Forró, MPB ao vivo, Jam Sessions, rodízio de pizza ou celebrações especiais de lua cheia.
            </p>

            <form onSubmit={handlePublishEvent} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Título do Evento</label>
                <input
                  type="text"
                  placeholder="Ex: Forró Pé de Serra com Trio Regional"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Data / Horário</label>
                <input
                  type="text"
                  placeholder="Ex: Hoje às 21h30"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-400/20 transition-all active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Adicionar à Programação da Vila</span>
              </button>

              {eventCreated && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Prévia do evento criada nesta tela. Ela não foi enviada nem publicada na agenda.</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 5: QR CODE DE MESA (TURISTA - QR 2) */}
        {activeTab === "qrcode" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  QR Code 2 • Turista / Mesa Permanente
                </span>
                <h3 className="text-xl font-bold font-serif text-white">
                  Cartaz Imprimível para Mesas & Balcão
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Coloque este QR code impresso nas mesas ou no balcão da sua pousada/restaurante. Ao escanear, o turista abre diretamente seu cardápio, fotos e WhatsApp sem precisar digitar nada.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handlePrintTableCard}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-98"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Cartaz (A5/A4)</span>
                </button>
              </div>
            </div>

            {/* Printable Tent Card Mockup */}
            <div className="flex justify-center p-4">
              <div className="w-full max-w-sm rounded-3xl bg-white text-slate-900 p-8 shadow-2xl space-y-6 text-center border-4 border-amber-400 relative">
                {/* Caraíva Brand watermark */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    Guia Oficial Caraíva
                  </span>
                  <h4 className="text-2xl font-extrabold font-serif text-slate-950 mt-1">
                    {currentBusiness.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {currentBusiness.locationReference}
                  </p>
                </div>

                {/* Big Pure SVG QR Code */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
                  <img src={qrSvgUrl} alt="QR Code de Mesa" className="w-48 h-48 mx-auto" />
                </div>

                {/* Instructions */}
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-slate-900">
                    Aponte a câmera do celular
                  </p>
                  <p className="text-xs text-slate-600 leading-snug">
                    Cardápio • Fotos & Ambiente • Pedidos pelo Caraíva Digital
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                  caraivadigital.com.br
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
              Link de destino permanente:{" "}
              <a
                href={publicPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline font-mono"
              >
                {publicPlaceUrl}
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
