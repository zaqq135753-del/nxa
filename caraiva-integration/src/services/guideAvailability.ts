import { useSyncExternalStore } from 'react';
import { ecosystemCloud as db } from './ecosystemCloud';
export type Availability = { receiving: boolean; hasCatalog: boolean; consultedAt: string; demo: boolean; highlight?: string };
let snapshot: Record<string, Availability> = {};
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let pending = false;
async function refresh() {
  if (!db || pending || !navigator.onLine) return;
  pending = true;
  try {
    const [businesses, items] = await Promise.all([db.from('cd_businesses').select('id,accepting_orders,is_demo').eq('published', true), db.from('cd_offerings').select('business_id,stock,details').eq('available', true)]);
    if (businesses.error || items.error) return;
    const available = new Set((items.data ?? []).filter(item => item.stock === null || item.stock > 0).map(item => item.business_id));
    const consultedAt = new Date().toISOString();
    const highlights = new Map<string,string>();
    for (const item of items.data ?? []) {
      const detail = item.details;
      if (typeof detail === 'object' && detail && !Array.isArray(detail) && typeof detail.public_highlight === 'string' && typeof detail.highlight_expires_at === 'string' && new Date(detail.highlight_expires_at).getTime() > Date.now() && (item.stock === null || item.stock > 0)) highlights.set(item.business_id, detail.public_highlight.slice(0,90));
    }
    snapshot = Object.fromEntries((businesses.data ?? []).map(business => [business.id, { receiving: business.accepting_orders, hasCatalog: available.has(business.id), consultedAt, demo: business.is_demo, highlight: highlights.get(business.id) }]));
    listeners.forEach(listener => listener());
  } catch { snapshot = {}; listeners.forEach(listener => listener()); } finally { pending = false; }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) { void refresh(); timer = setInterval(() => void refresh(), 30000); window.addEventListener('online', refresh); }
  return () => { listeners.delete(listener); if (!listeners.size) { clearInterval(timer); timer = undefined; window.removeEventListener('online', refresh); } };
}
export function useGuideAvailability(businessId: string): Availability | undefined {
  return useSyncExternalStore(subscribe, () => snapshot)[businessId];
}
