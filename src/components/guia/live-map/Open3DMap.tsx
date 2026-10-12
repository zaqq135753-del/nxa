import { useEffect, useRef } from "react";
import { Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { type LiveMapEngineProps } from "../../../services/maps/liveMapModel";
import { CARAIVA_CENTER_COORDS } from "../../../services/maps/types";
import { orbSvg } from "./mapOrb";

export default function Open3DMap(props: LiveMapEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
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
          "esri-satellite": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Esri World Imagery",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "esri-satellite-layer",
            type: "raster",
            source: "esri-satellite",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [CARAIVA_CENTER_COORDS.lng, CARAIVA_CENTER_COORDS.lat],
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

  // Comandos de zoom / reset externos
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (props.command.reset) {
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
