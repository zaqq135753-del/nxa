/**
 * Types & Contracts for Caraíva Digital Google Maps & Street View Experience
 */

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface GuidePlace {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  whatsapp: string;
  rating: number;
  reviewsCount?: number;
  coverImage?: string;
  gallery?: string[];
  priceRange?: string;
  locationReference?: string;
  distanceMeters?: number;
  distanceFormatted?: string;
  walkingMinutes?: number;
  streetViewCoverage?: "verified" | "nearby" | "none" | "unknown";
  streetViewPanoId?: string;
  streetViewHeading?: number;
}

export interface UserLocationState {
  coords: LatLngLiteral;
  accuracy?: number;
  isDefault: boolean; // True if using Caraíva Village fallback
  isLocating: boolean;
  error?: string | null;
  timestamp?: number;
}

export interface RouteStep {
  instructions: string;
  distance: string;
  duration: string;
  startLocation: LatLngLiteral;
  endLocation: LatLngLiteral;
}

export interface WalkingRouteResult {
  origin: LatLngLiteral;
  destination: LatLngLiteral;
  destinationPlace?: GuidePlace;
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  durationText: string;
  walkingMinutes: number;
  path: LatLngLiteral[];
  steps: RouteStep[];
  bounds?: google.maps.LatLngBounds;
  copyrights?: string;
}

export interface StreetViewResult {
  hasCoverage: boolean;
  status: "OK" | "NOT_FOUND" | "ERROR" | "LOADING";
  panoId?: string;
  location?: LatLngLiteral;
  heading: number;
  pitch: number;
  zoom: number;
  distanceToTargetMeters?: number;
  errorMessage?: string;
}

// Centro Oficial da Vila de Caraíva (Praça da Igreja / Centrinho)
export const CARAIVA_CENTER_COORDS: LatLngLiteral = {
  lat: -16.8145,
  lng: -39.1485,
};

// Delimitação geográfica da península de Caraíva
export const CARAIVA_BOUNDS_COORDS = {
  north: -16.7800,
  south: -16.8500,
  east: -39.1200,
  west: -39.1700,
};
