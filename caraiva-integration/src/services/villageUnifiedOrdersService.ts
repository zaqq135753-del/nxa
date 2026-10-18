/**
 * Caraíva Digital — Serviço Unificado de Pedidos, Reservas e CRM
 * 
 * Conecta em tempo real a experiência do cliente (B2C) com o cockpit
 * de gestão operacional do comerciante (B2B Multi-Nicho).
 */

export type OrderNiche = 'gastronomia' | 'hospedagem' | 'passeios_barcos' | 'conveniencia' | 'servicos';

export type OrderType = 'delivery' | 'mesa' | 'hospedagem' | 'passeio' | 'servico';

export type UnifiedOrderStatus = 
  | 'novo'             // Recebido pelo sistema
  | 'confirmado'       // Aceito pelo estabelecimento
  | 'preparando'       // Em preparo na cozinha / Separando produtos
  | 'em_rota'          // Saiu para entrega na pousada/praia
  | 'checkin_realizado'// Hóspede entrou na suíte / Embarcou na lancha
  | 'concluido'        // Finalizado com sucesso
  | 'recusado'         // Recusado pelo estabelecimento
  | 'cancelado';       // Cancelado pelo cliente

export interface UnifiedOrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface UnifiedOrder {
  id: string;
  orderNumber: string;
  businessId: string;
  businessName: string;
  niche: OrderNiche;
  orderType: OrderType;
  status: UnifiedOrderStatus;
  createdAt: string;
  updatedAt: string;
  
  // Dados do Cliente
  customer: {
    name: string;
    phone: string;
    whatsappFormatted: string;
    email?: string;
  };
  
  // Itens ou Especificações do Pedido / Reserva
  items: UnifiedOrderItem[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'pix' | 'cartao_online' | 'cartao_entrega' | 'dinheiro';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  
  // Destino / Local de Atendimento
  destination?: {
    type: 'pousada' | 'praia' | 'mesa' | 'retirada' | 'embarcacao';
    label: string;
    detail: string;
  };
  
  // Detalhes Específicos para Hospedagens e Passeios
  bookingDetails?: {
    checkInDate?: string;
    checkOutDate?: string;
    timeSlot?: string;
    guestsCount?: number;
    roomOrSuiteName?: string;
    tourTitle?: string;
    departurePoint?: string;
    tideRecommendation?: string;
  };
  
  notes?: string;
}

const STORAGE_KEY = 'caraiva_unified_orders_v3';
const BROADCAST_CHANNEL = 'caraiva_unified_orders_sync';

// Mock inicial enriquecido para testes imediatos nos 4 nichos
const INITIAL_MOCK_ORDERS: UnifiedOrder[] = [
  {
    id: 'ord-gast-001',
    orderNumber: '#CAR-1082',
    businessId: 'boteco-do-para',
    businessName: 'Boteco do Pará',
    niche: 'gastronomia',
    orderType: 'delivery',
    status: 'preparando',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    customer: {
      name: 'Mariana Vasconcellos',
      phone: '31998877665',
      whatsappFormatted: '5531998877665',
      email: 'mariana.vasc@gmail.com',
    },
    items: [
      { id: 'p1', name: 'Pastel de Arraia Tradicional (2 un)', quantity: 2, unitPrice: 38.0, subtotal: 76.0 },
      { id: 'p2', name: 'Moqueca Mista de Peixe e Camarão', quantity: 1, unitPrice: 165.0, subtotal: 165.0, notes: 'Sem coentro, por favor' },
      { id: 'p3', name: 'Suco de Cacau Fresco com Gelo', quantity: 2, unitPrice: 18.0, subtotal: 36.0 },
    ],
    totalAmount: 287.0,
    paidAmount: 287.0,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    destination: {
      type: 'pousada',
      label: 'Entrega na Pousada',
      detail: 'Pousada Casa da Praia — Suíte Amendoeira (Entregar na recepção)',
    },
  },
  {
    id: 'ord-gast-005',
    orderNumber: '#NFC-0912',
    businessId: 'boteco-do-para',
    businessName: 'Boteco do Pará',
    niche: 'gastronomia',
    orderType: 'mesa',
    status: 'concluido',
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    customer: {
      name: 'Eduardo & Turma SP',
      phone: '11991234567',
      whatsappFormatted: '5511991234567',
    },
    items: [
      { id: 'm1', name: 'Peixe Vermelho Grelhado na Folha de Bananeira', quantity: 1, unitPrice: 210.0, subtotal: 210.0 },
      { id: 'm2', name: 'Caipirinha de Cajá com Pimenta Rosa', quantity: 4, unitPrice: 35.0, subtotal: 140.0 },
      { id: 'm3', name: 'Dadinho de Tapioca com Melado', quantity: 1, unitPrice: 54.0, subtotal: 54.0 },
    ],
    totalAmount: 404.0,
    paidAmount: 404.0,
    paymentMethod: 'cartao_online',
    paymentStatus: 'paid',
    destination: {
      type: 'mesa',
      label: 'Auto-Checkout NFC na Mesa',
      detail: 'Mesa 03 (Beira-Rio) — Dividido por 4 pessoas via TapTable NFC',
    },
  },
  {
    id: 'ord-hosp-002',
    orderNumber: '#RES-4421',
    businessId: 'pousada-casa-da-praia',
    businessName: 'Pousada Casa da Praia',
    niche: 'hospedagem',
    orderType: 'hospedagem',
    status: 'confirmado',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'Rodrigo e Camila Antunes',
      phone: '11987654321',
      whatsappFormatted: '5511987654321',
      email: 'rodrigo.antunes@icloud.com',
    },
    items: [
      { id: 'suite-1', name: 'Suíte Master Frente Mar (3 diárias)', quantity: 3, unitPrice: 850.0, subtotal: 2550.0 },
    ],
    totalAmount: 2550.0,
    paidAmount: 1275.0, // Sinal de 50%
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    bookingDetails: {
      checkInDate: '2026-11-12',
      checkOutDate: '2026-11-15',
      timeSlot: 'Check-in: 14:00',
      guestsCount: 2,
      roomOrSuiteName: 'Bangalô das Águas',
    },
    notes: 'Comemoração de aniversário de casamento. Solicitaram espumante no quarto.',
  },
  {
    id: 'ord-pass-003',
    orderNumber: '#PAS-8819',
    businessId: 'caraiva-brasil-turismo',
    businessName: 'Caraíva Brasil Passeios',
    niche: 'passeios_barcos',
    orderType: 'passeio',
    status: 'confirmado',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    customer: {
      name: 'Lucas Ferreira',
      phone: '21976543210',
      whatsappFormatted: '5521976543210',
      email: 'lucas.ferreira@gmail.com',
    },
    items: [
      { id: 'pass-corumbau', name: 'Expedição Lancha Rápida Ponta do Corumbau', quantity: 2, unitPrice: 220.0, subtotal: 440.0 },
    ],
    totalAmount: 440.0,
    paidAmount: 440.0,
    paymentMethod: 'cartao_online',
    paymentStatus: 'paid',
    bookingDetails: {
      checkInDate: '2026-10-20',
      timeSlot: 'Saída às 09:30 (Pico da Maré Baixa)',
      guestsCount: 2,
      tourTitle: 'Lancha Ponta do Corumbau com Parada nos Corais',
      departurePoint: 'Deck dos Pescadores no Rio Caraíva',
      tideRecommendation: 'Maré 0.2m ideal para piscinas naturais',
    },
  },
  {
    id: 'ord-pass-006',
    orderNumber: '#PAS-8904',
    businessId: 'caraiva-brasil-turismo',
    businessName: 'Caraíva Brasil Passeios',
    niche: 'passeios_barcos',
    orderType: 'passeio',
    status: 'concluido',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    customer: {
      name: 'Marcelo Siqueira',
      phone: '31987776655',
      whatsappFormatted: '5531987776655',
    },
    items: [
      { id: 'pass-buggy', name: 'Expedição Buggy Reserva Pataxó + Praia do Satu', quantity: 3, unitPrice: 220.0, subtotal: 660.0 },
    ],
    totalAmount: 660.0,
    paidAmount: 660.0,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    bookingDetails: {
      checkInDate: '2026-10-18',
      timeSlot: 'Saída às 10:00',
      guestsCount: 3,
      tourTitle: 'Roteiro Buggy Praias Desertas & Aldeia',
      departurePoint: 'Receptivo da Travessia das Canoas',
    },
  },
  {
    id: 'ord-mesa-004',
    orderNumber: '#MES-0701',
    businessId: 'boteco-do-para',
    businessName: 'Boteco do Pará',
    niche: 'gastronomia',
    orderType: 'mesa',
    status: 'confirmado',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    customer: {
      name: 'Felipe Sampaio',
      phone: '31988887777',
      whatsappFormatted: '5531988887777',
    },
    items: [
      { id: 'reserva-sunset', name: 'Bloqueio de Mesa Beira-Rio no Pôr do Sol', quantity: 4, unitPrice: 30.0, subtotal: 120.0, notes: 'Crédito revertido em consumação' },
    ],
    totalAmount: 120.0,
    paidAmount: 120.0,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    destination: {
      type: 'mesa',
      label: 'Mesa no Salão/Rio',
      detail: 'Mesa 08 (Beira do Rio Caraíva)',
    },
    bookingDetails: {
      timeSlot: '16:45 — Pôr do Sol Dourado',
      guestsCount: 4,
    },
  },
  {
    id: 'ord-loja-007',
    orderNumber: '#LOJ-3310',
    businessId: 'atelie-arte-da-terra',
    businessName: 'Ateliê Arte da Terra',
    niche: 'conveniencia',
    orderType: 'delivery',
    status: 'preparando',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    customer: {
      name: 'Helena Alencar',
      phone: '11977665544',
      whatsappFormatted: '5511977665544',
    },
    items: [
      { id: 'p-01', name: 'Canga Algodão Cru Artesanal Caraíva', quantity: 2, unitPrice: 95.0, subtotal: 190.0 },
      { id: 'p-03', name: 'Cerâmica Rústica Queimada no Forno', quantity: 1, unitPrice: 140.0, subtotal: 140.0 },
    ],
    totalAmount: 330.0,
    paidAmount: 330.0,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    destination: {
      type: 'pousada',
      label: 'Scan & Go NFC — Entrega na Pousada',
      detail: 'Comprado via Tag NFC na loja • Entregar na Pousada Vila do Mar (Quarto 04)',
    },
  },
  {
    id: 'ord-loja-008',
    orderNumber: '#LOJ-3315',
    businessId: 'atelie-arte-da-terra',
    businessName: 'Ateliê Arte da Terra',
    niche: 'conveniencia',
    orderType: 'servico',
    status: 'concluido',
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    customer: {
      name: 'Gabriel Monteiro',
      phone: '21988112233',
      whatsappFormatted: '5521988112233',
    },
    items: [
      { id: 'p-02', name: 'Colar de Sementes Nativas Pataxó', quantity: 2, unitPrice: 65.0, subtotal: 130.0 },
      { id: 'p-04', name: 'Chapéu de Palha Trançado à Mão', quantity: 1, unitPrice: 110.0, subtotal: 110.0 },
    ],
    totalAmount: 240.0,
    paidAmount: 240.0,
    paymentMethod: 'cartao_online',
    paymentStatus: 'paid',
    destination: {
      type: 'retirada',
      label: 'Retirado via Tap NFC no Balcão',
      detail: 'Ateliê Arte da Terra — Beco da Lua',
    },
  },
];

// Carrega pedidos salvos ou inicia com os mocks
export function getUnifiedOrders(): UnifiedOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
      return INITIAL_MOCK_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_ORDERS;
  } catch {
    return INITIAL_MOCK_ORDERS;
  }
}

// Salva pedidos e notifica canais
function saveAndBroadcast(orders: UnifiedOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('caraiva:orders-updated', { detail: orders }));
      try {
        const bc = new BroadcastChannel(BROADCAST_CHANNEL);
        bc.postMessage({ type: 'SYNC_ORDERS', orders });
        bc.close();
      } catch {
        // Fallback para navegadores sem BroadcastChannel
      }
    }
  } catch (err) {
    console.error('Erro ao salvar pedidos unificados:', err);
  }
}

// Cria um novo pedido ou reserva a partir do cliente
export function createUnifiedOrder(orderData: Omit<UnifiedOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>): UnifiedOrder {
  const current = getUnifiedOrders();
  const prefix = orderData.orderType === 'delivery' ? 'CAR' : orderData.orderType === 'hospedagem' ? 'RES' : orderData.orderType === 'passeio' ? 'PAS' : 'MES';
  const orderNumber = `#${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newOrder: UnifiedOrder = {
    ...orderData,
    id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    orderNumber,
    status: 'novo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newOrder, ...current];
  saveAndBroadcast(updated);
  return newOrder;
}

// Atualiza status do pedido (chamado pelo Business Cockpit)
export function updateOrderStatus(orderId: string, newStatus: UnifiedOrderStatus): UnifiedOrder | null {
  const current = getUnifiedOrders();
  const index = current.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const updatedOrder = {
    ...current[index],
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedOrder;
  saveAndBroadcast(current);
  return updatedOrder;
}

// Busca pedidos específicos de um cliente
export function getCustomerOrders(phoneOrName?: string): UnifiedOrder[] {
  const orders = getUnifiedOrders();
  if (!phoneOrName) return orders;
  const cleanFilter = phoneOrName.toLowerCase().trim();
  return orders.filter(o => 
    o.customer.phone.includes(cleanFilter) || 
    o.customer.name.toLowerCase().includes(cleanFilter)
  );
}

// Busca pedidos de um comércio específico
export function getBusinessOrders(businessId: string): UnifiedOrder[] {
  const orders = getUnifiedOrders();
  return orders.filter(o => o.businessId === businessId);
}

// Helper para formatar moeda
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Helper de etiqueta e cor por status
export function getStatusBadge(status: UnifiedOrderStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case 'novo':
      return { label: 'Novo Pedido', bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-400' };
    case 'confirmado':
      return { label: 'Confirmado', bg: 'bg-sky-500/20 border-sky-500/40', text: 'text-sky-400' };
    case 'preparando':
      return { label: 'Na Cozinha / Preparando', bg: 'bg-orange-500/20 border-orange-500/40', text: 'text-orange-400' };
    case 'em_rota':
      return { label: 'Saiu p/ Entrega', bg: 'bg-purple-500/20 border-purple-500/40', text: 'text-purple-400' };
    case 'checkin_realizado':
      return { label: 'Em Estadia / Embarcado', bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-400' };
    case 'concluido':
      return { label: 'Concluído', bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-400' };
    case 'recusado':
      return { label: 'Recusado', bg: 'bg-rose-500/20 border-rose-500/40', text: 'text-rose-400' };
    case 'cancelado':
      return { label: 'Cancelado', bg: 'bg-slate-500/20 border-slate-500/40', text: 'text-slate-400' };
  }
}
