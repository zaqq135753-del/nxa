// Engine de Inteligência Preditiva de Caraíva em Tempo Real (Marés, Clima, Ventos e Negócios)

export interface TideForecast {
  time: string;
  height: string;
  type: "baixa" | "alta";
  status: string;
}

export interface SpotAiInsight {
  occupancyPercent: number;
  tablesAvailable: number;
  bestArrivalWindow: string;
  secretChefTip: string;
  sandRoadCondition: string;
  vibeScore: number; // 0-100
  aiVerdict: string;
}

export const CARAIVA_REALTIME_CONTEXT = {
  temperature: 29,
  feelsLike: 32,
  weatherCondition: "Ensolarado com brisa fresca",
  wind: "Leste 8 nós (perfeito para velejar e SUP)",
  currentTide: {
    height: "0.4m",
    type: "Maré Baixa",
    time: "13:45",
    description: "Areia firme na praia da Barra. Caminho livre para a Praia do Satu sem molhar os pertences.",
  },
  nextTide: {
    height: "1.8m",
    type: "Maré Alta",
    time: "19:50",
    description: "Água doce do rio na altura máxima. Marulho gostoso nas mesas de madeira do deck.",
  },
  sunset: {
    time: "17:35",
    minutesRemaining: 35,
    bestSpot: "Deck do Boteco do Pará ou Ponta da Barra",
  },
  moon: {
    phase: "Lua Crescente (92%)",
    moonrise: "18:20 no mar da Barra",
    phenomenon: "Luau espontâneo na areia e mar iluminado",
  },
  tideTableToday: [
    { time: "01:20", height: "1.6m", type: "alta", status: "Maré cheia da madrugada" },
    { time: "07:35", height: "0.5m", type: "baixa", status: "Excelente para caminhada matinal" },
    { time: "13:45", height: "0.4m", type: "baixa", status: "Ápice da maré baixa (piscinas naturais)" },
    { time: "19:50", height: "1.8m", type: "alta", status: "Pico de maré alta da noite" },
  ] as TideForecast[],
};

export const SPOT_AI_INSIGHTS: Record<string, SpotAiInsight> = {
  "boteco-do-para": {
    occupancyPercent: 78,
    tablesAvailable: 3,
    bestArrivalWindow: "Chegar até 17h10 para pegar a mesa na beira da água",
    secretChefTip: "Peça o pastel de arraia acompanhado da pimenta de cheiro artesanal macerada no dendê e caipirinha de caju fresco.",
    sandRoadCondition: "Areia batida pela margem do rio, 2 min a pé da canoa",
    vibeScore: 98,
    aiVerdict: "Imperdível agora à tarde. O sol se põe bem em frente às mesas de madeira do deck.",
  },
  "canto-da-duca": {
    occupancyPercent: 62,
    tablesAvailable: 5,
    bestArrivalWindow: "Café da manhã das 08h às 11h ou chá da tarde às 16h",
    secretChefTip: "A torta de banana com canela servida morna e o suco verde com água de coco da restinga.",
    sandRoadCondition: "Areia fofa no Beco da Duca, calçado leve ou descalço",
    vibeScore: 95,
    aiVerdict: "Ambiente de pura paz, arte da Duca nas paredes e conversa acolhedora.",
  },
  "bar-do-porto": {
    occupancyPercent: 82,
    tablesAvailable: 2,
    bestArrivalWindow: "Reserve antes das 19h para garantir a mesa externa com vela no rio",
    secretChefTip: "Pizza fininha de camarão ao alho-poró ou a clássica Caraíva com queijo canastra e manjericão fresco.",
    sandRoadCondition: "Rua do Rio bem compactada, fácil acesso noturno",
    vibeScore: 96,
    aiVerdict: "A noite mais charmosa e intimista de Caraíva para casais e amigos.",
  },
  "boteco-mangaba": {
    occupancyPercent: 70,
    tablesAvailable: 4,
    bestArrivalWindow: "Chegar às 19h30 no início da roda de samba acústica",
    secretChefTip: "Polvo grelhado com batatas ao murro e cachaça de mangaba gelada.",
    sandRoadCondition: "Beco das Flores, areia intermediária",
    vibeScore: 92,
    aiVerdict: "Alegria baiana pura com músicos locais tocando violão e pandeiro.",
  },
  "forro-do-ourico": {
    occupancyPercent: 40, // Abre mais tarde
    tablesAvailable: 15,
    bestArrivalWindow: "Portões abrem às 22h, trio ao vivo sobe às 23h30",
    secretChefTip: "Beba o drink 'Rala-Bucho' de mel e gengibre antes de entrar na pista de areia.",
    sandRoadCondition: "Rua do Forró, areia fofa (leve lanterna do celular)",
    vibeScore: 99,
    aiVerdict: "A experiência noturna mais autêntica do Brasil. Forró até o amanhecer.",
  },
  "forro-do-pele": {
    occupancyPercent: 35,
    tablesAvailable: 18,
    bestArrivalWindow: "Quintas e domingos a partir das 22h",
    secretChefTip: "Cachaça artesanal com limão e conversa com os forrozeiros nativos.",
    sandRoadCondition: "Próximo ao campo de futebol, caminho de areia batida",
    vibeScore: 94,
    aiVerdict: "História viva de Caraíva. Dança gostosa e acolhedora.",
  },
  "barco-ponta-do-corumbau": {
    occupancyPercent: 85,
    tablesAvailable: 3, // vagas
    bestArrivalWindow: "Saídas pontuais às 09h00 da beira do rio",
    secretChefTip: "Reserve um cooler com água de coco e leve protetor biodegradável para não agredir os recifes.",
    sandRoadCondition: "Embarque na areia do rio, sem necessidade de calçado",
    vibeScore: 100,
    aiVerdict: "Melhor maré da semana para Corumbau hoje. Água translúcida estilo Caribe.",
  },
  "trilha-praia-do-satu": {
    occupancyPercent: 50,
    tablesAvailable: 99,
    bestArrivalWindow: "Iniciar caminhada 1h antes do pico da maré baixa (entre 12h30 e 14h)",
    secretChefTip: "Tomar banho na Lagoa do Satu após a caminhada na água salgada. A água doce revigora a pele.",
    sandRoadCondition: "Areia dura na orla na maré baixa. Trajeto plano e paradisíaco.",
    vibeScore: 97,
    aiVerdict: "A caminhada selvagem mais bonita da Bahia. Falésias vivas e praias desertas.",
  },
  "aldeia-porto-do-boi": {
    occupancyPercent: 60,
    tablesAvailable: 8,
    bestArrivalWindow: "Vivência agendada das 14h30 às 17h30",
    secretChefTip: "Permita-se receber a pintura de proteção sagrada com jenipapo e sementes de urucum.",
    sandRoadCondition: "Acesso por canoa pelo rio ou buggy",
    vibeScore: 99,
    aiVerdict: "Reconexão espiritual profunda com os guardiões originários de Caraíva.",
  },
  "praia-da-barra-caraiva": {
    occupancyPercent: 75,
    tablesAvailable: 6,
    bestArrivalWindow: "Maré vazante à tarde para o encontro de águas mais calmo",
    secretChefTip: "Nade primeiro na água doce e morna do rio, e caminhe 20 passos para mergulhar nas ondas do mar.",
    sandRoadCondition: "Ponta de areia pura, pés descalços o tempo todo",
    vibeScore: 98,
    aiVerdict: "O coração geográfico de Caraíva. Energia pura da natureza.",
  },
};
