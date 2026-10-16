import type { Business } from '../data/caraivaDigitalData';

export type SetupDraft = {
  version: 1; id: string; step: number; savedAt: string; completed: boolean;
  name: string; category: Business['category']; logo: string; ownerName: string; ownerRole: string;
  email: string; whatsapp: string; phone: string; instagram: string; website: string;
  shortDescription: string; description: string; priceLevel: string; priceDescription: string;
  address: string; locationReference: string; walkingDirections: string; latitude: string; longitude: string;
  schedule: { day: string; open: boolean; from: string; to: string }[]; specialSeasonHours: string;
  tags: string; amenities: string; paymentMethods: string;
  menuList: { id: string; name: string; description: string; price: string; isHighlight: boolean; dietaryFlags: string }[];
  cover: string; gallery: { id: string; url: string; caption: string }[];
  primaryCtaLabel: string; primaryCtaCustomMessage: string; secondaryCtaLabel: string; secondaryCtaUrl: string;
};
export const setupSteps = ['Identidade', 'Contato', 'Localização', 'Horários', 'Catálogo', 'Fotos e detalhes', 'Botões', 'Revisão'];
export function setupId(): string {
  const ref = new URLSearchParams(location.search).get('cadastro');
  if (ref && /^[a-zA-Z0-9_-]{1,80}$/.test(ref)) return ref;
  try { return localStorage.getItem('caraiva:merchant:current') || crypto.randomUUID(); } catch { return crypto.randomUUID(); }
}
export function newSetup(id: string, business?: Partial<Business>): SetupDraft {
  return { version: 1, id, step: 0, savedAt: '', completed: false, name: business?.name || '', category: business?.category || 'lojas', logo: '', ownerName: '', ownerRole: 'Proprietário(a)', email: business?.email || '', whatsapp: business?.whatsapp || '', phone: business?.phone || '', instagram: business?.instagram || '', website: business?.website || '', shortDescription: business?.shortDescription || '', description: business?.description || '', priceLevel: business?.priceLevel || '', priceDescription: business?.priceDescription || '', address: business?.address || '', locationReference: business?.locationReference || '', walkingDirections: '', latitude: business?.latitude?.toString() || '', longitude: business?.longitude?.toString() || '', schedule: ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'].map(day => ({ day, open: false, from: '', to: '' })), specialSeasonHours: '', tags: business?.tags?.join(', ') || '', amenities: business?.amenities?.join(', ') || '', paymentMethods: business?.paymentMethods?.join(', ') || '', menuList: business?.menuHighlights?.map((item, i) => ({ id: String(i), name: item.name, description: item.description || '', price: item.price, isHighlight: item.isHighlight || false, dietaryFlags: '' })) || [], cover: business?.cover_image || '', gallery: business?.gallery?.map((url, i) => ({ id: String(i), url, caption: '' })) || [], primaryCtaLabel: business?.ctaLabel || 'Acessar no app', primaryCtaCustomMessage: '', secondaryCtaLabel: '', secondaryCtaUrl: '' };
}
export function loadSetup(id: string, business?: Partial<Business>): SetupDraft {
  const blank = newSetup(id, business);
  try {
    const stored = JSON.parse(localStorage.getItem('caraiva:merchant:' + id) || 'null');
    if (stored?.version !== 1 || stored.id !== id) return blank;
    // Local drafts are editable input, never a source of permissions.
    const draft = { ...blank };
    for (const key of Object.keys(blank) as (keyof SetupDraft)[]) {
      if (typeof blank[key] === 'string' && typeof stored[key] === 'string') Object.assign(draft, { [key]: stored[key] });
    }
    draft.completed = stored.completed === true;
    draft.step = Math.max(0, Math.min(7, Math.floor(Number(stored.step) || 0)));
    for (const key of ['schedule', 'menuList', 'gallery'] as const) {
      const values = stored[key];
      if (Array.isArray(values) && values.every(value => value && typeof value === 'object' &&
        (key === 'schedule' ? typeof value.day === 'string' && typeof value.open === 'boolean' && typeof value.from === 'string' && typeof value.to === 'string' :
        key === 'gallery' ? typeof value.id === 'string' && typeof value.url === 'string' && typeof value.caption === 'string' :
        typeof value.id === 'string' && typeof value.name === 'string' && typeof value.description === 'string' && typeof value.price === 'string' && typeof value.isHighlight === 'boolean' && typeof value.dietaryFlags === 'string'))) Object.assign(draft, { [key]: values });
    }
    return draft;
  } catch { return blank; }
}
export function saveSetup(draft: SetupDraft) {
  const value = { ...draft, savedAt: new Date().toISOString() };
  localStorage.setItem('caraiva:merchant:' + draft.id, JSON.stringify(value));
  localStorage.setItem('caraiva:merchant:current', draft.id);
  return value;
}
export function essentialErrors(draft: SetupDraft): string[] {
  const errors: string[] = [];
  if (!draft.name.trim()) errors.push('Informe o nome do estabelecimento.');
  if (!['lojas','restaurantes','bares','cafes','hospedagens','passeios','noite'].includes(draft.category)) errors.push('Escolha a categoria do estabelecimento.');
  if (!draft.ownerName.trim()) errors.push('Informe o nome do responsável.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.push('Informe um e-mail válido do responsável.');
  if (!/^\d{10,15}$/.test(draft.whatsapp.replace(/\D/g, ''))) errors.push('Informe o WhatsApp comercial com DDD.');
  if (draft.latitude !== '' && (!Number.isFinite(Number(draft.latitude)) || Math.abs(Number(draft.latitude)) > 90)) errors.push('Confira a latitude.');
  if (draft.longitude !== '' && (!Number.isFinite(Number(draft.longitude)) || Math.abs(Number(draft.longitude)) > 180)) errors.push('Confira a longitude.');
  for (const [label, value] of [['site', draft.website], ['link do botão secundário', draft.secondaryCtaUrl]]) {
    if (!value.trim()) continue;
    try { const url = new URL(value.trim()); if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error(); }
    catch { errors.push(`Informe um ${label} válido começando com https:// ou http://.`); }
  }
  return errors;
}
export function setupPending(draft: SetupDraft) {
  return [!draft.logo && 'Adicionar logo', !draft.shortDescription.trim() && 'Escrever frase de destaque', !draft.locationReference.trim() && !draft.address.trim() && 'Completar localização', !draft.schedule.some(day => day.open && day.from && day.to) && 'Informar horários', !draft.menuList.length && 'Adicionar produtos ou serviços', !draft.cover && 'Escolher foto de capa'].filter(Boolean) as string[];
}
// Cadastro e edição compartilham o mesmo formato. Publicação será uma operação autenticada do backend.
export function businessPayload(draft: SetupDraft) {
  return { name: draft.name.trim(), category: draft.category, logo: draft.logo, shortDescription: draft.shortDescription, description: draft.description, whatsapp: draft.whatsapp, phone: draft.phone, instagram: draft.instagram, website: draft.website, address: draft.address, locationReference: draft.locationReference, walkingDirections: draft.walkingDirections, latitude: draft.latitude === '' ? null : Number(draft.latitude), longitude: draft.longitude === '' ? null : Number(draft.longitude), schedule: draft.schedule, specialSeasonHours: draft.specialSeasonHours, priceLevel: draft.priceLevel, priceDescription: draft.priceDescription, tags: draft.tags, amenities: draft.amenities, paymentMethods: draft.paymentMethods, menuList: draft.menuList, cover_image: draft.cover, galleryPhotos: draft.gallery, primaryCtaLabel: draft.primaryCtaLabel, primaryCtaCustomMessage: draft.primaryCtaCustomMessage, secondaryCtaLabel: draft.secondaryCtaLabel, secondaryCtaUrl: draft.secondaryCtaUrl };
}
