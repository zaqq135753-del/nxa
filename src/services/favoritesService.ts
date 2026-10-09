/**
 * Caraíva Digital — Favorites & Itinerary Service ("Minha Caraíva")
 * Gerencia estabelecimentos salvos e o roteiro personalizado "Meu Dia em Caraíva".
 */

import { trackEvent } from "./analytics";

export interface ItineraryItem {
  id: string;
  time: string;
  spotId: string;
  spotName: string;
  activityTitle: string;
  category: string;
  tip: string;
}

const FAVORITES_STORAGE_KEY = "caraiva_digital_favorites";
const ITINERARY_STORAGE_KEY = "caraiva_digital_itinerary";

// Roteiro padrão autêntico de Caraíva
const DEFAULT_ITINERARY: ItineraryItem[] = [
  {
    id: "itin-1",
    time: "09:00",
    spotId: "canto-da-duca",
    spotName: "Canto da Duca",
    activityTitle: "Café Colonial & Torta dos Deuses",
    category: "Café",
    tip: "Peça a torta de banana quentinha e um café passado no coador.",
  },
  {
    id: "itin-2",
    time: "11:00",
    spotId: "praia-da-barra-caraiva",
    spotName: "Praia da Barra",
    activityTitle: "Banho no Encontro do Rio com o Mar",
    category: "Praia",
    tip: "Aproveite a maré baixa para alternar entre água doce e salgada.",
  },
  {
    id: "itin-3",
    time: "17:00",
    spotId: "boteco-do-para",
    spotName: "Boteco do Pará",
    activityTitle: "Pastel de Arraia & Pôr do Sol no Rio",
    category: "Comer & Sunset",
    tip: "Chegue às 16h45 para garantir mesa de madeira sob as amendoeiras.",
  },
  {
    id: "itin-4",
    time: "20:30",
    spotId: "bar-do-porto",
    spotName: "Bar do Porto",
    activityTitle: "Jantar Romântico à Luz de Velas",
    category: "Restaurante",
    tip: "Mesa no deck do rio ouvindo jazz acústico e marulho das canoas.",
  },
  {
    id: "itin-5",
    time: "23:00",
    spotId: "forro-do-ourico",
    spotName: "Forró do Ouriço",
    activityTitle: "Dançar Forró Pé-de-Serra na Areia",
    category: "Noite",
    tip: "Sanfona ao vivo até as 05h da manhã. Vista sapatos confortáveis ou vá descalço.",
  },
];

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ["boteco-do-para", "canto-da-duca", "forro-do-ourico"];
  } catch {
    return ["boteco-do-para", "canto-da-duca", "forro-do-ourico"];
  }
}

export function isFavorite(spotId: string): boolean {
  return getFavorites().includes(spotId);
}

export function toggleFavorite(spotId: string, spotName?: string): boolean {
  const current = getFavorites();
  const exists = current.includes(spotId);
  const updated = exists ? current.filter((id) => id !== spotId) : [...current, spotId];

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    trackEvent(exists ? "favorite_removed" : "favorite_added", {
      businessId: spotId,
      businessName: spotName,
      source: "app",
    });
    window.dispatchEvent(new CustomEvent("caraiva:favorites-updated", { detail: updated }));
  } catch (err) {
    console.warn("Could not save favorite", err);
  }

  return !exists;
}

export function getCustomItinerary(): ItineraryItem[] {
  try {
    const raw = localStorage.getItem(ITINERARY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ITINERARY;
  } catch {
    return DEFAULT_ITINERARY;
  }
}

export const getItinerary = getCustomItinerary;

export function addToItinerary(item: Omit<ItineraryItem, "id">): void {
  const current = getCustomItinerary();
  const newItem: ItineraryItem = {
    ...item,
    id: "itin-" + Date.now(),
  };
  const updated = [...current, newItem].sort((a, b) => a.time.localeCompare(b.time));

  try {
    localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("caraiva:itinerary-updated", { detail: updated }));
  } catch (err) {
    console.warn("Could not save itinerary", err);
  }
}

export function removeFromItinerary(itemId: string): void {
  const current = getCustomItinerary();
  const updated = current.filter((i) => i.id !== itemId);
  try {
    localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("caraiva:itinerary-updated", { detail: updated }));
  } catch (err) {
    console.warn("Could not remove itinerary item", err);
  }
}
