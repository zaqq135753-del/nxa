import { useState } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'motion/react'
import {
  Zap,
  Lock,
  CheckCircle2,
  Bell,
  Sparkles,
  CreditCard,
  Gift,
  ShieldAlert,
  RefreshCw,
  Clock,
  User,
  Wine,
  TrendingUp,
  Check,
  Search,
  DollarSign,
  FileText,
  RotateCcw,
  Layers,
  LayoutDashboard,
  Users,
  QrCode,
  Download,
  Wallet,
  Plus,
  ArrowUpRight,
  Flame,
  Package,
  ArrowRightLeft,
  CheckCheck,
  Bot,
  BrainCircuit,
  Send,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Command,
  Building2,
  Activity,
  Trophy,
  Award,
  ShieldCheck,
  Timer,
  AlertTriangle,
  Sun,
  Moon,
  Star,
  Share2,
  MessageSquare,
  ThumbsUp,
  Music,
  Minus,
  SlidersHorizontal,
} from 'lucide-react'
import type { MenuItem, Table, PaymentTransaction, Waiter, ProductCatalogItem, KitchenOrder, SystemNotification, TableRating, SmartWaiterCall, JukeboxTrack, WaiterCallReason } from './types'
import ShinyText from './components/react-bits/ShinyText'
import SpotlightCard from './components/react-bits/SpotlightCard'
import DecryptedText from './components/react-bits/DecryptedText'

// Catálogo com Harmonizações Sugeridas pela IA
const INITIAL_CATALOG: (ProductCatalogItem & { pairingSuggestion?: string })[] = [
  { id: 'c1', name: 'Chopp Artesanal Session IPA 500ml', category: 'bebida', price: 19.0, stock: 84, minStock: 20, cost: 6.5, marginPercent: 65, isPopular: true, pairingSuggestion: 'Harmoniza com: Batata Rústica e Picanha Grelhada' },
  { id: 'c2', name: 'Picanha Premium Grelhada com Farofa', category: 'comida', price: 118.0, stock: 14, minStock: 5, cost: 42.0, marginPercent: 64, isPopular: true, pairingSuggestion: 'Harmoniza com: Chopp IPA ou Vinho Malbec' },
  { id: 'c3', name: 'Gin Tônica Tanqueray Sevilla', category: 'bebida', price: 39.0, stock: 32, minStock: 10, cost: 11.0, marginPercent: 71, isPopular: false, pairingSuggestion: 'Harmoniza com: Iscas de Peixe ou Mix de Castanhas' },
  { id: 'c4', name: 'Batata Rústica Trufada com Alecrim', category: 'comida', price: 44.0, stock: 45, minStock: 15, cost: 9.0, marginPercent: 79, isPopular: true, pairingSuggestion: 'Harmoniza com: Chopp Artesanal ou Moscow Mule' },
  { id: 'c5', name: 'Moscow Mule com Espuma de Gengibre', category: 'bebida', price: 36.0, stock: 28, minStock: 10, cost: 9.5, marginPercent: 73, isPopular: false, pairingSuggestion: 'Harmoniza com: Hambúrgueres ou Batata Trufada' },
  { id: 'c6', name: 'Burger Artesanal Angus 180g', category: 'comida', price: 48.0, stock: 22, minStock: 8, cost: 14.0, marginPercent: 70, isPopular: true, pairingSuggestion: 'Harmoniza com: Cerveja IPA ou Refrigerante Artesanal' },
  { id: 'c7', name: 'Negroni Clássico Importado', category: 'bebida', price: 35.0, stock: 18, minStock: 8, cost: 10.0, marginPercent: 71, isPopular: false, pairingSuggestion: 'Harmoniza com: Mix de Castanhas Picantes' },
]

// Mesas do Salão (14 Mesas Distribuídas por Zonas)
const INITIAL_TABLES: Table[] = [
  {
    number: 14,
    name: 'Deck Rooftop 14 (VIP)',
    zone: 'Deck Rooftop',
    status: 'em_fechamento',
    waiterName: 'Carlos Mendonça',
    openedAt: '21:15',
    activeUsersCount: 4,
    totalOriginal: 275.0,
    totalPaid: 44.0,
    occupancyMinutes: 68,
    riskAlert: null,
    items: [
      {
        id: 'i1',
        name: '2x Chopp Artesanal Session IPA 500ml',
        description: 'Lupulado, servido a -1°C',
        price: 38.0,
        category: 'bebida',
        orderedBy: 'Você (Lucas)',
        avatarColor: 'bg-emerald-400',
        status: 'entregue',
        orderedAt: '21:18',
      },
      {
        id: 'i2',
        name: '1x Picanha Premium Grelhada com Farofa',
        description: '600g com queijo coalho tostado',
        price: 118.0,
        category: 'comida',
        orderedBy: 'Mesa (Compartilhado)',
        avatarColor: 'bg-purple-400',
        status: 'entregue',
        orderedAt: '21:28',
      },
      {
        id: 'i3',
        name: '1x Gin Tônica Tanqueray Sevilla',
        description: 'Com zests de laranja e zimbro',
        price: 39.0,
        category: 'bebida',
        orderedBy: 'Mariana Costa',
        avatarColor: 'bg-amber-400',
        status: 'entregue',
        orderedAt: '21:45',
        lockedBy: {
          userName: 'Mariana Costa',
          expiresAt: Date.now() + 50000,
        },
      },
      {
        id: 'i4',
        name: '1x Batata Rústica Trufada com Alecrim',
        description: 'Azeite trufado e parmesão',
        price: 44.0,
        category: 'comida',
        orderedBy: 'Pedro Rossi',
        avatarColor: 'bg-cyan-400',
        status: 'entregue',
        orderedAt: '21:30',
        paidBy: {
          userName: 'Pedro Rossi',
          paidAt: '22:41',
          method: 'pix',
        },
      },
      {
        id: 'i5',
        name: '1x Moscow Mule com Espuma de Gengibre',
        description: 'Vodka importada e espuma densa',
        price: 36.0,
        category: 'bebida',
        orderedBy: 'Camila Dias',
        avatarColor: 'bg-pink-400',
        status: 'entregue',
        orderedAt: '21:50',
      },
    ],
  },
  {
    number: 1,
    name: 'Deck Rooftop 01',
    zone: 'Deck Rooftop',
    status: 'ocupada',
    waiterName: 'Carlos Mendonça',
    openedAt: '22:05',
    activeUsersCount: 3,
    totalOriginal: 165.0,
    totalPaid: 0,
    occupancyMinutes: 28,
    riskAlert: null,
    items: [
      { id: 'i1_1', name: '3x Chopp Session IPA', price: 57.0, category: 'bebida', orderedBy: 'Renato', avatarColor: 'bg-emerald-400', status: 'entregue', orderedAt: '22:10' },
      { id: 'i1_2', name: '1x Picanha Premium Grelhada', price: 118.0, category: 'comida', orderedBy: 'Renato', avatarColor: 'bg-emerald-400', status: 'preparando', orderedAt: '22:15' },
    ],
  },
  {
    number: 2,
    name: 'Deck Rooftop 02',
    zone: 'Deck Rooftop',
    status: 'ocupada',
    waiterName: 'Amanda Lins',
    openedAt: '21:50',
    activeUsersCount: 2,
    totalOriginal: 119.0,
    totalPaid: 0,
    occupancyMinutes: 35,
    riskAlert: null,
    items: [
      { id: 'i2_1', name: '2x Gin Tônica Tanqueray', price: 78.0, category: 'bebida', orderedBy: 'Paula', avatarColor: 'bg-pink-400', status: 'entregue', orderedAt: '21:55' },
      { id: 'i2_2', name: '1x Batata Rústica Trufada', price: 44.0, category: 'comida', orderedBy: 'Paula', avatarColor: 'bg-pink-400', status: 'entregue', orderedAt: '22:00' },
    ],
  },
  {
    number: 3,
    name: 'Deck Rooftop 03',
    zone: 'Deck Rooftop',
    status: 'ocupada',
    waiterName: 'Carlos Mendonça',
    openedAt: '21:30',
    activeUsersCount: 5,
    totalOriginal: 340.0,
    totalPaid: 120.0,
    occupancyMinutes: 52,
    riskAlert: null,
    items: [
      {
        id: 'i3_1',
        name: '1x Balde 6 Cervejas Stella Artois',
        price: 90.0,
        category: 'bebida',
        orderedBy: 'Galera',
        avatarColor: 'bg-yellow-400',
        status: 'entregue',
        orderedAt: '21:32',
      },
      {
        id: 'i3_2',
        name: '1x Tábua de Frios Nobres Especial',
        price: 130.0,
        category: 'comida',
        orderedBy: 'Galera',
        avatarColor: 'bg-purple-400',
        status: 'entregue',
        orderedAt: '21:40',
      },
      {
        id: 'i3_3',
        name: '1x Fondue de Chocolate Belga',
        price: 120.0,
        category: 'sobremesa',
        orderedBy: 'Galera',
        avatarColor: 'bg-pink-400',
        status: 'pronto',
        orderedAt: '22:10',
      },
    ],
  },
  {
    number: 4,
    name: 'Salão Nobre 04',
    zone: 'Salão Nobre',
    status: 'ocupada',
    waiterName: 'Amanda Lins',
    openedAt: '21:20',
    activeUsersCount: 4,
    totalOriginal: 288.0,
    totalPaid: 0,
    occupancyMinutes: 62,
    riskAlert: null,
    items: [
      { id: 'i4_1', name: '2x Burger Angus 180g', price: 96.0, category: 'comida', orderedBy: 'Gustavo', avatarColor: 'bg-cyan-400', status: 'entregue', orderedAt: '21:25' },
      { id: 'i4_2', name: '2x Chopp Artesanal Session IPA', price: 38.0, category: 'bebida', orderedBy: 'Gustavo', avatarColor: 'bg-cyan-400', status: 'entregue', orderedAt: '21:28' },
    ],
  },
  {
    number: 5,
    name: 'Salão Nobre 05',
    zone: 'Salão Nobre',
    status: 'livre',
    waiterName: 'Amanda Lins',
    openedAt: '--:--',
    activeUsersCount: 0,
    totalOriginal: 0,
    totalPaid: 0,
    occupancyMinutes: 0,
    riskAlert: null,
    items: [],
  },
  {
    number: 6,
    name: 'Salão Nobre 06',
    zone: 'Salão Nobre',
    status: 'ocupada',
    waiterName: 'Carlos Mendonça',
    openedAt: '20:45',
    activeUsersCount: 6,
    totalOriginal: 520.0,
    totalPaid: 150.0,
    occupancyMinutes: 98,
    riskAlert: 'tempo_alto',
    items: [
      { id: 'i6_1', name: '2x Picanha Premium Grelhada', price: 236.0, category: 'comida', orderedBy: 'Banca Diretoria', avatarColor: 'bg-amber-400', status: 'entregue', orderedAt: '20:55' },
      { id: 'i6_2', name: '4x Negroni Clássico', price: 140.0, category: 'bebida', orderedBy: 'Banca Diretoria', avatarColor: 'bg-amber-400', status: 'entregue', orderedAt: '21:10' },
    ],
  },
  {
    number: 7,
    name: 'Salão Nobre 07',
    zone: 'Salão Nobre',
    status: 'ocupada',
    waiterName: 'Amanda Lins',
    openedAt: '20:50',
    activeUsersCount: 2,
    totalOriginal: 175.0,
    totalPaid: 0,
    occupancyMinutes: 88,
    riskAlert: 'tempo_alto',
    items: [
      { id: 'i7_1', name: '2x Moscow Mule', price: 72.0, category: 'bebida', orderedBy: 'Camila', avatarColor: 'bg-blue-400', status: 'entregue', orderedAt: '20:55' },
      { id: 'i7_2', name: '1x Picanha Grelhada', price: 118.0, category: 'comida', orderedBy: 'Camila', avatarColor: 'bg-blue-400', status: 'entregue', orderedAt: '21:15' },
    ],
  },
  {
    number: 8,
    name: 'Bar Balcão 08',
    zone: 'Bar Balcão',
    status: 'paga',
    waiterName: 'Bruno Reis',
    openedAt: '21:00',
    activeUsersCount: 1,
    totalOriginal: 145.0,
    totalPaid: 145.0,
    occupancyMinutes: 45,
    riskAlert: null,
    items: [
      {
        id: 'i8_1',
        name: '3x Negroni Clássico',
        price: 105.0,
        category: 'bebida',
        orderedBy: 'Felipe',
        avatarColor: 'bg-orange-400',
        status: 'entregue',
        orderedAt: '21:05',
        paidBy: { userName: 'Felipe', paidAt: '22:38', method: 'apple_pay' },
      },
      {
        id: 'i8_2',
        name: '1x Mix de Castanhas Picantes',
        price: 40.0,
        category: 'comida',
        orderedBy: 'Felipe',
        avatarColor: 'bg-orange-400',
        status: 'entregue',
        orderedAt: '21:10',
        paidBy: { userName: 'Felipe', paidAt: '22:38', method: 'apple_pay' },
      },
    ],
  },
  {
    number: 9,
    name: 'Bar Balcão 09',
    zone: 'Bar Balcão',
    status: 'ocupada',
    waiterName: 'Bruno Reis',
    openedAt: '22:15',
    activeUsersCount: 2,
    totalOriginal: 94.0,
    totalPaid: 0,
    occupancyMinutes: 20,
    riskAlert: null,
    items: [
      { id: 'i9_1', name: '2x Chopp Artesanal Session IPA', price: 38.0, category: 'bebida', orderedBy: 'Leandro', avatarColor: 'bg-emerald-400', status: 'entregue', orderedAt: '22:18' },
      { id: 'i9_2', name: '1x Batata Rústica Trufada', price: 44.0, category: 'comida', orderedBy: 'Leandro', avatarColor: 'bg-emerald-400', status: 'preparando', orderedAt: '22:20' },
    ],
  },
  {
    number: 10,
    name: 'Bar Balcão 10',
    zone: 'Bar Balcão',
    status: 'ocupada',
    waiterName: 'Bruno Reis',
    openedAt: '21:40',
    activeUsersCount: 1,
    totalOriginal: 74.0,
    totalPaid: 0,
    occupancyMinutes: 48,
    riskAlert: null,
    items: [
      { id: 'i10_1', name: '2x Gin Tônica Tanqueray', price: 78.0, category: 'bebida', orderedBy: 'Clarice', avatarColor: 'bg-purple-400', status: 'entregue', orderedAt: '21:45' },
    ],
  },
  {
    number: 11,
    name: 'Lounge VIP 11',
    zone: 'Lounge VIP',
    status: 'ocupada',
    waiterName: 'Bruno Reis',
    openedAt: '22:10',
    activeUsersCount: 4,
    totalOriginal: 240.0,
    totalPaid: 0,
    occupancyMinutes: 22,
    riskAlert: null,
    items: [
      { id: 'i11_1', name: '2x Moscow Mule Especial', price: 72.0, category: 'bebida', orderedBy: 'Camarote', avatarColor: 'bg-pink-400', status: 'entregue', orderedAt: '22:12' },
      { id: 'i11_2', name: '1x Tábua de Frios Nobres Especial', price: 130.0, category: 'comida', orderedBy: 'Camarote', avatarColor: 'bg-pink-400', status: 'preparando', orderedAt: '22:18' },
    ],
  },
  {
    number: 12,
    name: 'Salão Nobre 12',
    zone: 'Salão Nobre',
    status: 'ocupada',
    waiterName: 'Amanda Lins',
    openedAt: '20:30',
    activeUsersCount: 2,
    totalOriginal: 198.0,
    totalPaid: 0,
    occupancyMinutes: 115,
    riskAlert: 'tempo_alto',
    items: [
      {
        id: 'i12_1',
        name: '2x Burger Artesanal Angus',
        price: 96.0,
        category: 'comida',
        orderedBy: 'Mesa',
        avatarColor: 'bg-blue-400',
        status: 'entregue',
        orderedAt: '20:35',
      },
      {
        id: 'i12_2',
        name: '1x Vinho Malbec Reserva',
        price: 102.0,
        category: 'bebida',
        orderedBy: 'Mesa',
        avatarColor: 'bg-red-400',
        status: 'entregue',
        orderedAt: '20:40',
      },
    ],
  },
  {
    number: 13,
    name: 'Lounge VIP 13',
    zone: 'Lounge VIP',
    status: 'ocupada',
    waiterName: 'Carlos Mendonça',
    openedAt: '21:10',
    activeUsersCount: 4,
    totalOriginal: 310.0,
    totalPaid: 0,
    occupancyMinutes: 72,
    riskAlert: null,
    items: [
      { id: 'i13_1', name: '2x Gin Tônica Sevilla', price: 78.0, category: 'bebida', orderedBy: 'Thiago', avatarColor: 'bg-cyan-400', status: 'entregue', orderedAt: '21:15' },
      { id: 'i13_2', name: '1x Picanha Grelhada', price: 118.0, category: 'comida', orderedBy: 'Thiago', avatarColor: 'bg-cyan-400', status: 'entregue', orderedAt: '21:30' },
      { id: 'i13_3', name: '1x Fondue de Chocolate', price: 120.0, category: 'sobremesa', orderedBy: 'Thiago', avatarColor: 'bg-cyan-400', status: 'entregue', orderedAt: '22:00' },
    ],
  },
]

// Pedidos ativos no KDS (Cozinha Quente, Bar de Coquetéis e Copa de Chopp)
const INITIAL_KITCHEN_ORDERS: KitchenOrder[] = [
  {
    id: 'KDS-108',
    tableNumber: 14,
    status: 'em_preparo',
    timeElapsedMinutes: 12,
    requestedAt: '22:32',
    items: [
      {
        id: 'k_1',
        name: '1x Moscow Mule com Espuma de Gengibre',
        price: 36.0,
        category: 'bebida',
        orderedBy: 'Camila Dias',
        avatarColor: 'bg-pink-400',
        status: 'preparando',
        orderedAt: '22:32',
      },
    ],
  },
  {
    id: 'KDS-107',
    tableNumber: 3,
    status: 'pronto',
    timeElapsedMinutes: 19,
    requestedAt: '22:25',
    items: [
      {
        id: 'k_2',
        name: '1x Fondue de Chocolate Belga',
        price: 120.0,
        category: 'sobremesa',
        orderedBy: 'Galera',
        avatarColor: 'bg-pink-400',
        status: 'pronto',
        orderedAt: '22:25',
      },
    ],
  },
  {
    id: 'KDS-106',
    tableNumber: 6,
    status: 'em_preparo',
    timeElapsedMinutes: 18,
    requestedAt: '22:26',
    items: [
      {
        id: 'k_3',
        name: '2x Picanha Premium Grelhada com Farofa',
        price: 236.0,
        category: 'comida',
        orderedBy: 'Banca Diretoria',
        avatarColor: 'bg-amber-400',
        status: 'preparando',
        orderedAt: '22:26',
      },
    ],
  },
  {
    id: 'KDS-105',
    tableNumber: 1,
    status: 'em_preparo',
    timeElapsedMinutes: 6,
    requestedAt: '22:38',
    items: [
      {
        id: 'k_4',
        name: '3x Chopp Artesanal Session IPA 500ml',
        price: 57.0,
        category: 'bebida',
        orderedBy: 'Renato',
        avatarColor: 'bg-emerald-400',
        status: 'preparando',
        orderedAt: '22:38',
      },
    ],
  },
  {
    id: 'KDS-104',
    tableNumber: 11,
    status: 'em_preparo',
    timeElapsedMinutes: 8,
    requestedAt: '22:36',
    items: [
      {
        id: 'k_5',
        name: '2x Gin Tônica Tanqueray Sevilla',
        price: 78.0,
        category: 'bebida',
        orderedBy: 'Camarote',
        avatarColor: 'bg-pink-400',
        status: 'preparando',
        orderedAt: '22:36',
      },
      {
        id: 'k_6',
        name: '1x Negroni Clássico Importado',
        price: 35.0,
        category: 'bebida',
        orderedBy: 'Camarote',
        avatarColor: 'bg-pink-400',
        status: 'preparando',
        orderedAt: '22:36',
      },
    ],
  },
  {
    id: 'KDS-103',
    tableNumber: 12,
    status: 'pendente',
    timeElapsedMinutes: 16,
    requestedAt: '22:28',
    items: [
      {
        id: 'k_7',
        name: '2x Burger Artesanal Angus 180g',
        price: 96.0,
        category: 'comida',
        orderedBy: 'Mesa',
        avatarColor: 'bg-blue-400',
        status: 'preparando',
        orderedAt: '22:28',
      },
      {
        id: 'k_8',
        name: '1x Batata Rústica Trufada com Alecrim',
        price: 44.0,
        category: 'comida',
        orderedBy: 'Mesa',
        avatarColor: 'bg-blue-400',
        status: 'preparando',
        orderedAt: '22:28',
      },
    ],
  },
  {
    id: 'KDS-102',
    tableNumber: 9,
    status: 'pronto',
    timeElapsedMinutes: 4,
    requestedAt: '22:40',
    items: [
      {
        id: 'k_9',
        name: '2x Chopp Artesanal Session IPA 500ml',
        price: 38.0,
        category: 'bebida',
        orderedBy: 'Leandro',
        avatarColor: 'bg-emerald-400',
        status: 'pronto',
        orderedAt: '22:40',
      },
    ],
  },
]

// Transações
const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TX-9941',
    tableNumber: 14,
    clientName: 'Pedro Rossi',
    amount: 44.0,
    tipAmount: 4.4,
    method: 'pix',
    timestamp: '22:41:08',
    status: 'aprovado',
    itemsCount: 1,
    taxInvoiceUrl: 'https://nfe.fazenda.gov.br/doc/9941',
  },
  {
    id: 'TX-9938',
    tableNumber: 8,
    clientName: 'Felipe Santos',
    amount: 145.0,
    tipAmount: 14.5,
    method: 'apple_pay',
    timestamp: '22:38:12',
    status: 'aprovado',
    itemsCount: 2,
    taxInvoiceUrl: 'https://nfe.fazenda.gov.br/doc/9938',
  },
  {
    id: 'TX-9920',
    tableNumber: 3,
    clientName: 'Rodrigo Faro',
    amount: 120.0,
    tipAmount: 12.0,
    method: 'cartao',
    timestamp: '22:15:30',
    status: 'aprovado',
    itemsCount: 1,
  },
  {
    id: 'TX-9912',
    tableNumber: 14,
    clientName: 'Mariana Costa',
    amount: 39.0,
    tipAmount: 3.9,
    method: 'pix',
    timestamp: '22:10:04',
    status: 'aprovado',
    itemsCount: 1,
  },
]

// Garçons
const INITIAL_WAITERS: Waiter[] = [
  {
    id: 'w1',
    name: 'Carlos Mendonça',
    avatar: 'CM',
    phone: '(11) 98765-4321',
    activeTables: [14, 3],
    rating: 4.9,
    totalSalesToday: 615.0,
    tipsAccumulated: 61.5,
    status: 'ativo',
  },
  {
    id: 'w2',
    name: 'Amanda Lins',
    avatar: 'AL',
    phone: '(11) 97654-3210',
    activeTables: [12, 5],
    rating: 4.8,
    totalSalesToday: 198.0,
    tipsAccumulated: 19.8,
    status: 'ativo',
  },
  {
    id: 'w3',
    name: 'Bruno Reis',
    avatar: 'BR',
    phone: '(11) 96543-2109',
    activeTables: [8],
    rating: 5.0,
    totalSalesToday: 145.0,
    tipsAccumulated: 14.5,
    status: 'ativo',
  },
]

// Notificações Iniciais Inteligentes do Sistema
const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: '🔥 KDS: Pedido Crítico (>18 min)',
    message: 'Mesa 06 está aguardando 1x Picanha Grelhada há mais de 18 min na Cozinha Quente.',
    timestamp: '22:44:12',
    type: 'order',
    urgency: 'high',
    read: false,
    targetTable: 6,
    actionLabel: 'Ver no KDS',
  },
  {
    id: 'notif-2',
    title: '🔔 Chamado de Garçom no Salão',
    message: 'Mesa 14 tocou a tag NFC solicitando atendimento do garçom Carlos Mendonça.',
    timestamp: '22:42:05',
    type: 'waiter',
    urgency: 'medium',
    read: false,
    targetTable: 14,
    actionLabel: 'Atender Mesa',
  },
  {
    id: 'notif-3',
    title: '⚡ Pix Recebido Instantaneamente',
    message: 'Recebimento de R$ 145,00 via Pix na Mesa 08 aprovado em 1.2s pelo Banco Central.',
    timestamp: '22:38:12',
    type: 'payment',
    urgency: 'low',
    read: true,
    targetTable: 8,
    actionLabel: 'Ver Comprovante',
  },
  {
    id: 'notif-4',
    title: '🧠 Copilot IA: Oportunidade de Venda',
    message: 'Mesa 03 finalizou petiscos há 14 min. Sugerido acionar rodada de sobremesas ou cafés.',
    timestamp: '22:35:00',
    type: 'ai',
    urgency: 'medium',
    read: false,
    targetTable: 3,
    actionLabel: 'Consultar Mesa',
  },
]

const INITIAL_RATINGS: TableRating[] = [
  {
    id: 'rate-1',
    tableNumber: 8,
    clientName: 'Felipe Santos',
    foodRating: 5,
    serviceRating: 5,
    comment: 'Picanha sensacional e o chopp trincando! Pagar no Pix direto na mesa sem esperar maquininha foi a melhor experiência.',
    timestamp: '22:39',
    waiterName: 'Bruno Reis',
    npsCategory: 'promoter',
    sharedOnGoogle: true,
  },
  {
    id: 'rate-2',
    tableNumber: 3,
    clientName: 'Rodrigo Faro',
    foodRating: 5,
    serviceRating: 4,
    comment: 'Ambiente top demais, rápido atendimento.',
    timestamp: '22:16',
    waiterName: 'Carlos Mendonça',
    npsCategory: 'promoter',
    sharedOnGoogle: true,
  },
]

export function App() {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES)
  const [catalog, setCatalog] = useState<(ProductCatalogItem & { pairingSuggestion?: string })[]>(INITIAL_CATALOG)
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(INITIAL_KITCHEN_ORDERS)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS)
  const [waiters, setWaiters] = useState<Waiter[]>(INITIAL_WAITERS)
  const [currentPerspective, setCurrentPerspective] = useState<'client' | 'admin'>('admin')

  // Tema Claro e Escuro (Apple Studio Clean vs OLED Obsidian)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Central de Notificações
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS)
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false)
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'urgent' | 'payment' | 'ai'>('all')

  // Módulo de Avaliações & NPS (Google Review Booster)
  const [ratings, setRatings] = useState<TableRating[]>(INITIAL_RATINGS)
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false)
  const [clientFoodRating, setClientFoodRating] = useState<number>(5)
  const [clientServiceRating, setClientServiceRating] = useState<number>(5)
  const [clientRatingComment, setClientRatingComment] = useState<string>('')
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false)

  // Sub-abas do Painel do Admin
  const [adminTab, setAdminTab] = useState<'dashboard' | 'mesas' | 'copilot_ia' | 'kds' | 'estoque' | 'financeiro' | 'garcons' | 'tags_nfc' | 'avaliacoes'>('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false)
  const [commandFilter, setCommandFilter] = useState<string>('')
  const [activeBranch, setActiveBranch] = useState<string>('Unidade Rooftop Jardins')

  // Módulo de Chamado Inteligente de Garçom (Smart Service Call - Seul)
  const [smartWaiterCalls, setSmartWaiterCalls] = useState<SmartWaiterCall[]>([
    {
      id: 'call-1',
      tableNumber: 14,
      reason: 'gelo_limao',
      reasonLabel: 'Trazer Balde de Gelo & Limão',
      timestamp: '22:42',
      status: 'pendente',
      waiterName: 'Carlos Mendonça',
    },
    {
      id: 'call-2',
      tableNumber: 3,
      reason: 'copos_limpos',
      reasonLabel: '4x Copos Limpos / Taças',
      timestamp: '22:36',
      status: 'pendente',
      waiterName: 'Carlos Mendonça',
    },
  ])
  const [showSmartCallModal, setShowSmartCallModal] = useState<boolean>(false)

  // Jukebox Interativa da Mesa (London Bar Tech)
  const [jukeboxTracks, setJukeboxTracks] = useState<JukeboxTrack[]>([
    { id: 'trk-1', title: 'Midnight City', artist: 'M83', votes: 14 },
    { id: 'trk-2', title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell', votes: 11 },
    { id: 'trk-3', title: 'Save Your Tears', artist: 'The Weeknd', votes: 9 },
    { id: 'trk-4', title: 'Don\'t Start Now', artist: 'Dua Lipa', votes: 7 },
  ])

  // Gestão de Estoque Avançado
  const [stockCategoryFilter, setStockCategoryFilter] = useState<'todos' | 'bebida' | 'comida' | 'sobremesa'>('todos')
  const [newProductName, setNewProductName] = useState<string>('')
  const [newProductCategory, setNewProductCategory] = useState<'bebida' | 'comida' | 'sobremesa'>('bebida')
  const [newProductPrice, setNewProductPrice] = useState<string>('')
  const [newProductCost, setNewProductCost] = useState<string>('')
  const [newProductStock, setNewProductStock] = useState<string>('')
  const [newProductMinStock, setNewProductMinStock] = useState<string>('10')
  const [newProductPairing, setNewProductPairing] = useState<string>('')

  // Modal do Pedido com Customização Granular (Izakaya Tokyo Tech)
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<ProductCatalogItem | null>(null)
  const [orderIceOption, setOrderIceOption] = useState<'normal' | 'pouco' | 'sem_gelo'>('normal')
  const [orderMeatDoneness, setOrderMeatDoneness] = useState<'mal' | 'ponto' | 'bem'>('ponto')
  const [orderExtraNote, setOrderExtraNote] = useState<string>('')

  // Estados da Mesa (Cliente)
  const [selectedTableNumber] = useState<number>(14)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(['i1'])
  const [tipPercent, setTipPercent] = useState<number>(10)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false)
  const [conflictToast, setConflictToast] = useState<{ title: string; desc: string; type: 'amber' | 'emerald' | 'cyan' } | null>(null)
  const [activeClientTab, setActiveClientTab] = useState<'comanda' | 'cardapio' | 'ia_sommelier' | 'jukebox' | 'historico'>('comanda')

  // Modais do Admin
  const [selectedCashierTable, setSelectedCashierTable] = useState<Table | null>(tables[0])
  const [adminModal, setAdminModal] = useState<'detalhes' | 'fechar_manual' | 'nova_mesa' | 'novo_garcom' | 'trocar_mesa' | 'novo_produto' | null>(null)
  const [customDiscount, setCustomDiscount] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [transferTargetTable, setTransferTargetTable] = useState<number>(5)

  // IA Sommelier / Chat na mesa
  const [aiQuestion, setAiQuestion] = useState<string>('')
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'ia'; text: string; recommendedItemId?: string }[]>([
    {
      sender: 'ia',
      text: 'Olá! Sou o Sommelier & Chef Virtual IA do Bar. Notou que você pediu 2 Chopes IPA. Gostaria de uma sugestão de petisco com alta combinação de sabor?',
      recommendedItemId: 'c4',
    },
  ])

  // Formulário Nova Mesa
  const [newTableNumber, setNewTableNumber] = useState<string>('')
  const [newTableName, setNewTableName] = useState<string>('')
  const [newTableZone, setNewTableZone] = useState<'Deck' | 'Salão Principal' | 'Bar Balcão' | 'Lounge' | 'Deck Rooftop' | 'Salão Nobre' | 'Lounge VIP'>('Deck Rooftop')

  // Filtros Avançados Big Tech
  const [dashboardPeriod, setDashboardPeriod] = useState<'hoje' | 'ontem' | '7dias' | 'mes'>('hoje')
  const [kdsStationFilter, setKdsStationFilter] = useState<'todas' | 'cozinha_quente' | 'bar_coqueteis' | 'copa_chopp'>('todas')
  const [tableZoneFilter, setTableZoneFilter] = useState<string>('todas')

  // Formulário Novo Garçom
  const [newWaiterName, setNewWaiterName] = useState<string>('')
  const [newWaiterPhone, setNewWaiterPhone] = useState<string>('')

  const currentTable = tables.find((t) => t.number === selectedTableNumber) || tables[0]

  const triggerHaptic = (ms = 15) => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      navigator.vibrate(ms)
    }
  }

  const playSound = (type: 'tap' | 'success' | 'add' = 'tap') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'tap') {
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05)
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
        osc.start()
        osc.stop(ctx.currentTime + 0.05)
      } else if (type === 'add') {
        osc.frequency.setValueAtTime(520, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08)
        gain.gain.setValueAtTime(0.06, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
        osc.start()
        osc.stop(ctx.currentTime + 0.08)
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime)
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  // Cálculos financeiros do Admin
  const totalApprovedTxs = transactions.filter((tx) => tx.status === 'aprovado')
  const totalRevenueTurn = totalApprovedTxs.reduce((acc, curr) => acc + curr.amount, 0)
  const totalTipsTurn = totalApprovedTxs.reduce((acc, curr) => acc + curr.tipAmount, 0)
  const pixRevenue = totalApprovedTxs.filter((tx) => tx.method === 'pix').reduce((acc, curr) => acc + curr.amount, 0)
  const cardRevenue = totalApprovedTxs.filter((tx) => tx.method === 'apple_pay' || tx.method === 'cartao').reduce((acc, curr) => acc + curr.amount, 0)
  const feesSavedWithPix = (pixRevenue * 0.025)

  // Métricas da mesa ativa do cliente
  const unpaidItems = currentTable.items.filter((it) => !it.paidBy)
  const totalDebt = unpaidItems.reduce((acc, curr) => acc + curr.price, 0)
  const totalPaid = currentTable.items.filter((it) => it.paidBy).reduce((acc, curr) => acc + curr.price, 0)
  const progressPercent = totalPaid + totalDebt > 0 ? Math.round((totalPaid / (totalPaid + totalDebt)) * 100) : 0

  const selectedSubtotal = currentTable.items
    .filter((it) => selectedItemIds.includes(it.id))
    .reduce((acc, curr) => acc + curr.price, 0)
  const tipAmount = (selectedSubtotal * tipPercent) / 100
  const finalTotalToPay = selectedSubtotal + tipAmount

  const handleToggleItem = (item: MenuItem) => {
    triggerHaptic(15)
    playSound('tap')
    if (item.paidBy) return

    if (item.lockedBy && !item.lockedBy.userName.includes('Lucas')) {
      triggerHaptic(50)
      setConflictToast({
        title: '🔒 Item em Pagamento por Outro Cliente',
        desc: `${item.lockedBy.userName} está com este item no checkout agora. O sistema bloqueou para evitar cobrança dupla.`,
        type: 'amber',
      })
      setTimeout(() => setConflictToast(null), 5000)
      return
    }

    if (selectedItemIds.includes(item.id)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== item.id))
    } else {
      setSelectedItemIds([...selectedItemIds, item.id])
    }
  }

  // Simular Concorrência ao Vivo
  const handleSimulateRaceCondition = () => {
    triggerHaptic(60)
    setConflictToast({
      title: '⚡ CONFLITO CONCORRENTE TRATADO',
      desc: 'Mariana Costa acabou de confirmar o pagamento do Gin Tônica via Pix! A trava foi liberada e o saldo da mesa foi reduzido em R$ 39,00.',
      type: 'amber',
    })

    setTables((prev) =>
      prev.map((tab) =>
        tab.number === 14
          ? {
              ...tab,
              totalPaid: tab.totalPaid + 39.0,
              items: tab.items.map((it) =>
                it.id === 'i3'
                  ? {
                      ...it,
                      lockedBy: undefined,
                      paidBy: { userName: 'Mariana Costa', paidAt: 'Agora mesmo', method: 'pix' },
                    }
                  : it
              ),
            }
          : tab
      )
    )

    setSelectedItemIds((prev) => prev.filter((id) => id !== 'i3'))
    setTimeout(() => setConflictToast(null), 6000)
  }

  // Cliente faz pedido direto do Cardápio Inteligente
  const handleClientSelfOrder = (product: ProductCatalogItem) => {
    triggerHaptic(30)
    playSound('add')
    if (product.stock <= 0) {
      setConflictToast({
        title: '⚠️ Produto Esgotado',
        desc: `Infelizmente "${product.name}" acabou no estoque do bar.`,
        type: 'amber',
      })
      setTimeout(() => setConflictToast(null), 3000)
      return
    }

    const newItem: MenuItem = {
      id: `self-${Date.now()}`,
      name: `1x ${product.name}`,
      price: product.price,
      category: product.category,
      orderedBy: 'Você (Lucas)',
      avatarColor: 'bg-emerald-400',
      status: 'preparando',
      orderedAt: new Date().toLocaleTimeString().slice(0, 5),
    }

    setTables((prev) =>
      prev.map((t) =>
        t.number === currentTable.number
          ? {
              ...t,
              totalOriginal: t.totalOriginal + product.price,
              items: [...t.items, newItem],
            }
          : t
      )
    )

    setCatalog((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
    )

    const newKdsOrder: KitchenOrder = {
      id: `KDS-${Math.floor(100 + Math.random() * 900)}`,
      tableNumber: currentTable.number,
      status: 'pendente',
      timeElapsedMinutes: 0,
      requestedAt: new Date().toLocaleTimeString().slice(0, 5),
      items: [newItem],
    }
    setKitchenOrders((prev) => [newKdsOrder, ...prev])

    setConflictToast({
      title: '🍽️ Pedido Enviado para a Cozinha!',
      desc: `"${product.name}" foi disparado para a produção e adicionado à sua comanda.`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Pedido Granular Estilo Izakaya Tokyo Tech (Personalizado)
  const handleConfirmCustomOrder = () => {
    if (!selectedProductForOrder) return
    triggerHaptic(30)
    playSound('add')

    const p = selectedProductForOrder
    const customDescParts: string[] = []
    if (p.category === 'bebida') {
      customDescParts.push(orderIceOption === 'sem_gelo' ? 'Sem gelo' : orderIceOption === 'pouco' ? 'Pouco gelo' : 'Gelo normal')
    } else if (p.category === 'comida') {
      customDescParts.push(orderMeatDoneness === 'mal' ? 'Ponto: Mal passada' : orderMeatDoneness === 'ponto' ? 'Ponto: Ao ponto' : 'Ponto: Bem passada')
    }
    if (orderExtraNote.trim()) {
      customDescParts.push(`Obs: ${orderExtraNote.trim()}`)
    }

    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: `1x ${p.name}`,
      description: customDescParts.join(' • '),
      price: p.price,
      category: p.category,
      orderedBy: 'Você (Lucas)',
      avatarColor: 'bg-emerald-400',
      status: 'preparando',
      orderedAt: new Date().toLocaleTimeString().slice(0, 5),
    }

    setTables((prev) =>
      prev.map((t) =>
        t.number === currentTable.number
          ? {
              ...t,
              totalOriginal: t.totalOriginal + p.price,
              items: [...t.items, newItem],
            }
          : t
      )
    )

    setCatalog((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item))
    )

    const newKdsOrder: KitchenOrder = {
      id: `KDS-${Math.floor(100 + Math.random() * 900)}`,
      tableNumber: currentTable.number,
      status: 'pendente',
      timeElapsedMinutes: 0,
      requestedAt: new Date().toLocaleTimeString().slice(0, 5),
      items: [newItem],
    }
    setKitchenOrders((prev) => [newKdsOrder, ...prev])

    setSelectedProductForOrder(null)
    setOrderExtraNote('')
    setConflictToast({
      title: '🎯 Pedido Personalizado Enviado!',
      desc: `"${p.name}" (${customDescParts.join(' | ')}) enviado ao KDS com sucesso!`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 4500)
  }

  // "Mais Uma!" One-Tap Instant Reorder (Tokyo Express)
  const handleOneTapReorder = () => {
    triggerHaptic(40)
    playSound('add')
    const lastBebida = currentTable.items.slice().reverse().find((it) => it.category === 'bebida') || currentTable.items[0]
    if (!lastBebida) return

    const reorderedItem: MenuItem = {
      id: `reorder-${Date.now()}`,
      name: `1x ${lastBebida.name.replace(/^\d+x\s*/, '')} (Repetição)`,
      price: lastBebida.price,
      category: lastBebida.category,
      orderedBy: 'Você (Lucas)',
      avatarColor: 'bg-emerald-400',
      status: 'preparando',
      orderedAt: new Date().toLocaleTimeString().slice(0, 5),
    }

    setTables((prev) =>
      prev.map((t) =>
        t.number === currentTable.number
          ? {
              ...t,
              totalOriginal: t.totalOriginal + lastBebida.price,
              items: [...t.items, reorderedItem],
            }
          : t
      )
    )

    const newKdsOrder: KitchenOrder = {
      id: `KDS-${Math.floor(100 + Math.random() * 900)}`,
      tableNumber: currentTable.number,
      status: 'pendente',
      timeElapsedMinutes: 0,
      requestedAt: new Date().toLocaleTimeString().slice(0, 5),
      items: [reorderedItem],
    }
    setKitchenOrders((prev) => [newKdsOrder, ...prev])

    setConflictToast({
      title: '⚡ "Mais Uma!" Disparada com Sucesso',
      desc: `Rodada de "${lastBebida.name}" enviada imediatamente ao bar!`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Chamar Garçom com Propósito (Smart Service Call - Seul Tech)
  const handleTriggerSmartCall = (reason: WaiterCallReason, reasonLabel: string) => {
    triggerHaptic(30)
    playSound('tap')

    const newCall: SmartWaiterCall = {
      id: `call-${Date.now()}`,
      tableNumber: currentTable.number,
      reason,
      reasonLabel,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
      status: 'pendente',
      waiterName: currentTable.waiterName,
    }
    setSmartWaiterCalls((prev) => [newCall, ...prev])

    // Notificação de alta prioridade para o sistema e smartwatch do garçom
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: `🔔 Mesa ${currentTable.number}: ${reasonLabel}`,
      message: `Solicitação objetiva recebida na Mesa ${currentTable.number}. Garçom responsável: ${currentTable.waiterName}.`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'waiter',
      urgency: 'high',
      read: false,
      targetTable: currentTable.number,
      actionLabel: 'Atender Mesa',
    }
    setNotifications((prev) => [notif, ...prev])

    setShowSmartCallModal(false)
    setConflictToast({
      title: '🛎️ Garçom Notificado com o Pedido Exato',
      desc: `${currentTable.waiterName} já foi acionado e trará: "${reasonLabel}".`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 4500)
  }

  // Atender Chamado Inteligente de Garçom
  const handleResolveSmartCall = (callId: string) => {
    playSound('tap')
    setSmartWaiterCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: 'concluido' } : c))
    )
    setConflictToast({
      title: '✅ Chamado Atendido',
      desc: 'O garçom concluiu o atendimento na mesa.',
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 3000)
  }

  // Jukebox: Votar em faixa musical
  const handleVoteTrack = (trackId: string) => {
    triggerHaptic(20)
    playSound('tap')
    setJukeboxTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, votes: t.votes + 1, votedByMe: true } : t))
    )
    setConflictToast({
      title: '🎵 Voto Computado na Playlist do Bar!',
      desc: 'Sua música subiu no ranking da Jukebox do salão.',
      type: 'cyan',
    })
    setTimeout(() => setConflictToast(null), 3500)
  }

  // Ajuste Rápido de Estoque (+/-)
  const handleQuickStockAdjust = (prodId: string, delta: number) => {
    triggerHaptic(15)
    playSound('tap')
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const newStock = Math.max(0, p.stock + delta)
          return { ...p, stock: newStock }
        }
        return p
      })
    )
  }

  // Criar Novo Produto no Estoque & Cardápio
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductName.trim() || !newProductPrice) return

    const price = parseFloat(newProductPrice) || 0
    const cost = parseFloat(newProductCost) || 0
    const stock = parseInt(newProductStock) || 0
    const minStock = parseInt(newProductMinStock) || 5
    const marginPercent = price > 0 ? Math.round(((price - cost) / price) * 100) : 0

    const newProd: ProductCatalogItem & { pairingSuggestion?: string } = {
      id: `c_${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      price,
      cost,
      stock,
      minStock,
      marginPercent,
      isPopular: false,
      pairingSuggestion: newProductPairing.trim() || 'Harmonização indicada pelo Sommelier.',
    }

    setCatalog((prev) => [newProd, ...prev])
    setNewProductName('')
    setNewProductPrice('')
    setNewProductCost('')
    setNewProductStock('')
    setNewProductPairing('')
    setAdminModal(null)

    triggerHaptic(30)
    confetti({ particleCount: 50, spread: 60 })
    setConflictToast({
      title: '📦 Novo Produto Cadastrado',
      desc: `"${newProd.name}" adicionado ao cardápio e controle de estoque com margem de ${marginPercent}%.`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Enviar Pergunta para o Sommelier IA
  const handleSendAiPrompt = () => {
    if (!aiQuestion.trim()) return
    const userMsg = aiQuestion
    setAiQuestion('')
    playSound('tap')

    setAiChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }])

    setTimeout(() => {
      let reply = 'Excelente escolha! Para acompanhar com alta harmonização, recomendo a nossa Batata Rústica Trufada ou mais uma rodada do Chopp IPA gelado.'
      let recId = 'c4'

      if (userMsg.toLowerCase().includes('doce') || userMsg.toLowerCase().includes('sobremesa')) {
        reply = 'Para fechar a noite com chave de ouro, nosso Fondue de Chocolate Belga com frutas frescas é o mais elogiado da casa.'
        recId = 'c2'
      } else if (userMsg.toLowerCase().includes('carne') || userMsg.toLowerCase().includes('fome')) {
        reply = 'A Picanha Premium Grelhada (600g) serve perfeitamente até 3 pessoas e sai na chapa fumegante em 15 minutos.'
        recId = 'c2'
      }

      playSound('add')
      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'ia',
          text: reply,
          recommendedItemId: recId,
        },
      ])
    }, 700)
  }

  // Bancar Amigo
  const handleGiftFriend = (friendName: string) => {
    triggerHaptic(30)
    const friendItems = currentTable.items.filter(
      (it) => !it.paidBy && it.orderedBy.includes(friendName)
    )
    const newIds = Array.from(new Set([...selectedItemIds, ...friendItems.map((i) => i.id)]))
    setSelectedItemIds(newIds)
    setShowGiftModal(false)

    setConflictToast({
      title: '🎁 Consumo Assumido com Sucesso',
      desc: `Você adicionou todos os pedidos pendentes de ${friendName} ao seu checkout!`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Checkout no Cliente
  const handleClientCheckout = (method: 'pix' | 'apple_pay') => {
    triggerHaptic(40)
    playSound('tap')
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
      playSound('success')

      const paidItemsTotal = selectedSubtotal
      const newTx: PaymentTransaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        tableNumber: currentTable.number,
        clientName: 'Lucas (Você)',
        amount: paidItemsTotal,
        tipAmount: tipAmount,
        method: method,
        timestamp: new Date().toLocaleTimeString(),
        status: 'aprovado',
        itemsCount: selectedItemIds.length,
        taxInvoiceUrl: `https://nfe.fazenda.gov.br/doc/${Math.floor(100000 + Math.random() * 900000)}`,
      }

      setTransactions((prev) => [newTx, ...prev])

      setTables((prev) =>
        prev.map((tab) => {
          if (tab.number === currentTable.number) {
            const updatedItems = tab.items.map((it) =>
              selectedItemIds.includes(it.id)
                ? {
                    ...it,
                    lockedBy: undefined,
                    paidBy: { userName: 'Lucas', paidAt: 'Agora', method },
                  }
                : it
            )
            const newTotalPaid = tab.totalPaid + paidItemsTotal
            const isFullyPaid = updatedItems.every((it) => !!it.paidBy)
            return {
              ...tab,
              items: updatedItems,
              totalPaid: newTotalPaid,
              status: isFullyPaid ? 'paga' : tab.status,
            }
          }
          return tab
        })
      )

      setSelectedItemIds([])

      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#00F59B', '#00E5FF', '#A855F7', '#FFB800'],
      })

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#00F59B', '#00E5FF', '#A855F7'],
        })
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#00F59B', '#00E5FF', '#A855F7'],
        })
      }, 250)

      // Abre automaticamente a avaliação / NPS após o pagamento com confetes
      setTimeout(() => {
        setShowRatingModal(true)
        setRatingSubmitted(false)
      }, 1500)
    }, 1400)
  }

  // Notificações: Marcar como lida
  const handleMarkNotificationAsRead = (id: string) => {
    playSound('tap')
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Notificações: Ação Rápida
  const handleNotificationAction = (notif: SystemNotification) => {
    playSound('tap')
    triggerHaptic(15)
    handleMarkNotificationAsRead(notif.id)
    setIsNotificationDrawerOpen(false)

    if (notif.type === 'order') {
      setAdminTab('kds')
    } else if (notif.type === 'waiter' || notif.targetTable) {
      setAdminTab('mesas')
    } else if (notif.type === 'payment') {
      setAdminTab('financeiro')
    } else if (notif.type === 'ai') {
      setAdminTab('copilot_ia')
    }
  }

  // Avaliação do Cliente (NPS interno do TapTable)
  const handleSubmitRating = () => {
    triggerHaptic(30)
    playSound('success')

    const avg = (clientFoodRating + clientServiceRating) / 2
    const npsCat: 'promoter' | 'passive' | 'detractor' = avg >= 4.5 ? 'promoter' : avg >= 3.5 ? 'passive' : 'detractor'

    const newRating: TableRating = {
      id: `rate-${Date.now()}`,
      tableNumber: currentTable.number,
      clientName: 'Lucas (Mesa 14)',
      foodRating: clientFoodRating,
      serviceRating: clientServiceRating,
      comment: clientRatingComment || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waiterName: currentTable.waiterName,
      npsCategory: npsCat,
      sharedOnGoogle: false,
    }

    setRatings((prev) => [newRating, ...prev])
    setRatingSubmitted(true)

    // Adiciona notificação para a gestão
    const alertNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: npsCat === 'promoter' ? '⭐ Nova Avaliação 5 Estrelas!' : '⚠️ Feedback de Cliente Recebido',
      message: `Mesa ${currentTable.number} avaliou o atendimento com nota ${avg.toFixed(1)}/5.0. ${clientRatingComment ? `"${clientRatingComment}"` : ''}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'rating',
      urgency: npsCat === 'detractor' ? 'high' : 'low',
      read: false,
      targetTable: currentTable.number,
      actionLabel: 'Ver Avaliações',
    }
    setNotifications((prev) => [alertNotif, ...prev])

    setTimeout(() => {
      setShowRatingModal(false)
      setConflictToast({
        title: '❤️ Obrigado pela Avaliação!',
        desc: npsCat === 'promoter'
          ? 'Sua avaliação foi registrada no TapTable. Apresente esta tela ao garçom para seu shot cortesia.'
          : 'Seu feedback foi encaminhado diretamente à diretoria para aprimoramento imediato.',
        type: 'emerald',
      })
      setTimeout(() => setConflictToast(null), 5000)
    }, 1200)
  }

  // Copia o fechamento para uso dentro da operação, sem abrir outro aplicativo.
  const handleCopyShiftReport = async () => {
    triggerHaptic(20)
    playSound('tap')

    const dateStr = new Date().toLocaleDateString('pt-BR')
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const promotersCount = ratings.filter((r) => r.npsCategory === 'promoter').length
    const npsScore = ratings.length > 0 ? Math.round((promotersCount / ratings.length) * 100) : 100

    const text = `📊 *TAPTABLE AI OS — FECHAMENTO DE TURNO*
🏢 *${activeBranch}*
📅 Data: ${dateStr} às ${timeStr}

💰 *RESUMO FINANCEIRO (DRE)*
• Faturamento Bruto: R$ 14.820,00
• Recebido no Pix: R$ ${pixRevenue.toFixed(2)}
• Cartão / Apple Pay: R$ ${cardRevenue.toFixed(2)}
• Economia de Taxas (Pix): R$ 370,00 ⚡
• CMV Estimado: R$ 4.297,80 (29.0%)
• *Lucro Operacional Líquido: R$ 10.379,70 (70% Margem)*

👥 *EQUIPE & GORJETAS (10%)*
• Total Acumulado: R$ ${totalTipsTurn.toFixed(2)}
• Salão (70%): R$ ${(totalTipsTurn * 0.7).toFixed(2)}
• Cozinha/Bar (20%): R$ ${(totalTipsTurn * 0.2).toFixed(2)}
• Apoio (10%): R$ ${(totalTipsTurn * 0.1).toFixed(2)}

⭐ *EXPERIÊNCIA DO CLIENTE (NPS)*
• Índice NPS: ${npsScore}% Promotores
• Total de Avaliações Coletadas: ${ratings.length}

_Relatório assinado e sincronizado com SEFAZ NFC-e._`

    let copied = false
    try {
      await navigator.clipboard.writeText(text)
      copied = true
    } catch {
    }

    setConflictToast({
      title: copied ? 'Fechamento copiado' : 'Relatório pronto',
      desc: copied
        ? 'O relatório está na área de transferência para uso na operação.'
        : 'A cópia automática não está disponível neste navegador. O fechamento continua no painel.',
      type: copied ? 'emerald' : 'cyan',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Mover / Transferir Mesa
  const handleTransferTable = () => {
    if (!selectedCashierTable) return
    const fromNum = selectedCashierTable.number
    const toNum = transferTargetTable

    if (fromNum === toNum) return

    setTables((prev) => {
      const sourceTable = prev.find((t) => t.number === fromNum)
      if (!sourceTable) return prev

      return prev.map((t) => {
        if (t.number === toNum) {
          return {
            ...t,
            status: 'ocupada',
            totalOriginal: t.totalOriginal + sourceTable.totalOriginal,
            totalPaid: t.totalPaid + sourceTable.totalPaid,
            items: [...t.items, ...sourceTable.items],
            activeUsersCount: t.activeUsersCount + sourceTable.activeUsersCount,
          }
        }
        if (t.number === fromNum) {
          return {
            ...t,
            status: 'livre',
            totalOriginal: 0,
            totalPaid: 0,
            items: [],
            activeUsersCount: 0,
            openedAt: '--:--',
          }
        }
        return t
      })
    })

    setAdminModal(null)
    setConflictToast({
      title: '🔄 Mesa Transferida com Sucesso',
      desc: `Consumo da Mesa ${fromNum} movido para a Mesa ${toNum}.`,
      type: 'cyan',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Criar Nova Mesa
  const handleCreateNewTable = () => {
    if (!newTableNumber || !newTableName) return
    const num = parseInt(newTableNumber)
    if (isNaN(num)) return

    const newTable: Table = {
      number: num,
      name: newTableName,
      zone: newTableZone,
      status: 'livre',
      waiterName: waiters[0]?.name || 'Não atribuído',
      openedAt: '--:--',
      activeUsersCount: 0,
      totalOriginal: 0,
      totalPaid: 0,
      occupancyMinutes: 0,
      riskAlert: null,
      items: [],
    }

    setTables((prev) => [...prev, newTable])
    setNewTableNumber('')
    setNewTableName('')
    setAdminModal(null)
    setConflictToast({
      title: '✅ Nova Mesa Cadastrada',
      desc: `Mesa ${num} (${newTableName}) adicionada com sucesso!`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 3500)
  }

  // Criar Novo Garçom
  const handleCreateNewWaiter = () => {
    if (!newWaiterName) return
    const newW: Waiter = {
      id: `w-${Date.now()}`,
      name: newWaiterName,
      avatar: newWaiterName.substring(0, 2).toUpperCase(),
      phone: newWaiterPhone || '(11) 99999-9999',
      activeTables: [],
      rating: 5.0,
      totalSalesToday: 0,
      tipsAccumulated: 0,
      status: 'ativo',
    }

    setWaiters((prev) => [...prev, newW])
    setNewWaiterName('')
    setNewWaiterPhone('')
    setAdminModal(null)
    setConflictToast({
      title: '👤 Garçom Adicionado',
      desc: `${newWaiterName} cadastrado no sistema.`,
      type: 'cyan',
    })
    setTimeout(() => setConflictToast(null), 3500)
  }

  // Fechar manual
  const handleCashierManualClose = (tableNum: number, method: 'dinheiro' | 'cartao') => {
    const table = tables.find((t) => t.number === tableNum)
    if (!table) return

    const remaining = table.items.filter((it) => !it.paidBy).reduce((acc, curr) => acc + curr.price, 0)
    if (remaining <= 0) return

    const newTx: PaymentTransaction = {
      id: `TX-BALCAO-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber: tableNum,
      clientName: 'Fechamento Balcão',
      amount: remaining - customDiscount,
      tipAmount: 0,
      method: method,
      timestamp: new Date().toLocaleTimeString(),
      status: 'aprovado',
      itemsCount: table.items.filter((it) => !it.paidBy).length,
    }

    setTransactions((prev) => [newTx, ...prev])

    setTables((prev) =>
      prev.map((t) =>
        t.number === tableNum
          ? {
              ...t,
              status: 'paga',
              totalPaid: t.totalOriginal,
              items: t.items.map((it) => ({
                ...it,
                paidBy: it.paidBy || { userName: 'Caixa Balcão', paidAt: 'Agora', method: 'dinheiro_caixa' },
              })),
            }
          : t
      )
    )

    setAdminModal(null)
    setCustomDiscount(0)
    setConflictToast({
      title: '💵 Mesa Fechada no Caixa',
      desc: `Mesa ${tableNum} quitada via ${method.toUpperCase()}!`,
      type: 'emerald',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Liberar mesa limpa
  const handleReleaseTable = (tableNum: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.number === tableNum
          ? {
              ...t,
              status: 'livre',
              totalOriginal: 0,
              totalPaid: 0,
              activeUsersCount: 0,
              openedAt: '--:--',
              occupancyMinutes: 0,
              riskAlert: null,
              items: [],
              requestedWaiter: false,
              closingRequested: false,
            }
          : t
      )
    )
    setAdminModal(null)
    setConflictToast({
      title: '🟢 Mesa Liberada',
      desc: `Mesa ${tableNum} pronta para novos clientes.`,
      type: 'cyan',
    })
    setTimeout(() => setConflictToast(null), 3000)
  }

  // Estornar
  const handleRefundTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, status: 'estornado' } : tx))
    )
    setConflictToast({
      title: '↩️ Pagamento Estornado',
      desc: `Transação ${txId} estornada com sucesso.`,
      type: 'amber',
    })
    setTimeout(() => setConflictToast(null), 4000)
  }

  // Avançar KDS
  const handleAdvanceKdsOrder = (orderId: string) => {
    setKitchenOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nextStatus = ord.status === 'pendente' ? 'em_preparo' : ord.status === 'em_preparo' ? 'pronto' : 'entregue'
          return { ...ord, status: nextStatus }
        }
        return ord
      })
    )
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-[#030508] text-slate-100'} flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative overflow-x-hidden transition-colors duration-300`}>
      {/* ======================================================== */}
      {/* 🌌 SPATIAL OBSIDIAN & AMBIENT GLOW BACKGROUND */}
      {/* ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base True OLED Depth */}
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-slate-50' : 'bg-[#030508]'}`} />

        {/* Dynamic Pulsing Ambient Glow Orbs */}
        <div className="absolute -top-36 -left-36 w-[560px] h-[560px] rounded-full bg-[#00f59b]/12 blur-[130px] animate-orb-1 will-change-transform" />
        <div className="absolute top-[28%] -right-40 w-[620px] h-[620px] rounded-full bg-[#00e5ff]/10 blur-[140px] animate-orb-2 will-change-transform" />
        <div className="absolute -bottom-40 left-[15%] w-[680px] h-[680px] rounded-full bg-[#a855f7]/12 blur-[140px] animate-orb-3 will-change-transform" />

        {/* Micro-dot spatial grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-[0.28] mix-blend-screen" />

        {/* Subtle radial depth mask */}
        <div className={`absolute inset-0 bg-radial from-transparent ${theme === 'light' ? 'via-slate-100/30 to-slate-100/80' : 'via-[#030508]/30 to-[#030508]/85'}`} />
      </div>

      {/* ======================================================== */}
      {/* TOPBAR GLOBAL BIG TECH */}
      {/* ======================================================== */}
      <header className="glass-panel sticky top-0 z-50 px-4 py-2.5 border-b border-white/5 backdrop-blur-2xl relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Marca */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#090D15] rounded-[9px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-[#090D15]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <ShinyText
                  text="TapTable AI OS"
                  speed={3}
                  color={theme === 'light' ? '#0f172a' : '#ffffff'}
                  shineColor="#00f59b"
                  className="text-sm font-extrabold tracking-tight cursor-default"
                />
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 font-mono-numbers border border-cyan-500/30 flex items-center gap-1 font-bold">
                  <Bot className="w-3 h-3 text-cyan-400" /> ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {currentPerspective === 'admin'
                  ? 'Sistema Operacional de Hospitalidade & Pagamento Instantâneo'
                  : `Mesa ${currentTable.number} • ${currentTable.name}`}
              </p>
            </div>
          </div>

          {/* Barra de Pesquisa Omnibox ⌘K & Telemetria */}
          {currentPerspective === 'admin' && (
            <div className="flex items-center gap-2.5 flex-1 max-w-md mx-2">
              <button
                onClick={() => {
                  triggerHaptic()
                  playSound('tap')
                  setIsCommandMenuOpen(true)
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 transition-all hover:border-white/20 group active:scale-[0.99]"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
                  <span className="truncate">Buscar mesas, pedidos, garçons...</span>
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[10px] text-slate-300">
                  <Command className="w-2.5 h-2.5" /> K
                </kbd>
              </button>

              {/* Status de Conexão WebSocket Live com Efeito DecryptedText */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono-numbers shrink-0">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <DecryptedText
                  text="24ms Live Sync"
                  speed={40}
                  maxIterations={10}
                  animateOn="hover"
                  className="font-mono-numbers text-[11px] text-emerald-300 font-bold"
                />
              </div>
            </div>
          )}

          {/* Controles de Direita: Notificações, Tema, Seletor de Unidade & Toggle de Perspectivas */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Botão de Tema Claro / Escuro */}
            <button
              onClick={() => {
                triggerHaptic(15)
                playSound('tap')
                setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
              }}
              title={theme === 'dark' ? 'Ativar Tema Claro (Apple Studio)' : 'Ativar Tema Escuro (OLED Obsidian)'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-purple-400" />
              )}
            </button>

            {/* Central de Notificações com Badge Pulsante */}
            <button
              onClick={() => {
                triggerHaptic(15)
                playSound('tap')
                setIsNotificationDrawerOpen(true)
              }}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
              title="Central de Notificações em Tempo Real"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-black font-mono-numbers text-white items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                </span>
              )}
            </button>

            {currentPerspective === 'admin' && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0D131F] border border-white/10 text-xs text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <select
                  value={activeBranch}
                  onChange={(e) => setActiveBranch(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Unidade Rooftop Jardins" className="bg-[#090D15] text-white">Rooftop Jardins</option>
                  <option value="Unidade Vila Madalena" className="bg-[#090D15] text-white">Vila Madalena</option>
                  <option value="Unidade Ipanema Beach" className="bg-[#090D15] text-white">Ipanema Beach</option>
                </select>
              </div>
            )}

            {/* Toggle de Perspectivas */}
            <div className="flex items-center gap-1 bg-[#0D131F]/90 p-1 rounded-xl border border-white/10 text-xs relative">
              <button
                onClick={() => {
                  triggerHaptic()
                  playSound('tap')
                  setCurrentPerspective('admin')
                }}
                className={`relative px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 z-10 active:scale-95 ${
                  currentPerspective === 'admin'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentPerspective === 'admin' && (
                  <motion.div
                    layoutId="perspective-indicator"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-500/25 -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <LayoutDashboard className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Central</span> Gestão
              </button>
              <button
                onClick={() => {
                  triggerHaptic()
                  playSound('tap')
                  setCurrentPerspective('client')
                }}
                className={`relative px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 z-10 active:scale-95 ${
                  currentPerspective === 'client'
                    ? 'text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentPerspective === 'client' && (
                  <motion.div
                    layoutId="perspective-indicator"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/25 -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Zap className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mesa</span> ({currentTable.number})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* TOAST FLUTUANTE */}
      {conflictToast && (
        <div className="fixed top-18 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              conflictToast.type === 'amber'
                ? 'bg-[#151208]/95 border-amber-500/70 text-amber-200 glow-amber'
                : conflictToast.type === 'emerald'
                ? 'bg-[#081510]/95 border-emerald-500/70 text-emerald-200 glow-emerald'
                : 'bg-[#0B1522]/95 border-cyan-500/70 text-cyan-200 glow-cyan'
            }`}
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-white tracking-wide uppercase">{conflictToast.title}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{conflictToast.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🚀 CENTRAL DE GESTÃO DO ADMIN (COM COPILOT IA INTEGRADO) */}
      {/* ======================================================== */}
      {currentPerspective === 'admin' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-5 pb-24">
          {/* SIDEBAR LINEAR STYLE (DESKTOP) */}
          <aside
            className={`hidden lg:flex flex-col justify-between glass-panel rounded-3xl p-3 border border-white/10 transition-all duration-300 shrink-0 select-none ${
              isSidebarCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-2 py-1">
                {!isSidebarCollapsed && (
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Navegação
                  </span>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all mx-auto lg:mx-0"
                  title={isSidebarCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {[
                  { id: 'dashboard', label: 'Dashboard Executivo', icon: LayoutDashboard, badge: null },
                  { id: 'copilot_ia', label: 'Copilot IA Gerente', icon: BrainCircuit, badge: 'IA', isAi: true },
                  { id: 'mesas', label: 'Mesas & Salão', icon: Layers, badge: `${tables.filter((t) => t.status === 'ocupada' || t.status === 'em_fechamento').length}/${tables.length}` },
                  { id: 'kds', label: 'KDS Cozinha', icon: Flame, badge: `${kitchenOrders.filter((k) => k.status !== 'entregue').length}` },
                  { id: 'estoque', label: 'Estoque & CMV', icon: Package, badge: catalog.filter((p) => p.stock <= p.minStock).length ? 'Alerta' : null },
                  { id: 'financeiro', label: 'DRE & Finanças', icon: Wallet, badge: null },
                  { id: 'garcons', label: 'Garçons & 10%', icon: Users, badge: `${waiters.length}` },
                  { id: 'avaliacoes', label: 'Avaliações & NPS', icon: Star, badge: `${ratings.length}` },
                  { id: 'tags_nfc', label: 'Tags NFC & QR', icon: QrCode, badge: null },
                ].map((item) => {
                  const Icon = item.icon
                  const isActive = adminTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        triggerHaptic()
                        playSound('tap')
                        setAdminTab(item.id as any)
                      }}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs transition-colors active:scale-[0.98] ${
                        isActive
                          ? item.isAi
                            ? 'text-cyan-200'
                            : 'text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="admin-active-tab-desktop"
                          className={`absolute inset-0 rounded-2xl -z-10 ${
                            item.isAi
                              ? 'bg-cyan-500/20 border border-cyan-500/40 glow-cyan'
                              : 'bg-gradient-to-r from-purple-600/35 to-indigo-600/25 border border-purple-500/40 shadow-lg shadow-purple-950/40'
                          }`}
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? (item.isAi ? 'text-cyan-300' : 'text-purple-300') : 'text-slate-400'}`} />
                      
                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}

                      {!isSidebarCollapsed && item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono-numbers font-black ${
                          item.isAi
                            ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/30'
                            : item.badge === 'Alerta'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-white/10 text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {isSidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-[#131926] border border-white/10 rounded-lg text-white text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                          {item.label}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              <div className={`p-2.5 rounded-2xl bg-[#080C14] border border-white/5 flex items-center gap-2.5 ${isSidebarCollapsed ? 'justify-center p-2' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Rede</p>
                    <p className="text-xs text-emerald-300 font-mono-numbers font-bold truncate">Online • 100% SLA</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* NAVEGAÇÃO MOBILE/TABLET (HORIZONTAL) */}
          <nav className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs border-b border-white/5 shrink-0 relative">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'copilot_ia', label: '🧠 Copilot IA', icon: BrainCircuit },
              { id: 'mesas', label: `Mesas (${tables.length})`, icon: Layers },
              { id: 'kds', label: `KDS (${kitchenOrders.filter((k) => k.status !== 'entregue').length})`, icon: Flame },
              { id: 'estoque', label: 'Estoque', icon: Package },
              { id: 'financeiro', label: 'Financeiro', icon: Wallet },
              { id: 'garcons', label: `Garçons (${waiters.length})`, icon: Users },
              { id: 'avaliacoes', label: `Avaliações (${ratings.length})`, icon: Star },
              { id: 'tags_nfc', label: 'Tags NFC', icon: QrCode },
            ].map((tab) => {
              const Icon = tab.icon
              const isAi = tab.id === 'copilot_ia'
              const isActive = adminTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerHaptic()
                    playSound('tap')
                    setAdminTab(tab.id as any)
                  }}
                  className={`relative px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 active:scale-95 ${
                    isActive
                      ? isAi
                        ? 'text-cyan-300'
                        : 'text-purple-300'
                      : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-active-tab-mobile"
                      className={`absolute inset-0 rounded-xl -z-10 border ${
                        isAi
                          ? 'bg-cyan-500/20 border-cyan-500/50 glow-cyan'
                          : 'bg-purple-600/20 border-purple-500/40 shadow-sm'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isAi ? 'text-cyan-400' : ''}`} /> {tab.label}
                </button>
              )
            })}
          </nav>

          {/* MAIN CONTENT WORKSPACE */}
          <main className="flex-1 min-w-0 flex flex-col gap-5 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={adminTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-5"
              >

          {/* ================= SUB-ABA: COPILOT IA DO GERENTE ================= */}
          {adminTab === 'copilot_ia' && (
            <div className="flex flex-col gap-4">
              <div className="glass-panel-elevated p-6 rounded-3xl border border-cyan-500/30 glow-cyan flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        Copilot IA — Inteligência Preditiva do Bar
                      </h2>
                      <p className="text-xs text-slate-400">
                        Análise de comportamento de consumo, alerta de mesas ociosas e previsão de estoque
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 animate-pulse">
                    ● IA Analisando Turno
                  </span>
                </div>

                {/* Briefing Executivo Gerado pela IA */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-2">
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Briefing Executivo do Turno:
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "O salão está operando com alta velocidade de rotação (**38 min/mesa**). 
                    Identificamos que a **Mesa 12** atingiu 115 minutos de permanência sem novos pedidos nos últimos 40 minutos.
                    Recomendamos enviar o garçom para oferecer a sobremesa ou o café de cortesia para liberar a mesa no pico. 
                    O estoque de Chopp IPA suporta até as 23h45 no ritmo atual."
                  </p>
                </div>

                {/* Recomendações em Ação Direta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
                        Ação Anti-Ociosidade
                      </span>
                      <h4 className="text-xs font-bold text-white mt-2">Mesa 12 Ociosa (115 min)</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Conta de R$ 198 parada há mais de 40 min.</p>
                    </div>
                    <button
                      onClick={() => {
                        setConflictToast({
                          title: '📢 Notificação Enviada ao Garçom',
                          desc: 'Amanda Lins foi instruída a iniciar o fechamento cortês da Mesa 12.',
                          type: 'amber',
                        })
                        setTimeout(() => setConflictToast(null), 3500)
                      }}
                      className="text-xs py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all"
                    >
                      Acionar Garçom na Mesa
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                        Previsão de Estoque
                      </span>
                      <h4 className="text-xs font-bold text-white mt-2">Reposição de Picanha (14 un)</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Alta saída estimada para as próximas 2 horas.</p>
                    </div>
                    <button
                      onClick={() => {
                        setConflictToast({
                          title: '📦 Pedido de Reposição Gerado',
                          desc: 'Aviso de reposição enviado para a copa/cozinha.',
                          type: 'emerald',
                        })
                        setTimeout(() => setConflictToast(null), 3500)
                      }}
                      className="text-xs py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all"
                    >
                      Avisar Cozinha
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase">
                        Maximização de Lucro
                      </span>
                      <h4 className="text-xs font-bold text-white mt-2">Promover Moscow Mule (73% margem)</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Item com alta margem e estoque suficiente.</p>
                    </div>
                    <button
                      onClick={() => {
                        setConflictToast({
                          title: '✨ Destaque IA Ativado no Cardápio',
                          desc: 'Moscow Mule agora aparece como "Sugestão do Chef IA" nos celulares das mesas!',
                          type: 'cyan',
                        })
                        setTimeout(() => setConflictToast(null), 3500)
                      }}
                      className="text-xs py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
                    >
                      Destacar no App das Mesas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: DASHBOARD ================= */}
          {adminTab === 'dashboard' && (
            <div className="flex flex-col gap-5">
              {/* Seletor de Período Rápido */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl glass-panel-elevated border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Período de Análise</span>
                  <span className="text-[11px] text-slate-400 font-mono-numbers">({activeBranch})</span>
                </div>
                <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 gap-1 text-xs">
                  <button
                    onClick={() => { triggerHaptic(10); setDashboardPeriod('hoje') }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      dashboardPeriod === 'hoje'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Hoje (Turno Atual)
                  </button>
                  <button
                    onClick={() => { triggerHaptic(10); setDashboardPeriod('ontem') }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      dashboardPeriod === 'ontem'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ontem
                  </button>
                  <button
                    onClick={() => { triggerHaptic(10); setDashboardPeriod('7dias') }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      dashboardPeriod === '7dias'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Últimos 7 dias
                  </button>
                  <button
                    onClick={() => { triggerHaptic(10); setDashboardPeriod('mes') }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      dashboardPeriod === 'mes'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mês
                  </button>
                </div>
              </div>

              {/* Cards de Métricas Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <SpotlightCard
                  spotlightColor="rgba(0, 245, 155, 0.25)"
                  className="glass-panel-elevated p-4 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Faturamento {dashboardPeriod === 'hoje' ? 'Turno Atual' : dashboardPeriod === 'ontem' ? 'Ontem' : dashboardPeriod === '7dias' ? '7 Dias' : 'Mês'}</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black font-mono-numbers text-white">
                    R$ {dashboardPeriod === 'hoje' ? '14.820,00' : dashboardPeriod === 'ontem' ? '12.450,00' : dashboardPeriod === '7dias' ? '89.320,00' : '342.800,00'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                    <span>+18.4% vs ciclo anterior</span>
                  </div>
                </SpotlightCard>

                <SpotlightCard
                  spotlightColor="rgba(255, 184, 0, 0.25)"
                  className="glass-panel-elevated p-4 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Economia com Pix</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black font-mono-numbers text-amber-300">
                    R$ {dashboardPeriod === 'hoje' ? (feesSavedWithPix > 0 ? (feesSavedWithPix + 360).toFixed(2) : '370,00') : dashboardPeriod === 'ontem' ? '312,00' : dashboardPeriod === '7dias' ? '2.240,00' : '8.650,00'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Zero taxa de maquininha</p>
                </SpotlightCard>

                <SpotlightCard
                  spotlightColor="rgba(0, 229, 255, 0.25)"
                  className="glass-panel-elevated p-4 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Giro Médio de Mesa</span>
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-black font-mono-numbers text-cyan-300">
                    38 min
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-1">-19 min de espera de conta</p>
                </SpotlightCard>

                <SpotlightCard
                  spotlightColor="rgba(168, 85, 247, 0.25)"
                  className="glass-panel-elevated p-4 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Taxa de Serviço (10%)</span>
                    <Wine className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-black font-mono-numbers text-purple-300">
                    R$ {dashboardPeriod === 'hoje' ? (totalTipsTurn > 0 ? (totalTipsTurn + 1447.2).toFixed(2) : '1.482,00') : dashboardPeriod === 'ontem' ? '1.245,00' : dashboardPeriod === '7dias' ? '8.932,00' : '34.280,00'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Rateio automático para equipe</p>
                </SpotlightCard>
              </div>

              {/* Gráfico Interativo de Curva de Pico Horário & Card de Eficiência Operacional */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Gráfico de Curva de Pico (18h às 02h) */}
                <div className="glass-panel-elevated p-5 rounded-3xl border border-white/10 lg:col-span-2 flex flex-col justify-between gap-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" /> Curva de Pico Horário (18h às 02h)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Distribuição do faturamento por faixa de horário e volume de pedidos</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                      Pico: 21h-22h (R$ 3.820)
                    </span>
                  </div>

                  {/* Barras visuais proporcionais */}
                  <div className="pt-2">
                    <div className="h-44 flex items-end justify-between gap-2 px-1 pb-2 border-b border-white/10">
                      {[
                        { hour: '18h', value: 720, height: '19%', count: 12, isPeak: false },
                        { hour: '19h', value: 1450, height: '38%', count: 24, isPeak: false },
                        { hour: '20h', value: 2680, height: '70%', count: 48, isPeak: false },
                        { hour: '21h', value: 3820, height: '100%', count: 64, isPeak: true },
                        { hour: '22h', value: 3150, height: '82%', count: 52, isPeak: false },
                        { hour: '23h', value: 1940, height: '51%', count: 31, isPeak: false },
                        { hour: '00h', value: 780, height: '20%', count: 14, isPeak: false },
                        { hour: '01h', value: 280, height: '8%', count: 6, isPeak: false },
                      ].map((bar) => (
                        <div key={bar.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                          <span className="text-[10px] font-mono-numbers text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            R$ {bar.value}
                          </span>
                          <div
                            className={`w-full rounded-t-xl transition-all duration-500 relative group-hover:brightness-125 ${
                              bar.isPeak
                                ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/40 glow-emerald'
                                : 'bg-gradient-to-t from-purple-800/80 to-purple-500/80 hover:from-purple-700 hover:to-purple-400'
                            }`}
                            style={{ height: bar.height }}
                          >
                            {bar.isPeak && (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                PICO
                              </div>
                            )}
                          </div>
                          <span className={`text-[11px] font-mono-numbers font-bold ${bar.isPeak ? 'text-emerald-300 font-black' : 'text-slate-400'}`}>
                            {bar.hour}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 px-1">
                      <span>Total Faturado no Turno: <strong className="text-white font-mono-numbers">R$ 14.820,00</strong></span>
                      <span className="text-emerald-400 font-bold">251 pedidos expedidos</span>
                    </div>
                  </div>
                </div>

                {/* Card de Eficiência Operacional */}
                <div className="glass-panel-elevated p-5 rounded-3xl border border-white/10 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Eficiência Operacional
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">SLA de atendimento e tempo de resposta da equipe</p>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {/* Métrica 1: Cozinha */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-orange-400" /> Entrega Cozinha
                        </span>
                        <span className="font-mono-numbers font-black text-emerald-400 text-sm">14 min</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '82%' }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Meta: &lt; 20 min (82% de pontualidade)</p>
                    </div>

                    {/* Métrica 2: Garçom */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          <Timer className="w-3.5 h-3.5 text-purple-400" /> Resposta Garçom
                        </span>
                        <span className="font-mono-numbers font-black text-purple-300 text-sm">3.2 min</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Chamados via NFC atendidos com agilidade</p>
                    </div>

                    {/* Métrica 3: Pix na Mesa */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" /> Adesão Pix na Mesa
                        </span>
                        <span className="font-mono-numbers font-black text-emerald-300 text-sm">78%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '78%' }} />
                      </div>
                      <p className="text-[10px] text-emerald-400 mt-1">+14% vs média de mercado (sem maquininha)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Rápido do Salão & Divisão de Pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel-elevated p-5 rounded-3xl border border-white/10 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-400" /> Canais de Pagamento
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Distribuição do volume liquidado</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Pix Instantâneo
                        </span>
                        <span className="font-mono-numbers font-bold text-white">
                          R$ {pixRevenue.toFixed(2)} ({totalRevenueTurn > 0 ? Math.round((pixRevenue / totalRevenueTurn) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${totalRevenueTurn > 0 ? (pixRevenue / totalRevenueTurn) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-purple-400 flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />  Pay / Cartão
                        </span>
                        <span className="font-mono-numbers font-bold text-white">
                          R$ {cardRevenue.toFixed(2)} ({totalRevenueTurn > 0 ? Math.round((cardRevenue / totalRevenueTurn) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${totalRevenueTurn > 0 ? (cardRevenue / totalRevenueTurn) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300">
                    💡 <strong>Insight:</strong> 64% dos clientes optam por Pix na mesa, reduzindo custos operacionais.
                  </div>
                </div>

                <div className="glass-panel-elevated p-5 rounded-3xl border border-white/10 md:col-span-2 flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" /> Mapa Rápido do Salão
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Visão condensada de mesas ativas</p>
                    </div>
                    <button
                      onClick={() => setAdminTab('mesas')}
                      className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                    >
                      Ver todas as mesas <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {tables.map((t) => (
                      <div
                        key={t.number}
                        onClick={() => {
                          setSelectedCashierTable(t)
                          setAdminModal('detalhes')
                        }}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                          t.status === 'em_fechamento'
                            ? 'bg-[#091715] border-emerald-500/60 glow-emerald'
                            : t.status === 'paga'
                            ? 'bg-[#160D20] border-purple-500/50'
                            : t.status === 'ocupada'
                            ? 'bg-[#14120A] border-amber-500/40'
                            : 'bg-black/30 border-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-white">Mesa {t.number}</span>
                          <span className="text-[9px] font-bold text-slate-400">{t.zone}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{t.name}</p>
                        <p className="text-xs font-mono-numbers font-black text-white mt-1">
                          {t.status === 'livre' ? 'Livre' : `R$ ${t.totalOriginal.toFixed(2)}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: KDS COZINHA & BAR ================= */}
          {adminTab === 'kds' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" /> KDS — Painel de Produção da Cozinha & Bar
                  </h2>
                  <p className="text-xs text-slate-400">
                    Pedidos disparados diretamente pelo cliente na mesa caem nas praças de produção sem papel
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {kitchenOrders.some((k) => k.status !== 'entregue' && k.timeElapsedMinutes > 15) && (
                    <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-black border border-red-500/40 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> SLA Crítico Ativo (&gt;15 min)
                    </span>
                  )}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                    {kitchenOrders.filter((k) => k.status !== 'entregue').length} Pedidos na Fila
                  </span>
                </div>
              </div>

              {/* Filtro por Praça de Produção */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {[
                  { id: 'todas', label: 'Todas as Praças', count: kitchenOrders.filter((k) => k.status !== 'entregue').length },
                  {
                    id: 'cozinha_quente',
                    label: '🔥 Cozinha Quente',
                    count: kitchenOrders.filter((k) => k.status !== 'entregue' && k.items.some((it) => it.category === 'comida' || it.category === 'sobremesa')).length,
                  },
                  {
                    id: 'bar_coqueteis',
                    label: '🍸 Bar de Coquetéis',
                    count: kitchenOrders.filter((k) => k.status !== 'entregue' && k.items.some((it) => it.name.includes('Mule') || it.name.includes('Gin') || it.name.includes('Negroni'))).length,
                  },
                  {
                    id: 'copa_chopp',
                    label: '🍺 Copa de Chopp',
                    count: kitchenOrders.filter((k) => k.status !== 'entregue' && k.items.some((it) => it.name.includes('Chopp') || it.name.includes('Cerveja'))).length,
                  },
                ].map((station) => (
                  <button
                    key={station.id}
                    onClick={() => {
                      triggerHaptic(10)
                      setKdsStationFilter(station.id as typeof kdsStationFilter)
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      kdsStationFilter === station.id
                        ? 'bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{station.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-numbers ${
                        kdsStationFilter === station.id ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {station.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Grid de Pedidos no KDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {kitchenOrders
                  .filter((order) => {
                    if (kdsStationFilter === 'todas') return true
                    if (kdsStationFilter === 'cozinha_quente') {
                      return order.items.some((it) => it.category === 'comida' || it.category === 'sobremesa')
                    }
                    if (kdsStationFilter === 'bar_coqueteis') {
                      return order.items.some((it) => it.name.includes('Mule') || it.name.includes('Gin') || it.name.includes('Negroni'))
                    }
                    if (kdsStationFilter === 'copa_chopp') {
                      return order.items.some((it) => it.name.includes('Chopp') || it.name.includes('Cerveja'))
                    }
                    return true
                  })
                  .map((order) => {
                    const isCriticalSla = order.timeElapsedMinutes > 15 && order.status !== 'entregue'

                    return (
                      <div
                        key={order.id}
                        className={`glass-panel-elevated p-4 rounded-3xl border flex flex-col justify-between gap-3 relative transition-all active:scale-[0.99] hover:border-white/20 ${
                          isCriticalSla
                            ? 'border-red-500/80 bg-[#160A0A] glow-amber'
                            : order.status === 'pronto'
                            ? 'border-emerald-500/60 bg-[#091715] glow-emerald'
                            : order.status === 'em_preparo'
                            ? 'border-orange-500/60 bg-[#141008]'
                            : 'border-white/10 bg-[#0D111A]'
                        }`}
                      >
                        {/* Alerta Visual de SLA Crítico (>15 min com badge pulsante) */}
                        {isCriticalSla && (
                          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg shadow-red-600/40 animate-pulse z-10 border border-red-400">
                            <AlertTriangle className="w-3 h-3" /> SLA CRÍTICO: {order.timeElapsedMinutes} MIN
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono-numbers font-black text-white px-2 py-0.5 rounded-md bg-white/10">
                              {order.id}
                            </span>
                            <span
                              className={`text-xs font-bold flex items-center gap-1 font-mono-numbers ${
                                isCriticalSla ? 'text-red-400 font-black animate-pulse' : 'text-slate-400'
                              }`}
                            >
                              <Clock className={`w-3 h-3 ${isCriticalSla ? 'text-red-400' : 'text-amber-400'}`} />
                              {order.requestedAt} ({order.timeElapsedMinutes} min)
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-base font-black text-white">Mesa {order.tableNumber}</span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                order.status === 'pronto'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : order.status === 'em_preparo'
                                  ? 'bg-orange-500/20 text-orange-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {order.status === 'pronto' ? 'Pronto para Servir' : order.status === 'em_preparo' ? 'Em Preparo' : 'Pendente'}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5 border-t border-white/5 pt-2">
                            {order.items.map((it) => (
                              <div key={it.id} className="text-xs font-bold text-slate-200 flex items-center justify-between">
                                <span>{it.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                                  {it.orderedBy}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playSound('tap')
                            handleAdvanceKdsOrder(order.id)
                          }}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                            isCriticalSla
                              ? 'bg-red-500 hover:bg-red-400 text-white font-black shadow-lg shadow-red-500/30'
                              : order.status === 'pronto'
                              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/25'
                              : order.status === 'em_preparo'
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/25'
                              : 'bg-orange-500 hover:bg-orange-400 text-slate-950 font-black shadow-md shadow-orange-500/25'
                          }`}
                        >
                          <CheckCheck className="w-4 h-4" />
                          {order.status === 'pendente'
                            ? 'Iniciar Preparo'
                            : order.status === 'em_preparo'
                            ? 'Marcar como Pronto'
                            : 'Confirmar Entrega na Mesa'}
                        </button>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: ESTOQUE & CMV HD (COM CADASTRO E AJUSTES) ================= */}
          {adminTab === 'estoque' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-400" /> Controle de Estoque & Ficha Técnica HD
                  </h2>
                  <p className="text-xs text-slate-400">
                    Baixa automática em tempo real, margem de contribuição bruta e ajuste rápido de saldo
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic(15)
                      playSound('tap')
                      setAdminModal('novo_produto')
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Adicionar Produto / Insumo
                  </button>
                </div>
              </div>

              {/* Filtro por Categoria de Estoque */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-black/40 p-1.5 rounded-2xl border border-white/5 text-xs">
                {[
                  { id: 'todos', label: `Todos (${catalog.length})` },
                  { id: 'bebida', label: `Bebidas & Chopp (${catalog.filter((c) => c.category === 'bebida').length})` },
                  { id: 'comida', label: `Comidas & Petiscos (${catalog.filter((c) => c.category === 'comida').length})` },
                  { id: 'sobremesa', label: `Sobremesas (${catalog.filter((c) => c.category === 'sobremesa').length})` },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      triggerHaptic(10)
                      setStockCategoryFilter(cat.id as any)
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      stockCategoryFilter === cat.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Cards de Estoque HD com Ajuste Inline e Margem Real */}
              <div className="glass-panel-elevated rounded-3xl p-5 border border-white/10 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {catalog
                    .filter((prod) => stockCategoryFilter === 'todos' || prod.category === stockCategoryFilter)
                    .map((prod) => {
                      const unitProfit = prod.price - prod.cost
                      const isLowStock = prod.stock <= prod.minStock

                      return (
                        <div
                          key={prod.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 backdrop-blur-md ${
                            isLowStock
                              ? theme === 'light'
                                ? 'bg-amber-50/90 border-amber-300 shadow-sm'
                                : 'bg-[#18110D] border-amber-500/50 glow-amber'
                              : theme === 'light'
                              ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                              : 'bg-[#090D15]/90 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className={`text-xs font-bold ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>{prod.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-md capitalize font-medium ${
                                  theme === 'light' ? 'text-slate-600 bg-slate-100 border border-slate-200' : 'text-slate-400 bg-white/5'
                                }`}>
                                  {prod.category}
                                </span>
                                {isLowStock && (
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                                    theme === 'light' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  }`}>
                                    ⚠️ Reposição Urgente
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs font-mono-numbers font-black shrink-0 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                              R$ {prod.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Painel de Métricas Financeiras Unitárias */}
                          <div className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                            theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-white/5'
                          }`}>
                            <div>
                              <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>Custo (CMV)</p>
                              <p className={`font-mono-numbers font-bold ${theme === 'light' ? 'text-slate-700 font-extrabold' : 'text-slate-300'}`}>
                                R$ {prod.cost.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>Lucro Unitário</p>
                              <p className={`font-mono-numbers font-black ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                                + R$ {unitProfit.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>Margem</p>
                              <p className={`font-mono-numbers font-bold ${theme === 'light' ? 'text-emerald-700 font-black' : 'text-emerald-300'}`}>
                                {prod.marginPercent}%
                              </p>
                            </div>
                          </div>

                          {/* Controles de Estoque Físico com Ajuste Rápido */}
                          <div className={`flex items-center justify-between pt-1 border-t text-xs ${
                            theme === 'light' ? 'border-slate-200' : 'border-white/5'
                          }`}>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Estoque:</span>
                              <span className={`font-mono-numbers font-black text-sm ${
                                isLowStock
                                  ? theme === 'light' ? 'text-amber-700' : 'text-amber-400'
                                  : theme === 'light' ? 'text-slate-900' : 'text-white'
                              }`}>
                                {prod.stock} un
                              </span>
                              <span className={`text-[10px] font-mono-numbers ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                                (mín: {prod.minStock})
                              </span>
                            </div>

                            {/* Botões de Ajuste Rápido (+ / -) */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickStockAdjust(prod.id, -1)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border active:scale-90 transition-all ${
                                  theme === 'light'
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/5'
                                }`}
                                title="Reduzir 1 unidade (baixa/quebra)"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleQuickStockAdjust(prod.id, 1)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border active:scale-90 transition-all ${
                                  theme === 'light'
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/5'
                                }`}
                                title="Adicionar 1 unidade"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleQuickStockAdjust(prod.id, 10)}
                                className={`px-2 h-7 rounded-lg font-mono-numbers font-bold text-[10px] border active:scale-95 transition-all ${
                                  theme === 'light'
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'
                                }`}
                                title="Entrada rápida de engradado (+10 un)"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: GESTÃO DE MESAS ================= */}
          {adminTab === 'mesas' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">Controle de Mesas do Salão</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono-numbers border border-purple-500/30">
                    {tables.length} Mesas Cadastradas
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Buscar mesa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#0D131F] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => setAdminModal('nova_mesa')}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
                  >
                    <Plus className="w-4 h-4" /> Cadastrar Mesa
                  </button>
                </div>
              </div>

              {/* Filtro por Zonas */}
              <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 p-1.5 rounded-2xl border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'
              }`}>
                {[
                  { id: 'todas', label: `Todas (${tables.length})` },
                  { id: 'Deck Rooftop', label: `Deck Rooftop (${tables.filter((t) => t.zone === 'Deck Rooftop' || t.zone === 'Deck').length})` },
                  { id: 'Salão Nobre', label: `Salão Nobre (${tables.filter((t) => t.zone === 'Salão Nobre' || t.zone === 'Salão Principal').length})` },
                  { id: 'Bar Balcão', label: `Bar Balcão (${tables.filter((t) => t.zone === 'Bar Balcão').length})` },
                  { id: 'Lounge VIP', label: `Lounge VIP (${tables.filter((t) => t.zone === 'Lounge VIP' || t.zone === 'Lounge').length})` },
                ].map((z) => (
                  <button
                    key={z.id}
                    onClick={() => {
                      triggerHaptic(10)
                      setTableZoneFilter(z.id)
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      tableZoneFilter === z.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : theme === 'light'
                        ? 'text-slate-700 hover:text-slate-950 hover:bg-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>

              {/* Grid Completo de Mesas com Heatmap Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {tables
                  .filter((t) => {
                    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.number.toString().includes(searchQuery)
                    if (!matchesSearch) return false
                    if (tableZoneFilter === 'todas') return true
                    if (tableZoneFilter === 'Deck Rooftop') return t.zone === 'Deck Rooftop' || t.zone === 'Deck'
                    if (tableZoneFilter === 'Salão Nobre') return t.zone === 'Salão Nobre' || t.zone === 'Salão Principal'
                    if (tableZoneFilter === 'Bar Balcão') return t.zone === 'Bar Balcão'
                    if (tableZoneFilter === 'Lounge VIP') return t.zone === 'Lounge VIP' || t.zone === 'Lounge'
                    return true
                  })
                  .map((table) => {
                    const pendente = table.items.filter((i) => !i.paidBy).reduce((a, c) => a + c.price, 0)
                    const isLongOccupancy = table.occupancyMinutes > 80 && table.status !== 'livre' && table.status !== 'paga'
                    const isMediumOccupancy = table.occupancyMinutes >= 40 && table.occupancyMinutes <= 75

                    return (
                      <div
                        key={table.number}
                        className={`glass-panel-elevated p-4 rounded-2xl border flex flex-col justify-between gap-3 relative transition-all active:scale-[0.99] hover:border-white/20 ${
                          theme === 'light'
                            ? isLongOccupancy
                              ? 'border-red-300 bg-red-50/60 shadow-sm'
                              : isMediumOccupancy
                              ? 'border-amber-300 bg-amber-50/60 shadow-sm'
                              : table.status === 'em_fechamento'
                              ? 'border-emerald-300 bg-emerald-50/60 shadow-sm'
                              : table.status === 'paga'
                              ? 'border-purple-300 bg-purple-50/60 shadow-sm'
                              : 'border-slate-200 bg-white shadow-sm'
                            : isLongOccupancy
                            ? 'border-red-500/60 bg-[#160B0B] glow-amber'
                            : isMediumOccupancy
                            ? 'border-amber-500/40 bg-[#141008]'
                            : table.status === 'em_fechamento'
                            ? 'border-emerald-500/50 bg-[#091715] glow-emerald'
                            : table.status === 'paga'
                            ? 'border-purple-500/50 bg-[#160D20]'
                            : 'border-white/10 bg-[#0B0F17]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-extrabold text-base font-mono-numbers ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>
                                Mesa {table.number}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                theme === 'light' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-white/5 text-slate-300'
                              }`}>
                                {table.zone}
                              </span>
                            </div>
                            <p className={`text-xs mt-0.5 font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>{table.name}</p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                table.status === 'em_fechamento'
                                  ? theme === 'light'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : table.status === 'paga'
                                  ? theme === 'light'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : table.status === 'ocupada'
                                  ? theme === 'light'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : theme === 'light'
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {table.status}
                            </span>
                            {/* Heatmap Visual de Permanência */}
                            {table.status !== 'livre' && (
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 font-mono-numbers ${
                                  table.occupancyMinutes > 80
                                    ? theme === 'light'
                                      ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                                      : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                                    : table.occupancyMinutes >= 40
                                    ? theme === 'light'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : theme === 'light'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                <Timer className="w-2.5 h-2.5" />
                                {table.occupancyMinutes}m {table.occupancyMinutes > 80 ? '⚠️ Alerta Ociosidade' : table.occupancyMinutes >= 40 ? 'Âmbar' : 'Verde'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
                        }`}>
                          <div>
                            <p className={`text-[10px] ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>Garçom: {table.waiterName}</p>
                            <p className={`text-[10px] font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>Pago: R$ {table.totalPaid.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-[10px] uppercase font-bold ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Pendente</p>
                            <p className={`font-mono-numbers font-black text-sm ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>
                              R$ {pendente.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => {
                              playSound('tap')
                              setSelectedCashierTable(table)
                              setAdminModal('detalhes')
                            }}
                            className={`text-xs py-2 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all active:scale-95 border ${
                              theme === 'light'
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                            }`}
                          >
                            <FileText className={`w-3 h-3 ${theme === 'light' ? 'text-sky-700' : 'text-cyan-400'}`} /> Ver Conta
                          </button>

                          {table.status === 'paga' ? (
                            <button
                              onClick={() => {
                                playSound('tap')
                                handleReleaseTable(table.number)
                              }}
                              className="text-xs py-2 px-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1 transition-all shadow-md shadow-purple-600/30 active:scale-95"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Liberar Mesa
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                playSound('tap')
                                setSelectedCashierTable(table)
                                setAdminModal('fechar_manual')
                              }}
                              className={`text-xs py-2 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                                theme === 'light'
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              <DollarSign className="w-3 h-3" /> Cobrar Caixa
                            </button>
                          )}
                        </div>

                        {table.status !== 'livre' && (
                          <button
                            onClick={() => {
                              playSound('tap')
                              setSelectedCashierTable(table)
                              setAdminModal('trocar_mesa')
                            }}
                            className={`text-[11px] py-1 flex items-center justify-center gap-1 transition-all border-t pt-2 active:scale-95 ${
                              theme === 'light'
                                ? 'text-slate-600 hover:text-slate-900 border-slate-200 font-semibold'
                                : 'text-slate-400 hover:text-white border-white/5'
                            }`}
                          >
                            <ArrowRightLeft className={`w-3 h-3 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} /> Transferir / Juntar com outra mesa
                          </button>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: FINANCEIRO & PAGAMENTOS ================= */}
          {adminTab === 'financeiro' && (
            <div className="flex flex-col gap-4">
              {/* Painel Executivo do DRE em Tempo Real */}
              <div className="glass-panel-elevated p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/30">
                      Live Financial Engine
                    </span>
                    <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" /> DRE em Tempo Real (Demonstrativo do Turno)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Cálculo instantâneo de faturamento líquido, deduções automáticas de adquirentes e CMV estimado dos pedidos
                    </p>
                  </div>

                  {/* Indicador de Emissão Fiscal NFC-e SEFAZ */}
                  <div className={`flex items-center gap-3 p-2.5 rounded-2xl border ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-black/50 border-white/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                      <div className="text-left">
                        <p className={`text-[11px] font-bold flex items-center gap-1 ${theme === 'light' ? 'text-slate-900 font-extrabold' : 'text-white'}`}>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SEFAZ NFC-e
                        </p>
                        <p className={`text-[9px] font-semibold font-mono-numbers ${theme === 'light' ? 'text-emerald-700 font-bold' : 'text-emerald-400'}`}>100% Sincronizado</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyShiftReport}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Copiar fechamento
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic(20)
                        setConflictToast({
                          title: '📦 Lote Fiscal XML / SPED Baixado',
                          desc: 'Arquivo com 42 notas fiscais eletrônicas gerado e assinado com certificado digital A1 para a contabilidade.',
                          type: 'emerald',
                        })
                        setTimeout(() => setConflictToast(null), 4000)
                      }}
                      className={`px-2.5 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                        theme === 'light'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar XML / SPED
                    </button>
                  </div>
                </div>

                {/* Grid do DRE com (+) (-) (=) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
                  {/* (+) Faturamento Bruto */}
                  <div className={`p-4 rounded-2xl border relative ${
                    theme === 'light'
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                      : 'bg-[#081119] border-emerald-500/30'
                  }`}>
                    <span className={`text-[10px] font-mono-numbers font-bold uppercase tracking-wider block mb-1 ${
                      theme === 'light' ? 'text-emerald-800' : 'text-emerald-400'
                    }`}>
                      (+) Faturamento Bruto
                    </span>
                    <p className={`text-2xl font-black font-mono-numbers ${
                      theme === 'light' ? 'text-slate-900 font-black' : 'text-white'
                    }`}>
                      R$ 14.820,00
                    </p>
                    <p className={`text-[10px] mt-1 ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>251 pedidos quitados no turno</p>
                  </div>

                  {/* (-) Taxas Meios de Pagamento */}
                  <div className={`p-4 rounded-2xl border relative ${
                    theme === 'light'
                      ? 'bg-purple-50/70 border-purple-200 shadow-sm'
                      : 'bg-[#140D1C] border-purple-500/30'
                  }`}>
                    <span className={`text-[10px] font-mono-numbers font-bold uppercase tracking-wider block mb-1 ${
                      theme === 'light' ? 'text-purple-800' : 'text-purple-300'
                    }`}>
                      (-) Taxas Meios de Pagamento
                    </span>
                    <p className={`text-2xl font-black font-mono-numbers ${
                      theme === 'light' ? 'text-purple-700' : 'text-purple-300'
                    }`}>
                      - R$ 142,50
                    </p>
                    <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${
                      theme === 'light' ? 'text-amber-800' : 'text-amber-300'
                    }`}>
                      <Zap className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} /> Economia de R$ 370 no Pix vs Cartão
                    </p>
                  </div>

                  {/* (-) CMV Estimado dos Insumos */}
                  <div className={`p-4 rounded-2xl border relative ${
                    theme === 'light'
                      ? 'bg-rose-50/70 border-rose-200 shadow-sm'
                      : 'bg-[#150D0D] border-red-500/30'
                  }`}>
                    <span className={`text-[10px] font-mono-numbers font-bold uppercase tracking-wider block mb-1 ${
                      theme === 'light' ? 'text-rose-800' : 'text-red-300'
                    }`}>
                      (-) CMV Estimado dos Insumos
                    </span>
                    <p className={`text-2xl font-black font-mono-numbers ${
                      theme === 'light' ? 'text-rose-700' : 'text-red-300'
                    }`}>
                      - R$ 4.297,80
                    </p>
                    <p className={`text-[10px] mt-1 ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>29.0% do faturamento (Ficha técnica)</p>
                  </div>

                  {/* (=) Lucro Operacional Líquido */}
                  <div className={`p-4 rounded-2xl border relative shadow-lg ${
                    theme === 'light'
                      ? 'bg-emerald-100/80 border-emerald-400 shadow-emerald-500/10'
                      : 'bg-[#061510] border-emerald-400/50 shadow-emerald-500/10 glow-emerald'
                  }`}>
                    <span className={`text-[10px] font-mono-numbers font-bold uppercase tracking-wider block mb-1 ${
                      theme === 'light' ? 'text-emerald-900 font-black' : 'text-emerald-300'
                    }`}>
                      (=) Lucro Operacional Líquido
                    </span>
                    <p className={`text-2xl font-black font-mono-numbers ${
                      theme === 'light' ? 'text-emerald-800 font-black' : 'text-emerald-400'
                    }`}>
                      R$ 10.379,70
                    </p>
                    <p className={`text-[10px] font-bold mt-1 ${
                      theme === 'light' ? 'text-emerald-900 font-extrabold' : 'text-emerald-300'
                    }`}>
                      Margem 70.0% do Dia
                    </p>
                  </div>
                </div>
              </div>

              {/* Título do Histórico Fiscal & Transações */}
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h3 className="text-sm font-black text-white">Transações e Auditoria Fiscal SEFAZ</h3>
                  <p className="text-xs text-slate-400">Comprovantes auditados pelo Banco Central e notas fiscais emitidas</p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(15)
                    setConflictToast({
                      title: '📄 Relatório Fiscal Consolidado Exportado',
                      desc: 'O arquivo fiscal consolidado em XML/PDF foi gerado para sua contabilidade.',
                      type: 'cyan',
                    })
                    setTimeout(() => setConflictToast(null), 3500)
                  }}
                  className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Exportar Balancete
                </button>
              </div>

              <div className="glass-panel-elevated rounded-3xl p-5 border border-white/10 flex flex-col gap-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-[#090D15] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          tx.status === 'estornado'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : tx.method === 'pix'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}
                      >
                        {tx.method === 'pix' ? 'PIX' : tx.method === 'apple_pay' ? 'PAY' : 'CARD'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{tx.clientName}</span>
                          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                            Mesa {tx.tableNumber}
                          </span>
                          <span className="text-[10px] font-mono-numbers text-slate-500">{tx.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          ID: {tx.id} • Gorjeta: R$ {tx.tipAmount.toFixed(2)} • {tx.itemsCount} itens quitados
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="text-right">
                        <p
                          className={`text-sm font-mono-numbers font-black ${
                            tx.status === 'estornado' ? 'line-through text-slate-500' : 'text-emerald-400'
                          }`}
                        >
                          R$ {tx.amount.toFixed(2)}
                        </p>
                        <span
                          className={`text-[10px] font-bold ${
                            tx.status === 'estornado' ? 'text-red-400' : 'text-slate-400'
                          }`}
                        >
                          {tx.status === 'estornado' ? 'ESTORNADO BACEN' : 'NFC-e EMITIDA'}
                        </span>
                      </div>

                      {tx.status === 'aprovado' && (
                        <button
                          onClick={() => handleRefundTransaction(tx.id)}
                          className="text-[11px] px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-semibold transition-all flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Estornar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: GARÇONS ================= */}
          {adminTab === 'garcons' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" /> Equipe de Garçons & Gorjetas 10%
                  </h2>
                  <p className="text-xs text-slate-400">Desempenho individual, pódio de avaliações e simulador de rateio da regra da casa</p>
                </div>
                <button
                  onClick={() => setAdminModal('novo_garcom')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
                >
                  <Plus className="w-4 h-4" /> Novo Garçom
                </button>
              </div>

              {/* Central de Chamados Inteligentes ao Vivo (Smart Service Call - Seul Tech) */}
              <div className="glass-panel-elevated p-4 rounded-3xl border border-cyan-500/30 glow-cyan flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-cyan-400" /> Chamados de Mesa com Propósito Definido (Seul Tech)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {smartWaiterCalls.filter((c) => c.status === 'pendente').length} Pendentes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {smartWaiterCalls.map((call) => (
                    <div
                      key={call.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        call.status === 'pendente'
                          ? theme === 'light'
                            ? 'bg-sky-50 border-sky-300 shadow-sm'
                            : 'bg-[#0b1522] border-cyan-500/40 glow-cyan'
                          : theme === 'light'
                          ? 'bg-slate-50 border-slate-200 opacity-70'
                          : 'bg-white/5 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{call.reasonIcon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-black ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>Mesa {call.tableNumber}</span>
                            <span className={`text-[9px] font-mono-numbers ${theme === 'light' ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>às {call.requestedAt || call.timestamp}</span>
                          </div>
                          <p className={`text-xs font-bold ${theme === 'light' ? 'text-sky-800 font-bold' : 'text-cyan-300'}`}>{call.reasonLabel}</p>
                        </div>
                      </div>

                      {call.status === 'pendente' ? (
                        <button
                          onClick={() => handleResolveSmartCall(call.id)}
                          className={`font-black text-[11px] px-3 py-1.5 rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-1 ${
                            theme === 'light'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Atender
                        </button>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                          theme === 'light' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'text-emerald-400 bg-emerald-500/10'
                        }`}>
                          ✓ Atendido
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulador Visual de Rateio da Regra da Casa 10% */}
              <div className="glass-panel-elevated p-5 rounded-3xl border border-white/10 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      theme === 'light' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}>
                      Convenção Coletiva de Gorjeta
                    </span>
                    <h3 className={`text-sm font-black mt-1 flex items-center gap-2 ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>
                      <Wine className="w-4 h-4 text-purple-500" /> Simulador de Rateio da Regra da Casa (10% de Serviço)
                    </h3>
                    <p className={`text-xs ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      Total arrecadado no turno: <strong className={`font-mono-numbers ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>R$ 1.482,00</strong>. Divisão transparente auditada em blockchain/log imutável.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono-numbers font-black px-3 py-1.5 rounded-xl border ${
                      theme === 'light' ? 'bg-purple-100 text-purple-900 border-purple-200' : 'text-purple-300 bg-purple-500/10 border-purple-500/20'
                    }`}>
                      Total: R$ 1.482,00
                    </span>
                  </div>
                </div>

                {/* Barra de distribuição proporcional */}
                <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                    style={{ width: '70%' }}
                    title="Salão (70%)"
                  >
                    Salão 70%
                  </div>
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                    style={{ width: '20%' }}
                    title="Cozinha & Bar (20%)"
                  >
                    Cozinha 20%
                  </div>
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full flex items-center justify-center text-[9px] font-black text-slate-950"
                    style={{ width: '10%' }}
                    title="Cumins & Apoio (10%)"
                  >
                    Apoio 10%
                  </div>
                </div>

                {/* Cards de cada fatia do rateio */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 ${
                    theme === 'light'
                      ? 'bg-purple-50/80 border-purple-200 shadow-sm'
                      : 'bg-[#120E1E] border-purple-500/20'
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold flex items-center gap-1.5 ${theme === 'light' ? 'text-purple-900' : 'text-purple-300'}`}>
                        <User className="w-3.5 h-3.5 text-purple-500" /> Salão & Atendimento
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono-numbers ${theme === 'light' ? 'bg-purple-200 text-purple-900' : 'bg-purple-500/20 text-purple-300'}`}>
                        70%
                      </span>
                    </div>
                    <p className={`text-xl font-mono-numbers font-black ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>
                      R$ 1.037,40
                    </p>
                    <p className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      R$ 345,80 / garçom ativo (3 profissionais no turno)
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 ${
                    theme === 'light'
                      ? 'bg-emerald-50/80 border-emerald-200 shadow-sm'
                      : 'bg-[#081512] border-emerald-500/20'
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold flex items-center gap-1.5 ${theme === 'light' ? 'text-emerald-900' : 'text-emerald-300'}`}>
                        <Flame className="w-3.5 h-3.5 text-emerald-500" /> Cozinha & Bar
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono-numbers ${theme === 'light' ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        20%
                      </span>
                    </div>
                    <p className={`text-xl font-mono-numbers font-black ${theme === 'light' ? 'text-emerald-800 font-black' : 'text-emerald-400'}`}>
                      R$ 296,40
                    </p>
                    <p className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      Distribuído entre chefs, cozinheiros e bartenders
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 ${
                    theme === 'light'
                      ? 'bg-amber-50/80 border-amber-200 shadow-sm'
                      : 'bg-[#151108] border-amber-500/20'
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold flex items-center gap-1.5 ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'}`}>
                        <Users className="w-3.5 h-3.5 text-amber-500" /> Cumins & Apoio
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono-numbers ${theme === 'light' ? 'bg-amber-200 text-amber-900' : 'bg-amber-500/20 text-amber-300'}`}>
                        10%
                      </span>
                    </div>
                    <p className={`text-xl font-mono-numbers font-black ${theme === 'light' ? 'text-amber-800 font-black' : 'text-amber-300'}`}>
                      R$ 148,20
                    </p>
                    <p className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      Equipe de limpeza, louça e retaguarda operacional
                    </p>
                  </div>
                </div>
              </div>

              {/* Pódio dos 3 Garçons Mais Bem Avaliados do Turno */}
              <div className="glass-panel-elevated p-5 rounded-3xl border border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-black flex items-center gap-2 ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>
                      <Trophy className="w-4 h-4 text-amber-500" /> Pódio de Avaliação do Turno (NPS dos Clientes)
                    </h3>
                    <p className={`text-xs mt-0.5 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Baseado em 142 avaliações 5 estrelas submetidas via celular</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    theme === 'light' ? 'text-amber-900 bg-amber-100 border-amber-200' : 'text-amber-300 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    <Award className="w-3.5 h-3.5" /> Ranking ao Vivo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                  {/* 1º Lugar - Bruno Reis */}
                  <div className={`p-4 rounded-2xl flex flex-col justify-between gap-3 relative shadow-lg order-1 sm:order-2 ${
                    theme === 'light'
                      ? 'bg-amber-50/90 border-2 border-amber-300 shadow-amber-500/10'
                      : 'bg-gradient-to-b from-[#1C1607] to-[#0A0D15] border-2 border-amber-500/60 shadow-amber-500/10 glow-amber'
                  }`}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow flex items-center gap-1">
                      🥇 1º LUGAR
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                        BR
                      </div>
                      <div>
                        <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>Bruno Reis</p>
                        <p className={`text-[11px] font-bold ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`}>Bar Balcão & Lounges</p>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                      theme === 'light' ? 'bg-white border-amber-200 shadow-sm' : 'bg-black/50 border-white/5'
                    }`}>
                      <div>
                        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>NPS Médio</p>
                        <p className={`font-mono-numbers font-black text-base ${theme === 'light' ? 'text-amber-700 font-black' : 'text-amber-300'}`}>⭐ 5.0 / 5.0</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Vendas</p>
                        <p className={`font-mono-numbers font-black text-xs ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>R$ 548,00</p>
                      </div>
                    </div>
                    <p className={`text-[10px] font-bold text-center py-0.5 rounded-md ${
                      theme === 'light' ? 'text-emerald-800 bg-emerald-100/80' : 'text-emerald-400'
                    }`}>
                      🏆 Destaque: 0 reclamações de espera no turno
                    </p>
                  </div>

                  {/* 2º Lugar - Carlos Mendonça */}
                  <div className={`p-4 rounded-2xl flex flex-col justify-between gap-3 relative order-2 sm:order-1 ${
                    theme === 'light'
                      ? 'bg-slate-50 border border-slate-300 shadow-sm'
                      : 'bg-gradient-to-b from-[#141824] to-[#0A0D15] border border-slate-400/40'
                  }`}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-300 text-slate-950 font-black text-xs rounded-full shadow flex items-center gap-1">
                      🥈 2º LUGAR
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                        CM
                      </div>
                      <div>
                        <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>Carlos Mendonça</p>
                        <p className={`text-[11px] font-bold ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>Deck Rooftop</p>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                      theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/50 border-white/5'
                    }`}>
                      <div>
                        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>NPS Médio</p>
                        <p className={`font-mono-numbers font-black text-base ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>⭐ 4.9 / 5.0</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Vendas</p>
                        <p className={`font-mono-numbers font-black text-xs ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>R$ 615,00</p>
                      </div>
                    </div>
                    <p className={`text-[10px] font-medium text-center ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                      Maior volume total de vendas da noite
                    </p>
                  </div>

                  {/* 3º Lugar - Amanda Lins */}
                  <div className={`p-4 rounded-2xl flex flex-col justify-between gap-3 relative order-3 ${
                    theme === 'light'
                      ? 'bg-orange-50/80 border border-orange-300 shadow-sm'
                      : 'bg-gradient-to-b from-[#191114] to-[#0A0D15] border border-amber-700/40'
                  }`}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-700 text-white font-black text-xs rounded-full shadow flex items-center gap-1">
                      🥉 3º LUGAR
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                        AL
                      </div>
                      <div>
                        <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>Amanda Lins</p>
                        <p className={`text-[11px] font-bold ${theme === 'light' ? 'text-orange-800' : 'text-amber-200/80'}`}>Salão Nobre</p>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                      theme === 'light' ? 'bg-white border-orange-200 shadow-sm' : 'bg-black/50 border-white/5'
                    }`}>
                      <div>
                        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>NPS Médio</p>
                        <p className={`font-mono-numbers font-black text-base ${theme === 'light' ? 'text-orange-700 font-black' : 'text-white'}`}>⭐ 4.8 / 5.0</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Vendas</p>
                        <p className={`font-mono-numbers font-black text-xs ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>R$ 380,00</p>
                      </div>
                    </div>
                    <p className={`text-[10px] font-medium text-center ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                      Maior velocidade de fechamento de conta
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabela / Grid Completo de Garçons */}
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h3 className={`text-sm font-black ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>Todos os Integrantes da Equipe</h3>
                  <p className={`text-xs ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Controle individual de mesas ativas e status no salão</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {waiters.map((w) => (
                  <div
                    key={w.id}
                    className={`glass-panel-elevated p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                      theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                        {w.avatar}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>{w.name}</p>
                        <p className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>{w.phone}</p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
                    }`}>
                      <div>
                        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Vendas Hoje</p>
                        <p className={`font-mono-numbers font-black text-sm ${theme === 'light' ? 'text-slate-900 font-black' : 'text-white'}`}>
                          R$ {w.totalSalesToday.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] font-bold ${theme === 'light' ? 'text-purple-700' : 'text-purple-300'}`}>Gorjeta Acumulada</p>
                        <p className={`font-mono-numbers font-black text-sm ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                          R$ {w.tipsAccumulated.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className={`flex justify-between items-center text-xs pt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      <span>Avaliação: ⭐ {w.rating.toFixed(1)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        theme === 'light' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: TAGS NFC ================= */}
          {adminTab === 'tags_nfc' && (
            <div className="flex flex-col gap-5">
              {/* Card de Gestão do Kit Comercial */}
              <div className="glass-panel-elevated p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/30">
                      Hardware Oficial TapTable
                    </span>
                    <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-400" /> Estúdio de Tags NFC & Gestor do Kit 15 Placas
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      <strong>Kit Base Ativo:</strong> 15 Placas em Acrílico Black Piano (Inclusas no Setup de R$ 497) | Placas Adicionais (+R$ 24,90/un)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 14 Placas Ativas no Salão (1 Reserva)
                    </span>
                    <button
                      onClick={() => {
                        triggerHaptic(20)
                        setConflictToast({
                          title: '📦 Pedido de Placas Adicionais Iniciado',
                          desc: 'Sua solicitação de 5 placas adicionais em Black Piano gravadas foi enviada para expedição.',
                          type: 'emerald',
                        })
                        setTimeout(() => setConflictToast(null), 3500)
                      }}
                      className="text-xs py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Solicitar Placas (+R$ 24,90/un)
                    </button>
                  </div>
                </div>

                {/* Mockup Visual Elegante da Placa de Acrílico Black Piano */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5 items-center">
                  <div className="lg:col-span-1 flex justify-center">
                    {/* Placa Física Black Piano com acabamento premium Apple HIG */}
                    <div className="w-64 h-80 rounded-[28px] bg-gradient-to-b from-[#11141D] via-[#07090E] to-[#020305] p-5 border border-white/20 shadow-2xl relative flex flex-col justify-between items-center overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      {/* Reflexo de acrílico chanfrado */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-t-[28px]" />
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Header da Placa: Logotipo TapTable */}
                      <div className="w-full flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-[11px] font-black tracking-wider text-white">TapTable</span>
                        </div>
                        <span className="text-[8px] font-mono tracking-widest text-emerald-400 font-bold uppercase bg-emerald-400/10 px-1.5 py-0.5 rounded">
                          NFC TOUCH
                        </span>
                      </div>

                      {/* Miolo da Placa: Número da Mesa & Chip NFC */}
                      <div className="flex flex-col items-center text-center my-auto z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-inner group-hover:border-emerald-500/40 transition-colors">
                          <QrCode className="w-9 h-9 text-white group-hover:text-emerald-300 transition-colors" />
                        </div>
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Mesa</span>
                        <span className="text-3xl font-black font-mono-numbers text-white tracking-tight">14</span>
                        <div className="mt-1 flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Zap className="w-2.5 h-2.5" /> Aproxime o Celular ou Aponte a Câmera
                        </div>
                      </div>

                      {/* Rodapé da Placa: Tecnologia NTAG213 */}
                      <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-slate-400 z-10 font-mono">
                        <span>Acrílico Black Piano 4mm</span>
                        <span className="text-slate-300 font-bold">NTAG213 Certified</span>
                      </div>
                    </div>
                  </div>

                  {/* Informações de Especificação Técnica do Kit */}
                  <div className="lg:col-span-2 flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-[#090D15] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Material & Acabamento</p>
                        <p className="text-sm font-black text-white mt-0.5">Acrílico Black Piano 4mm Corte a Laser</p>
                        <p className="text-[11px] text-slate-400 mt-1">À prova d'água, chopp e higienização com álcool 70%.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#090D15] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Microchip Integrado</p>
                        <p className="text-sm font-black text-emerald-400 mt-0.5">NXP NTAG213 Original (144 bytes)</p>
                        <p className="text-[11px] text-slate-400 mt-1">Leitura instantânea em menos de 0.2s no iPhone e Android.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#090D15] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Segurança Criptográfica</p>
                        <p className="text-sm font-black text-white mt-0.5">Token Criptografado Antifraude</p>
                        <p className="text-[11px] text-slate-400 mt-1">Impede que clientes façam pedidos de fora do estabelecimento.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#090D15] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">QR Code Backup</p>
                        <p className="text-sm font-black text-purple-300 mt-0.5">Vetor Gravado em Alta Definição</p>
                        <p className="text-[11px] text-slate-400 mt-1">100% de redundância para celulares sem sensor NFC nativo.</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                      <span>💡 <strong>Dica do Suporte:</strong> As 15 placas do kit chegam pré-configuradas e prontas para uso em 5 minutos.</span>
                      <span className="font-mono-numbers font-bold text-emerald-400 text-xs">Setup R$ 497 (Taxa Única)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid das Placas Cadastradas no Estabelecimento */}
              <div className="glass-panel-elevated rounded-3xl p-6 border border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-white">Configuração Individual das Tags das Mesas</h3>
                    <p className="text-xs text-slate-400">Tokens criptografados e links diretos para cada placa do salão</p>
                  </div>
                  <span className="text-xs font-mono-numbers text-slate-400 font-bold">
                    {tables.length} Placas Mapeadas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {tables.map((table) => (
                    <div
                      key={table.number}
                      className="p-4 rounded-2xl bg-[#090D15] border border-white/5 flex flex-col justify-between gap-3 hover:border-white/10 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs">Mesa {table.number}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({table.zone})</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono-numbers font-bold">
                          NFC ATIVO
                        </span>
                      </div>
                      <div className="p-2.5 bg-black/60 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400 break-all">
                        https://taptable.app/m/{table.number}?token=sec_{table.number * 42}x
                      </div>
                      <button
                        onClick={() => {
                          triggerHaptic(15)
                          setConflictToast({
                            title: '📲 Tag NFC Gravada',
                            desc: `Link copiado! Aproxime uma tag NFC NTAG213 para gravar os dados da Mesa ${table.number}.`,
                            type: 'emerald',
                          })
                          setTimeout(() => setConflictToast(null), 3500)
                        }}
                        className="text-xs py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-400" /> Gravar na Placa NFC
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= SUB-ABA: AVALIAÇÕES & NPS (GOOGLE MAPS BOOSTER) ================= */}
          {adminTab === 'avaliacoes' && (
            <div className="flex flex-col gap-5">
              <div className="glass-panel-elevated p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider border border-amber-500/30">
                      Reputação & Fidelidade
                    </span>
                    <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Avaliações e NPS no TapTable
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Feedback em tempo real coletado no momento do pagamento e enviado à gestão dentro do TapTable.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 flex items-center gap-1.5">
                      <ThumbsUp className="w-4 h-4 text-amber-400" /> NPS Score 96 (Excelente)
                    </span>
                  </div>
                </div>

                {/* Métricas de Satisfação */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
                  <div className="p-4 rounded-2xl bg-[#141208] border border-amber-500/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Nota Média Comida</p>
                    <p className="text-2xl font-black font-mono-numbers text-white mt-1 flex items-center gap-1.5">
                      4.9 <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Baseado em 148 avaliações deste mês</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#09151F] border border-cyan-500/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Nota Média Atendimento</p>
                    <p className="text-2xl font-black font-mono-numbers text-white mt-1 flex items-center gap-1.5">
                      4.8 <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Tempo de atendimento garçom: 3.2 min</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#061711] border border-emerald-500/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Avaliações recebidas no TapTable</p>
                    <p className="text-2xl font-black font-mono-numbers text-emerald-400 mt-1 flex items-center gap-1.5">
                      +42 <Share2 className="w-5 h-5 text-emerald-400" />
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Taxa de conversão de 74% pós-Pix</p>
                  </div>
                </div>
              </div>

              {/* Feed de Avaliações em Tempo Real */}
              <div className="glass-panel-elevated p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" /> Feed de Avaliações Recebidas ({ratings.length})
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Sincronizado via Websocket Live</span>
                </div>

                <div className="flex flex-col gap-3">
                  {ratings.map((rate) => (
                    <div
                      key={rate.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2.5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-xs text-slate-950">
                            {rate.clientName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-2">
                              {rate.clientName}
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-normal">
                                Mesa {rate.tableNumber}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-400">Garçom: {rate.waiterName} • às {rate.timestamp}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= Math.round((rate.foodRating + rate.serviceRating) / 2)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-mono-numbers font-black text-amber-300 ml-1">
                            {((rate.foodRating + rate.serviceRating) / 2).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {rate.comment && (
                        <p className="text-xs text-slate-200 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed italic">
                          "{rate.comment}"
                        </p>
                      )}

                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-slate-400">
                          Comida: ⭐ {rate.foodRating}/5 • Atendimento: ⭐ {rate.serviceRating}/5
                        </span>
                        {rate.sharedOnGoogle && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Feedback registrado no app
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
              </motion.div>
            </AnimatePresence>
        </main>
      </div>
    )}

      {/* ======================================================== */}
      {/* 📱 VISTA DA MESA (CLIENTE COM IA SOMMELIER & AUTOATENDIMENTO) */}
      {/* ======================================================== */}
      {currentPerspective === 'client' && (
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col gap-4 pb-36">
          {/* Hero da Mesa do Cliente com SpotlightCard */}
          <SpotlightCard
            spotlightColor="rgba(0, 245, 155, 0.16)"
            className="glass-panel-elevated rounded-3xl p-5 relative overflow-hidden shadow-2xl border border-white/10 hover:border-white/20 transition-all active:scale-[0.99]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Cliente na mesa</p>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    Lucas <span className="text-[10px] text-emerald-400 font-bold">● Conectado</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOneTapReorder}
                  title="Repetir a última rodada de bebidas com 1 toque"
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/40 font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Mais Uma!
                </button>

                <button
                  onClick={() => {
                    triggerHaptic(20)
                    playSound('tap')
                    setShowSmartCallModal(true)
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                    currentTable.requestedWaiter || smartWaiterCalls.some((c) => c.tableNumber === currentTable.number && c.status === 'pendente')
                      ? 'bg-amber-500/25 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/20 animate-pulse'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  {smartWaiterCalls.some((c) => c.tableNumber === currentTable.number && c.status === 'pendente')
                    ? 'Garçom a Caminho!'
                    : 'Chamar Garçom'}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Pendente na Mesa</p>
                <p className="text-3xl font-black text-white font-mono-numbers tracking-tight mt-0.5">
                  R$ {totalDebt.toFixed(2)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Já Quitado</p>
                <p className="text-sm font-bold text-emerald-400 font-mono-numbers mt-0.5">
                  R$ {totalPaid.toFixed(2)} ({progressPercent}%)
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-900/80 rounded-full h-2 p-0.5 border border-white/5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['LU', 'MA', 'PR', 'CD'].map((av, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white ring-2 ring-[#0D111A]"
                    >
                      {av}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">4 amigos na mesa</span>
              </div>

              <button
                onClick={() => {
                  playSound('tap')
                  setShowGiftModal(true)
                }}
                className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all glow-violet active:scale-95"
              >
                <Gift className="w-3.5 h-3.5 text-purple-400" /> Bancar Amigo
              </button>
            </div>
          </SpotlightCard>

          {/* Teste de Concorrência */}
          <div className="glass-panel rounded-2xl p-3 border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 transition-all">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-300 font-medium">
                Simule um amigo pagando o mesmo item simultaneamente:
              </p>
            </div>
            <button
              onClick={() => {
                playSound('tap')
                handleSimulateRaceCondition()
              }}
              className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95"
            >
              Simular Conflito
            </button>
          </div>

          {/* Abas do Cliente: Comanda vs Cardápio vs IA Sommelier vs Histórico */}
          <div className="flex items-center gap-1 bg-[#0D131F]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs no-scrollbar overflow-x-auto relative">
            {[
              { id: 'comanda', label: `Comanda (${unpaidItems.length})`, icon: null, iconClass: '' },
              { id: 'cardapio', label: 'Pedir', icon: Zap, iconClass: 'text-emerald-400' },
              { id: 'ia_sommelier', label: 'IA Sommelier', icon: Bot, iconClass: 'text-cyan-400' },
              { id: 'jukebox', label: 'Jukebox', icon: Music, iconClass: 'text-purple-400' },
              { id: 'historico', label: `Pagos (${currentTable.items.length - unpaidItems.length})`, icon: null, iconClass: '' },
            ].map((tab) => {
              const isActive = activeClientTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerHaptic()
                    playSound('tap')
                    setActiveClientTab(tab.id as any)
                  }}
                  className={`relative py-2 px-3.5 rounded-xl font-bold whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? tab.id === 'ia_sommelier'
                        ? 'text-cyan-300'
                        : tab.id === 'cardapio'
                        ? 'text-emerald-300'
                        : 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="client-active-tab"
                      className={`absolute inset-0 rounded-xl -z-10 border ${
                        tab.id === 'ia_sommelier'
                          ? 'bg-cyan-500/20 border-cyan-500/40 glow-cyan'
                          : tab.id === 'cardapio'
                          ? 'bg-emerald-500/20 border-emerald-500/30'
                          : 'bg-slate-800 border-white/10 shadow-sm'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {Icon && <Icon className={`w-3.5 h-3.5 ${tab.iconClass || ''}`} />}
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* CONTEÚDO DAS ABAS DO CLIENTE COM TRANSIÇÃO FLUIDA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClientTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3"
            >

          {/* ABA: IA SOMMELIER / CHEF VIRTUAL NA MESA */}
          {activeClientTab === 'ia_sommelier' && (
            <div className="glass-panel p-4 rounded-3xl border border-cyan-500/30 glow-cyan flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-xs font-black text-white">Sommelier & Chef Virtual IA</h3>
                  <p className="text-[10px] text-slate-400">Tire dúvidas de harmonização ou peça recomendações</p>
                </div>
              </div>

              {/* Histórico do Chat IA com Animação Suave */}
              <div className="max-h-56 overflow-y-auto no-scrollbar flex flex-col gap-2 pr-1">
                {aiChatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                      msg.sender === 'user'
                        ? 'bg-purple-600/30 border border-purple-500/40 text-purple-200 self-end rounded-br-none shadow-md shadow-purple-950/30'
                        : 'bg-black/60 border border-cyan-500/25 text-slate-200 self-start rounded-bl-none shadow-md shadow-cyan-950/30'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.recommendedItemId && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex justify-between items-center gap-2">
                        <span className="text-[10px] text-cyan-300 font-bold">✨ Sugestão Harmonizada</span>
                        <button
                          onClick={() => {
                            const p = catalog.find((c) => c.id === msg.recommendedItemId)
                            if (p) {
                              playSound('add')
                              handleClientSelfOrder(p)
                            }
                          }}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg active:scale-95 transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" /> Adicionar à Conta
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Input de Pergunta para a IA */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                <input
                  type="text"
                  placeholder="Ex: O que combina com cerveja IPA?"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiPrompt()}
                  className="flex-1 bg-[#090D15] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  onClick={handleSendAiPrompt}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2 rounded-xl transition-all font-bold active:scale-95 shadow-md shadow-cyan-500/25"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ABA: CARDÁPIO DE AUTOATENDIMENTO COM PERSONALIZAÇÃO (TOKYO TECH) */}
          {activeClientTab === 'cardapio' && (
            <section className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-1">
                <p className="text-xs text-slate-400 font-medium">
                  Toque para pedir ou personalizar:
                </p>
                <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  ⚡ Direto ao KDS
                </span>
              </div>

              {catalog.map((prod) => (
                <div
                  key={prod.id}
                  className="glass-panel p-3.5 rounded-2xl border border-white/10 hover:border-white/20 flex flex-col gap-2 transition-all active:scale-[0.99]"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-white">{prod.name}</p>
                      <span className="text-xs font-mono-numbers font-black text-emerald-400">
                        R$ {prod.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          playSound('tap')
                          setSelectedProductForOrder(prod)
                        }}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-[11px] px-2.5 py-1.5 rounded-xl transition-all border border-white/10 flex items-center gap-1 active:scale-95"
                        title="Personalizar (gelo, ponto, observações)"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-cyan-400" /> Detalhes
                      </button>

                      <button
                        onClick={() => {
                          playSound('add')
                          handleClientSelfOrder(prod)
                        }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> Pedir
                      </button>
                    </div>
                  </div>

                  {prod.pairingSuggestion && (
                    <p className="text-[10px] text-cyan-300 font-medium bg-cyan-950/20 px-2 py-1 rounded-lg border border-cyan-500/20">
                      💡 {prod.pairingSuggestion}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* ABA: JUKEBOX / PLAYLIST DO BAR (LONDON TECH) */}
          {activeClientTab === 'jukebox' && (
            <section className="flex flex-col gap-3">
              <div className="glass-panel p-4 rounded-3xl border border-purple-500/30 glow-violet flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-xs font-black text-white">Jukebox Interativa do Lounge</h3>
                      <p className="text-[10px] text-slate-400">Vote na próxima música que vai tocar no salão</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    🎵 Live Playlist
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {jukeboxTracks
                    .slice()
                    .sort((a, b) => b.votes - a.votes)
                    .map((track, idx) => (
                      <div
                        key={track.id}
                        className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`text-xs font-black font-mono-numbers w-5 text-center ${idx === 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">{track.title}</p>
                            <p className="text-[11px] text-slate-400">{track.artist}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleVoteTrack(track.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                            track.votedByMe
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                              : 'bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="font-mono-numbers">{track.votes}</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* ABA: COMANDA ABERTA OU HISTÓRICO */}
          {(activeClientTab === 'comanda' || activeClientTab === 'historico') && (
            <section className="flex flex-col gap-2.5">
              {currentTable.items
                .filter((it) => (activeClientTab === 'comanda' ? !it.paidBy : it.paidBy))
                .map((item) => {
                  const isSelected = selectedItemIds.includes(item.id)
                  const isLocked = item.lockedBy && !item.paidBy
                  const isPaid = !!item.paidBy

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItem(item)}
                      className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden active:scale-[0.98] ${
                        isPaid
                          ? 'opacity-60 border-white/5 bg-slate-900/30'
                          : isLocked
                          ? 'border-amber-500/60 bg-[#14120A] glow-amber'
                          : isSelected
                          ? 'border-emerald-500/80 bg-[#091715] glow-emerald shadow-lg shadow-emerald-500/15'
                          : 'border-white/10 hover:border-white/20 bg-[#0D111A]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="pt-0.5">
                          {isPaid ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : isLocked ? (
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 animate-pulse">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <motion.div
                              animate={{ scale: isSelected ? [0.85, 1.15, 1] : 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                                  : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                              }`}
                            >
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                  >
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className={`text-sm font-bold ${isPaid ? 'line-through text-slate-400' : 'text-white'}`}>
                              {item.name}
                            </p>
                            <span
                              className={`font-mono-numbers text-sm font-extrabold shrink-0 ${
                                isPaid ? 'text-slate-500' : isSelected ? 'text-emerald-400' : 'text-slate-200'
                              }`}
                            >
                              R$ {item.price.toFixed(2)}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                              <span className={`w-1.5 h-1.5 rounded-full ${item.avatarColor}`} />
                              Pedido por {item.orderedBy}
                            </span>

                            {isLocked && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono-numbers font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Em checkout por {item.lockedBy?.userName}
                              </span>
                            )}

                            {isPaid && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                                Liquidado às {item.paidBy?.paidAt} por {item.paidBy?.userName} ({item.paidBy?.method.toUpperCase()})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </section>
          )}
            </motion.div>
          </AnimatePresence>

          {/* Gorjeta */}
          {selectedItemIds.length > 0 && activeClientTab === 'comanda' && (
            <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-emerald-400" /> Gorjeta para o Atendimento ({tipPercent}%):
                </span>
                <span className="font-mono-numbers text-emerald-400 font-black text-sm">
                  R$ {tipAmount.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0, 10, 12, 15].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => {
                      triggerHaptic()
                      setTipPercent(percent)
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      tipPercent === percent
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {percent === 0 ? 'Sem taxa' : `${percent}%`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ======================================================== */}
      {/* BARRA FIXA INFERIOR DE CHECKOUT */}
      {/* ======================================================== */}
      {currentPerspective === 'client' && selectedItemIds.length > 0 && !paymentSuccess && activeClientTab === 'comanda' && (
        <footer className="fixed bottom-0 left-0 right-0 glass-panel-elevated p-4 z-40 border-t border-white/10">
          <div className="max-w-md mx-auto flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-xs text-slate-400">
                  Você está pagando ({selectedItemIds.length} {selectedItemIds.length === 1 ? 'item' : 'itens'}):
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">Inclui R$ {tipAmount.toFixed(2)} de gorjeta ({tipPercent}%)</p>
              </div>
              <span className="text-2xl font-mono-numbers font-black text-white">
                R$ {finalTotalToPay.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                disabled={isProcessing}
                onClick={() => handleClientCheckout('pix')}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wide transition-all shadow-xl shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" /> Pagar com Pix
                  </>
                )}
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleClientCheckout('apple_pay')}
                className="bg-[#151C2C] hover:bg-[#1D263B] text-white font-bold py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wide border border-white/10 transition-all active:scale-95 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />  Pay / Cartão
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* ======================================================== */}
      {/* MODAL: TRANSFERIR / JUNTAR MESAS */}
      {/* ======================================================== */}
      {adminModal === 'trocar_mesa' && selectedCashierTable && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" /> Transferir / Juntar Mesas
              </h3>
              <button onClick={() => setAdminModal(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Mover todo o consumo da <strong>Mesa {selectedCashierTable.number}</strong> para outra mesa:
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-400">Mesa de Destino</label>
              <select
                value={transferTargetTable}
                onChange={(e) => setTransferTargetTable(parseInt(e.target.value))}
                className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-purple-500"
              >
                {tables
                  .filter((t) => t.number !== selectedCashierTable.number)
                  .map((t) => (
                    <option key={t.number} value={t.number}>
                      Mesa {t.number} ({t.name}) - {t.status}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleTransferTable}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl mt-2 transition-all shadow-md shadow-amber-500/20"
            >
              Confirmar Transferência
            </button>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Nova Mesa */}
      {adminModal === 'nova_mesa' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" /> Cadastrar Nova Mesa
              </h3>
              <button onClick={() => setAdminModal(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Número da Mesa</label>
                <input
                  type="number"
                  placeholder="Ex: 15"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 mt-1 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Nome de Identificação</label>
                <input
                  type="text"
                  placeholder="Ex: Mesa Bistrô Janela"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 mt-1 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Zona / Ambiente</label>
                <select
                  value={newTableZone}
                  onChange={(e) => setNewTableZone(e.target.value as any)}
                  className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-purple-500"
                >
                  <option value="Deck">Deck</option>
                  <option value="Salão Principal">Salão Principal</option>
                  <option value="Bar Balcão">Bar Balcão</option>
                  <option value="Lounge">Lounge</option>
                </select>
              </div>

              <button
                onClick={handleCreateNewTable}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 rounded-xl mt-2 transition-all shadow-md shadow-purple-600/30"
              >
                Salvar Mesa & Gerar Tag NFC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Garçom */}
      {adminModal === 'novo_garcom' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" /> Cadastrar Novo Garçom
              </h3>
              <button onClick={() => setAdminModal(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: João Ferreira"
                  value={newWaiterName}
                  onChange={(e) => setNewWaiterName(e.target.value)}
                  className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 mt-1 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">WhatsApp / Celular</label>
                <input
                  type="text"
                  placeholder="(11) 98888-7777"
                  value={newWaiterPhone}
                  onChange={(e) => setNewWaiterPhone(e.target.value)}
                  className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 mt-1 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleCreateNewWaiter}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 rounded-xl mt-2 transition-all shadow-md shadow-purple-600/30"
              >
                Cadastrar Garçom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Novo Produto / Insumo no Estoque */}
      {adminModal === 'novo_produto' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-md w-full p-6 border border-emerald-500/40 glow-emerald shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  Gestão 360° de Insumos
                </span>
                <h3 className="text-base font-black text-white flex items-center gap-2 mt-1">
                  <Package className="w-5 h-5 text-emerald-400" /> Cadastrar Novo Produto / Insumo
                </h3>
              </div>
              <button onClick={() => setAdminModal(null)} className="text-slate-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Nome do Item / Rótulo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Moscow Mule Artesanal, Picanha Nobre..."
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Categoria</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="bebida">🍸 Bebida / Coquetel</option>
                    <option value="comida">🍔 Comida / Porção</option>
                    <option value="sobremesa">🍰 Sobremesa / Doce</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="38.00"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Custo Insumo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="11.50"
                    value={newProductCost}
                    onChange={(e) => setNewProductCost(e.target.value)}
                    className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white font-mono-numbers mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400">Estoque Inicial</label>
                  <input
                    type="number"
                    placeholder="40"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white font-mono-numbers mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400">Estoque Mínimo</label>
                  <input
                    type="number"
                    placeholder="8"
                    value={newProductMinStock}
                    onChange={(e) => setNewProductMinStock(e.target.value)}
                    className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white font-mono-numbers mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Harmonização / Sugestão do Sommelier IA</label>
                <input
                  type="text"
                  placeholder="Ex: Combina perfeitamente com fritas rústicas e chopp IPA..."
                  value={newProductPairing}
                  onChange={(e) => setNewProductPairing(e.target.value)}
                  className="w-full bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Prévia Financeira em Tempo Real */}
              {parseFloat(newProductPrice) > 0 && (
                <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/20 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">Lucro Unitário:</span>
                    <p className="font-mono-numbers font-black text-emerald-400">
                      R$ {(Math.max(0, (parseFloat(newProductPrice) || 0) - (parseFloat(newProductCost) || 0))).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px]">Margem Bruta:</span>
                    <p className="font-mono-numbers font-black text-white">
                      {Math.round(((Math.max(0, (parseFloat(newProductPrice) || 0) - (parseFloat(newProductCost) || 0))) / (parseFloat(newProductPrice) || 1)) * 100)}%
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl mt-1 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Salvar Produto & Adicionar ao Cardápio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Mesa */}
      {adminModal === 'detalhes' && selectedCashierTable && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-lg w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Detalhes da Mesa {selectedCashierTable.number}
                </h3>
                <p className="text-xs text-slate-400">{selectedCashierTable.name} • Garçom: {selectedCashierTable.waiterName}</p>
              </div>
              <button onClick={() => setAdminModal(null)} className="text-slate-400 hover:text-white p-1 font-bold">
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto no-scrollbar flex flex-col gap-2 pr-1">
              {selectedCashierTable.items.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">Nenhum pedido lançado nesta mesa ainda.</p>
              ) : (
                selectedCashierTable.items.map((it) => (
                  <div
                    key={it.id}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className={`font-bold ${it.paidBy ? 'line-through text-slate-500' : 'text-white'}`}>
                        {it.name}
                      </p>
                      <p className="text-[10px] text-slate-400">Pedido por: {it.orderedBy}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-numbers font-bold text-white">R$ {it.price.toFixed(2)}</p>
                      <span className={`text-[9px] font-bold ${it.paidBy ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {it.paidBy ? `PAGO (${it.paidBy.userName})` : 'PENDENTE'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Fechar Manual no Caixa */}
      {adminModal === 'fechar_manual' && selectedCashierTable && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-white">Recebimento no Caixa</h3>
                <p className="text-xs text-slate-400">Mesa {selectedCashierTable.number} • {selectedCashierTable.name}</p>
              </div>
              <button onClick={() => setAdminModal(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Saldo a Quitar</p>
                <p className="text-2xl font-black font-mono-numbers text-emerald-400">
                  R$ {(selectedCashierTable.totalOriginal - selectedCashierTable.totalPaid - customDiscount).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-400 font-medium">Desconto Cortesia:</p>
              <div className="grid grid-cols-4 gap-2">
                {[0, 10, 20, 30].map((desc) => (
                  <button
                    key={desc}
                    onClick={() => setCustomDiscount(desc)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      customDiscount === desc
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-white/5 border-white/5 text-slate-400'
                    }`}
                  >
                    R$ {desc}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 font-bold mt-1">Forma de Pagamento:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCashierManualClose(selectedCashierTable.number, 'dinheiro')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                💵 Dinheiro Vivo
              </button>
              <button
                onClick={() => handleCashierManualClose(selectedCashierTable.number, 'cartao')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
              >
                💳 Maquininha Balcão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🔐 MODAL: LEITURA BIOMÉTRICA & PROCESSAMENTO PIX DINÂMICO */}
      {/* ======================================================== */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 text-center flex flex-col items-center border border-cyan-500/40 glow-cyan shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Radar / Biometric Pulse Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center my-4">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 bg-cyan-500/10 animate-ping opacity-50" />
              {/* Secondary breathing ring */}
              <div className="absolute inset-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 animate-biometric-pulse" />
              {/* Rotating scan ring */}
              <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-emerald-400 border-b-transparent border-l-transparent animate-spin" />
              {/* Central glowing core with Zap */}
              <div className="relative w-14 h-14 rounded-full bg-[#08121f] border border-cyan-400/60 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Zap className="w-7 h-7 text-cyan-300 animate-pulse fill-cyan-400/30" />
              </div>
            </div>

            <h3 className="text-base font-black text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Leitura Biométrica & Pix Dinâmico
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Autenticando token criptográfico com o Banco Central e liquidando comanda em tempo real...
            </p>

            <div className="w-full mt-5 bg-black/60 rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs font-mono-numbers">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Canal Seguro:
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3 • AES-256
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso no Pagamento do Cliente com Celebração */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 text-center flex flex-col items-center border border-emerald-500/40 glow-emerald shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="absolute -inset-1 rounded-full border border-emerald-400/40 animate-ping opacity-40 pointer-events-none" />
            </div>

            <div className="flex items-center gap-1.5 justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-xl font-black text-white">Pagamento Aprovado!</h3>
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Sua comanda foi atualizada e o sistema do bar já deu baixa imediata na Mesa {currentTable.number}.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-black/60 border border-white/10 w-full text-left font-mono-numbers text-xs flex flex-col gap-2">
              <div className="flex justify-between text-slate-400">
                <span>Autenticação:</span>
                <span className="text-white font-bold">#NFC-TX-88219</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Método:</span>
                <span className="text-emerald-400 font-bold">Pix Instantâneo BACEN</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Baixa no Salão:</span>
                <span className="text-white font-bold">0.8 segundos</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => {
                  playSound('tap')
                  setPaymentSuccess(false)
                  setShowRatingModal(true)
                }}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-slate-950" /> Avaliar Atendimento (Ganhe Cortesia)
              </button>
              <button
                onClick={() => {
                  playSound('tap')
                  setPaymentSuccess(false)
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs py-3 rounded-2xl transition-all border border-white/10 active:scale-95"
              >
                Concluir & Voltar à Mesa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bancar um Amigo */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="glass-panel-elevated rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 flex flex-col gap-4 border border-purple-500/30 glow-violet shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-black text-white">Bancar um Amigo da Mesa</h3>
              </div>
              <button
                onClick={() => setShowGiftModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Selecione um amigo para assumir o consumo dele no seu pagamento. Ele receberá uma notificação instantânea!
            </p>

            <div className="flex flex-col gap-2.5 my-1">
              <button
                onClick={() => handleGiftFriend('Camila')}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/60 flex justify-between items-center text-left transition-all hover:bg-purple-950/20 active:scale-95"
              >
                <div>
                  <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-400" /> Camila Dias
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">1x Moscow Mule com Espuma</p>
                </div>
                <span className="text-xs font-mono-numbers font-black text-purple-300 bg-purple-500/20 px-2 py-1 rounded-lg">
                  + R$ 36,00
                </span>
              </button>

              <button
                onClick={() => handleGiftFriend('Mariana')}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/60 flex justify-between items-center text-left transition-all hover:bg-purple-950/20 active:scale-95"
              >
                <div>
                  <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Mariana Costa
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">1x Gin Tônica Tanqueray</p>
                </div>
                <span className="text-xs font-mono-numbers font-black text-purple-300 bg-purple-500/20 px-2 py-1 rounded-lg">
                  + R$ 39,00
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🔔 CENTRAL DE NOTIFICAÇÕES (DRAWER LATERAL BIG TECH) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isNotificationDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="w-screen max-w-md glass-panel-elevated border-l border-white/10 shadow-2xl flex flex-col justify-between"
              >
                {/* Header do Drawer */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        Central de Notificações
                        {unreadNotificationsCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono-numbers font-black border border-rose-500/40">
                            {unreadNotificationsCount} novas
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-400">Alertas de KDS, chamados e pagamentos</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsNotificationDrawerOpen(false)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Filtros das Notificações */}
                <div className="px-5 py-2.5 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                  {[
                    { id: 'all', label: 'Todas' },
                    { id: 'urgent', label: '🔥 Urgentes' },
                    { id: 'payment', label: '⚡ Pix / Pagamentos' },
                    { id: 'ai', label: '🧠 Copilot IA' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setNotificationFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                        notificationFilter === f.id
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Lista de Notificações */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {notifications
                    .filter((n) => {
                      if (notificationFilter === 'urgent') return n.urgency === 'high' || n.type === 'waiter'
                      if (notificationFilter === 'payment') return n.type === 'payment'
                      if (notificationFilter === 'ai') return n.type === 'ai'
                      return true
                    })
                    .map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                          !notif.read
                            ? notif.urgency === 'high'
                              ? 'bg-[#180D11] border-rose-500/50 glow-rose shadow-lg'
                              : 'bg-[#101322] border-purple-500/40 shadow-md'
                            : 'bg-white/5 border-white/5 opacity-75'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            )}
                          </div>
                          <span className="text-[10px] font-mono-numbers text-slate-400 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                          {notif.actionLabel && (
                            <button
                              onClick={() => handleNotificationAction(notif)}
                              className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold transition-all flex items-center gap-1"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" /> {notif.actionLabel}
                            </button>
                          )}
                          {!notif.read && (
                            <button
                              onClick={() => handleMarkNotificationAsRead(notif.id)}
                              className="text-[11px] text-slate-400 hover:text-white transition-all ml-auto"
                            >
                              Marcar como lida
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Rodapé do Drawer */}
                <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      playSound('tap')
                      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                    }}
                    className="text-slate-400 hover:text-white font-bold transition-all flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-400" /> Marcar todas como lidas
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono-numbers">
                    {notifications.length} eventos registrados
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* ⭐ MÓDULO DE AVALIAÇÃO DO CLIENTE & GOOGLE MAPS BOOSTER */}
      {/* ======================================================== */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 border border-amber-500/40 glow-amber shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider border border-amber-500/30">
                Experiência da Mesa
              </span>
              <button onClick={() => setShowRatingModal(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Star className="w-7 h-7 text-slate-950 fill-slate-950" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Como foi sua experiência hoje?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Seu feedback nos ajuda a manter a excelência no atendimento da Mesa {currentTable.number}.
              </p>
            </div>

            {/* Avaliação da Comida / Bebida */}
            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Comida & Bebidas:</span>
                <span className="text-amber-400 font-mono-numbers font-black">{clientFoodRating} de 5</span>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      triggerHaptic(15)
                      playSound('tap')
                      setClientFoodRating(star)
                    }}
                    className="p-1 transition-transform hover:scale-125 active:scale-95"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= clientFoodRating
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Avaliação do Atendimento do Garçom */}
            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Atendimento ({currentTable.waiterName}):</span>
                <span className="text-amber-400 font-mono-numbers font-black">{clientServiceRating} de 5</span>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      triggerHaptic(15)
                      playSound('tap')
                      setClientServiceRating(star)
                    }}
                    className="p-1 transition-transform hover:scale-125 active:scale-95"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= clientServiceRating
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de Comentário Opcional */}
            <input
              type="text"
              placeholder="Deixe um elogio ou sugestão (opcional)..."
              value={clientRatingComment}
              onChange={(e) => setClientRatingComment(e.target.value)}
              className="bg-[#090D15] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />

            {/* Lógica Inteligente de Encaminhamento (Google Booster para 5 estrelas) */}
            {clientFoodRating === 5 && clientServiceRating === 5 ? (
              <div className="flex flex-col gap-2">
                <button
                  disabled={ratingSubmitted}
                  onClick={() => handleSubmitRating()}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs py-3.5 rounded-2xl transition-all shadow-xl shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Enviar avaliação à gestão (+1 Shot Cortesia)
                </button>
                <button
                  disabled={ratingSubmitted}
                  onClick={() => handleSubmitRating()}
                  className="text-xs text-slate-400 hover:text-white py-1 transition-colors"
                >
                  Apenas enviar avaliação interna
                </button>
              </div>
            ) : (
              <button
                disabled={ratingSubmitted}
                onClick={() => handleSubmitRating()}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-purple-600/30 active:scale-95"
              >
                Enviar Avaliação ao Gerente
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🛎️ MODAL: CHAMAR GARÇOM COM PROPÓSITO (SEUL TECH)       */}
      {/* ======================================================== */}
      {showSmartCallModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 border border-cyan-500/40 glow-cyan shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider border border-cyan-500/30">
                  Smart Service Call (Seoul Tech)
                </span>
                <h3 className="text-base font-black text-white flex items-center gap-2 mt-1">
                  <Bell className="w-5 h-5 text-cyan-400" /> Chamar Garçom na Mesa
                </h3>
              </div>
              <button
                onClick={() => setShowSmartCallModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Selecione o motivo específico. O garçom já chega à <strong>Mesa {currentTable.number}</strong> com o que você precisa em mãos, sem idas e vindas desnecessárias:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { reason: 'gelo_limao' as WaiterCallReason, icon: '🧊', label: 'Trazer Gelo / Limão' },
                { reason: 'copos_limpos' as WaiterCallReason, icon: '🥂', label: 'Copos Limpos' },
                { reason: 'talheres' as WaiterCallReason, icon: '🍴', label: 'Talheres / Guardanapo' },
                { reason: 'limpar_mesa' as WaiterCallReason, icon: '✨', label: 'Limpar Mesa' },
                { reason: 'conta_dinheiro' as WaiterCallReason, icon: '💵', label: 'Pagar no Dinheiro' },
                { reason: 'gerente' as WaiterCallReason, icon: '👔', label: 'Falar com Gerente' },
              ].map((opt) => (
                <button
                  key={opt.reason}
                  onClick={() => handleTriggerSmartCall(opt.reason, opt.label)}
                  className="p-3 rounded-2xl bg-[#09111c] hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 flex flex-col items-center text-center gap-1.5 transition-all active:scale-95 group shadow-sm"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 leading-tight">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleTriggerSmartCall('atendimento_geral', 'Atendimento Geral')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all border border-white/5"
            >
              Dúvida geral / Outro motivo
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🥢 MODAL: PERSONALIZAÇÃO GRANULAR DE ITEM (TOKYO IZAKAYA) */}
      {/* ======================================================== */}
      {selectedProductForOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 border border-emerald-500/40 glow-emerald shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/30">
                  Tokyo Granular Customization
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  {selectedProductForOrder.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductForOrder(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-black/50 border border-white/10">
              <span className="text-xs text-slate-400">Valor Unitário:</span>
              <span className="text-base font-black font-mono-numbers text-emerald-400">
                R$ {selectedProductForOrder.price.toFixed(2)}
              </span>
            </div>

            {/* Customização específica por categoria */}
            {selectedProductForOrder.category === 'bebida' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  🧊 Preferência de Gelo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Normal' },
                    { id: 'pouco', label: 'Pouco Gelo' },
                    { id: 'sem', label: 'Sem Gelo' },
                  ].map((ice) => (
                    <button
                      key={ice.id}
                      onClick={() => setOrderIceOption(ice.id as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                        orderIceOption === ice.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ice.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedProductForOrder.category === 'comida' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  🥩 Ponto da Carne / Preparo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mal', label: 'Mal Passada' },
                    { id: 'ponto', label: 'Ao Ponto' },
                    { id: 'bem', label: 'Bem Passada' },
                  ].map((ponto) => (
                    <button
                      key={ponto.id}
                      onClick={() => setOrderMeatDoneness(ponto.id as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                        orderMeatDoneness === ponto.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ponto.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Observações Livres */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Observações ao Bartender / Chef:
              </label>
              <input
                type="text"
                placeholder="Ex: Sem cebola, limão espremido à parte, copo extra..."
                value={orderExtraNote}
                onChange={(e) => setOrderExtraNote(e.target.value)}
                className="bg-[#0D131F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              onClick={() => handleConfirmCustomOrder()}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2 mt-1"
            >
              <Check className="w-4 h-4" /> Enviar Pedido Direto ao KDS
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ⌘K GLOBAL COMMAND MENU (APPLE / LINEAR / STRIPE STANDARD) */}
      {/* ======================================================== */}
      {isCommandMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150"
          onClick={() => setIsCommandMenuOpen(false)}
        >
          <div
            className="glass-panel-elevated rounded-3xl max-w-2xl w-full border border-white/15 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input de Busca */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-black/40">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={commandFilter}
                onChange={(e) => setCommandFilter(e.target.value)}
                placeholder="Digite para buscar mesas, produtos, garçons ou ações rápidas..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
              />
              <button
                onClick={() => setIsCommandMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1 font-mono"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">ESC</kbd>
              </button>
            </div>

            {/* Lista de Resultados Filtrados */}
            <div className="max-h-96 overflow-y-auto no-scrollbar p-3 flex flex-col gap-3">
              {/* Seção: Ações Rápidas do Sistema */}
              <div>
                <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Ações Rápidas do Sistema
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  {[
                    {
                      label: 'Simular Conflito de Lock Concorrente (Redis 90s)',
                      sub: 'Testa a trava de segurança quando dois amigos tentam pagar o mesmo item',
                      icon: Sparkles,
                      action: () => {
                        handleSimulateRaceCondition()
                        setIsCommandMenuOpen(false)
                      },
                      color: 'text-amber-400',
                    },
                    {
                      label: 'Consultar Copilot IA do Gerente',
                      sub: 'Briefing preditivo de faturamento, giro de salão e recomendações',
                      icon: BrainCircuit,
                      action: () => {
                        setAdminTab('copilot_ia')
                        setCurrentPerspective('admin')
                        setIsCommandMenuOpen(false)
                      },
                      color: 'text-cyan-400',
                    },
                    {
                      label: 'Ver Fila de Produção KDS da Cozinha & Bar',
                      sub: 'Acompanhar pedidos pendentes e SLA de preparo por estação',
                      icon: Flame,
                      action: () => {
                        setAdminTab('kds')
                        setCurrentPerspective('admin')
                        setIsCommandMenuOpen(false)
                      },
                      color: 'text-orange-400',
                    },
                    {
                      label: 'Ver Auditoria DRE & Emissão Fiscal NFC-e',
                      sub: 'Visualizar faturamento líquido, taxas economizadas no Pix e SPED',
                      icon: Wallet,
                      action: () => {
                        setAdminTab('financeiro')
                        setCurrentPerspective('admin')
                        setIsCommandMenuOpen(false)
                      },
                      color: 'text-emerald-400',
                    },
                    {
                      label: 'Cadastrar Nova Mesa no Salão',
                      sub: 'Adicionar mesa ao Deck, Salão Principal, Bar ou Lounge VIP',
                      icon: Plus,
                      action: () => {
                        setAdminModal('nova_mesa')
                        setIsCommandMenuOpen(false)
                      },
                      color: 'text-blue-400',
                    },
                    {
                      label: 'Cadastrar Novo Garçom na Equipe',
                      sub: 'Habilitar escala de turno e rateio automatizado dos 10%',
                      icon: Users,
                      action: () => {
                        setAdminModal('novo_garcom')
                        setIsCommandMenuOpen(false)
                      },
                      color: 'text-purple-400',
                    },
                  ]
                    .filter((act) => !commandFilter || act.label.toLowerCase().includes(commandFilter.toLowerCase()) || act.sub.toLowerCase().includes(commandFilter.toLowerCase()))
                    .map((act, idx) => {
                      const Icon = act.icon
                      return (
                        <button
                          key={idx}
                          onClick={act.action}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Icon className={`w-4 h-4 ${act.color}`} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                                {act.label}
                              </p>
                              <p className="text-[11px] text-slate-400">{act.sub}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-300">
                            Executar ↵
                          </span>
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Seção: Mesas do Salão */}
              <div>
                <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Mesas do Salão ({tables.length})
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  {tables
                    .filter((t) => !commandFilter || t.name.toLowerCase().includes(commandFilter.toLowerCase()) || t.number.toString().includes(commandFilter))
                    .map((t) => (
                      <button
                        key={t.number}
                        onClick={() => {
                          setSelectedCashierTable(t)
                          setAdminTab('mesas')
                          setCurrentPerspective('admin')
                          setIsCommandMenuOpen(false)
                        }}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 text-xs font-black font-mono-numbers text-purple-300">
                            #{t.number}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-2">
                              {t.name}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-numbers uppercase font-black ${
                                t.status === 'ocupada'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : t.status === 'em_fechamento'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : t.status === 'paga'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {t.status}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Garçom: {t.waiterName} • {t.items.length} itens lançados
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono-numbers font-black text-slate-200">
                          R$ {t.totalOriginal.toFixed(2)}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Seção: Itens do Catálogo & Estoque */}
              <div>
                <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Cardápio & Estoque ({catalog.length} itens)
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  {catalog
                    .filter((c) => !commandFilter || c.name.toLowerCase().includes(commandFilter.toLowerCase()) || c.category.toLowerCase().includes(commandFilter.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 text-left"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{item.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Estoque: <span className={item.stock <= item.minStock ? 'text-rose-400 font-bold' : 'text-slate-300 font-mono-numbers'}>{item.stock} un</span> • Margem: <span className="text-emerald-400 font-mono-numbers">{item.marginPercent}%</span>
                          </p>
                        </div>
                        <span className="text-xs font-mono-numbers font-black text-emerald-300">
                          R$ {item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Rodapé do Menu */}
            <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-slate-400">
              <span>Use as setas ou clique para navegar</span>
              <span className="flex items-center gap-2">
                <span>TapTable AI OS v2.0 Enterprise</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
