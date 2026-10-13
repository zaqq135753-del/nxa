import type { Block } from "./ical";
import type { Booking } from "./store";

export const addDays = (iso: string, n: number) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const today = () => new Date().toISOString().slice(0, 10);

/** Bloqueios que viriam dos links iCal do Airbnb/Booking (seed relativo a hoje para a demo). */
export function channelBlocks(roomId: string): Block[] {
  const t = today();
  const seed: Record<string, Block[]> = {
    r1: [{ uid: "airbnb-1", start: addDays(t, 2), end: addDays(t, 5), summary: "Reserved", source: "airbnb" }],
    r2: [{ uid: "booking-1", start: t, end: addDays(t, 2), summary: "CLOSED - Booking.com", source: "booking" }, { uid: "airbnb-2", start: addDays(t, 6), end: addDays(t, 9), summary: "Reserved", source: "airbnb" }],
    r3: [{ uid: "booking-2", start: addDays(t, 1), end: addDays(t, 4), summary: "CLOSED - Booking.com", source: "booking" }],
  };
  return seed[roomId] ?? [];
}

/** Reservas feitas no Caraíva Digital viram bloqueios (e são exportadas no .ics). */
export const appBlocks = (roomId: string, bookings: Booking[]): Block[] =>
  bookings.filter((b) => b.kind === "quarto" && b.refId === roomId && b.end).map((b) => ({ uid: b.id, start: b.start, end: b.end!, summary: b.guest, source: "caraiva" }));

export const allBlocks = (roomId: string, bookings: Booking[]) => [...channelBlocks(roomId), ...appBlocks(roomId, bookings)];

/** Vagas ocupadas = base do operador + reservas feitas pelo app. */
export const seatsTaken = (tourId: string, base: number, bookings: Booking[]) =>
  base + bookings.filter((b) => b.kind === "passeio" && b.refId === tourId).reduce((s, b) => s + (b.seats ?? 0), 0);
