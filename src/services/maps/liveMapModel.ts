import type { Business, EventItem } from "../../data/caraivaDigitalData";
import { calculateHaversineDistanceMeters, estimateWalkingMinutes } from "./geolocation";
import type { LatLngLiteral } from "./types";

export type LiveMapCategory = "todos" | "para_mim" | "comer" | "agora" | "praias" | "passeios" | "hospedar";
export type LiveMapMode = "3d" | "2d" | "illustrated";
export interface LiveMapFilters { category: LiveMapCategory; query: string; openOnly: boolean; nearbyOnly: boolean; maxPrice: number }
export interface LiveMapPoint {
  business: Business; position: LatLngLiteral; open: boolean; statusSource: "snapshot"; recommended: boolean; partner: boolean;
  events: EventItem[]; distanceMeters?: number; estimatedWalkingMinutes?: number;
}
export interface MapCluster { id: string; points: LiveMapPoint[]; position: LatLngLiteral; x: number; y: number }
export interface MapCameraCommand {
  id: number;
  center?: LatLngLiteral;
  zoomBy?: number;
  reset?: boolean;
  povCamera?: {
    coords: LatLngLiteral;
    bearing: number;
    pitch: number;
    zoom: number;
  };
}
export interface LiveMapEngineProps {
  points: LiveMapPoint[];
  selectedId?: string;
  userPosition?: LatLngLiteral;
  command: MapCameraCommand;
  activeRouteCoordinates?: LatLngLiteral[];
  onSelect: (point: LiveMapPoint) => void;
  onReady: () => void;
  onError: (reason: string) => void;
}
export const DEFAULT_MAP_FILTERS: LiveMapFilters = { category: "todos", query: "", openOnly: false, nearbyOnly: false, maxPrice: 4 };
export const normalizeMapQuery = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();

export function adaptLiveMapPoints(businesses: Business[], events: EventItem[], favorites: string[], userPosition?: LatLngLiteral, now = Date.now()): LiveMapPoint[] {
  const saved = new Set(favorites);
  return businesses.filter(b => Number.isFinite(b.latitude) && Math.abs(b.latitude) <= 90 && Number.isFinite(b.longitude) && Math.abs(b.longitude) <= 180).map(business => {
    const position = { lat: business.latitude, lng: business.longitude };
    const distanceMeters = userPosition ? calculateHaversineDistanceMeters(userPosition, position) : undefined;
    return { business, position, open: business.isOpenNow, statusSource: "snapshot", recommended: saved.has(business.id), partner: business.partner,
      events: events.filter(event => event.business_id === business.id && Date.parse(event.start_at) <= now && Date.parse(event.end_at) > now),
      distanceMeters, estimatedWalkingMinutes: distanceMeters === undefined ? undefined : estimateWalkingMinutes(distanceMeters) };
  });
}

export function filterLiveMapPoints(points: LiveMapPoint[], filters: LiveMapFilters): LiveMapPoint[] {
  const query = normalizeMapQuery(filters.query);
  return points.filter(point => {
    const b = point.business;
    if (filters.category === "para_mim" && !point.recommended) return false;
    if (filters.category === "comer" && !["restaurantes", "bares", "cafes"].includes(b.category)) return false;
    if (filters.category === "agora" && !point.events.length) return false;
    if (filters.category === "praias" && b.category !== "praias") return false;
    if (filters.category === "passeios" && b.category !== "passeios") return false;
    if (filters.category === "hospedar" && b.category !== "hospedagens") return false;
    if (filters.openOnly && !point.open) return false;
    if (filters.nearbyOnly && (point.estimatedWalkingMinutes === undefined || point.estimatedWalkingMinutes > 5)) return false;
    if (b.priceLevel.length > filters.maxPrice) return false;
    return !query || normalizeMapQuery([b.name,b.category,b.subcategory,b.address,...b.tags].join(" ")).includes(query);
  });
}

export function worldPixel(position: LatLngLiteral, zoom: number) {
  const size = 256 * 2 ** zoom;
  const sin = Math.sin(Math.max(-85.0511,Math.min(85.0511,position.lat))*Math.PI/180);
  return { x:(position.lng+180)/360*size, y:(.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*size };
}

// Screen-space grouping only; Google retains geographic rendering/camera control.
export function clusterLiveMapPoints(points: LiveMapPoint[], project: (point: LiveMapPoint) => {x: number; y: number}, selectedId?: string, radius = 60): MapCluster[] {
  const ordered = [...points].sort((a,b) => a.business.id.localeCompare(b.business.id));
  const positions = ordered.map(project);
  const buckets = new Map<string,number[]>();
  const groups: number[][] = [];
  ordered.forEach((point,index) => {
    const {x,y} = positions[index];
    const bx = Math.floor(x/radius), by = Math.floor(y/radius);
    let nearest = -1, nearestDistance = radius;
    for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) {
      for (const group of buckets.get(`${bx+dx}:${by+dy}`) ?? []) {
        const anchor = positions[groups[group][0]];
        const distance = Math.hypot(x-anchor.x,y-anchor.y);
        if (distance < nearestDistance) { nearest = group; nearestDistance = distance; }
      }
    }
    if (point.business.id !== selectedId && nearest !== -1) groups[nearest].push(index);
    else {
      const group = groups.length; groups.push([index]);
      if (point.business.id !== selectedId) {
        const key = `${bx}:${by}`;
        buckets.set(key,[...(buckets.get(key) ?? []),group]);
      }
    }
  });
  return groups.map(indices => {
    const members = indices.map(index => ordered[index]);
    const average = (values: number[]) => values.reduce((sum,value) => sum+value,0)/values.length;
    return { id:members.map(point => point.business.id).join("|"),points:members,
      position:{lat:average(members.map(point => point.position.lat)),lng:average(members.map(point => point.position.lng))},
      x:average(indices.map(index => positions[index].x)),y:average(indices.map(index => positions[index].y)) };
  });
}

export function preferLightMap(environment: {saveData?: boolean; effectiveType?: string; deviceMemory?: number; reducedMotion?: boolean; webgl?: boolean}) {
  return Boolean(environment.saveData || /(^|-)2g$/.test(environment.effectiveType ?? "") || (environment.deviceMemory !== undefined && environment.deviceMemory <= 4) || environment.reducedMotion || !environment.webgl);
}
