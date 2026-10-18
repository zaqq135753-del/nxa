import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Users,
  MessageCircle,
  QrCode,
  ChefHat,
  Compass,
  BedDouble,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Send,
  Store,
  Package,
  DoorOpen,
  KeyRound,
  Zap,
  Flame,
  TrendingUp,
  Copy,
  Check,
  BellRing,
  Clock,
  Award,
  ArrowUpRight,
  Smartphone,
  ShieldCheck,
  Utensils,
  Wifi
} from 'lucide-react';
import {
  getUnifiedOrders,
  updateOrderStatus,
  type UnifiedOrder,
  type UnifiedOrderStatus,
  getStatusBadge,
  formatCurrency,
  type OrderNiche
} from '../../services/villageUnifiedOrdersService';

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
// 2. MODELOS DO TAPTABLE (SALÃO & MESAS NFC)
// ==========================================
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
}

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
    activeCall: '🧊 Trazer Gelo & Limão',
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
    activeCall: '💳 Fechando no Split Bill NFC (3/4 pagos)',
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
    activeCall: '⚠️ 32 min sem novo pedido (Sugerir Rodada)',
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
    activeCall: '🥃 +2 Copos Limpos',
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

export const CaraivaUniversalBusinessApp: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<UnifiedOrder[]>(() => getUnifiedOrders());
  const [selectedNiche, setSelectedNiche] = useState<OrderNiche>(() => {
    const fromUrl = searchParams.get('nicho') as OrderNiche;
    return fromUrl || 'gastronomia';
  });
  const [activeTab, setActiveTab] = useState<
    'operacao' | 'mesas_taptable' | 'financeiro' | 'crm' | 'integracoes_api' | 'placa_nfc'
  >('operacao');

  const [suites, setSuites] = useState<SuiteRoom[]>(INITIAL_SUITES);
  const [tables, setTables] = useState<TapTableFloorSeat[]>(INITIAL_TABLES);
  const [products, setProducts] = useState<RetailProduct[]>(INITIAL_PRODUCTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [kdsStation, setKdsStation] = useState<'todas' | 'cozinha_quente' | 'bar_drinks'>('todas');

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

  const handleNicheChange = (niche: OrderNiche) => {
    setSelectedNiche(niche);
    setSearchParams({ nicho: niche });
    if (activeTab === 'mesas_taptable' && niche !== 'gastronomia') {
      setActiveTab('operacao');
    }
  };

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

  // Custos para o DRE
  const gatewayFees = totalPix * 0.0089 + totalCard * 0.0289; // 0.89% Pix, 2.89% Cartão
  const cmvEstimated = totalGross * (selectedNiche === 'hospedagem' ? 0.18 : selectedNiche === 'passeios_barcos' ? 0.22 : 0.29);
  const serviceTipPool = selectedNiche === 'gastronomia' ? totalGross * 0.1 : 0;
  const netOperatingProfit = totalGross - gatewayFees - cmvEstimated;
  const netMarginPercent = totalGross > 0 ? Math.round((netOperatingProfit / totalGross) * 100) : 68;
  const estimatedIfoodLoss = totalGross * 0.25;

  // Métricas de Ocupação por Nicho (Para o Widget 2 ser 100% contextual!)
  const occupiedSuites = suites.filter((s) => s.status === 'ocupado' || s.status === 'checkin_hoje').length;
  const suitesOccupancyRate = Math.round((occupiedSuites / suites.length) * 100);

  const occupiedTables = tables.filter((t) => t.status !== 'livre').length;
  const tablesOccupancyRate = Math.round((occupiedTables / tables.length) * 100);

  const occupancyWidgetData =
    selectedNiche === 'hospedagem'
      ? {
          title: 'OCUPAÇÃO SUÍTES',
          rate: suitesOccupancyRate,
          subtitle: `${occupiedSuites} de ${suites.length} suítes reservadas`,
          badge: 'Mini PMS',
        }
      : selectedNiche === 'passeios_barcos'
      ? {
          title: 'LOTAÇÃO LANCHAS',
          rate: 75,
          subtitle: '9 de 12 vagas preenchidas hoje',
          badge: 'Maré 0.2m',
        }
      : selectedNiche === 'conveniencia'
      ? {
          title: 'CONVERSÃO TAG NFC',
          rate: 84,
          subtitle: '104 leituras NFC nas peças hoje',
          badge: 'Scan & Go',
        }
      : {
          title: 'OCUPAÇÃO MESAS NFC',
          rate: tablesOccupancyRate,
          subtitle: `${occupiedTables} de ${tables.length} mesas com comanda`,
          badge: 'Giro 42m',
        };

  // Barras Horárias por Nicho (Com alturas fixas em pixels para nunca colapsar!)
  const hourlyBars =
    selectedNiche === 'hospedagem'
      ? [
          { label: '09h', px: 16, val: 'Café' },
          { label: '12h', px: 28, val: 'Out' },
          { label: '14h', px: 42, val: 'Check-in', hot: true },
          { label: '17h', px: 32, val: 'Concierge' },
          { label: '20h', px: 24, val: 'Jantar' },
          { label: '22h', px: 14, val: 'Noite' },
        ]
      : selectedNiche === 'passeios_barcos'
      ? [
          { label: '08h', px: 30, val: 'Saída 1' },
          { label: '09:30', px: 42, val: 'Corumbau', hot: true },
          { label: '12h', px: 26, val: 'Corais' },
          { label: '15h', px: 34, val: 'Buggy' },
          { label: '17h', px: 38, val: 'Rio' },
          { label: '19h', px: 12, val: 'Doca' },
        ]
      : [
          { label: '11h', px: 16, val: 'R$ 320' },
          { label: '13h', px: 32, val: 'R$ 890' },
          { label: '15h', px: 22, val: 'R$ 540' },
          { label: '17h', px: 42, val: 'R$ 1.480', hot: true },
          { label: '19h', px: 28, val: 'R$ 760' },
          { label: '21h', px: 36, val: 'R$ 1.120' },
        ];

  // CRM
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
          ? { ...t, status: 'livre', currentTotal: 0, paidSoFar: 0, peopleTapCount: 0, openMinutes: 0, activeCall: undefined }
          : t
      )
    );
  };

  const handleClearTableCall = (tableNumber: string) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, activeCall: undefined, status: t.status === 'ociosa' ? 'comanda_aberta' : t.status } : t))
    );
  };

  const handleCopyShiftReport = () => {
    const reportText = [
      `📊 *FECHAMENTO DE TURNO — TAPTABLE & CARAÍVA BUSINESS OS*`,
      `Estabelecimento: ${
        selectedNiche === 'gastronomia'
          ? 'Boteco do Pará'
          : selectedNiche === 'hospedagem'
          ? 'Pousada Casa da Praia'
          : selectedNiche === 'passeios_barcos'
          ? 'Caraíva Brasil Turismo'
          : 'Ateliê Arte da Terra'
      }`,
      `──────────────────────────`,
      `💰 (+) Receita Bruta: ${formatCurrency(totalGross)}`,
      `⚡ Via Pix NFC (0,89%): ${formatCurrency(totalPix)} (${pixPercentage}%)`,
      `💳 Via Cartão / Apple Pay: ${formatCurrency(totalCard)} (${cardPercentage}%)`,
      `📉 (-) Taxas Adquirente: -${formatCurrency(gatewayFees)}`,
      `📦 (-) CMV / Custos Insumos: -${formatCurrency(cmvEstimated)}`,
      `──────────────────────────`,
      `✅ (=) LUCRO LÍQUIDO REAL: ${formatCurrency(netOperatingProfit)} (Margem ${netMarginPercent}%)`,
      `🔥 Economia vs. iFood/OTAs: +${formatCurrency(estimatedIfoodLoss)} preservados no caixa`,
      `⭐ NPS do Turno: 94 (Excelente)`,
    ].join('\n');

    navigator.clipboard.writeText(reportText).catch(() => {});
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#07090A] text-[#FFF4ED] font-sans pb-32 selection:bg-[#F6C945] selection:text-slate-950">
      {/* ======================================================== */}
      {/* TOPBAR EXECUTIVO                                         */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#07090A]/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link
              to="/guia"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              ← Guia B2C
            </Link>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h1 className="text-xs font-black tracking-widest uppercase text-white">
                TapTable • Business OS
              </h1>
              <span className="hidden md:inline-flex text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F6C945]/15 text-[#F6C945] border border-[#F6C945]/30">
                NFC Intelligence 3.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShiftReport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition cursor-pointer"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'DRE Copiado!' : 'Copiar Fechamento'}</span>
            </button>

            <button
              onClick={reloadData}
              className={`p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer ${
                isRefreshing ? 'animate-spin text-[#F6C945]' : ''
              }`}
              title="Atualizar dados em tempo real"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              to="/guia/pedidos"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
            >
              <span className="hidden sm:inline">Tela do Cliente</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* SELETOR DE ESTABELECIMENTO MULTI-NICHO                   */}
      {/* ======================================================== */}
      <div className="border-b border-white/[0.06] bg-[#0A0D10] px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            <Store className="w-3.5 h-3.5 text-[#F6C945]" /> Negócio:
          </span>

          <button
            onClick={() => handleNicheChange('gastronomia')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'gastronomia'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Boteco do Pará (Restaurante & TapTable NFC)</span>
          </button>

          <button
            onClick={() => handleNicheChange('hospedagem')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'hospedagem'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Pousada Casa da Praia (Mini PMS & Quarto NFC)</span>
          </button>

          <button
            onClick={() => handleNicheChange('passeios_barcos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'passeios_barcos'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Caraíva Brasil (Lanchas & Embarque NFC)</span>
          </button>

          <button
            onClick={() => handleNicheChange('conveniencia')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'conveniencia'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Ateliê Arte da Terra (Varejo Scan & Go NFC)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4 WIDGETS GRÁFICOS VISUAIS (100% CONTEXTUAIS POR NICHO)  */}
      {/* ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* WIDGET 1: DONUT DE RECEITA & PIX VS CARTÃO */}
          <div className="p-4 rounded-3xl bg-[#111417] border border-white/[0.08] flex items-center justify-between shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Faturamento Hoje
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  +18%
                </span>
              </div>
              <p className="text-2xl font-black text-white">{formatCurrency(totalGross)}</p>
              <div className="flex flex-wrap items-center gap-2 text-[10px] pt-1">
                <span className="flex items-center gap-1 text-[#F6C945] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#F6C945]" /> {pixPercentage}% Pix ({formatCurrency(totalPix)})
                </span>
                <span className="flex items-center gap-1 text-sky-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-sky-400" /> {cardPercentage}% Cartão
                </span>
              </div>
            </div>

            {/* SVG Donut Ring */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e242b" strokeWidth="4.2" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#F6C945"
                  strokeWidth="4.2"
                  strokeDasharray={`${pixPercentage * 0.88} 100`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4.2"
                  strokeDasharray={`${cardPercentage * 0.88} 100`}
                  strokeDashoffset={`-${pixPercentage * 0.88}`}
                  strokeLinecap="round"
                />
              </svg>
              <Zap className="w-4 h-4 text-[#F6C945] absolute" />
            </div>
          </div>

          {/* WIDGET 2: TERMÔMETRO DE OCUPAÇÃO / CONVERSÃO DO NICHO */}
          <div className="p-4 rounded-3xl bg-[#111417] border border-white/[0.08] flex flex-col justify-between shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {occupancyWidgetData.title}
              </span>
              <span className="text-sm font-black text-[#F6C945]">{occupancyWidgetData.rate}%</span>
            </div>

            {/* Barra de Progresso Segmentada */}
            <div className="w-full h-3 rounded-full bg-white/[0.07] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[#F6C945] to-amber-500 transition-all duration-500"
                style={{ width: `${occupancyWidgetData.rate}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">{occupancyWidgetData.subtitle}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-emerald-400 border border-white/10">
                {occupancyWidgetData.badge}
              </span>
            </div>
          </div>

          {/* WIDGET 3: GRÁFICO DE BARRAS DE PICO HORÁRIO (ALTURAS EM PX NÍTIDAS) */}
          <div className="p-4 rounded-3xl bg-[#111417] border border-white/[0.08] flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Curva de Demanda
              </span>
              <span className="text-[10px] font-extrabold text-[#F6C945] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#F6C945]" /> Pico 17h Pôr do Sol
              </span>
            </div>

            {/* Barras com alturas em pixels explícitas */}
            <div className="flex items-end justify-between gap-2 pt-1 h-14">
              {hourlyBars.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      bar.hot
                        ? 'bg-gradient-to-t from-[#F6C945] to-[#ffe07d] shadow-md shadow-[#F6C945]/30'
                        : 'bg-slate-700/70 group-hover:bg-slate-500'
                    }`}
                    style={{ height: `${bar.px}px` }}
                    title={`${bar.label}: ${bar.val}`}
                  />
                  <span className={`text-[9px] font-bold ${bar.hot ? 'text-[#F6C945]' : 'text-slate-400'}`}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 4: LUCRO LÍQUIDO & ECONOMIA REAL ZERO COMISSÃO */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-[#111715] to-[#111417] border border-emerald-500/30 flex items-center justify-between shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                Lucro Líquido Real (DRE)
              </span>
              <p className="text-2xl font-black text-emerald-400">
                {formatCurrency(netOperatingProfit)}
              </p>
              <p className="text-[10px] text-slate-300">
                Economia de <strong className="text-white">+{formatCurrency(estimatedIfoodLoss)}</strong> vs iFood
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex flex-col items-center justify-center">
              <span className="text-xs font-black">{netMarginPercent}%</span>
              <span className="text-[8px] uppercase font-bold">Margem</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COPILOT IA DE TURNO (INSIGHT ACIONÁVEL EM 1 CLIQUE)      */}
        {/* ======================================================== */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-[#171510] via-[#121518] to-[#111417] border border-[#F6C945]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F6C945]/15 text-[#F6C945] border border-[#F6C945]/30 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-black text-[#F6C945] uppercase tracking-wider mr-2">
                Copilot IA • Insight Agora:
              </span>
              <span className="text-slate-200">
                {selectedNiche === 'gastronomia'
                  ? 'Mesa 04 está há 32 min sem pedir bebidas e Mesa 03 já pagou 75% da conta via Split Bill NFC.'
                  : selectedNiche === 'hospedagem'
                  ? 'Suíte Amendoeira tem check-in às 14h (hóspede já preencheu ficha no celular via NFC). Bangalô pediu 2 toalhas.'
                  : selectedNiche === 'passeios_barcos'
                  ? 'Maré baixa de 0.2m amanhã às 09:30. Restam apenas 3 vagas na Lancha Corumbau — dispare alerta para hóspedes.'
                  : 'Canga Artesanal teve 34 leituras na etiqueta NFC hoje. Estoque da Cerâmica Rústica chegou ao mínimo (2 un).'}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              setActiveTab(
                selectedNiche === 'gastronomia' ? 'mesas_taptable' : selectedNiche === 'conveniencia' ? 'operacao' : 'financeiro'
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-[#F6C945] text-slate-950 font-black text-xs shrink-0 hover:brightness-110 transition cursor-pointer flex items-center gap-1"
          >
            <span>Agir Agora</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRA DE NAVEGAÇÃO DE ABAS DO SISTEMA                    */}
      {/* ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('operacao')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'operacao'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {selectedNiche === 'hospedagem'
                ? '1. Mapa de Suítes (Mini PMS)'
                : selectedNiche === 'gastronomia'
                ? '1. Cozinha & KDS'
                : selectedNiche === 'conveniencia'
                ? '1. Estoque & Ficha Técnica'
                : '1. Manifesto de Embarque'}
            </span>
          </button>

          {selectedNiche === 'gastronomia' && (
            <button
              onClick={() => setActiveTab('mesas_taptable')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === 'mesas_taptable'
                  ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>2. Salão TapTable NFC ({occupiedTables}/{tables.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'financeiro'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>DRE & Relatório Financeiro</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>CRM & WhatsApp ({uniqueCustomers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('placa_nfc')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'placa_nfc'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tecnologia NFC do Nicho</span>
          </button>

          <button
            onClick={() => setActiveTab('integracoes_api')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'integracoes_api'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Chaves API</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CONTEÚDO 1: OPERAÇÃO POR NICHO                           */}
      {/* ======================================================== */}
      {activeTab === 'operacao' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          {/* A. POUSADAS: MINI PMS + CONCIERGE NFC DO QUARTO */}
          {selectedNiche === 'hospedagem' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-white">Mapa de Ocupação, Governança & Room Service NFC</h3>
                  <p className="text-xs text-slate-400">
                    Controle check-in express, limpeza de camareira e chamados vindos da placa NFC de cada suíte.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suites.map((suite) => (
                  <div
                    key={suite.id}
                    className={`p-5 rounded-3xl border transition shadow-xl space-y-4 ${
                      suite.status === 'ocupado'
                        ? 'bg-[#121920] border-sky-500/40'
                        : suite.status === 'checkin_hoje'
                        ? 'bg-[#1e1c15] border-amber-500/40'
                        : suite.status === 'limpeza'
                        ? 'bg-[#1f1414] border-rose-500/40'
                        : 'bg-[#121614] border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {suite.category.toUpperCase()} • PLACA NFC ATIVA
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{suite.name}</h4>
                        <p className="text-xs text-[#F6C945] font-extrabold">
                          Diária: {formatCurrency(suite.dailyRate)}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                          suite.status === 'ocupado'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : suite.status === 'checkin_hoje'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                            : suite.status === 'limpeza'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {suite.status === 'ocupado'
                          ? 'Em Estadia'
                          : suite.status === 'checkin_hoje'
                          ? 'Check-in Hoje'
                          : suite.status === 'limpeza'
                          ? 'Governança / Sujo'
                          : 'Livre p/ Reserva'}
                      </span>
                    </div>

                    {suite.currentGuest ? (
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-white">{suite.currentGuest.name}</strong>
                          <span className="text-emerald-400 font-bold">
                            Pago: {formatCurrency(suite.currentGuest.paidAmount)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Estadia: {suite.currentGuest.checkIn} até {suite.currentGuest.checkOut} ({suite.currentGuest.guests} hóspedes)
                        </p>

                        {/* Chamados vindos da Placa NFC na Cabeceira da Cama */}
                        {suite.nfcRequests && suite.nfcRequests.length > 0 && (
                          <div className="pt-2 border-t border-white/10 space-y-1">
                            <span className="text-[10px] font-black uppercase text-[#F6C945] flex items-center gap-1">
                              <BellRing className="w-3 h-3" /> Solicitação via Placa NFC da Suíte:
                            </span>
                            {suite.nfcRequests.map((req, idx) => (
                              <p key={idx} className="text-[11px] text-amber-200 bg-amber-500/10 px-2 py-1 rounded-lg">
                                • {req}
                              </p>
                            ))}
                          </div>
                        )}

                        <a
                          href={`https://wa.me/55${suite.currentGuest.phone}?text=${encodeURIComponent(
                            `Olá ${suite.currentGuest.name}! Aqui é da recepção da Pousada Casa da Praia. Seu ${suite.name} está pronto! Senha do Wi-Fi: caraiva2026`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] pt-1 hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Enviar Chave Digital & Wi-Fi no WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                        <span>Sincronizado com Guia Caraíva & Booking</span>
                        <span className="text-emerald-400 font-bold">Disponível</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      {suite.status === 'limpeza' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'disponivel')}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                        >
                          ✓ Confirmar Quarto Limpo & Vistoriado
                        </button>
                      )}
                      {suite.status === 'checkin_hoje' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'ocupado')}
                          className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <DoorOpen className="w-3.5 h-3.5" />
                          <span>Confirmar Entrada (Check-in Express NFC)</span>
                        </button>
                      )}
                      {suite.status === 'ocupado' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'limpeza')}
                          className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition cursor-pointer"
                        >
                          Encerrar Estadia (Check-out) ➔ Enviar Camareira
                        </button>
                      )}
                      {suite.status === 'disponivel' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'limpeza')}
                          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition cursor-pointer"
                        >
                          Solicitar Vistoria de Governança
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B. GASTRONOMIA: KDS COM FILTRO DE PRAÇAS & SLA */}
          {selectedNiche === 'gastronomia' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white">KDS Digital Sem Papel (Praças de Produção)</h3>
                  <p className="text-xs text-slate-400">
                    Pedidos caem direto da placa NFC da mesa ou do delivery para a tela da cozinha/bar.
                  </p>
                </div>

                {/* Seletor de Praça KDS */}
                <div className="flex items-center gap-1.5 bg-[#141719] p-1 rounded-xl border border-white/10">
                  {[
                    { id: 'todas', label: 'Todas as Praças' },
                    { id: 'cozinha_quente', label: '🔥 Cozinha Quente' },
                    { id: 'bar_drinks', label: '🍸 Bar & Coquetéis' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setKdsStation(st.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        kdsStation === st.id ? 'bg-[#F6C945] text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nicheOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-3xl bg-[#141719] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#F6C945]">{order.orderNumber}</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> SLA 12m
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white mt-0.5">{order.customer.name}</h4>
                          </div>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <div className="flex items-start justify-between">
                                <span className="text-slate-100 font-medium">
                                  <strong className="text-[#F6C945]">{i.quantity}x</strong> {i.name}
                                </span>
                                <span className="text-slate-400">{formatCurrency(i.subtotal)}</span>
                              </div>
                              {i.notes && (
                                <p className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                                  ⚠️ {i.notes}
                                </p>
                              )}
                            </div>
                          ))}
                          {order.destination && (
                            <p className="pt-2 border-t border-white/10 text-[11px] text-emerald-300 font-medium">
                              📍 {order.destination.detail}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        {order.status === 'novo' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'preparando')}
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                          >
                            Iniciar Preparo na Cozinha
                          </button>
                        )}
                        {order.status === 'confirmado' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'preparando')}
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                          >
                            Mandar para Fogo / Preparo
                          </button>
                        )}
                        {order.status === 'preparando' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'em_rota')}
                            className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Pronto! Chamar Garçom / Entregador</span>
                          </button>
                        )}
                        {order.status === 'em_rota' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'concluido')}
                            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                          >
                            ✓ Confirmar Entrega na Mesa/Pousada
                          </button>
                        )}
                        {order.status === 'concluido' && (
                          <div className="w-full py-2 rounded-xl bg-emerald-500/10 text-center text-xs font-bold text-emerald-400 border border-emerald-500/20">
                            ✓ Pedido Entregue & Auditado
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* C. VAREJO & LOJAS: FICHA TÉCNICA, CMV & SCAN NFC */}
          {selectedNiche === 'conveniencia' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-white">Estoque Inteligente, Ficha de Custo (CMV) & Scan-and-Go NFC</h3>
                  <p className="text-xs text-slate-400">
                    O turista aproxima o celular da etiqueta NFC na peça, paga no Pix sozinho e recebe na pousada.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                  const profit = product.price - product.costCmv;
                  const margin = Math.round((profit / product.price) * 100);
                  const isLowStock = product.stock <= product.minStock;

                  return (
                    <div
                      key={product.id}
                      className={`p-5 rounded-3xl bg-[#141719] border space-y-3.5 shadow-xl ${
                        isLowStock ? 'border-rose-500/50' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{product.category}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isLowStock
                              ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                              : product.available
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isLowStock ? '⚠️ Repor Estoque' : product.available ? 'Ativo no Guia' : 'Pausado'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">{product.name}</h4>
                        <div className="flex items-baseline justify-between mt-2">
                          <p className="text-lg font-black text-[#F6C945]">{formatCurrency(product.price)}</p>
                          <span className="text-[11px] font-bold text-emerald-400">
                            Margem {margin}% (+{formatCurrency(profit)})
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Custo CMV: {formatCurrency(product.costCmv)} • 📱 {product.nfcScansToday} taps NFC hoje
                        </p>
                      </div>

                      {/* Controle Rápido de Estoque Inline */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAdjustStock(product.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className={`text-xs font-black ${isLowStock ? 'text-rose-400' : 'text-white'}`}>
                            {product.stock} un
                          </span>
                          <button
                            onClick={() => handleAdjustStock(product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleToggleProduct(product.id)}
                          className="text-xs font-bold underline cursor-pointer text-slate-300 hover:text-white"
                        >
                          {product.available ? 'Pausar' : 'Ativar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pedidos de Varejo Recebidos via Scan & Go NFC */}
              <div className="pt-2 space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">
                  Encomendas Scan & Go (Entregar na Pousada do Cliente)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nicheOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-2xl bg-[#141719] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-white">
                          {order.orderNumber} • {order.customer.name}
                        </strong>
                        <span className="text-xs font-black text-[#F6C945]">{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <p className="text-[11px] text-amber-300">📍 {order.destination?.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* D. NÁUTICA & PASSEIOS: MANIFESTO COM CHECK-IN NFC */}
          {selectedNiche === 'passeios_barcos' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">Manifesto de Embarque & Check-in Náutico NFC</h3>
                <p className="text-xs text-slate-400">
                  O passageiro encosta o celular na placa NFC do marinheiro no píer para validar o embarque.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nicheOrders.map((order) => (
                  <div key={order.id} className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-3.5 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-black text-sky-400">{order.orderNumber}</span>
                        <h4 className="text-base font-bold text-white">{order.customer.name}</h4>
                        <p className="text-xs text-slate-400">{order.bookingDetails?.tourTitle}</p>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Pago • {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs space-y-1 text-slate-300">
                      <p>⏰ {order.bookingDetails?.timeSlot}</p>
                      <p>📍 Embarque: {order.bookingDetails?.departurePoint}</p>
                      <p>👥 Passageiros: {order.bookingDetails?.guestsCount} pessoas</p>
                    </div>

                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'concluido')}
                      className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      ✓ Confirmar Embarque via Tap NFC no Píer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ======================================================== */}
      {/* CONTEÚDO 2: SALÃO TAPTABLE NFC (RESTAURANTES GRANDES)    */}
      {/* ======================================================== */}
      {activeTab === 'mesas_taptable' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white">
                Mapa de Salão TapTable NFC (Split Bill & Chamados Seul Tech)
              </h3>
              <p className="text-xs text-slate-400">
                Acompanhe quais mesas estão dividindo a conta pelo celular, chamados objetivos e tempo de permanência.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Livre ({tables.filter((t) => t.status === 'livre').length})
              </span>
              <span className="flex items-center gap-1.5 text-[#F6C945] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F6C945]" /> Consumindo ({tables.filter((t) => t.status === 'comanda_aberta').length})
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Split Bill / Conta ({tables.filter((t) => t.status === 'pedindo_conta').length})
              </span>
            </div>
          </div>

          {/* Grid Interativo das Mesas com Split Bill & Chamados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
              const splitPercent = table.currentTotal > 0 ? Math.round((table.paidSoFar / table.currentTotal) * 100) : 0;
              return (
                <div
                  key={table.tableNumber}
                  className={`p-5 rounded-3xl border transition shadow-xl flex flex-col justify-between space-y-3.5 relative ${
                    table.status === 'pedindo_conta'
                      ? 'bg-[#211414] border-rose-500/50 ring-1 ring-rose-500/30'
                      : table.status === 'ociosa'
                      ? 'bg-[#211a12] border-orange-500/50'
                      : table.status === 'comanda_aberta'
                      ? 'bg-[#1a1812] border-amber-500/40'
                      : 'bg-[#121614] border-emerald-500/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {table.zone} • Garçom {table.waiterName}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          table.status === 'pedindo_conta'
                            ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                            : table.status === 'ociosa'
                            ? 'bg-orange-500/20 text-orange-300'
                            : table.status === 'comanda_aberta'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {table.status === 'pedindo_conta'
                          ? 'Pagando NFC'
                          : table.status === 'ociosa'
                          ? 'Ociosa >80m'
                          : table.status === 'comanda_aberta'
                          ? 'Ativa'
                          : 'Livre'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <h4 className="text-2xl font-black text-white">Mesa {table.tableNumber}</h4>
                      <div className="text-right">
                        <p className="text-base font-black text-[#F6C945]">
                          {table.status !== 'livre' ? formatCurrency(table.currentTotal) : 'R$ 0,00'}
                        </p>
                        {table.peopleTapCount > 0 && (
                          <span className="text-[10px] text-slate-400">
                            📱 {table.peopleTapCount} celulares conectados
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Barra de Progresso de Split Bill (Divisão de Conta na Mesa) */}
                    {table.status !== 'livre' && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Split Bill NFC Pago:</span>
                          <span className="text-emerald-400 font-bold">
                            {formatCurrency(table.paidSoFar)} ({splitPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-400 transition-all"
                            style={{ width: `${splitPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Chamado Inteligente Seul Tech */}
                    {table.activeCall && (
                      <div className="p-2.5 rounded-xl bg-black/50 border border-amber-500/30 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-300 leading-tight">
                          {table.activeCall}
                        </span>
                        <button
                          onClick={() => handleClearTableCall(table.tableNumber)}
                          className="text-[10px] font-black px-2 py-1 rounded bg-amber-500 text-slate-950 shrink-0 cursor-pointer"
                        >
                          Atender
                        </button>
                      </div>
                    )}
                  </div>

                  {table.status !== 'livre' ? (
                    <button
                      onClick={() => handleCloseTableBill(table.tableNumber)}
                      className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Liberar Mesa / Fechar Saldo
                    </button>
                  ) : (
                    <div className="py-2 text-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded-xl">
                      Placa NFC Pronta p/ Aproximação
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Simulador de Rateio de Gorjetas 10% & Ranking de Garçons */}
          <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-[#F6C945] flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Rateio Automático de Gorjetas 10% (Convenção Coletiva)
                </h4>
                <p className="text-xs text-slate-400">
                  Total de Gorjetas no Turno: <strong className="text-white">{formatCurrency(serviceTipPool)}</strong> — dividido sem erro no fechamento.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span>🕺 Equipe de Salão (70%)</span>
                <strong className="text-emerald-400 font-black">{formatCurrency(serviceTipPool * 0.7)}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span>👨‍🍳 Cozinha & Bar (20%)</span>
                <strong className="text-sky-400 font-black">{formatCurrency(serviceTipPool * 0.2)}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span>🧹 Cumins & Apoio (10%)</span>
                <strong className="text-amber-400 font-black">{formatCurrency(serviceTipPool * 0.1)}</strong>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* CONTEÚDO 3: DRE EM TEMPO REAL (`+` `-` `=`) & RELATÓRIOS */}
      {/* ======================================================== */}
      {activeTab === 'financeiro' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white">
                DRE Operacional ao Vivo (`+` `-` `=`) & Fechamento Fiscal
              </h3>
              <p className="text-xs text-slate-400">
                Demonstrativo automático descontando taxas de meios de pagamento e custo de ficha técnica (CMV).
              </p>
            </div>

            <button
              onClick={handleCopyShiftReport}
              className="px-4 py-2.5 rounded-xl bg-[#F6C945] text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-[#F6C945]/20"
            >
              {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReport ? 'Copiado para o WhatsApp!' : 'Exportar Fechamento no WhatsApp'}</span>
            </button>
          </div>

          {/* Cascata Visual DRE (+ - =) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#141719] border border-white/10 space-y-4 shadow-xl">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Cascata de Apuração de Lucro Real
              </h4>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <span className="text-slate-200 font-bold">(+) Receita Bruta Total</span>
                  <strong className="text-base font-black text-white">{formatCurrency(totalGross)}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-rose-300 font-bold">(-) Taxas de Pagamento (Pix 0,89% / Card 2,89%)</span>
                    <p className="text-[10px] text-slate-400">Economia de R$ 28,00 usando Pix NFC na mesa</p>
                  </div>
                  <strong className="text-rose-400 font-bold">- {formatCurrency(gatewayFees)}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-amber-300 font-bold">(-) CMV / Custo de Insumos & Operação</span>
                    <p className="text-[10px] text-slate-400">Cálculo automático pela ficha técnica do nicho</p>
                  </div>
                  <strong className="text-amber-400 font-bold">- {formatCurrency(cmvEstimated)}</strong>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-emerald-900/40 border-2 border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      (=) LUCRO OPERACIONAL LÍQUIDO
                    </span>
                    <p className="text-[11px] text-slate-300">Margem líquida real de {netMarginPercent}%</p>
                  </div>
                  <strong className="text-2xl font-black text-emerald-400">
                    {formatCurrency(netOperatingProfit)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Comparativo de Economia vs Concorrentes de Mercado */}
            <div className="p-6 rounded-3xl bg-[#141719] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#F6C945]">
                  Comparativo de Retenção de Caixa (Sua Economia)
                </h4>
                <p className="text-xs text-slate-400">
                  Veja quanto dinheiro permanece no seu estabelecimento usando o TapTable & Caraíva Digital vs. plataformas com comissão abusiva:
                </p>
              </div>

              <div className="space-y-3 my-auto">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">No Nosso Sistema (Taxa 0% de comissão):</span>
                    <strong className="text-emerald-400">{formatCurrency(totalGross - gatewayFees)} no seu bolso</strong>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">No iFood / OTAs Tradicionais (-25% comissão):</span>
                    <strong className="text-rose-400">{formatCurrency(totalGross * 0.75)} (Perde {formatCurrency(estimatedIfoodLoss)})</strong>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> SEFAZ NFC-e / Relatório Contábil:
                </span>
                <span className="text-emerald-400 font-bold">100% Sincronizado</span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* CONTEÚDO 4: CRM DIRETO                                   */}
      {/* ======================================================== */}
      {activeTab === 'crm' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">CRM Proprietário & Reativação de Clientes</h3>
            <p className="text-xs text-slate-400">
              Cada pessoa que aproxima o celular na placa NFC ou faz uma reserva entra automaticamente para a sua base própria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueCustomers.map((c, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-3.5 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400">{c.phone}</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                    {c.ordersCount} interações
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 text-xs flex items-center justify-between">
                  <span className="text-slate-400">LTV (Total Gasto):</span>
                  <strong className="text-base font-black text-[#F6C945]">{formatCurrency(c.totalSpent)}</strong>
                </div>

                <a
                  href={`https://wa.me/${c.whatsappFormatted}?text=${encodeURIComponent(
                    `Olá ${c.name}! Que alegria ter você conosco em Caraíva. Preparamos um mimo especial para sua próxima visita hoje!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Disparar Convite VIP no WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* CONTEÚDO 5: INOVAÇÃO NFC PARA CADA NICHO (DIFERENCIAL!)  */}
      {/* ======================================================== */}
      {activeTab === 'placa_nfc' && (
        <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F6C945] px-2.5 py-1 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/30">
              Muito Além de um QR Code Comum
            </span>
            <h3 className="text-xl font-black text-white pt-1">
              Como a Placa NFC Black Piano Revoluciona Este Nicho
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Enquanto concorrentes vendem apenas um pedaço de acrílico com link estático, nossa placa NTAG213 ativa fluxos operacionais e pagamentos em 1 toque.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Mockup Físico da Placa */}
            <div className="max-w-sm mx-auto w-full p-8 rounded-3xl bg-gradient-to-b from-[#181C20] via-[#0D1012] to-[#060809] border-2 border-[#F6C945]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F6C945] to-transparent" />

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#F6C945]">
                  TapTable • NXP NTAG213 Criptografado
                </span>
                <h4 className="text-xl font-black text-white">
                  {selectedNiche === 'hospedagem'
                    ? 'Bangalô das Águas'
                    : selectedNiche === 'passeios_barcos'
                    ? 'Píer de Embarque #01'
                    : selectedNiche === 'conveniencia'
                    ? 'Tag Scan & Go Peça #04'
                    : 'Mesa 08 • Beira-Rio'}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedNiche === 'hospedagem'
                    ? 'Pousada Casa da Praia'
                    : selectedNiche === 'passeios_barcos'
                    ? 'Caraíva Brasil Turismo'
                    : selectedNiche === 'conveniencia'
                    ? 'Ateliê Arte da Terra'
                    : 'Boteco do Pará'}
                </p>
              </div>

              <div className="w-44 h-44 mx-auto p-3 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                <QrCode className="w-36 h-36 text-slate-950" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/30 text-xs font-bold text-[#F6C945]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Encoste o Smartphone Aqui (NFC)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Abre em 0.4s no iPhone & Android sem baixar aplicativo
                </p>
              </div>
            </div>

            {/* As 4 Super-Funções Exclusivas do NFC por Nicho */}
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-[#141719] border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#F6C945]">
                  <Utensils className="w-4 h-4" />
                  <span>1. Em Restaurantes Grandes (Split Bill & Giro +35%)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Várias pessoas na mesma mesa encostam o celular, pedem direto para a cozinha, acionam chamados específicos (<em>"Trazer Gelo"</em>) e <strong>dividem a conta por item (Split Bill)</strong> pagando com Apple Pay ou Pix sem esperar a maquininha.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141719] border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-sky-400">
                  <Wifi className="w-4 h-4" />
                  <span>2. Em Pousadas & Hotéis (Concierge de Cabeceira)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Colada na cabeceira da cama: o hóspede encosta o celular para conectar no Wi-Fi automaticamente, pedir café da manhã no quarto, solicitar toalhas extras ou comprar passeios com comissão para a pousada.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141719] border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                  <Package className="w-4 h-4" />
                  <span>3. Em Lojas & Ateliês (Scan & Go "Mãos Livres na Praia")</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O turista encosta o celular na peça artesanal, assiste à história do artista, paga no Pix na hora e seleciona <strong>"Entregar na recepção da minha pousada"</strong> para não carregar sacolas na areia.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141719] border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-purple-400">
                  <Compass className="w-4 h-4" />
                  <span>4. Em Passeios & Lanchas (Fast Boarding Pass)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No píer de embarque, o turista encosta o celular no cartão NFC do marinheiro para validar o ingresso, confirmar presença na lista da Capitania e receber alertas de retorno da maré.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* CONTEÚDO 6: HUB DE CHAVES & INTEGRAÇÕES API              */}
      {/* ======================================================== */}
      {activeTab === 'integracoes_api' && (
        <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">Hub de Conectores & Chaves de API</h3>
            <p className="text-xs text-slate-400">
              Arquitetura plug-and-play para ativar exatamente o que cada estabelecimento precisa.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'asaasPixSplit',
                badge: 'Pix',
                color: 'bg-amber-400/20 text-amber-400',
                title: 'Gateway Subadquirente & Split Automático (Asaas / Pagar.me)',
                desc: 'Liquidação D+0 no Pix da mesa e divisão automática de comissões e gorjetas.',
              },
              {
                key: 'whatsappCloud',
                badge: 'WA',
                color: 'bg-emerald-500/20 text-emerald-400',
                title: 'Meta WhatsApp Cloud API Oficial',
                desc: 'Envio automático de comprovantes, senhas de portão da pousada e status de delivery.',
              },
              {
                key: 'thermalPrinter',
                badge: 'KDS',
                color: 'bg-sky-500/20 text-sky-400',
                title: 'Impressora Térmica ESC/POS & KDS Sonoro',
                desc: 'Disparo imediato de comandas na cozinha quente e no bar de drinks.',
              },
              {
                key: 'kamraChannelManager',
                badge: 'PMS',
                color: 'bg-purple-500/20 text-purple-400',
                title: 'Webhook Kamra PMS / Booking / Airbnb Sync',
                desc: 'Sincronização de calendário de suítes para impedir overbooking.',
              },
              {
                key: 'sefazNfce',
                badge: 'NFe',
                color: 'bg-rose-500/20 text-rose-400',
                title: 'Emissor Fiscal SEFAZ NFC-e / SPED Contábil',
                desc: 'Emissão automática de nota fiscal de consumidor após pagamento na placa NFC.',
              },
            ].map((item) => {
              const isActive = apiConnections[item.key as keyof typeof apiConnections];
              return (
                <div
                  key={item.key}
                  className="p-5 rounded-3xl bg-[#141719] border border-white/10 flex items-center justify-between gap-4 shadow-lg"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center font-black text-xs shrink-0`}>
                      {item.badge}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setApiConnections((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof apiConnections] }))
                    }
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      isActive ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isActive ? '✓ Chave Ativa' : 'Desativado'}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      )}
    </div>
  );
};
