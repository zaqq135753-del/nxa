import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Users,
  MessageCircle,
  ChefHat,
  Compass,
  BedDouble,
  RefreshCw,
  ExternalLink,
  Store,
  Package,
  DoorOpen,
  BellRing,
  ArrowUpRight,
  ShieldCheck,
  Utensils,
  Wifi,
  ArrowLeft,
  LayoutGrid,
  PlusCircle,
  Receipt,
  Search,
  ChevronRight,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { CaraivaSpatialSuite3D } from './CaraivaSpatialSuite3D';
import { CaraivaKdsActionTab } from './tabs/CaraivaKdsActionTab';
import { CaraivaFinancialDreTab } from './tabs/CaraivaFinancialDreTab';
import { CaraivaCrmLoyaltyTab, type CustomerProfile } from './tabs/CaraivaCrmLoyaltyTab';
import {
  getUnifiedOrders,
  updateOrderStatus,
  createUnifiedOrder,
  type UnifiedOrder,
  type UnifiedOrderStatus,
  getStatusBadge,
  formatCurrency,
  type OrderNiche
} from '../../services/villageUnifiedOrdersService';

// ==========================================
// 0. DIRETÓRIO DO CENTRALIZADOR DE NEGÓCIOS
// ==========================================
interface BusinessUnitDirectoryItem {
  id: string;
  name: string;
  niche: OrderNiche;
  categoryLabel: string;
  systemModuleTitle: string;
  location: string;
  statusText: string;
  activeAlerts: number;
  todayRevenuePreview: number;
  nfcPlatesActive: number;
}

const BUSINESS_DIRECTORY: BusinessUnitDirectoryItem[] = [
  {
    id: 'restaurante-taptable',
    name: 'Sistema Gastronomia & TapTable NFC',
    niche: 'gastronomia',
    categoryLabel: 'Módulo Restaurantes & Bares',
    systemModuleTitle: 'Gestão de Mesas NFC + PDV + KDS Cozinha',
    location: 'Salão, Balcão & Delivery',
    statusText: '5 de 8 mesas ativas • 3 chamados pendentes',
    activeAlerts: 3,
    todayRevenuePreview: 1845,
    nfcPlatesActive: 12,
  },
  {
    id: 'pousada-pms',
    name: 'Sistema Hotelaria & Mini PMS',
    niche: 'hospedagem',
    categoryLabel: 'Módulo Pousadas & Hotéis',
    systemModuleTitle: 'Gestão de Suítes + Governança + Concierge NFC',
    location: 'Recepção & Quartos',
    statusText: '3 de 4 suítes ocupadas • 1 check-in hoje',
    activeAlerts: 2,
    todayRevenuePreview: 3910,
    nfcPlatesActive: 8,
  },
  {
    id: 'nautica-passeios',
    name: 'Sistema Náutica & Passeios',
    niche: 'passeios_barcos',
    categoryLabel: 'Módulo Passeios, Barcos & Buggy',
    systemModuleTitle: 'Manifesto de Embarque & Check-in NFC no Píer',
    location: 'Píer & Embarcações',
    statusText: '9 de 12 vagas vendidas • Maré favorável',
    activeAlerts: 1,
    todayRevenuePreview: 1420,
    nfcPlatesActive: 4,
  },
  {
    id: 'varejo-loja',
    name: 'Sistema Varejo & Ateliê',
    niche: 'conveniencia',
    categoryLabel: 'Módulo Lojas & Comércio',
    systemModuleTitle: 'Estoque, Ficha CMV & Scan-and-Go NFC',
    location: 'Loja Física & Guia',
    statusText: '104 leituras NFC hoje • 1 reposição de estoque',
    activeAlerts: 1,
    todayRevenuePreview: 685,
    nfcPlatesActive: 25,
  },
];

// ==========================================
// 1. MODELOS DO MINI PMS (HOTELARIA)
// ==========================================
interface SuiteRoom {
  id: string;
  name: string;
  category: 'master' | 'bangalo' | 'standard';
  status: 'disponivel' | 'ocupado' | 'checkin_hoje' | 'limpeza';
  nfcRequests?: string[];
  currentGuest?: {
    name: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    paidAmount: number;
  };
  dailyRate: number;
}

const INITIAL_SUITES: SuiteRoom[] = [
  {
    id: 'st-01',
    name: 'Bangalô das Águas',
    category: 'bangalo',
    status: 'ocupado',
    dailyRate: 850,
    nfcRequests: ['2x Toalhas de Praia Extras (via Placa NFC Quarto)', 'Balde de Gelo + 2 Águas c/ Gás'],
    currentGuest: {
      name: 'Rodrigo e Camila Antunes',
      phone: '11987654321',
      checkIn: '12/11/2026',
      checkOut: '15/11/2026',
      guests: 2,
      paidAmount: 2550,
    },
  },
  {
    id: 'st-02',
    name: 'Suíte Amendoeira',
    category: 'master',
    status: 'checkin_hoje',
    dailyRate: 680,
    nfcRequests: ['Check-in Express pré-preenchido via NFC'],
    currentGuest: {
      name: 'Beatriz Vasconcelos',
      phone: '31998877665',
      checkIn: 'Hoje às 14h',
      checkOut: '20/10/2026',
      guests: 3,
      paidAmount: 1360,
    },
  },
  {
    id: 'st-03',
    name: 'Suíte Pôr do Sol',
    category: 'standard',
    status: 'limpeza',
    dailyRate: 520,
  },
  {
    id: 'st-04',
    name: 'Chalé Brisa da Praia',
    category: 'standard',
    status: 'disponivel',
    dailyRate: 490,
  },
];

// ==========================================
// 2. MODELOS DO TAPTABLE (SALÃO, COMANDA & MESAS NFC)
// ==========================================
interface TableConsumedItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  orderedBy: 'NFC Cliente' | 'Garçom (Manual)';
  time: string;
  station: 'cozinha_quente' | 'bar_drinks';
}

interface TapTableFloorSeat {
  tableNumber: string;
  status: 'livre' | 'comanda_aberta' | 'pedindo_conta' | 'ociosa';
  zone: 'Beira-Rio' | 'Salão Nobre' | 'Deck Areia';
  currentTotal: number;
  paidSoFar: number;
  peopleTapCount: number;
  openMinutes: number;
  waiterName: string;
  activeCall?: string;
  callMinutesAgo?: number;
  items: TableConsumedItem[];
}

interface QuickMenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Pratos & Petiscos' | 'Drinks & Cervejas' | 'Sem Álcool';
  station: 'cozinha_quente' | 'bar_drinks';
}

const RESTAURANT_QUICK_MENU: QuickMenuItem[] = [
  { id: 'm-01', name: 'Moqueca de Badejo & Camarão (2p)', price: 168, category: 'Pratos & Petiscos', station: 'cozinha_quente' },
  { id: 'm-02', name: 'Pastel de Arraia Artesanal', price: 24, category: 'Pratos & Petiscos', station: 'cozinha_quente' },
  { id: 'm-03', name: 'Bolinho de Peixe c/ Pimenta (8 un)', price: 58, category: 'Pratos & Petiscos', station: 'cozinha_quente' },
  { id: 'm-04', name: 'Isca de Badejo Empanada c/ Aipim', price: 74, category: 'Pratos & Petiscos', station: 'cozinha_quente' },
  { id: 'm-05', name: 'Caipirinha de Cacau & Biribiri', price: 38, category: 'Drinks & Cervejas', station: 'bar_drinks' },
  { id: 'm-06', name: 'Cerveja Original 600ml Gelada', price: 22, category: 'Drinks & Cervejas', station: 'bar_drinks' },
  { id: 'm-07', name: 'Balde 5 Heinekens Long Neck', price: 85, category: 'Drinks & Cervejas', station: 'bar_drinks' },
  { id: 'm-08', name: 'Água de Coco Nativa no Gelo', price: 14, category: 'Sem Álcool', station: 'bar_drinks' },
];

const INITIAL_TABLES: TapTableFloorSeat[] = [
  {
    tableNumber: '01',
    status: 'comanda_aberta',
    zone: 'Beira-Rio',
    currentTotal: 280,
    paidSoFar: 140,
    peopleTapCount: 3,
    openMinutes: 42,
    waiterName: 'Lucas',
    activeCall: 'Trazer Gelo & Limão',
    callMinutesAgo: 2,
    items: [
      { id: 'it-101', name: 'Moqueca de Badejo & Camarão (2p)', qty: 1, unitPrice: 168, orderedBy: 'NFC Cliente', time: '18:40', station: 'cozinha_quente' },
      { id: 'it-102', name: 'Caipirinha de Cacau & Biribiri', qty: 2, unitPrice: 38, orderedBy: 'NFC Cliente', time: '18:45', station: 'bar_drinks' },
      { id: 'it-103', name: 'Água de Coco Nativa no Gelo', qty: 1, unitPrice: 14, orderedBy: 'Garçom (Manual)', time: '19:02', station: 'bar_drinks' },
      { id: 'it-104', name: 'Cerveja Original 600ml Gelada', qty: 1, unitPrice: 22, orderedBy: 'Garçom (Manual)', time: '19:10', station: 'bar_drinks' },
    ],
  },
  {
    tableNumber: '02',
    status: 'livre',
    zone: 'Beira-Rio',
    currentTotal: 0,
    paidSoFar: 0,
    peopleTapCount: 0,
    openMinutes: 0,
    waiterName: 'Lucas',
    items: [],
  },
  {
    tableNumber: '03',
    status: 'pedindo_conta',
    zone: 'Beira-Rio',
    currentTotal: 410,
    paidSoFar: 310,
    peopleTapCount: 4,
    openMinutes: 75,
    waiterName: 'Mateus',
    activeCall: 'Pediu Fechamento (Falta R$ 100)',
    callMinutesAgo: 1,
    items: [
      { id: 'it-301', name: 'Moqueca de Badejo & Camarão (2p)', qty: 1, unitPrice: 168, orderedBy: 'NFC Cliente', time: '18:10', station: 'cozinha_quente' },
      { id: 'it-302', name: 'Bolinho de Peixe c/ Pimenta (8 un)', qty: 2, unitPrice: 58, orderedBy: 'NFC Cliente', time: '18:15', station: 'cozinha_quente' },
      { id: 'it-303', name: 'Balde 5 Heinekens Long Neck', qty: 1, unitPrice: 85, orderedBy: 'NFC Cliente', time: '18:30', station: 'bar_drinks' },
      { id: 'it-304', name: 'Pastel de Arraia Artesanal', qty: 1, unitPrice: 24, orderedBy: 'Garçom (Manual)', time: '18:50', station: 'cozinha_quente' },
      { id: 'it-305', name: 'Água de Coco Nativa no Gelo', qty: 1, unitPrice: 17, orderedBy: 'Garçom (Manual)', time: '19:00', station: 'bar_drinks' },
    ],
  },
  {
    tableNumber: '04',
    status: 'ociosa',
    zone: 'Deck Areia',
    currentTotal: 165,
    paidSoFar: 0,
    peopleTapCount: 2,
    openMinutes: 88,
    waiterName: 'Lucas',
    activeCall: '32 min sem novo pedido',
    callMinutesAgo: 5,
    items: [
      { id: 'it-401', name: 'Isca de Badejo Empanada c/ Aipim', qty: 1, unitPrice: 74, orderedBy: 'NFC Cliente', time: '17:55', station: 'cozinha_quente' },
      { id: 'it-402', name: 'Caipirinha de Cacau & Biribiri', qty: 2, unitPrice: 38, orderedBy: 'NFC Cliente', time: '18:00', station: 'bar_drinks' },
      { id: 'it-403', name: 'Água de Coco Nativa no Gelo', qty: 1, unitPrice: 15, orderedBy: 'Garçom (Manual)', time: '18:20', station: 'bar_drinks' },
    ],
  },
  {
    tableNumber: '05',
    status: 'livre',
    zone: 'Deck Areia',
    currentTotal: 0,
    paidSoFar: 0,
    peopleTapCount: 0,
    openMinutes: 0,
    waiterName: 'Mateus',
    items: [],
  },
  {
    tableNumber: '06',
    status: 'comanda_aberta',
    zone: 'Salão Nobre',
    currentTotal: 198,
    paidSoFar: 0,
    peopleTapCount: 2,
    openMinutes: 25,
    waiterName: 'Carla',
    activeCall: '+2 Copos Limpos c/ Gelo',
    callMinutesAgo: 3,
    items: [
      { id: 'it-601', name: 'Bolinho de Peixe c/ Pimenta (8 un)', qty: 1, unitPrice: 58, orderedBy: 'NFC Cliente', time: '19:00', station: 'cozinha_quente' },
      { id: 'it-602', name: 'Balde 5 Heinekens Long Neck', qty: 1, unitPrice: 85, orderedBy: 'NFC Cliente', time: '19:02', station: 'bar_drinks' },
      { id: 'it-603', name: 'Pastel de Arraia Artesanal', qty: 2, unitPrice: 27.5, orderedBy: 'Garçom (Manual)', time: '19:12', station: 'cozinha_quente' },
    ],
  },
  {
    tableNumber: '07',
    status: 'livre',
    zone: 'Salão Nobre',
    currentTotal: 0,
    paidSoFar: 0,
    peopleTapCount: 0,
    openMinutes: 0,
    waiterName: 'Carla',
    items: [],
  },
  {
    tableNumber: '08',
    status: 'pedindo_conta',
    zone: 'Beira-Rio',
    currentTotal: 340,
    paidSoFar: 170,
    peopleTapCount: 2,
    openMinutes: 55,
    waiterName: 'Mateus',
    items: [
      { id: 'it-801', name: 'Moqueca de Badejo & Camarão (2p)', qty: 1, unitPrice: 168, orderedBy: 'NFC Cliente', time: '18:30', station: 'cozinha_quente' },
      { id: 'it-802', name: 'Balde 5 Heinekens Long Neck', qty: 2, unitPrice: 86, orderedBy: 'NFC Cliente', time: '18:35', station: 'bar_drinks' },
    ],
  },
];

// ==========================================
// 3. MODELOS DO VAREJO (FICHA TÉCNICA & CMV)
// ==========================================
interface RetailProduct {
  id: string;
  name: string;
  price: number;
  costCmv: number;
  stock: number;
  minStock: number;
  category: string;
  available: boolean;
  nfcScansToday: number;
}

const INITIAL_PRODUCTS: RetailProduct[] = [
  { id: 'p-01', name: 'Canga Algodão Cru Artesanal Caraíva', price: 95, costCmv: 28, stock: 12, minStock: 5, category: 'Moda Praia', available: true, nfcScansToday: 34 },
  { id: 'p-02', name: 'Colar de Sementes Nativas Pataxó', price: 65, costCmv: 18, stock: 8, minStock: 4, category: 'Arte Indígena', available: true, nfcScansToday: 29 },
  { id: 'p-03', name: 'Cerâmica Rústica Queimada no Forno', price: 140, costCmv: 42, stock: 2, minStock: 3, category: 'Decoração', available: true, nfcScansToday: 19 },
  { id: 'p-04', name: 'Chapéu de Palha Trançado à Mão', price: 110, costCmv: 32, stock: 5, minStock: 4, category: 'Acessórios', available: true, nfcScansToday: 22 },
];

type SystemUniversalTab = 'operacao_principal' | 'fila_pedidos' | 'financeiro_dre' | 'crm_clientes';

export const CaraivaUniversalBusinessApp: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<UnifiedOrder[]>(() => getUnifiedOrders());

  const activeNicheParam = searchParams.get('nicho') as OrderNiche | null;
  const [viewMode, setViewMode] = useState<'hub_centralizador' | 'sistema_negocio'>(() =>
    activeNicheParam ? 'sistema_negocio' : 'hub_centralizador'
  );
  const [selectedNiche, setSelectedNiche] = useState<OrderNiche>(() => activeNicheParam || 'gastronomia');
  const [hubSearch, setHubSearch] = useState<string>('');

  // 4 Abas Universais e Padronizadas em todos os nichos
  const [activeUniversalTab, setActiveUniversalTab] = useState<SystemUniversalTab>('operacao_principal');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showPosLauncher, setShowPosLauncher] = useState<boolean>(false);
  const [spatialViewActive, setSpatialViewActive] = useState<boolean>(true);

  const [suites, setSuites] = useState<SuiteRoom[]>(INITIAL_SUITES);
  const [tables, setTables] = useState<TapTableFloorSeat[]>(INITIAL_TABLES);
  const [products, setProducts] = useState<RetailProduct[]>(INITIAL_PRODUCTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Estados da Comanda e PDV Manual
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('01');
  const [posTargetTable, setPosTargetTable] = useState<string>('01');
  const [posCart, setPosCart] = useState<Record<string, number>>({});
  const [posNotes, setPosNotes] = useState<string>('');
  const [posCustomerName, setPosCustomerName] = useState<string>('');
  const [posSuccessFeedback, setPosSuccessFeedback] = useState<string | null>(null);

  // Estados dos Conectores de Chave API
  const [apiConnections, setApiConnections] = useState({
    asaasPixSplit: true,
    whatsappCloud: true,
    thermalPrinter: true,
    kamraChannelManager: true,
    sefazNfce: true,
  });

  const reloadData = () => {
    setIsRefreshing(true);
    setOrders(getUnifiedOrders());
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    const handleSync = () => setOrders(getUnifiedOrders());
    window.addEventListener('caraiva:orders-updated', handleSync);
    return () => window.removeEventListener('caraiva:orders-updated', handleSync);
  }, []);

  const handleOpenBusinessUnit = (niche: OrderNiche, businessId?: string) => {
    setSelectedNiche(niche);
    setViewMode('sistema_negocio');
    setActiveUniversalTab('operacao_principal');
    setSearchParams({ nicho: niche, ...(businessId ? { id: businessId } : {}) });
  };

  const handleBackToHub = () => {
    setViewMode('hub_centralizador');
    setSearchParams({});
  };

  // Negócio atualmente aberto
  const currentBusinessUnit =
    BUSINESS_DIRECTORY.find((b) => b.niche === selectedNiche) || BUSINESS_DIRECTORY[0];

  // Filtragem dos pedidos de acordo com o nicho selecionado
  const nicheOrders = orders.filter((o) => {
    if (selectedNiche === 'gastronomia') return o.niche === 'gastronomia';
    if (selectedNiche === 'hospedagem') return o.niche === 'hospedagem';
    if (selectedNiche === 'passeios_barcos') return o.niche === 'passeios_barcos';
    return o.niche === 'conveniencia' || o.niche === 'servicos';
  });

  // ==========================================
  // CÁLCULOS FINANCEIROS & DRE AO VIVO
  // ==========================================
  const ordersGross = nicheOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const openTablesRevenue = selectedNiche === 'gastronomia' ? tables.reduce((acc, t) => acc + t.currentTotal, 0) : 0;
  const totalGross = ordersGross + openTablesRevenue;

  const totalPix =
    nicheOrders.filter((o) => o.paymentMethod === 'pix').reduce((acc, o) => acc + o.totalAmount, 0) +
    openTablesRevenue * 0.75;
  const totalCard = Math.max(0, totalGross - totalPix);

  const pixPercentage = totalGross > 0 ? Math.round((totalPix / totalGross) * 100) : 72;
  const cardPercentage = 100 - pixPercentage;

  const gatewayFees = totalPix * 0.0089 + totalCard * 0.0289;
  const cmvEstimated = totalGross * (selectedNiche === 'hospedagem' ? 0.18 : selectedNiche === 'passeios_barcos' ? 0.22 : 0.29);
  const netOperatingProfit = totalGross - gatewayFees - cmvEstimated;
  const netMarginPercent = totalGross > 0 ? Math.round((netOperatingProfit / totalGross) * 100) : 68;

  const occupiedSuites = suites.filter((s) => s.status === 'ocupado' || s.status === 'checkin_hoje').length;

  const occupiedTables = tables.filter((t) => t.status !== 'livre').length;
  const tablesOccupancyRate = Math.round((occupiedTables / tables.length) * 100);

  const uniqueCustomers = Array.from(
    new Map(
      nicheOrders.map((o) => [
        o.customer.phone,
        {
          name: o.customer.name,
          phone: o.customer.phone,
          whatsappFormatted: o.customer.whatsappFormatted,
          totalSpent: nicheOrders
            .filter((x) => x.customer.phone === o.customer.phone)
            .reduce((sum, item) => sum + item.totalAmount, 0),
          ordersCount: nicheOrders.filter((x) => x.customer.phone === o.customer.phone).length,
          lastOrderDate: o.createdAt,
        },
      ])
    ).values()
  );

  // Perfis Enriquecidos de Clientes para CRM & Fidelidade NFC
  const crmCustomerProfiles: CustomerProfile[] = useMemo(() => {
    const dishCatalog = [
      'Moqueca de Robalo na Telha',
      'Camarão VG na Castanha de Caju',
      'Gin Tônica de Frutas Nativas',
      'Pastel de Arraia do Pará (6un)',
      'Polvo Grelhado na Brasa',
      'Risoto de Frutos do Rio Caraíva'
    ];
    const tableOptions = ['Mesa 01 (Balcão)', 'Mesa 02 (Jardim)', 'Mesa 03 (Vista Rio)', 'Mesa 05 (Lounge)'];
    const emojis = ['👑', '🏄‍♂️', '🌺', '🍹', '🌴', '⛵', '✨', '🌊'];

    return uniqueCustomers.map((c, idx) => {
      const isVip = c.totalSpent > 300;
      const isFrequent = c.ordersCount >= 2;
      const segment: CustomerProfile['segment'] = isVip ? 'vip' : isFrequent ? 'frequente' : idx % 3 === 0 ? 'em_risco' : 'novo';
      return {
        name: c.name,
        phone: c.phone,
        whatsappFormatted: c.whatsappFormatted,
        totalSpent: c.totalSpent,
        ordersCount: c.ordersCount,
        lastVisit: idx === 0 ? 'Hoje, 20:15' : idx === 1 ? 'Ontem, 21:30' : 'Há 3 dias',
        favoriteDish: dishCatalog[idx % dishCatalog.length],
        preferredTable: tableOptions[idx % tableOptions.length],
        segment,
        avatarEmoji: emojis[idx % emojis.length],
      };
    });
  }, [uniqueCustomers]);

  const handleAdvanceStatus = (orderId: string, nextStatus: UnifiedOrderStatus) => {
    const updated = updateOrderStatus(orderId, nextStatus);
    if (updated) {
      setOrders(getUnifiedOrders());
    }
  };

  const handleToggleSuiteStatus = (suiteId: string, nextStatus: SuiteRoom['status']) => {
    setSuites((prev) =>
      prev.map((s) => (s.id === suiteId ? { ...s, status: nextStatus } : s))
    );
  };

  const handleToggleProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p))
    );
  };

  const handleAdjustStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const handleCloseTableBill = (tableNumber: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? {
              ...t,
              status: 'livre',
              currentTotal: 0,
              paidSoFar: 0,
              peopleTapCount: 0,
              openMinutes: 0,
              activeCall: undefined,
              callMinutesAgo: undefined,
              items: [],
            }
          : t
      )
    );
  };

  const handleClearTableCall = (tableNumber: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? {
              ...t,
              activeCall: undefined,
              callMinutesAgo: undefined,
              status: t.status === 'ociosa' ? 'comanda_aberta' : t.status,
            }
          : t
      )
    );
  };

  const handleReceiveTablePayment = (tableNumber: string, amount: number) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber !== tableNumber) return t;
        const nextPaid = Math.min(t.currentTotal, t.paidSoFar + amount);
        return {
          ...t,
          paidSoFar: nextPaid,
          status: nextPaid >= t.currentTotal && t.currentTotal > 0 ? 'pedindo_conta' : t.status,
        };
      })
    );
  };

  const handleTriggerWaiterCall = (tableNumber: string, callText: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? {
              ...t,
              activeCall: callText,
              callMinutesAgo: 1,
              status: t.status === 'livre' ? 'comanda_aberta' : t.status,
            }
          : t
      )
    );
  };

  const handleAdjustPosCart = (menuItemId: string, delta: number) => {
    setPosCart((prev) => {
      const current = prev[menuItemId] || 0;
      const next = Math.max(0, current + delta);
      const copy = { ...prev };
      if (next === 0) {
        delete copy[menuItemId];
      } else {
        copy[menuItemId] = next;
      }
      return copy;
    });
  };

  const handleSubmitManualPosOrder = () => {
    const selectedEntries = Object.entries(posCart).filter(([, qty]) => qty > 0);
    if (selectedEntries.length === 0) return;

    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newConsumedItems: TableConsumedItem[] = [];
    const orderItems = selectedEntries.map(([itemId, qty]) => {
      const menuObj = RESTAURANT_QUICK_MENU.find((m) => m.id === itemId)!;
      newConsumedItems.push({
        id: `it-${Date.now()}-${itemId}`,
        name: menuObj.name,
        qty,
        unitPrice: menuObj.price,
        orderedBy: 'Garçom (Manual)',
        time: nowTime,
        station: menuObj.station,
      });
      return {
        id: menuObj.id,
        name: menuObj.name,
        quantity: qty,
        unitPrice: menuObj.price,
        subtotal: menuObj.price * qty,
        notes: posNotes.trim() || undefined,
      };
    });

    const addedTotal = orderItems.reduce((acc, i) => acc + i.subtotal, 0);

    if (posTargetTable !== 'delivery_pousada') {
      setTables((prev) =>
        prev.map((t) => {
          if (t.tableNumber !== posTargetTable) return t;
          return {
            ...t,
            status: 'comanda_aberta',
            currentTotal: t.currentTotal + addedTotal,
            openMinutes: t.openMinutes > 0 ? t.openMinutes : 1,
            peopleTapCount: t.peopleTapCount > 0 ? t.peopleTapCount : 2,
            items: [...newConsumedItems, ...t.items],
          };
        })
      );
      setSelectedTableNumber(posTargetTable);
    }

    createUnifiedOrder({
      businessId: 'boteco-do-para',
      businessName: 'Boteco do Pará',
      niche: 'gastronomia',
      orderType: posTargetTable === 'delivery_pousada' ? 'delivery' : 'mesa',
      customer: {
        name:
          posCustomerName.trim() ||
          (posTargetTable === 'delivery_pousada' ? 'Cliente Delivery Manual' : `Mesa ${posTargetTable} (Garçom)`),
        phone: '73999112233',
        whatsappFormatted: '5573999112233',
      },
      items: orderItems,
      totalAmount: addedTotal,
      paidAmount: 0,
      paymentMethod: 'pix',
      paymentStatus: 'pending',
      destination:
        posTargetTable === 'delivery_pousada'
          ? {
              type: 'pousada',
              label: 'Delivery Lançado no Caixa',
              detail: posNotes.trim() || 'Entregar na Pousada / Vila',
            }
          : {
              type: 'mesa',
              label: `Mesa ${posTargetTable} • Lançamento Manual`,
              detail: `Mesa ${posTargetTable} (Pedido lançado pelo Garçom)`,
            },
      notes: posNotes.trim() || undefined,
    });

    setOrders(getUnifiedOrders());
    setPosCart({});
    setPosNotes('');
    setPosCustomerName('');
    setPosSuccessFeedback(
      posTargetTable === 'delivery_pousada'
        ? `Pedido de ${formatCurrency(addedTotal)} enviado para a Cozinha (Delivery)!`
        : `Pedido de ${formatCurrency(addedTotal)} lançado na Mesa ${posTargetTable} e enviado para a Cozinha!`
    );
    setTimeout(() => setPosSuccessFeedback(null), 3500);
  };

  const handleCopyShiftReport = () => {
    const reportText = [
      `📊 *FECHAMENTO DE TURNO — ${currentBusinessUnit.name.toUpperCase()}*`,
      `──────────────────────────`,
      `💰 (+) Receita Bruta: ${formatCurrency(totalGross)}`,
      `⚡ Via Pix NFC (0,89%): ${formatCurrency(totalPix)} (${pixPercentage}%)`,
      `💳 Via Cartão / Apple Pay: ${formatCurrency(totalCard)} (${cardPercentage}%)`,
      `📉 (-) Taxas Adquirente: -${formatCurrency(gatewayFees)}`,
      `📦 (-) CMV / Custos Insumos: -${formatCurrency(cmvEstimated)}`,
      `──────────────────────────`,
      `✅ (=) LUCRO LÍQUIDO REAL: ${formatCurrency(netOperatingProfit)} (Margem ${netMarginPercent}%)`,
    ].join('\n');

    navigator.clipboard.writeText(reportText).catch(() => {});
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // ============================================================================
  // TELA 1: CENTRALIZADOR DE NEGÓCIOS (HUB DA REDE CARAÍVA DIGITAL)
  // ============================================================================
  if (viewMode === 'hub_centralizador') {
    const filteredBusinesses = BUSINESS_DIRECTORY.filter(
      (b) =>
        b.name.toLowerCase().includes(hubSearch.toLowerCase()) ||
        b.categoryLabel.toLowerCase().includes(hubSearch.toLowerCase()) ||
        b.systemModuleTitle.toLowerCase().includes(hubSearch.toLowerCase())
    );

    const networkTotalGmv = BUSINESS_DIRECTORY.reduce((acc, b) => acc + b.todayRevenuePreview, 0);
    const networkTotalPlates = BUSINESS_DIRECTORY.reduce((acc, b) => acc + b.nfcPlatesActive, 0);

    return (
      <div className="min-h-screen bg-[#0B0D10] text-slate-100 font-sans pb-24">
        {/* Topbar Minimalista do Centralizador */}
        <header className="sticky top-0 z-30 bg-[#0B0D10]/90 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-200">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Centralizador de Sistemas B2B
                  </span>
                </div>
                <h1 className="text-base font-bold text-white tracking-tight">
                  Painel Central dos 4 Sistemas Operacionais
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/entregas"
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition"
              >
                <span>🏍️ App Motoboy & Mapa</span>
              </Link>
              <Link
                to="/guia/pedidos"
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
              >
                <span>App do Cliente</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/guia"
                className="px-3.5 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-200 text-xs font-semibold transition"
              >
                Abrir Guia
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
          {/* Resumo Executivo Clean da Plataforma */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#121519] border border-white/[0.06] space-y-1">
              <span className="text-xs font-medium text-slate-400">Sistemas do Ecossistema</span>
              <div className="flex items-baseline justify-between pt-1">
                <strong className="text-2xl font-bold text-white">4 Módulos Ativos</strong>
                <span className="text-xs text-emerald-400 font-medium">100% Operacional</span>
              </div>
              <p className="text-[11px] text-slate-500">Gastronomia, Hotelaria, Náutica e Varejo</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121519] border border-white/[0.06] space-y-1">
              <span className="text-xs font-medium text-slate-400">Volume Total Simulado Hoje</span>
              <div className="flex items-baseline justify-between pt-1">
                <strong className="text-2xl font-bold text-white">{formatCurrency(networkTotalGmv)}</strong>
                <span className="text-xs text-slate-400 font-medium">Pix & Tap NFC</span>
              </div>
              <p className="text-[11px] text-slate-500">Fluxos transacionais unificados</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121519] border border-white/[0.06] space-y-1">
              <span className="text-xs font-medium text-slate-400">Pontos de Toque NFC Ativos</span>
              <div className="flex items-baseline justify-between pt-1">
                <strong className="text-2xl font-bold text-white">{networkTotalPlates} tags / placas</strong>
                <span className="text-xs text-slate-300 font-medium">Salão, Quartos & Peças</span>
              </div>
              <p className="text-[11px] text-slate-500">Abertura instantânea no smartphone</p>
            </div>
          </div>

          {/* Barra de Busca e Instrução de Redirecionamento */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h2 className="text-lg font-bold text-white">Selecione o Sistema para Visualizar e Editar</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Acesse o ambiente operacional dedicado de cada nicho de mercado.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={hubSearch}
                onChange={(e) => setHubSearch(e.target.value)}
                placeholder="Buscar módulo ou nicho..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#121519] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/25"
              />
            </div>
          </div>

          {/* Grid Clean dos Negócios que Redirecionam para seus Sistemas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBusinesses.map((biz) => (
              <div
                key={biz.id}
                onClick={() => handleOpenBusinessUnit(biz.niche, biz.id)}
                className="p-6 rounded-2xl bg-[#121519] hover:bg-[#161A20] border border-white/[0.07] hover:border-white/[0.18] transition cursor-pointer flex flex-col justify-between gap-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-200">
                        {biz.niche === 'gastronomia' && <Utensils className="w-4 h-4" />}
                        {biz.niche === 'hospedagem' && <BedDouble className="w-4 h-4" />}
                        {biz.niche === 'passeios_barcos' && <Compass className="w-4 h-4" />}
                        {biz.niche === 'conveniencia' && <Package className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-slate-400">
                          {biz.categoryLabel} • {biz.location}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition">
                          {biz.name}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] font-medium text-slate-300">
                      {biz.nfcPlatesActive} tags NFC
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B0D10] border border-white/[0.05] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                        Módulo Operacional
                      </span>
                      <strong className="text-slate-200 font-semibold mt-0.5 block">
                        {biz.systemModuleTitle}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                        Hoje
                      </span>
                      <strong className="text-white font-bold mt-0.5 block">
                        {formatCurrency(biz.todayRevenuePreview)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{biz.statusText}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-0.5 transition">
                    <span>Abrir Painel</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ============================================================================
  // TELA 2: AMBIENTE INDIVIDUAL DO NEGÓCIO (CLEAN, SEPARADO POR TELAS)
  // ============================================================================
  const activeWaiterCalls = tables.filter((t) => Boolean(t.activeCall));
  const posCartTotalItems = Object.values(posCart).reduce((acc, q) => acc + q, 0);
  const posCartTotalAmount = Object.entries(posCart).reduce((acc, [id, qty]) => {
    const item = RESTAURANT_QUICK_MENU.find((m) => m.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-100 font-sans pb-28">
      {/* TOPBAR CLEAN DO ESTABELECIMENTO INDIVIDUAL */}
      <header className="sticky top-0 z-30 bg-[#0B0D10]/90 backdrop-blur-xl border-b border-white/[0.06] px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToHub}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Voltar para a Central de Negócios"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Central de Negócios</span>
            </button>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-medium text-slate-400">
                  {currentBusinessUnit.categoryLabel} • {currentBusinessUnit.systemModuleTitle}
                </span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">
                {currentBusinessUnit.name}
              </h1>
            </div>
          </div>

          {/* Ações Rápidas Clean no Topo */}
          <div className="flex items-center gap-2">
            {/* Troca rápida de negócio se desejar */}
            <select
              value={selectedNiche}
              onChange={(e) => handleOpenBusinessUnit(e.target.value as OrderNiche)}
              className="px-3 py-1.5 rounded-xl bg-[#121519] border border-white/[0.08] text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              {BUSINESS_DIRECTORY.map((b) => (
                <option key={b.id} value={b.niche} className="bg-[#121519] text-white">
                  Alternar: {b.name}
                </option>
              ))}
            </select>

            <button
              onClick={reloadData}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition cursor-pointer"
              title="Sincronizar"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO UNIVERSAL PADRONIZADA (4 ABAS EM TODOS OS NICHOS) */}
        <div className="max-w-6xl mx-auto pt-3 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveUniversalTab('operacao_principal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                activeUniversalTab === 'operacao_principal'
                  ? 'bg-white text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>
                {selectedNiche === 'gastronomia'
                  ? `1. Salão & Mesas (${occupiedTables}/${tables.length})`
                  : selectedNiche === 'hospedagem'
                  ? `1. Mapa de Suítes (${occupiedSuites}/${suites.length})`
                  : selectedNiche === 'passeios_barcos'
                  ? '1. Embarques & Vagas'
                  : '1. Catálogo & Estoque'}
              </span>
              {selectedNiche === 'gastronomia' && activeWaiterCalls.length > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeUniversalTab === 'operacao_principal'
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {activeWaiterCalls.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveUniversalTab('fila_pedidos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                activeUniversalTab === 'fila_pedidos'
                  ? 'bg-white text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>
                {selectedNiche === 'gastronomia'
                  ? `2. Cozinha, Bar & PDV (${nicheOrders.length})`
                  : selectedNiche === 'hospedagem'
                  ? '2. Concierge & Chamados'
                  : selectedNiche === 'passeios_barcos'
                  ? '2. Check-in NFC no Píer'
                  : '2. Encomendas & Scan-and-Go'}
              </span>
            </button>

            <button
              onClick={() => setActiveUniversalTab('financeiro_dre')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                activeUniversalTab === 'financeiro_dre'
                  ? 'bg-white text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>3. Caixa & DRE</span>
            </button>

            <button
              onClick={() => setActiveUniversalTab('crm_clientes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                activeUniversalTab === 'crm_clientes'
                  ? 'bg-white text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>4. Clientes ({uniqueCustomers.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={() => setSpatialViewActive(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  spatialViewActive
                    ? 'bg-gradient-to-r from-[#4EEDB2] to-[#38BDF8] text-slate-950 shadow-[0_0_15px_rgba(78,237,178,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Espacial 3D</span>
              </button>
              <button
                onClick={() => setSpatialViewActive(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  !spatialViewActive
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Painel 2D</span>
              </button>
            </div>

            <button
              onClick={() => setShowConfigModal((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                showConfigModal
                  ? 'bg-white text-slate-950 border-white'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/[0.07]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configurações & NFC</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DO NEGÓCIO */}
      <main className="max-w-6xl mx-auto px-6 pt-6 space-y-6">
        {/* ==================================================================== */}
        {/* SUÍTE ESPACIAL 3D (APPLE VISIONOS & CLAYMORPHISM TÁTIL)              */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'operacao_principal' && spatialViewActive && !showPosLauncher && (
          <CaraivaSpatialSuite3D
            niche={selectedNiche}
            businessName={currentBusinessUnit.name}
            totalGross={totalGross}
            totalPix={totalPix}
            activeWaiterCallsCount={activeWaiterCalls.length}
            onSimulateOrder={() => {
              setPosTargetTable(selectedTableNumber);
              setShowPosLauncher(true);
            }}
            onOpenTable={(tableNum) => {
              setSelectedTableNumber(tableNum);
            }}
          />
        )}

        {/* ==================================================================== */}
        {/* ABA 1: OPERAÇÃO PRINCIPAL — SALÃO & MESAS (GASTRONOMIA)             */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'operacao_principal' && selectedNiche === 'gastronomia' && !spatialViewActive && !showPosLauncher && (
          <div className="space-y-6">
            {/* Resumo Clean em 4 Cards Sóbrios */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 font-medium">Faturamento do Turno</span>
                <p className="text-xl font-bold text-white mt-1">{formatCurrency(totalGross)}</p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {pixPercentage}% via Pix NFC • {cardPercentage}% Cartão
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 font-medium">Mesas Ocupadas</span>
                <p className="text-xl font-bold text-white mt-1">
                  {occupiedTables} de {tables.length} mesas
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Taxa de ocupação: {tablesOccupancyRate}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 font-medium">Chamados de Garçom</span>
                <p className="text-xl font-bold text-white mt-1">{activeWaiterCalls.length} ativos</p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Acionados via Placa NFC na mesa
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06] flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Ação Rápida</span>
                <button
                  onClick={() => {
                    setPosTargetTable(selectedTableNumber);
                    setShowPosLauncher(true);
                  }}
                  className="mt-2 w-full py-2 px-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Lançar Pedido Manual</span>
                </button>
              </div>
            </div>

            {/* Chamados de Garçom Clean (Apenas se houver chamados ativos) */}
            {activeWaiterCalls.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-300" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Quem Chamou o Garçom ({activeWaiterCalls.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">Clique para selecionar a mesa ou confirmar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {activeWaiterCalls.map((t) => (
                    <div
                      key={t.tableNumber}
                      onClick={() => setSelectedTableNumber(t.tableNumber)}
                      className="p-3 rounded-xl bg-[#0B0D10] border border-white/[0.07] hover:border-white/20 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-white">Mesa {t.tableNumber}</strong>
                          <span className="text-[10px] text-slate-500">• {t.waiterName}</span>
                        </div>
                        <p className="text-xs text-amber-200/90 truncate mt-0.5">{t.activeCall}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearTableCall(t.tableNumber);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.15] text-slate-200 font-medium text-[11px] shrink-0 cursor-pointer transition"
                      >
                        Atender
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout Duplo Clean: Mapa de Mesas (7 col) + Comanda da Mesa Selecionada (5 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Esquerda: Mapa de Mesas */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">
                    Mapa de Mesas (Toque na mesa para ver a conta)
                  </h2>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Livre
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-300" /> Ocupada
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" /> Fechando Conta
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {tables.map((table) => {
                    const isSelected = selectedTableNumber === table.tableNumber;
                    const splitPercent =
                      table.currentTotal > 0 ? Math.round((table.paidSoFar / table.currentTotal) * 100) : 0;
                    const remaining = Math.max(0, table.currentTotal - table.paidSoFar);

                    const dotColor =
                      table.status === 'livre'
                        ? 'bg-emerald-400'
                        : table.status === 'pedindo_conta'
                        ? 'bg-sky-400'
                        : 'bg-amber-300';

                    return (
                      <div
                        key={table.tableNumber}
                        onClick={() => setSelectedTableNumber(table.tableNumber)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'bg-[#171B21] border-white/40 ring-1 ring-white/20'
                            : 'bg-[#121519] border-white/[0.06] hover:border-white/[0.15]'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-400">{table.zone}</span>
                            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                          </div>

                          <div className="flex items-baseline justify-between">
                            <h4 className="text-base font-bold text-white">Mesa {table.tableNumber}</h4>
                            <span className="text-[10px] text-slate-500">{table.waiterName}</span>
                          </div>

                          <div className="pt-1">
                            <p className="text-sm font-bold text-white">
                              {table.status !== 'livre' ? formatCurrency(table.currentTotal) : 'Livre'}
                            </p>
                            {table.status !== 'livre' && (
                              <p className="text-[11px] text-slate-400">
                                Falta: {formatCurrency(remaining)}
                              </p>
                            )}
                          </div>
                        </div>

                        {table.status !== 'livre' ? (
                          <div className="space-y-1">
                            <div className="w-full h-1 rounded-full bg-white/[0.07] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-400/80"
                                style={{ width: `${splitPercent}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>{table.items.length} itens</span>
                              <span>{splitPercent}% pago</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">Disponível</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direita: Comanda Detalhada da Mesa Selecionada */}
              <div className="lg:col-span-5">
                {(() => {
                  const activeTable =
                    tables.find((t) => t.tableNumber === selectedTableNumber) || tables[0];
                  const remainingToPay = Math.max(0, activeTable.currentTotal - activeTable.paidSoFar);
                  const serviceFee10 = activeTable.currentTotal * 0.1;

                  return (
                    <div className="p-5 rounded-2xl bg-[#121519] border border-white/[0.08] space-y-4">
                      <div className="flex items-start justify-between border-b border-white/[0.06] pb-3.5">
                        <div>
                          <span className="text-[11px] font-medium text-slate-400">
                            Comanda da Mesa • {activeTable.zone}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-0.5">
                            Mesa {activeTable.tableNumber}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Garçom: {activeTable.waiterName} •{' '}
                            {activeTable.openMinutes > 0
                              ? `Aberta há ${activeTable.openMinutes} min`
                              : 'Mesa Livre'}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setPosTargetTable(activeTable.tableNumber);
                            setShowPosLauncher(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-semibold text-xs transition cursor-pointer shrink-0"
                        >
                          + Adicionar Pedido
                        </button>
                      </div>

                      {/* Itens da Mesa */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                          <span>Itens lançados ({activeTable.items.length})</span>
                          <span>Valor</span>
                        </div>

                        {activeTable.items.length > 0 ? (
                          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                            {activeTable.items.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 rounded-xl bg-[#0B0D10] border border-white/[0.05] flex items-center justify-between text-xs"
                              >
                                <div>
                                  <p className="font-medium text-slate-100">
                                    <strong className="text-white">{item.qty}x</strong> {item.name}
                                  </p>
                                  <span className="text-[10px] text-slate-500">
                                    {item.orderedBy} • {item.time}
                                  </span>
                                </div>
                                <strong className="text-slate-200 font-semibold">
                                  {formatCurrency(item.qty * item.unitPrice)}
                                </strong>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 rounded-xl bg-[#0B0D10] border border-white/[0.05] text-center space-y-2">
                            <p className="text-xs text-slate-400">
                              Nenhum pedido aberto na Mesa {activeTable.tableNumber}.
                            </p>
                            <button
                              onClick={() => {
                                setPosTargetTable(activeTable.tableNumber);
                                setShowPosLauncher(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white cursor-pointer"
                            >
                              + Abrir Mesa com Pedido Manual
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Resumo da Conta */}
                      <div className="p-3.5 rounded-xl bg-[#0B0D10] border border-white/[0.05] space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Subtotal Consumo</span>
                          <span className="text-slate-200">{formatCurrency(activeTable.currentTotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Taxa de Serviço (10%)</span>
                          <span>+{formatCurrency(serviceFee10)}</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400/90">
                          <span>Pago via NFC / Parcial</span>
                          <span>-{formatCurrency(activeTable.paidSoFar)}</span>
                        </div>
                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-sm">
                          <span className="font-semibold text-white">Restante a Pagar</span>
                          <strong className="text-base font-bold text-white">
                            {formatCurrency(remainingToPay)}
                          </strong>
                        </div>
                      </div>

                      {/* Ações da Comanda */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleReceiveTablePayment(activeTable.tableNumber, 50)}
                          disabled={remainingToPay <= 0}
                          className="py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-30 text-slate-200 border border-white/[0.08] font-medium text-xs transition cursor-pointer"
                        >
                          Receber R$ 50 (Parcial)
                        </button>
                        <button
                          onClick={() => handleReceiveTablePayment(activeTable.tableNumber, remainingToPay)}
                          disabled={remainingToPay <= 0}
                          className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition cursor-pointer"
                        >
                          Quitar Saldo ({formatCurrency(remainingToPay)})
                        </button>
                        <button
                          onClick={() =>
                            handleTriggerWaiterCall(
                              activeTable.tableNumber,
                              'Solicitou atendimento na mesa'
                            )
                          }
                          className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] font-medium text-xs transition cursor-pointer"
                        >
                          Simular Chamado
                        </button>
                        <button
                          onClick={() => handleCloseTableBill(activeTable.tableNumber)}
                          className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/[0.06] font-medium text-xs transition cursor-pointer"
                        >
                          Liberar Mesa
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PDV LANÇADOR MANUAL DE PEDIDOS (MESA, BALCÃO OU DELIVERY)           */}
        {/* ==================================================================== */}
        {selectedNiche === 'gastronomia' && showPosLauncher && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  Lançar Pedido Manual (Mesa, Balcão ou Delivery)
                </h2>
                <p className="text-xs text-slate-400">
                  Escolha a mesa ou delivery, selecione os itens abaixo e envie direto para a comanda e cozinha.
                </p>
              </div>
              <button
                onClick={() => setShowPosLauncher(false)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-300 cursor-pointer self-start"
              >
                ← Voltar ao Salão de Mesas
              </button>
            </div>

            {posSuccessFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center justify-between">
                <span>✓ {posSuccessFeedback}</span>
                <button
                  onClick={() => setShowPosLauncher(false)}
                  className="underline text-white ml-4 cursor-pointer"
                >
                  Ver no Salão de Mesas →
                </button>
              </div>
            )}

            {/* Passo 1: Escolher Mesa ou Delivery */}
            <div className="p-5 rounded-2xl bg-[#121519] border border-white/[0.07] space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                1. Onde lançar este pedido?
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {tables.map((t) => (
                  <button
                    key={t.tableNumber}
                    onClick={() => setPosTargetTable(t.tableNumber)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      posTargetTable === t.tableNumber
                        ? 'bg-white text-slate-950 border-white'
                        : 'bg-[#0B0D10] text-slate-300 border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    Mesa {t.tableNumber}
                  </button>
                ))}
                <button
                  onClick={() => setPosTargetTable('delivery_pousada')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    posTargetTable === 'delivery_pousada'
                      ? 'bg-white text-slate-950 border-white'
                      : 'bg-[#0B0D10] text-slate-300 border-white/[0.07] hover:border-white/20'
                  }`}
                >
                  Delivery / Balcão
                </button>
              </div>
            </div>

            {/* Passo 2: Selecionar Itens do Cardápio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RESTAURANT_QUICK_MENU.map((item) => {
                  const qty = posCart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        qty > 0
                          ? 'bg-[#171B21] border-white/30'
                          : 'bg-[#121519] border-white/[0.06]'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-semibold text-white mt-0.5">{item.name}</h4>
                        <p className="text-xs font-bold text-slate-300 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleAdjustPosCart(item.id, -1)}
                          className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-white font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white">{qty}</span>
                        <button
                          onClick={() => handleAdjustPosCart(item.id, 1)}
                          className="w-8 h-8 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumo do Lançamento */}
              <div className="lg:col-span-4">
                <div className="p-5 rounded-2xl bg-[#121519] border border-white/[0.08] space-y-4 sticky top-28">
                  <div>
                    <span className="text-[11px] text-slate-400">Destino Selecionado</span>
                    <h3 className="text-base font-bold text-white">
                      {posTargetTable === 'delivery_pousada'
                        ? 'Delivery / Balcão'
                        : `Mesa ${posTargetTable}`}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={posCustomerName}
                      onChange={(e) => setPosCustomerName(e.target.value)}
                      placeholder="Nome do cliente (opcional)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D10] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/25"
                    />
                    <input
                      type="text"
                      value={posNotes}
                      onChange={(e) => setPosNotes(e.target.value)}
                      placeholder="Observação p/ Cozinha (ex: sem cebola)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D10] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/25"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Total ({posCartTotalItems} itens)
                    </span>
                    <strong className="text-lg font-bold text-white">
                      {formatCurrency(posCartTotalAmount)}
                    </strong>
                  </div>

                  <button
                    onClick={handleSubmitManualPosOrder}
                    disabled={posCartTotalItems === 0}
                    className="w-full py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-30 font-semibold text-xs transition cursor-pointer"
                  >
                    Confirmar & Enviar Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 2: FILA DE PEDIDOS & AÇÃO — KDS COZINHA & BAR (GASTRONOMIA)     */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'fila_pedidos' && selectedNiche === 'gastronomia' && !showPosLauncher && (
          <CaraivaKdsActionTab
            niche={selectedNiche}
            orders={nicheOrders}
            onOrderUpdated={() => setOrders(getUnifiedOrders())}
            onOpenPosLauncher={() => setShowPosLauncher(true)}
          />
        )}

        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* ABA 1: OPERAÇÃO PRINCIPAL — MAPA DE SUÍTES & PMS (HOSPEDAGEM)       */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'operacao_principal' && selectedNiche === 'hospedagem' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Mapa de Suítes & Governança (Mini PMS)</h2>
              <p className="text-xs text-slate-400">
                Controle de estadias, limpeza de quartos e chamados feitos na placa NFC de cabeceira.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suites.map((suite) => (
                <div
                  key={suite.id}
                  className="p-5 rounded-2xl bg-[#121519] border border-white/[0.07] space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {suite.category} • Diária {formatCurrency(suite.dailyRate)}
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">{suite.name}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[11px] font-medium text-slate-300">
                      {suite.status === 'ocupado'
                        ? 'Ocupado'
                        : suite.status === 'checkin_hoje'
                        ? 'Check-in Hoje'
                        : suite.status === 'limpeza'
                        ? 'Em Limpeza'
                        : 'Disponível'}
                    </span>
                  </div>

                  {suite.currentGuest ? (
                    <div className="p-3.5 rounded-xl bg-[#0B0D10] border border-white/[0.05] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-white">{suite.currentGuest.name}</strong>
                        <span className="text-emerald-400 font-medium">
                          Pago: {formatCurrency(suite.currentGuest.paidAmount)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {suite.currentGuest.checkIn} até {suite.currentGuest.checkOut} ({suite.currentGuest.guests} hóspedes)
                      </p>
                      {suite.nfcRequests && suite.nfcRequests.length > 0 && (
                        <div className="pt-2 border-t border-white/[0.05] space-y-1">
                          <span className="text-[10px] text-slate-400 font-medium block">
                            Solicitações via NFC do Quarto:
                          </span>
                          {suite.nfcRequests.map((req, i) => (
                            <p key={i} className="text-[11px] text-amber-200/90">
                              • {req}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#0B0D10] border border-white/[0.05] text-xs text-slate-400 flex items-center justify-between">
                      <span>Sincronizado com Guia Caraíva</span>
                      <span className="text-emerald-400">Livre</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {suite.status === 'limpeza' && (
                      <button
                        onClick={() => handleToggleSuiteStatus(suite.id, 'disponivel')}
                        className="w-full py-2 rounded-xl bg-white text-slate-950 font-semibold text-xs cursor-pointer"
                      >
                        Marcar Quarto Limpo
                      </button>
                    )}
                    {suite.status === 'checkin_hoje' && (
                      <button
                        onClick={() => handleToggleSuiteStatus(suite.id, 'ocupado')}
                        className="w-full py-2 rounded-xl bg-white text-slate-950 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <DoorOpen className="w-3.5 h-3.5" />
                        <span>Confirmar Check-in</span>
                      </button>
                    )}
                    {suite.status === 'ocupado' && (
                      <button
                        onClick={() => handleToggleSuiteStatus(suite.id, 'limpeza')}
                        className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-medium text-xs cursor-pointer"
                      >
                        Encerrar Estadia (Check-out)
                      </button>
                    )}
                    {suite.status === 'disponivel' && (
                      <button
                        onClick={() => handleToggleSuiteStatus(suite.id, 'limpeza')}
                        className="w-full py-2 rounded-xl bg-white/[0.04] text-slate-400 text-xs cursor-pointer"
                      >
                        Enviar Governança
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 1: OPERAÇÃO PRINCIPAL — CATÁLOGO & ESTOQUE (CONVENIÊNCIA)       */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'operacao_principal' && selectedNiche === 'conveniencia' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Catálogo, CMV & Etiquetas Scan-and-Go NFC</h2>
              <p className="text-xs text-slate-400">
                Controle de estoque, margem de lucro e produtos sincronizados com as etiquetas inteligentes NFC.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                const profit = product.price - product.costCmv;
                const margin = Math.round((profit / product.price) * 100);
                const isLowStock = product.stock <= product.minStock;

                return (
                  <div
                    key={product.id}
                    className="p-5 rounded-2xl bg-[#121519] border border-white/[0.07] space-y-3.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{product.category}</span>
                      <span className={isLowStock ? 'text-amber-300 font-semibold' : 'text-emerald-400'}>
                        {isLowStock ? 'Estoque Baixo' : 'Ativo'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{product.name}</h4>
                      <div className="flex items-baseline justify-between mt-1.5">
                        <strong className="text-base font-bold text-white">{formatCurrency(product.price)}</strong>
                        <span className="text-[11px] text-emerald-400">Margem {margin}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        CMV: {formatCurrency(product.costCmv)} • {product.nfcScansToday} leituras NFC
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAdjustStock(product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white">{product.stock} un</span>
                        <button
                          onClick={() => handleAdjustStock(product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleToggleProduct(product.id)}
                        className="text-xs text-slate-400 hover:text-white cursor-pointer"
                      >
                        {product.available ? 'Pausar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 1: OPERAÇÃO PRINCIPAL — LOTAÇÃO & SAÍDAS (NÁUTICA)              */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'operacao_principal' && selectedNiche === 'passeios_barcos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 font-medium">Lotação do Dia</span>
                <p className="text-xl font-bold text-white mt-1">9 de 12 vagas</p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">75% da capacidade vendida</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 font-medium">Tábua de Marés</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">Baixa-mar 11:45</p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">0.3m (ideal p/ piscinas)</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 font-medium">Próxima Saída</span>
                <p className="text-xl font-bold text-white mt-1">09:30 • Corumbau</p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Embarque no Píer do Rio</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#121519] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 font-medium">Faturamento Estimado</span>
                <p className="text-xl font-bold text-white mt-1">{formatCurrency(totalGross)}</p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Recebido via Pix NFC</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Embarcações & Saídas Escaladas</h2>
                <span className="text-xs text-slate-400">Píer Municipal de Caraíva</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'b-01',
                    name: 'Lancha Caraíva Star (250 HP)',
                    tour: 'Ponta do Corumbau & Falésias',
                    departure: '09:30',
                    captain: 'Mestre Tiago',
                    booked: 8,
                    capacity: 10,
                    status: 'Embarque em 15m',
                  },
                  {
                    id: 'b-02',
                    name: 'Barco Tatuetê Clássico',
                    tour: 'Pôr do Sol no Rio Caraíva',
                    departure: '16:00',
                    captain: 'Zé do Rio',
                    booked: 11,
                    capacity: 14,
                    status: 'Aguardando Maré',
                  },
                  {
                    id: 'b-03',
                    name: 'Lancha Corais Express',
                    tour: 'Mergulho nos Corais do Tatuaçu',
                    departure: '11:00',
                    captain: 'Mateus Pataxó',
                    booked: 6,
                    capacity: 8,
                    status: 'Confirmada',
                  },
                ].map((boat) => (
                  <div key={boat.id} className="p-5 rounded-2xl bg-[#121519] border border-white/[0.07] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">{boat.tour}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{boat.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-white/[0.05] text-[10px] text-slate-300 border border-white/[0.08]">
                        {boat.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0D10] border border-white/[0.05] text-xs space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Horário:</span>
                        <strong className="text-white">{boat.departure}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Marinheiro:</span>
                        <span>{boat.captain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ocupação:</span>
                        <strong className="text-emerald-400">{boat.booked} / {boat.capacity} vagas</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveUniversalTab('fila_pedidos')}
                      className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 border border-white/[0.08] transition cursor-pointer"
                    >
                      Ver Manifesto & Check-in NFC →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 2: FILA DE PEDIDOS — CONCIERGE & CHAMADOS NFC (HOSPEDAGEM)       */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'fila_pedidos' && selectedNiche === 'hospedagem' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">
                Fila de Concierge & Chamados de Quarto NFC
              </h2>
              <p className="text-xs text-slate-400">
                Solicitações feitas pelos hóspedes ao aproximarem o celular da Placa NFC de cabeceira.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suites
                .filter((s) => s.nfcRequests && s.nfcRequests.length > 0)
                .map((suite) => (
                  <div key={suite.id} className="p-5 rounded-2xl bg-[#121519] border border-white/[0.07] space-y-3.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                          NFC Quarto Ativo
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{suite.name}</h4>
                        <p className="text-xs text-slate-400">Hóspede: {suite.currentGuest?.name || 'Hóspede Cadastrado'}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-300">
                        Pendente
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0B0D10] border border-white/[0.05] space-y-2">
                      <span className="text-[11px] text-slate-400 font-medium">Itens solicitados:</span>
                      {suite.nfcRequests?.map((req, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-slate-200">
                          <span>• {req}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSuites((prev) =>
                            prev.map((s) => (s.id === suite.id ? { ...s, nfcRequests: [] } : s))
                          );
                        }}
                        className="flex-1 py-2 rounded-xl bg-white text-slate-950 font-semibold text-xs cursor-pointer hover:bg-slate-200 transition"
                      >
                        ✓ Marcar Atendido
                      </button>
                      {suite.currentGuest?.phone && (
                        <a
                          href={`https://wa.me/55${suite.currentGuest.phone}?text=${encodeURIComponent(
                            `Olá ${suite.currentGuest.name}! Recebemos sua solicitação no ${suite.name} e nossa equipe já está providenciando.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-emerald-400 border border-white/[0.08] cursor-pointer flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 2: FILA DE PEDIDOS — ENCOMENDAS & SCAN-AND-GO (CONVENIÊNCIA)    */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'fila_pedidos' && selectedNiche === 'conveniencia' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">
                Fila de Encomendas & Pedidos Scan-and-Go ({nicheOrders.length})
              </h2>
              <p className="text-xs text-slate-400">
                Compras feitas por aproximação de etiquetas NFC nas peças físicas ou encomendadas pelo Guia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nicheOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <div key={order.id} className="p-5 rounded-2xl bg-[#121519] border border-white/[0.07] space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-400">{order.orderNumber}</span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{order.customer.name}</h4>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/[0.05] text-slate-300 border border-white/[0.07]">
                          {badge.label}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0B0D10] border border-white/[0.05] text-xs space-y-1.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-slate-200">{it.quantity}x {it.name}</span>
                            <span className="text-slate-400">{formatCurrency(it.subtotal)}</span>
                          </div>
                        ))}
                        {order.destination && (
                          <p className="pt-2 border-t border-white/[0.05] text-[11px] text-slate-400">
                            Entrega: {order.destination.detail}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'concluido')}
                      className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-xs cursor-pointer hover:bg-slate-200 transition"
                    >
                      {order.status === 'concluido' ? 'Pedido Entregue' : 'Confirmar Envio / Retirada'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 2: FILA DE PEDIDOS — FAST CHECK-IN NO PÍER NFC (NÁUTICA)        */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'fila_pedidos' && selectedNiche === 'passeios_barcos' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Manifesto de Embarque & Check-in NFC no Píer</h2>
              <p className="text-xs text-slate-400">
                Aproxime o smartphone do cliente na placa do marinheiro para validar o voucher e autorizar o embarque.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nicheOrders.map((order) => (
                <div key={order.id} className="p-5 rounded-2xl bg-[#121519] border border-white/[0.07] space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-slate-400">{order.orderNumber}</span>
                      <h4 className="text-base font-bold text-white">{order.customer.name}</h4>
                      <p className="text-xs text-slate-400">{order.bookingDetails?.tourTitle}</p>
                    </div>
                    <strong className="text-sm font-bold text-emerald-400">
                      {formatCurrency(order.totalAmount)}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B0D10] border border-white/[0.05] text-xs space-y-1 text-slate-300">
                    <p>Horário: {order.bookingDetails?.timeSlot}</p>
                    <p>Embarque: {order.bookingDetails?.departurePoint}</p>
                    <p>Passageiros: {order.bookingDetails?.guestsCount} pessoas</p>
                  </div>

                  <button
                    onClick={() => handleAdvanceStatus(order.id, 'concluido')}
                    className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-xs cursor-pointer hover:bg-slate-200 transition"
                  >
                    Confirmar Embarque NFC
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* ABA 3: CAIXA & DRE OPERACIONAL (TODOS OS NICHOS)                    */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'financeiro_dre' && (
          <CaraivaFinancialDreTab
            niche={selectedNiche}
            totalGross={totalGross}
            totalPix={totalPix}
            tablesCount={tables.length}
            occupiedCount={occupiedTables}
            onCopyShiftReport={handleCopyShiftReport}
            copiedReport={copiedReport}
          />
        )}

        {/* ==================================================================== */}
        {/* ABA 4: CRM & CLIENTES (TODOS OS NICHOS)                             */}
        {/* ==================================================================== */}
        {activeUniversalTab === 'crm_clientes' && (
          <CaraivaCrmLoyaltyTab
            niche={selectedNiche}
            customers={crmCustomerProfiles}
          />
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL CONFIGURAÇÕES & PLACAS NFC                                     */}
      {/* ==================================================================== */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-[#121519] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-300" />
                  <span>Configurações do Sistema & Placas NFC</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Módulo ativo: {currentBusinessUnit.name} • {currentBusinessUnit.categoryLabel}
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: 'asaasPixSplit',
                  title: 'Gateway Pix Direct & Split NFC',
                  desc: 'Liquidação instantânea na conta do estabelecimento ao aproximar o celular.',
                },
                {
                  key: 'whatsappCloud',
                  title: 'WhatsApp Cloud Notificações',
                  desc: 'Disparo automático de comprovante, voucher e status do pedido.',
                },
                {
                  key: 'thermalPrinter',
                  title: 'Impressora Térmica ESC/POS & KDS',
                  desc: 'Envio direto para produção na cozinha e bar sem redigitação.',
                },
                {
                  key: 'sefazNfce',
                  title: 'Emissão Fiscal NFC-e Automática',
                  desc: 'Geração de nota fiscal após confirmação do pagamento.',
                },
              ].map((item) => {
                const isActive = apiConnections[item.key as keyof typeof apiConnections];
                return (
                  <div
                    key={item.key}
                    className="p-5 rounded-2xl bg-[#0B0D10] border border-white/[0.07] flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setApiConnections((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof apiConnections],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      {isActive ? 'Conectado' : 'Desativado'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Resumo das Placas NFC do Estabelecimento */}
            <div className="p-5 rounded-2xl bg-[#0B0D10] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                  <Wifi className="w-4 h-4 text-slate-400" />
                  <span>{currentBusinessUnit.nfcPlatesActive} Placas / Smart Tags NFC Vinculadas</span>
                </div>
                <p className="text-xs text-slate-400">
                  Link gravado no chip NTAG215: <code className="text-slate-200">caraiva.digital/guia?biz={currentBusinessUnit.id}</code>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/guia"
                  className="px-4 py-2 rounded-xl bg-white text-slate-950 font-semibold text-xs flex items-center gap-1.5 shrink-0"
                >
                  <span>Simular Leitura</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-xs cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CaraivaUniversalBusinessApp;
