import { useEffect, useMemo, useRef, useState } from "react";
import { loadMapsLibrary, subscribeMapsAuthFailure } from "../../../services/maps/googleMapsLoader";
import { clusterLiveMapPoints, worldPixel, type LiveMapEngineProps } from "../../../services/maps/liveMapModel";
import { CARAIVA_CENTER_COORDS } from "../../../services/maps/types";
import { createOrbButton } from "./mapOrb";

const DARK_STYLE: google.maps.MapTypeStyle[] = [
  {elementType:"geometry",stylers:[{color:"#141719"}]},
  {elementType:"labels.text.fill",stylers:[{color:"#94a6a0"}]},
  {elementType:"labels.text.stroke",stylers:[{color:"#090b0c"}]},
  {featureType:"water",stylers:[{color:"#22464b"}]},
  {featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},
  {featureType:"road",elementType:"geometry",stylers:[{color:"#38463f"}]},
];

export default function Google2DMap(props: LiveMapEngineProps) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const callbacks = useRef(props); callbacks.current = props;
  const [initialized,setInitialized] = useState(false);
  const [zoom,setZoom] = useState(16);
  const clusters = useMemo(() => clusterLiveMapPoints(props.points,p => worldPixel(p.position,zoom),props.selectedId),[props.points,props.selectedId,zoom]);

  useEffect(() => {
    let cancelled = false;
    const listeners: google.maps.MapsEventListener[] = [];
    const unsubscribeAuth = subscribeMapsAuthFailure(() => callbacks.current.onError("Base Google não autorizada. Modo ilustrado disponível."));
    const timeout = window.setTimeout(() => { if (!cancelled) callbacks.current.onError("A base 2D não carregou. Modo ilustrado disponível."); },12_000);
    loadMapsLibrary("maps").then(() => {
      if (cancelled || !host.current) return;
      const instance = new google.maps.Map(host.current,{
        center:CARAIVA_CENTER_COORDS,zoom:16,disableDefaultUI:true,gestureHandling:"greedy",styles:DARK_STYLE,
        clickableIcons:false,keyboardShortcuts:true,mapTypeId:"roadmap",minZoom:11,maxZoom:20,
      });
      map.current = instance;
      listeners.push(instance.addListener("idle",() => setZoom(instance.getZoom() ?? 16)));
      listeners.push(instance.addListener("tilesloaded",() => { window.clearTimeout(timeout); if (!cancelled) callbacks.current.onReady(); }));
      setInitialized(true);
    }).catch(() => { window.clearTimeout(timeout); if (!cancelled) callbacks.current.onError("Base 2D indisponível. Modo ilustrado disponível."); });
    return () => {
      cancelled = true; unsubscribeAuth(); window.clearTimeout(timeout); listeners.forEach(listener => listener.remove());
      if (map.current) google.maps.event.clearInstanceListeners(map.current);
      map.current = null; host.current?.replaceChildren();
    };
  },[]);

  useEffect(() => {
    if (!initialized || !map.current) return;
    const instance = map.current;
    class OrbOverlay extends google.maps.OverlayView {
      constructor(private node: HTMLElement,private position: google.maps.LatLngLiteral) { super(); this.setMap(instance); }
      onAdd() { this.getPanes()?.overlayMouseTarget.append(this.node); }
      draw() {
        const point = this.getProjection()?.fromLatLngToDivPixel(new google.maps.LatLng(this.position));
        if (point) { this.node.style.left = `${point.x}px`; this.node.style.top = `${point.y}px`; }
      }
      onRemove() { this.node.remove(); }
    }
    const overlays = clusters.map(cluster => new OrbOverlay(createOrbButton(cluster,props.selectedId,() => {
      if (cluster.points.length === 1) callbacks.current.onSelect(cluster.points[0]);
      else { instance.panTo(cluster.position); instance.setZoom(Math.min(20,(instance.getZoom() ?? 16)+2)); }
    }),cluster.position));
    if (props.userPosition) {
      const user = document.createElement("div"); user.className = "clm-user-position"; user.title = "Sua localização GPS";
      overlays.push(new OrbOverlay(user,props.userPosition));
    }
    return () => overlays.forEach(overlay => overlay.setMap(null));
  },[initialized,clusters,props.selectedId,props.userPosition]);

  useEffect(() => {
    const selected = props.points.find(point => point.business.id === props.selectedId);
    if (selected && map.current) { map.current.panTo(selected.position); map.current.setZoom(Math.max(18,map.current.getZoom() ?? 16)); }
  },[initialized,props.selectedId]); // Camera follows selection, not every GPS/filter refresh.

  useEffect(() => {
    const instance = map.current; if (!instance) return;
    if (props.command.reset) { instance.panTo(CARAIVA_CENTER_COORDS); instance.setZoom(16); }
    if (props.command.center) instance.panTo(props.command.center);
    if (props.command.zoomBy) instance.setZoom(Math.max(11,Math.min(20,(instance.getZoom() ?? 16)+props.command.zoomBy)));
  },[initialized,props.command]);
  return <div ref={host} className="clm-engine" aria-label="Mapa Google 2D de Caraíva" />;
}
