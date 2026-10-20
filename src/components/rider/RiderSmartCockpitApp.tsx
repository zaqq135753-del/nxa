import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation,
  ShieldAlert,
  Radio,
  Wallet,
  Zap,
  CheckCircle2,
  MapPin,
  Phone,
  Volume2,
  Fuel,
  Wrench,
  AlertTriangle,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
  Clock,
  ThumbsUp,
  Send,
  ExternalLink,
  BellRing,
  HeartHandshake,
  Gauge,
  Flame,
  TrendingUp,
  Satellite,
  ChevronRight,
  Users,
  Building2,
} from 'lucide-react';
import { RiderTacticalMap } from './RiderTacticalMap';
import {
  CITY_PRESETS,
  INITIAL_FELLOW_RIDERS,
  INITIAL_HAZARDS,
  INITIAL_HOTSPOTS,
  INITIAL_PTT_MESSAGES,
  INITIAL_WALLET_TRANSACTIONS,
  SMART_DELIVERY_OFFERS,
  calculateDistanceMeters,
  playRiderTacticalSound,
  type CityOperationKey,
  type FellowRiderPin,
  type GeoCoord,
  type MapHazardPin,
  type MapHazardType,
  type PttVoiceMessage,
  type RouteStop,
  type SmartDeliveryOffer,
  type WalletTransaction,
} from '../../services/riderDispatchService';
import {
  getUnifiedOrders,
  subscribeToUnifiedOrders,
  updateUnifiedOrderStatus,
  type UnifiedOrder,
} from '../../services/villageUnifiedOrdersService';

type RiderTab = 'hud' | 'seguranca' | 'comunidade' | 'carteira' | 'central';

export const RiderSmartCockpitApp: React.FC = () => {
  const [city, setCity] = useState<CityOperationKey>('cmd_mg');
  const [activeTab, setActiveTab] = useState<RiderTab>('hud');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(true);
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  // Coordenada, direção e velocímetro da moto do piloto
  const [riderCoord, setRiderCoord] = useState<GeoCoord>({
    lng: -43.4282,
    lat: -19.0322,
  });
  const [riderHeading, setRiderHeading] = useState<number>(115);
  const [riderSpeedKmh, setRiderSpeedKmh] = useState<number>(0);

  // Ofertas e Rota Ativa
  const [incomingOffer, setIncomingOffer] = useState<SmartDeliveryOffer | null>(null);
  const [offerCountdown, setOfferCountdown] = useState<number>(20);
  const [activeRoute, setActiveRoute] = useState<SmartDeliveryOffer | null>(
    SMART_DELIVERY_OFFERS.cmd_mg[0]
  );
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [isSimulatingDrive, setIsSimulatingDrive] = useState<boolean>(false);
  const [geofenceAlertFired, setGeofenceAlertFired] = useState<boolean>(false);
  const [enteredCode, setEnteredCode] = useState<string>('');

  // Camada de Segurança & Comunidade
  const [hazards, setHazards] = useState<MapHazardPin[]>(INITIAL_HAZARDS);
  const [selectedHazard, setSelectedHazard] = useState<MapHazardPin | null>(null);
  const [fellowRiders, setFellowRiders] = useState<FellowRiderPin[]>(INITIAL_FELLOW_RIDERS.cmd_mg);
  const [pttMessages, setPttMessages] = useState<PttVoiceMessage[]>(INITIAL_PTT_MESSAGES);
  const [isPttTransmitting, setIsPttTransmitting] = useState<boolean>(false);
  const [customPttText, setCustomPttText] = useState<string>('');

  // Carteira Pix Instantâneo
  const [walletBalance, setWalletBalance] = useState<number>(168.50);
  const [completedDeliveriesToday, setCompletedDeliveriesToday] = useState<number>(12);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [pixPayoutSuccess, setPixPayoutSuccess] = useState<string | null>(null);

  // Pedidos reais vindos do ecossistema (Restaurantes/Lojas)
  const [ecosystemDeliveryOrders, setEcosystemDeliveryOrders] = useState<UnifiedOrder[]>([]);

  // Notificação Toast Tática
  const [toastBanner, setToastBanner] = useState<{
    title: string;
    subtitle: string;
    color: string;
  } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (title: string, subtitle: string, color = 'emerald') => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastBanner({ title, subtitle, color });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastBanner(null);
    }, 4500);
  };

  // Sincroniza pedidos de delivery do ecossistema
  useEffect(() => {
    const loadEco = () => {
      const all = getUnifiedOrders();
      setEcosystemDeliveryOrders(
        all.filter(
          (o) =>
            o.orderType === 'delivery' &&
            (o.status === 'novo' ||
              o.status === 'confirmado' ||
              o.status === 'preparando' ||
              o.status === 'em_rota')
        )
      );
    };
    loadEco();
    const unsub = subscribeToUnifiedOrders(loadEco);
    return () => unsub();
  }, []);

  // Screen WakeLock API
  useEffect(() => {
    let wakeLockObj: WakeLockSentinel | null = null;
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator && isOnline) {
          wakeLockObj = await navigator.wakeLock.request('screen');
          setWakeLockActive(true);
        }
      } catch {
        setWakeLockActive(true);
      }
    }
    void requestWakeLock();
    return () => {
      if (wakeLockObj) {
        void wakeLockObj.release();
      }
    };
  }, [isOnline]);

  // Troca de Cidade
  const handleSwitchCity = (nextCity: CityOperationKey) => {
    setCity(nextCity);
    setIsSimulatingDrive(false);
    setRiderSpeedKmh(0);
    const preset = CITY_PRESETS[nextCity];
    const defaultOffer = SMART_DELIVERY_OFFERS[nextCity][0] || null;
    setRiderCoord(defaultOffer?.routeGeometry[0] || preset.center);
    setFellowRiders(INITIAL_FELLOW_RIDERS[nextCity]);
    setActiveRoute(defaultOffer);
    setActiveStopIndex(0);
    setGeofenceAlertFired(false);
    showToast(`🛰️ Satélite Focado: ${preset.name} (${preset.state})`, preset.tagline, 'sky');
  };

  // Contagem regressiva de oferta
  useEffect(() => {
    if (!incomingOffer) return;
    if (offerCountdown <= 0) {
      setIncomingOffer(null);
      return;
    }
    const timer = window.setTimeout(() => {
      setOfferCountdown((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [incomingOffer, offerCountdown]);

  // Simulação de deslocamento da moto com telemetria de velocidade e Geofence 300m
  useEffect(() => {
    if (!isSimulatingDrive || !activeRoute) {
      setRiderSpeedKmh(0);
      return;
    }

    const currentStop = activeRoute.stops[activeStopIndex];
    if (!currentStop) {
      setIsSimulatingDrive(false);
      setRiderSpeedKmh(0);
      return;
    }

    const interval = window.setInterval(() => {
      setRiderCoord((prev) => {
        const target = currentStop.coord;
        const dLng = target.lng - prev.lng;
        const dLat = target.lat - prev.lat;
        const distMeters = calculateDistanceMeters(prev, target);

        const angleDeg = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI);
        setRiderHeading(angleDeg);
        setRiderSpeedKmh(Math.min(54, Math.max(24, Math.round(distMeters / 8))));

        if (currentStop.type === 'dropoff' && distMeters <= 300 && !geofenceAlertFired) {
          setGeofenceAlertFired(true);
          playRiderTacticalSound('geofence_ping');
          showToast(
            '📡 Geofence 300m Disparado Automaticamente!',
            `WhatsApp enviado para ${currentStop.title}: "Seu entregador está virando a esquina, vá até o portão!"`,
            'sky'
          );
        }

        if (distMeters < 25) {
          setIsSimulatingDrive(false);
          setRiderSpeedKmh(0);
          return target;
        }

        return {
          lng: prev.lng + dLng * 0.25,
          lat: prev.lat + dLat * 0.25,
        };
      });
    }, 550);

    return () => window.clearInterval(interval);
  }, [isSimulatingDrive, activeRoute, activeStopIndex, geofenceAlertFired]);

  const currentStop: RouteStop | undefined = useMemo(() => {
    if (!activeRoute) return undefined;
    return activeRoute.stops[activeStopIndex];
  }, [activeRoute, activeStopIndex]);

  const distanceToCurrentStopMeters = useMemo(() => {
    if (!currentStop) return 0;
    return calculateDistanceMeters(riderCoord, currentStop.coord);
  }, [riderCoord, currentStop]);

  const cityHazards = useMemo(() => hazards.filter((h) => h.city === city), [hazards, city]);

  // Disparar Nova Oferta Inteligente com Sirene
  const handleTriggerSmartOffer = () => {
    const offers = SMART_DELIVERY_OFFERS[city];
    const nextOffer = activeRoute?.id === offers[0]?.id && offers[1] ? offers[1] : offers[0];
    if (!nextOffer) return;

    const freshOffer: SmartDeliveryOffer = {
      ...nextOffer,
      stops: nextOffer.stops.map((s) => ({ ...s, completed: false })),
    };

    playRiderTacticalSound('offer_siren');
    setOfferCountdown(20);
    setIncomingOffer(freshOffer);
  };

  const handleAcceptOffer = () => {
    if (!incomingOffer) return;
    playRiderTacticalSound('ptt_beep');
    setActiveRoute(incomingOffer);
    setActiveStopIndex(0);
    setRiderCoord(incomingOffer.routeGeometry[0] || CITY_PRESETS[city].center);
    setGeofenceAlertFired(false);
    setIncomingOffer(null);
    setActiveTab('hud');
    showToast(
      '🚀 Rota Inteligente Sincronizada no HUD!',
      `${incomingOffer.stops.length} paradas otimizadas • Ganho 100% seu: R$ ${incomingOffer.totalEarnings.toFixed(2)}`,
      'emerald'
    );
  };

  const handleCompleteCurrentStop = () => {
    if (!activeRoute || !currentStop) return;

    const updatedStops = activeRoute.stops.map((st, idx) =>
      idx === activeStopIndex ? { ...st, completed: true } : st
    );

    const isLastStop = activeStopIndex >= activeRoute.stops.length - 1;

    if (!isLastStop) {
      const nextIdx = activeStopIndex + 1;
      const nextStop = activeRoute.stops[nextIdx];
      setActiveRoute({ ...activeRoute, stops: updatedStops });
      setActiveStopIndex(nextIdx);
      setRiderCoord(currentStop.coord);
      setGeofenceAlertFired(false);
      setEnteredCode('');
      playRiderTacticalSound('ptt_beep');
      showToast(
        `✅ Parada #${currentStop.sequence} Concluída!`,
        `Rota atualizada para: ${nextStop.title} (${nextStop.neighborhood})`,
        'emerald'
      );
    } else {
      playRiderTacticalSound('cash_register');
      const earned = activeRoute.totalEarnings;
      setWalletBalance((prev) => prev + earned);
      setCompletedDeliveriesToday((prev) => prev + (activeRoute.isBatched ? 2 : 1));

      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        title: activeRoute.title,
        subtitle: `100% Frete (R$ ${activeRoute.baseDeliveryFee.toFixed(2)}) + Gorjeta (R$ ${activeRoute.customerTip.toFixed(2)})`,
        amount: earned,
        type: 'earning',
        timestamp: 'Agora mesmo',
      };
      setTransactions((prev) => [newTx, ...prev]);
      setRiderCoord(currentStop.coord);
      setActiveRoute(null);
      setActiveStopIndex(0);
      setIsSimulatingDrive(false);
      setEnteredCode('');

      showToast(
        `💰 +R$ ${earned.toFixed(2)} adicionados ao saldo demonstrativo.`,
        '100% do frete e gorjeta no seu bolso. Zero retenção abusiva.',
        'emerald'
      );
    }
  };

  const handleClaimEcosystemOrder = (order: UnifiedOrder) => {
    playRiderTacticalSound('ptt_beep');
    updateUnifiedOrderStatus(order.id, 'em_rota');

    const preset = CITY_PRESETS[city];
    const customOffer: SmartDeliveryOffer = {
      id: `eco-${order.id}`,
      city,
      isBatched: false,
      title: `Entrega Expressa ${order.orderNumber} (${order.businessName})`,
      totalEarnings: 16.0,
      baseDeliveryFee: 12.0,
      customerTip: 4.0,
      hillOrWeatherBonus: 0,
      ifoodComparisonEarned: 8.5,
      totalDistanceKm: 1.5,
      estimatedMinutes: 9,
      terrainNote: 'Rota sincronizada com KDS do restaurante',
      kitchenSyncNote: 'Cliente notificado em tempo real no app',
      stops: [
        {
          id: `stop-pick-${order.id}`,
          type: 'pickup',
          sequence: 1,
          title: order.businessName,
          subtitle: `Retirar ${order.orderNumber} (${order.items.length} itens)`,
          address: 'Balcão de Despacho Express',
          neighborhood: 'Centro',
          coord: { lng: preset.center.lng - 0.002, lat: preset.center.lat + 0.0015 },
          completed: true,
          orderNumber: order.orderNumber,
          maneuverInstruction: 'Coleta validada no balcão',
        },
        {
          id: `stop-drop-${order.id}`,
          type: 'dropoff',
          sequence: 2,
          title: `Cliente: ${order.customer.name}`,
          subtitle: order.destination?.detail || 'Entregar na portaria principal',
          address: order.destination?.label || 'Endereço do Cliente',
          neighborhood: 'Destino',
          coord: { lng: preset.center.lng + 0.0035, lat: preset.center.lat - 0.0025 },
          completed: false,
          validationCode: '108',
          customerPhone: order.customer.whatsappFormatted,
          orderNumber: order.orderNumber,
          maneuverInstruction: `Siga pela via principal até ${order.destination?.label || 'o cliente'}`,
        },
      ],
      routeGeometry: [
        { lng: preset.center.lng - 0.002, lat: preset.center.lat + 0.0015 },
        preset.center,
        { lng: preset.center.lng + 0.0035, lat: preset.center.lat - 0.0025 },
      ],
    };

    setActiveRoute(customOffer);
    setActiveStopIndex(1);
    setActiveTab('hud');
    showToast(
      `📦 Pedido ${order.orderNumber} Assumido!`,
      `O cliente ${order.customer.name} já acompanha sua moto ao vivo!`,
      'emerald'
    );
  };

  const handleReportHazard = (type: MapHazardType, label: string, desc: string) => {
    playRiderTacticalSound('ptt_beep');
    const offsetLng = (Math.random() - 0.5) * 0.004;
    const offsetLat = (Math.random() - 0.5) * 0.004;
    const newPin: MapHazardPin = {
      id: `haz-${Date.now()}`,
      city,
      type,
      title: label,
      description: desc,
      reportedBy: 'Você (Piloto #01)',
      reportedAt: 'Agora mesmo',
      upvotes: 1,
      coord: {
        lng: riderCoord.lng + offsetLng,
        lat: riderCoord.lat + offsetLat,
      },
    };
    setHazards((prev) => [newPin, ...prev]);
    setSelectedHazard(newPin);
    showToast(
      `📍 Alerta Cravado no Waze da Tropa!`,
      `"${label}" já aparece no mapa 3D de todos os pilotos conectados.`,
      'amber'
    );
  };

  const handleToggleSos = () => {
    const next = !isSosActive;
    setIsSosActive(next);
    if (next) {
      playRiderTacticalSound('sos_alarm');
      showToast(
        '🚨 ALERTA SOS DISPARADO PARA AS 2 REDES!',
        'Sua posição GPS ao vivo foi enviada para os pilotos a menos de 2km e para a Central.',
        'red'
      );
    } else {
      showToast('✅ Sinalizador SOS Desativado', 'Tropa notificada que você está seguro.', 'emerald');
    }
  };

  const handleTransmitPtt = (presetMessage?: string) => {
    const textToSend =
      presetMessage ||
      customPttText.trim() ||
      'QAP Tropa! Pista livre na Av. JK, zero fila de espera nos lanches!';
    playRiderTacticalSound('ptt_beep');
    setIsPttTransmitting(true);

    window.setTimeout(() => {
      setIsPttTransmitting(false);
      const msg: PttVoiceMessage = {
        id: `ptt-${Date.now()}`,
        senderName: 'Você (Piloto #01)',
        senderNetwork: city === 'cmd_mg' ? 'Rede Central Moto #01' : 'Frota Caraíva VIP',
        timestamp: 'Agora mesmo',
        durationSec: 4,
        transcript: textToSend,
      };
      setPttMessages((prev) => [msg, ...prev]);
      setCustomPttText('');
      showToast('📻 Câmbio PTT Transmitido na Frequência!', textToSend, 'emerald');
    }, 850);
  };

  const handleInstantPixPayout = () => {
    setPixPayoutSuccess('Demonstração: não há saldo financeiro ou transferência Pix nesta experiência.');
    showToast('Simulação de carteira', 'Nenhum valor foi transferido.', 'emerald');
  };

  const openExternalNavigation = (_app: 'waze' | 'gmaps', _coord: GeoCoord) => {
    showToast('Navegação demonstrativa', 'Use o mapa desta experiência. Nenhum aplicativo externo será aberto.', 'emerald');
  };

  return (
    <div className="relative w-screen h-screen bg-[#05080C] text-slate-100 overflow-hidden select-none font-sans">
      {/* =====================================================================
          CAMADA 0: MAPA VETORIAL 3D EM 100% DA TELA (ZERO PAREDE BLOQUEANDO)
      ===================================================================== */}
      <div className="absolute inset-0 z-0">
        <RiderTacticalMap
          city={city}
          riderCoord={riderCoord}
          riderHeading={riderHeading}
          isOnline={isOnline}
          isSosActive={isSosActive}
          routeGeometry={activeRoute ? activeRoute.routeGeometry : []}
          stops={activeRoute ? activeRoute.stops : []}
          activeStopId={currentStop?.id}
          hazards={cityHazards}
          fellowRiders={fellowRiders}
          hotspots={INITIAL_HOTSPOTS}
          showHotspots={showHotspots}
          showGeofenceCircle={currentStop?.type === 'dropoff'}
          geofenceTargetCoord={currentStop?.coord}
          onSelectHazard={(haz) => {
            setSelectedHazard(haz);
            setActiveTab('seguranca');
          }}
          onSelectStop={(idx) => {
            setActiveStopIndex(idx);
            if (activeRoute?.stops[idx]) {
              setRiderCoord(activeRoute.stops[idx].coord);
            }
          }}
        />
      </div>

      {/* =====================================================================
          CAMADA 1: TOP SPATIAL HUD BAR (FLUTUANTE E TRANSPARENTE)
      ===================================================================== */}
      <header className="absolute top-3 inset-x-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Esquerda: Voltar + Seletor de Cidade + Satélite */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#080C12]/88 backdrop-blur-2xl border border-white/12 p-1.5 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
          <Link
            to="/business"
            title="Voltar ao Painel B2B"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => handleSwitchCity('cmd_mg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              city === 'cmd_mg'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏍️ Conceição do Mato Dentro (MG)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchCity('caraiva_ba')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              city === 'caraiva_ba'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌴 Caraíva (BA)</span>
          </button>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-300">
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            <span>GPS 3D • {wakeLockActive ? 'Tela Acesa ON' : 'Standby'}</span>
          </div>
        </div>

        {/* Centro: Banner Turn-by-Turn HUD (Estilo Tesla FSD / Waze Pro) */}
        {activeRoute && currentStop && (
          <div className="hidden lg:flex items-center gap-3 pointer-events-auto bg-[#070B10]/92 backdrop-blur-2xl border border-emerald-400/40 px-4 py-2 rounded-2xl shadow-[0_14px_35px_rgba(0,0,0,0.75),0_0_20px_rgba(16,185,129,0.18)] max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex flex-col items-center justify-center shrink-0 text-emerald-300">
              <Navigation className="w-4 h-4" />
              <span className="text-[9px] font-black">{distanceToCurrentStopMeters}m</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  PRÓXIMA MANOBRA • PARADA #{currentStop.sequence}
                </span>
                {currentStop.streetGrade && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-amber-400/25">
                    {currentStop.streetGrade}
                  </span>
                )}
              </div>
              <p className="text-xs font-extrabold text-white truncate">
                {currentStop.maneuverInstruction || `Siga até ${currentStop.address}`}
              </p>
            </div>
          </div>
        )}

        {/* Direita: Velocímetro + WakeLock + Carteira Pix + Status + SOS */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#080C12]/88 backdrop-blur-2xl border border-white/12 p-1.5 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
          {/* Velocímetro Digital */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <strong className="font-black text-white">{riderSpeedKmh}</strong>
            <span className="text-[10px] text-slate-400 font-bold">km/h</span>
          </div>

          {/* Botão Zonas de Calor */}
          <button
            type="button"
            onClick={() => setShowHotspots((prev) => !prev)}
            title="Alternar Zonas de Alta Demanda no Mapa"
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              showHotspots
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Demanda</span>
          </button>

          {/* Saldo Pix Instantâneo */}
          <button
            type="button"
            onClick={() => setActiveTab('carteira')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs transition-all"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>R$ {walletBalance.toFixed(2)}</span>
          </button>

          {/* Botão Online / Offline */}
          <button
            type="button"
            onClick={() => {
              setIsOnline((prev) => !prev);
              playRiderTacticalSound('ptt_beep');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs border transition-all flex items-center gap-1.5 ${
              isOnline
                ? 'bg-[#00F5A0] text-slate-950 border-emerald-300 shadow-[0_0_18px_rgba(0,245,160,0.45)]'
                : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-slate-950 animate-ping' : 'bg-slate-500'
              }`}
            />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>

          {/* SOS */}
          <button
            type="button"
            onClick={handleToggleSos}
            className={`px-3 py-1.5 rounded-xl font-black text-xs border transition-all flex items-center gap-1 ${
              isSosActive
                ? 'bg-red-600 text-white border-red-300 animate-bounce shadow-[0_0_25px_rgba(239,68,68,0.9)]'
                : 'bg-red-500/15 hover:bg-red-500/30 text-red-300 border-red-500/35'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSosActive ? 'SOS ATIVO' : 'SOS'}</span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          TOAST TÁTICO DE NOTIFICAÇÃO
      ===================================================================== */}
      {toastBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-none">
          <div
            className={`p-3.5 rounded-2xl backdrop-blur-2xl border shadow-2xl flex items-start gap-3 ${
              toastBanner.color === 'red'
                ? 'bg-red-950/95 border-red-500 text-red-100'
                : toastBanner.color === 'sky'
                ? 'bg-sky-950/95 border-sky-400 text-sky-100'
                : toastBanner.color === 'amber'
                ? 'bg-amber-950/95 border-amber-400 text-amber-100'
                : 'bg-emerald-950/95 border-emerald-400 text-emerald-100'
            }`}
          >
            <BellRing className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <strong className="text-xs font-black block">{toastBanner.title}</strong>
              <p className="text-[11px] opacity-95 mt-0.5 leading-snug">{toastBanner.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CAMADA 2: PAINEL ESPACIAL FLUTUANTE ESQUERDO (TESLA FSD / VISION OS)
          Não bloqueia o mapa! Fica na lateral esquerda no desktop e compacto no mobile.
      ===================================================================== */}
      <aside className="absolute left-3 top-20 bottom-20 z-20 w-[calc(100vw-24px)] sm:w-[395px] flex flex-col justify-end sm:justify-start pointer-events-none">
        <div className="max-h-full overflow-y-auto pointer-events-auto rounded-3xl bg-[#080C12]/88 backdrop-blur-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-4 space-y-3.5">
          {/* ---------------- VISÃO 1: COCKPIT & ROTAS INTELIGENTES ---------------- */}
          {activeTab === 'hud' && (
            <>
              {/* Mini Telemetria de Ganhos Reais vs iFood */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                  <span className="text-[10px] text-emerald-300 font-bold block">Média/Hora</span>
                  <strong className="text-sm font-black text-white flex items-center gap-1">
                    R$ 48,50
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </strong>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-slate-400 font-bold block">Repasse Frete</span>
                  <strong className="text-sm font-black text-[#00F5A0]">100% Seu</strong>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/25">
                  <span className="text-[10px] text-amber-300 font-bold block">Espera Balcão</span>
                  <strong className="text-sm font-black text-white">0 min (KDS)</strong>
                </div>
              </div>

              {/* Botões de Ação de Simulação Tática */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleTriggerSmartOffer}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500/25 to-orange-500/20 hover:from-amber-500/35 hover:to-orange-500/30 border border-amber-400/50 text-amber-200 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Nova Chamada</span>
                </button>

                {activeRoute && (
                  <button
                    type="button"
                    onClick={() => setIsSimulatingDrive((prev) => !prev)}
                    className={`py-2.5 px-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition-all shadow-lg ${
                      isSimulatingDrive
                        ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                        : 'bg-sky-500/20 text-sky-200 border-sky-400/45 hover:bg-sky-500/30'
                    }`}
                  >
                    {isSimulatingDrive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pausar Piloto</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Simular Moto GPS</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Card Principal da Missão / Rota Inteligente */}
              {activeRoute && currentStop ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/15 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          currentStop.type === 'pickup'
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                            : 'bg-sky-500/25 text-sky-300 border border-sky-400/40'
                        }`}
                      >
                        Parada {currentStop.sequence}/{activeRoute.stops.length} •{' '}
                        {currentStop.type === 'pickup' ? 'COLETA EXPRESSA' : 'ENTREGA CLIENTE'}
                      </span>
                      <span className="text-xs font-black text-[#00F5A0]">
                        +R$ {activeRoute.totalEarnings.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-base font-black text-white leading-tight">
                        {currentStop.title}
                      </h2>
                      <p className="text-xs text-slate-300 mt-0.5">{currentStop.address}</p>
                      <p className="text-[11px] text-amber-300 font-semibold mt-1">
                        {currentStop.subtitle}
                      </p>
                    </div>

                    {/* Atalhos Rápidos Waze / Maps / WhatsApp Portão */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => openExternalNavigation('waze', currentStop.coord)}
                        className="py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/35 text-sky-200 font-extrabold text-[11px] flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Waze</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openExternalNavigation('gmaps', currentStop.coord)}
                        className="py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-[11px] flex items-center justify-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>Maps</span>
                      </button>
                      {currentStop.customerPhone ? (
                        <button type="button" onClick={() => showToast('Contato interno em preparação', 'Esta demonstração não envia mensagens ao cliente.', 'emerald')} className="py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                          <Phone className="w-3 h-3" /><span>Contato no app</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              '⚡ KDS Restaurante Sincronizado',
                              'A cozinha confirmou que o pedido já está embalado no balcão express!',
                              'emerald'
                            )
                          }
                          className="py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Pronto</span>
                        </button>
                      )}
                    </div>

                    {/* Validação de 3 dígitos se for entrega */}
                    {currentStop.type === 'dropoff' && currentStop.validationCode && (
                      <div className="flex items-center justify-between bg-black/45 px-3 py-2 rounded-xl border border-white/10">
                        <span className="text-[11px] text-slate-300">
                          Código Portão:{' '}
                          <strong className="text-[#00F5A0] font-black">
                            {currentStop.validationCode}
                          </strong>
                        </span>
                        <input
                          type="text"
                          maxLength={3}
                          value={enteredCode}
                          onChange={(e) => setEnteredCode(e.target.value)}
                          placeholder={currentStop.validationCode}
                          className="w-16 px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-center font-black text-xs text-white"
                        />
                      </div>
                    )}

                    {/* Botão Principal de Avanço */}
                    <button
                      type="button"
                      onClick={handleCompleteCurrentStop}
                      className="w-full py-3 px-4 rounded-2xl bg-[#00F5A0] hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(0,245,160,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        {currentStop.type === 'pickup'
                          ? `CONFIRMAR COLETA #${currentStop.sequence} (LACRADO)`
                          : activeStopIndex === activeRoute.stops.length - 1
                          ? `CONCLUIR ROTA & RECEBER R$ ${activeRoute.totalEarnings.toFixed(2)} NO PIX`
                          : `CONFIRMAR ENTREGA #${currentStop.sequence} ➔ PRÓXIMA`}
                      </span>
                    </button>
                  </div>

                  {/* Timeline Vertical Compacta de Paradas */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                      <span>SEQUÊNCIA INTELIGENTE ({activeRoute.totalDistanceKm} km)</span>
                      <span className="text-emerald-400">
                        iFood pagaria só R$ {activeRoute.ifoodComparisonEarned.toFixed(2)}
                      </span>
                    </div>
                    {activeRoute.stops.map((st, idx) => {
                      const isCurrent = idx === activeStopIndex;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setActiveStopIndex(idx);
                            setRiderCoord(st.coord);
                          }}
                          className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                            st.completed
                              ? 'bg-emerald-950/25 border-emerald-500/25 text-emerald-300/75'
                              : isCurrent
                              ? 'bg-white/12 border-[#00F5A0] text-white shadow-lg'
                              : 'bg-white/[0.02] border-white/8 text-slate-400 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                                st.completed
                                  ? 'bg-emerald-500/30 text-emerald-300'
                                  : isCurrent
                                  ? 'bg-[#00F5A0] text-slate-950'
                                  : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              {st.completed ? '✓' : st.sequence}
                            </span>
                            <div className="min-w-0">
                              <strong className="text-xs font-extrabold block truncate">
                                {st.title}
                              </strong>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {st.neighborhood} • {st.address}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="text-sm font-black text-white block">
                      Radar Ativo em {CITY_PRESETS[city].name}
                    </strong>
                    <p className="text-xs text-slate-400 mt-1">
                      Pronto para receber rotas duplas otimizadas com 100% do frete no Pix.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerSmartOffer}
                    className="w-full py-3 rounded-2xl bg-[#00F5A0] text-slate-950 font-black text-xs"
                  >
                    ⚡ Puxar Próxima Rota Inteligente
                  </button>
                </div>
              )}

              {/* Pedidos ao Vivo Vindos dos Restaurantes do Ecossistema */}
              {ecosystemDeliveryOrders.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                    🔗 Fila Express dos Restaurantes ({ecosystemDeliveryOrders.length})
                  </span>
                  {ecosystemDeliveryOrders.slice(0, 2).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-2 rounded-xl bg-black/45 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <strong className="text-xs font-bold text-white block truncate">
                          {ord.orderNumber} • {ord.businessName}
                        </strong>
                        <span className="text-[10px] text-slate-300 block truncate">
                          Cliente: {ord.customer.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClaimEcosystemOrder(ord)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] shrink-0"
                      >
                        Pegar (R$ 16)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ---------------- VISÃO 2: SEGURANÇA & WAZE DOS MOTOBOYS ---------------- */}
          {activeTab === 'seguranca' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  PROTEÇÃO COLABORATIVA DA TROPA
                </span>
                <h2 className="text-base font-black text-white">
                  Waze dos Motoboys & Botão SOS
                </h2>
                <p className="text-xs text-slate-400">
                  Marque perigos na pista com 1 toque (mesmo de luva) e alerte toda a rede.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleSos}
                className={`w-full py-3 rounded-2xl font-black text-xs border transition-all flex items-center justify-center gap-2 ${
                  isSosActive
                    ? 'bg-red-600 text-white border-red-300 animate-pulse'
                    : 'bg-red-500/20 text-red-200 border-red-500/45 hover:bg-red-500/30'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {isSosActive
                    ? 'DESATIVAR ALERTA SOS'
                    : 'DISPARAR SOS PARA MOTOS A MENOS DE 2KM'}
                </span>
              </button>

              {/* Grid Tátil de Reporte no Mapa */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleReportHazard(
                      'pothole',
                      'Buraco / Brita na Curva',
                      'Cuidado ao frear neste trecho.'
                    )
                  }
                  className="p-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-left"
                >
                  <span className="text-lg">🕳️</span>
                  <strong className="text-xs font-black text-amber-200 block mt-0.5">
                    Buraco / Brita
                  </strong>
                  <span className="text-[10px] text-slate-400">Cravar no GPS</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleReportHazard(
                      'dog',
                      'Cachorro Bravo Solto',
                      'Atenção redobrada ao passar na rua.'
                    )
                  }
                  className="p-2.5 rounded-2xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-400/40 text-left"
                >
                  <span className="text-lg">🐕</span>
                  <strong className="text-xs font-black text-orange-200 block mt-0.5">
                    Cachorro Solto
                  </strong>
                  <span className="text-[10px] text-slate-400">Avisar colegas</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleReportHazard(
                      'dark_street',
                      'Rua Escura / Sem Luz',
                      'Poste apagado, acione o portão 300m antes.'
                    )
                  }
                  className="p-2.5 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-left"
                >
                  <span className="text-lg">🌑</span>
                  <strong className="text-xs font-black text-purple-200 block mt-0.5">
                    Rua Escura
                  </strong>
                  <span className="text-[10px] text-slate-400">Alerta noturno</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleReportHazard(
                      'support_hub',
                      'Ponto de Apoio Liberado',
                      'Água gelada, café e tomada 220V para a tropa.'
                    )
                  }
                  className="p-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-left"
                >
                  <span className="text-lg">☕</span>
                  <strong className="text-xs font-black text-emerald-200 block mt-0.5">
                    Ponto de Apoio
                  </strong>
                  <span className="text-[10px] text-slate-400">Água & Tomada</span>
                </button>
              </div>

              {/* Lista Interativa de Alertas (Clica e voa no Mapa) */}
              <div className="space-y-2 pt-1">
                {cityHazards.map((haz) => (
                  <div
                    key={haz.id}
                    onClick={() => {
                      setSelectedHazard(haz);
                      setRiderCoord(haz.coord);
                    }}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      selectedHazard?.id === haz.id
                        ? 'bg-white/12 border-amber-400'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <strong className="text-xs font-bold text-white">{haz.title}</strong>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{haz.description}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {haz.reportedBy} • {haz.reportedAt}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHazards((prev) =>
                          prev.map((item) =>
                            item.id === haz.id ? { ...item, upvotes: item.upvotes + 1 } : item
                          )
                        );
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-emerald-300 flex items-center gap-1 shrink-0"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{haz.upvotes}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- VISÃO 3: QG DA TROPA & RÁDIO PTT ---------------- */}
          {activeTab === 'comunidade' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                  COMUNIDADE INTERATIVA ENTRE ENTREGADORES
                </span>
                <h2 className="text-base font-black text-white">
                  Rádio Walkie-Talkie PTT & Tropa
                </h2>
              </div>

              <button
                type="button"
                onClick={() => handleTransmitPtt()}
                className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isPttTransmitting
                    ? 'bg-red-500 text-white animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.7)]'
                    : 'bg-[#00F5A0] hover:bg-emerald-300 text-slate-950'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isPttTransmitting
                    ? 'TRANSMITINDO ÁUDIO NA REDE...'
                    : '🎙️ APERTE P/ FALAR NO RÁDIO DA TROPA'}
                </span>
              </button>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customPttText}
                  onChange={(e) => setCustomPttText(e.target.value)}
                  placeholder="Mandar câmbio rápido pra tropa..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleTransmitPtt()}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/15"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 block">
                  📻 Últimos Áudios na Frequência
                </span>
                {pttMessages.slice(0, 3).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-300 font-bold">{msg.senderName}</strong>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-snug">“{msg.transcript}”</p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 block">
                  🛵 Colegas Online Agora (Toque p/ Focar no Mapa)
                </span>
                {fellowRiders.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setRiderCoord(f.coord)}
                    className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-white font-bold block">
                        {f.nickname} ({f.name})
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {f.network} • {f.bikeModel}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        f.status === 'livre'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {f.status === 'livre' ? 'Livre' : `${f.speedKmh} km/h`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- VISÃO 4: CARTEIRA PIX & CLUBE DO MOTOBOY ---------------- */}
          {activeTab === 'carteira' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-400/40 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300">
                  LIQUIDEZ DIÁRIA • ZERO RETENÇÃO
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-3xl font-black text-white">
                    R$ {walletBalance.toFixed(2)}
                  </strong>
                  <span className="text-xs font-bold text-emerald-300">
                    {completedDeliveriesToday} entregas hoje
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  100% da taxa de entrega e 100% da gorjeta vão direto para você.
                </p>
                <button
                  type="button"
                  onClick={handleInstantPixPayout}
                  disabled={walletBalance <= 0}
                  className="w-full py-3 rounded-xl bg-[#00F5A0] hover:bg-emerald-300 disabled:opacity-40 text-slate-950 font-black text-xs shadow-lg transition-all"
                >
                  ⚡ VER CARTEIRA DEMONSTRATIVA
                </button>
                {pixPayoutSuccess && (
                  <p className="text-[11px] text-emerald-300 font-bold pt-1">{pixPayoutSuccess}</p>
                )}
              </div>

              {/* Benefícios Reais do Clube */}
              <div className="grid grid-cols-1 gap-2">
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                  <Fuel className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-xs font-black text-white block">
                      Gasolina com -R$ 0,25/L no Posto Parceiro
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      Basta apresentar o QR Code de Piloto Ativo da Semana.
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <strong className="text-xs font-black text-white block">
                      Oficina & Óleo a Preço de Custo
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      Desconto em pneu, relação e socorro gratuito na cidade.
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                  <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-xs font-black text-white block">
                      Fundo Solidário de Pneu Furado & Chuva
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      Apoio imediato para não perder o dia de trabalho.
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/40 border border-white/5"
                  >
                    <div className="min-w-0">
                      <strong className="text-white font-bold block truncate">{tx.title}</strong>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {tx.subtitle}
                      </span>
                    </div>
                    <span
                      className={`font-black shrink-0 ml-2 ${
                        tx.amount >= 0 ? 'text-[#00F5A0]' : 'text-sky-300'
                      }`}
                    >
                      {tx.amount >= 0
                        ? `+R$ ${tx.amount.toFixed(2)}`
                        : `R$ ${tx.amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- VISÃO 5: CENTRAL DAS 2 REDES DE MOTOTÁXI (TORRE B2B) ---------------- */}
          {activeTab === 'central' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  TORRE DE DESPACHO AUTOMÁTICO • {CITY_PRESETS[city].name.toUpperCase()}
                </span>
                <h2 className="text-base font-black text-white">
                  Central Integrada das 2 Redes de Mototáxi
                </h2>
                <p className="text-xs text-slate-400">
                  Substitui as ligações ocupadas por despacho GPS em 2 segundos para a moto mais próxima.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 font-bold block">
                    Rede Central #01
                  </span>
                  <strong className="text-base font-black text-white">18 Motos Online</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Tempo médio coleta: 3.2 min
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30">
                  <span className="text-[10px] text-amber-300 font-bold block">
                    Rede Estrada Real #02
                  </span>
                  <strong className="text-base font-black text-white">14 Motos Online</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Tempo médio coleta: 3.8 min
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-black text-white">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Modelo de Monetização & Geração de Empregos</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  • <strong>Motoboy fica com 100% do frete</strong> (R$ 8 a R$ 15/corrida) + Plantão Fixo Garantido.<br />
                  • <strong>Comércio paga R$ 97 a R$ 147/mês</strong> pelo Despachante Automático 1-Clique.<br />
                  • <strong>Taxa Tecnológica de R$ 1,00/corrida</strong> embutida no pedido — gerando receita recorrente limpa para o app sem explorar o entregador!
                </p>
              </div>

              <button
                type="button"
                onClick={handleTriggerSmartOffer}
                className="w-full py-3 rounded-2xl bg-[#00F5A0] text-slate-950 font-black text-xs shadow-lg"
              >
                ⚡ Disparar Corrida da Central p/ Motoboy Mais Próximo
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* =====================================================================
          MODAL HOLOGRÁFICO DE NOVA CORRIDA INTELIGENTE (RAIO-X TRANSPARENTE)
      ===================================================================== */}
      {incomingOffer && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#090E15] border-2 border-[#00F5A0] shadow-[0_0_60px_rgba(0,245,160,0.35)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[#00F5A0] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {incomingOffer.isBatched ? 'Rota Dupla Otimizada (Batch)' : 'Entrega Expressa'}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
                ⏱️ {offerCountdown}s
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                Valor ilustrativo da rota:
              </span>
              <div className="flex items-baseline gap-3 mt-0.5">
                <strong className="text-4xl font-black text-[#00F5A0]">
                  R$ {incomingOffer.totalEarnings.toFixed(2)}
                </strong>
                <span className="text-xs text-slate-300 font-bold">
                  ({incomingOffer.totalDistanceKm} km • ~{incomingOffer.estimatedMinutes} min)
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-bold mt-1">
                🔥 Você ganha +R${' '}
                {(incomingOffer.totalEarnings - incomingOffer.ifoodComparisonEarned).toFixed(2)} a
                mais que no iFood nesta rota!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{incomingOffer.kitchenSyncNote}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Navigation className="w-4 h-4 shrink-0" />
                <span>{incomingOffer.terrainNote}</span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {incomingOffer.stops.map((st) => (
                <div
                  key={st.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-black text-[11px] shrink-0">
                    {st.sequence}
                  </span>
                  <div>
                    <strong className="text-white block">{st.title}</strong>
                    <span className="text-slate-400 text-[11px]">{st.address}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIncomingOffer(null)}
                className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs"
              >
                Recusar (Livre)
              </button>
              <button
                type="button"
                onClick={handleAcceptOffer}
                className="col-span-2 py-3 rounded-2xl bg-[#00F5A0] hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(0,245,160,0.5)] transition-all"
              >
                ⚡ ACEITAR ROTA (R$ {incomingOffer.totalEarnings.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CAMADA 3: DOCA ESPACIAL FLUTUANTE INFERIOR (APPLE VISION OS STYLE)
      ===================================================================== */}
      <nav className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-3xl bg-[#080C12]/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <button
            type="button"
            onClick={() => setActiveTab('hud')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-extrabold transition-all ${
              activeTab === 'hud'
                ? 'bg-[#00F5A0] text-slate-950 shadow-[0_0_20px_rgba(0,245,160,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Cockpit & Rota</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seguranca')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-extrabold transition-all ${
              activeTab === 'seguranca'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Waze & SOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comunidade')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-extrabold transition-all ${
              activeTab === 'comunidade'
                ? 'bg-sky-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>QG & Rádio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('carteira')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-extrabold transition-all ${
              activeTab === 'carteira'
                ? 'bg-[#00F5A0] text-slate-950 shadow-[0_0_20px_rgba(0,245,160,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Pix & Clube</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('central')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-extrabold transition-all ${
              activeTab === 'central'
                ? 'bg-purple-400 text-slate-950 shadow-[0_0_20px_rgba(192,132,252,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Central 2 Redes</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
