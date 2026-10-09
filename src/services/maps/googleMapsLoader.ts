import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
let configured = false;
let loadPromise: Promise<typeof google> | null = null;
export function getGoogleMapsApiKey(): string {
  return String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "").trim();
}
export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey() || (typeof window !== "undefined" && window.google?.maps));
}
// Configure once. Client Maps keys require origin/API restrictions in Google Cloud.
export function loadMapsLibrary<K extends keyof google.maps.ImportLibraryMap>(library: K): Promise<google.maps.ImportLibraryMap[K]> {
  if (typeof window !== "undefined" && window.google?.maps?.importLibrary) {
    return window.google.maps.importLibrary(library) as Promise<google.maps.ImportLibraryMap[K]>;
  }
  if (!configured) {
    const key = getGoogleMapsApiKey();
    if (!key) return Promise.reject(new Error("Google Maps não configurado."));
    setOptions({ key, v: "weekly", language: "pt-BR", region: "BR", authReferrerPolicy: "origin" });
    configured = true;
  }
  return importLibrary(library);
}
// Preserve the contract and libraries needed by existing guide services.
export function loadGoogleMaps(): Promise<typeof google> {
  if (loadPromise) return loadPromise;
  loadPromise = Promise.all(["maps", "geometry", "places", "routes", "streetView"].map(library =>
    loadMapsLibrary(library as keyof google.maps.ImportLibraryMap)
  )).then(() => window.google).catch(error => { loadPromise = null; throw error; });
  return loadPromise;
}
export function isGoogleMapsLoaded(): boolean {
  return typeof window !== "undefined" && Boolean(window.google?.maps?.Map);
}

export function subscribeMapsAuthFailure(listener: () => void): () => void {
  const target = window as Window & {gm_authFailure?: () => void};
  const previous = target.gm_authFailure;
  const handler = () => { try { previous?.(); } finally { listener(); } };
  target.gm_authFailure = handler;
  return () => { if (target.gm_authFailure === handler) target.gm_authFailure = previous; };
}
