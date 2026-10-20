/**
 * Rider OS & Smart Dispatch Service — v2 Spatial Telemetry & Fleet Intelligence
 * Motor de Rotas Inteligentes (Smart Batching), Telemetria GPS 3D, Turn-by-Turn HUD,
 * Segurança Colaborativa ("Waze dos Motoboys"), Rádio PTT com Espectro de Voz e Pix Instantâneo.
 */

export type CityOperationKey = 'cmd_mg' | 'caraiva_ba';

export interface GeoCoord {
  lng: number;
  lat: number;
}

export interface RouteStop {
  id: string;
  type: 'pickup' | 'dropoff';
  sequence: number;
  title: string;
  subtitle: string;
  address: string;
  neighborhood: string;
  coord: GeoCoord;
  completed: boolean;
  readyInMinutes?: number;
  validationCode?: string;
  customerPhone?: string;
  orderNumber?: string;
  maneuverInstruction?: string;
  streetGrade?: string;
  feeBreakdown?: {
    baseFee: number;
    tip: number;
    rainOrHillBonus: number;
  };
}

export interface SmartDeliveryOffer {
  id: string;
  city: CityOperationKey;
  isBatched: boolean;
  title: string;
  totalEarnings: number;
  baseDeliveryFee: number;
  customerTip: number;
  hillOrWeatherBonus: number;
  ifoodComparisonEarned: number; // Quanto ganharia no iFood (para mostrar a vantagem real)
  totalDistanceKm: number;
  estimatedMinutes: number;
  terrainNote: string;
  kitchenSyncNote: string;
  stops: RouteStop[];
  routeGeometry: GeoCoord[];
}

export type MapHazardType =
  | 'pothole'      // Buraco perigoso / brita / óleo
  | 'dog'          // Cachorro bravo solto
  | 'dark_street'  // Rua sem iluminação / atenção
  | 'slippery'     // Ladeira escorregadia / lama / chuva
  | 'support_hub'; // Ponto de apoio (Água, Café, Tomada, Banheiro)

export interface MapHazardPin {
  id: string;
  city: CityOperationKey;
  type: MapHazardType;
  title: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  upvotes: number;
  coord: GeoCoord;
}

export interface FellowRiderPin {
  id: string;
  name: string;
  nickname: string;
  network: 'Rede Central Moto #01' | 'Rede Estrada Real #02' | 'Frota Caraíva VIP';
  status: 'livre' | 'em_rota' | 'sos';
  heading: number;
  speedKmh: number;
  batteryPct: number;
  deliveriesToday: number;
  coord: GeoCoord;
  distanceKm: number;
  bikeModel: string;
}

export interface DemandHotspot {
  id: string;
  city: CityOperationKey;
  name: string;
  PendingOrders: number;
  surgeBonus: string;
  coord: GeoCoord;
  radiusMeters: number;
}

export interface PttVoiceMessage {
  id: string;
  senderName: string;
  senderNetwork: string;
  timestamp: string;
  durationSec: number;
  transcript: string;
  isUrgent?: boolean;
}

export interface WalletTransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'earning' | 'tip' | 'bonus' | 'payout';
  timestamp: string;
}

export interface CityPreset {
  key: CityOperationKey;
  name: string;
  state: string;
  tagline: string;
  center: GeoCoord;
  zoom: number;
  pitch: number;
  bearing: number;
}

export const CITY_PRESETS: Record<CityOperationKey, CityPreset> = {
  cmd_mg: {
    key: 'cmd_mg',
    name: 'Conceição do Mato Dentro',
    state: 'MG',
    tagline: 'Frota Integrada • 2 Redes de Mototáxi & Delivery Inteligente',
    center: { lng: -43.4265, lat: -19.0355 },
    zoom: 14.6,
    pitch: 58,
    bearing: -24,
  },
  caraiva_ba: {
    key: 'caraiva_ba',
    name: 'Caraíva & Região',
    state: 'BA',
    tagline: 'Logística de Apoio, Entregas nas Pousadas & Entreposto',
    center: { lng: -39.1492, lat: -16.8058 },
    zoom: 15.5,
    pitch: 56,
    bearing: 18,
  },
};

export const INITIAL_HOTSPOTS: DemandHotspot[] = [
  {
    id: 'hot-cmd-1',
    city: 'cmd_mg',
    name: 'Polo Gastronômico Av. JK & Matriz',
    PendingOrders: 7,
    surgeBonus: '+R$ 3,50 / entrega',
    coord: { lng: -43.4255, lat: -19.0338 },
    radiusMeters: 320,
  },
  {
    id: 'hot-cmd-2',
    city: 'cmd_mg',
    name: 'Comércio Matozinhos & Farmácias',
    PendingOrders: 4,
    surgeBonus: '+R$ 2,00 / entrega',
    coord: { lng: -43.4315, lat: -19.0298 },
    radiusMeters: 280,
  },
  {
    id: 'hot-car-1',
    city: 'caraiva_ba',
    name: 'Beira-Rio & Botecos',
    PendingOrders: 6,
    surgeBonus: '+R$ 4,00 / entrega',
    coord: { lng: -39.1485, lat: -16.8045 },
    radiusMeters: 220,
  },
];

// Coordenadas bem distribuídas pelos bairros reais de Conceição do Mato Dentro (zero sobreposição)
export const INITIAL_FELLOW_RIDERS: Record<CityOperationKey, FellowRiderPin[]> = {
  cmd_mg: [
    {
      id: 'rider-cmd-1',
      name: 'Wesley Soares',
      nickname: 'Falcão 01',
      network: 'Rede Central Moto #01',
      status: 'em_rota',
      heading: 38,
      speedKmh: 42,
      batteryPct: 88,
      deliveriesToday: 14,
      coord: { lng: -43.4212, lat: -19.0312 },
      distanceKm: 0.6,
      bikeModel: 'Honda CG 160 Titan',
    },
    {
      id: 'rider-cmd-2',
      name: 'Ronaldo Silva',
      nickname: 'Trovão da Serra',
      network: 'Rede Estrada Real #02',
      status: 'livre',
      heading: 195,
      speedKmh: 0,
      batteryPct: 94,
      deliveriesToday: 11,
      coord: { lng: -43.4335, lat: -19.0385 },
      distanceKm: 0.9,
      bikeModel: 'Yamaha Crosser 150',
    },
    {
      id: 'rider-cmd-3',
      name: 'Diego Martins',
      nickname: 'Diego 07',
      network: 'Rede Central Moto #01',
      status: 'livre',
      heading: 310,
      speedKmh: 28,
      batteryPct: 76,
      deliveriesToday: 9,
      coord: { lng: -43.4185, lat: -19.0418 },
      distanceKm: 1.2,
      bikeModel: 'Honda Bros 160 ESDD',
    },
    {
      id: 'rider-cmd-4',
      name: 'Leandro Costa',
      nickname: 'Léo Bala',
      network: 'Rede Estrada Real #02',
      status: 'em_rota',
      heading: 120,
      speedKmh: 46,
      batteryPct: 81,
      deliveriesToday: 16,
      coord: { lng: -43.4318, lat: -19.0282 },
      distanceKm: 1.1,
      bikeModel: 'Yamaha Factor 150',
    },
  ],
  caraiva_ba: [
    {
      id: 'rider-car-1',
      name: 'Neto Pataxó',
      nickname: 'Neto Apoio',
      network: 'Frota Caraíva VIP',
      status: 'em_rota',
      heading: 120,
      speedKmh: 18,
      batteryPct: 92,
      deliveriesToday: 12,
      coord: { lng: -39.1462, lat: -16.8032 },
      distanceKm: 0.4,
      bikeModel: 'Triciclo Elétrico Solar',
    },
    {
      id: 'rider-car-2',
      name: 'Lucas Maré',
      nickname: 'Lucas Express',
      network: 'Frota Caraíva VIP',
      status: 'livre',
      heading: 260,
      speedKmh: 0,
      batteryPct: 85,
      deliveriesToday: 9,
      coord: { lng: -39.1528, lat: -16.8082 },
      distanceKm: 0.6,
      bikeModel: 'Quadriciclo Entreposto',
    },
  ],
};

export const INITIAL_HAZARDS: MapHazardPin[] = [
  {
    id: 'haz-cmd-1',
    city: 'cmd_mg',
    type: 'support_hub',
    title: 'Ponto de Apoio — Brasa da Serra Burger',
    description: 'Água trincando, café expresso, banheiro e tomada turbo 220V grátis para a tropa.',
    reportedBy: 'Parceiro Oficial',
    reportedAt: 'Ativo 24h',
    upvotes: 34,
    coord: { lng: -43.4255, lat: -19.0338 },
  },
  {
    id: 'haz-cmd-2',
    city: 'cmd_mg',
    type: 'pothole',
    title: 'Brita solta na descida do Matozinhos',
    description: 'Cuidado ao deitar a moto na curva perto da ponte, areia e brita no canto direito.',
    reportedBy: 'Wesley (Falcão 01)',
    reportedAt: 'Há 14 min',
    upvotes: 19,
    coord: { lng: -43.4302, lat: -19.0308 },
  },
  {
    id: 'haz-cmd-3',
    city: 'cmd_mg',
    type: 'dog',
    title: 'Cachorro solto na subida do Rosário',
    description: 'Cachorro caramelo grande costuma atravessar a rua. Reduza e buzine.',
    reportedBy: 'Ronaldo (Trovão)',
    reportedAt: 'Há 35 min',
    upvotes: 12,
    coord: { lng: -43.4198, lat: -19.0362 },
  },
  {
    id: 'haz-cmd-4',
    city: 'cmd_mg',
    type: 'dark_street',
    title: 'Iluminação fraca — Final do Santana',
    description: 'Use o disparo automático de 300m para o cliente já esperar no portão aberto.',
    reportedBy: 'Diego 07',
    reportedAt: 'Há 50 min',
    upvotes: 15,
    coord: { lng: -43.4348, lat: -19.0415 },
  },
  {
    id: 'haz-car-1',
    city: 'caraiva_ba',
    type: 'support_hub',
    title: 'Ponto de Apoio — Boteco do Pará',
    description: 'Água mineral gelada, café e sombra na beira do rio para entregadores.',
    reportedBy: 'Parceiro Oficial',
    reportedAt: 'Ativo agora',
    upvotes: 22,
    coord: { lng: -39.1485, lat: -16.8045 },
  },
  {
    id: 'haz-car-2',
    city: 'caraiva_ba',
    type: 'slippery',
    title: 'Areia fofa acumulada na esquina sul',
    description: 'Contorne pela trilha lateral firme.',
    reportedBy: 'Neto Apoio',
    reportedAt: 'Há 20 min',
    upvotes: 11,
    coord: { lng: -39.1515, lat: -16.8072 },
  },
];

export const SMART_DELIVERY_OFFERS: Record<CityOperationKey, SmartDeliveryOffer[]> = {
  cmd_mg: [
    {
      id: 'offer-cmd-batch-01',
      city: 'cmd_mg',
      isBatched: true,
      title: 'Rota Inteligente Dupla (Centro ➔ Rosário ➔ Bandeirantes)',
      totalEarnings: 26.50,
      baseDeliveryFee: 18.00,
      customerTip: 5.00,
      hillOrWeatherBonus: 3.50,
      ifoodComparisonEarned: 13.80,
      totalDistanceKm: 3.4,
      estimatedMinutes: 14,
      terrainNote: 'Via principal pavimentada • Evita ladeira crítica • +R$ 3,50 adicional de serra',
      kitchenSyncNote: 'KDS Sincronizado: Pedidos já lacrados na estufa térmica (0 min de espera!)',
      stops: [
        {
          id: 'st-1',
          type: 'pickup',
          sequence: 1,
          title: 'Brasa da Serra Burger',
          subtitle: 'Coleta 1 • Pedido #CMD-402 (2 sacolas térmicas lacradas)',
          address: 'Av. Juscelino Kubitschek, 410 — Centro',
          neighborhood: 'Centro',
          coord: { lng: -43.4255, lat: -19.0338 },
          completed: false,
          readyInMinutes: 0,
          orderNumber: '#CMD-402',
          maneuverInstruction: 'Siga 180m pela Av. JK até a parada expressa de motos em frente ao Brasa Burger',
          streetGrade: 'Plano (0°)',
        },
        {
          id: 'st-2',
          type: 'pickup',
          sequence: 2,
          title: 'Drogaria Real Minas (No Caminho)',
          subtitle: 'Coleta 2 Expressa • Pedido #FAR-119 (Sacola leve 300g)',
          address: 'Praça Dom João, 88 — Centro Histórico',
          neighborhood: 'Centro Histórico',
          coord: { lng: -43.4232, lat: -19.0352 },
          completed: false,
          readyInMinutes: 0,
          orderNumber: '#FAR-119',
          maneuverInstruction: 'Desça 240m pela Rua Direita até a esquina da Praça Dom João',
          streetGrade: 'Descida leve (-2°)',
        },
        {
          id: 'st-3',
          type: 'dropoff',
          sequence: 3,
          title: 'Cliente 1: Dona Helena (Remédio)',
          subtitle: 'Casa azul colonial • Geofence 300m avisará o portão',
          address: 'Rua das Flores, 215 — Bairro Rosário',
          neighborhood: 'Rosário',
          coord: { lng: -43.4195, lat: -19.0378 },
          completed: false,
          validationCode: '482',
          customerPhone: '5531998811223',
          orderNumber: '#FAR-119',
          maneuverInstruction: 'Vire à esquerda na ponte e suba 450m pela Rua das Flores (Bairro Rosário)',
          streetGrade: 'Subida moderada (+5°)',
          feeBreakdown: { baseFee: 8.50, tip: 2.00, rainOrHillBonus: 1.50 },
        },
        {
          id: 'st-4',
          type: 'dropoff',
          sequence: 4,
          title: 'Cliente 2: Lucas Andrade (Burger)',
          subtitle: 'Sobrado branco c/ garagem • Gorjeta R$ 3,00 já garantida',
          address: 'Av. Mato Dentro, 540 — Bandeirantes',
          neighborhood: 'Bandeirantes',
          coord: { lng: -43.4158, lat: -19.0412 },
          completed: false,
          validationCode: '719',
          customerPhone: '5531997766554',
          orderNumber: '#CMD-402',
          maneuverInstruction: 'Continue 520m pela via principal até a Av. Mato Dentro, nº 540',
          streetGrade: 'Subida de serra (+7° • Bônus Ativo)',
          feeBreakdown: { baseFee: 9.50, tip: 3.00, rainOrHillBonus: 2.00 },
        },
      ],
      routeGeometry: [
        { lng: -43.4282, lat: -19.0322 },
        { lng: -43.4270, lat: -19.0330 },
        { lng: -43.4255, lat: -19.0338 },
        { lng: -43.4244, lat: -19.0345 },
        { lng: -43.4232, lat: -19.0352 },
        { lng: -43.4218, lat: -19.0361 },
        { lng: -43.4206, lat: -19.0370 },
        { lng: -43.4195, lat: -19.0378 },
        { lng: -43.4182, lat: -19.0389 },
        { lng: -43.4170, lat: -19.0401 },
        { lng: -43.4158, lat: -19.0412 },
      ],
    },
    {
      id: 'offer-cmd-single-02',
      city: 'cmd_mg',
      isBatched: false,
      title: 'Rota Expressa: Forno da Serra ➔ Condomínio Santana',
      totalEarnings: 16.00,
      baseDeliveryFee: 12.00,
      customerTip: 4.00,
      hillOrWeatherBonus: 0,
      ifoodComparisonEarned: 8.50,
      totalDistanceKm: 2.1,
      estimatedMinutes: 8,
      terrainNote: '100% Asfalto • Retorno rápido para o ponto da Rede Central',
      kitchenSyncNote: 'Pizza lacrada saindo do forno agora • Sem espera',
      stops: [
        {
          id: 'st-s1',
          type: 'pickup',
          sequence: 1,
          title: 'Forno da Serra Pizzaria',
          subtitle: 'Coleta Expressa • Pedido #PIZ-884',
          address: 'Rua Direita, 120 — Centro Histórico',
          neighborhood: 'Centro',
          coord: { lng: -43.4268, lat: -19.0345 },
          completed: false,
          readyInMinutes: 0,
          orderNumber: '#PIZ-884',
          maneuverInstruction: 'Siga 150m até o recuo de motos da Pizzaria Forno da Serra',
          streetGrade: 'Plano (0°)',
        },
        {
          id: 'st-s2',
          type: 'dropoff',
          sequence: 2,
          title: 'Cliente: Dr. Marcos Oliveira',
          subtitle: 'Condomínio Vila da Serra • Portaria já avisada',
          address: 'Av. Santuário, 890 — Bairro Santana',
          neighborhood: 'Santana',
          coord: { lng: -43.4342, lat: -19.0408 },
          completed: false,
          validationCode: '905',
          customerPhone: '5531996655443',
          orderNumber: '#PIZ-884',
          maneuverInstruction: 'Pegue a Av. Santuário por 1.4km sentido Bairro Santana',
          streetGrade: 'Leve aclive (+3°)',
          feeBreakdown: { baseFee: 12.00, tip: 4.00, rainOrHillBonus: 0 },
        },
      ],
      routeGeometry: [
        { lng: -43.4255, lat: -19.0338 },
        { lng: -43.4268, lat: -19.0345 },
        { lng: -43.4288, lat: -19.0362 },
        { lng: -43.4315, lat: -19.0385 },
        { lng: -43.4342, lat: -19.0408 },
      ],
    },
  ],
  caraiva_ba: [
    {
      id: 'offer-car-batch-01',
      city: 'caraiva_ba',
      isBatched: true,
      title: 'Rota Dupla Beira-Rio ➔ Pousadas da Praia',
      totalEarnings: 28.00,
      baseDeliveryFee: 20.00,
      customerTip: 8.00,
      hillOrWeatherBonus: 0,
      ifoodComparisonEarned: 15.00,
      totalDistanceKm: 1.4,
      estimatedMinutes: 11,
      terrainNote: 'Trilha firme • Entregas rápidas na recepção das pousadas',
      kitchenSyncNote: 'Boteco do Pará pronto para retirada no balcão lateral',
      stops: [
        {
          id: 'st-c1',
          type: 'pickup',
          sequence: 1,
          title: 'Boteco do Pará',
          subtitle: 'Coleta 1 • Pedido #CAR-1082 (Embalagem térmica)',
          address: 'Beira Rio, s/n — Vila de Caraíva',
          neighborhood: 'Beira-Rio',
          coord: { lng: -39.1485, lat: -16.8045 },
          completed: false,
          readyInMinutes: 0,
          orderNumber: '#CAR-1082',
          maneuverInstruction: 'Siga pela margem do rio até o deck do Boteco do Pará',
          streetGrade: 'Plano (Areia batida)',
        },
        {
          id: 'st-c2',
          type: 'dropoff',
          sequence: 2,
          title: 'Hóspede: Mariana Vasconcellos',
          subtitle: 'Pousada Casa da Praia — Suíte Amendoeira',
          address: 'Caminho da Praia, 45 — Caraíva',
          neighborhood: 'Praia Principal',
          coord: { lng: -39.1455, lat: -16.8072 },
          completed: false,
          validationCode: '312',
          customerPhone: '5531998877665',
          orderNumber: '#CAR-1082',
          maneuverInstruction: 'Atravesse pelo Beco da Lua sentido Praia Principal (380m)',
          streetGrade: 'Plano',
          feeBreakdown: { baseFee: 20.00, tip: 8.00, rainOrHillBonus: 0 },
        },
      ],
      routeGeometry: [
        { lng: -39.1502, lat: -16.8035 },
        { lng: -39.1485, lat: -16.8045 },
        { lng: -39.1470, lat: -16.8058 },
        { lng: -39.1455, lat: -16.8072 },
      ],
    },
  ],
};

export const INITIAL_PTT_MESSAGES: PttVoiceMessage[] = [
  {
    id: 'ptt-1',
    senderName: 'Wesley (Falcão 01)',
    senderNetwork: 'Rede Central Moto #01',
    timestamp: 'Agora há pouco',
    durationSec: 6,
    transcript: 'QAP tropa! Av. JK livre e os pedidos da Brasa Burger estão saindo sem fila nenhuma hoje, bora girar!',
  },
  {
    id: 'ptt-2',
    senderName: 'Ronaldo (Trovão da Serra)',
    senderNetwork: 'Rede Estrada Real #02',
    timestamp: 'Há 6 min',
    durationSec: 5,
    transcript: 'Atenção quem descer pro Matozinhos: marquei no mapa uma brita solta perto da curva da ponte.',
  },
  {
    id: 'ptt-3',
    senderName: 'Brasa da Serra Burger (Ponto de Apoio)',
    senderNetwork: 'Parceiro Oficial',
    timestamp: 'Há 14 min',
    durationSec: 4,
    transcript: 'Galera das duas redes: café fresco, água gelada e carregador turbo liberados aqui no balcão!',
  },
];

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    title: 'Rota Inteligente Dupla #CMD-398',
    subtitle: '100% Frete + Adicional de Serra (Zero comissão)',
    amount: 22.00,
    type: 'earning',
    timestamp: 'Hoje, 20:42',
  },
  {
    id: 'tx-2',
    title: 'Gorjeta 100% Direta no Pix',
    subtitle: 'Enviada por Cliente Fernanda M.',
    amount: 6.00,
    type: 'tip',
    timestamp: 'Hoje, 20:43',
  },
  {
    id: 'tx-3',
    title: 'Bônus Meta de Pontualidade (10 Entregas)',
    subtitle: 'Patrocínio Consórcio de Lojistas Locais',
    amount: 20.00,
    type: 'bonus',
    timestamp: 'Hoje, 19:55',
  },
  {
    id: 'tx-4',
    title: 'Entrega Drogaria Real Minas #FAR-104',
    subtitle: '100% do Frete repassado na hora',
    amount: 12.50,
    type: 'earning',
    timestamp: 'Hoje, 19:15',
  },
];

export function calculateDistanceMeters(a: GeoCoord, b: GeoCoord): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(R * c);
}

export function playRiderTacticalSound(
  type: 'offer_siren' | 'ptt_beep' | 'cash_register' | 'sos_alarm' | 'geofence_ping'
): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'ptt_beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1560, now);
      osc.frequency.setValueAtTime(1840, now + 0.055);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'offer_siren') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880.0, now + 0.11);
      osc.frequency.setValueAtTime(1174.66, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc.start(now);
      osc.stop(now + 0.42);
    } else if (type === 'cash_register') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'geofence_ping') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.setValueAtTime(1108, now + 0.1);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'sos_alarm') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.linearRampToValueAtTime(960, now + 0.2);
      osc.frequency.linearRampToValueAtTime(620, now + 0.4);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch {
    // Ignorar se áudio bloqueado antes de interação
  }
}
