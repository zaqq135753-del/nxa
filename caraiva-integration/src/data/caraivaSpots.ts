export interface DishOrService {
  name: string;
  price: string;
  photo: string;
  description?: string;
}

export interface CommunityCheckin {
  user: string;
  avatar: string;
  action: string;
  pts: number;
  timeAgo: string;
  photo?: string;
}

export interface CaraivaSpot {
  id: string;
  name: string;
  category: "gastronomia" | "noite" | "passeios" | "praias";
  subCategory: string;
  rating: number;
  reviewsCount: number;
  image: string;
  tags: string[];
  distanceSteps: number;
  distanceTime: string;
  description: string;
  rewardBadge: string;
  featuredDishes: DishOrService[];
  whatsappNumber: string;
  communityCheckins: CommunityCheckin[];
  isAvailableToday?: string;
  locationReference: string;
  priceLevel: "$" | "$$" | "$$$" | "$$$$";
  instagramHandle?: string;
  audioAmbience?: string;
}

export const REAL_CARAIVA_SPOTS: CaraivaSpot[] = [
  {
    id: "boteco-do-para",
    name: "Boteco do Pará",
    category: "gastronomia",
    subCategory: "Petiscos & Pôr do Sol",
    rating: 4.9,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
    tags: ["Beira-Rio", "Pastel de Arraia", "Pôr do Sol Mágico", "Cerveja Gelada"],
    distanceSteps: 120,
    distanceTime: "2 min a pé da foz",
    description: "O cartão-postal mais gastronômico de Caraíva. Mesas de madeira pé-na-areia sob a sombra de amendoeiras à margem do rio. Parada obrigatória pós-praia para contemplar o sol se pondo na água com o lendário pastel crocante de arraia.",
    rewardBadge: "Ganhe 1 Caipirinha de Caju ou 10% OFF no pastel",
    locationReference: "Margem do Rio Caraíva, próximo à chegada das canoas",
    priceLevel: "$$",
    instagramHandle: "@botecodoparaoficial",
    audioAmbience: "Água doce do rio e brisa nas amendoeiras",
    featuredDishes: [
      { name: "Pastel de Arraia Tradicional (Crocante)", price: "R$ 44", photo: "🥟", description: "Massa sequinha, recheio farto temperado com ervas locais e pimenta de cheiro" },
      { name: "Caipirinha de Caju da Terra com Limão", price: "R$ 34", photo: "🍹", description: "Cachaça artesanal baiana com pedaços suculentos de caju fresco" },
      { name: "Isca de Peixe Vermelho com Molho Tártaro", price: "R$ 68", photo: "🐟", description: "Pescado fresco do dia empanado na farinha de tapioca" },
      { name: "Pastel de Queijo Canastra com Cebola Roxa", price: "R$ 40", photo: "🧀", description: "Opção vegetariana cremosa derretendo na hora" },
    ],
    whatsappNumber: "5573998123456",
    communityCheckins: [
      { user: "@camila_sp", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", action: "marcou no pôr do sol", pts: 25, timeAgo: "há 10 min", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80" },
      { user: "@felipe.roots", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", action: "pediu o 3º pastel de arraia", pts: 20, timeAgo: "há 25 min" },
      { user: "@alana_viaja", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", action: "resgatou caipirinha de cortesia", pts: 35, timeAgo: "há 45 min" },
    ],
    isAvailableToday: "Mesas Livres no Deck • Horário Nobre do Pôr do Sol (17h00 - 19h00)",
  },
  {
    id: "canto-da-duca",
    name: "Canto da Duca",
    category: "gastronomia",
    subCategory: "Ateliê & Culinária Afetiva",
    rating: 5.0,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    tags: ["Vegetariano", "Café Colonial", "Arte Nativa", "Tortas Famosas"],
    distanceSteps: 260,
    distanceTime: "4 min a pé",
    description: "Um oásis de arte e sabor comandado por Duca, artista pioneira de Caraíva. Café da manhã inesquecível com pães artesanais, tortas doces sagradas (banana com canela, cacau puro), sucos de frutas da restinga e paredes decoradas com arte indígena.",
    rewardBadge: "1 Fatia da Torta Especial de Cacau na compra de um café",
    locationReference: "Beco da Duca, centro da vila na areia",
    priceLevel: "$$",
    instagramHandle: "@cantodaduca",
    audioAmbience: "Pássaros de restinga e bossa nova suave",
    featuredDishes: [
      { name: "Torta de Banana dos Deuses com Canela", price: "R$ 28", photo: "🥧", description: "Receita histórica da Duca servida morna com calda de especiarias" },
      { name: "Torta Raw de Cacau Puro com Castanha", price: "R$ 32", photo: "🍫", description: "Sem glúten e sem lactose, feita com cacau colhido no sul da Bahia" },
      { name: "Suco Verde Revitalizante da Restinga", price: "R$ 22", photo: "🥤", description: "Couve, gengibre, limão e água de coco natural gelada" },
      { name: "Sanduíche de Pão da Casa com Homus e Cogumelos", price: "R$ 48", photo: "🥪", description: "Pão de fermentação natural assado na manhã de hoje" },
    ],
    whatsappNumber: "5573998234567",
    communityCheckins: [
      { user: "@mariana_arte", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", action: "tomou café com a Duca", pts: 30, timeAgo: "há 1h" },
      { user: "@tiago.yoga", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", action: "comprou pintura autoral", pts: 40, timeAgo: "há 2h" },
    ],
    isAvailableToday: "Aberto para café da manhã e lanche da tarde até às 18h",
  },
  {
    id: "bar-do-porto",
    name: "Bar do Porto",
    category: "gastronomia",
    subCategory: "Pizzas na Lenha & Velas no Rio",
    rating: 4.8,
    reviewsCount: 245,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
    tags: ["Jantar Romântico", "Forno a Lenha", "Deck do Rio", "Vinho & Drinks"],
    distanceSteps: 180,
    distanceTime: "3 min a pé",
    description: "O clima mais charmoso e intimista de Caraíva. Mesas à luz de velas sobre o deck do rio, pizzas artesanais de massa fina assadas no forno a lenha, massas frescas e carta de vinhos selecionada.",
    rewardBadge: "1 Taça de Vinho ou 1 Drink Autoral na reserva da mesa",
    locationReference: "Rua do Rio, próximo ao porto",
    priceLevel: "$$$",
    instagramHandle: "@bardoportocaraiva",
    audioAmbience: "Jazz acústico e marulho suave das canoas",
    featuredDishes: [
      { name: "Pizza Artesanal 'Caraíva Clássica'", price: "R$ 88", photo: "🍕", description: "Mussarela de búfala, queijo canastra, tomate confit e manjericão fresco" },
      { name: "Pizza de Camarão com Catupiry Real", price: "R$ 104", photo: "🦐", description: "Camarões salteados no azeite de ervas e alho-poró" },
      { name: "Crepe Francês de Doce de Leite com Nozes", price: "R$ 38", photo: "🥞", description: "Massa ultrafina com sorvete artesanal de tapioca" },
      { name: "Drink 'Brisa do Rio'", price: "R$ 42", photo: "🍸", description: "Gin artesanal, infusão de capim-santo, limão cravo e água tônica" },
    ],
    whatsappNumber: "5573998345678",
    communityCheckins: [
      { user: "@clarice.vinhos", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", action: "jantar à luz de velas", pts: 30, timeAgo: "ontem à noite" },
    ],
    isAvailableToday: "Reservas Abertas para hoje à noite • 2 Mesas no Deck do Rio",
  },
  {
    id: "boteco-mangaba",
    name: "Boteco Mangaba",
    category: "gastronomia",
    subCategory: "Samba na Areia & Frutos do Mar",
    rating: 4.8,
    reviewsCount: 167,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
    tags: ["Polvo na Brasa", "Roda de Samba", "Cachaças da Bahia", "Descontraído"],
    distanceSteps: 220,
    distanceTime: "3 min a pé",
    description: "Onde o sabor da Bahia encontra a alegria do samba de raiz. Polvo grelhado no ponto perfeito, moquecas perfumadas e um ambiente festivo com os melhores músicos da região passando com violão e pandeiro.",
    rewardBadge: "1 Cachaça de Mangaba Artesanal de boas-vindas",
    locationReference: "Beco das Flores, centro",
    priceLevel: "$$",
    instagramHandle: "@botecomangabacaraiva",
    audioAmbience: "Cavaquinho ao vivo e risadas pé-na-areia",
    featuredDishes: [
      { name: "Polvo Grelhado com Batatas ao Murro", price: "R$ 115", photo: "🐙", description: "Tentáculos crocantes por fora e macios por dentro regados com azeite de páprica" },
      { name: "Moqueca Baiana de Peixe com Camarão", price: "R$ 138", photo: "🥘", description: "Azeite de dendê da terra, leite de coco fresco e farofa de dendê crocante" },
      { name: "Bolinho de Arroz com Queijo Coalho (6 unid)", price: "R$ 42", photo: "🧆", description: "Acompanha geléia de pimenta dedo-de-moça caseira" },
      { name: "Caipivodka de Frutas Vermelhas com Mangaba", price: "R$ 38", photo: "🍹", description: "Frutas frescas maceradas com açúcar orgânico" },
    ],
    whatsappNumber: "5573998456789",
    communityCheckins: [
      { user: "@pedro_bh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", action: "roda de samba confirmada", pts: 25, timeAgo: "há 3h" },
    ],
    isAvailableToday: "Roda de Samba hoje a partir das 19h30!",
  },
  {
    id: "forro-do-ourico",
    name: "Forró do Ouriço",
    category: "noite",
    subCategory: "O Forró Pé-de-Serra Mais Famoso",
    rating: 5.0,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
    tags: ["Forró Até o Amanhecer", "Areia Fofa", "Trio Sanfonado", "Quartas e Sábados"],
    distanceSteps: 420,
    distanceTime: "6 min a pé",
    description: "A essência da noite caraivana. O galpão rústico pé-na-areia onde nativos e viajantes do mundo inteiro dançam abraçados xote, xaxado e baião sob luzes âmbar até o sol nascer no horizonte.",
    rewardBadge: "Fila VIP ou 1 Cerveja Artesanal na compra do ingresso no App",
    locationReference: "Rua do Forró, saída para o campo",
    priceLevel: "$$",
    instagramHandle: "@forrodoourico",
    audioAmbience: "Sanfona de oito baixos, triângulo e zabumba",
    featuredDishes: [
      { name: "Entrada Unissex na Areia", price: "R$ 60", photo: "🎟️", description: "Acesso total à pista com banda ao vivo até 05h da manhã" },
      { name: "Cerveja Long Neck Gelada", price: "R$ 18", photo: "🍺", description: "Estoque mantido em caixas de gelo colonial" },
      { name: "Drink 'Rala-Bucho' de Cachaça com Mel", price: "R$ 28", photo: "🥃", description: "Combustível natural dos forrozeiros tradicionais" },
    ],
    whatsappNumber: "5573998567890",
    communityCheckins: [
      { user: "@lucas_forro", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", action: "dançou até as 5h30 da manhã", pts: 40, timeAgo: "ontem" },
      { user: "@bia.danca", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", action: "garantiu pulseira no Guia", pts: 25, timeAgo: "ontem" },
    ],
    isAvailableToday: "Hoje tem Forró! Trio Nordestino no palco às 23h30",
  },
  {
    id: "forro-do-pele",
    name: "Forró do Pelé",
    category: "noite",
    subCategory: "Raiz Histórica de Caraíva",
    rating: 4.9,
    reviewsCount: 380,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
    tags: ["Histórico", "Sanfona Raiz", "Alterna com o Ouriço", "Clima Familiar"],
    distanceSteps: 390,
    distanceTime: "5 min a pé",
    description: "Onde tudo começou. O Mestre Pelé fundou a tradição do forró em Caraíva há décadas. Pista de areia aconchegante, clima amigável e música que emociona quem valoriza a verdadeira cultura nordestina.",
    rewardBadge: "R$ 10 de desconto no ingresso antecipado",
    locationReference: "Beco do Pelé, próximo ao campo de futebol",
    priceLevel: "$$",
    instagramHandle: "@forrodopele_oficial",
    audioAmbience: "Acordeom tradicional ao vivo",
    featuredDishes: [
      { name: "Ingresso Oficial do Pelé", price: "R$ 50", photo: "🎟️", description: "Pulseira com direito a reentrada na noite" },
      { name: "Cachaça com Gengibre e Limão", price: "R$ 22", photo: "🧉", description: "Feita artesanalmente pelos nativos da vila" },
    ],
    whatsappNumber: "5573998678901",
    communityCheckins: [
      { user: "@gustavo_mg", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", action: "aprendeu a dançar xote", pts: 30, timeAgo: "ontem" },
    ],
    isAvailableToday: "Programação aberta para a noite de quinta-feira",
  },
  {
    id: "barco-ponta-do-corumbau",
    name: "Lancha & Barco Ponta do Corumbau",
    category: "passeios",
    subCategory: "Passeio Náutico VIP",
    rating: 5.0,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    tags: ["Águas de Caribe", "Recife de Corais", "Ponta de Areia", "Dia Inteiro"],
    distanceSteps: 90,
    distanceTime: "1 min até o ponto de embarque",
    description: "O passeio mais imperdível da Costa do Descobrimento. Saída de lancha ou barco tradicional pelo Rio Caraíva contornando falésias virgens até o banco de areia infinito da Ponta do Corumbau na maré baixa. Parada para snorkeling com tartarugas e peixes coloridos.",
    rewardBadge: "10% OFF por pessoa no barco + Máscara de mergulho inclusa",
    locationReference: "Ponto dos Barqueiros, beira do Rio Caraíva",
    priceLevel: "$$$$",
    instagramHandle: "@corumbau_caraiva_tours",
    audioAmbience: "Som cristalino de ondas quebrando nos corais",
    featuredDishes: [
      { name: "Passeio Regular em Lancha Rápida", price: "R$ 360 / pessoa", photo: "🚤", description: "Saída 09h00 com retorno às 16h00. Cooler com gelo a bordo" },
      { name: "Aluguel de Lancha Privativa (até 7 pessoas)", price: "R$ 2.200", photo: "⚓", description: "Roteiro exclusivo com paradas na Praia do Satu e Barra do Caí" },
      { name: "Snorkel & Máscara de Mergulho Profissional", price: "Incluso", photo: "🤿", description: "Equipamento higienizado fornecido pela tripulação" },
      { name: "Almoço de Frutos do Mar no Corumbau", price: "Opcional (no local)", photo: "🦞", description: "Lagostas frescas e peixes assados na brasa dos pescadores" },
    ],
    whatsappNumber: "5573998789012",
    communityCheckins: [
      { user: "@renata.mar", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", action: "mergulhou com tartarugas", pts: 45, timeAgo: "hoje às 11h", photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80" },
      { user: "@marcos_viajante", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", action: "garantiu vaga de amanhã", pts: 30, timeAgo: "há 2h" },
    ],
    isAvailableToday: "Saída Confirmada Amanhã 09h00 • 3 Vagas Disponíveis",
  },
  {
    id: "trilha-praia-do-satu",
    name: "Praia do Satu & Lagoas de Água Doce",
    category: "passeios",
    subCategory: "Caminhada Selvagem na Areia",
    rating: 4.9,
    reviewsCount: 290,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    tags: ["Deserta", "Falésias", "Lagoa do Satu", "Água Cristalina"],
    distanceSteps: 4500,
    distanceTime: "45 min de caminhada na maré baixa",
    description: "Caminhada inesquecível partindo da Barra de Caraíva em direção ao norte. Praias intocadas de águas mornas protegidas por arrecifes e duas lagoas naturais de água doce perfeitas para um banho refrescante pós-caminhada.",
    rewardBadge: "Guia Local Especializado com 15% OFF pelo App",
    locationReference: "Norte de Caraíva, acessível pela orla na maré baixa",
    priceLevel: "$",
    instagramHandle: "@satu_caraiva_nativo",
    audioAmbience: "Arrebentação do mar aberto e vento fresco",
    featuredDishes: [
      { name: "Caminhada Guiada com História Geológica", price: "R$ 90 / pessoa", photo: "🥾", description: "Explicação sobre as falésias vivas e paradas nas lagoas secretas" },
      { name: "Coco Verde Gelado na Barraca do Satu", price: "R$ 15", photo: "🥥", description: "Colhido na hora no coqueiral nativo" },
      { name: "Pastel Frito na Areia com Queijo Coalho", price: "R$ 35", photo: "🥟", description: "Feito na hora pelo nativo Seu Satu" },
    ],
    whatsappNumber: "5573998890123",
    communityCheckins: [
      { user: "@juliana.trilhas", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", action: "tomou banho na Lagoa do Satu", pts: 35, timeAgo: "hoje às 14h" },
    ],
    isAvailableToday: "Melhor Horário Hoje: Iniciar caminhada às 13h (Maré Baixa)",
  },
  {
    id: "aldeia-porto-do-boi",
    name: "Vivência Cultural Aldeia Pataxó Porto do Boi",
    category: "passeios",
    subCategory: "Reserva Indígena Pataxó",
    rating: 5.0,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=85",
    tags: ["Ancestralidade", "Ritual Awê", "Pintura Corporal", "Banho de Ervas"],
    distanceSteps: 2800,
    distanceTime: "Buggy ou barco pelo rio",
    description: "Uma experiência de reconexão e respeito à ancestralidade indígena Pataxó. Participe do ritual de cantos e danças sagradas Awê, pintura corporal com urucum e jenipapo, degustação do peixe na folha de patioba e banho purificador com folhas da mata.",
    rewardBadge: "Pintura Corporal e Amuleto Indígena Inclusos",
    locationReference: "Reserva Pataxó Aldeia Porto do Boi, Caraíva",
    priceLevel: "$$$",
    instagramHandle: "@aldeiaportodoboi",
    audioAmbience: "Maracás indígenas e cantos na língua patxôhã",
    featuredDishes: [
      { name: "Vivência Completa com Ritual e Almoço Típico", price: "R$ 210 / pessoa", photo: "🏹", description: "Inclui Awê, banho de ervas e peixe tradicional na patioba" },
      { name: "Artesanato Autoral em Sementes e Madeira", price: "a partir de R$ 30", photo: "📿", description: "Colares, pulseiras e filtros confeccionados pelas famílias" },
    ],
    whatsappNumber: "5573998901234",
    communityCheckins: [
      { user: "@gabriel.roots", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", action: "recebeu a pintura de proteção Awê", pts: 50, timeAgo: "ontem" },
    ],
    isAvailableToday: "Vivência confirmada para amanhã às 14h30 (Vagas limitadas)",
  },
  {
    id: "praia-da-barra-caraiva",
    name: "Praia da Barra (Encontro do Rio com o Mar)",
    category: "praias",
    subCategory: "Ponto Icônico de Caraíva",
    rating: 5.0,
    reviewsCount: 650,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    tags: ["Banho de Rio", "Banho de Mar", "Ponta de Areia", "Quiosques"],
    distanceSteps: 350,
    distanceTime: "4 min a pé",
    description: "O espetáculo natural onde as águas escuras e limpas do Rio Caraíva encontram o azul do Oceano Atlântico. Você pode nadar na água doce mansa de um lado e saltar nas ondas mornas do mar a poucos passos de distância.",
    rewardBadge: "Aluguel de Stand-Up Paddle com 20% OFF",
    locationReference: "Ponta da Barra, final da orla",
    priceLevel: "$",
    instagramHandle: "@barradecaraiva",
    audioAmbience: "Encontro ritmado das correntezas do rio e do mar",
    featuredDishes: [
      { name: "Aluguel de SUP / Caiaque por 1 hora", price: "R$ 70", photo: "🏄", description: "Ideal para remar na maré enchente com calma" },
      { name: "Água de Coco Gelada na Areia", price: "R$ 12", photo: "🥥", description: "Servida nas esteiras dos quiosques rústicos" },
      { name: "Porção de Queijo Coalho Assado com Melaço", price: "R$ 38", photo: "🧀", description: "Petisco clássico da beira da praia" },
    ],
    whatsappNumber: "5573998012345",
    communityCheckins: [
      { user: "@carol_sol", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", action: "passou o dia inteiro na Barra", pts: 30, timeAgo: "hoje às 16h" },
    ],
    isAvailableToday: "Maré perfeita para banho de rio e mar agora à tarde!",
  },
];
