/**
 * Caraíva Digital — Partner Onboarding & Business Portal Types
 * Modelagem de dados para ciclo de vida do parceiro, membros, convites criptográficos e RLS.
 */

import type { Business, BusinessCategory } from "./caraivaDigitalData";

export type PartnerStatus =
  | "lead"
  | "invited"
  | "activation_started"
  | "onboarding"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "paused"
  | "suspended";

export type BusinessStatus = "draft" | "under_review" | "published" | "archived";

export type BusinessMemberRole = "owner" | "manager" | "editor" | "viewer";

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  name: string;
  email?: string;
  phone: string;
  role: BusinessMemberRole;
  status: "active" | "invited" | "suspended";
  created_at: string;
}

export interface PlatformAdmin {
  id: string;
  user_id: string;
  role: "platform_admin" | "superadmin" | "auditor";
  is_active: boolean;
  created_at: string;
}

export interface BusinessDailyMetric {
  id: string;
  business_id: string;
  metric_date: string;
  impressions_count: number;
  views_count: number;
  whatsapp_clicks_count: number;
  route_clicks_count: number;
  booking_clicks_count: number;
  favorites_count: number;
  updated_at: string;
}

export type PartnerPlan = "founding_partner" | "partner" | "pro" | "free";

export interface BusinessInvite {
  id: string;
  business_id: string;
  business_name: string;
  category: BusinessCategory;
  token: string;
  token_hash: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  used_at?: string;
  revoked_at?: string;
  status: "pending" | "used" | "revoked" | "expired";
  plan: PartnerPlan;
  contact_name: string;
  contact_whatsapp: string;
  internal_notes?: string;
}

export interface BusinessChangeRequest {
  id: string;
  business_id: string;
  business_name: string;
  submitted_by: string;
  payload: Partial<Business>;
  current_snapshot: Partial<Business>;
  status: "draft" | "submitted" | "approved" | "rejected" | "changes_requested";
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface BusinessAuditLog {
  id: string;
  business_id: string;
  actor_user_id: string;
  actor_type: "admin" | "merchant" | "system";
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface OnboardingAutosaveState {
  business_id: string;
  current_step: number;
  data: Partial<Business>;
  last_saved_at: string;
  completion_percentage: number;
}

/**
 * Função de Cálculo de Completude com Pesos Rigorosos
 * Meta: indicar com exatidão o que falta para chegar a 100%
 */
export function calculateBusinessProfileCompletion(data: Partial<Business>): {
  percentage: number;
  missingItems: string[];
} {
  let score = 0;
  const missingItems: string[] = [];

  // 1. Informações Essenciais (20%)
  if (data.name && data.category && data.description && data.description.length > 30) {
    score += 20;
  } else {
    missingItems.push("Nome, categoria e descrição detalhada do estabelecimento");
  }

  // 2. Contato (10%)
  if (data.whatsapp || data.whatsappNumber || data.phone) {
    score += 10;
  } else {
    missingItems.push("WhatsApp comercial verificado");
  }

  // 3. Horários (15%)
  if (data.opening_hours || data.openingHours) {
    score += 15;
  } else {
    missingItems.push("Tabela de horários de funcionamento");
  }

  // 4. Localização & Mapa (15%)
  if (data.address && data.coordinates && (data.coordinates.x !== undefined || data.latitude)) {
    score += 15;
  } else {
    missingItems.push("Confirmação de localização e ponto no mapa");
  }

  // 5. Capa / Logo (15%)
  if (data.cover_image || data.heroImage) {
    score += 15;
  } else {
    missingItems.push("Foto principal de capa em alta resolução");
  }

  // 6. Galeria (10%)
  if (data.gallery && data.gallery.length >= 2) {
    score += 10;
  } else {
    missingItems.push("Pelo menos 2 fotos adicionais na galeria");
  }

  // 7. Menu / Serviços / Pacotes (10%)
  if (
    (data.menuHighlights && data.menuHighlights.length > 0) ||
    (data.toursSnapshot && data.toursSnapshot.length > 0) ||
    (data.amenities && data.amenities.length > 0)
  ) {
    score += 10;
  } else {
    missingItems.push("Itens do cardápio, pacotes de passeios ou comodidades");
  }

  // 8. CTA Definido (5%)
  if (data.cta_type || data.ctaType) {
    score += 5;
  } else {
    missingItems.push("Ação principal desejada (WhatsApp, Reservas, etc.)");
  }

  return {
    percentage: Math.min(100, score),
    missingItems,
  };
}
