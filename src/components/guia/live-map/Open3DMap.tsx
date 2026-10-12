import { useEffect, useRef } from "react";
import { Map, Marker, type GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./cartoon-map.css";
import { type LiveMapEngineProps } from "../../../services/maps/liveMapModel";
import { CARAIVA_CENTER_COORDS } from "../../../services/maps/types";
import { orbSvg } from "./mapOrb";

function renderCaraivaAvatarSvg(): string {
  return `
    <svg width="48" height="68" viewBox="0 0 48 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Mochila de Aventura (Nas costas) -->
      <rect x="7" y="27" width="10" height="15" rx="3.5" fill="#EA580C" stroke="#C2410C" stroke-width="1.2"/>
      <rect x="9" y="32" width="6" height="3" rx="1" fill="#FDE047"/>
      <path d="M12 24 C10 21 8 26 8 30" stroke="#C2410C" stroke-width="2" stroke-linecap="round"/>

      <!-- Braço Esquerdo -->
      <path d="M13 28 L9 39" stroke="#D97706" stroke-width="4" stroke-linecap="round"/>

      <!-- Bermuda de Praia Tropical -->
      <rect x="15" y="39" width="18" height="12" rx="2" fill="#2563EB"/>
      <line x1="24" y1="39" x2="24" y2="51" stroke="#1D4ED8" stroke-width="1.5"/>

      <!-- Camisa Floral / Linho Tropical -->
      <path d="M13 25 C13 23 35 23 35 25 L37 40 L11 40 Z" fill="#0D9488"/>
      <!-- Estampa Floral e Palmeira da Bahia -->
      <circle cx="18" cy="29" r="1.5" fill="#FDE047"/>
      <circle cx="28" cy="31" r="1.5" fill="#FDE047"/>
      <circle cx="22" cy="35" r="1.5" fill="#FDE047"/>
      <path d="M22 28 Q25 32 24 36" stroke="#5EEAD4" stroke-width="1" stroke-linecap="round"/>
      <!-- Gola V / Colar de Sementes Nativo -->
      <polygon points="21,24 27,24 24,30" fill="#F59E0B"/>
      <circle cx="24" cy="31" r="1" fill="#92400E"/>

      <!-- Braço Direito (Acenando/Caminhando) -->
      <path d="M35 28 L39 38" stroke="#D97706" stroke-width="4" stroke-linecap="round"/>

      <!-- Pernas & Pés na Areia (Descalço / Sandália) -->
      <path d="M19 50 L19 61 L16 63" stroke="#D97706" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M29 50 L29 61 L32 63" stroke="#D97706" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Tiras do Chinelo de Praia nos pés -->
      <line x1="16" y1="62" x2="19" y2="61" stroke="#E11D48" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="29" y1="61" x2="32" y2="62" stroke="#E11D48" stroke-width="1.5" stroke-linecap="round"/>

      <!-- Cabeça & Rosto Bronzeado -->
      <circle cx="24" cy="18" r="8" fill="#F59E0B"/>
      <!-- Sorriso Amigável -->
      <path d="M21 21 Q24 24 27 21" stroke="#78350F" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <!-- Óculos de Sol Estiloso -->
      <rect x="17" y="15" width="5.5" height="4" rx="1.5" fill="#0F172A"/>
      <rect x="25.5" y="15" width="5.5" height="4" rx="1.5" fill="#0F172A"/>
      <line x1="22.5" y1="16.5" x2="25.5" y2="16.5" stroke="#0F172A" stroke-width="1.5"/>
      <line x1="18" y1="16" x2="20.5" y2="16" stroke="#38BDF8" stroke-width="0.9" stroke-linecap="round"/>
      <line x1="26.5" y1="16" x2="29" y2="16" stroke="#38BDF8" stroke-width="0.9" stroke-linecap="round"/>

      <!-- Chapéu de Palha Tradicional de Caraíva -->
      <!-- Copa do Chapéu -->
      <path d="M16 12 C16 4 32 4 32 12 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="1.2"/>
      <path d="M19 6 L29 6" stroke="#CA8A04" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>
      <path d="M18 9 L30 9" stroke="#CA8A04" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>
      <!-- Fita do Chapéu Verde-Água / Turquesa -->
      <path d="M16 11.5 C20 10.5 28 10.5 32 11.5" stroke="#0D9488" stroke-width="2.5" fill="none"/>
      <!-- Folhinha Nativa no Chapéu -->
      <path d="M30 9 Q34 6 36 8" stroke="#16A34A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Aba Larga Curvada de Palha Trançada -->
      <ellipse cx="24" cy="12.5" rx="19" ry="5.5" fill="#FDE047" stroke="#CA8A04" stroke-width="1.2"/>
      <path d="M8 12.5 Q24 16 40 12.5" stroke="#CA8A04" stroke-width="0.8"/>
    </svg>
  `;
}

function renderAvatarGroundHtml(bearing: number): string {
  return `
    <div class="caraiva-avatar-ground">
      <div class="caraiva-avatar-shadow"></div>
      <div class="caraiva-avatar-heading-cone" style="transform: rotate(${Math.round(bearing)}deg)">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <polygon points="24,4 31,21 24,16 17,21" fill="#14B8A6" opacity="0.95" filter="drop-shadow(0 0 6px #14B8A6)"/>
          <circle cx="24" cy="24" r="11" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6"/>
        </svg>
      </div>
      <div class="caraiva-sand-puffs">
        <span class="sand-puff sand-left"></span>
        <span class="sand-puff sand-right"></span>
      </div>
    </div>
  `;
}

function createAvatarContent(options: {
  bearing: number;
  isWalking: boolean;
  label?: string;
}): string {
  const { bearing, isWalking, label = "🚶 Nativo de Caraíva" } = options;
  return `
    <div class="caraiva-avatar-badge">
      <span class="badge-dot"></span>
      <span>${label}</span>
    </div>
    <div class="caraiva-avatar-character ${isWalking ? "is-walking" : "is-idle"}">
      ${renderCaraivaAvatarSvg()}
    </div>
    ${renderAvatarGroundHtml(bearing)}
  `;
}

export default function Open3DMap(props: LiveMapEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const avatarMarkerRef = useRef<Marker | null>(null);
  const callbacks = useRef(props);
  callbacks.current = props;

  useEffect(() => {
    if (!containerRef.current) return;

    // Estilo Open Source gratuito com camada satélite ESRI World Imagery de alta resolução
    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "satellite-4k": {
            type: "raster",
            tiles: [
              "https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
              "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
              "https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
              "https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            ],
            tileSize: 256,
            attribution: "Google Satellite 4K Imagery",
            maxzoom: 21,
          },
        },
        layers: [
          {
            id: "satellite-4k-layer",
            type: "raster",
            source: "satellite-4k",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [CARAIVA_CENTER_COORDS.lng, CARAIVA_CENTER_COORDS.lat],
      maxZoom: 19,
      minZoom: 11,
      zoom: 15.6,
      pitch: 58, // Ângulo 3D inclinado cinematográfico
      bearing: 25, // Rotação da câmera para ver rio, restinga e mar
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      callbacks.current.onReady();
    });

    map.on("error", (e: unknown) => {
      console.warn("Open3DMap warning:", e);
    });

    return () => {
      if (avatarMarkerRef.current) {
        avatarMarkerRef.current.remove();
        avatarMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Atualização dos Marcadores 3D Interativos
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove marcadores anteriores
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Adiciona os pontos de Caraíva
    props.points.forEach((point) => {
      const el = document.createElement("div");
      el.className = "clm-orb-container";
      el.style.cursor = "pointer";
      el.style.transform = "translate(-50%, -50%)";

      el.innerHTML = orbSvg(
        {
          id: point.business.id,
          points: [point],
          position: point.position,
          x: 0,
          y: 0,
        },
        props.selectedId
      );

      el.addEventListener("click", (e: MouseEvent) => {
        e.stopPropagation();
        callbacks.current.onSelect(point);
      });

      const marker = new Marker({ element: el })
        .setLngLat([point.position.lng, point.position.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Posição do usuário (GPS) se disponível
    if (props.userPosition) {
      const userEl = document.createElement("div");
      userEl.innerHTML = `<div style="width:20px;height:20px;border-radius:50%;background:#38BDF8;border:3px solid #FFFFFF;box-shadow:0 0 12px rgba(56,189,248,0.8);"></div>`;
      const userMarker = new Marker({ element: userEl })
        .setLngLat([props.userPosition.lng, props.userPosition.lat])
        .addTo(map);
      markersRef.current.push(userMarker);
    }
  }, [props.points, props.selectedId, props.userPosition]);

  // Suporte a Polilinha da Rota Ativa
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const sourceId = "caraiva-active-route";
    const layerId = "caraiva-active-route-line";
    const glowLayerId = "caraiva-active-route-glow";

    if (!props.activeRouteCoordinates || props.activeRouteCoordinates.length < 2) {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getLayer(glowLayerId)) map.removeLayer(glowLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      return;
    }

    const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: props.activeRouteCoordinates.map((c) => [c.lng, c.lat]),
      },
    };

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as GeoJSONSource).setData(geojson);
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });

      // Brilho exterior da rota (glow neon)
      map.addLayer({
        id: glowLayerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#14B8A6",
          "line-width": 8,
          "line-opacity": 0.45,
        },
      });

      // Linha principal da rota (areia dourada/turquesa)
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#F59E0B",
          "line-width": 4,
          "line-opacity": 0.95,
        },
      });
    }
  }, [props.activeRouteCoordinates]);

  // Avatar Cartoon Animado de Caraíva (caminhando fisicamente pelas ruas de areia na rota ativa)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const pov = props.command.povCamera;
    const active = props.activeAvatar;
    const coords =
      active?.coords ||
      pov?.coords ||
      (props.activeRouteCoordinates && props.activeRouteCoordinates.length > 0
        ? props.activeRouteCoordinates[0]
        : null);

    if (!coords) {
      if (avatarMarkerRef.current) {
        avatarMarkerRef.current.remove();
        avatarMarkerRef.current = null;
      }
      return;
    }

    const bearing = active?.bearing ?? pov?.bearing ?? 0;
    const isWalking = Boolean(
      active?.isWalking ?? pov?.isWalking ?? (props.command.povCamera !== undefined || (props.activeRouteCoordinates && props.activeRouteCoordinates.length > 0))
    );
    const mode = active?.mode ?? pov?.mode ?? "third_person";
    const label =
      mode === "first_person"
        ? "👁️ 1ª Pessoa (Pé na Areia)"
        : "🚶 Nativo de Caraíva";

    if (!avatarMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "caraiva-avatar-marker-wrapper";
      el.setAttribute("data-mode", mode);
      el.innerHTML = createAvatarContent({ bearing, isWalking, label });

      const marker = new Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([coords.lng, coords.lat])
        .addTo(map);

      avatarMarkerRef.current = marker;
    } else {
      const marker = avatarMarkerRef.current;
      marker.setLngLat([coords.lng, coords.lat]);
      const el = marker.getElement();
      el.setAttribute("data-mode", mode);
      el.innerHTML = createAvatarContent({ bearing, isWalking, label });
    }
  }, [
    props.command.povCamera,
    props.activeAvatar,
    props.activeRouteCoordinates,
  ]);

  // Voo suave de câmera ao selecionar um ponto
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !props.selectedId) return;

    const selected = props.points.find((p) => p.business.id === props.selectedId);
    if (selected) {
      map.flyTo({
        center: [selected.position.lng, selected.position.lat],
        zoom: 17.2,
        pitch: 62,
        duration: 1200,
        essential: true,
      });
    }
  }, [props.selectedId, props.points]);

  // Comandos de câmera externos (Reset, Zoom e Câmera POV em 1ª Pessoa)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (props.command.povCamera) {
      const { coords, bearing, pitch, zoom } = props.command.povCamera;
      map.flyTo({
        center: [coords.lng, coords.lat],
        bearing,
        pitch,
        zoom,
        duration: 800,
        essential: true,
      });
    } else if (props.command.reset) {
      map.flyTo({
        center: [CARAIVA_CENTER_COORDS.lng, CARAIVA_CENTER_COORDS.lat],
        zoom: 15.6,
        pitch: 58,
        bearing: 25,
        duration: 1000,
      });
    } else if (props.command.zoomBy) {
      map.zoomTo(map.getZoom() + props.command.zoomBy, { duration: 400 });
    }
  }, [props.command]);

  return (
    <div
      ref={containerRef}
      className="clm-engine clm-open-3d"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      aria-label="Mapa 3D Aberto e Gratuito de Caraíva"
    />
  );
}
