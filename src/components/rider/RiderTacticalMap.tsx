import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Compass,
  LocateFixed,
  Layers,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import type {
  CityOperationKey,
  DemandHotspot,
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
  hotspots: DemandHotspot[];
  showHotspots: boolean;
  showGeofenceCircle?: boolean;
  geofenceTargetCoord?: GeoCoord;
  onSelectHazard?: (hazard: MapHazardPin) => void;
  onSelectStop?: (stopIndex: number) => void;
}

const DARK_MAP_STYLE: maplibregl.StyleSpecification = {
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
      attribution: '© OpenStreetMap • CartoDB Dark Matter',
    },
  },
  layers: [
    {
      id: 'carto-dark-base',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

function createCirclePolygon(center: GeoCoord, radiusMeters: number, points = 56): number[][] {
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
  hotspots,
  showHotspots,
  showGeofenceCircle,
  geofenceTargetCoord,
  onSelectHazard,
  onSelectStop,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const riderMarkerRef = useRef<maplibregl.Marker | null>(null);
  const stopMarkersRef = useRef<maplibregl.Marker[]>([]);
  const hazardMarkersRef = useRef<maplibregl.Marker[]>([]);
  const fellowMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [is3DTilt, setIs3DTilt] = useState<boolean>(true);
  const [followRider, setFollowRider] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);

  // Inicialização do MapLibre GL Vetorial 3D (OpenFreeMap — Zero marca d'água / Zero chave exigida)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const preset = CITY_PRESETS[city];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_MAP_STYLE,
      center: [preset.center.lng, preset.center.lat],
      zoom: preset.zoom,
      pitch: preset.pitch,
      bearing: preset.bearing,
      attributionControl: false,
    });

    map.on('load', () => {
      // 1. Zonas de Alta Demanda (Hotspots de Pedidos)
      map.addSource('demand-hotspots', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'demand-hotspots-fill',
        type: 'fill',
        source: 'demand-hotspots',
        paint: {
          'fill-color': '#F59E0B',
          'fill-opacity': 0.14,
        },
      });

      map.addLayer({
        id: 'demand-hotspots-line',
        type: 'line',
        source: 'demand-hotspots',
        paint: {
          'line-color': '#FBBF24',
          'line-width': 2,
          'line-dasharray': [2, 2],
          'line-opacity': 0.75,
        },
      });

      // 2. Geofence de 300m ("Portão Automático")
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
          'fill-color': '#06B6D4',
          'fill-opacity': 0.16,
        },
      });

      map.addLayer({
        id: 'geofence-outline',
        type: 'line',
        source: 'geofence-zone',
        paint: {
          'line-color': '#22D3EE',
          'line-width': 2.5,
          'line-dasharray': [3, 2],
        },
      });

      // 3. Traçado Neon da Rota Inteligente (Multi-Layer Laser Path)
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

      map.addLayer({
        id: 'smart-route-outer-glow',
        type: 'line',
        source: 'smart-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#00F5A0',
          'line-width': 18,
          'line-opacity': 0.22,
          'line-blur': 10,
        },
      });

      map.addLayer({
        id: 'smart-route-casing',
        type: 'line',
        source: 'smart-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#059669',
          'line-width': 7,
          'line-opacity': 0.9,
        },
      });

      map.addLayer({
        id: 'smart-route-core',
        type: 'line',
        source: 'smart-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#6EE7B7',
          'line-width': 3.5,
          'line-opacity': 1,
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

  // FlyTo suave quando troca de cidade
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const preset = CITY_PRESETS[city];
    map.flyTo({
      center: [preset.center.lng, preset.center.lat],
      zoom: preset.zoom,
      pitch: is3DTilt ? preset.pitch : 0,
      bearing: is3DTilt ? preset.bearing : 0,
      speed: 1.4,
    });
  }, [city]);

  // Atualiza Rota Inteligente, Geofence 300m e Hotspots
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

    const hotspotSource = map.getSource('demand-hotspots') as maplibregl.GeoJSONSource | undefined;
    if (hotspotSource) {
      if (showHotspots) {
        hotspotSource.setData({
          type: 'FeatureCollection',
          features: hotspots
            .filter((h) => h.city === city)
            .map((h) => ({
              type: 'Feature' as const,
              properties: { name: h.name },
              geometry: {
                type: 'Polygon' as const,
                coordinates: [createCirclePolygon(h.coord, h.radiusMeters)],
              },
            })),
        });
      } else {
        hotspotSource.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    }
  }, [routeGeometry, showGeofenceCircle, geofenceTargetCoord, hotspots, showHotspots, city, mapReady]);

  // Pino Holográfico da Moto do Piloto com Cone de Farol / LiDAR (Tesla FSD Style)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!riderMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'rider-self-hud-marker';
      riderMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([riderCoord.lng, riderCoord.lat])
        .addTo(map);
    }

    const markerEl = riderMarkerRef.current.getElement();
    const accentColor = isSosActive ? '#EF4444' : isOnline ? '#00F5A0' : '#94A3B8';
    const glowBg = isSosActive
      ? 'rgba(239, 68, 68, 0.45)'
      : isOnline
      ? 'rgba(0, 245, 160, 0.25)'
      : 'rgba(148, 163, 184, 0.15)';

    markerEl.innerHTML = `
      <div style="position:relative;width:84px;height:84px;display:flex;align-items:center;justify-content:center;pointer-events:none;">
        <!-- Cone de Radar Direcional -->
        <div style="position:absolute;inset:0;transform:rotate(${riderHeading}deg);transition:transform 0.35s ease-out;">
          <div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:48px;height:48px;background:linear-gradient(to top, ${glowBg}, transparent);clip-path:polygon(50% 100%, 0% 0%, 100% 0%);"></div>
        </div>
        <!-- Anel de Pulso GPS -->
        <div style="position:absolute;width:54px;height:54px;border-radius:9999px;border:1.5px solid ${accentColor};opacity:0.45;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <!-- Cápsula Central da Moto -->
        <div style="position:relative;width:40px;height:40px;border-radius:9999px;background:radial-gradient(circle at 30% 30%, #16222F, #070B10);border:2.5px solid ${accentColor};box-shadow:0 0 22px ${accentColor};display:flex;align-items:center;justify-content:center;">
          <span style="font-size:19px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));">🏍️</span>
        </div>
        <!-- Etiqueta Tática -->
        <div style="position:absolute;bottom:-6px;background:#070B10;border:1px solid ${accentColor};color:#FFFFFF;font-size:9px;font-weight:900;padding:1.5px 7px;border-radius:999px;letter-spacing:0.06em;box-shadow:0 4px 12px rgba(0,0,0,0.85);white-space:nowrap;">
          ${isSosActive ? '🚨 SOS ATIVO' : 'PILOTO #01'}
        </div>
      </div>
    `;

    riderMarkerRef.current.setLngLat([riderCoord.lng, riderCoord.lat]);

    if (followRider) {
      map.easeTo({
        center: [riderCoord.lng, riderCoord.lat],
        duration: 550,
      });
    }
  }, [riderCoord, riderHeading, isOnline, isSosActive, followRider]);

  // Pinos Inteligentes das Paradas da Rota (Sem Sobreposição: Foco na Parada Atual + Beacons Numerados)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    stopMarkersRef.current.forEach((m) => m.remove());
    stopMarkersRef.current = [];

    stops.forEach((stop, idx) => {
      const el = document.createElement('div');
      const isPickup = stop.type === 'pickup';
      const isCurrent = stop.id === activeStopId;

      const accent = stop.completed
        ? '#64748B'
        : isCurrent
        ? '#00F5A0'
        : isPickup
        ? '#F59E0B'
        : '#38BDF8';

      if (isCurrent) {
        // Card Holográfico Expandido apenas para a Parada Ativa
        el.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;z-index:30;">
            <div style="padding:5px 11px;border-radius:12px;background:rgba(7,11,16,0.94);backdrop-filter:blur(12px);border:1.5px solid ${accent};color:#FFF;box-shadow:0 10px 28px rgba(0,0,0,0.85), 0 0 18px rgba(0,245,160,0.28);display:flex;align-items:center;gap:7px;white-space:nowrap;">
              <span style="width:20px;height:20px;border-radius:999px;background:${accent};color:#04070B;font-weight:900;font-size:11px;display:flex;align-items:center;justify-content:center;">
                ${stop.sequence}
              </span>
              <div style="text-align:left;">
                <div style="font-size:9px;font-weight:800;color:${accent};letter-spacing:0.06em;text-transform:uppercase;">
                  ${isPickup ? 'COLETA ATIVA' : 'ENTREGA ATIVA'}
                </div>
                <div style="font-size:11px;font-weight:800;color:#FFFFFF;">
                  ${stop.title}
                </div>
              </div>
            </div>
            <div style="width:2px;height:18px;background:linear-gradient(to bottom, ${accent}, transparent);"></div>
            <div style="width:11px;height:11px;border-radius:9999px;background:${accent};box-shadow:0 0 14px ${accent};"></div>
          </div>
        `;
      } else {
        // Beacon Compacto Numerado para as demais paradas (zero poluição visual!)
        el.innerHTML = `
          <div title="#${stop.sequence} ${stop.title}" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;z-index:10;">
            <div style="padding:3px 8px;border-radius:999px;background:rgba(9,13,19,0.92);border:1.5px solid ${accent};color:#F8FAFC;font-size:10px;font-weight:800;box-shadow:0 4px 14px rgba(0,0,0,0.75);display:flex;align-items:center;gap:4px;white-space:nowrap;">
              <span style="color:${accent};font-weight:900;">#${stop.sequence}</span>
              <span>${stop.completed ? '✓' : isPickup ? 'Coleta' : 'Entrega'}</span>
            </div>
            <div style="width:2px;height:8px;background:${accent};"></div>
            <div style="width:8px;height:8px;border-radius:9999px;background:${accent};"></div>
          </div>
        `;
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectStop?.(idx);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([stop.coord.lng, stop.coord.lat])
        .addTo(map);

      stopMarkersRef.current.push(marker);
    });
  }, [stops, activeStopId, onSelectStop]);

  // Pinos Minimalistas de Segurança Colaborativa ("Waze dos Motoboys" + Pontos de Apoio)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    hazardMarkersRef.current.forEach((m) => m.remove());
    hazardMarkersRef.current = [];

    hazards.forEach((haz) => {
      const el = document.createElement('div');
      const iconMap: Record<MapHazardPin['type'], { emoji: string; color: string }> = {
        pothole: { emoji: '🕳️', color: '#F59E0B' },
        dog: { emoji: '🐕', color: '#FB923C' },
        dark_street: { emoji: '🌑', color: '#A855F7' },
        slippery: { emoji: '🌧️', color: '#38BDF8' },
        support_hub: { emoji: '☕', color: '#10B981' },
      };

      const cfg = iconMap[haz.type];
      el.innerHTML = `
        <div title="${haz.title}" style="width:32px;height:32px;border-radius:999px;background:rgba(7,11,16,0.92);border:1.5px solid ${cfg.color};box-shadow:0 4px 14px rgba(0,0,0,0.7), 0 0 10px ${cfg.color}44;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:transform 0.2s;">
          ${cfg.emoji}
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

  // Pinos dos Colegas da Tropa Online na Rede
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    fellowMarkersRef.current.forEach((m) => m.remove());
    fellowMarkersRef.current = [];

    fellowRiders.forEach((fellow) => {
      const el = document.createElement('div');
      const dotColor =
        fellow.status === 'sos'
          ? '#EF4444'
          : fellow.status === 'livre'
          ? '#10B981'
          : '#F59E0B';

      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
          <div style="width:28px;height:28px;border-radius:9999px;background:#080D14;border:1.8px solid ${dotColor};display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${dotColor}66;font-size:13px;">
            🛵
          </div>
          <span style="margin-top:2px;background:rgba(7,11,16,0.9);border:1px solid rgba(255,255,255,0.12);color:#E2E8F0;font-size:9px;font-weight:800;padding:1px 5px;border-radius:5px;white-space:nowrap;">
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
      const preset = CITY_PRESETS[city];
      map.easeTo({
        pitch: next ? preset.pitch : 0,
        bearing: next ? preset.bearing : 0,
        duration: 600,
      });
    }
  };

  const handleRecenter = () => {
    setFollowRider(true);
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [riderCoord.lng, riderCoord.lat],
        zoom: 15.8,
        pitch: is3DTilt ? 58 : 0,
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
    map.fitBounds(bounds, {
      padding: { top: 110, bottom: 130, left: 390, right: 90 },
      maxZoom: 15.6,
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#05080C]">
      {/* Mapa Vetorial 3D MapLibre GL em 100% da Tela */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Vinheta Cinematográfica Sutil nas Bordas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 58% 48%, transparent 52%, rgba(5, 8, 12, 0.65) 100%)',
        }}
      />

      {/* Controles Táticos de Câmera 3D (Canto Direito) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleRecenter}
          title="Travar Câmera na Minha Moto"
          className={`w-11 h-11 rounded-2xl backdrop-blur-xl border transition-all shadow-2xl flex items-center justify-center ${
            followRider
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
              : 'bg-[#080C12]/85 border-white/15 text-slate-300 hover:text-white hover:border-white/30'
          }`}
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleToggle3D}
          title="Alternar Perspectiva Horizonte 3D / Vista Aérea 2D"
          className={`w-11 h-11 rounded-2xl backdrop-blur-xl border transition-all shadow-2xl flex flex-col items-center justify-center ${
            is3DTilt
              ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
              : 'bg-[#080C12]/85 border-white/15 text-slate-300 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[8px] font-black tracking-wider mt-0.5">
            {is3DTilt ? '3D' : '2D'}
          </span>
        </button>

        {routeGeometry.length > 1 && (
          <button
            type="button"
            onClick={handleFitRoute}
            title="Enquadrar Rota Completa no Mapa"
            className="w-11 h-11 rounded-2xl bg-[#080C12]/85 backdrop-blur-xl border border-white/15 text-slate-300 hover:text-white hover:border-white/30 transition-all shadow-2xl flex items-center justify-center"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}

        {showHotspots && (
          <div
            title="Zonas de Alta Demanda Ativas"
            className="w-11 h-11 rounded-2xl bg-amber-500/15 backdrop-blur-xl border border-amber-400/40 text-amber-300 flex flex-col items-center justify-center shadow-2xl"
          >
            <Flame className="w-4 h-4 animate-pulse" />
            <span className="text-[8px] font-black mt-0.5">HOT</span>
          </div>
        )}
      </div>

      {/* Alerta SOS em Tela Cheia */}
      {isSosActive && (
        <div className="pointer-events-none absolute inset-0 border-4 border-red-500/85 animate-pulse flex items-start justify-center pt-24 z-30">
          <div className="px-5 py-2.5 rounded-full bg-red-600/95 text-white font-black text-xs tracking-wider uppercase shadow-[0_0_40px_rgba(239,68,68,0.9)] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Sinalizador SOS Transmitindo Coordenadas GPS para as 2 Redes
          </div>
        </div>
      )}
    </div>
  );
};
