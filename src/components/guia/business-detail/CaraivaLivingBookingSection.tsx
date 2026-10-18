import React, { useState, useEffect } from "react";
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  Users,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  Waves,
  Music,
  Wind,
  Check,
  RefreshCw,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Business } from "../../../data/caraivaDigitalData";
import { addToItinerary } from "../../../services/favoritesService";
import { TapTableSyncService, type TapTableLiveState } from "../../../services/taptableSyncService";
import { createUnifiedOrder } from "../../../services/villageUnifiedOrdersService";

export interface CaraivaLivingBookingSectionProps {
  business?: Business | null;
  businessId?: string;
  businessName?: string;
  businessCategory?: string;
  whatsappNumber?: string;
  locationReference?: string;
  onClose?: () => void;
}

type SolarMomentId = "sunset" | "samba" | "lunch";

interface SolarMoment {
  id: SolarMomentId;
  title: string;
  subtitle: string;
  hours: string;
  icon: typeof Sunset;
  goldenTag: string;
  recommendation: string;
  tideNote: string;
  badge: string;
  timeSlots: string[];
  ambientRecommendation: AmbienceId;
}

type AmbienceId = "beira-rio" | "deck-coqueiros" | "salao-historico";

interface AmbienceOption {
  id: AmbienceId;
  title: string;
  highlight: string;
  description: string;
  icon: typeof Waves;
  tag: string;
}

const SOLAR_MOMENTS: SolarMoment[] = [
  {
    id: "sunset",
    title: "Pôr do Sol no Rio",
    subtitle: "Ouro da Vila & Espelho d'Água",
    hours: "16:30 — 18:00",
    icon: Sunset,
    goldenTag: "Momento Nobre & Ouro da Vila",
    recommendation: "Mesa recomendada na beira d'água sob a luz dourada do Rio Caraíva.",
    tideNote: "Reflexos de maré viva, céu âmbar sobre os manguezais e canoas no horizonte.",
    badge: "Mais Concorrido",
    timeSlots: ["16:30", "17:00", "17:30", "18:00"],
    ambientRecommendation: "beira-rio",
  },
  {
    id: "samba",
    title: "Roda de Samba & Luau",
    subtitle: "Acústico & Luz de Velas",
    hours: "20:30 — 23:00",
    icon: Moon,
    goldenTag: "Vibe Noturna & Cavaquinho",
    recommendation: "Mesas próximas à música e ao calor da tradicional roda de samba.",
    tideNote: "Brisa marinha noturna sob céu estrelado sem postes e iluminação indireta.",
    badge: "Luz de Velas",
    timeSlots: ["20:30", "21:00", "21:30", "22:00", "22:30"],
    ambientRecommendation: "salao-historico",
  },
  {
    id: "lunch",
    title: "Almoço Sombra de Amendoeira",
    subtitle: "Frescor & Maré Baixa",
    hours: "12:00 — 15:00",
    icon: Sun,
    goldenTag: "Maré Baixa & Frescor",
    recommendation: "Maré baixa com brisa fresca sob a copa de amendoeira centenária.",
    tideNote: "Bancos de areia expostos no rio para banho relaxante antes da refeição.",
    badge: "Refúgio da Praia",
    timeSlots: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"],
    ambientRecommendation: "deck-coqueiros",
  },
];

const AMBIENCE_OPTIONS: AmbienceOption[] = [
  {
    id: "beira-rio",
    title: "Beira-Rio",
    highlight: "Pés na areia & vista frontal",
    description: "Mesas rústicas posicionadas na margem do Rio Caraíva com visão panorâmica do poente.",
    icon: Waves,
    tag: "Vista Rio Frontal",
  },
  {
    id: "deck-coqueiros",
    title: "Deck dos Coqueiros",
    highlight: "Brisa elevada & intimismo",
    description: "Deck elevado em madeira nobre, integrado às copas dos coqueiros com brisa constante.",
    icon: Wind,
    tag: "Ambiente Aberto",
  },
  {
    id: "salao-historico",
    title: "Salão Histórico",
    highlight: "Arquitetura colonial & arte",
    description: "Casarão tradicional com piso batido, iluminação suave de velas e obras de artesãos locais.",
    icon: Music,
    tag: "Música & Cultura",
  },
];

export const CaraivaLivingBookingSection: React.FC<CaraivaLivingBookingSectionProps> = ({
  business,
  businessId = business?.id || "boteco-do-para",
  businessName = business?.name || "Estabelecimento Caraíva",
  businessCategory = business?.category || "restaurantes",
  whatsappNumber = business?.whatsapp,
  locationReference = business?.locationReference || business?.address || "Beira do Rio, Caraíva",
}) => {
  const [selectedMomentId, setSelectedMomentId] = useState<SolarMomentId>("sunset");
  const selectedMoment = SOLAR_MOMENTS.find((m) => m.id === selectedMomentId) || SOLAR_MOMENTS[0];

  const [selectedAmbienceId, setSelectedAmbienceId] = useState<AmbienceId>("beira-rio");
  const selectedAmbience = AMBIENCE_OPTIONS.find((a) => a.id === selectedAmbienceId) || AMBIENCE_OPTIONS[0];

  const [dateOption, setDateOption] = useState<"hoje" | "amanha" | "outra">("hoje");
  const [customDate, setCustomDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>("17:00");

  const [peopleCount, setPeopleCount] = useState<number>(2);

  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem("caraiva_user_name") || "";
    } catch {
      return "";
    }
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      return localStorage.getItem("caraiva_user_phone") || "";
    } catch {
      return "";
    }
  });
  const [specialNotes, setSpecialNotes] = useState("");

  const [liveState, setLiveState] = useState<TapTableLiveState>(() =>
    TapTableSyncService.getLiveTableStatus(businessId)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedVoucher, setConfirmedVoucher] = useState<{
    code: string;
    dateFormatted: string;
    time: string;
    people: number;
    momentTitle: string;
    ambienceTitle: string;
    depositTotal: number;
    expirationMinutes: number;
  } | null>(null);

  const [addedToItineraryState, setAddedToItineraryState] = useState(false);

  useEffect(() => {
    if (!selectedMoment.timeSlots.includes(selectedTime)) {
      setSelectedTime(selectedMoment.timeSlots[0]);
    }
  }, [selectedMomentId, selectedMoment.timeSlots, selectedTime]);

  useEffect(() => {
    const unsubscribe = TapTableSyncService.subscribeToLiveTables((states) => {
      if (states[businessId]) {
        setLiveState(states[businessId]);
      }
    });
    return unsubscribe;
  }, [businessId]);

  const depositPerPerson = 50;
  const totalDeposit = peopleCount * depositPerPerson;

  const getResolvedDateString = () => {
    const now = new Date();
    if (dateOption === "hoje") {
      return now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    if (dateOption === "amanha") {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    const [y, m, d] = customDate.split("-");
    return `${d}/${m}/${y}`;
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Por favor, informe seu nome para o bloqueio da mesa.");
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem("caraiva_user_name", customerName);
      if (customerPhone) {
        localStorage.setItem("caraiva_user_phone", customerPhone);
      }
    } catch {
      // Ignora restrição de storage
    }

    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const prefix = businessId.substring(0, 3).toUpperCase();
      const voucherCode = `CRV-${prefix}-${randomSuffix}`;

      setConfirmedVoucher({
        code: voucherCode,
        dateFormatted: getResolvedDateString(),
        time: selectedTime,
        people: peopleCount,
        momentTitle: selectedMoment.title,
        ambienceTitle: selectedAmbience.title,
        depositTotal: totalDeposit,
        expirationMinutes: 20,
      });

      // Registra a reserva no Business OS e no hub do cliente
      try {
        const isHospedagem = (businessCategory || '').includes('hosped') || (businessCategory || '').includes('pousad');
        const isPasseio = (businessCategory || '').includes('passeio') || (businessCategory || '').includes('nautic');

        createUnifiedOrder({
          businessId,
          businessName,
          niche: isHospedagem ? 'hospedagem' : isPasseio ? 'passeios_barcos' : 'gastronomia',
          orderType: isHospedagem ? 'hospedagem' : isPasseio ? 'passeio' : 'mesa',
          customer: {
            name: customerName.trim(),
            phone: customerPhone.trim() || '73999990000',
            whatsappFormatted: (customerPhone.trim() || '73999990000').replace(/\D/g, ''),
          },
          items: [
            {
              id: voucherCode,
              name: `${isHospedagem ? 'Reserva de Suíte' : isPasseio ? 'Reserva de Passeio' : 'Bloqueio de Mesa'} — ${selectedMoment.title} (${selectedAmbience.title})`,
              quantity: peopleCount,
              unitPrice: depositPerPerson,
              subtotal: totalDeposit,
              notes: specialNotes.trim() || undefined,
            },
          ],
          totalAmount: totalDeposit,
          paidAmount: totalDeposit,
          paymentMethod: 'pix',
          paymentStatus: 'paid',
          destination: {
            type: 'mesa',
            label: 'Ambiente Selecionado',
            detail: `${selectedAmbience.title} • ${locationReference || 'Vila de Caraíva'}`,
          },
          bookingDetails: {
            checkInDate: getResolvedDateString(),
            timeSlot: `${selectedTime} (${selectedMoment.title})`,
            guestsCount: peopleCount,
            roomOrSuiteName: isHospedagem ? selectedAmbience.title : undefined,
          },
          notes: specialNotes.trim() || undefined,
        });
      } catch (err) {
        console.warn('Erro ao registrar reserva unificada:', err);
      }

      setIsSubmitting(false);
    }, 700);
  };

  const handleOpenWhatsApp = () => {
    if (!confirmedVoucher) return;

    const rawNumber = (whatsappNumber || "73999999999").replace(/\D/g, "");
    const formattedPhone = rawNumber.startsWith("55") ? rawNumber : `55${rawNumber}`;

    const text = `🌊 *RESERVA SOLAR CARAÍVA LIVING* 🌅
*Estabelecimento:* ${businessName}
*Voucher TapTable:* ${confirmedVoucher.code}

📅 *Data:* ${confirmedVoucher.dateFormatted}
⏰ *Horário:* ${confirmedVoucher.time} (${confirmedVoucher.momentTitle})
👥 *Pessoas:* ${confirmedVoucher.people} ${confirmedVoucher.people === 1 ? "pessoa" : "pessoas"}
📍 *Ambiente Selecionado:* ${confirmedVoucher.ambienceTitle}
✨ *Caução Cortesia:* R$ ${confirmedVoucher.depositTotal},00 (100% de crédito na mesa)
👤 *Titular:* ${customerName}${customerPhone ? ` (${customerPhone})` : ""}
${specialNotes ? `📝 *Observação:* ${specialNotes}\n` : ""}
_Garantia de mesa por até ${confirmedVoucher.expirationMinutes} min via TapTable Caraíva Digital._`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAddToItinerary = () => {
    if (!confirmedVoucher) return;
    addToItinerary({
      time: confirmedVoucher.time,
      spotId: businessId,
      spotName: businessName,
      activityTitle: `${confirmedVoucher.momentTitle} (${confirmedVoucher.ambienceTitle})`,
      category: businessCategory === "bares" ? "Bar & Música" : "Restaurante & Maré",
      tip: `Voucher ${confirmedVoucher.code}. Mesa garantida por 20min. Caução R$ ${confirmedVoucher.depositTotal} revertida no consumo.`,
    });
    setAddedToItineraryState(true);
    setTimeout(() => setAddedToItineraryState(false), 2800);
  };

  return (
    <div className="space-y-6 text-[#FFF4ED] select-none pb-6 font-sans">
      {/* 1. Header Cinematográfico & Status TapTable */}
      <div className="relative overflow-hidden rounded-3xl p-5 border border-[#F6C945]/30 bg-gradient-to-br from-[#141719] via-[#090B0C] to-[#141719] shadow-2xl">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#F6C945]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#F6C945]/20 text-[#F6C945] border border-[#F6C945]/40 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#F6C945]" />
                Reservas Inteligentes
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{liveState.availableTables} mesas livres ao vivo</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#FFF4ED] tracking-tight font-serif">
              Reserva Solar & Tábua de Maré
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-lg">
              Escolha a vibração da maré e o ambiente ideal em <strong className="text-[#F6C945]">{businessName}</strong>. 
              Sua mesa é bloqueada com garantia de cortesia no TapTable.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Localização</span>
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#F6C945]" />
              {locationReference}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!confirmedVoucher ? (
          <motion.form
            key="booking-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleConfirmReservation}
            className="space-y-6"
          >
            {/* 2. Seletor de "Momento Solar & Maré" */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#F6C945] flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" />
                  1. Escolha o Momento Solar & Maré
                </label>
                <span className="text-[11px] text-slate-400">Sincronizado com o ciclo da vila</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SOLAR_MOMENTS.map((moment) => {
                  const isSelected = selectedMomentId === moment.id;
                  const Icon = moment.icon;
                  return (
                    <button
                      type="button"
                      key={moment.id}
                      onClick={() => {
                        setSelectedMomentId(moment.id);
                        if (moment.ambientRecommendation) {
                          setSelectedAmbienceId(moment.ambientRecommendation);
                        }
                      }}
                      className={`relative p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                        isSelected
                          ? "bg-gradient-to-b from-[#1c2126] to-[#090B0C] border-[#F6C945] shadow-lg shadow-[#F6C945]/15 ring-1 ring-[#F6C945]/40"
                          : "bg-[#141719]/80 hover:bg-[#1a1f24] border-white/10 hover:border-white/20 text-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`p-2 rounded-xl transition-colors ${
                          isSelected ? "bg-[#F6C945] text-slate-950" : "bg-white/5 text-[#F6C945] group-hover:bg-[#F6C945]/20"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isSelected
                            ? "bg-[#F6C945]/20 text-[#F6C945] border border-[#F6C945]/40"
                            : "bg-white/5 text-slate-400 border border-white/5"
                        }`}>
                          {moment.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className={`text-sm font-black tracking-tight ${isSelected ? "text-[#FFF4ED]" : "text-slate-200"}`}>
                          {moment.title}
                        </h3>
                        <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {moment.hours}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-2 leading-snug line-clamp-2">
                          {moment.recommendation}
                        </p>
                      </div>

                      <div className={`mt-3 pt-2 border-t text-[10px] flex items-center gap-1.5 ${
                        isSelected ? "border-[#F6C945]/20 text-slate-300" : "border-white/5 text-slate-400"
                      }`}>
                        <Waves className={`w-3 h-3 shrink-0 ${isSelected ? "text-[#F6C945]" : "text-teal-400"}`} />
                        <span className="truncate">{moment.tideNote}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Seleção de Ambiente */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#F6C945] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  2. Selecione o Ambiente Desejado
                </label>
                <span className="text-[11px] text-slate-400">Preferência registrada no mapa de mesas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {AMBIENCE_OPTIONS.map((ambience) => {
                  const isSelected = selectedAmbienceId === ambience.id;
                  const Icon = ambience.icon;
                  return (
                    <button
                      type="button"
                      key={ambience.id}
                      onClick={() => setSelectedAmbienceId(ambience.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#1c2126] border-[#F6C945] shadow-md ring-1 ring-[#F6C945]/30 text-white"
                          : "bg-[#141719]/60 hover:bg-[#1a1f24] border-white/10 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${isSelected ? "bg-[#F6C945] text-slate-950" : "bg-white/5 text-slate-300"}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-xs font-bold">{ambience.title}</h4>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#F6C945]" />}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {ambience.description}
                      </p>

                      <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-[#F6C945]/80">
                        {ambience.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Data, Horário e Pessoas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-3xl bg-[#141719]/90 border border-white/10">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F6C945]" />
                  Data da Reserva
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDateOption("hoje")}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                      dateOption === "hoje"
                        ? "bg-[#F6C945] text-slate-950 shadow-sm"
                        : "bg-white/5 text-slate-300 hover:text-white border border-white/5"
                    }`}
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateOption("amanha")}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                      dateOption === "amanha"
                        ? "bg-[#F6C945] text-slate-950 shadow-sm"
                        : "bg-white/5 text-slate-300 hover:text-white border border-white/5"
                    }`}
                  >
                    Amanhã
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateOption("outra")}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                      dateOption === "outra"
                        ? "bg-[#F6C945] text-slate-950 shadow-sm"
                        : "bg-white/5 text-slate-300 hover:text-white border border-white/5"
                    }`}
                  >
                    Outra
                  </button>
                </div>

                {dateOption === "outra" && (
                  <input
                    type="date"
                    value={customDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full mt-2 bg-[#090B0C] border border-[#F6C945]/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-[#F6C945]"
                  />
                )}
                <p className="text-[10px] text-slate-400">
                  {getResolvedDateString()} • Maré favorável
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#F6C945]" />
                  Pessoas na Mesa
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
                  >
                    -
                  </button>
                  <div className="flex-1 py-1.5 px-3 rounded-xl bg-[#090B0C] border border-white/10 text-center font-mono font-black text-base text-[#F6C945]">
                    {peopleCount} {peopleCount === 1 ? "pessoa" : "pessoas"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPeopleCount((p) => Math.min(16, p + 1))}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  {peopleCount >= 6 ? "Grupo grande: mesas contíguas unificadas." : "Mesa intimista garantida."}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F6C945]" />
                  Horário no {selectedMoment.title}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedMoment.timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400">
                  Tolerância de 20 min com garantia TapTable
                </p>
              </div>
            </div>

            {/* 5. Dados do Titular */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Nome do Titular da Mesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clara & Rafael"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#141719] border border-white/10 focus:border-[#F6C945] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  WhatsApp para Confirmação *
                </label>
                <input
                  type="tel"
                  placeholder="(73) 99999-9999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#141719] border border-white/10 focus:border-[#F6C945] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Observações Especiais (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mesa com boa visão da lua, celebração de aniversário ou carrinho de bebê..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-[#141719] border border-white/10 focus:border-[#F6C945] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden transition"
                />
              </div>
            </div>

            {/* 6. Card de Caução de Cortesia / Consumação Mínima */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1c2126] to-[#141719] border border-[#F6C945]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#F6C945]/15 text-[#F6C945] border border-[#F6C945]/30 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#F6C945]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#FFF4ED]">Caução de Cortesia & Consumação</h4>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      100% Revertida
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    R$ {depositPerPerson},00 por pessoa (total: <strong className="text-[#F6C945]">R$ {totalDeposit},00</strong>), 
                    convertido integralmente em créditos para pratos e bebidas ao abrir sua comanda TapTable na mesa.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total em Crédito</span>
                <p className="text-lg font-black text-[#F6C945]">R$ {totalDeposit},00</p>
              </div>
            </div>

            {/* 7. Botão Principal de Bloqueio Instantâneo */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F6C945] via-[#ffd56b] to-[#F6C945] text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-[#F6C945]/20 hover:shadow-[#F6C945]/35 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#FFF4ED]/30 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Bloqueando Mesa no TapTable...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Bloquear Mesa Solar Instantaneamente</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                <Info className="w-3 h-3 text-[#F6C945]" />
                Confirmação instantânea sem espera de garçom • Cancelamento gratuito até 2 horas antes
              </p>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-3xl bg-gradient-to-b from-[#141719] to-[#090B0C] border-2 border-[#F6C945] shadow-2xl text-center space-y-5"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-[#F6C945]/20 border-2 border-[#F6C945] flex items-center justify-center text-[#F6C945] shadow-lg shadow-[#F6C945]/20 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Mesa Bloqueada no TapTable
              </span>
              <h3 className="text-2xl font-black text-[#FFF4ED] font-serif">
                Reserva Solar Garantida!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Sua mesa em <strong className="text-[#F6C945]">{businessName}</strong> está aguardando você.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#090B0C] border border-[#F6C945]/40 text-left space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Código do Voucher</span>
                <span className="text-sm font-black text-[#F6C945] tracking-widest">{confirmedVoucher.code}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Momento & Horário</span>
                  <span className="font-bold text-slate-200">{confirmedVoucher.time} ({confirmedVoucher.momentTitle})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Data</span>
                  <span className="font-bold text-slate-200">{confirmedVoucher.dateFormatted}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Ambiente</span>
                  <span className="font-bold text-slate-200">{confirmedVoucher.ambienceTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Pessoas & Crédito</span>
                  <span className="font-bold text-emerald-400">{confirmedVoucher.people}p • R$ {confirmedVoucher.depositTotal}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tolerância de chegada:</span>
                <span className="font-bold text-[#F6C945]">{confirmedVoucher.expirationMinutes} minutos</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Confirmar via WhatsApp Oficial do Estabelecimento</span>
              </button>

              <button
                type="button"
                onClick={handleAddToItinerary}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  addedToItineraryState
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                    : "bg-white/5 hover:bg-white/10 text-slate-200 border-white/15"
                }`}
              >
                {addedToItineraryState ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Adicionado ao Itinerário do Dia!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-[#F6C945]" />
                    <span>Adicionar Reserva ao Meu Roteiro do Dia</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setConfirmedVoucher(null)}
                className="text-xs text-slate-400 hover:text-white transition pt-2 block mx-auto underline cursor-pointer"
              >
                Fazer outra reserva neste estabelecimento
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
