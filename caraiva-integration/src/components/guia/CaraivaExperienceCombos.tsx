import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Check, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  CreditCard, 
  Utensils, 
  Bed, 
  Music, 
  Anchor, 
  Clock, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { asset } from '../../lib/asset';
import { trackEvent } from '../../services/analytics';
import { addToItinerary } from '../../services/favoritesService';

export interface ComboIncludedItem {
  category: 'hospedagem' | 'restaurante' | 'passeio' | 'noite';
  title: string;
  businessName: string;
  businessId: string;
  description: string;
  voucherValue: string;
}

export interface CaraivaCombo {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  originalPrice: number;
  comboPrice: number;
  heroImage: string;
  highlights: string[];
  included: ComboIncludedItem[];
  itinerarySummary: {
    period: string;
    description: string;
  }[];
}

export const CARAIVA_COMBOS: CaraivaCombo[] = [
  {
    id: 'combo-caraiva-magica',
    slug: 'combo-caraiva-magica',
    title: 'Passaporte Caraíva Mágica',
    subtitle: 'A experiência definitiva: Hospedagem pé na areia + Gastronomia ícone + Corumbau + Noite',
    badge: 'Mais Desejado · Economize 26%',
    duration: '3 Dias & 2 Noites',
    originalPrice: 1980,
    comboPrice: 1460,
    heroImage: asset('assets/caraiva-photos/caraiva-05-640.webp'),
    highlights: [
      '2 Noites em Pousada parceira com café da manhã tropical',
      'Almoço exclusivo com Pastel de Arraia no Boteco do Pará',
      'Passeio de barco náutico até a Ponta do Corumbau',
      'Acesso sem fila e welcome drink no Forró do Ouriço',
      'Passaporte Digital com validação por QR Code'
    ],
    included: [
      {
        category: 'hospedagem',
        title: 'Hospedagem Raiz & Conforto',
        businessName: 'Pousada da Vila Parceira',
        businessId: 'pousada-da-vila',
        description: '2 diárias para casal com varanda de rede e café colonial na areia',
        voucherValue: 'R$ 1.100',
      },
      {
        category: 'restaurante',
        title: 'Experiência Beira-Rio',
        businessName: 'Boteco do Pará',
        businessId: 'boteco-do-para',
        description: 'Mesa preferencial na maré baixa + 4 pastéis famosos + 2 caipirinhas de cacau',
        voucherValue: 'R$ 220',
      },
      {
        category: 'passeio',
        title: 'Expedição Náutica Corumbau',
        businessName: 'Barco Corumbau Raiz',
        businessId: 'barco-corumbau',
        description: 'Navegação até a ponta de areia que entra no mar com parada nos recifes',
        voucherValue: 'R$ 480',
      },
      {
        category: 'noite',
        title: 'Noite de Forró Tradicional',
        businessName: 'Forró do Ouriço',
        businessId: 'forro-ourico',
        description: '2 ingressos rápidos com pulseira VIP e 2 cervejas artesanais baianas',
        voucherValue: 'R$ 180',
      },
    ],
    itinerarySummary: [
      { period: 'Dia 1 · Chegada', description: 'Travessia de canoa no rio, check-in na pousada e almoço pé na areia no Boteco do Pará.' },
      { period: 'Dia 2 · Mar & Recifes', description: 'Expedição matinal de barco até Corumbau com banho de mar cristalino e retorno ao pôr do sol.' },
      { period: 'Dia 2 · Noite', description: 'Jantar livre e noite embalada pelo legítimo forró pé de serra no Ouriço.' },
      { period: 'Dia 3 · Despedida', description: 'Café colonial prolongado, banho no encontro do rio com o mar e check-out tranquilo.' },
    ]
  },
  {
    id: 'combo-dia-perfeito-mare',
    slug: 'combo-dia-perfeito-mare',
    title: 'Combo 1 Dia na Maré Baixa',
    subtitle: 'Roteiro inteligente sincronizado com a tábua de marés da foz',
    badge: '100% Sincronizado com IA',
    duration: '1 Dia Completo',
    originalPrice: 460,
    comboPrice: 340,
    heroImage: asset('assets/caraiva-photos/caraiva-07-640.webp'),
    highlights: [
      'Caminhada guiada pelas falésias até a Praia do Satu',
      'Almoço com moqueca pé na areia no Jacarandá',
      'Pôr do sol à beira-rio com drinks artesanais',
      'Crédito TapTable integrado no app'
    ],
    included: [
      {
        category: 'passeio',
        title: 'Trilha & Piscinas do Satu',
        businessName: 'Guia Nativo da Ponta',
        businessId: 'guia-satu',
        description: 'Travessia e caminhada na hora exata da maré seca com banho de lagoa',
        voucherValue: 'R$ 160',
      },
      {
        category: 'restaurante',
        title: 'Almoço Sob a Copa da Árvore',
        businessName: 'Restaurante Jacarandá',
        businessId: 'restaurante-jacaranda',
        description: 'Crédito de almoço para 2 pessoas com peixe fresco da costa',
        voucherValue: 'R$ 220',
      },
      {
        category: 'noite',
        title: 'Sunset Session no Rio',
        businessName: 'Bar Beira-Rio',
        businessId: 'bar-beira-rio',
        description: 'Dois drinks de frutas regionais durante a hora mágica do sol poente',
        voucherValue: 'R$ 80',
      },
    ],
    itinerarySummary: [
      { period: '10:00 · Maré Seca', description: 'Travessia para a praia e caminhada pelas piscinas naturais do Satu.' },
      { period: '14:30 · Almoço', description: 'Mesa reservada sob as árvores do Jacarandá com gastronomia afetiva.' },
      { period: '17:20 · Pôr do Sol', description: 'Assistir o sol mergulhar no Rio Caraíva com drink de cacau na mão.' },
    ]
  },
  {
    id: 'combo-circuito-gastronomico',
    slug: 'combo-circuito-gastronomico',
    title: 'Passaporte Gastronômico da Vila',
    subtitle: 'Degustação itinerante nas 4 cozinhas mais aclamadas de Caraíva',
    badge: 'Crédito Digital TapTable',
    duration: 'Válido por toda a estadia',
    originalPrice: 380,
    comboPrice: 285,
    heroImage: asset('assets/caraiva-photos/caraiva-12-640.webp'),
    highlights: [
      'Créditos para usar em 4 restaurantes parceiros',
      'Sobremesa de cortesia em cada parada',
      'Sem filas com comanda digital integrada',
      'Válido por até 7 dias após a ativação'
    ],
    included: [
      {
        category: 'restaurante',
        title: 'Petiscos da Foz',
        businessName: 'Boteco do Pará',
        businessId: 'boteco-do-para',
        description: 'Voucher degustação de pasteis e caldo de sururu',
        voucherValue: 'R$ 95',
      },
      {
        category: 'restaurante',
        title: 'Cozinha Nativa Contemporânea',
        businessName: 'Canto da Duca',
        businessId: 'canto-da-duca',
        description: 'Voucher almoço vegetariano e doce tradicional de banana',
        voucherValue: 'R$ 95',
      },
      {
        category: 'restaurante',
        title: 'Massa Artesanal & Forno a Lenha',
        businessName: 'Bar do Porto',
        businessId: 'bar-do-porto',
        description: 'Voucher pizza de fermentação natural com vista para as canoas',
        voucherValue: 'R$ 100',
      },
      {
        category: 'noite',
        title: 'Coquetelaria Autoral',
        businessName: 'Beco da Lua',
        businessId: 'beco-da-lua',
        description: 'Crédito no bar para 2 drinks autorais com especiarias baianas',
        voucherValue: 'R$ 90',
      },
    ],
    itinerarySummary: [
      { period: 'Uso Livre', description: 'Abra o QR Pass na mesa de qualquer um dos 4 estabelecimentos para debitar automaticamente da sua comanda.' },
    ]
  }
];

interface CaraivaExperienceCombosProps {
  onSelectBusiness?: (businessId: string) => void;
}

export const CaraivaExperienceCombos: React.FC<CaraivaExperienceCombosProps> = ({
  onSelectBusiness
}) => {
  const [selectedCombo, setSelectedCombo] = useState<CaraivaCombo | null>(null);
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  });
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedPass, setCompletedPass] = useState<{
    passId: string;
    comboTitle: string;
    total: number;
    guests: number;
    date: string;
  } | null>(null);

  const handleOpenCheckout = (combo: CaraivaCombo) => {
    setSelectedCombo(combo);
    setCompletedPass(null);
  };

  const handleConfirmComboBooking = () => {
    if (!selectedCombo) return;
    setIsProcessing(true);

    const passId = `PASS-${Date.now().toString().slice(-6)}`;
    const totalPrice = selectedCombo.comboPrice * (bookingGuests / 2 >= 1 ? bookingGuests / 2 : 1);

    setTimeout(() => {
      // Sincroniza pedido no ecossistema local e nos itinerários salvos
      try {
        const ecosystemStoreKey = "caraiva-demo-v2";
        const currentData = JSON.parse(localStorage.getItem(ecosystemStoreKey) || '{"orders":[],"bookings":[]}');
        
        const newBooking = {
          id: passId,
          kind: "combo",
          refId: selectedCombo.id,
          title: `${selectedCombo.title} (${bookingGuests} pessoas)`,
          guest: `Passaporte Turista`,
          start: bookingDate,
          seats: bookingGuests,
          split: { gross: totalPrice, merchantNet: totalPrice * 0.88, courierNet: 0, platformFee: totalPrice * 0.12 },
          createdAt: Date.now(),
          checkedIn: false,
          paymentStatus: "paid"
        };

        currentData.bookings = [newBooking, ...(currentData.bookings || [])];
        localStorage.setItem(ecosystemStoreKey, JSON.stringify(currentData));

        // Adiciona ao roteiro em Salvos
        addToItinerary({
          time: '09:00',
          spotId: selectedCombo.id,
          spotName: selectedCombo.title,
          activityTitle: 'Passaporte Combo Caraíva',
          category: 'passeios',
          tip: `Combo ativado! Código: ${passId}. Mostre o QR code nos estabelecimentos parceiros.`
        });

        trackEvent('business_booking_click', {
          businessId: selectedCombo.id,
          businessName: selectedCombo.title,
          source: 'combo_checkout',
          metadata: {
            totalPrice,
            guests: bookingGuests
          }
        });
      } catch (e) {
        console.error(e);
      }

      setIsProcessing(false);
      setCompletedPass({
        passId,
        comboTitle: selectedCombo.title,
        total: totalPrice,
        guests: bookingGuests,
        date: bookingDate,
      });
    }, 1200);
  };

  return (
    <section className="cv-experience-combos space-y-4">
      {/* Header da Seção de Combos */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ecossistema Centralizado Caraíva</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Combos &amp; Passaportes da Vila
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hospedagem, cardápios, passeios e noites unificados em um só checkout com economia de até 30%.
          </p>
        </div>
      </div>

      {/* Grid de Cards de Combos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARAIVA_COMBOS.map((combo) => {
          const savings = combo.originalPrice - combo.comboPrice;
          return (
            <div
              key={combo.id}
              className="group relative rounded-3xl bg-[#0f171d] border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Imagem do Combo com Badge */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={combo.heroImage}
                  alt={combo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f171d] via-[#0f171d]/30 to-transparent" />
                
                {/* Badge Promocional */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
                    {combo.badge}
                  </span>
                </div>

                {/* Duração */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{combo.duration}</span>
                </div>
              </div>

              {/* Informações Centrais */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {combo.subtitle}
                  </p>
                </div>

                {/* Itens Inclusos */}
                <div className="space-y-1.5 py-2 border-y border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    O que está incluso:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                    {combo.included.map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => onSelectBusiness?.(item.businessId)}
                        className="flex items-center gap-1.5 truncate cursor-pointer hover:text-amber-300 transition-colors"
                        title={`Ver ${item.businessName}`}
                      >
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{item.businessName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preço e Botão de Ação */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 line-through">
                        R$ {combo.originalPrice}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10">
                        -R$ {savings}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-amber-400">
                        R$ {combo.comboPrice}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">/ combo</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(combo)}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Ver Combo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CHECKOUT & ATIVAÇÃO DO COMBO */}
      {selectedCombo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setSelectedCombo(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] bg-[#0c141a] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-y-auto flex flex-col no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="sticky top-0 z-20 bg-[#0c141a]/95 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {selectedCombo.title}
                  </h3>
                  <span className="text-[10px] text-slate-400">Centralizado no ecossistema Caraíva Digital</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCombo(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4 sm:p-6 space-y-5">
              {completedPass ? (
                /* ESTADO DE SUCESSO: PASSAPORTE DIGITAL GERADO */
                <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                      Combo Confirmado com Sucesso
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                      Seu Passaporte Digital está Ativo!
                    </h2>
                    <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                      Apresente este QR Code ou informe o código nos estabelecimentos parceiros. Tudo já está pago e sincronizado.
                    </p>
                  </div>

                  {/* Cartão do Passaporte / Vouchers */}
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-[#121c24] to-[#090d12] border border-amber-400/40 text-left space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400">Código de Validação</span>
                        <p className="text-base font-mono font-black text-white">{completedPass.passId}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-white text-slate-950">
                        <QrCode className="w-7 h-7" />
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Vouchers Liberados no Ecossistema:
                      </span>
                      {selectedCombo.included.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <div>
                            <strong className="text-white block text-xs">{item.title}</strong>
                            <span className="text-[10px] text-amber-300 font-semibold">{item.businessName}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            Liberado · {item.voucherValue}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <span>Início da Experiência:</span>
                      <strong className="text-white">{completedPass.date}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCombo(null);
                        window.location.hash = "#salvos";
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20"
                    >
                      Ver no Meu Roteiro (Salvos)
                    </button>
                    <button
                      onClick={() => setSelectedCombo(null)}
                      className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10"
                    >
                      Continuar Navegando na Vila
                    </button>
                  </div>
                </div>
              ) : (
                /* FLUXO DE SELEÇÃO E CONFIRMAÇÃO */
                <>
                  {/* Destaques do Combo */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Itens Incluídos no Pacote Centralizado:
                    </span>
                    <div className="space-y-2">
                      {selectedCombo.included.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                            {item.category === 'hospedagem' && <Bed className="w-4 h-4" />}
                            {item.category === 'restaurante' && <Utensils className="w-4 h-4" />}
                            {item.category === 'passeio' && <Anchor className="w-4 h-4" />}
                            {item.category === 'noite' && <Music className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-white">{item.title}</h4>
                              <span className="text-[10px] text-slate-400">{item.voucherValue}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-400 block">
                              {item.businessName}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roteiro Sugerido */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">
                      Roteiro Sintético da Experiência:
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {selectedCombo.itinerarySummary.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-amber-400 font-bold text-[10px] shrink-0 pt-0.5">✦</span>
                          <p className="text-[11px] leading-relaxed">
                            <strong className="text-white">{step.period}:</strong> {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personalização: Pessoas & Data */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Número de Pessoas</span>
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 4, 6].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setBookingGuests(num)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                              bookingGuests === num
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {num} {num === 1 ? 'pes.' : 'pes.'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Data Prevista de Início</span>
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Escolha do Método de Pagamento */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">
                      Forma de Pagamento Centralizada:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'pix'
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <div className="text-left">
                          <span className="text-xs block font-bold">Pix Instantâneo</span>
                          <span className="text-[10px] text-slate-400">Ativação imediata</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cartao')}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'cartao'
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <div className="text-left">
                          <span className="text-xs block font-bold">Cartão de Crédito</span>
                          <span className="text-[10px] text-slate-400">Até 12x sem juros</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Resumo Final & CTA */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total do Pacote:</span>
                      <strong className="text-xl font-black text-amber-400">
                        R$ {(selectedCombo.comboPrice * (bookingGuests / 2 >= 1 ? bookingGuests / 2 : 1)).toFixed(2)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleConfirmComboBooking}
                      className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-400/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>Processando no Ecossistema…</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Assinar Combo Completo</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CaraivaExperienceCombos;
