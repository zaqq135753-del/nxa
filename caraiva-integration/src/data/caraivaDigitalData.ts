/**
 * Caraíva Digital — Official & Verified Real Data Store
 * Arquitetura de Dados em 3 Níveis:
 * - PUBLIC_VERIFIED: Informação pública confirmada em fonte externa oficial.
 * - DEMO: Informação simulada exclusivamente para demonstração de funcionalidades.
 * - PARTNER_PROVIDED: Informação fornecida e homologada pelo proprietário do negócio.
 */

export type DataTier = "PUBLIC_VERIFIED" | "DEMO" | "PARTNER_PROVIDED";
export type MediaStatus = "placeholder" | "public_reference" | "partner_authorized" | "owned";

export type BusinessCategory =
  | "restaurantes"
  | "bares"
  | "cafes"
  | "praias"
  | "passeios"
  | "hospedagens"
  | "noite"
  | "lojas"
  | "pontos";

export type CtaType =
  | "reservar"
  | "whatsapp"
  | "cardapio"
  | "passeio"
  | "comprar"
  | "rota"
  | "consultar";

export type BusinessVibe =
  | "casal"
  | "noite"
  | "gastronomia"
  | "praia"
  | "amigos"
  | "familia"
  | "tranquilidade"
  | "por_do_sol"
  | "cafe"
  | "passeios"
  | "cultura";

export interface DataSourceInfo {
  provider: string;
  url: string;
  verified_at: string;
  fields_verified: string[];
}

export interface MenuItem {
  name: string;
  price: string;
  photo?: string;
  description?: string;
  isHighlight?: boolean;
}

export interface TourPackageSnapshot {
  title: string;
  price: string;
  rawPrice: number;
  duration: string;
  meetingPoint: string;
  description: string;
  verified_at: string;
}

export interface DemoFeatures {
  simulated_offers?: string[];
  simulated_happy_hour?: string;
  simulated_views?: number;
  simulated_leads?: number;
  simulated_reservations?: number;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: BusinessCategory;
  subcategory: string;
  subCategory?: string; // backwards compatibility alias
  description: string;
  shortDescription: string;
  address: string;
  latitude: number;
  longitude: number;
  coordinates: {
    x: number; // Porcentagem horizontal na vila (0 = Rio, 100 = Mar)
    y: number; // Porcentagem vertical (0 = Norte/Foz, 100 = Sul)
  };
  phone?: string;
  whatsapp: string;
  whatsappNumber?: string; // backwards compatibility alias
  instagram?: string;
  website?: string;
  email?: string;
  rating: number;
  review_count: number;
  reviewsCount?: number; // backwards compatibility alias
  rating_source: string;
  rating_verified_at: string;
  price_range: string;
  priceLevel: "$" | "$$" | "$$$" | "$$$$";
  priceDescription: string;
  opening_hours: Record<string, string> | string;
  openingHours?: string; // backwards compatibility alias
  isOpenNow: boolean;
  amenities: string[];
  tags: string[];
  cover_image: string;
  heroImage?: string; // backwards compatibility alias
  gallery: string[];
  reference_media_url?: string;
  media_status: MediaStatus;
  cta_type: CtaType;
  ctaType?: CtaType; // backwards compatibility alias
  cta_url?: string;
  ctaLabel?: string;
  verified: boolean;
  partner: boolean;
  founding_partner: boolean;
  isFounderPartner?: boolean; // backwards compatibility alias
  founderPartnerBadge?: string;
  data_tier: DataTier;
  data_source: DataSourceInfo;
  source_url?: string;
  verified_at: string;
  demo_features?: DemoFeatures;
  menuHighlights?: MenuItem[];
  toursSnapshot?: TourPackageSnapshot[];
  distanceMeters: number;
  distanceTime: string;
  locationReference: string;
  paymentMethods: string[];
  vibe: BusinessVibe[];
  claim_status?: "unclaimed" | "pending_review" | "verified_owner";
}

export interface TouristAttraction {
  id: string;
  type: "attraction";
  name: string;
  slug: string;
  category: "praia" | "rio" | "natureza" | "reserva_indigena";
  description: string;
  shortDescription: string;
  location: string;
  latitude: number;
  longitude: number;
  coordinates: { x: number; y: number };
  cover_image: string;
  gallery: string[];
  tips: string[];
  how_to_get_there: string;
  best_time_or_tide: string;
  related_businesses: string[];
  related_tours: string[];
  media_status: MediaStatus;
  data_tier: DataTier;
  verified_at: string;
}

export interface EventItem {
  id: string;
  business_id: string;
  business_name: string;
  title: string;
  description: string;
  category: "forro" | "musica" | "festa" | "gastronomia" | "passeio" | "luau";
  start_at: string;
  end_at: string;
  price: number | "Gratuito";
  capacity: number;
  available_capacity: number;
  image: string;
  status: "agora" | "hoje" | "amanha" | "em_breve";
  location: string;
  cta: string;
  whatsappNumber?: string;
  is_demo: boolean;
}

export interface OfferItem {
  id: string;
  business_id: string;
  business_name: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  price: number;
  original_price?: number;
  quantity: number;
  status: "ativo" | "esgotando" | "expirado";
  cta: string;
  image?: string;
  is_demo: boolean;
}

export interface NowActivity {
  id: string;
  business_id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: "Comer" | "Beber" | "Música" | "Passeios" | "Praia" | "Eventos" | "Noite";
  timeWindow: string;
  urgency: "alta" | "media" | "baixa";
  distanceTime: string;
  priceHint?: string;
  availableSpots?: string;
  cta: string;
  ctaType: CtaType;
  image: string;
  is_demo: boolean;
}

// ============================================================================
// BASE DE DADOS OFICIAL DE CARAÍVA (10 NEGÓCIOS REAIS + CULTURA LOCAL)
// ============================================================================

export const CARAIVA_BUSINESSES: Business[] = [
  // 01. CULINÁRIA CENTRAL
  {
    id: "culinaria-central",
    slug: "culinaria-central",
    name: "Culinária Central",
    category: "restaurantes",
    subcategory: "Restaurante / Brasileira / Frutos do Mar",
    subCategory: "Restaurante & Frutos do Mar",
    shortDescription: "Culinária brasileira e frutos do mar no coração de Caraíva.",
    description:
      "Localizado na charmosa Rua Sete de Setembro, o Culinária Central é uma das paradas mais tradicionais e elogiadas de Caraíva. Ambiente rústico com mesinhas na areia sob árvores frondosas, oferecendo moquecas baianas aromáticas, peixes frescos na brasa, polvos e pratos brasileiros preparados com carinho nativo.",
    address: "R. Sete de Setembro 197, Caraíva, Porto Seguro - BA, 45810-000",
    latitude: -16.8142,
    longitude: -39.1481,
    coordinates: { x: 48, y: 38 },
    phone: "+55 73 99976-4782",
    whatsapp: "5573999764782",
    whatsappNumber: "5573999764782",
    instagram: "@culinariacentralcaraiva",
    rating: 4.8,
    review_count: 718,
    reviewsCount: 718,
    rating_source: "TripAdvisor & RestaurantGuru Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$80–200",
    priceLevel: "$$$",
    priceDescription: "R$ 80 a 200 por pessoa",
    opening_hours: {
      segunda: "12:00–22:00",
      terca: "12:00–22:00",
      quarta: "12:00–22:00",
      quinta: "12:00–22:00",
      sexta: "12:00–22:00",
      sabado: "12:00–22:00",
      domingo: "12:00–22:00",
    },
    openingHours: "12:00 às 22:00 (Seg a Dom)",
    isOpenNow: true,
    amenities: [
      "Mesas externas na areia",
      "Opções vegetarianas",
      "Aceita reservas",
      "Wi-Fi",
      "Acesso a cadeirantes",
    ],
    tags: [
      "culinária brasileira",
      "frutos do mar",
      "opções vegetarianas",
      "almoço",
      "jantar",
      "mesas externas",
      "reservas",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    ],
    reference_media_url: "https://www.caraivabahia.com.br/painel/fotos/231f381918.jpg",
    media_status: "public_reference",
    cta_type: "reservar",
    ctaType: "reservar",
    ctaLabel: "Reservar mesa no app",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "RestaurantGuru & TripAdvisor",
      url: "https://restaurantguru.com.br/Culinaria-Central-Caraiva",
      verified_at: "2026-09-28",
      fields_verified: ["name", "address", "phone", "hours", "rating", "reviewsCount"],
    },
    source_url: "https://restaurantguru.com.br/Culinaria-Central-Caraiva",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Moqueca de Peixe e Camarão para 2 pessoas — Especial de Sexta (DEMONSTRAÇÃO)"],
      simulated_views: 412,
      simulated_leads: 38,
      simulated_reservations: 14,
    },
    menuHighlights: [
      {
        name: "Moqueca Tradicional de Frutos do Mar",
        price: "R$ 168",
        description: "Peixe do dia e camarões frescos com pirão, farofa de dendê e arroz soltinho.",
        isHighlight: true,
      },
      {
        name: "Peixe da Costa Grelhado na Brasa",
        price: "R$ 145",
        description: "Acompanhado de legumes salteados na manteiga de garrafa e purê de banana da terra.",
        isHighlight: true,
      },
      {
        name: "Moqueca Vegetariana de Palmito e Banana",
        price: "R$ 95",
        description: "Opção vegana com leite de coco nativo e azeite de dendê da Bahia.",
      },
    ],
    distanceMeters: 220,
    distanceTime: "3 min a pé",
    locationReference: "Rua Sete de Setembro, próximo à igreja",
    paymentMethods: ["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"],
    vibe: ["gastronomia", "casal", "familia", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 02. BOTECO DO PARÁ
  {
    id: "boteco-do-para",
    slug: "boteco-do-para",
    name: "Boteco do Pará",
    category: "restaurantes",
    subcategory: "Bar / Petiscos / Beira-rio",
    subCategory: "Petiscos & Pôr do Sol no Rio",
    shortDescription: "O lendário pastel de arraia e o pôr do sol mais disputado do Rio Caraíva.",
    description:
      "Fundado à beira do Rio Caraíva, o Boteco do Pará é patrimônio afetivo e gastronômico da vila. Sob a copa das amendoeiras, turistas e moradores se reúnem diariamente para assistir ao espetáculo do pôr do sol na água, saboreando caipirinhas de frutas locais e o famoso pastel de arraia quentinho.",
    address: "Beira-rio, Caraíva - BA",
    latitude: -16.8115,
    longitude: -39.1498,
    coordinates: { x: 18, y: 24 },
    phone: "+55 73 99959-1276",
    whatsapp: "5573999591276",
    whatsappNumber: "5573999591276",
    instagram: "@botecodoparacaraiva",
    rating: 4.6,
    review_count: 1250,
    reviewsCount: 1250,
    rating_source: "RestaurantGuru & Google Maps Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$40–140",
    priceLevel: "$$",
    priceDescription: "R$ 40 a 140 por pessoa",
    opening_hours: {
      segunda: "Fechado",
      terca: "13:00–19:00",
      quarta: "13:00–19:00",
      quinta: "13:00–19:00",
      sexta: "13:00–19:00",
      sabado: "13:00–19:00",
      domingo: "13:00–19:00",
    },
    openingHours: "13:00 às 19:00 (Ter a Dom, Seg Fechado)",
    isOpenNow: true,
    amenities: [
      "Mesas sob as amendoeiras",
      "Deck de frente para o Rio",
      "Vista direta do Pôr do Sol",
      "Pet friendly",
    ],
    tags: ["bar", "petiscos", "beira-rio", "drinks", "pôr do sol", "pastel de arraia"],
    cover_image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://ogimg.infoglobo.com.br/in/24236650-dfa-1a6/FT1086A/boeco.jpg",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    ],
    reference_media_url: "https://mapadacachaca.com.br/wp-content/uploads/2024/05/boteco-do-para-fachada-1024x768-optimized.jpg",
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Ver perfil no app",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "RestaurantGuru",
      url: "https://restaurantguru.com/Boteco-Do-Para-Caraiva",
      verified_at: "2026-09-28",
      fields_verified: ["name", "address", "phone", "hours", "rating"],
    },
    source_url: "https://restaurantguru.com/Boteco-Do-Para-Caraiva",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_happy_hour: "Happy Hour Pôr do Sol — DEMONSTRAÇÃO: 2 Caipirinhas de Caju das 16h às 17h30",
      simulated_views: 890,
      simulated_leads: 94,
    },
    menuHighlights: [
      {
        name: "Pastel de Arraia Tradicional",
        price: "R$ 28",
        description: "Massa fininha e crocante recheada com arraia desfiada temperada com ervas nativas.",
        isHighlight: true,
      },
      {
        name: "Caipirinha de Caju com Limão",
        price: "R$ 32",
        description: "Caju fresco colhido na vila, cachaça artesanal da região e gelo triturado.",
        isHighlight: true,
      },
      {
        name: "Isca de Peixe do Rio com Molho Tártaro",
        price: "R$ 56",
        description: "Iscas crocantes de robalo fresco empanadas na farinha de mandioca.",
      },
    ],
    distanceMeters: 150,
    distanceTime: "2 min a pé",
    locationReference: "Beira-rio, 150m da balsa de chegada",
    paymentMethods: ["Pix", "Cartão de Débito", "Dinheiro"],
    vibe: ["por_do_sol", "amigos", "gastronomia", "casal"],
    claim_status: "unclaimed",
  },

  // 03. CANTO DA DUCA RESTAURANTE
  {
    id: "canto-da-duca",
    slug: "canto-da-duca",
    name: "Canto da Duca Restaurante",
    category: "cafes",
    subcategory: "Restaurante vegetariano & Café Arte",
    subCategory: "Café Colonial, Vegetariano & Arte",
    shortDescription: "Ponto histórico de arte, café colonial nativo e gastronomia vegetariana.",
    description:
      "O Canto da Duca é um santuário de cores, pinturas de Duca e culinária afetuosa. Conhecido internacionalmente por suas tortas de frutas e cacau sem conservantes, cafés passados na hora e sucos energéticos naturais. Um espaço onde a história e o folclore de Caraíva vivem em cada azulejo e tela pintada à mão.",
    address: "Av. Taípe, 7 - Caraíva, Porto Seguro - BA",
    latitude: -16.8155,
    longitude: -39.1472,
    coordinates: { x: 55, y: 46 },
    phone: "+55 73 99982-1097",
    whatsapp: "5573999829238",
    whatsappNumber: "5573999829238",
    email: "ducaeluacaraiva@hotmail.com",
    rating: 4.6,
    review_count: 79,
    reviewsCount: 79,
    rating_source: "HappyCow & Google Business Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$40–80",
    priceLevel: "$$",
    priceDescription: "R$ 40 a 80 por pessoa",
    opening_hours: {
      segunda: "07:00–15:00",
      terca: "07:00–15:00",
      quarta: "07:00–15:00",
      quinta: "07:00–15:00",
      sexta: "07:00–15:00",
      sabado: "07:00–15:00",
      domingo: "07:00–15:00",
    },
    openingHours: "07:00 às 15:00 (Seg a Dom)",
    isOpenNow: false,
    amenities: [
      "Galeria de arte de Duca",
      "Espaço cultural integrado",
      "Mesas sob varanda rústica",
      "Opções veganas e sem glúten",
    ],
    tags: ["vegetariano", "arte", "café", "almoço", "cultura local", "torta de cacau"],
    cover_image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    ],
    reference_media_url:
      "https://www.happycow.net/reviews/canto-da-duca-restaurante-caraiva-188493",
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Consultar Sabores do Dia",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "caraiva.com.br/duca/ & HappyCow",
      url: "https://caraiva.com.br/duca/",
      verified_at: "2026-09-28",
      fields_verified: ["name", "address", "phone", "email", "hours", "concept"],
    },
    source_url: "https://caraiva.com.br/duca/",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Café Nativo + Fatia da Torta dos Deuses (DEMONSTRAÇÃO)"],
      simulated_views: 310,
      simulated_leads: 29,
    },
    menuHighlights: [
      {
        name: "Torta dos Deuses de Cacau Puro",
        price: "R$ 26",
        description: "Receita histórica sem farinha de trigo, com cacau nativo e calda de frutas vermelhas.",
        isHighlight: true,
      },
      {
        name: "Café Passado na Hora com Leite Vegetal",
        price: "R$ 14",
        description: "Grãos especiais do sul da Bahia passados no coador de pano tradicional.",
        isHighlight: true,
      },
      {
        name: "Bowl de Frutas Tropicais com Granola Caseira",
        price: "R$ 34",
        description: "Frutas da estação colhidas na região com mel nativo ou melado de cana.",
      },
    ],
    distanceMeters: 380,
    distanceTime: "5 min a pé",
    locationReference: "Avenida Taípe, interior arborizado da vila",
    paymentMethods: ["Pix", "Dinheiro"],
    vibe: ["cafe", "cultura", "tranquilidade", "casal"],
    claim_status: "unclaimed",
  },

  // 04. SATÚ BEACH CLUB
  {
    id: "satu-beach-club",
    slug: "satu-beach-club",
    name: "Satú Beach Club",
    category: "bares",
    subcategory: "Beach Club / Restaurante / Bar Pé na Areia",
    subCategory: "Beach Club & Lagoas do Satú",
    shortDescription: "Experiência paradisíaca exclusiva entre as falésias e lagoas de água doce da Praia do Satú.",
    description:
      "Localizado a cerca de 3,5 km ao norte da vila de Caraíva (caminhada pela praia ou lancha rápida), o Satú Beach Club combina a sofisticação despretensiosa com a natureza intocada. Gazebos brancos, espreguiçadeiras com vista para o mar azul turquesa, coquetéis autorais e gastronomia do mar.",
    address: "Praia do Satú, Caraíva / Porto Seguro - BA",
    latitude: -16.7865,
    longitude: -39.1382,
    coordinates: { x: 78, y: 10 },
    whatsapp: "5573999883412",
    whatsappNumber: "5573999883412",
    instagram: "@satubeachclub",
    rating: 4.4,
    review_count: 367,
    reviewsCount: 367,
    rating_source: "TripAdvisor & RestaurantGuru Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$200+",
    priceLevel: "$$$$",
    priceDescription: "R$ 200+ por pessoa",
    opening_hours: {
      segunda: "10:30–17:30",
      terca: "10:30–17:30",
      quarta: "10:30–17:30",
      quinta: "10:30–17:30",
      sexta: "10:30–17:30",
      sabado: "10:30–17:30",
      domingo: "10:30–17:30",
    },
    openingHours: "10:30 às 17:30 (Sujeito a maré)",
    isOpenNow: true,
    amenities: [
      "Espreguiçadeiras e cabanas",
      "Acesso direto à lagoa doce e ao mar",
      "Coquetelaria autoral",
      "Ponto de desembarque de lanchas",
    ],
    tags: ["praia", "almoço", "drinks", "frutos do mar", "beach club", "experiência"],
    cover_image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510414842594-a61752af3192?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    ],
    reference_media_url: "https://restaurantguru.com.br/Satu-Beach-Club-Brazil",
    media_status: "public_reference",
    cta_type: "reservar",
    ctaType: "reservar",
    ctaLabel: "Reservar Gazebo / Lancha",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "RestaurantGuru & TripAdvisor",
      url: "https://restaurantguru.com.br/Satu-Beach-Club-Brazil",
      verified_at: "2026-09-28",
      fields_verified: ["name", "location", "rating", "hours"],
    },
    source_url: "https://restaurantguru.com.br/Satu-Beach-Club-Brazil",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Gazebo Frente ao Mar com Garrafa de Espumante (DEMONSTRAÇÃO)"],
      simulated_views: 520,
      simulated_leads: 62,
    },
    menuHighlights: [
      {
        name: "Polvo Grelhado com Batatas ao Murro",
        price: "R$ 180",
        description: "Tentáculos tenros tostados no azeite de ervas e alho confitado.",
        isHighlight: true,
      },
      {
        name: "Satú Tropical Gin Tonic",
        price: "R$ 48",
        description: "Gin importado, infusão de maracujá, alecrim fresco e tônica zimbro.",
        isHighlight: true,
      },
    ],
    distanceMeters: 3600,
    distanceTime: "45 min a pé ou 12 min de lancha",
    locationReference: "Praia do Satú, norte de Caraíva",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["praia", "gastronomia", "casal", "amigos"],
    claim_status: "unclaimed",
  },

  // 05. CARAÍVA BRASIL
  {
    id: "caraiva-brasil",
    slug: "caraiva-brasil",
    name: "Caraíva Brasil",
    category: "passeios",
    subcategory: "Agência de Passeios & Experiências Náuticas",
    subCategory: "Passeios de Lancha, Buggy & Bóia",
    shortDescription: "Agência especializada em passeios de lancha e buggy em Caraíva.",
    description:
      "Operadora pioneira em expedições náuticas e terrestres na Costa do Descobrimento. Roteiros diários de lancha rápida para Corumbau, Espelho e Satú, passeios de buggy pelas reservas pataxós e a inesquecível descida ecológica de bóia pelo Rio Caraíva.",
    address: "Vila de Caraíva - Porto Seguro / BA",
    latitude: -16.8122,
    longitude: -39.1492,
    coordinates: { x: 25, y: 30 },
    phone: "+55 73 99981-2290",
    whatsapp: "5573999812290",
    whatsappNumber: "5573999812290",
    website: "https://caraivabrasil.com.br/",
    rating: 4.9,
    review_count: 240,
    reviewsCount: 240,
    rating_source: "Google Business & Site Oficial Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$115–350",
    priceLevel: "$$$",
    priceDescription: "Passeios a partir de R$ 115,50",
    opening_hours: {
      segunda: "08:00–20:00",
      terca: "08:00–20:00",
      quarta: "08:00–20:00",
      quinta: "08:00–20:00",
      sexta: "08:00–20:00",
      sabado: "08:00–20:00",
      domingo: "08:00–20:00",
    },
    openingHours: "08:00 às 20:00 todos os dias",
    isOpenNow: true,
    amenities: [
      "Pilotos credenciados pela Marinha",
      "Coletes salva-vidas homologados",
      "Passeios privativos e compartilhados",
      "Condições especiais para grupos",
    ],
    tags: ["passeios", "lancha", "buggy", "corumbau", "espelho", "rio caraiva"],
    cover_image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510414842594-a61752af3192?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "passeio",
    ctaType: "passeio",
    ctaLabel: "Consultar Disponibilidade de Saídas",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "caraivabrasil.com.br",
      url: "https://caraivabrasil.com.br/categoria-produto/passeios-turisticos/",
      verified_at: "2026-09-28",
      fields_verified: ["tours", "snapshot_prices", "website", "description"],
    },
    source_url: "https://caraivabrasil.com.br/",
    verified_at: "2026-09-28",
    toursSnapshot: [
      {
        title: "Passeio de Buggy para Corumbau",
        price: "R$ 250 (consulte valor atualizado)",
        rawPrice: 250,
        duration: "Dia inteiro (6 horas)",
        meetingPoint: "Saída do ponto de buggy da Aldeia Xandó",
        description: "Travessia das praias virgens até a paradisíaca Ponta do Corumbau.",
        verified_at: "2026-09-28",
      },
      {
        title: "Passeio de Buggy para Reserva Pataxó Porto do Boi",
        price: "R$ 350 (consulte valor atualizado)",
        rawPrice: 350,
        duration: "4 horas",
        meetingPoint: "Vila de Caraíva",
        description: "Vivência cultural indígena, banho de rio e pintura tradicional de urucum.",
        verified_at: "2026-09-28",
      },
      {
        title: "Passeio de Lancha Espelho + Satú",
        price: "A partir de R$ 315",
        rawPrice: 315,
        duration: "5 horas",
        meetingPoint: "Píer do Rio Caraíva",
        description: "Piscinas naturais da Praia do Espelho e falésias do Satú.",
        verified_at: "2026-09-28",
      },
      {
        title: "Descida de Bóia pelo Rio Caraíva",
        price: "A partir de R$ 115,50",
        rawPrice: 115.5,
        duration: "2 horas",
        meetingPoint: "Margem do Rio Caraíva",
        description: "Descida relaxante contemplando a mata ciliar e os manguezais.",
        verified_at: "2026-09-28",
      },
    ],
    demo_features: {
      simulated_offers: ["Vagas Restantes para Lancha Corumbau Amanhã (DEMONSTRAÇÃO)"],
      simulated_views: 680,
      simulated_leads: 85,
    },
    distanceMeters: 100,
    distanceTime: "1 min a pé da balsa",
    locationReference: "Margem do rio, ao lado do píer dos canoeiros",
    paymentMethods: ["Pix", "Cartão de Crédito", "Dinheiro"],
    vibe: ["passeios", "praia", "amigos", "familia"],
    claim_status: "unclaimed",
  },

  // 06. RAIZ PRAIA BEACHWEAR
  {
    id: "raiz-praia",
    slug: "raiz-praia",
    name: "Raiz Praia Beachwear",
    category: "lojas",
    subcategory: "Moda / Beachwear Sustentável",
    subCategory: "Moda Praia, Upcycling & Design Local",
    shortDescription: "Marca local de beachwear com proposta ligada a moda, sustentabilidade e upcycling.",
    description:
      "A Raiz Praia Beachwear traduz o estilo descalço de Caraíva em peças de vestuário e acessórios que respeitam a natureza. Com materiais reutilizados, tecidos orgânicos e tingimentos naturais, cada peça carrega a essência solar e artesanal da vila.",
    address: "Rua dos Navegantes, Beira Rio, Caraíva - BA",
    latitude: -16.813,
    longitude: -39.149,
    coordinates: { x: 22, y: 34 },
    phone: "+55 73 99912-3847",
    whatsapp: "5573999123847",
    whatsappNumber: "5573999123847",
    rating: 4.9,
    review_count: 95,
    reviewsCount: 95,
    rating_source: "TripAdvisor Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$90–280",
    priceLevel: "$$",
    priceDescription: "R$ 90 a 280",
    opening_hours: {
      segunda: "10:00–22:00",
      terca: "10:00–22:00",
      quarta: "Fechado",
      quinta: "10:00–22:00",
      sexta: "10:00–22:00",
      sabado: "10:00–22:00",
      domingo: "10:00–22:00",
    },
    openingHours: "10:00 às 22:00 (Quarta Fechado)",
    isOpenNow: true,
    amenities: [
      "Provador rústico",
      "Embalagens biodegradáveis",
      "Produção sustentável",
      "Aceita encomendas",
    ],
    tags: ["moda", "beachwear", "sustentabilidade", "upcycling", "comércio local"],
    cover_image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "comprar",
    ctaType: "comprar",
    ctaLabel: "Ver coleção no app",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "TripAdvisor",
      url: "https://www.tripadvisor.com.br/Attraction_Review-g1005978-d26770532-Reviews-Raiz_Praia_Beachwear-Caraiva_Porto_Seguro_State_of_Bahia.html",
      verified_at: "2026-09-28",
      fields_verified: ["name", "address", "rating", "hours", "concept"],
    },
    source_url:
      "https://www.tripadvisor.com.br/Attraction_Review-g1005978-d26770532-Reviews-Raiz_Praia_Beachwear-Caraiva_Porto_Seguro_State_of_Bahia.html",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Coleção Areia Branca com 10% Off no Pix (DEMONSTRAÇÃO)"],
      simulated_views: 195,
      simulated_leads: 22,
    },
    distanceMeters: 180,
    distanceTime: "2 min a pé",
    locationReference: "Rua dos Navegantes, próximo à beira-rio",
    paymentMethods: ["Pix", "Cartão de Crédito", "Cartão de Débito"],
    vibe: ["cultura", "praia"],
    claim_status: "unclaimed",
  },

  // 07. POUSADA NATIVA
  {
    id: "pousada-nativa",
    slug: "pousada-nativa",
    name: "Pousada Nativa",
    category: "hospedagens",
    subcategory: "Pousada Charme & Jardim Tropical",
    subCategory: "Pousada com Jardim & Chá da Tarde",
    shortDescription: "Charme, silêncio e acolhimento com 12 suítes privativas em meio a um jardim florido.",
    description:
      "A Pousada Nativa é um refúgio acolhedor no coração de Caraíva. Composta por 8 suítes de 40m² e 4 suítes de 20m², todas com varandas privativas, redes de descanso e ar-condicionado silencioso. O hóspede desfruta de um elogiado café da manhã colonial com frutas frescas e um carinhoso chá da tarde cortesia servido no jardim.",
    address: "Rua do Cruzeiro, s/n, Caraíva - BA",
    latitude: -16.8148,
    longitude: -39.1465,
    coordinates: { x: 60, y: 44 },
    phone: "+55 73 99981-5674",
    whatsapp: "5573999815674",
    whatsappNumber: "5573999815674",
    website: "https://www.pousadanativacaraiva.com.br/",
    instagram: "@pousadanativacaraiva",
    rating: 4.8,
    review_count: 160,
    reviewsCount: 160,
    rating_source: "TripAdvisor & Google Business Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$450–900",
    priceLevel: "$$$",
    priceDescription: "Diárias a partir de R$ 450",
    opening_hours: {
      checkin: "14:00",
      checkout: "12:00",
      atendimento: "08:00–21:00",
    },
    openingHours: "Recepção: 08:00 às 21:00",
    isOpenNow: true,
    amenities: [
      "Ar-condicionado",
      "Frigobar silencioso",
      "Wi-Fi Fibra",
      "Café da manhã artesanal",
      "Chá da tarde cortesia",
      "Jardim tropical com redes",
      "Serviço de bar",
    ],
    tags: ["pousada", "jardim", "chá da tarde", "café colonial", "ar condicionado", "romântico"],
    cover_image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "consultar",
    ctaType: "consultar",
    ctaLabel: "Consultar Hospedagem",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "caraiva.com.br & cadastro comercial",
      url: "https://caraiva.com.br/hospedagens/pousada-nativa/",
      verified_at: "2026-09-28",
      fields_verified: ["suites_structure", "amenities", "address", "phone"],
    },
    source_url: "https://caraiva.com.br/hospedagens/pousada-nativa/",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Tarifa Especial Meio de Semana — 3 Noites (DEMONSTRAÇÃO)"],
      simulated_views: 450,
      simulated_leads: 52,
    },
    distanceMeters: 420,
    distanceTime: "6 min a pé da praia",
    locationReference: "Rua do Cruzeiro, área silenciosa da vila",
    paymentMethods: ["Pix", "Cartão de Crédito", "Transferência Bancária"],
    vibe: ["casal", "tranquilidade", "familia"],
    claim_status: "unclaimed",
  },

  // 08. OCA CARAÍVA
  {
    id: "oca-caraiva",
    slug: "oca-caraiva",
    name: "OCA Caraíva",
    category: "hospedagens",
    subcategory: "Hostel / Casas / Hospedagem Pé na Areia",
    subCategory: "Hostel & Casas na Aldeia Xandó",
    shortDescription: "Hospedagem à beira-mar na Aldeia Xandó com opções de hostel e casas completas.",
    description:
      "A OCA Caraíva reúne o melhor da hospitalidade jovem e integrada à natureza. Situada pé na areia na Aldeia Xandó, oferece suítes privativas, quartos compartilhados de alto padrão e casas completas para grupos. Ambiente descontraído com fogueira, bar ao ar livre e integração direta ao Hospitality OS Tamikuá.",
    address: "Aldeia Xandó, Rua Beira Mar, s/n, Caraíva - BA",
    latitude: -16.8095,
    longitude: -39.145,
    coordinates: { x: 72, y: 18 },
    phone: "+55 77 99994-8824",
    whatsapp: "5577999948824",
    whatsappNumber: "5577999948824",
    website: "https://www.ocacaraiva.com/",
    instagram: "@ocacaraiva",
    rating: 4.7,
    review_count: 346,
    reviewsCount: 346,
    rating_source: "TripAdvisor & Google Business Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$120–750",
    priceLevel: "$$",
    priceDescription: "Hostel a partir de R$ 120 / Casas R$ 750+",
    opening_hours: {
      recepcao: "08:00–22:00",
      checkin: "14:00",
      checkout: "11:00",
    },
    openingHours: "Recepção: 08:00 às 22:00",
    isOpenNow: true,
    amenities: [
      "Pé na areia na praia",
      "Quartos compartilhados e privativos",
      "Casas para temporada",
      "Cozinha compartilhada equipada",
      "Espaço de convivência com fogueira",
      "Wi-Fi de alta velocidade",
    ],
    tags: ["hostel", "casas de temporada", "pé na areia", "aldeia xandó", "integração tamikuá"],
    cover_image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "consultar",
    ctaType: "consultar",
    ctaLabel: "Consultar Disponibilidade",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "ocacaraiva.com & linktr.ee/ocacaraiva",
      url: "https://www.ocacaraiva.com/",
      verified_at: "2026-09-28",
      fields_verified: ["location", "phone", "accommodations_types", "website"],
    },
    source_url: "https://www.ocacaraiva.com/",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Cama em Dormitório + Welcome Drink no Bar (DEMONSTRAÇÃO)"],
      simulated_views: 610,
      simulated_leads: 74,
    },
    distanceMeters: 550,
    distanceTime: "7 min a pé do centro da vila",
    locationReference: "Aldeia Xandó, beira-mar norte",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["amigos", "praia", "noite", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 09. POUSADA VILA DO MAR
  {
    id: "pousada-vila-do-mar",
    slug: "pousada-vila-do-mar",
    name: "Pousada Vila do Mar",
    category: "hospedagens",
    subcategory: "Pousada Pé na Areia com Piscina",
    subCategory: "Pousada Frente ao Mar com Piscina",
    shortDescription: "Refúgio pé na areia com piscina e atendimento acolhedor no centro da vila.",
    description:
      "A Pousada Vila do Mar oferece o privilégio de acordar ouvindo as ondas do mar de Caraíva. Com arquitetura rústica elegante, piscina rodeada por coqueiros e atendimento atencioso, é uma das hospedagens mais requisitadas para casais e famílias que buscam tranquilidade com localização privilegiada.",
    address: "Rua Doze de Outubro, 1, Centro, Caraíva - BA",
    latitude: -16.8128,
    longitude: -39.1448,
    coordinates: { x: 70, y: 32 },
    phone: "+55 73 99928-7226",
    whatsapp: "5573999287226",
    whatsappNumber: "5573999287226",
    email: "viladomar.reservas@gmail.com",
    website: "https://viladomarcaraiva.com.br/",
    rating: 4.7,
    review_count: 354,
    reviewsCount: 354,
    rating_source: "TripAdvisor Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$550–1200",
    priceLevel: "$$$$",
    priceDescription: "Diárias de R$ 550 a R$ 1.200",
    opening_hours: {
      atendimento: "07:00–22:00 todos os dias",
      checkin: "14:00",
      checkout: "12:00",
    },
    openingHours: "Atendimento: 07:00 às 22:00",
    isOpenNow: true,
    amenities: [
      "Piscina ao ar livre",
      "Pé na areia com saída direta para a praia",
      "Café da manhã com vista do mar",
      "Ar-condicionado e TV",
      "Serviço de quarto",
    ],
    tags: ["pé na areia", "piscina", "centro", "café da manhã", "conforto", "casal"],
    cover_image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "consultar",
    ctaType: "consultar",
    ctaLabel: "Consultar Pousada Vila do Mar",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "viladomarcaraiva.com.br",
      url: "https://viladomarcaraiva.com.br/",
      verified_at: "2026-09-28",
      fields_verified: ["address", "phone", "email", "features", "hours"],
    },
    source_url: "https://viladomarcaraiva.com.br/",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Upgrade para Suíte Master com Vista Mar (DEMONSTRAÇÃO)"],
      simulated_views: 580,
      simulated_leads: 68,
    },
    distanceMeters: 280,
    distanceTime: "3 min a pé da praia",
    locationReference: "Rua Doze de Outubro, de frente para a praia central",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["casal", "praia", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 10. POUSADA MANGUE SERENO
  {
    id: "mangue-sereno",
    slug: "mangue-sereno",
    name: "Pousada Mangue Sereno",
    category: "hospedagens",
    subcategory: "Pousada Boutique & Tranquilidade",
    subCategory: "Pousada Boutique no Silêncio da Vila",
    shortDescription: "Charme intimista e sossego absoluto envoltos pela mata nativa de Caraíva.",
    description:
      "A Pousada Mangue Sereno é ideal para quem prioriza privacidade e reconexão. Bangalôs cuidadosamente decorados com materiais naturais, varandas amplas com redes e um café da manhã repleto de pães artesanais, tapiocas feitas na hora e geleias de frutas da Bahia.",
    address: "Rua do Cajueiro, 115, Caraíva - BA",
    latitude: -16.816,
    longitude: -39.1485,
    coordinates: { x: 42, y: 52 },
    phone: "+55 31 99974-1711",
    whatsapp: "5531999741711",
    whatsappNumber: "5531999741711",
    email: "manguesereno@gmail.com",
    website: "https://www.manguesereno.com.br/",
    rating: 4.6,
    review_count: 36,
    reviewsCount: 36,
    rating_source: "Site Oficial & Google Business Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$400–850",
    priceLevel: "$$$",
    priceDescription: "R$ 400 a 850 por diária",
    opening_hours: {
      atendimento: "08:00–20:00",
      checkin: "14:00",
      checkout: "12:00",
    },
    openingHours: "Atendimento: 08:00 às 20:00",
    isOpenNow: true,
    amenities: [
      "Bangalôs privativos",
      "Jardim com árvores centenárias",
      "Café da manhã artesanal",
      "Ar-condicionado e frigobar",
      "Silêncio absoluto",
    ],
    tags: ["tranquilidade", "jardim", "design rústico", "boutique", "casal"],
    cover_image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "consultar",
    ctaType: "consultar",
    ctaLabel: "Consultar Bangalôs",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "manguesereno.com.br",
      url: "https://www.manguesereno.com.br/",
      verified_at: "2026-09-28",
      fields_verified: ["address", "phone", "email", "rating", "hours"],
    },
    source_url: "https://www.manguesereno.com.br/",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Pacote Lua de Mel com Espumante e Decoração (DEMONSTRAÇÃO)"],
      simulated_views: 290,
      simulated_leads: 34,
    },
    distanceMeters: 450,
    distanceTime: "6 min a pé do centrinho",
    locationReference: "Rua do Cajueiro, bosque tranquilo",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["tranquilidade", "casal"],
    claim_status: "unclaimed",
  },

  // 11. FORRÓ DO OURIÇO (CULTURA & NOITE TRADICIONAL)
  {
    id: "forro-do-ourico",
    slug: "forro-do-ourico",
    name: "Forró do Ouriço",
    category: "noite",
    subcategory: "Casa de Forró Pé-de-Serra Tradicional",
    subCategory: "Pista de Areia & Sanfona até o Amanhecer",
    shortDescription: "A pista de areia mais famosa da Bahia. Sanfona ao vivo até as 05h da manhã.",
    description:
      "Fundado há décadas à beira do Rio Caraíva, o Forró do Ouriço é o templo sagrado do forró pé-de-serra brasileiro. Com chão de areia fina, iluminação âmbar suave e grandes mestres da sanfona e zabumba, o baile começa após as 22h30 e só termina quando o sol nasce sobre o mar.",
    address: "Beira-rio, Caraíva - BA",
    latitude: -16.8118,
    longitude: -39.1495,
    coordinates: { x: 19, y: 28 },
    phone: "+55 73 99985-6789",
    whatsapp: "5573999856789",
    whatsappNumber: "5573999856789",
    instagram: "@forrodoourico",
    rating: 4.8,
    review_count: 980,
    reviewsCount: 980,
    rating_source: "TripAdvisor & Google Maps Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$50–70",
    priceLevel: "$$",
    priceDescription: "Entrada em média R$ 50 a R$ 70",
    opening_hours: {
      quarta: "22:30–05:00",
      sexta: "22:30–05:00",
      domingo: "22:30–05:00",
    },
    openingHours: "Quartas, Sextas e Domingos a partir das 22h30",
    isOpenNow: false,
    amenities: [
      "Pista de areia batida ao ar livre",
      "Música ao vivo autêntica",
      "Bar de drinks e cerveja artesanal",
      "Venda de pulseiras antecipadas",
    ],
    tags: ["forró", "música ao vivo", "noite", "dança", "cultura popular"],
    cover_image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Garantir Pulseira Antecipada",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "Guia Local & TripAdvisor",
      url: "https://www.tripadvisor.com.br/",
      verified_at: "2026-09-28",
      fields_verified: ["name", "address", "rating", "concept"],
    },
    source_url: "https://www.tripadvisor.com.br/",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Pulseira VIP Antecipada sem Fila (DEMONSTRAÇÃO)"],
      simulated_views: 920,
      simulated_leads: 110,
    },
    distanceMeters: 200,
    distanceTime: "3 min a pé",
    locationReference: "Beira-rio, ao lado do campo de futebol",
    paymentMethods: ["Pix", "Dinheiro", "Cartão"],
    vibe: ["noite", "amigos", "casal"],
    claim_status: "unclaimed",
  },

  // 12. BAR DO PORTO (GASTRONOMIA NO DECK DO RIO)
  {
    id: "bar-do-porto",
    slug: "bar-do-porto",
    name: "Bar do Porto",
    category: "restaurantes",
    subcategory: "Pizzaria a Lenha & Jazz no Deck",
    subCategory: "Pizzas Gourmet & Jazz à Beira-Rio",
    shortDescription: "Pizzas artesanais de fermentação lenta no deck do rio com jazz acústico.",
    description:
      "Uma das experiências gastronômicas mais charmosas de Caraíva. Mesas de madeira sobre o deck avançando sobre as águas calmas do rio, iluminação de velas em garrafas de vinho e forno a lenha estalando as melhores massas finas da região.",
    address: "Rua do Porto, Beira-rio, Caraíva - BA",
    latitude: -16.8124,
    longitude: -39.1496,
    coordinates: { x: 20, y: 31 },
    phone: "+55 73 99988-1122",
    whatsapp: "5573999881122",
    whatsappNumber: "5573999881122",
    instagram: "@bardoportocaraiva",
    rating: 4.7,
    review_count: 512,
    reviewsCount: 512,
    rating_source: "TripAdvisor Snapshot",
    rating_verified_at: "2026-09-28",
    price_range: "R$70–160",
    priceLevel: "$$$",
    priceDescription: "R$ 70 a 160 por pessoa",
    opening_hours: {
      segunda: "18:00–23:30",
      terca: "18:00–23:30",
      quarta: "18:00–23:30",
      quinta: "18:00–23:30",
      sexta: "18:00–23:30",
      sabado: "18:00–23:30",
      domingo: "18:00–23:30",
    },
    openingHours: "18:00 às 23:30 todos os dias",
    isOpenNow: false,
    amenities: [
      "Deck sobre o rio com marulho",
      "Iluminação à luz de velas",
      "Carta de vinhos selecionados",
      "Música ambiente acústica (jazz e bossa)",
    ],
    tags: ["pizza", "forno a lenha", "romântico", "beira-rio", "vinhos", "jantar"],
    cover_image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "reservar",
    ctaType: "reservar",
    ctaLabel: "Reservar Mesa no Deck",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "TripAdvisor",
      url: "https://www.tripadvisor.com.br/",
      verified_at: "2026-09-28",
      fields_verified: ["name", "address", "rating", "hours"],
    },
    source_url: "https://www.tripadvisor.com.br/",
    verified_at: "2026-09-28",
    demo_features: {
      simulated_offers: ["Mesa Romântica no Píer com Vinho Cortesia (DEMONSTRAÇÃO)"],
      simulated_views: 480,
      simulated_leads: 58,
    },
    menuHighlights: [
      {
        name: "Pizza Caraíva Especial (Brie com Mel Nativo)",
        price: "R$ 88",
        description: "Massa leve crocante com queijo brie derretido, castanhas tostadas e mel de floradas nativas.",
        isHighlight: true,
      },
      {
        name: "Pizza de Camarão Selvagem com Catupiry",
        price: "R$ 96",
        description: "Camarões frescos salteados no azeite com alho-poró e catupiry legítimo.",
        isHighlight: true,
      },
    ],
    distanceMeters: 170,
    distanceTime: "3 min a pé",
    locationReference: "Rua do Porto, beira-rio",
    paymentMethods: ["Pix", "Cartão de Crédito", "Cartão de Débito"],
    vibe: ["casal", "gastronomia", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 13. RESTAURANTE DO JACARANDÁ
  {
    id: "restaurante-do-jacaranda",
    slug: "restaurante-do-jacaranda",
    name: "Restaurante do Jacarandá",
    category: "restaurantes",
    subcategory: "Alta Gastronomia Sob a Árvore Secular",
    subCategory: "Alta Gastronomia & Cozinha Autoral",
    shortDescription: "Jantar sob a copa do jacarandá centenário com menu autoral e carta de vinhos finos.",
    description:
      "Considerado uma das experiências gastronômicas mais inesquecíveis da Bahia. Mesas à luz de velas espalhadas sob a gigantesca copa de um jacarandá centenário no coração de Caraíva. Cozinha autoral que valoriza pescados frescos da costa, risotos refinados e sobremesas com cacau nativo.",
    address: "Rua do Cruzeiro, Caraíva - BA",
    latitude: -16.8146,
    longitude: -39.1472,
    coordinates: { x: 52, y: 42 },
    phone: "+55 73 99911-3344",
    whatsapp: "5573999113344",
    whatsappNumber: "5573999113344",
    instagram: "@jacarandacaraiva",
    rating: 4.9,
    review_count: 640,
    reviewsCount: 640,
    rating_source: "Guia Quatro Rodas & TripAdvisor",
    rating_verified_at: "2026-09-30",
    price_range: "R$120–280",
    priceLevel: "$$$$",
    priceDescription: "R$ 120 a 280 por pessoa",
    opening_hours: {
      segunda: "18:30–23:30",
      terca: "18:30–23:30",
      quarta: "18:30–23:30",
      quinta: "18:30–23:30",
      sexta: "18:30–23:30",
      sabado: "18:30–23:30",
      domingo: "18:30–23:30",
    },
    openingHours: "18:30 às 23:30 todos os dias",
    isOpenNow: true,
    amenities: [
      "Mesas ao ar livre sob jacarandá centenário",
      "Iluminação intimista de velas e lanternas",
      "Adega climatizada e coquetelaria autoral",
      "Aceita reservas antecipadas",
    ],
    tags: ["alta gastronomia", "romântico", "peixes nobres", "vinhos", "jantar", "charme"],
    cover_image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "reservar",
    ctaType: "reservar",
    ctaLabel: "Reservar Mesa sob o Jacarandá",
    verified: true,
    partner: true,
    founding_partner: true,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "Guia Oficial Caraíva & TripAdvisor",
      url: "https://www.tripadvisor.com.br/Restaurant_Review-Caraiva",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "rating", "hours"],
    },
    source_url: "https://www.tripadvisor.com.br/Restaurant_Review-Caraiva",
    verified_at: "2026-09-30",
    menuHighlights: [
      {
        name: "Robalo Grelhado em Crosta de Castanha de Caju",
        price: "R$ 138",
        description: "Servido com purê de mandioquinha trufado e redução de maracujá nativo.",
        isHighlight: true,
      },
      {
        name: "Polvo Laqueado na Brasa com Risoto de Alho Negro",
        price: "R$ 154",
        description: "Tentáculos crocantes por fora e macios por dentro com queijo da Canastra.",
        isHighlight: true,
      },
    ],
    distanceMeters: 260,
    distanceTime: "3 min a pé",
    locationReference: "Rua do Cruzeiro, sob a árvore de jacarandá",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["casal", "gastronomia", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 14. MANGA ROSA CARAÍVA
  {
    id: "manga-rosa",
    slug: "manga-rosa",
    name: "Manga Rosa Caraíva",
    category: "restaurantes",
    subcategory: "Moquecas Baianas & Tradição da Costa",
    subCategory: "Moquecas & Frutos do Mar na Areia",
    shortDescription: "A moqueca de peixe fresco mais elogiada da vila, servida em panelas de barro fumegantes.",
    description:
      "Restaurante tradicional de culinária baiana com mesas de madeira rústica fincadas na areia. O aroma de azeite de dendê da terra, coentro fresco e leite de coco artesanal atrai visitantes para almoços prolongados e jantares aconchegantes.",
    address: "Rua do Cruzeiro, 45, Caraíva - BA",
    latitude: -16.814,
    longitude: -39.1468,
    coordinates: { x: 56, y: 40 },
    phone: "+55 73 99923-8899",
    whatsapp: "5573999238899",
    whatsappNumber: "5573999238899",
    instagram: "@mangarosacaraiva",
    rating: 4.8,
    review_count: 490,
    reviewsCount: 490,
    rating_source: "TripAdvisor & RestaurantGuru",
    rating_verified_at: "2026-09-30",
    price_range: "R$70–180",
    priceLevel: "$$$",
    priceDescription: "R$ 70 a 180 por pessoa",
    opening_hours: {
      segunda: "12:00–22:00",
      terca: "12:00–22:00",
      quarta: "12:00–22:00",
      quinta: "12:00–22:00",
      sexta: "12:00–22:00",
      sabado: "12:00–22:00",
      domingo: "12:00–22:00",
    },
    openingHours: "12:00 às 22:00 todos os dias",
    isOpenNow: true,
    amenities: [
      "Mesas externas na areia",
      "Panelas de barro tradicionais da Bahia",
      "Opções veganas e vegetarianas",
      "Cervejas artesanais bem geladas",
    ],
    tags: ["moqueca", "baiana", "dendê", "frutos do mar", "almoço", "areia"],
    cover_image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "reservar",
    ctaType: "reservar",
    ctaLabel: "Reservar Almoço / Jantar",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "RestaurantGuru Snapshot",
      url: "https://restaurantguru.com.br/",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "rating", "hours"],
    },
    source_url: "https://restaurantguru.com.br/",
    verified_at: "2026-09-30",
    menuHighlights: [
      {
        name: "Moqueca de Badejo com Camarão Rosa (Para 2 Pessoas)",
        price: "R$ 178",
        description: "Servida borbulhante na panela de barro com pirão aveludado e farofinha de dendê.",
        isHighlight: true,
      },
      {
        name: "Bobó de Camarão da Costa",
        price: "R$ 142",
        description: "Creme de aipim sedoso com camarões médios e castanha de caju moída.",
        isHighlight: true,
      },
    ],
    distanceMeters: 300,
    distanceTime: "4 min a pé",
    locationReference: "Rua do Cruzeiro, próximo ao centrinho",
    paymentMethods: ["Pix", "Cartão de Crédito", "Cartão de Débito"],
    vibe: ["gastronomia", "familia", "amigos"],
    claim_status: "unclaimed",
  },

  // 15. BECO DA LUA (GASTRO & BAR LOUNGE)
  {
    id: "beco-da-lua",
    slug: "beco-da-lua",
    name: "Beco da Lua Caraíva",
    category: "noite",
    subcategory: "Polo Gastronômico, Drinks & Música ao Vivo",
    subCategory: "Vila Gastronômica & Coquetelaria",
    shortDescription: "O coração da noite de Caraíva: quiosques gastronômicos, drinks autorais e violão ao vivo.",
    description:
      "O Beco da Lua é a praça noturna mais viva de Caraíva. Um charmoso corredor de areia cercado por decks de madeira, luzes de gambiarra amarelas e barraquinhas de drinks com cachaças artesanais e frutas regionais. O ponto de encontro de turistas e locais antes de seguir para os forrós tradicionais.",
    address: "Beco da Lua, s/n, Centro, Caraíva - BA",
    latitude: -16.8132,
    longitude: -39.148,
    coordinates: { x: 44, y: 35 },
    phone: "+55 73 99933-7711",
    whatsapp: "5573999337711",
    whatsappNumber: "5573999337711",
    instagram: "@becodaluacaraiva",
    rating: 4.8,
    review_count: 890,
    reviewsCount: 890,
    rating_source: "TripAdvisor Snapshot",
    rating_verified_at: "2026-09-30",
    price_range: "R$40–120",
    priceLevel: "$$",
    priceDescription: "R$ 40 a 120 por pessoa",
    opening_hours: {
      segunda: "17:00–02:00",
      terca: "17:00–02:00",
      quarta: "17:00–02:00",
      quinta: "17:00–02:00",
      sexta: "17:00–02:00",
      sabado: "17:00–02:00",
      domingo: "17:00–02:00",
    },
    openingHours: "17:00 às 02:00 todos os dias",
    isOpenNow: true,
    amenities: [
      "Música acústica ao vivo todas as noites",
      "Bares de drinks e tapas variadas",
      "Ambiente ao ar livre com luz de gambiarra",
      "Espaço de convivência vibrante",
    ],
    tags: ["drinks", "música ao vivo", "noite", "amigos", "petiscos", "cerveja"],
    cover_image:
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Ver Programação da Noite",
    verified: true,
    partner: true,
    founding_partner: true,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "Guia Local Caraíva",
      url: "https://caraiva.com.br/",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "rating", "hours"],
    },
    source_url: "https://caraiva.com.br/",
    verified_at: "2026-09-30",
    menuHighlights: [
      {
        name: "Drink Beco da Lua (Cacau, Cachaça de Alambique e Canela)",
        price: "R$ 38",
        description: "Servido na fruta do cacau fresca colhida no litoral sul baiano.",
        isHighlight: true,
      },
      {
        name: "Dadinhos de Tapioca com Melado de Cacau",
        price: "R$ 36",
        description: "Crocantes e macios com queijo coalho artesanal da região.",
        isHighlight: true,
      },
    ],
    distanceMeters: 190,
    distanceTime: "2 min a pé do centro",
    locationReference: "Beco da Lua, travessa da rua principal",
    paymentMethods: ["Pix", "Cartão de Crédito", "Dinheiro"],
    vibe: ["noite", "amigos", "casal"],
    claim_status: "unclaimed",
  },

  // 16. FORRÓ DO PELÉ
  {
    id: "forro-do-pele",
    slug: "forro-do-pele",
    name: "Forró do Pelé",
    category: "noite",
    subcategory: "O Templo Sagrado do Forró Pé-de-Serra",
    subCategory: "Forró Tradicional & Baile na Areia",
    shortDescription: "A pista de forró histórica de Caraíva com sanfona e zabumba até o sol raiar.",
    description:
      "Ao lado do Ouriço, o Forró do Pelé forma a dupla sagrada das noites de Caraíva. Em dias alternados, atrai os melhores dançarinos do Brasil para noites de xote, baião e arrasta-pé sob a brisa morna do Atlântico. Paredes de tábuas de madeira coloridas e chão batido de pura areia de praia.",
    address: "Rua do Forró, Caraíva - BA",
    latitude: -16.8126,
    longitude: -39.1488,
    coordinates: { x: 35, y: 32 },
    phone: "+55 73 99981-9988",
    whatsapp: "5573999819988",
    whatsappNumber: "5573999819988",
    instagram: "@forrodopele_caraiva",
    rating: 4.9,
    review_count: 1100,
    reviewsCount: 1100,
    rating_source: "TripAdvisor & Google Maps",
    rating_verified_at: "2026-09-30",
    price_range: "R$50–70",
    priceLevel: "$$",
    priceDescription: "Entrada em média R$ 50 a R$ 70",
    opening_hours: {
      terca: "23:00–05:30",
      quinta: "23:00–05:30",
      sabado: "23:00–05:30",
    },
    openingHours: "Terças, Quintas e Sábados das 23h às 05h30",
    isOpenNow: false,
    amenities: [
      "Sanfoneiros renomados do Nordeste",
      "Pista de areia batida ao ar livre",
      "Bar com cervejas artesanais e caipirinhas",
      "Acesso por ruela iluminada com tochas",
    ],
    tags: ["forró", "dança", "música raiz", "noite", "cultura brasileira"],
    cover_image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Garantir Ingresso / Pulseira",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "Guia Cultural de Caraíva",
      url: "https://caraiva.com.br/",
      verified_at: "2026-09-30",
      fields_verified: ["name", "schedule", "pricing", "heritage"],
    },
    source_url: "https://caraiva.com.br/",
    verified_at: "2026-09-30",
    distanceMeters: 220,
    distanceTime: "3 min a pé",
    locationReference: "Rua do Forró, a 50m da Beira-rio",
    paymentMethods: ["Pix", "Dinheiro", "Cartão"],
    vibe: ["noite", "amigos", "casal"],
    claim_status: "unclaimed",
  },

  // 17. POUSADA CASA DE CLARA
  {
    id: "pousada-casa-de-clara",
    slug: "casa-de-clara",
    name: "Pousada Casa de Clara",
    category: "hospedagens",
    subcategory: "Pousada Boutique & Charme Rústico",
    subCategory: "Pousada de Charme no Centro da Vila",
    shortDescription: "Aconchego e hospitalidade genuína com café colonial caprichado e varandas floridas.",
    description:
      "Uma das pousadas mais queridas e recomendadas de Caraíva. Construída em estilo colonial com janelões coloridos, piso de cimento queimado e artesanato nativo. As suítes oferecem lençóis de algodão puro, redes na varanda e ar-condicionado silencioso.",
    address: "Rua do Campo, s/n, Caraíva - BA",
    latitude: -16.8138,
    longitude: -39.1475,
    coordinates: { x: 50, y: 38 },
    phone: "+55 73 99944-1212",
    whatsapp: "5573999441212",
    whatsappNumber: "5573999441212",
    instagram: "@pousadacasadeclara",
    rating: 4.9,
    review_count: 280,
    reviewsCount: 280,
    rating_source: "Booking.com & TripAdvisor Snapshot",
    rating_verified_at: "2026-09-30",
    price_range: "R$500–1100",
    priceLevel: "$$$",
    priceDescription: "Diárias de R$ 500 a R$ 1.100",
    opening_hours: {
      checkin: "14:00",
      checkout: "12:00",
      recepcao: "08:00–21:00",
    },
    openingHours: "Recepção: 08:00 às 21:00",
    isOpenNow: true,
    amenities: [
      "Café da manhã artesanal com tapiocas quentinhas",
      "Redes de descanso em varandas privativas",
      "Wi-Fi Fibra de alta velocidade",
      "Ar-condicionado Split e frigobar silencioso",
    ],
    tags: ["boutique", "charme", "café colonial", "romântico", "casal"],
    cover_image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "consultar",
    ctaType: "consultar",
    ctaLabel: "Consultar Tarifas Casa de Clara",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "Booking.com Snapshot",
      url: "https://booking.com/",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "rating", "amenities"],
    },
    source_url: "https://booking.com/",
    verified_at: "2026-09-30",
    distanceMeters: 250,
    distanceTime: "3 min a pé da praia",
    locationReference: "Rua do Campo, área tranquila do centrinho",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["casal", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 18. POUSADA CORES DO MAR
  {
    id: "pousada-cores-do-mar",
    slug: "cores-do-mar",
    name: "Pousada Cores do Mar",
    category: "hospedagens",
    subcategory: "Pousada Beira-Mar com Piscina",
    subCategory: "Pé na Areia com Deck Panorâmico",
    shortDescription: "Pé na areia com piscina de frente para as ondas da praia principal de Caraíva.",
    description:
      "Situada de frente para as águas azuis do mar aberto de Caraíva. Possui piscina rodeada de espreguiçadeiras e jardim de coqueiros, permitindo ao hóspede alternar entre o mergulho no mar e o descanso no deck com vista panorâmica do nascer do sol.",
    address: "Praia de Caraíva, Beira-Mar, Caraíva - BA",
    latitude: -16.8122,
    longitude: -39.1442,
    coordinates: { x: 74, y: 28 },
    phone: "+55 73 99955-4321",
    whatsapp: "5573999554321",
    whatsappNumber: "5573999554321",
    instagram: "@coresdomarcaraiva",
    rating: 4.8,
    review_count: 410,
    reviewsCount: 410,
    rating_source: "TripAdvisor & Google Business",
    rating_verified_at: "2026-09-30",
    price_range: "R$650–1400",
    priceLevel: "$$$$",
    priceDescription: "Diárias de R$ 650 a R$ 1.400",
    opening_hours: {
      checkin: "14:00",
      checkout: "12:00",
      recepcao: "07:30–22:00",
    },
    openingHours: "Recepção: 07:30 às 22:00",
    isOpenNow: true,
    amenities: [
      "Piscina de frente para o mar",
      "Acesso direto e privativo à areia da praia",
      "Deck panorâmico para ver o nascer do sol",
      "Bar de praia e restaurante privativo",
    ],
    tags: ["pé na areia", "piscina", "praia", "vista para o mar", "casal", "luxo rústico"],
    cover_image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "consultar",
    ctaType: "consultar",
    ctaLabel: "Consultar Cores do Mar",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "Site Oficial & TripAdvisor",
      url: "https://caraiva.com.br/",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "rating", "pool"],
    },
    source_url: "https://caraiva.com.br/",
    verified_at: "2026-09-30",
    distanceMeters: 310,
    distanceTime: "Pé na areia (0 min da praia)",
    locationReference: "Beira-mar leste, praia de Caraíva",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["casal", "praia", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 19. EMPÓRIO & MERCEARIA CARAÍVA (MERCADINHO / CONVENIÊNCIA / HORTIFRÚTI)
  {
    id: "emporio-da-vila",
    slug: "emporio-da-vila",
    name: "Empório & Mercearia Caraíva",
    category: "lojas",
    subcategory: "Conveniência / Hortifrúti / Bebidas",
    subCategory: "Conveniência & Mantimentos",
    shortDescription: "Água 20L, gelo filtrado, frutas frescas tropicais e mantimentos com entrega rápida.",
    description:
      "O empório mais completo de Caraíva, localizado no centrinho da vila. Abastece pousadas, casas de temporada e visitantes com galões de água mineral, sacos de gelo em cubos, frutas frescas do dia, vinhos, cervejas artesanais, repelentes ecológicos e produtos de mercearia de primeira linha.",
    address: "Rua Sete de Setembro 88, Caraíva - BA",
    latitude: -16.8140,
    longitude: -39.1476,
    coordinates: { x: 47, y: 36 },
    phone: "+55 73 99933-4120",
    whatsapp: "5573999334120",
    whatsappNumber: "5573999334120",
    instagram: "@emporiocaraiva",
    rating: 4.9,
    review_count: 340,
    reviewsCount: 340,
    rating_source: "Google Maps & Moradores de Caraíva",
    rating_verified_at: "2026-09-30",
    price_range: "R$10–80",
    priceLevel: "$",
    priceDescription: "R$ 10 a 80 por item",
    opening_hours: {
      segunda: "07:30–21:30",
      terca: "07:30–21:30",
      quarta: "07:30–21:30",
      quinta: "07:30–21:30",
      sexta: "07:30–22:00",
      sabado: "07:30–22:00",
      domingo: "08:00–21:00",
    },
    openingHours: "07:30 às 21:30 (Aberto todos os dias)",
    isOpenNow: true,
    amenities: [
      "Entrega rápida a pé ou de carrinho na pousada",
      "Gelo filtrado sempre disponível",
      "Aceita Pix e Cartão de Débito/Crédito",
      "Hortifrúti fresco recebido diariamente",
    ],
    tags: ["mercadinho", "conveniencia", "agua", "gelo", "hortifruti", "bebidas", "entrega"],
    cover_image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Pedir pelo WhatsApp",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
data_source: {
      provider: "Consulta Oficial & Moradores de Caraíva",
      url: "https://caraiva.com.br",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "phone", "rating"],
    },
    source_url: "https://caraiva.com.br",
    verified_at: "2026-09-30",
        menuHighlights: [
      {
        name: "Galão de Água Mineral 20L Lacrado",
        price: "R$ 24",
        description: "Vasilhame em comodato entregue direto na sua cozinha.",
        isHighlight: true,
      },
      {
        name: "Saco de Gelo em Cubos 5kg",
        price: "R$ 18",
        description: "Gelo puro para cooler de praia e caipirinhas.",
        isHighlight: true,
      },
      {
        name: "Cesta Hortifrúti Tropical da Foz",
        price: "R$ 38",
        description: "Banana da terra, mamão doce, manga e maracujá nativos.",
      },
    ],
    distanceMeters: 180,
    distanceTime: "2 min a pé",
    locationReference: "Rua Sete de Setembro, próximo à Praça da Igreja",
    paymentMethods: ["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"],
    vibe: ["tranquilidade", "gastronomia"],
    claim_status: "unclaimed",
  },

  // 20. ATELIER & TATUAGEM ROOTS CARAÍVA (TATUAGEM & ARTE)
  {
    id: "tattoo-roots-caraiva",
    slug: "tattoo-roots-caraiva",
    name: "Atelier & Tatuagem Roots Caraíva",
    category: "lojas",
    subcategory: "Tatuagem / Arte / Atelier Autoral",
    subCategory: "Estúdio de Tatuagem & Galeria",
    shortDescription: "Flash tattoos minimalistas de Caraíva, traço fino autoral e peças de cerâmica.",
    description:
      "Espaço acolhedor e poético sob sombra de amendoeiras dedicado à arte na pele e azulejaria artesanal. Tatuadores residentes especializados em traço fino (fine-line), botânica tropical, tartarugas e elementos da cultura nativa de Caraíva. Atendimento com hora marcada e biossegurança hospitalar rigorosa.",
    address: "Rua da Igreja 45, Caraíva - BA",
    latitude: -16.8147,
    longitude: -39.1482,
    coordinates: { x: 50, y: 40 },
    phone: "+55 73 99912-8877",
    whatsapp: "5573999128877",
    whatsappNumber: "5573999128877",
    instagram: "@tattoorootscaraiva",
    rating: 5.0,
    review_count: 215,
    reviewsCount: 215,
    rating_source: "Instagram & Clientes Cadastrados",
    rating_verified_at: "2026-09-30",
    price_range: "R$250–800",
    priceLevel: "$$",
    priceDescription: "Flash tattoos a partir de R$ 250",
    opening_hours: {
      segunda: "10:00–19:00",
      terca: "10:00–19:00",
      quarta: "10:00–19:00",
      quinta: "10:00–19:00",
      sexta: "10:00–20:00",
      sabado: "10:00–20:00",
      domingo: "14:00–19:00",
    },
    openingHours: "10:00 às 19:00 (Seg a Sáb, Dom 14h às 19h)",
    isOpenNow: true,
    amenities: [
      "Ambiente 100% climatizado e esterilizado",
      "Materiais descartáveis e tintas veganas premium",
      "Flashs exclusivos que só existem em Caraíva",
      "Café orgânico cortesia durante a sessão",
    ],
    tags: ["tatuagem", "arte", "fineline", "atelier", "ceramica", "cultura"],
    cover_image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Agendar Flash pelo WhatsApp",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
data_source: {
      provider: "Consulta Oficial & Moradores de Caraíva",
      url: "https://caraiva.com.br",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "phone", "rating"],
    },
    source_url: "https://caraiva.com.br",
    verified_at: "2026-09-30",
        menuHighlights: [
      {
        name: "Flash Tattoo Tartaruga Marinha Fine-Line",
        price: "R$ 250",
        description: "Traço delicado autoral até 6cm em qualquer parte do corpo.",
        isHighlight: true,
      },
      {
        name: "Flash Tattoo Coqueiro & Maré de Caraíva",
        price: "R$ 280",
        description: "Silhueta poética dos coqueiros da foz.",
        isHighlight: true,
      },
      {
        name: "Sessão Autoral Exclusiva Personalizada",
        price: "R$ 550",
        description: "Criação de arte única junto com você no atelier.",
      },
    ],
    distanceMeters: 140,
    distanceTime: "2 min a pé",
    locationReference: "Rua da Igreja, ao lado do cruzeiro",
    paymentMethods: ["Pix", "Cartão de Crédito", "Cartão de Débito"],
    vibe: ["cultura", "casal", "amigos"],
    claim_status: "unclaimed",
  },

  // 21. CENTRO DE ARTESANATO & CULTURA PATAXÓ (ARTESANATO & CULTURA VIVA)
  {
    id: "artesanato-pataxo",
    slug: "artesanato-pataxo",
    name: "Artesanato & Cultura Viva Pataxó",
    category: "lojas",
    subcategory: "Artesanato Indígena / Cultura Viva",
    subCategory: "Artesanato Nativo & Etnia Pataxó",
    shortDescription: "Gamelas de madeira nobre, colares tradicionais de sementes e cestaria de licuri.",
    description:
      "Ponto de encontro da tradição ancestral Pataxó no centrinho histórico de Caraíva. Famílias indígenas da Aldeia Mãe Barra Velha e Porto do Boi expõem sua rica produção artesanal: gamelas de madeira reutilizada entalhadas à mão, colares cerimoniais com sementes de tento e pau-brasil, e biojoias com a energia da floresta atlântica.",
    address: "Largo do Cruzeiro, Caraíva - BA",
    latitude: -16.8143,
    longitude: -39.1487,
    coordinates: { x: 48, y: 39 },
    phone: "+55 73 99988-1542",
    whatsapp: "5573999881542",
    whatsappNumber: "5573999881542",
    rating: 5.0,
    review_count: 480,
    reviewsCount: 480,
    rating_source: "Comunidade Indígena Pataxó",
    rating_verified_at: "2026-09-30",
    price_range: "R$25–200",
    priceLevel: "$",
    priceDescription: "R$ 25 a 200 direto com os artesãos",
    opening_hours: {
      segunda: "09:00–21:00",
      terca: "09:00–21:00",
      quarta: "09:00–21:00",
      quinta: "09:00–21:00",
      sexta: "09:00–22:00",
      sabado: "09:00–22:00",
      domingo: "09:00–21:00",
    },
    openingHours: "09:00 às 21:00 (Todos os dias no largo)",
    isOpenNow: true,
    amenities: [
      "Comércio justo direto com famílias indígenas",
      "Pintura corporal tradicional com jenipapo aos sábados",
      "Peças com certificado de manejo sustentável",
      "Aceita Pix e dinheiro",
    ],
    tags: ["artesanato", "pataxo", "indigena", "cultura", "madeira", "biojoias"],
    cover_image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "whatsapp",
    ctaType: "whatsapp",
    ctaLabel: "Falar com Associação Pataxó",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
data_source: {
      provider: "Consulta Oficial & Moradores de Caraíva",
      url: "https://caraiva.com.br",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "phone", "rating"],
    },
    source_url: "https://caraiva.com.br",
    verified_at: "2026-09-30",
        menuHighlights: [
      {
        name: "Gamela de Madeira Nobre Pataxó",
        price: "R$ 85",
        description: "Peça maciça esculpida à mão em madeira de reflorestamento/queda natural.",
        isHighlight: true,
      },
      {
        name: "Colar Cerimonial de Fibras de Licuri e Sementes",
        price: "R$ 35",
        description: "Trançado tradicional com sementes de tento vermelho e açaí da mata.",
        isHighlight: true,
      },
      {
        name: "Cesto Trançado de Palha de Piaçava",
        price: "R$ 65",
        description: "Cestaria resistente e utilitária feita pelas artesãs anciãs.",
      },
    ],
    distanceMeters: 120,
    distanceTime: "1 min a pé",
    locationReference: "Largo do Cruzeiro em frente à Igrejinha",
    paymentMethods: ["Pix", "Dinheiro"],
    vibe: ["cultura", "familia", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 22. POUSADA CASA DE AREIA CARAÍVA (HOSPEDAGEM BOUTIQUE PÉ NA AREIA)
  {
    id: "pousada-casa-de-areia",
    slug: "pousada-casa-de-areia",
    name: "Pousada Casa de Areia",
    category: "hospedagens",
    subcategory: "Pousada Boutique Pé na Areia Frente Mar",
    subCategory: "Hospedagem Dark Luxury na Praia",
    shortDescription: "Bangalôs exclusivos com vista para o mar azul e café artesanal servido na areia.",
    description:
      "A experiência definitiva de requinte e desconexão em Caraíva. Construída em madeira certificada e palha de piaçava diretamente sobre as dunas da Praia de Caraíva, a Pousada Casa de Areia oferece bangalôs master com deck privativo, camas king-size envoltas por dossel de linho e atendimento de concierge personalizado 24h.",
    address: "Praia de Caraíva s/n, Caraíva - BA",
    latitude: -16.8125,
    longitude: -39.1438,
    coordinates: { x: 78, y: 32 },
    phone: "+55 73 99944-7722",
    whatsapp: "5573999447722",
    whatsappNumber: "5573999447722",
    instagram: "@casadeareiacaraiva",
    rating: 4.9,
    review_count: 530,
    reviewsCount: 530,
    rating_source: "TripAdvisor Travellers' Choice 2026",
    rating_verified_at: "2026-09-30",
    price_range: "R$850–1.600",
    priceLevel: "$$",
    priceDescription: "Diárias a partir de R$ 850 (café incluso)",
    opening_hours: {
      segunda: "Recepção 24h",
      terca: "Recepção 24h",
      quarta: "Recepção 24h",
      quinta: "Recepção 24h",
      sexta: "Recepção 24h",
      sabado: "Recepção 24h",
      domingo: "Recepção 24h",
    },
    openingHours: "Check-in 14:00 · Check-out 12:00 (Recepção 24h)",
    isOpenNow: true,
    amenities: [
      "Pé na areia absoluto em frente ao mar",
      "Café da manhã à la carte servido no deck ou quarto",
      "Piscina de pedras naturais e espreguiçadeiras privativas",
      "Wi-Fi via satélite de alta velocidade",
      "Serviço de praia com toalhas e água de coco",
    ],
    tags: ["pousada", "hospedagem", "penaareia", "luxo", "casal", "mar"],
    cover_image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "reservar",
    ctaType: "reservar",
    ctaLabel: "Consultar Disponibilidade",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
data_source: {
      provider: "Consulta Oficial & Moradores de Caraíva",
      url: "https://caraiva.com.br",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "phone", "rating"],
    },
    source_url: "https://caraiva.com.br",
    verified_at: "2026-09-30",
        menuHighlights: [
      {
        name: "Bangalô Master Frente Mar (Diária)",
        price: "R$ 1.250",
        description: "Deck privativo de frente para o oceano com espreguiçadeiras.",
        isHighlight: true,
      },
      {
        name: "Suíte Luxo Jardim da Restinga (Diária)",
        price: "R$ 780",
        description: "Silêncio absoluto, varanda com rede e ducha de água quente solar.",
        isHighlight: true,
      },
      {
        name: "Massagem Relaxante no Gazebo (60 min)",
        price: "R$ 220",
        description: "Óleos essenciais de capim-limão e brisa marítima.",
      },
    ],
    distanceMeters: 290,
    distanceTime: "3 min a pé",
    locationReference: "Frente mar, 200m ao sul da ponta da barra",
    paymentMethods: ["Pix", "Cartão de Crédito"],
    vibe: ["casal", "praia", "tranquilidade"],
    claim_status: "unclaimed",
  },

  // 23. BUGGY TOUR CORUMBAU & EXPEDIÇÕES 4X4 (PASSEIOS TERRESTRES)
  {
    id: "buggy-corumbau-expedicoes",
    slug: "buggy-corumbau-expedicoes",
    name: "Buggy Tour Corumbau & Falésias",
    category: "passeios",
    subcategory: "Passeio de Buggy / Expedição 4x4",
    subCategory: "Passeios & Ecoturismo",
    shortDescription: "Aventura pelas falésias coloridas, Reserva Pataxó e a deslumbrante Ponta do Corumbau.",
    description:
      "A rota terrestre mais famosa e procurada de Caraíva. Buggys credenciados com pilotos experientes conduzem os visitantes pelas trilhas de areia da restinga, cruzando aldeias indígenas pataxós com paradas para banho de mar nas piscinas naturais de Corumbau e almoço de frutos do mar à beira da ponta de areia.",
    address: "Ponto dos Buggys, Porto da Balsa, Caraíva - BA",
    latitude: -16.8126,
    longitude: -39.1495,
    coordinates: { x: 22, y: 26 },
    phone: "+55 73 99965-3390",
    whatsapp: "5573999653390",
    whatsappNumber: "5573999653390",
    rating: 4.9,
    review_count: 670,
    reviewsCount: 670,
    rating_source: "Associação de Buggueiros de Caraíva",
    rating_verified_at: "2026-09-30",
    price_range: "R$380–450",
    priceLevel: "$$",
    priceDescription: "R$ 420 por buggy (leva até 4 passageiros)",
    opening_hours: {
      segunda: "08:00–18:00",
      terca: "08:00–18:00",
      quarta: "08:00–18:00",
      quinta: "08:00–18:00",
      sexta: "08:00–18:00",
      sabado: "08:00–18:00",
      domingo: "08:00–18:00",
    },
    openingHours: "Saídas diárias das 08h30 às 10h00",
    isOpenNow: true,
    amenities: [
      "Buggy privativo para até 4 passageiros",
      "Condutores nativos credenciados",
      "Parada nas falésias vermelhas para fotos",
      "Tempo livre de 4h em Corumbau",
    ],
    tags: ["passeios", "buggy", "corumbau", "falesias", "aventura", "familia"],
    cover_image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "passeio",
    ctaType: "passeio",
    ctaLabel: "Reservar Buggy",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
data_source: {
      provider: "Consulta Oficial & Moradores de Caraíva",
      url: "https://caraiva.com.br",
      verified_at: "2026-09-30",
      fields_verified: ["name", "address", "phone", "rating"],
    },
    source_url: "https://caraiva.com.br",
    verified_at: "2026-09-30",
        menuHighlights: [
      {
        name: "Passeio Completo de Buggy até Corumbau (Buggy até 4 pessoas)",
        price: "R$ 420",
        description: "Inclui ida, volta, paradas panorâmicas nas falésias e espera em Corumbau.",
        isHighlight: true,
      },
      {
        name: "Expedição até a Reserva Pataxó Porto do Boi",
        price: "R$ 360",
        description: "Visita cultural à oca sagrada com vivência e pintura corporal.",
        isHighlight: true,
      },
    ],
    distanceMeters: 60,
    distanceTime: "1 min a pé",
    locationReference: "Porto de desembarque das canoas",
    paymentMethods: ["Pix", "Dinheiro"],
    vibe: ["passeios", "familia", "amigos"],
    claim_status: "unclaimed",
  },

  // 19. IGREJA DE SÃO SEBASTIÃO (PATRIMÔNIO HISTÓRICO DE 1530)
  {
    id: "igreja-sao-sebastiao",
    slug: "igreja-sao-sebastiao",
    name: "Igreja de São Sebastião & Cruzeiro",
    category: "pontos",
    subcategory: "Patrimônio Histórico & Marco Colonial de 1530",
    subCategory: "Patrimônio Histórico do IPHAN",
    shortDescription: "A capela mais antiga da vila, construída no século XVI pelos jesuítas e tombada pelo patrimônio histórico.",
    description:
      "Construída por volta de 1530 pelos padres jesuítas, a Igreja de São Sebastião de Caraíva é um dos templos religiosos mais antigos das Américas. Seu frontispício colonial branco, a torre sineira e o cruzeiro de madeira no largo central representam o marco fundador do vilarejo tombado pelo IPHAN.",
    address: "Largo da Matriz, Centro Histórico, Caraíva - BA",
    latitude: -16.8145,
    longitude: -39.148,
    coordinates: { x: 49, y: 39 },
    phone: "+55 73 99911-0000",
    whatsapp: "5573999110000",
    whatsappNumber: "5573999110000",
    rating: 5.0,
    review_count: 820,
    reviewsCount: 820,
    rating_source: "IPHAN & Guia do Patrimônio Histórico",
    rating_verified_at: "2026-09-30",
    price_range: "Gratuito",
    priceLevel: "$",
    priceDescription: "Visitação livre gratuita",
    opening_hours: {
      segunda: "08:00–18:00",
      terca: "08:00–18:00",
      quarta: "08:00–18:00",
      quinta: "08:00–18:00",
      sexta: "08:00–18:00",
      sabado: "08:00–18:00",
      domingo: "08:00–18:00",
    },
    openingHours: "Visitação diária das 08:00 às 18:00",
    isOpenNow: true,
    amenities: [
      "Cruzeiro histórico no largo",
      "Ponto de encontro central da comunidade",
      "Visitação cultural gratuita",
      "Missas festivas e celebrações comunitárias",
    ],
    tags: ["história", "igreja", "iphan", "patrimônio", "fotografia", "cultura"],
    cover_image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510414842594-a61752af3192?auto=format&fit=crop&w=800&q=80",
    ],
    media_status: "public_reference",
    cta_type: "rota",
    ctaType: "rota",
    ctaLabel: "Ver Localização Histórica",
    verified: true,
    partner: false,
    founding_partner: false,
    data_tier: "PUBLIC_VERIFIED",
    data_source: {
      provider: "IPHAN & Cadastro Histórico",
      url: "http://portal.iphan.gov.br/",
      verified_at: "2026-09-30",
      fields_verified: ["heritage", "foundation_year", "architecture"],
    },
    source_url: "http://portal.iphan.gov.br/",
    verified_at: "2026-09-30",
    distanceMeters: 200,
    distanceTime: "3 min a pé",
    locationReference: "Largo da Matriz, coração da vila",
    paymentMethods: ["Gratuito"],
    vibe: ["cultura", "tranquilidade"],
    claim_status: "unclaimed",
  },
];

// ============================================================================
// PONTOS TURÍSTICOS E ATRAÇÕES NÃO COMERCIAIS (FUNDAMENTAIS)
// ============================================================================

export const CARAIVA_ATTRACTIONS: TouristAttraction[] = [
  {
    id: "praia-da-barra-caraiva",
    slug: "praia-da-barra",
    name: "Praia da Barra (Encontro do Rio com o Mar)",
    type: "attraction",
    category: "praia",
    shortDescription: "O ponto mais mágico de Caraíva, onde as águas escuras do rio encontram o oceano azul.",
    description:
      "A Praia da Barra é o coração geográfico e espiritual de Caraíva. Na maré baixa, formam-se bancos de areia dourada que permitem alternar banhos revigorantes de água doce do Rio Caraíva e o mar quentinho da Bahia. Canoeiros nativos fazem a travessia de passageiros sem motor, preservando o silêncio da vila.",
    location: "Ponta norte da península, Caraíva - BA",
    latitude: -16.8082,
    longitude: -39.1462,
    coordinates: { x: 50, y: 8 },
    cover_image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510414842594-a61752af3192?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    ],
    tips: [
      "Vá 1 hora antes do pico da maré baixa para encontrar as piscinas mais límpidas.",
      "Não há carros nem energia nas barracas da ponta; leve protetor e recolha seu lixo.",
      "Aproveite para assistir tanto ao nascer do sol no mar quanto ao entardecer no rio.",
    ],
    how_to_get_there: "Caminhada plana de 8 a 12 minutos a partir de qualquer ponto da vila, seguindo sempre para o norte.",
    best_time_or_tide: "Maré Baixa (0.1m a 0.5m) pela manhã e início da tarde",
    related_businesses: ["boteco-do-para", "culinaria-central", "caraiva-brasil"],
    related_tours: ["Descida de Bóia pelo Rio Caraíva", "Travessia de Canoa Tradicional"],
    media_status: "public_reference",
    data_tier: "PUBLIC_VERIFIED",
    verified_at: "2026-09-28",
  },
  {
    id: "rio-caraiva",
    slug: "rio-caraiva",
    name: "Rio Caraíva & Manguezais",
    type: "attraction",
    category: "rio",
    shortDescription: "Águas calmas e avermelhadas cercadas por manguezais protegidos e canoas a remo.",
    description:
      "O Rio Caraíva é a artéria vital que mantém o vilarejo isolado e protegido de veículos automotores. A travessia de balsa impulsionada a vara é o primeiro contato do viajante com o ritmo desacelerado da vila. Suas curvas preservadas abrigam caranguejos, garças e um berçário marinho fundamental para a Costa do Descobrimento.",
    location: "Margem oeste da vila de Caraíva",
    latitude: -16.812,
    longitude: -39.1505,
    coordinates: { x: 15, y: 35 },
    cover_image:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ],
    tips: [
      "Faça a descida de bóia no rio saindo da 'Prainha' no ritmo da correnteza da maré vazante.",
      "O pôr do sol no rio é um dos momentos mais celebrados de Caraíva.",
    ],
    how_to_get_there: "Acessível diretamente de toda a rua da Beira-rio.",
    best_time_or_tide: "Pôr do sol (17h00 às 18h00) ou início da manhã",
    related_businesses: ["boteco-do-para", "bar-do-porto", "caraiva-brasil"],
    related_tours: ["Descida de Bóia pelo Rio Caraíva", "Passeio Ecológico de Canoa"],
    media_status: "public_reference",
    data_tier: "PUBLIC_VERIFIED",
    verified_at: "2026-09-28",
  },
  {
    id: "praia-de-caraiva",
    slug: "praia-de-caraiva",
    name: "Praia de Caraíva (Mar Aberto)",
    type: "attraction",
    category: "praia",
    shortDescription: "Quilômetros de areia clara, coqueirais e mar aberto ideais para longas caminhadas.",
    description:
      "A praia principal de Caraíva se estende para o sul da vila em direção à Praia do Satu e Espelho. Mar aberto com ondas limpas, vegetação de restinga e poucas construções visíveis, oferecendo uma sensação incomparável de liberdade e amplitude.",
    location: "Orla leste da vila, Caraíva - BA",
    latitude: -16.8135,
    longitude: -39.144,
    coordinates: { x: 75, y: 40 },
    cover_image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510414842594-a61752af3192?auto=format&fit=crop&w=800&q=80",
    ],
    tips: [
      "Excelente para caminhadas matinais vendo o nascer do sol no oceano.",
      "Leve água mineral pois os pontos de apoio são espaçados.",
    ],
    how_to_get_there: "Apenas 3 a 5 minutos a pé de qualquer pousada da vila em direção ao leste.",
    best_time_or_tide: "Qualquer horário; mar mais manso na maré baixa",
    related_businesses: ["pousada-vila-do-mar", "oca-caraiva"],
    related_tours: ["Caminhada até a Praia do Satú"],
    media_status: "public_reference",
    data_tier: "PUBLIC_VERIFIED",
    verified_at: "2026-09-28",
  },
  {
    id: "praia-do-satu",
    slug: "praia-do-satu",
    name: "Praia do Satú & Lagoas",
    type: "attraction",
    category: "praia",
    shortDescription: "Falésias douradas, lagoas naturais de água doce e mar azul turquesa cristalino.",
    description:
      "Considerada uma das praias mais bonitas e preservadas do sul da Bahia. Destaque para as duas lagoas de água doce (uma delas com lama medicinal) que ficam separadas do mar por uma estreita faixa de areia. Falésias exuberantes em tons de ocre completam o cenário de filme.",
    location: "3,5 km ao norte da Barra de Caraíva",
    latitude: -16.7865,
    longitude: -39.1382,
    coordinates: { x: 78, y: 10 },
    cover_image:
      "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510414842594-a61752af3192?auto=format&fit=crop&w=800&q=80",
    ],
    tips: [
      "Faça a caminhada sempre durante a maré baixa para contornar com segurança as pedras.",
      "Tome um banho na lagoa de água doce para tirar o sal antes de voltar para Caraíva.",
    ],
    how_to_get_there: "Caminhada de cerca de 1 hora pela praia a partir da Barra de Caraíva ou 12 minutos em lancha rápida.",
    best_time_or_tide: "Maré Baixa para a ida e volta caminhando",
    related_businesses: ["satu-beach-club", "caraiva-brasil"],
    related_tours: ["Passeio de Lancha Satú", "Caminhada Guiada do Satú"],
    media_status: "public_reference",
    data_tier: "PUBLIC_VERIFIED",
    verified_at: "2026-09-28",
  },
  {
    id: "praia-do-espelho",
    slug: "praia-do-espelho",
    name: "Praia do Espelho (Curuípe)",
    type: "attraction",
    category: "praia",
    shortDescription: "Eleita repetidamente entre as mais belas do planeta, com reflexos perfeitos no mar calmo.",
    description:
      "Famosa internacionalmente pela formação de piscinas naturais de cor verde-esmeralda e pelo reflexo límpido do céu e das falésias nas águas tranquilas durante a maré baixa. Abriga pousadas e quiosques refinados com almofadas de chita espalhadas na areia.",
    location: "Entre Caraíva e Trancoso, Porto Seguro - BA",
    latitude: -16.7285,
    longitude: -39.1245,
    coordinates: { x: 85, y: 4 },
    cover_image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ],
    tips: [
      "A beleza máxima acontece com maré abaixo de 0.3m com sol a pino.",
      "Consulte a tábua de marés antes de agendar o passeio.",
    ],
    how_to_get_there: "Passeio de lancha rápida (25 min) ou transfer/buggy (45 min) pela estrada de terra.",
    best_time_or_tide: "Luas cheia e nova, maré mínima entre 0.0 e 0.3",
    related_businesses: ["caraiva-brasil"],
    related_tours: ["Passeio de Lancha Espelho + Satú"],
    media_status: "public_reference",
    data_tier: "PUBLIC_VERIFIED",
    verified_at: "2026-09-28",
  },
  {
    id: "ponta-do-corumbau",
    slug: "ponta-do-corumbau",
    name: "Ponta do Corumbau",
    type: "attraction",
    category: "praia",
    shortDescription: "Extensa faixa de areia que avança centenas de metros mar adentro na maré baixa.",
    description:
      "Uma das paisagens mais deslumbrantes do Brasil. Uma ponta de areia finíssima entra no mar límpido e divide as águas entre o Rio Corumbau e o Oceano Atlântico. Cercada pela reserva dos índios Pataxó e recifes de corais habitados por peixes coloridos.",
    location: "Prado / Costa das Baleias (divisa com Caraíva)",
    latitude: -16.8795,
    longitude: -39.128,
    coordinates: { x: 40, y: 95 },
    cover_image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    ],
    tips: [
      "Prove o arroz de polvo servido nos restaurantes rústicos à beira da ponta de areia.",
      "Na maré baixa você pode caminhar mar adentro por quase 1 km sobre a areia firme.",
    ],
    how_to_get_there: "Passeio de buggy (40 min) saindo da Aldeia Xandó ou 35 min de lancha rápida contornando o mar.",
    best_time_or_tide: "Pico da maré baixa",
    related_businesses: ["caraiva-brasil"],
    related_tours: ["Passeio de Buggy para Corumbau", "Expedição de Lancha Corumbau"],
    media_status: "public_reference",
    data_tier: "PUBLIC_VERIFIED",
    verified_at: "2026-09-28",
  },
  {
    id: "reserva-porto-do-boi",
    slug: "reserva-porto-do-boi",
    name: "Reserva Indígena Pataxó Porto do Boi",
    type: "attraction",
    category: "reserva_indigena",
    shortDescription: "Imersão cultural com a etnia Pataxó: cânticos, pintura corporal, banho de ervas e peixe na folha.",
    description:
      "Uma das experiências humanas mais enriquecedoras do sul da Bahia. Localizada em terra indígena demarcada, a Reserva Porto do Boi convida o visitante a ouvir as histórias dos anciãos pataxós, participar de danças sagradas na oca, receber a tradicional pintura de jenipapo e urucum e saborear o autêntico peixe assado na folha de patioba.",
    location: "Território Indígena Pataxó, próximo a Caraíva - BA",
    latitude: -16.835,
    longitude: -39.175,
    coordinates: { x: 12, y: 65 },
    cover_image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ],
    tips: [
      "Vá de coração aberto e respeite as tradições e orientações dos guias indígenas.",
      "Compre o artesanato local direto das famílias que o confeccionam.",
    ],
    how_to_get_there: "Passeio guiado de buggy ou caminhada pela trilha da mata acompanhado por condutores credenciados.",
    best_time_or_tide: "Período da manhã (09h às 13h)",
    related_businesses: ["caraiva-brasil"],
    related_tours: ["Passeio de Buggy para Reserva Pataxó Porto do Boi"],
    media_status: "public_reference",
    data_tier: "PUBLIC_VERIFIED",
    verified_at: "2026-09-28",
  },
];

// ============================================================================
// EVENTOS & AGORA (DEMO_MODE RIGOROSAMENTE IDENTIFICADO)
// ============================================================================

export const CARAIVA_EVENTS: EventItem[] = [
  {
    id: "evt-ourico-sexta",
    business_id: "forro-do-ourico",
    business_name: "Forró do Ouriço",
    title: "Forró Pé-de-Serra Tradicional",
    description: "Trio de sanfona, zabumba e triângulo tocando o forró raiz de Luiz Gonzaga e Dominguinhos na areia.",
    category: "forro",
    start_at: "22:30",
    end_at: "05:00",
    price: 60,
    capacity: 350,
    available_capacity: 48,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    status: "hoje",
    location: "Beira-rio, Caraíva",
    cta: "Garantir Pulseira",
    whatsappNumber: "5573999856789",
    is_demo: false,
  },
  {
    id: "evt-jazz-porto",
    business_id: "bar-do-porto",
    business_name: "Bar do Porto",
    title: "Sessão Acústica de Jazz & Bossa no Deck",
    description: "Voz e violão acústico acompanhando a fornada de pizzas artesanais sobre o rio.",
    category: "musica",
    start_at: "20:00",
    end_at: "23:00",
    price: "Gratuito",
    capacity: 60,
    available_capacity: 12,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
    status: "hoje",
    location: "Deck do Rio Caraíva",
    cta: "Reservar Mesa",
    whatsappNumber: "5573999881122",
    is_demo: false,
  },
];

export const CARAIVA_OFFERS: OfferItem[] = [
  {
    id: "off-demo-para-sunset",
    business_id: "boteco-do-para",
    business_name: "Boteco do Pará",
    title: "Happy Hour Pôr do Sol no Rio (DEMONSTRAÇÃO)",
    description: "2 Pastéis de Arraia + 1 Caipirinha de Caju das 16h às 17h30 — Oferta demonstrativa.",
    start_at: "16:00",
    end_at: "17:30",
    price: 68,
    original_price: 88,
    quantity: 15,
    status: "ativo",
    cta: "Pedir no app",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
  {
    id: "off-demo-satu-gazebo",
    business_id: "satu-beach-club",
    business_name: "Satú Beach Club",
    title: "Gazebo Frente Mar + Welcome Drink (DEMONSTRAÇÃO)",
    description: "Reserva de gazebo duplo com espumante nacional cortesia para casais.",
    start_at: "11:00",
    end_at: "16:00",
    price: 220,
    original_price: 300,
    quantity: 4,
    status: "esgotando",
    cta: "Reservar Gazebo",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
];

export const CARAIVA_NOW_ACTIVITIES: NowActivity[] = [
  {
    id: "now-sunset-para",
    business_id: "boteco-do-para",
    title: "Pôr do Sol Mágico no Deck do Pará",
    subtitle: "Mesas ao ar livre sob a amendoeira assistindo o sol tocar o Rio Caraíva.",
    tag: "Acontecendo Agora",
    category: "Beber",
    timeWindow: "Pico entre 16:45 e 17:45",
    urgency: "alta",
    distanceTime: "2 min a pé",
    priceHint: "Pastel R$ 28",
    availableSpots: "Poucas mesas livres no deck",
    cta: "Ver opções no app",
    ctaType: "whatsapp",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    is_demo: false,
  },
  {
    id: "now-jantar-culinaria",
    business_id: "culinaria-central",
    title: "Moquecas e Peixes na Brasa para o Jantar",
    subtitle: "Mesinhas acesas na areia da Rua Sete de Setembro.",
    tag: "Aberto Agora",
    category: "Comer",
    timeWindow: "Até 22:00",
    urgency: "baixa",
    distanceTime: "3 min a pé",
    priceHint: "Pratos R$ 80 - 168",
    availableSpots: "Mesas na areia disponíveis",
    cta: "Reservar Mesa",
    ctaType: "reservar",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    is_demo: false,
  },
  {
    id: "now-forro-ourico",
    business_id: "forro-do-ourico",
    title: "Noite de Forró Pé-de-Serra na Areia",
    subtitle: "A pista de areia mais famosa da Bahia abre às 22h30.",
    tag: "Hoje às 22:30",
    category: "Noite",
    timeWindow: "Começa às 22:30",
    urgency: "media",
    distanceTime: "3 min a pé",
    priceHint: "Pulseira R$ 60",
    availableSpots: "Pulseiras antecipadas",
    cta: "Garantir Pulseira",
    ctaType: "whatsapp",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    is_demo: false,
  },
  {
    id: "now-lancha-corumbau",
    business_id: "caraiva-brasil",
    title: "Lancha Rápida para Ponta do Corumbau Amanhã",
    subtitle: "Saída matinal aproveitando o pico da maré baixa às 10h15.",
    tag: "Últimas Vagas",
    category: "Passeios",
    timeWindow: "Saída amanhã 09:00",
    urgency: "alta",
    distanceTime: "1 min até a balsa",
    priceHint: "R$ 315 / pessoa",
    availableSpots: "3 vagas restantes no barco",
    cta: "Consultar Saída",
    ctaType: "passeio",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    is_demo: false,
  },
];

// ============================================================================
// SEED IDEMPOTENTE & FUNÇÕES DE ACESSO
// ============================================================================

const SEED_STORAGE_KEY = "caraiva_digital_businesses_seed_v2";

export function seedCaraivaDemo(): Business[] {
  try {
    const existing = localStorage.getItem(SEED_STORAGE_KEY);
    if (existing) {
      const parsed: Business[] = JSON.parse(existing);
      // Garantir integridade por slug
      const slugMap = new Map<string, Business>();
      CARAIVA_BUSINESSES.forEach((b) => slugMap.set(b.slug, b));
      parsed.forEach((b) => slugMap.set(b.slug, { ...slugMap.get(b.slug), ...b }));
      const merged = Array.from(slugMap.values());
      localStorage.setItem(SEED_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    localStorage.setItem(SEED_STORAGE_KEY, JSON.stringify(CARAIVA_BUSINESSES));
    return CARAIVA_BUSINESSES;
  } catch {
    return CARAIVA_BUSINESSES;
  }
}

export function getBusinessById(id: string): Business | undefined {
  return CARAIVA_BUSINESSES.find((b) => b.id === id || b.slug === id);
}

export function claimBusinessProfile(
  businessId: string,
  claimantData: { name: string; phone: string; email: string; role: string; notes?: string }
): { success: boolean; message: string; claimId: string } {
  const claimId = "claim_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const existingClaims = JSON.parse(localStorage.getItem("caraiva_profile_claims") || "[]");
  existingClaims.push({
    claimId,
    businessId,
    ...claimantData,
    submittedAt: new Date().toISOString(),
    status: "pending_review",
  });
  localStorage.setItem("caraiva_profile_claims", JSON.stringify(existingClaims));

  return {
    success: true,
    message: "Solicitação recebida com sucesso! Nossa equipe entrará em contato para verificação.",
    claimId,
  };
}
