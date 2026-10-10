export interface MenuItemDetail {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'entradas' | 'principais' | 'bebidas' | 'sobremesas' | 'especiais';
  image?: string;
  badge?: 'Mais Pedido' | 'Chef Recomenda' | 'Vegetariano' | 'Pé na Areia';
}

export interface BusinessScheduleInfo {
  isOpenNow: boolean;
  todayHours: string;
  weekSchedule: { day: string; hours: string; isOpen: boolean }[];
  acceptsReservations: boolean;
  reservationMinHoursInAdvance?: number;
  instantConfirmationWhatsapp?: boolean;
}

export interface BusinessProfileDetail {
  menuItems: MenuItemDetail[];
  schedule: BusinessScheduleInfo;
  averagePrice: string;
  highlights: string[];
}

export const BUSINESS_EXTENDED_PROFILES: Record<string, BusinessProfileDetail> = {
  // 1. Boteco do Pará (Clássico de Caraíva à beira do Rio)
  'boteco-do-para': {
    averagePrice: 'R$ 45 - R$ 110',
    highlights: ['Pôr do Sol Mágico', 'Pastel de Arraia Famoso', 'Cerveja Gelada na Areia', 'Música ao Vivo'],
    schedule: {
      isOpenNow: true,
      todayHours: '11:00 às 22:30',
      acceptsReservations: true,
      instantConfirmationWhatsapp: true,
      weekSchedule: [
        { day: 'Segunda-feira', hours: '11:00 - 22:00', isOpen: true },
        { day: 'Terça-feira', hours: '11:00 - 22:00', isOpen: true },
        { day: 'Quarta-feira', hours: '11:00 - 22:00', isOpen: true },
        { day: 'Quinta-feira', hours: '11:00 - 22:30', isOpen: true },
        { day: 'Sexta-feira', hours: '11:00 - 23:00', isOpen: true },
        { day: 'Sábado', hours: '11:00 - 23:30', isOpen: true },
        { day: 'Domingo', hours: '11:00 - 22:00', isOpen: true },
      ],
    },
    menuItems: [
      {
        id: 'bp-1',
        name: 'Pastel de Arraia Tradicional',
        description: 'O sabor mais emblemático de Caraíva. Massa crocante recheada com carne de arraia desfiada e tempero baiano.',
        price: 'R$ 28,00',
        category: 'entradas',
        badge: 'Mais Pedido',
        image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'bp-2',
        name: 'Moqueca de Peixe com Camarão',
        description: 'Servida na panela de barro com leite de coco fresco, dendê na medida, arroz branco e farofa de dendê crocante.',
        price: 'R$ 148,00',
        category: 'principais',
        badge: 'Chef Recomenda',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'bp-3',
        name: 'Drink Rio Caraíva Sunset',
        description: 'Gin artesanal, maracujá da terra, xarope de gengibre e espuma de tangerina.',
        price: 'R$ 38,00',
        category: 'bebidas',
        badge: 'Pé na Areia',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'bp-4',
        name: 'Cocada Quente com Sorvete de Tapioca',
        description: 'Feita na hora com coco fresco ralado e canela, acompanhada de sorvete de tapioca.',
        price: 'R$ 32,00',
        category: 'sobremesas',
        badge: 'Chef Recomenda',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },

  // 2. Canto da Duca (Café da Manhã & Arte Vegana)
  'canto-da-duca': {
    averagePrice: 'R$ 35 - R$ 75',
    highlights: ['Café da Manhã Orgânico', 'Doces Veganos Famosos', 'Espaço Artístico & Histórico', 'Sombra & Zen'],
    schedule: {
      isOpenNow: true,
      todayHours: '08:30 às 13:30',
      acceptsReservations: false,
      instantConfirmationWhatsapp: true,
      weekSchedule: [
        { day: 'Segunda a Domingo', hours: '08:30 - 13:30', isOpen: true },
      ],
    },
    menuItems: [
      {
        id: 'cd-1',
        name: 'Café Completo da Duca',
        description: 'Pães artesanais na chapa, frutas locais da estação, geleias caseiras e café passado na hora.',
        price: 'R$ 48,00',
        category: 'entradas',
        badge: 'Mais Pedido',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'cd-2',
        name: 'Bolo de Cacau Puro com Especiarias',
        description: 'Sem glúten e sem lactose, feito com cacau do sul da Bahia e calda morna.',
        price: 'R$ 22,00',
        category: 'sobremesas',
        badge: 'Chef Recomenda',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'cd-3',
        name: 'Suco Verde Caraivano Energético',
        description: 'Couve da horta, limão galego, gengibre fresco e água de coco natural.',
        price: 'R$ 18,00',
        category: 'bebidas',
        badge: 'Vegetariano',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },

  // 3. Mangue Sereno (Pousada & Gastronomia Romântica)
  'mangue-sereno': {
    averagePrice: 'R$ 90 - R$ 190',
    highlights: ['Jantar à Luz de Velas', 'Carta de Vinhos Selecionada', 'Deck Privativo', 'Ambiente Romântico'],
    schedule: {
      isOpenNow: true,
      todayHours: '19:00 às 23:30',
      acceptsReservations: true,
      instantConfirmationWhatsapp: true,
      weekSchedule: [
        { day: 'Quarta a Domingo', hours: '19:00 - 23:30', isOpen: true },
        { day: 'Segunda e Terça', hours: 'Fechado', isOpen: false },
      ],
    },
    menuItems: [
      {
        id: 'ms-1',
        name: 'Polvo Grelhado na Brasa com Purê de Mandioquinha',
        description: 'Tentáculos macios glaceados com redução de balsâmico e ervas frescas.',
        price: 'R$ 115,00',
        category: 'principais',
        badge: 'Chef Recomenda',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'ms-2',
        name: 'Carpaccio de Peixe Branco Fresco com Maracujá',
        description: 'Lâminas ultrafinas de robalo fresco da vila com molho cítrico e flor de sal.',
        price: 'R$ 56,00',
        category: 'entradas',
        badge: 'Mais Pedido',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
};

/**
 * Retorna dados detalhados ou um perfil rico padrão para qualquer estabelecimento
 */
export function getBusinessProfileDetail(businessId: string, businessName: string): BusinessProfileDetail {
  if (BUSINESS_EXTENDED_PROFILES[businessId]) {
    return BUSINESS_EXTENDED_PROFILES[businessId];
  }

  // Perfil padrão contextual e amigável
  return {
    averagePrice: 'R$ 40 - R$ 90',
    highlights: ['Atendimento Local Acolhedor', 'Aceita Pix e Cartão', 'Ambiente Aberto', 'Pé na Areia'],
    schedule: {
      isOpenNow: true,
      todayHours: '10:00 às 22:00',
      acceptsReservations: true,
      instantConfirmationWhatsapp: true,
      weekSchedule: [
        { day: 'Segunda a Domingo', hours: '10:00 - 22:00', isOpen: true },
      ],
    },
    menuItems: [
      {
        id: 'def-1',
        name: `Prato Especial ${businessName}`,
        description: 'Receita tradicional da casa preparada com ingredientes frescos da Bahia.',
        price: 'R$ 68,00',
        category: 'principais',
        badge: 'Chef Recomenda',
      },
      {
        id: 'def-2',
        name: 'Petisco da Vila',
        description: 'Porção generosa para compartilhar com cerveja artesanal ou caipirinha.',
        price: 'R$ 42,00',
        category: 'entradas',
        badge: 'Mais Pedido',
      },
      {
        id: 'def-3',
        name: 'Caipirinha de Frutas Tropicais',
        description: 'Cachaça artesanal da região com maracujá, limão e hortelã.',
        price: 'R$ 26,00',
        category: 'bebidas',
        badge: 'Pé na Areia',
      },
    ],
  };
}
