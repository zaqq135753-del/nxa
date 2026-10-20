import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  X,
  Footprints,
  MapPin,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  WifiOff,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  Sparkles,
  ShieldCheck,
  Eye,
  UserCheck,
  Navigation,
  ExternalLink,
  LocateFixed,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { type Business } from "../../data/caraivaDigitalData";
import {
  CARAIVA_KEY_ORIGINS,
  calculateVillageWalkingRoute,
  type VillageRoute,
  type RouteLandmark,
  type ManeuverType,
} from "../../services/maps/caraivaRoutingService";
import { calculateHaversineDistanceMeters, formatDistance } from "../../services/maps/geolocation";
import { type LatLngLiteral, CARAIVA_CENTER_COORDS } from "../../services/maps/types";

interface CaraivaWalkingRouteModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePovCamera?: (camera: {
    coords: LatLngLiteral;
    bearing: number;
    pitch: number;
    zoom: number;
    mode?: "first_person" | "third_person";
    isWalking?: boolean;
  }) => void;
  onClearPovRoute?: () => void;
  onSetRoutePath?: (coords: LatLngLiteral[]) => void;
}

export const CaraivaWalkingRouteModal: React.FC<CaraivaWalkingRouteModalProps> = ({
  business,
  isOpen,
  onClose,
  onUpdatePovCamera,
  onClearPovRoute,
  onSetRoutePath,
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<RouteLandmark>(CARAIVA_KEY_ORIGINS[0]);
  const [route, setRoute] = useState<VillageRoute | null>(null);
  const [isPovMode, setIsPovMode] = useState<boolean>(false);
  const [povPerspective, setPovPerspective] = useState<"first_person" | "third_person">("third_person");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAutoWalk, setIsPlayingAutoWalk] = useState<boolean>(false);
  const [showAiSenseDetails, setShowAiSenseDetails] = useState<boolean>(false);

  // Estados de Geolocalização Real (GPS do Usuário)
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [userGpsCoords, setUserGpsCoords] = useState<LatLngLiteral | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "locating" | "acquired" | "denied" | "error">("idle");
  const [isUserInCaraiva, setIsUserInCaraiva] = useState<boolean>(false);
  const [remoteDistanceKm, setRemoteDistanceKm] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Função para requisitar localização GPS real do navegador
  const requestUserRealGps = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsStatus("error");
      return;
    }

    setIsLocatingGps(true);
    setGpsStatus("locating");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngLiteral = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const accuracy = pos.coords.accuracy;
        const distMeters = calculateHaversineDistanceMeters(coords, CARAIVA_CENTER_COORDS);
        const distKm = Math.round(distMeters / 1000);
        const inCaraiva = distMeters <= 25000; // Raio de 25km da vila de Caraíva

        setUserGpsCoords(coords);
        setGpsAccuracy(accuracy);
        setIsUserInCaraiva(inCaraiva);
        setRemoteDistanceKm(distKm);
        setGpsStatus("acquired");
        setIsLocatingGps(false);

        // Se o usuário está fisicamente em Caraíva, define a origem automaticamente como seu GPS real!
        if (inCaraiva) {
          const liveGpsOrigin: RouteLandmark = {
            id: "user-gps",
            name: "Sua Localização Atual (GPS)",
            coords,
            description: `GPS em tempo real (precisão ~${Math.round(accuracy)}m)`,
            icon: "📍",
          };
          setSelectedOrigin(liveGpsOrigin);
        }
      },
      (err) => {
        setIsLocatingGps(false);
        if (err.code === 1) {
          setGpsStatus("denied");
        } else {
          setGpsStatus("error");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
      }
    );
  }, []);

  // Dispara a busca por GPS assim que o modal for aberto
  useEffect(() => {
    if (!isOpen || !business) return;

    requestUserRealGps();

    // Inicia monitoramento contínuo enquanto o modal estiver aberto
    if (navigator.geolocation) {
      try {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const coords: LatLngLiteral = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            setUserGpsCoords(coords);
            setGpsAccuracy(pos.coords.accuracy);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch {
        // Fallback silencioso
      }
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isOpen, business, requestUserRealGps]);

  // Recalcula a rota sempre que a origem ou o estabelecimento mudar
  useEffect(() => {
    if (!business || !isOpen) return;

    const r = calculateVillageWalkingRoute(
      { name: selectedOrigin.name, coords: selectedOrigin.coords },
      business
    );
    setRoute(r);
    setCurrentStepIndex(0);
    setIsPlayingAutoWalk(false);

    if (onSetRoutePath) {
      onSetRoutePath(r.pathCoordinates);
    }
  }, [business, selectedOrigin, isOpen, onSetRoutePath]);

  // Atualiza a câmera POV quando o passo ou perspectiva muda
  useEffect(() => {
    if (!isPovMode || !route || !onUpdatePovCamera) return;

    const step = route.steps[currentStepIndex];
    if (step) {
      onUpdatePovCamera({
        coords: step.coords,
        bearing: step.heading,
        pitch: povPerspective === "third_person" ? 58 : 76,
        zoom: povPerspective === "third_person" ? 17.4 : 18.4,
        mode: povPerspective,
        isWalking: isPlayingAutoWalk,
      });
    }
  }, [isPovMode, currentStepIndex, route, povPerspective, isPlayingAutoWalk, onUpdatePovCamera]);

  // Auto-walk (simulação contínua do trajeto passo a passo)
  useEffect(() => {
    if (!isPlayingAutoWalk || !route || !isPovMode) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < route.steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlayingAutoWalk(false);
          return prev;
        }
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlayingAutoWalk, route, isPovMode]);

  // Distância e tempo dinâmico restantes a partir do passo atual
  const remainingDistanceMeters = useMemo(() => {
    if (!route) return 0;
    let sum = 0;
    for (let i = currentStepIndex; i < route.steps.length; i++) {
      sum += route.steps[i].distanceMeters;
    }
    return sum;
  }, [route, currentStepIndex]);

  const remainingWalkingMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(remainingDistanceMeters / 65));
  }, [remainingDistanceMeters]);

  const handleStartPov = (perspective: "first_person" | "third_person") => {
    setPovPerspective(perspective);
    setIsPovMode(true);
  };

  const handleClose = () => {
    setIsPovMode(false);
    setIsPlayingAutoWalk(false);
    if (onClearPovRoute) onClearPovRoute();
    onClose();
  };

  // Abre aplicativo externo de mapas nativo
  const openExternalMaps = () => {
    if (!business) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}&travelmode=walking`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!isOpen || !business || !route) return null;

  const currentStep = route.steps[currentStepIndex];

  // Helper para ícone da manobra (estilo Waze/Maps)
  const renderManeuverIcon = (maneuver: ManeuverType) => {
    switch (maneuver) {
      case "turn_right":
      case "slight_right":
        return <CornerUpRight className="w-6 h-6 text-emerald-300 shrink-0" />;
      case "turn_left":
      case "slight_left":
        return <CornerUpLeft className="w-6 h-6 text-emerald-300 shrink-0" />;
      case "arrive":
        return <MapPin className="w-6 h-6 text-amber-300 shrink-0" />;
      case "depart":
      case "straight":
      default:
        return <ArrowUp className="w-6 h-6 text-teal-300 shrink-0" />;
    }
  };

  // Constrói lista de origens disponíveis incluindo o GPS real se detectado
  const availableOrigins: RouteLandmark[] = [];
  if (userGpsCoords) {
    availableOrigins.push({
      id: "user-gps",
      name: isUserInCaraiva
        ? "Minha Localização Atual (GPS)"
        : `Meu GPS Atual (fora da vila ~ ${remoteDistanceKm} km)`,
      coords: userGpsCoords,
      description: isUserInCaraiva
        ? `Sinal em tempo real (precisão ~${Math.round(gpsAccuracy || 10)}m)`
        : "Localização remota (simulação recomendada na vila)",
      icon: "📍",
    });
  }
  availableOrigins.push(...CARAIVA_KEY_ORIGINS);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all ${
        isPovMode
          ? "pointer-events-none bg-transparent"
          : "bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in"
      }`}
    >
      {/* 1. MODO NAVEGAÇÃO / POV HUD (SOBREPOSTO AO MAPA 3D AO VIVO) */}
      {isPovMode ? (
        <div className="pointer-events-auto w-full max-w-xl mx-auto p-3 sm:p-5 mb-20 sm:mb-8 flex flex-col gap-2.5">
          {/* BANNER SUPERIOR ESTILO WAZE / GOOGLE MAPS */}
          <div
            className="p-3.5 sm:p-4 rounded-3xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 space-y-3"
            style={{
              background: "rgba(10, 20, 26, 0.94)",
              borderColor: "rgba(20, 184, 166, 0.4)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(20, 184, 166, 0.2)",
            }}
          >
            {/* Linha de Status Offline & Controles de Perspectiva */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
              {/* Badge Modo Offline Ativo */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]"
                title="Grafo pedonal de Caraíva processado localmente no dispositivo. Funciona 100% offline."
              >
                <WifiOff className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="flex items-center gap-1">
                  Offline Ativo <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
              </div>

              {/* Seletor de Visão: 1ª Pessoa vs 3ª Pessoa (Avatar) */}
              <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPovPerspective("third_person")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    povPerspective === "third_person"
                      ? "bg-teal-500 text-slate-950 shadow-md font-black"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Visão em 3ª pessoa seguindo o avatar"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>3ª Pessoa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPovPerspective("first_person")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    povPerspective === "first_person"
                      ? "bg-teal-500 text-slate-950 shadow-md font-black"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Visão rente ao chão na areia"
                >
                  <Eye className="w-3 h-3" />
                  <span>1ª Pessoa</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPovMode(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Voltar à visão geral"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Manobra em Destaque Waze-Style */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/25 shrink-0 border border-teal-300/30">
                {renderManeuverIcon(currentStep.maneuver)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-emerald-400 font-extrabold text-lg sm:text-xl tracking-tight">
                    {currentStep.distanceMeters > 0 ? `Em ${currentStep.distanceMeters}m` : "No Destino"}
                  </span>
                  <span className="text-slate-400 text-[11px] truncate">
                    {currentStep.streetName}
                  </span>
                </div>
                <h3 className="text-white font-black text-sm sm:text-base leading-snug truncate">
                  {currentStep.maneuverText}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-amber-400 font-black text-sm sm:text-base">
                  {formatDistance(remainingDistanceMeters)}
                </p>
                <p className="text-[10px] text-teal-300 font-bold flex items-center gap-1 justify-end">
                  <Footprints className="w-3 h-3" /> ~{remainingWalkingMinutes} min
                </p>
              </div>
            </div>

            {/* CARAÍVA AI SENSE: Contexto Local */}
            <div className="rounded-2xl bg-white/[0.04] border border-teal-500/20 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-black text-teal-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Dica do Guia Nativo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiSenseDetails((prev) => !prev)}
                  className="text-[10px] text-slate-400 hover:text-teal-300 underline font-semibold"
                >
                  {showAiSenseDetails ? "Ocultar" : "Ver Dica Completa"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold">
                  🏖️ {currentStep.aiSense.sandType}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-400/15 border border-teal-400/30 text-teal-300 font-bold">
                  🌊 {currentStep.aiSense.tideRelevance}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-400/15 border border-sky-400/30 text-sky-300 font-bold">
                  🦶 {currentStep.aiSense.footwearTip}
                </span>
              </div>

              {showAiSenseDetails && (
                <p className="text-[11px] text-slate-200 leading-relaxed italic pt-1 border-t border-white/5 animate-in fade-in">
                  💡 {currentStep.aiSense.nativeTip}
                </p>
              )}
            </div>

            {/* Controles de Passos */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentStepIndex === 0}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
                  title="Passo Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlayingAutoWalk((prev) => !prev)}
                  className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                    isPlayingAutoWalk
                      ? "bg-amber-400 text-slate-950 shadow-amber-400/25"
                      : "bg-teal-500 text-slate-950 shadow-teal-500/25"
                  }`}
                >
                  {isPlayingAutoWalk ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Caminhar Sozinho</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentStepIndex((prev) => Math.min(route.steps.length - 1, prev + 1))
                  }
                  disabled={currentStepIndex === route.steps.length - 1}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
                  title="Próximo Passo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Indicador de Passo */}
              <div className="text-right text-[11px] text-slate-400 font-semibold">
                <span>
                  Passo {currentStepIndex + 1} de {route.steps.length}
                </span>
                <div className="w-20 bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentStepIndex + 1) / route.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. MODAL COMPLETO DE CONFIGURAÇÃO DA ROTA */
        <div
          className="relative w-full max-w-xl bg-[#0c141a] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white font-serif">
                  Rota a Pé para {business.name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">Navegador Pedonal de Caraíva</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-400/20 font-bold">
                    <ShieldCheck className="w-3 h-3" /> 100% Offline
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* BARRA DE STATUS DO GPS EM TEMPO REAL */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                gpsStatus === "acquired"
                  ? isUserInCaraiva
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                  : "bg-white/10 text-slate-300"
              }`}>
                {isLocatingGps ? (
                  <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate text-xs">
                  {isLocatingGps
                    ? "Buscando seu sinal GPS..."
                    : gpsStatus === "acquired"
                    ? isUserInCaraiva
                      ? "GPS Ativo na Vila de Caraíva 🏖️"
                      : `GPS Localizado fora da vila (${remoteDistanceKm} km)`
                    : gpsStatus === "denied"
                    ? "Permissão de GPS negada pelo navegador"
                    : "Localização GPS não obtida"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {isUserInCaraiva
                    ? "Rota traçada diretamente a partir dos seus passos"
                    : "Simulação realista a partir do porto recomendada"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={requestUserRealGps}
              disabled={isLocatingGps}
              className="px-2.5 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 text-teal-300 font-bold text-[11px] shrink-0 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            >
              {isLocatingGps ? "Buscando..." : "Atualizar GPS"}
            </button>
          </div>

          {/* Alerta inteligente caso o usuário esteja testando de longe */}
          {userGpsCoords && !isUserInCaraiva && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-amber-300">Você está fora de Caraíva (~{remoteDistanceKm} km)</p>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Para você visualizar como é a caminhada na areia até <strong>{business.name}</strong>, iniciamos a rota pelo ponto de chegada tradicional na vila (Porto dos Barcos). Você pode tocar em <em>Meu GPS Atual</em> se quiser traçar do seu ponto real.
                </p>
              </div>
            </div>
          )}

          {/* Seletor de Origem (Onde você está) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Ponto de Partida:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1 no-scrollbar">
              {availableOrigins.map((origin) => {
                const isSelected = selectedOrigin.id === origin.id;
                return (
                  <button
                    key={origin.id}
                    type="button"
                    onClick={() => setSelectedOrigin(origin)}
                    className={`p-2.5 rounded-2xl text-left border transition-all text-xs flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-400 text-white shadow-md shadow-teal-500/15 ring-1 ring-teal-400"
                        : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-xl shrink-0">{origin.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate text-white">{origin.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{origin.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Métricas da Rota */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Distância Pedonal</p>
              <p className="text-lg font-black text-amber-400">{route.formattedDistance}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Tempo na Areia</p>
              <p className="text-lg font-black text-teal-300">~{route.totalWalkingMinutes} min a pé</p>
            </div>
          </div>

          {/* Caraíva AI Sense */}
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-400/25 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-teal-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Caraíva AI Sense · Análise do Trajeto</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Calçado Ideal:</span>
                <span className="text-amber-300 font-bold">{route.aiSenseSummary.recommendedFootwear}</span>
              </div>
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tipo de Areia:</span>
                <span className="text-teal-300 font-bold">{route.aiSenseSummary.sandCondition}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed italic bg-black/20 p-2 rounded-xl border border-white/5">
              🌴 {route.aiSenseSummary.nativeSecret}
            </p>
          </div>

          {/* Passo a Passo Descritivo */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Trajeto Recomendado pela Areia:
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 no-scrollbar">
              {route.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-100">{st.instruction}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{st.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleStartPov("third_person")}
                className="py-3 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-98 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 fill-slate-950" />
                <span>Navegar no Mapa 3D (Avatar) 🏃‍♂️</span>
              </button>

              <button
                type="button"
                onClick={openExternalMaps}
                className="py-3 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                title="Abrir navegação por voz no Google Maps ou Apple Maps"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir no Google Maps</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
