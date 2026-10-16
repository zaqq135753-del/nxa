/**
 * Caraíva Digital — Admin Sales Mode Service
 * Motor de apresentação comercial presencial, conversão de parceiros,
 * registro de visitas, métricas de vendas e geração de convites com QR Code.
 */

import { CARAIVA_BUSINESSES, type Business, type BusinessCategory } from "../data/caraivaDigitalData";

export type SalesOutcome =
  | "interested"
  | "invited"
  | "onboarding"
  | "closed"
  | "follow_up"
  | "not_interested";

export interface SalesPresentation {
  id: string;
  business_id: string;
  business_name: string;
  category: string;
  admin_user_id: string;
  status: "started" | "completed" | "cancelled";
  outcome?: SalesOutcome;
  started_at: string;
  completed_at?: string;
  notes?: string;
  proposed_plan: string;
  proposed_setup_fee: number;
  proposed_monthly_fee: number;
  trial_days: number;
  invite_id?: string;
  invite_token?: string;
}

export interface QuickProspectParams {
  name: string;
  category: BusinessCategory;
  contactName?: string;
  phone?: string;
  notes?: string;
  priceLevel?: "$" | "$$" | "$$$" | "$$$$";
  locationReference?: string;
}

const SALES_PRESENTATIONS_KEY = "caraiva_sales_presentations_v2";
const QUICK_PROSPECTS_KEY = "caraiva_quick_prospects_v2";

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("Storage write failed", err);
  }
}

/**
 * Validação rigorosa de permissão administrativa para o Modo Comercial.
 * Bloqueia usuários anônimos, visitantes e merchants comuns (Owner/Manager).
 */
export function checkSalesAdminAccess(_userId?: string): {
  isAuthorized: boolean;
  userRole?: string;
  userName?: string;
} {
  // Authorization must come from a verified server session, never localStorage.
  return { isAuthorized: false };
}

export function getAllSalesPresentations(): SalesPresentation[] {
  return getStored<SalesPresentation[]>(SALES_PRESENTATIONS_KEY, []);
}

export function startSalesPresentation(params: {
  businessId: string;
  businessName: string;
  category: string;
  adminUserId: string;
  proposedPlan?: string;
  setupFee?: number;
  monthlyFee?: number;
  trialDays?: number;
}): SalesPresentation {
  const presentations = getAllSalesPresentations();
  const newPresentation: SalesPresentation = {
    id: "pres_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    business_id: params.businessId,
    business_name: params.businessName,
    category: params.category,
    admin_user_id: params.adminUserId,
    status: "started",
    started_at: new Date().toISOString(),
    proposed_plan: params.proposedPlan || "Parceiro Fundador",
    proposed_setup_fee: params.setupFee !== undefined ? params.setupFee : 147,
    proposed_monthly_fee: params.monthlyFee !== undefined ? params.monthlyFee : 49,
    trial_days: params.trialDays !== undefined ? params.trialDays : 60,
  };

  presentations.unshift(newPresentation);
  setStored(SALES_PRESENTATIONS_KEY, presentations);
  return newPresentation;
}

export function completeSalesPresentation(params: {
  presentationId: string;
  outcome: SalesOutcome;
  notes?: string;
  inviteId?: string;
  inviteToken?: string;
}): SalesPresentation | null {
  const presentations = getAllSalesPresentations();
  const pres = presentations.find((p) => p.id === params.presentationId);
  if (!pres) return null;

  pres.status = "completed";
  pres.outcome = params.outcome;
  pres.completed_at = new Date().toISOString();
  if (params.notes) pres.notes = params.notes;
  if (params.inviteId) pres.invite_id = params.inviteId;
  if (params.inviteToken) pres.invite_token = params.inviteToken;

  setStored(SALES_PRESENTATIONS_KEY, presentations);
  return pres;
}

/**
 * Criação rápida de prospect para estabelecimentos recém-visitados na vila.
 */
export function createQuickProspect(params: QuickProspectParams): Business {
  const slug = params.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const newBiz: Business = {
    id: slug,
    slug,
    name: params.name,
    category: params.category,
    subcategory: "Vila de Caraíva",
    subCategory: "Vila de Caraíva",
    description: params.notes || "Estabelecimento mapeado na vila de Caraíva.",
    shortDescription: params.notes || "Experiência autêntica em Caraíva.",
    address: params.locationReference || "Rua de Areia, Caraíva - BA",
    locationReference: params.locationReference || "Vila de Caraíva",
    latitude: -16.8145,
    longitude: -39.1485,
    coordinates: { x: 45, y: 50 },
    whatsapp: params.phone || "5573999999999",
    whatsappNumber: params.phone || "5573999999999",
    rating: 4.8,
    review_count: 12,
    reviewsCount: 12,
    rating_source: "Curadoria Local",
    rating_verified_at: new Date().toISOString().split("T")[0],
    price_range: params.priceLevel || "$$",
    priceLevel: params.priceLevel || "$$",
    priceDescription: "Valores médios da vila",
    opening_hours: { todos: "12:00 às 23:00" },
    openingHours: "12:00 às 23:00",
    isOpenNow: true,
    amenities: ["Wi-Fi Fibra", "Aceita Pix", "Mesa na Areia"],
    tags: ["Novidade", "Curadoria Caraíva"],
    cover_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    verified: false,
    partner: false,
    founding_partner: false,
    data_tier: "DEMO",
    data_source: {
      provider: "Admin Sales Mode",
      url: "https://caraivadigital.com.br",
      verified_at: new Date().toISOString().split("T")[0],
      fields_verified: ["name", "category"],
    },
    verified_at: new Date().toISOString().split("T")[0],
    distanceMeters: 250,
    distanceTime: "3 min a pé",
    paymentMethods: ["Pix", "Dinheiro", "Cartão"],
    vibe: ["gastronomia", "tranquilidade"],
  };

  // Persistir em prospects rápidos locais e adicionar à memória da sessão
  const savedProspects = getStored<Business[]>(QUICK_PROSPECTS_KEY, []);
  savedProspects.unshift(newBiz);
  setStored(QUICK_PROSPECTS_KEY, savedProspects);

  // Se não existir na lista de negócios, inserir
  const exists = CARAIVA_BUSINESSES.some((b) => b.id === newBiz.id);
  if (!exists) {
    CARAIVA_BUSINESSES.push(newBiz);
  }

  return newBiz;
}

/**
 * Retorna todos os estabelecimentos combinando a base oficial com prospects locais.
 */
export function getAllSalesBusinesses(): Business[] {
  const quick = getStored<Business[]>(QUICK_PROSPECTS_KEY, []);
  const map = new Map<string, Business>();

  CARAIVA_BUSINESSES.forEach((b) => map.set(b.id, b));
  quick.forEach((b) => {
    if (!map.has(b.id)) map.set(b.id, b);
  });

  return Array.from(map.values());
}

/**
 * Pipeline Comercial Simples (Funil de Conversão Presencial):
 * Mapeado -> Apresentado -> Convidado -> Onboarding -> Revisão -> Parceiro Ativo
 */
export function getSalesPipelineData() {
  const allBiz = getAllSalesBusinesses();
  const presentations = getAllSalesPresentations();

  const pipeline = {
    mapeado: [] as Business[],
    apresentado: [] as Business[],
    interessado: [] as Business[],
    convidado: [] as Business[],
    onboarding: [] as Business[],
    revisao: [] as Business[],
    parceiro: [] as Business[],
  };

  allBiz.forEach((b) => {
    const pres = presentations.find((p) => p.business_id === b.id);
    if (b.partner && b.verified) {
      pipeline.parceiro.push(b);
    } else if (pres?.outcome === "onboarding") {
      pipeline.onboarding.push(b);
    } else if (pres?.outcome === "invited") {
      pipeline.convidado.push(b);
    } else if (pres?.outcome === "interested") {
      pipeline.interessado.push(b);
    } else if (pres) {
      pipeline.apresentado.push(b);
    } else {
      pipeline.mapeado.push(b);
    }
  });

  return {
    pipeline,
    summary: {
      totalMapped: allBiz.length,
      totalPresented: presentations.length,
      totalInterested: presentations.filter((p) => p.outcome === "interested").length,
      totalInvited: presentations.filter((p) => p.outcome === "invited" || p.invite_id).length,
      totalPartners: allBiz.filter((b) => b.partner).length,
    },
  };
}
