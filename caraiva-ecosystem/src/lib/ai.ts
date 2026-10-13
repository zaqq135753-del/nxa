import { brl, establishments, products, rooms, tours, byId } from "./data";

// Concierge: recuperação + ranking local (determinístico, roda offline e sem custo).
// Se GEMINI_API_KEY existir, a rota /api/concierge usa o LLM só para redigir a resposta
// em cima destes MESMOS resultados — a IA nunca inventa vaga, preço ou estoque.

export interface Hit {
  kind: "produto" | "quarto" | "passeio";
  id: string;
  title: string;
  subtitle: string;
  price: string;
  href: string;
  score: number;
  reason: string;
}

const SYNONYMS: Record<string, string[]> = {
  agua: ["agua", "hidratar", "sede"],
  gelado: ["gelado", "refrescar", "calor", "gelo"],
  peixe: ["peixe", "moqueca", "frutos do mar", "robalo"],
  tranquilo: ["tranquilo", "calmo", "criancas", "familia", "leve"],
  corumbau: ["corumbau", "ponta"],
  dormir: ["dormir", "quarto", "pousada", "diaria", "estender", "hospedagem"],
  romantico: ["romantico", "casal", "jantar"],
};

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function expand(query: string): string[] {
  const q = norm(query);
  const terms = new Set(q.split(/\W+/).filter((t) => t.length > 2));
  for (const [root, words] of Object.entries(SYNONYMS)) if (words.some((w) => q.includes(w))) { terms.add(root); words.forEach((w) => terms.add(w)); }
  return [...terms];
}

const scoreText = (terms: string[], text: string) => terms.reduce((s, t) => s + (norm(text).includes(t) ? 1 : 0), 0);

export function concierge(query: string): Hit[] {
  const terms = expand(query);
  const hits: Hit[] = [];
  for (const p of products.filter((x) => x.available)) {
    const est = byId(establishments, p.establishmentId)!;
    const s = scoreText(terms, `${p.name} ${p.category} ${p.tags.join(" ")}`);
    if (s) hits.push({ kind: "produto", id: p.id, title: `${p.emoji} ${p.name}`, subtitle: est.name, price: brl(p.price), href: `/turista/delivery?add=${p.id}`, score: s, reason: "Entrega na sua pousada" });
  }
  for (const t of tours) {
    const left = t.seats - t.booked;
    const s = scoreText(terms, `${t.name} ${t.tags.join(" ")}`);
    if (s && left > 0) hits.push({ kind: "passeio", id: t.id, title: t.name, subtitle: `Saída ${t.departure} · ${left} vaga(s)`, price: `${brl(t.pricePerSeat)}/pessoa`, href: `/turista/passeios?tour=${t.id}`, score: s + 0.5, reason: t.tideSensitive ? "Maré favorável pela manhã" : "Sem dependência de maré" });
  }
  for (const r of rooms) {
    const s = scoreText(terms, `${r.name} ${r.amenities.join(" ")} dormir quarto pousada`);
    if (s) hits.push({ kind: "quarto", id: r.id, title: r.name, subtitle: byId(establishments, r.establishmentId)!.name, price: `${brl(r.lastMinute ?? r.nightly)}/noite`, href: `/turista/pousadas?room=${r.id}`, score: s + (r.lastMinute ? 0.5 : 0), reason: r.lastMinute ? "Preço de última hora, só hoje" : "Disponível" });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 5);
}

// --- IA analítica para o lojista (heurística explicável; troca por modelo depois) ---
export function demandForecast(occupancy: number, isHoliday: boolean) {
  const factor = (occupancy / 100) * (isHoliday ? 1.6 : 1);
  return [
    { item: "Fardo água 1,5L", base: 25, unit: "fardos" },
    { item: "Saco de gelo 5kg", base: 14, unit: "sacos" },
    { item: "Cerveja long neck", base: 30, unit: "packs" },
  ].map((x) => ({ ...x, suggested: Math.ceil(x.base * factor) }));
}
