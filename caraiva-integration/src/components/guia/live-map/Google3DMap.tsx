import { useEffect, useMemo, useRef, useState } from "react";
import { loadMapsLibrary, subscribeMapsAuthFailure } from "../../../services/maps/googleMapsLoader";
import { clusterLiveMapPoints, worldPixel, type LiveMapEngineProps } from "../../../services/maps/liveMapModel";
import { CARAIVA_CENTER_COORDS } from "../../../services/maps/types";
import { orbSvg, orbLabel } from "./mapOrb";

export default function Google3DMap(props: LiveMapEngineProps) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.maps3d.Map3DElement | null>(null);
  const library = useRef<google.maps.Maps3DLibrary | null>(null);
  const callbacks = useRef(props); callbacks.current = props;
  const [initialized,setInitialized] = useState(false);
  const [zoom,setZoom] = useState(16);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clusters = useMemo(() => clusterLiveMapPoints(props.points,p => worldPixel(p.position,zoom),props.selectedId),[props.points,props.selectedId,zoom]);

  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    const unsubscribeAuth = subscribeMapsAuthFailure(() => callbacks.current.onError("3D não autorizado nesta origem. Voltando ao mapa leve."));
    // The first 3D load includes a renderer download and terrain streaming.
    // Give initialization its own deadline rather than sharing a 2D tile budget.
    let timeout = window.setTimeout(() => { if (!cancelled) callbacks.current.onError("O serviço 3D não respondeu. Voltando ao mapa leve."); },45_000);
    loadMapsLibrary("maps3d").then(lib => {
      if (cancelled || !host.current) return;
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => { if (!cancelled) callbacks.current.onError("A cena 3D não carregou. Voltando ao mapa leve."); },45_000);
      library.current = lib;
      const instance = new lib.Map3DElement({center:{...CARAIVA_CENTER_COORDS,altitude:0},range:1600,tilt:55,heading:25,mode:"HYBRID",defaultUIHidden:true,gestureHandling:"GREEDY"});
      map.current = instance;
      const onSteady = (event: google.maps.maps3d.SteadyChangeEvent) => {
        if (event.isSteady) { window.clearTimeout(timeout); if (!cancelled) callbacks.current.onReady(); }
        // Approximate camera scale for clustering only; positions remain geographic.
        setZoom(Math.max(11,Math.min(21,Math.round(16-Math.log2(Math.max(50,instance.range ?? 1600)/1600)))));
      };
      const onError = () => { window.clearTimeout(timeout); if (!cancelled) callbacks.current.onError("3D indisponível nesta sessão. Voltando ao mapa leve."); };
      instance.addEventListener("gmp-steadychange",onSteady);
      instance.addEventListener("gmp-error",onError);
      host.current.append(instance);
      const initialState = instance as google.maps.maps3d.Map3DElement & {isSteady?: boolean};
      if (initialState.isSteady) { window.clearTimeout(timeout); callbacks.current.onReady(); }
      dispose = () => { instance.removeEventListener("gmp-steadychange",onSteady); instance.removeEventListener("gmp-error",onError); instance.stopCameraAnimation(); instance.remove(); };
      setInitialized(true);
    }).catch(() => { window.clearTimeout(timeout); if (!cancelled) callbacks.current.onError("3D indisponível. Voltando ao mapa leve."); });
    return () => { cancelled = true; unsubscribeAuth(); window.clearTimeout(timeout); dispose(); map.current = null; library.current = null; };
  },[]);

  useEffect(() => {
    const instance = map.current, lib = library.current;
    if (!initialized || !instance || !lib) return;
    const markers: google.maps.maps3d.Marker3DElement[] = clusters.map(cluster => {
      const marker = new lib.Marker3DInteractiveElement({position:cluster.position,altitudeMode:"CLAMP_TO_GROUND",sizePreserved:true,drawsWhenOccluded:true,title:orbLabel(cluster),zIndex:cluster.points.some(p => p.business.id === props.selectedId) ? 100 : 1});
      const template = document.createElement("template"); template.innerHTML = orbSvg(cluster,props.selectedId); marker.append(template);
      marker.addEventListener("gmp-click",() => {
        if (cluster.points.length === 1) callbacks.current.onSelect(cluster.points[0]);
        else instance.flyCameraTo({endCamera:{center:{...cluster.position,altitude:0},range:Math.max(80,(instance.range ?? 1600)/4),tilt:instance.tilt},durationMillis:reducedMotion ? 0 : 800});
      });
      instance.append(marker); return marker;
    });
    if (props.userPosition) {
      const user = new lib.Marker3DElement({position:props.userPosition,altitudeMode:"CLAMP_TO_GROUND",sizePreserved:true,label:"Você",drawsWhenOccluded:true});
      const template = document.createElement("template"); template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><circle cx="15" cy="15" r="10" fill="#3F7D83" stroke="#fff" stroke-width="3"/></svg>'; user.append(template); instance.append(user); markers.push(user);
    }
    return () => markers.forEach(marker => marker.remove());
  },[initialized,clusters,props.selectedId,props.userPosition,reducedMotion]);

  useEffect(() => {
    const selected = props.points.find(point => point.business.id === props.selectedId);
    if (selected && map.current) map.current.flyCameraTo({endCamera:{center:{...selected.position,altitude:0},range:450,tilt:60},durationMillis:reducedMotion ? 0 : 900});
  },[initialized,props.selectedId,reducedMotion]);
  useEffect(() => {
    const instance = map.current; if (!instance) return;
    const center = props.command.reset ? CARAIVA_CENTER_COORDS : props.command.center;
    const range = props.command.reset ? 1600 : props.command.zoomBy ? Math.max(60,Math.min(16000,(instance.range ?? 1600)*2**-props.command.zoomBy)) : instance.range;
    instance.flyCameraTo({endCamera:{center:center ? {...center,altitude:0} : instance.center,range,tilt:55},durationMillis:reducedMotion ? 0 : 700});
  },[initialized,props.command,reducedMotion]);
  return <div ref={host} className="clm-engine" aria-label="Mapa Google 3D de Caraíva" />;
}
