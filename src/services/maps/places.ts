/**
 * Places Adapter and Distance Calculator for Caraíva Digital
 * Normaliza os dados de CARAIVA_BUSINESSES e calcula distâncias em relação ao usuário.
 */
import { CARAIVA_BUSINESSES, type Business } from "../../data/caraivaDigitalData";
import { type GuidePlace, type LatLngLiteral } from "./types";
import {
  calculateHaversineDistanceMeters,
  formatDistance,
  estimateWalkingMinutes,
} from "./geolocation";

/**
 * Converte um objeto Business em GuidePlace normalizado
 */
export function businessToGuidePlace(
  business: Business,
  userLocation?: LatLngLiteral
): GuidePlace {
  const placeLat = business.latitude || -16.8145;
  const placeLng = business.longitude || -39.1485;

  let distanceMeters: number | undefined;
  let distanceFormatted: string | undefined;
  let walkingMinutes: number | undefined;

  if (userLocation) {
    distanceMeters = calculateHaversineDistanceMeters(userLocation, {
      lat: placeLat,
      lng: placeLng,
    });
    distanceFormatted = formatDistance(distanceMeters);
    walkingMinutes = estimateWalkingMinutes(distanceMeters);
  }

  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    category: business.category,
    subcategory: business.subcategory || business.subCategory,
    description: business.description,
    shortDescription: business.shortDescription,
    address: business.address,
    latitude: placeLat,
    longitude: placeLng,
    phone: business.phone,
    whatsapp: business.whatsapp || business.whatsappNumber || "",
    rating: business.rating,
    reviewsCount: business.review_count || business.reviewsCount,
    coverImage: business.cover_image || business.heroImage,
    gallery: business.gallery,
    priceRange: business.price_range,
    locationReference: business.locationReference,
    distanceMeters,
    distanceFormatted,
    walkingMinutes,
    streetViewCoverage: "unknown",
  };
}

/**
 * Retorna todos os locais de Caraíva enriquecidos com distâncias calculadas em tempo real
 */
export function getGuidePlacesWithDistance(
  userLocation?: LatLngLiteral,
  categoryFilter?: string
): GuidePlace[] {
  let places = CARAIVA_BUSINESSES.map((b) => businessToGuidePlace(b, userLocation));

  if (categoryFilter && categoryFilter !== "todos") {
    places = places.filter((p) => p.category === categoryFilter);
  }

  if (userLocation) {
    // Ordena do mais próximo para o mais distante
    places.sort((a, b) => (a.distanceMeters ?? 999999) - (b.distanceMeters ?? 999999));
  }

  return places;
}
