import type { Niche, PlanId } from "./data";

// Tabela comercial acordada. Uma única fonte de verdade para app, split e site de vendas.
export const SETUP_FEE = 19700;

export const PLANS: Record<PlanId, { name: string; monthly: number; commission: number; perOrder?: number; for: string }> = {
  essencial: { name: "Essencial", monthly: 9700, commission: 0.07, for: "Pousadas e passeios começando" },
  pro: { name: "Pro", monthly: 18700, commission: 0.05, for: "Pousadas e passeios com volume" },
  delivery: { name: "Delivery Local", monthly: 14700, commission: 0, perOrder: 150, for: "Mercados, distribuidoras e restaurantes" },
};

export interface Split {
  gross: number;
  platform: number;
  courier: number;
  merchant: number;
}

/** Split triplo: plataforma (comissão ou taxa fixa), entregador (frete integral) e lojista. */
export function computeSplit(subtotal: number, plan: PlanId, deliveryFee = 0): Split {
  const p = PLANS[plan];
  const platform = Math.round(subtotal * p.commission) + (p.perOrder ?? 0);
  return { gross: subtotal + deliveryFee, platform, courier: deliveryFee, merchant: subtotal - platform };
}

export const defaultPlanFor = (n: Niche): PlanId => (n === "delivery" ? "delivery" : "pro");
