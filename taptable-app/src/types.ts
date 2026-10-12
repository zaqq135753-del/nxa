export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category: 'bebida' | 'comida' | 'sobremesa'
  orderedBy: string
  avatarColor: string
  status: 'preparando' | 'pronto' | 'entregue'
  orderedAt: string
  stockAlert?: boolean
  lockedBy?: {
    userName: string
    expiresAt: number
  }
  paidBy?: {
    userName: string
    paidAt: string
    method: 'pix' | 'apple_pay' | 'cartao' | 'dinheiro_caixa'
  }
}

export interface KitchenOrder {
  id: string
  tableNumber: number
  items: MenuItem[]
  status: 'pendente' | 'em_preparo' | 'pronto' | 'entregue'
  timeElapsedMinutes: number
  requestedAt: string
}

export interface PaymentTransaction {
  id: string
  tableNumber: number
  clientName: string
  amount: number
  tipAmount: number
  method: 'pix' | 'apple_pay' | 'cartao' | 'dinheiro'
  timestamp: string
  status: 'aprovado' | 'estornado'
  itemsCount: number
  taxInvoiceUrl?: string
}

export interface Table {
  number: number
  name: string
  zone: 'Deck' | 'Salão Principal' | 'Bar Balcão' | 'Lounge' | 'Deck Rooftop' | 'Salão Nobre' | 'Lounge VIP'
  status: 'livre' | 'ocupada' | 'em_fechamento' | 'paga'
  waiterName: string
  openedAt: string
  activeUsersCount: number
  totalOriginal: number
  totalPaid: number
  items: MenuItem[]
  requestedWaiter?: boolean
  closingRequested?: boolean
  occupancyMinutes: number
  riskAlert?: 'ociosa' | 'tempo_alto' | null
}

export interface Waiter {
  id: string
  name: string
  avatar: string
  phone: string
  activeTables: number[]
  rating: number
  totalSalesToday: number
  tipsAccumulated: number
  status: 'ativo' | 'pausa'
}

export interface ProductCatalogItem {
  id: string
  name: string
  category: 'bebida' | 'comida' | 'sobremesa'
  price: number
  stock: number
  minStock: number
  cost: number
  marginPercent: number
  isPopular: boolean
}

export interface TableTransferRequest {
  fromTable: number
  toTable: number
}

export interface SystemNotification {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'order' | 'waiter' | 'payment' | 'ai' | 'rating'
  urgency: 'low' | 'medium' | 'high'
  read: boolean
  targetTable?: number
  actionLabel?: string
}

export interface TableRating {
  id: string
  tableNumber: number
  clientName: string
  foodRating: number
  serviceRating: number
  comment?: string
  timestamp: string
  waiterName: string
  npsCategory: 'promoter' | 'passive' | 'detractor'
  sharedOnGoogle?: boolean
}

export type WaiterCallReason =
  | 'gelo_limao'
  | 'copos_limpos'
  | 'limpar_mesa'
  | 'falar_gerente'
  | 'gerente'
  | 'conta_dinheiro'
  | 'talheres'
  | 'talheres_extras'
  | 'atendimento_geral'

export interface SmartWaiterCall {
  id: string
  tableNumber: number
  reason: WaiterCallReason
  reasonLabel: string
  reasonIcon?: string
  requestedAt?: string
  timestamp: string
  status: 'pendente' | 'em_atendimento' | 'concluido'
  waiterName: string
}

export interface JukeboxTrack {
  id: string
  title: string
  artist: string
  votes: number
  votedByMe?: boolean
}
