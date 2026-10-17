import type { Business } from '../data/caraivaDigitalData';

export type PlanItem = { id: string; businessId: string; name: string; category: string; time: string; reason: string };
export type TravelPreferences = { budget: number; people: number; interest: string };
export const PLAN_KEY = 'caraiva:journey:plan:v1';
export function readPlan(): PlanItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PLAN_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item: unknown): item is PlanItem => typeof item === 'object' && item !== null && 'id' in item && typeof item.id === 'string' && 'businessId' in item && typeof item.businessId === 'string' && 'name' in item && typeof item.name === 'string' && 'time' in item && typeof item.time === 'string' && 'category' in item && typeof item.category === 'string' && 'reason' in item && typeof item.reason === 'string') : [];
  } catch { return []; }
}
export function savePlan(items: PlanItem[]): void {
  localStorage.setItem(PLAN_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('caraiva:journey'));
}
export function addPlanBusiness(business: Business, time = '', reason = 'Escolhido por você'): void {
  const items = readPlan();
  if (!items.some(item => item.businessId === business.id)) savePlan([...items, { id: crypto.randomUUID(), businessId: business.id, name: business.name, category: business.category, time, reason }]);
}
export function scoreBusiness(business: Business, query: string): { score: number; reasons: string[] } {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const text = normalize([business.name, business.category, business.description, ...business.tags, ...business.amenities].join(' '));
  const words = normalize(query).split(/\W+/).filter(word => word.length > 2 && !['quero','para','com','uma','lugar','agora','ate','por','pessoa'].includes(word));
  const synonyms: Record<string, string[]> = { comer: ['restaurante','gastronomia'], jantar: ['restaurante','bar'], criancas: ['familia','infantil'], tranquilo: ['tranquilidade','sossego'], praia: ['praia','mar'], cafe: ['cafe'], forro: ['forro','noite'] };
  const matches = words.filter(word => [word, ...(synonyms[word] ?? [])].some(term => text.includes(term)));
  return { score: matches.length, reasons: matches.slice(0, 2).map(word => `O cadastro menciona ${word}`) };
}
export function reservationMode(category: string): string {
  return ({ hospedagens: 'room', passeios: 'tour', restaurantes: 'table', bares: 'table', cafes: 'table', noite: 'ticket' } as Record<string, string>)[category] ?? 'goods';
}
export function buildDay(businesses: Business[], preferences: TravelPreferences): PlanItem[] {
  const lowerPrice = (business: Business): number | null => {
    const match = (business.priceDescription ?? '').match(/R\$\s*([\d.]+(?:,\d{1,2})?)/);
    if (!match) return null;
    const value = Number(match[1].replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(value) ? value : null;
  };
  let remaining = preferences.budget;
  const periods = [{ time: '09:00', categories: ['cafes','praias','pontos'] }, { time: '12:00', categories: ['restaurantes','bares'] }, { time: '15:00', categories: ['passeios','praias','pontos'] }];
  const selected = new Set<string>();
  return periods.flatMap(period => {
    const candidates = businesses.filter(business => period.categories.includes(business.category) && !selected.has(business.id) && (lowerPrice(business) === null || lowerPrice(business)! <= remaining));
    candidates.sort((a, b) => scoreBusiness(b, preferences.interest).score - scoreBusiness(a, preferences.interest).score);
    const business = candidates[0];
    if (!business) return [];
    selected.add(business.id);
    const reasons = scoreBusiness(business, preferences.interest).reasons;
    const estimate = lowerPrice(business);
    if (estimate !== null) { remaining = Math.max(0, remaining - estimate); reasons.push(`Faixa do cadastro a partir de R$ ${estimate.toLocaleString('pt-BR')}, sujeita a confirmação`); }
    else reasons.push('Preço ainda não informado para esta etapa');
    return [{ id: crypto.randomUUID(), businessId: business.id, name: business.name, category: business.category, time: period.time, reason: reasons.join(' · ') || 'Sugestão pela categoria e período do dia' }];
  });
}
