/**
 * Google Maps Street View Service for Caraíva Digital
 * Busca panoramas 360° reais do Google Maps na vila, calcula o ângulo de visão (heading)
 * exato para a fachada do estabelecimento e fornece inicialização robusta de StreetViewPanorama.
 */
import { type LatLngLiteral, type StreetViewResult } from "./types";
import { loadGoogleMaps } from "./googleMapsLoader";
import { calculateHaversineDistanceMeters } from "./geolocation";

/**
 * Calcula o heading (azimute em graus 0-360) do panorama até o local alvo
 * para que a câmera 360° aponte exatamente para a fachada do estabelecimento.
 */
export function computeHeadingToTarget(
  from: LatLngLiteral,
  to: LatLngLiteral
): number {
  if (typeof window !== "undefined" && window.google?.maps?.geometry?.spherical) {
    const fromLatLng = new window.google.maps.LatLng(from.lat, from.lng);
    const toLatLng = new window.google.maps.LatLng(to.lat, to.lng);
    const heading = window.google.maps.geometry.spherical.computeHeading(fromLatLng, toLatLng);
    return (heading + 360) % 360;
  }

  // Fallback trigonométrico
  const y = Math.sin((to.lng - from.lng) * (Math.PI / 180)) * Math.cos(to.lat * (Math.PI / 180));
  const x =
    Math.cos(from.lat * (Math.PI / 180)) * Math.sin(to.lat * (Math.PI / 180)) -
    Math.sin(from.lat * (Math.PI / 180)) *
      Math.cos(to.lat * (Math.PI / 180)) *
      Math.cos((to.lng - from.lng) * (Math.PI / 180));
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Busca o panorama Street View mais próximo do destino com raios adaptativos (50m, 100m, 250m, 500m).
 */
export async function findNearestStreetView(
  target: LatLngLiteral
): Promise<StreetViewResult> {
  try {
    await loadGoogleMaps();

    if (!window.google?.maps) {
      return {
        hasCoverage: false,
        status: "ERROR",
        heading: 0,
        pitch: 0,
        zoom: 1,
        errorMessage: "Google Maps SDK não carregado.",
      };
    }

    const svService = new window.google.maps.StreetViewService();
    const targetLatLng = new window.google.maps.LatLng(target.lat, target.lng);

    // Testamos raios progressivos: 50m (muito perto), 100m (na rua), 250m (trecho próximo), 500m (vila)
    const radii = [50, 100, 250, 500];

    for (const radius of radii) {
      try {
        const result = await new Promise<google.maps.StreetViewPanoramaData | null>(
          (resolve) => {
            svService.getPanorama(
              {
                location: targetLatLng,
                radius,
                preference: window.google.maps.StreetViewPreference.NEAREST,
                source: window.google.maps.StreetViewSource.OUTDOOR,
              },
              (data, status) => {
                if (status === window.google.maps.StreetViewStatus.OK && data) {
                  resolve(data);
                } else {
                  resolve(null);
                }
              }
            );
          }
        );

        if (result && result.location?.latLng) {
          const panoPos: LatLngLiteral = {
            lat: result.location.latLng.lat(),
            lng: result.location.latLng.lng(),
          };

          const heading = computeHeadingToTarget(panoPos, target);
          const distToTarget = calculateHaversineDistanceMeters(panoPos, target);

          return {
            hasCoverage: true,
            status: "OK",
            panoId: result.location.pano,
            location: panoPos,
            heading,
            pitch: 0,
            zoom: distToTarget > 60 ? 1.5 : 1,
            distanceToTargetMeters: distToTarget,
          };
        }
      } catch {
        // Continua para o próximo raio
      }
    }

    // Se nenhum panorama externo foi encontrado nos raios
    return {
      hasCoverage: false,
      status: "NOT_FOUND",
      heading: 0,
      pitch: 0,
      zoom: 1,
      errorMessage: "Sem cobertura oficial do Street View nas imediações imediatas deste ponto de areia.",
    };
  } catch (err: any) {
    return {
      hasCoverage: false,
      status: "ERROR",
      heading: 0,
      pitch: 0,
      zoom: 1,
      errorMessage: err?.message || "Erro ao consultar StreetViewService.",
    };
  }
}
