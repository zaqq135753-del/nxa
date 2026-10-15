"use client";
import { useEffect, useState, useCallback } from "react";
import type { Split } from "./pricing";
import { canCheckIn, bookedSeats } from "./businessRules";
import { 
  products as initialProducts, 
  rooms as initialRooms, 
  tours as initialTours, 
  services as initialServices, 
  retailItems as initialRetailItems,
  type Product, 
  type Room, 
  type Tour, 
  type WellnessService, 
  type RetailItem 
} from "./data";

export type OrderStatus = "novo" | "preparando" | "em_rota" | "entregue" | "recusado";
export type BookingKind = "quarto" | "passeio" | "servico";

export interface Order {
  id: string;
  establishmentId: string;
  items: { name: string; qty: number; price: number }[];
  address: string;
  zone: string;
  split: Split;
  status: OrderStatus;
  createdAt: number;
  etaMin?: number;
  paymentStatus?: "simulated" | "pending" | "paid";
}

export interface Booking {
  id: string;
  kind: BookingKind;
  refId: string;
  title: string;
  guest: string;
  start: string;
  end?: string;
  seats?: number;
  split: Split;
  createdAt: number;
  checkedIn?: boolean;
  paymentStatus?: "simulated" | "pending" | "paid";
}

interface State { 
  version: 3;
  orders: Order[]; 
  bookings: Booking[];
  products: Product[];
  rooms: Room[];
  tours: Tour[];
  services: WellnessService[];
  retailItems: RetailItem[];
}

const KEY = "caraiva-demo-v2";

const defaultState: State = { 
  version: 3,
  orders: [], 
  bookings: [],
  products: initialProducts,
  rooms: initialRooms,
  tours: initialTours,
  services: initialServices,
  retailItems: initialRetailItems,
};

const read = (): State => {
  if (typeof window === "undefined") return defaultState;
  try { 
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      version: 3,
      orders: parsed.orders ?? defaultState.orders,
      bookings: parsed.bookings ?? defaultState.bookings,
      products: parsed.products ?? defaultState.products,
      rooms: parsed.rooms ?? defaultState.rooms,
      tours: (parsed.tours ?? defaultState.tours).map(t => parsed.version === 3 ? t :
        { ...t, booked: Math.max(0, t.booked - bookedSeats(t.id, parsed.bookings ?? [])) }),
      services: parsed.services ?? defaultState.services,
      retailItems: parsed.retailItems ?? defaultState.retailItems,
    };
  } catch { 
    return defaultState; 
  }
};

let channel: BroadcastChannel | null = null;
const getChannel = () => (channel ??= typeof window !== "undefined" ? new BroadcastChannel(KEY) : null);

function write(next: State) {
  localStorage.setItem(KEY, JSON.stringify(next));
  getChannel()?.postMessage("sync");
  window.dispatchEvent(new Event(KEY));
}

export function useStore() {
  const [state, setState] = useState<State>(defaultState);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    const ch = getChannel();
    ch?.addEventListener("message", sync);
    window.addEventListener(KEY, sync);
    return () => { 
      ch?.removeEventListener("message", sync); 
      window.removeEventListener(KEY, sync); 
    };
  }, []);

  // --- PEDIDOS & RESERVAS ---
  const addOrder = useCallback((o: Omit<Order, "id" | "createdAt" | "status">) => {
    const order: Order = { ...o, id: `CV-${crypto.randomUUID()}`, createdAt: Date.now(), status: "novo" };
    const s = read(); 

    // Baixa automática de estoque
    const updatedProducts = s.products.map((prod) => {
      if (prod.establishmentId !== o.establishmentId) return prod;
      const item = o.items.find((i) => i.name.toLowerCase() === prod.name.toLowerCase());
      if (!item || prod.stock === undefined) return prod;
      const nextStock = Math.max(0, prod.stock - item.qty);
      return {
        ...prod,
        stock: nextStock,
        available: nextStock > 0,
      };
    });

    write({ 
      ...s, 
      orders: [order, ...s.orders],
      products: updatedProducts 
    }); 
    return order;
  }, []);

  const updateOrder = useCallback((id: string, patch: Partial<Order>) => {
    const s = read(); 
    write({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  }, []);

  const toggleProductAvailability = useCallback((productId: string) => {
    const s = read();
    write({
      ...s,
      products: s.products.map((p) =>
        p.id === productId ? { ...p, available: !p.available } : p
      ),
    });
  }, []);

  const toggleRoomAvailability = useCallback((roomId: string) => {
    const s = read();
    write({
      ...s,
      rooms: s.rooms.map((r) =>
        r.id === roomId ? { ...r, available: r.available === false ? true : false } : r
      ),
    });
  }, []);

  const toggleTourAvailability = useCallback((tourId: string) => {
    const s = read();
    write({
      ...s,
      tours: s.tours.map((t) =>
        t.id === tourId ? { ...t, available: t.available === false ? true : false } : t
      ),
    });
  }, []);

  const addBooking = useCallback((b: Omit<Booking, "id" | "createdAt">) => {
    const booking: Booking = { ...b, id: `CD-${crypto.randomUUID().toUpperCase()}`, createdAt: Date.now() };
    const s = read(); 

    write({ 
      ...s, 
      bookings: [booking, ...s.bookings],
    }); 
    return booking;
  }, []);

  const checkIn = useCallback((id: string, scope: { kind: BookingKind; refIds: readonly string[]; allowSimulation?: boolean }) => {
    const s = read(); 
    const found = s.bookings.find((b) => b.id === id.trim().toUpperCase());
    if (!found || !canCheckIn(found, scope)) return null;
    if (found) {
      write({ ...s, bookings: s.bookings.map((b) => (b.id === found.id ? { ...b, checkedIn: true } : b)) });
    }
    return found ?? null;
  }, []);

  // --- CRUD GESTÃO DE ESTOQUE & PRODUTOS (Delivery, Mercado, Farmácia, Restaurante) ---
  const addProduct = useCallback((p: Omit<Product, "id">) => {
    const product: Product = { ...p, id: `prod-${Date.now().toString(36)}` };
    const s = read();
    write({ ...s, products: [product, ...s.products] });
    return product;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    const s = read();
    write({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    const s = read();
    write({ ...s, products: s.products.filter((p) => p.id !== id) });
  }, []);

  // --- CRUD GESTÃO DE QUARTOS & DIÁRIAS (Pousadas & Mini-PMS) ---
  const addRoom = useCallback((r: Omit<Room, "id">) => {
    const room: Room = { ...r, id: `room-${Date.now().toString(36)}` };
    const s = read();
    write({ ...s, rooms: [...s.rooms, room] });
    return room;
  }, []);

  const updateRoom = useCallback((id: string, patch: Partial<Room>) => {
    const s = read();
    write({ ...s, rooms: s.rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  }, []);

  const deleteRoom = useCallback((id: string) => {
    const s = read();
    write({ ...s, rooms: s.rooms.filter((r) => r.id !== id) });
  }, []);

  // --- CRUD GESTÃO DE PASSEIOS & VAGAS (Náutica & Buggy) ---
  const addTour = useCallback((t: Omit<Tour, "id">) => {
    const tour: Tour = { ...t, id: `tour-${Date.now().toString(36)}` };
    const s = read();
    write({ ...s, tours: [...s.tours, tour] });
    return tour;
  }, []);

  const updateTour = useCallback((id: string, patch: Partial<Tour>) => {
    const s = read();
    write({ ...s, tours: s.tours.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  }, []);

  const deleteTour = useCallback((id: string) => {
    const s = read();
    write({ ...s, tours: s.tours.filter((t) => t.id !== id) });
  }, []);

  // --- CRUD GESTÃO DE SERVIÇOS & SLOTS (Massagem, Yoga, Kite) ---
  const addService = useCallback((sv: Omit<WellnessService, "id">) => {
    const service: WellnessService = { ...sv, id: `serv-${Date.now().toString(36)}` };
    const s = read();
    write({ ...s, services: [...s.services, service] });
    return service;
  }, []);

  const updateService = useCallback((id: string, patch: Partial<WellnessService>) => {
    const s = read();
    write({ ...s, services: s.services.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)) });
  }, []);

  const deleteService = useCallback((id: string) => {
    const s = read();
    write({ ...s, services: s.services.filter((sv) => sv.id !== id) });
  }, []);

  // --- CRUD GESTÃO DE ARTESANATO & VAREJO (Lojas & Pataxó) ---
  const addRetailItem = useCallback((item: Omit<RetailItem, "id">) => {
    const rItem: RetailItem = { ...item, id: `art-${Date.now().toString(36)}` };
    const s = read();
    write({ ...s, retailItems: [...s.retailItems, rItem] });
    return rItem;
  }, []);

  const updateRetailItem = useCallback((id: string, patch: Partial<RetailItem>) => {
    const s = read();
    write({ ...s, retailItems: s.retailItems.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  }, []);

  const deleteRetailItem = useCallback((id: string) => {
    const s = read();
    write({ ...s, retailItems: s.retailItems.filter((item) => item.id !== id) });
  }, []);

  const reset = useCallback(() => write(defaultState), []);

  return { 
    ...state, 
    addOrder, 
    updateOrder, 
    toggleProductAvailability,
    toggleRoomAvailability,
    toggleTourAvailability,
    addBooking, 
    checkIn, 
    addProduct,
    updateProduct,
    deleteProduct,
    addRoom,
    updateRoom,
    deleteRoom,
    addTour,
    updateTour,
    deleteTour,
    addService,
    updateService,
    deleteService,
    addRetailItem,
    updateRetailItem,
    deleteRetailItem,
    reset 
  };
}

/** Alerta sonoro insistente estilo gestor de pedidos (WebAudio, sem arquivo). */
export function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.25, 0.5].forEach((t) => {
      const o = ctx.createOscillator(); 
      const g = ctx.createGain();
      o.frequency.value = 880; 
      o.type = "square"; 
      g.gain.value = 0.08;
      o.connect(g).connect(ctx.destination); 
      o.start(ctx.currentTime + t); 
      o.stop(ctx.currentTime + t + 0.15);
    });
  } catch { /* áudio silenciado */ }
}
