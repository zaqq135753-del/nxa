/**
 * Geolocation Service and React Hook for Caraíva Digital
 * Suporte a GPS real, cálculo de distância Haversine e fallback transparente para a Vila de Caraíva.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { type LatLngLiteral, type UserLocationState, CARAIVA_CENTER_COORDS } from "./types";

/**
 * Calcula a distância ortodrômica (Haversine) entre dois pontos em metros.
 */
export function calculateHaversineDistanceMeters(
  coord1: LatLngLiteral,
  coord2: LatLngLiteral
): number {
  const R = 6371000; // Raio da Terra em metros
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formata distância em metros para string legível (ex: "180 m" ou "1,4 km").
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const km = (meters / 1000).toFixed(1).replace(".", ",");
  return `${km} km`;
}

/**
 * Estima tempo de caminhada a pé considerando ritmo médio na areia de Caraíva (4 km/h ~ 66 m/min).
 */
export function estimateWalkingMinutes(meters: number): number {
  const walkingSpeedMetersPerMinute = 65; // Ritmo na areia fofa
  return Math.max(1, Math.ceil(meters / walkingSpeedMetersPerMinute));
}

/**
 * Hook para monitoramento da localização do usuário com fallback de segurança
 */
export function useUserLocation() {
  const [locationState, setLocationState] = useState<UserLocationState>({
    coords: CARAIVA_CENTER_COORDS,
    isDefault: true,
    isLocating: false,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        isLocating: false,
        error: "Geolocalização não suportada no navegador.",
      }));
      return;
    }

    setLocationState((prev) => ({ ...prev, isLocating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords: LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Verifica se o usuário está razoavelmente próximo de Caraíva / Bahia
        // (Distância < 50km da vila). Se estiver muito longe (ex: SP/RJ), mantemos a opção de usar o centro da vila para navegação das ruas.
        const distToCaraiva = calculateHaversineDistanceMeters(userCoords, CARAIVA_CENTER_COORDS);
        const isFarAway = distToCaraiva > 50000;

        setLocationState({
          coords: isFarAway ? CARAIVA_CENTER_COORDS : userCoords,
          accuracy: position.coords.accuracy,
          isDefault: isFarAway,
          isLocating: false,
          error: isFarAway
            ? "Você está fora de Caraíva. Exibindo rota a partir do centrinho da vila."
            : null,
          timestamp: position.timestamp,
        });
      },
      (err) => {
        let msg = "GPS indisponível.";
        if (err.code === 1) msg = "Permissão de localização negada.";
        if (err.code === 3) msg = "Tempo esgotado ao buscar sinal de GPS.";

        setLocationState((prev) => ({
          ...prev,
          coords: CARAIVA_CENTER_COORDS,
          isDefault: true,
          isLocating: false,
          error: msg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Monitora alterações contínuas de posição quando em navegação
  const startWatching = useCallback(() => {
    if (!navigator.geolocation || watchIdRef.current !== null) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords: LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const dist = calculateHaversineDistanceMeters(coords, CARAIVA_CENTER_COORDS);
        if (dist <= 50000) {
          setLocationState((prev) => ({
            ...prev,
            coords,
            accuracy: position.coords.accuracy,
            isDefault: false,
            timestamp: position.timestamp,
          }));
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  }, []);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Tenta obter localização inicial
    requestLocation();
    return () => {
      stopWatching();
    };
  }, [requestLocation, stopWatching]);

  return {
    ...locationState,
    requestLocation,
    startWatching,
    stopWatching,
  };
}
