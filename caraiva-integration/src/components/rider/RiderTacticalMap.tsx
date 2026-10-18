import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Navigation,
  ShieldAlert,
  Compass,
  LocateFixed,
  Layers,
  Radio,
} from 'lucide-react';
import type {
  CityOperationKey,
  FellowRiderPin,
  GeoCoord,
  MapHazardPin,
  RouteStop,
} from '../../services/riderDispatchService';
import { CITY_PRESETS } from '../../services/riderDispatchService';

interface RiderTacticalMapProps {
  city: CityOperationKey;
  riderCoord: GeoCoord;
  riderHeading: number;
  isOnline: boolean;
  isSosActive: boolean;
  routeGeometry: GeoCoord[];
  stops: RouteStop[];
  activeStopId?: string;
  hazards: MapHazardPin[];
  fellowRiders: FellowRiderPin[];
  showGeofenceCircle?: boolean;
  geofenceTargetCoord?: GeoCoord;
  onSelectHazard?: (hazard: MapHazardPin) => void;
  onMapClickAddHazard?: (coord: GeoCoord) => void;
}

const DARK_MATTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap • CartoDB Dark Matter HUD',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

function createCirclePolygon(center: GeoCoord, radiusMeters: number, points = 48): number[][] {
  const coords: number[][] = [];
  const distanceX = radiusMeters / (111320 * Math.cos((center.lat * Math.PI) / 180));
  const distanceY = radiusMeters / 110574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center.lng + x, center.lat + y]);
  }
  coords.push(coords[0]);
  return coords;
}

export const RiderTacticalMap: React.FC<RiderTacticalMapProps> = ({
  city,
  riderCoord,
  riderHeading,
  isOnline,
  isSosActive,
  routeGeometry,
  stops,
  activeStopId,
  hazards,
  fellowRiders,
  showGeofenceCircle,
  geofenceTargetCoord,
  onSelectHazard,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const riderMarkerRef = useRef<maplibregl.Marker | null>(null);
  const stopMarkersRef = useRef<maplibregl.Marker[]>([]);
  const hazardMarkersRef = useRef<maplibregl.Marker[]>([]);
  const fellowMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [is3DTilt, setIs3DTilt] = useState<boolean>(true);
  const [followRider, setFollowRider] = useState<boolean>(true);
  const [mapReady, setMapReady] = useState<boolean>(false);

  // Inicialização do MapLibre GL
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const preset = CITY_PRESETS[city];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_MATTER_STYLE,
      center: [preset.center.lng, preset.center.lat],
      zoom: preset.zoom,
      pitch: 52,
      bearing: -15,
      attributionControl: false,
    });

    map.on('load', () => {
      // Fonte para o traçado neon da rota inteligente
      map.addSource('smart-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      // Brilho externo (Glow) da rota
      map.addLayer({
        id: 'smart-route-glow',
        type: 'line',
        source: 'smart-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#10B981',
          'line-width': 12,
          'line-opacity': 0.28,
          'line-blur': 6,
        },
      });

      // Linha central de alta precisão
      map.addLayer({
        id: 'smart-route-core',
        type: 'line',
        source: 'smart-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#34D399',
          'line-width': 4.5,
          'line-opacity': 0.95,
        },
      });

      // Fonte para o Geofence de 300m ("Portão Automático")
      map.addSource('geofence-zone', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'geofence-fill',
        type: 'fill',
        source: 'geofence-zone',
        paint: {
          'fill-color': '#38BDF8',
          'fill-opacity': 0.14,
        },
      });

      map.addLayer({
        id: 'geofence-outline',
        type: 'line',
        source: 'geofence-zone',
        paint: {
          'line-color': '#38BDF8',
          'line-width': 2,
          'line-dasharray': [3, 2],
        },
      });

      setMapReady(true);
    });

    map.on('dragstart', () => {
      setFollowRider(false);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Troca de Cidade (Conceição do Mato Dentro <-> Caraíva)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const preset = CITY_PRESETS[city];
    map.flyTo({
      center: [preset.center.lng, preset.center.lat],
      zoom: preset.zoom,
      pitch: is3DTilt ? 52 : 0,
      speed: 1.4,
    });
  }, [city]);

  // Atualiza Rota Inteligente e Círculo Geofence 300m
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const routeSource = map.getSource('smart-route') as maplibregl.GeoJSONSource | undefined;
    if (routeSource) {
      const coords = routeGeometry.map((pt) => [pt.lng, pt.lat]);
      routeSource.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      });
    }

    const geofenceSource = map.getSource('geofence-zone') as maplibregl.GeoJSONSource | undefined;
    if (geofenceSource) {
      if (showGeofenceCircle && geofenceTargetCoord) {
        const polygonCoords = createCirclePolygon(geofenceTargetCoord, 280);
        geofenceSource.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [polygonCoords],
              },
            },
          ],
        });
      } else {
        geofenceSource.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    }
  }, [routeGeometry, showGeofenceCircle, geofenceTargetCoord, mapReady]);

  // Atualiza Pino da Moto do Piloto (User Rider)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!riderMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'rider-self-marker';
      riderMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([riderCoord.lng, riderCoord.lat])
        .addTo(map);
    }

    const markerEl = riderMarkerRef.current.getElement();
    const accentColor = isSosActive ? '#EF4444' : isOnline ? '#10B981' : '#94A3B8';
    const pulseRing = isSosActive
      ? 'rgba(239, 68, 68, 0.55)'
      : isOnline
      ? 'rgba(16, 185, 129, 0.35)'
      : 'rgba(148, 163, 184, 0.15)';

    markerEl.innerHTML = `
      <div style="position:relative;width:58px;height:58px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border-radius:9999px;background:${pulseRing};animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="position:relative;width:42px;height:42px;border-radius:9999px;background:#090D11;border:2.5px solid ${accentColor};box-shadow:0 0 18px ${accentColor};display:flex;align-items:center;justify-content:center;transform:rotate(${riderHeading}deg);transition:transform 0.3s ease;">
          <span style="font-size:20px;transform:rotate(-${riderHeading}deg);">🏍️</span>
        </div>
        <div style="position:absolute;bottom:-18px;white-space:nowrap;background:#090D11;border:1px solid ${accentColor};color:#FFF;font-size:10px;font-weight:800;padding:1px 6px;border-radius:6px;letter-spacing:0.04em;">
          ${isSosActive ? '🚨 SOS ATIVO' : 'VOCÊ • GPS'}
        </div>
      </div>
    `;

    riderMarkerRef.current.setLngLat([riderCoord.lng, riderCoord.lat]);

    if (followRider) {
      map.easeTo({
        center: [riderCoord.lng, riderCoord.lat],
        duration: 600,
      });
    }
  }, [riderCoord, riderHeading, isOnline, isSosActive, followRider]);

  // Atualiza Paradas da Rota (Coletas e Entregas)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    stopMarkersRef.current.forEach((m) => m.remove());
    stopMarkersRef.current = [];

    stops.forEach((stop) => {
      const el = document.createElement('div');
      const isPickup = stop.type === 'pickup';
      const isCurrent = stop.id === activeStopId;
      const borderColor = stop.completed
        ? '#475569'
        : isPickup
        ? '#F59E0B'
        : '#38BDF8';
      const bgBadge = stop.completed
        ? '#1E293B'
        : isPickup
        ? '#78350F'
        : '#0C4A6E';

      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;transform:${isCurrent ? 'scale(1.12)' : 'scale(0.95)'};transition:all 0.25s;">
          <div style="padding:4px 9px;border-radius:9999px;background:${bgBadge};border:2px solid ${borderColor};color:#FFF;font-size:11px;font-weight:800;box-shadow:0 6px 16px rgba(0,0,0,0.65);display:flex;align-items:center;gap:5px;white-space:nowrap;">
            <span>${stop.completed ? '✅' : isPickup ? '🍔' : '🏠'}</span>
            <span>#${stop.sequence} ${stop.title.split(':')[0]}</span>
          </div>
          <div style="width:3px;height:10px;background:${borderColor};"></div>
          <div style="width:10px;height:10px;border-radius:9999px;background:${borderColor};box-shadow:0 0 10px ${borderColor};"></div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([stop.coord.lng, stop.coord.lat])
        .addTo(map);

      stopMarkersRef.current.push(marker);
    });
  }, [stops, activeStopId]);

  // Atualiza Alertas Colaborativos ("Waze dos Motoboys" + Pontos de Apoio)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    hazardMarkersRef.current.forEach((m) => m.remove());
    hazardMarkersRef.current = [];

    hazards.forEach((haz) => {
      const el = document.createElement('div');
      const iconMap: Record<MapHazardPin['type'], { emoji: string; color: string; label: string }> = {
        pothole: { emoji: '🕳️', color: '#F59E0B', label: 'Buraco/Brita' },
        dog: { emoji: '🐕', color: '#FB923C', label: 'Cachorro Bravo' },
        dark_street: { emoji: '🌑', color: '#A855F7', label: 'Rua Escura' },
        slippery: { emoji: '🌧️', color: '#38BDF8', label: 'Pista Lisa' },
        support_hub: { emoji: '☕', color: '#10B981', label: 'Ponto de Apoio' },
      };

      const cfg = iconMap[haz.type];
      el.innerHTML = `
        <div title="${haz.title}" style="display:flex;align-items:center;gap:4px;background:rgba(9,13,17,0.92);border:1.5px solid ${cfg.color};padding:3px 8px;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,0.6);cursor:pointer;color:#FFF;font-size:11px;font-weight:700;">
          <span style="font-size:14px;">${cfg.emoji}</span>
          <span style="color:${cfg.color};">${cfg.label}</span>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectHazard?.(haz);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([haz.coord.lng, haz.coord.lat])
        .addTo(map);

      hazardMarkersRef.current.push(marker);
    });
  }, [hazards, onSelectHazard]);

  // Atualiza Colegas da Tropa Online no Mapa
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    fellowMarkersRef.current.forEach((m) => m.remove());
    fellowMarkersRef.current = [];

    fellowRiders.forEach((fellow) => {
      const el = document.createElement('div');
      const isSos = fellow.status === 'sos';
      const dotColor = isSos ? '#EF4444' : fellow.status === 'livre' ? '#10B981' : '#F59E0B';

      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;">
          <div style="width:28px;height:28px;border-radius:9999px;background:#0F172A;border:2px solid ${dotColor};display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${dotColor};font-size:14px;">
            🛵
          </div>
          <span style="margin-top:2px;background:rgba(9,13,17,0.88);border:1px solid rgba(255,255,255,0.14);color:#CBD5E1;font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;white-space:nowrap;">
            ${fellow.nickname}
          </span>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([fellow.coord.lng, fellow.coord.lat])
        .addTo(map);

      fellowMarkersRef.current.push(marker);
    });
  }, [fellowRiders]);

  const handleToggle3D = () => {
    const map = mapRef.current;
    const next = !is3DTilt;
    setIs3DTilt(next);
    if (map) {
      map.easeTo({ pitch: next ? 52 : 0, bearing: next ? -15 : 0, duration: 500 });
    }
  };

  const handleRecenter = () => {
    setFollowRider(true);
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [riderCoord.lng, riderCoord.lat],
        zoom: 15.8,
        pitch: is3DTilt ? 52 : 0,
        speed: 1.4,
      });
    }
  };

  const handleFitRoute = () => {
    const map = mapRef.current;
    if (!map || routeGeometry.length < 2) return;
    setFollowRider(false);
    const bounds = new maplibregl.LngLatBounds();
    routeGeometry.forEach((pt) => bounds.extend([pt.lng, pt.lat]));
    bounds.extend([riderCoord.lng, riderCoord.lat]);
    map.fitBounds(bounds, { padding: { top: 90, bottom: 260, left: 50, right: 50 }, maxZoom: 16 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#06090C]">
      {/* Container MapLibre GL */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Vinheta Tática HUD nas Bordas para Leitura Perfeita */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, transparent 45%, rgba(6, 9, 12, 0.72) 100%)',
        }}
      />

      {/* Legenda Rápida da Tropa & Radar no Topo Esquerdo do Mapa */}
      <div className="absolute top-20 left-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D12]/90 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-200 shadow-lg">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{fellowRiders.length + 1} Motos na Rede</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300">{hazards.length} Alertas no Mapa</span>
        </div>

        {showGeofenceCircle && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/20 backdrop-blur-md border border-sky-400/40 text-[11px] font-bold text-sky-200 shadow-lg">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>Geofence 300m Ativo (Portão Automático)</span>
          </div>
        )}
      </div>

      {/* Controles Flutuantes do Mapa (Direita) */}
      <div className="absolute top-20 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={handleRecenter}
          title="Centralizar na Minha Moto"
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-lg flex items-center justify-center ${
            followRider
              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
              : 'bg-[#090D12]/90 border-white/15 text-slate-300 hover:text-white'
          }`}
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleToggle3D}
          title="Alternar Câmera 3D / 2D"
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-lg flex items-center justify-center flex-col gap-0.5 ${
            is3DTilt
              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
              : 'bg-[#090D12]/90 border-white/15 text-slate-300 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[9px] font-black">{is3DTilt ? '3D' : '2D'}</span>
        </button>

        {routeGeometry.length > 1 && (
          <button
            type="button"
            onClick={handleFitRoute}
            title="Enquadrar Rota Inteira"
            className="p-2.5 rounded-xl bg-[#090D12]/90 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white transition-all shadow-lg flex items-center justify-center"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Alerta Vermelho em Tela Cheia caso SOS esteja Ativo */}
      {isSosActive && (
        <div className="pointer-events-none absolute inset-0 border-4 border-red-500/80 animate-pulse flex items-start justify-center pt-36">
          <div className="px-4 py-2 rounded-full bg-red-600/95 text-white font-black text-xs tracking-wider uppercase shadow-2xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Sinalizador SOS Transmitindo Posição GPS para toda a Rede
          </div>
        </div>
      )}
    </div>
  );
};
