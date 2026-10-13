// Domínio único do ecossistema Caraíva Digital.
// Preparado para produção com Supabase e UI/UX Pro Max.

export type Niche = "delivery" | "hospitality" | "tours" | "services" | "retail";
export type StoreCategory = "restaurante" | "bebidas" | "farmacia" | "mercado" | "servicos" | "loja";

export interface Establishment {
  id: string;
  name: string;
  niche: Niche;
  category: StoreCategory;
  tagline: string;
  zone: string;
  rating: number;
  deliveryTime: string;
  image: string;
  plan: PlanId;
  pixKey: string;
  isOpen: boolean;
}

export interface Product {
  id: string;
  establishmentId: string;
  name: string;
  category: string;
  description?: string;
  price: number; // centavos
  stock?: number; // unidades em estoque
  image: string;
  emoji: string;
  available: boolean;
  tags: string[];
}

export interface Room {
  id: string;
  establishmentId: string;
  name: string;
  nightly: number; // centavos
  lastMinute?: number; // preço "só hoje"
  capacity: number;
  available?: boolean;
  blockedDates?: string[];
  amenities: string[];
  image?: string;
  icalImportUrl?: string;
}

export interface Tour {
  id: string;
  establishmentId: string;
  name: string;
  departure: string; // HH:mm
  meetingPoint: string;
  pricePerSeat: number;
  seats: number;
  booked: number;
  tideSensitive: boolean;
  available?: boolean;
  image?: string;
  tags: string[];
}

export interface NfcTag {
  id: string;
  establishmentId: string;
  label: string; // "Quarto 04"
  deliveryAddress: string;
}

export interface WellnessService {
  id: string;
  establishmentId: string;
  name: string;
  category: "massagem" | "yoga" | "surf_kite" | "terapia";
  description: string;
  durationMin: number;
  price: number; // centavos
  depositRequired: number; // centavos de entrada (sinal Pix)
  therapist: string;
  location: string;
  image: string;
  rating: number;
  slotsToday: string[];
}

export interface RetailItem {
  id: string;
  establishmentId: string;
  name: string;
  category: "biojoias" | "vestuario" | "decoracao" | "lembrancas";
  description: string;
  price: number; // centavos
  stock: number;
  artisan: string;
  image: string;
  tags: string[];
}

export type PlanId = "essencial" | "pro" | "delivery";

export const ZONES = [
  { id: "centro", name: "Centro / Igrejinha", fee: 1000 },
  { id: "rio", name: "Beira-rio", fee: 1500 },
  { id: "praia", name: "Orla / Praia", fee: 1500 },
  { id: "distante", name: "Pousadas distantes (Xandó / Nova Caraíva)", fee: 2500 },
] as const;

export const REGISTERED_POUSADAS = [
  "Pousada Flor de Caraíva",
  "Pousada da Barra",
  "Pousada Thale",
  "Pousada Coco Brasil",
  "Pousada Casa de Praia",
  "Pousada San Antonio",
  "Pousada Vila dos Corais",
  "Pousada Caraíva Bela",
  "Casa de Temporada (Aluguel)",
] as const;

export const establishments: Establishment[] = [
  { 
    id: "merc-barra", 
    name: "Mercadinho da Barra", 
    niche: "delivery", 
    category: "mercado",
    tagline: "Água mineral, carvão, gelo e mercearia", 
    zone: "centro", 
    rating: 4.8, 
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80",
    plan: "delivery", 
    pixKey: "merc@pix",
    isOpen: true 
  },
  { 
    id: "dep-gelo", 
    name: "Depósito Gelo & Bebidas Caraíva", 
    niche: "delivery", 
    category: "bebidas",
    tagline: "Fardos de água, gelo 5kg/10kg e cerveja trincando", 
    zone: "rio", 
    rating: 4.9, 
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    plan: "delivery", 
    pixKey: "gelocaraiva@pix",
    isOpen: true 
  },
  { 
    id: "rest-rio", 
    name: "Cozinha do Rio Caraíva", 
    niche: "delivery", 
    category: "restaurante",
    tagline: "Moquecas baianas, peixe fresco e petiscos", 
    zone: "rio", 
    rating: 4.9, 
    deliveryTime: "35-50 min",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    plan: "delivery", 
    pixKey: "rio@pix",
    isOpen: true 
  },
  { 
    id: "farm-caraiva", 
    name: "Drogaria & Farmácia Caraíva", 
    niche: "delivery", 
    category: "farmacia",
    tagline: "Protetor solar, repelentes, pós-sol e primeiros socorros", 
    zone: "centro", 
    rating: 5.0, 
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80",
    plan: "delivery", 
    pixKey: "farmaciacaraiva@pix",
    isOpen: true 
  },
  { 
    id: "pous-flor", 
    name: "Pousada Flor de Caraíva", 
    niche: "hospitality", 
    category: "restaurante",
    tagline: "Bangalôs rústicos a 2 min da praia", 
    zone: "praia", 
    rating: 4.9, 
    deliveryTime: "Check-in 14h",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    plan: "pro", 
    pixKey: "flor@pix",
    isOpen: true 
  },
  { 
    id: "buggy-ze", 
    name: "Buggy do Zé", 
    niche: "tours", 
    category: "restaurante",
    tagline: "Corumbau e Praia do Espelho com guia nativo", 
    zone: "centro", 
    rating: 5.0, 
    deliveryTime: "Saídas 08:30 / 09:00",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    plan: "essencial", 
    pixKey: "ze@pix",
    isOpen: true 
  },
  { 
    id: "barco-pataxo", 
    name: "Canoa Pataxó", 
    niche: "tours", 
    category: "restaurante",
    tagline: "Rio, manguezal e pôr do sol na aldeia Xandó", 
    zone: "rio", 
    rating: 4.9, 
    deliveryTime: "Saída 16:30",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80",
    plan: "essencial", 
    pixKey: "canoa@pix",
    isOpen: true 
  },
  { 
    id: "spa-caraiva", 
    name: "Espaço Bem-Estar & Massagens", 
    niche: "services", 
    category: "servicos",
    tagline: "Massagem relaxante pós-praia, drenagem, yoga e aulas de kite", 
    zone: "rio", 
    rating: 5.0, 
    deliveryTime: "Atendimento no Espaço ou Pousada",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
    plan: "pro", 
    pixKey: "spa@pix",
    isOpen: true 
  },
  { 
    id: "loja-pataxo", 
    name: "Arte & Raízes Pataxó Caraíva", 
    niche: "retail", 
    category: "loja",
    tagline: "Biojoias, gamelas de madeira nobre, cangas e cerâmica artesanal", 
    zone: "centro", 
    rating: 4.9, 
    deliveryTime: "Retirada na loja ou entrega na pousada",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80",
    plan: "essencial", 
    pixKey: "pataxo@pix",
    isOpen: true 
  },
];

export const products: Product[] = [
  // Depósito de Bebidas & Gelo
  { 
    id: "p1", 
    establishmentId: "dep-gelo", 
    name: "Fardo Água Mineral 1,5L (6 garrafas)", 
    category: "Água & Gelo", 
    description: "Sem gás, gelada ou natural. Indispensável para a estadia.",
    price: 2400, 
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80",
    emoji: "💧", 
    available: true, 
    tags: ["agua", "mineral", "hidratar", "fardo"] 
  },
  { 
    id: "p2", 
    establishmentId: "dep-gelo", 
    name: "Saco de Gelo Filtrado 5kg", 
    category: "Água & Gelo", 
    description: "Cubos de gelo puro para caipirinhas, drinks e cooler.",
    price: 1500, 
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80",
    emoji: "🧊", 
    available: true, 
    tags: ["gelo", "cooler", "drink", "bebida"] 
  },
  { 
    id: "p3", 
    establishmentId: "dep-gelo", 
    name: "Pack Cerveja Corona Extra 330ml (6un)", 
    category: "Bebidas Geladas", 
    description: "Long neck estalando de gelada, pronta para a praia.",
    price: 5400, 
    image: "https://images.unsplash.com/photo-1608270546103-979927b8849b?w=500&auto=format&fit=crop&q=80",
    emoji: "🍺", 
    available: true, 
    tags: ["cerveja", "gelada", "corona", "praia"] 
  },

  // Mercadinho da Barra
  { 
    id: "p4", 
    establishmentId: "merc-barra", 
    name: "Kit Churrasco na Praia", 
    category: "Combos & Praia", 
    description: "Saco de carvão 3kg + Gelo 5kg + Sal grosso temperado.",
    price: 5900, 
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80",
    emoji: "🔥", 
    available: true, 
    tags: ["churrasco", "carvao", "gelo", "praia"] 
  },
  { 
    id: "p5", 
    establishmentId: "merc-barra", 
    name: "Pão de Forma Integral + Café Torrado", 
    category: "Mercearia & Café", 
    description: "Ideal para o café da manhã na casa de temporada.",
    price: 2800, 
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    emoji: "🍞", 
    available: true, 
    tags: ["pao", "cafe", "mercearia", "cafe da manha"] 
  },

  // Restaurante Cozinha do Rio
  { 
    id: "p6", 
    establishmentId: "rest-rio", 
    name: "Moqueca Baiana de Robalo com Camarão", 
    category: "Moquecas & Peixes", 
    description: "Serve 2 pessoas. Acompanha arroz de coco, pirão e farofa de dendê.",
    price: 18900, 
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80",
    emoji: "🐟", 
    available: true, 
    tags: ["moqueca", "peixe", "camarao", "jantar", "romantico"] 
  },
  { 
    id: "p7", 
    establishmentId: "rest-rio", 
    name: "Peixe Vermelho Inteiro na Brasa", 
    category: "Moquecas & Peixes", 
    description: "Assado na folha de bananeira com vinagrete e mandioca na manteiga de garrafa.",
    price: 14900, 
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80",
    emoji: "🔥", 
    available: true, 
    tags: ["peixe", "assado", "brasa", "almoco"] 
  },
  { 
    id: "p8", 
    establishmentId: "rest-rio", 
    name: "Bowl de Açaí Puro 500ml", 
    category: "Sobremesas & Leves", 
    description: "Açaí batido com banana, granola artesanal e mel nativo.",
    price: 3200, 
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80",
    emoji: "🫐", 
    available: true, 
    tags: ["acai", "leve", "refrescar", "praia"] 
  },

  // Farmácia Caraíva
  { 
    id: "p9", 
    establishmentId: "farm-caraiva", 
    name: "Protetor Solar FPS 50 La Roche (200ml)", 
    category: "Sol & Praia", 
    description: "Alta proteção resistente à água do mar e areia.",
    price: 8900, 
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=80",
    emoji: "🧴", 
    available: true, 
    tags: ["protetor", "sol", "fps", "praia"] 
  },
  { 
    id: "p10", 
    establishmentId: "farm-caraiva", 
    name: "Repelente Exposis Extreme Spray (100ml)", 
    category: "Insetos & Proteção", 
    description: "Proteção máxima contra mosquitos e borrachudos da barra.",
    price: 6400, 
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
    emoji: "🦟", 
    available: true, 
    tags: ["repelente", "mosquito", "exposis", "barra"] 
  },
  { 
    id: "p11", 
    establishmentId: "farm-caraiva", 
    name: "Kit Pós-Sol & Alívio Imediato", 
    category: "Sol & Praia", 
    description: "Gel de Aloe Vera calmante para queimaduras de sol.",
    price: 4500, 
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    emoji: "🌱", 
    available: true, 
    tags: ["pos-sol", "aloe", "calmante", "queimadura"] 
  },
];

export const rooms: Room[] = [
  { 
    id: "r1", 
    establishmentId: "pous-flor", 
    name: "Bangalô Coqueiro", 
    nightly: 85000, 
    lastMinute: 59000, 
    capacity: 2, 
    amenities: ["Ar-condicionado", "Varanda com rede", "Café da manhã incluso"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: "r2", 
    establishmentId: "pous-flor", 
    name: "Suíte Beira-Rio", 
    nightly: 68000, 
    capacity: 2, 
    amenities: ["Vista panorâmica do rio", "Frigobar", "Café da manhã"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: "r3", 
    establishmentId: "pous-flor", 
    name: "Casa Família da Vila", 
    nightly: 140000, 
    capacity: 5, 
    amenities: ["2 quartos privativos", "Cozinha equipada", "Quintal na areia"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80" 
  },
];

export const tours: Tour[] = [
  { 
    id: "t1", 
    establishmentId: "buggy-ze", 
    name: "Buggy Ponta do Corumbau", 
    departure: "09:00", 
    meetingPoint: "Travessia do rio (lado Caraíva)", 
    pricePerSeat: 25000, 
    seats: 4, 
    booked: 2, 
    tideSensitive: true,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80", 
    tags: ["corumbau", "buggy", "praia", "aventura"] 
  },
  { 
    id: "t2", 
    establishmentId: "buggy-ze", 
    name: "Buggy Praia do Espelho", 
    departure: "08:30", 
    meetingPoint: "Travessia do rio (lado Caraíva)", 
    pricePerSeat: 28000, 
    seats: 4, 
    booked: 4, 
    tideSensitive: true,
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=80", 
    tags: ["espelho", "buggy", "piscinas", "falésias"] 
  },
  { 
    id: "t3", 
    establishmentId: "barco-pataxo", 
    name: "Canoa no Mangue ao Pôr do Sol", 
    departure: "16:30", 
    meetingPoint: "Píer da Igrejinha de Caraíva", 
    pricePerSeat: 12000, 
    seats: 8, 
    booked: 3, 
    tideSensitive: false,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80", 
    tags: ["tranquilo", "criancas", "por do sol", "mangue", "rio"] 
  },
];

export const nfcTags: NfcTag[] = [
  { id: "flor-q04", establishmentId: "pous-flor", label: "Bangalô Coqueiro", deliveryAddress: "Pousada Flor de Caraíva · Bangalô Coqueiro" },
  { id: "rio-mesa7", establishmentId: "rest-rio", label: "Mesa 7 Beira-Rio", deliveryAddress: "Cozinha do Rio Caraíva · Mesa 7" },
  { id: "merc-balcao", establishmentId: "merc-barra", label: "Balcão Principal", deliveryAddress: "Mercadinho da Barra" },
  { id: "spa-tenda1", establishmentId: "spa-caraiva", label: "Tenda Beira-Rio", deliveryAddress: "Espaço Bem-Estar · Tenda 1" },
  { id: "loja-vitrine", establishmentId: "loja-pataxo", label: "Vitrine Central", deliveryAddress: "Arte & Raízes Pataxó" },
];

export const services: WellnessService[] = [
  {
    id: "s1",
    establishmentId: "spa-caraiva",
    name: "Massagem Relaxante Pés na Areia",
    category: "massagem",
    description: "Massagem corporal completa com óleos essenciais de lavanda e coco virgem da Bahia. Alívio de tensões da caminhada.",
    durationMin: 60,
    price: 18000,
    depositRequired: 9000,
    therapist: "Luiza Santos (Terapeuta Corporal)",
    location: "Na sua pousada ou no Espaço Beira-Rio",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
    rating: 5.0,
    slotsToday: ["14:00", "15:30", "17:00", "18:30"],
  },
  {
    id: "s2",
    establishmentId: "spa-caraiva",
    name: "Drenagem Linfática + Reflexologia Podal",
    category: "massagem",
    description: "Ideal para desinchar pernas e pés após trilhas e dias de sol intenso. Massagem revigorante focada nos pontos de pressão.",
    durationMin: 50,
    price: 20000,
    depositRequired: 10000,
    therapist: "Luiza Santos",
    location: "Na sua pousada",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    slotsToday: ["10:00", "11:30", "16:00"],
  },
  {
    id: "s3",
    establishmentId: "spa-caraiva",
    name: "Aula Particular de Kitesurf / Wing Foil",
    category: "surf_kite",
    description: "Aula individual de 2 horas na Barra de Caraíva com equipamento completo incluso e rádio comunicador no capacete.",
    durationMin: 120,
    price: 45000,
    depositRequired: 20000,
    therapist: "Instrutor Mateus (IKO Nível 2)",
    location: "Ponta da Barra (encontro rio/mar)",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    rating: 5.0,
    slotsToday: ["13:00", "15:30"],
  },
  {
    id: "s4",
    establishmentId: "spa-caraiva",
    name: "Yoga Matinal ao Nascer do Sol",
    category: "yoga",
    description: "Prática Vinyasa Flow com vista para o mar. Tapetes higienizados e água de coco fresca inclusos.",
    durationMin: 60,
    price: 8000,
    depositRequired: 4000,
    therapist: "Camila Viana (Instrutora Hatha)",
    location: "Deck Praia do Xandó",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    slotsToday: ["06:30", "07:45"],
  },
];

export const retailItems: RetailItem[] = [
  {
    id: "art-1",
    establishmentId: "loja-pataxo",
    name: "Gamela em Madeira Nobre Reaproveitada",
    category: "decoracao",
    description: "Peça única entalhada à mão por artesãos Pataxó da Aldeia Mãe de Barra Velha. Acabamento em cera de abelha natural.",
    price: 22000,
    stock: 4,
    artisan: "Mawai Pataxó",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
    tags: ["madeira", "decoracao", "artesanal", "pataxo"],
  },
  {
    id: "art-2",
    establishmentId: "loja-pataxo",
    name: "Colar Biojoia em Sementes de Açaí e Tento",
    category: "biojoias",
    description: "Colar artesanal com tingimento natural, sementes nativas da Mata Atlântica e fecho em macramê ajustável.",
    price: 8500,
    stock: 12,
    artisan: "Naiara Pataxó",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    tags: ["biojoia", "sementes", "acessorios", "bahia"],
  },
  {
    id: "art-3",
    establishmentId: "loja-pataxo",
    name: "Camisa de Linho Puro 'Caraíva Vibes'",
    category: "vestuario",
    description: "Linho 100% respirável, modelagem ampla para os dias quentes e noites de forró. Botões em madrepérola.",
    price: 28000,
    stock: 7,
    artisan: "Ateliê Caraíva",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    tags: ["linho", "moda praia", "roupa", "unissex"],
  },
  {
    id: "art-4",
    establishmentId: "loja-pataxo",
    name: "Canga Artesanal Pintada à Mão (Igrejinha)",
    category: "lembrancas",
    description: "Canga em viscose leve com pintura exclusiva da tradicional Igrejinha de São Sebastião de Caraíva.",
    price: 9500,
    stock: 15,
    artisan: "Arte Nativa Caraíva",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    tags: ["canga", "igrejinha", "praia", "lembranca"],
  },
];

export const byId = <T extends { id: string }>(list: T[], id: string) => list.find((x) => x.id === id);
export const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
