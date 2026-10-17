export const niches = {
  restaurante: { label: 'Restaurante', item: 'Prato ou produto', action: 'Cardápio, mesas e TapTable', scene: 'Varanda, mesas e cozinha acolhedora' },
  noite: { label: 'Bar, pub e eventos', item: 'Experiência ou evento', action: 'Cardápio, mesas e ingressos', scene: 'Balcão, varanda e iluminação noturna' },
  pousada: { label: 'Pousada', item: 'Acomodação', action: 'Acomodações e reservas', scene: 'Bangalôs, jardim e redes' },
  passeio: { label: 'Passeios', item: 'Passeio', action: 'Saídas, vagas e reservas', scene: 'Embarcação, rio e píer' },
  mercado: { label: 'Mercado', item: 'Produto', action: 'Catálogo, estoque e pedidos', scene: 'Fachada e produtos da vila' },
  farmacia: { label: 'Farmácia', item: 'Produto', action: 'Catálogo e pedidos', scene: 'Fachada e balcão de atendimento' },
  loja: { label: 'Loja', item: 'Produto', action: 'Catálogo e pedidos', scene: 'Vitrine e peças em destaque' },
  servico: { label: 'Serviços', item: 'Serviço', action: 'Serviços e agendamentos', scene: 'Ambiente de atendimento e jardim' },
} as const;
export type ActivationNiche = keyof typeof niches;
export interface ActivationDraft {
  version: 1; id: string; step: number; name: string; niche: ActivationNiche;
  description: string; reference: string; latitude: string; longitude: string;
  ownerName: string; cover: string; logo: string; highlight: string;
}
export function emptyActivation(id: string): ActivationDraft {
  return { version: 1, id, step: 0, name: '', niche: 'restaurante', description: '', reference: '', latitude: '', longitude: '', ownerName: '', cover: '', logo: '', highlight: '' };
}
export function parseActivation(value: unknown, id: string): ActivationDraft {
  const blank = emptyActivation(id);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return blank;
  const row = value as Record<string, unknown>;
  if (row.version !== 1 || row.id !== id) return blank;
  for (const key of ['name','description','reference','latitude','longitude','ownerName','cover','logo','highlight'] as const) {
    if (typeof row[key] === 'string') blank[key] = row[key].slice(0, key === 'cover' || key === 'logo' ? 450000 : 2000);
  }
  if (typeof row.niche === 'string' && Object.hasOwn(niches, row.niche)) blank.niche = row.niche as ActivationNiche;
  blank.step = Math.max(0, Math.min(3, Math.floor(Number(row.step) || 0)));
  return blank;
}
export function activationErrors(draft: ActivationDraft, step: number): string[] {
  const errors: string[] = [];
  if (step === 0 && (draft.name.trim().length < 2 || draft.name.length > 120)) errors.push('Informe um nome entre 2 e 120 caracteres.');
  if (step === 0 && !draft.ownerName.trim()) errors.push('Informe o nome do responsável.');
  if (step === 1 && !draft.reference.trim()) errors.push('Informe o endereço ou ponto de referência.');
  if (step === 1 && (draft.latitude || draft.longitude)) {
    if (!draft.latitude || !draft.longitude || !Number.isFinite(Number(draft.latitude)) || !Number.isFinite(Number(draft.longitude)) || Math.abs(Number(draft.latitude)) > 90 || Math.abs(Number(draft.longitude)) > 180) errors.push('Confira as duas coordenadas.');
  }
  return errors;
}
export function activationPending(draft: ActivationDraft): string[] {
  return [!draft.cover && 'Foto real da fachada', !draft.logo && 'Logo (opcional)', !draft.description.trim() && 'Descrição do negócio', `Configurar ${niches[draft.niche].action.toLowerCase()}`, 'Revisar horários e condições', 'Revisar e publicar o perfil'].filter((item): item is string => Boolean(item));
}
export function safeActivationImage(value: string): string | undefined {
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length <= 450000) return value;
  try { const url = new URL(value); if (url.protocol === 'https:' && !url.username && !url.password) return url.href; } catch { /* An optional image can be empty. */ }
  return undefined;
}
