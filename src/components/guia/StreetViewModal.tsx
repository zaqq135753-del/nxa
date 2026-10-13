import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Compass,
  Navigation,
  MapPin,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { type GuidePlace } from "../../services/maps/types";
import { findNearestStreetView } from "../../services/maps/streetView";
import { loadGoogleMaps } from "../../services/maps/googleMapsLoader";
import { trackEvent } from "../../services/analytics";

interface StreetViewModalProps {
  place: GuidePlace | null;
  isOpen: boolean;
  onClose: () => void;
  onStartRoute?: (place: GuidePlace) => void;
}

export const StreetViewModal: React.FC<StreetViewModalProps> = ({
  place,
  isOpen,
  onClose,
  onStartRoute,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const [loading, setLoading] = useState(true);
  const [hasCoverage, setHasCoverage] = useState(true);
  const [currentHeading, setCurrentHeading] = useState(0);

  useEffect(() => {
    if (!isOpen || !place) {
      if (panoramaRef.current) {
        panoramaRef.current = null;
      }
      return;
    }

    setLoading(true);
    setHasCoverage(true);

    let isSubscribed = true;

    async function initStreetView() {
      try {
        await loadGoogleMaps();

        if (!containerRef.current) return;

        const svInfo = await findNearestStreetView({
          lat: place!.latitude,
          lng: place!.longitude,
        });

        if (!isSubscribed) return;

        if (svInfo.status === "OK" && svInfo.location) {
          setHasCoverage(true);
          setCurrentHeading(Math.round(svInfo.heading));

          const pano = new window.google.maps.StreetViewPanorama(containerRef.current, {
            position: { lat: svInfo.location.lat, lng: svInfo.location.lng },
            pov: {
              heading: svInfo.heading,
              pitch: svInfo.pitch || 0,
            },
            zoom: svInfo.zoom || 1,
            addressControl: false,
            showRoadLabels: true,
            fullscreenControl: false,
            motionTracking: true,
            motionTrackingControl: true,
            zoomControl: true,
          });

          pano.addListener("pov_changed", () => {
            const pov = pano.getPov();
            if (pov && typeof pov.heading === "number") {
              setCurrentHeading(Math.round(pov.heading));
            }
          });

          panoramaRef.current = pano;
          setLoading(false);

          trackEvent("business_view", {
            businessId: place!.id,
            businessName: place!.name,
            source: "streetview_real",
          });
        } else {
          setHasCoverage(false);
          setLoading(false);

          trackEvent("business_view", {
            businessId: place!.id,
            businessName: place!.name,
            source: "streetview_fallback",
          });
        }
      } catch {
        if (!isSubscribed) return;
        setHasCoverage(false);
        setLoading(false);
      }
    }

    initStreetView();

    return () => {
      isSubscribed = false;
      if (panoramaRef.current) {
        panoramaRef.current = null;
      }
    };
  }, [isOpen, place]);

  if (!isOpen || !place) return null;

  const handleResetHeading = () => {
    if (panoramaRef.current) {
      panoramaRef.current.setPov({
        heading: currentHeading,
        pitch: 0,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
      {/* HEADER SUPERIOR */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-white/20 shadow-xl transition-all active:scale-95"
            title="Voltar ao Mapa"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                <Compass className="w-3 h-3 text-amber-400" />
                <span>Street View 360° Real</span>
              </span>
              <span className="text-[10px] text-slate-300">
                {currentHeading}° Azimute
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white truncate max-w-[240px] sm:max-w-md">
              {place.name}
            </h2>
          </div>
        </div>

        <button
          onClick={handleResetHeading}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/15 flex items-center gap-1.5 transition-all"
          title="Apontar para a fachada"
        >
          <RotateCw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Ver Fachada</span>
        </button>
      </div>

      {/* CONTAINER PRINCIPAL DO PANORAMA / FALLBACK */}
      <div className="relative flex-1 w-full h-full bg-[#070b0e]">
        {/* Container do Google Street View Panorama */}
        <div
          ref={containerRef}
          className={`w-full h-full ${!hasCoverage || loading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
        />

        {/* LOADING STATE */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a1014] text-white">
            <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Conectando aos satélites e Street View...
            </p>
          </div>
        )}

        {/* FALLBACK QUANDO NÃO HÁ PANORAMA AUTOMOBILÍSTICO NAS RUAS DE AREIA */}
        {!loading && !hasCoverage && (
          <div className="absolute inset-0 flex flex-col justify-between p-6 bg-radial from-[#121c24] to-[#070c10] text-white">
            <div className="mt-16 max-w-lg mx-auto w-full space-y-4 text-center">
              {/* Foto Real da Fachada */}
              {place.coverImage ? (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-2xl group">
                  <img
                    src={place.coverImage}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs text-white/90 font-medium">
                      📸 Fachada e ambiente real de {place.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-amber-400/50" />
                </div>
              )}

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-left space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Ruas de Areia Preservadas (Sem Carros)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Caraíva é uma vila protegida com ruas de areia fofa onde veículos motorizados não circulam.
                  A foto acima retrata a fachada do local exato.
                </p>
              </div>
            </div>

            <div className="max-w-lg mx-auto w-full pt-4">
              <button
                type="button"
                onClick={() => { if (onStartRoute) { onStartRoute(place); onClose(); } }}
                disabled={!onStartRoute}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-300" />
                <span>Traçar rota no mapa do guia</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER INFERIOR COM AÇÕES */}
      <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between gap-3">
        <div className="hidden sm:block text-xs text-slate-300">
          <p className="font-bold text-white">{place.name}</p>
          <p className="text-slate-400 text-[11px] truncate max-w-xs">{place.address}</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onStartRoute && (
            <button
              onClick={() => {
                onStartRoute(place);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Como Chegar (Rota a Pé)</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
