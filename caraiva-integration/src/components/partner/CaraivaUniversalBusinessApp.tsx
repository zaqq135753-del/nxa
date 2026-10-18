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
  Printer,
  Flame
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

// Modelos do Mini PMS
interface SuiteRoom {
  id: string;
  name: string;
  category: 'master' | 'bangalo' | 'standard';
  status: 'disponivel' | 'ocupado' | 'checkin_hoje' | 'limpeza';
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

// Mesas Físicas TapTable com Placas NFC
interface TapTableFloorSeat {
  tableNumber: string;
  status: 'livre' | 'comanda_aberta' | 'pedindo_conta';
  zone: 'Beira-Rio' | 'Salão' | 'Deck';
  currentTotal: number;
  openSince: string;
}

const INITIAL_TABLES: TapTableFloorSeat[] = [
  { tableNumber: '01', status: 'comanda_aberta', zone: 'Beira-Rio', currentTotal: 280, openSince: '45 min' },
  { tableNumber: '02', status: 'livre', zone: 'Beira-Rio', currentTotal: 0, openSince: '-' },
  { tableNumber: '03', status: 'pedindo_conta', zone: 'Beira-Rio', currentTotal: 410, openSince: '1h 20m' },
  { tableNumber: '04', status: 'comanda_aberta', zone: 'Deck', currentTotal: 165, openSince: '20 min' },
  { tableNumber: '05', status: 'livre', zone: 'Deck', currentTotal: 0, openSince: '-' },
  { tableNumber: '06', status: 'comanda_aberta', zone: 'Salão', currentTotal: 98, openSince: '15 min' },
  { tableNumber: '07', status: 'livre', zone: 'Salão', currentTotal: 0, openSince: '-' },
  { tableNumber: '08', status: 'pedindo_conta', zone: 'Beira-Rio', currentTotal: 340, openSince: '50 min' },
];

// Modelos do Varejo / Mercado Livre da Vila
interface RetailProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  available: boolean;
}

const INITIAL_PRODUCTS: RetailProduct[] = [
  { id: 'p-01', name: 'Canga Algodão Cru Artesanal Caraíva', price: 95, stock: 12, category: 'Moda Praia', available: true },
  { id: 'p-02', name: 'Colar de Sementes Nativas Pataxó', price: 65, stock: 8, category: 'Arte Indígena', available: true },
  { id: 'p-03', name: 'Cerâmica Rústica Queimada no Forno', price: 140, stock: 3, category: 'Decoração', available: true },
  { id: 'p-04', name: 'Chapéu de Palha Trançado à Mão', price: 110, stock: 5, category: 'Acessórios', available: true },
];

export const CaraivaUniversalBusinessApp: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<UnifiedOrder[]>(() => getUnifiedOrders());
  const [selectedNiche, setSelectedNiche] = useState<OrderNiche>(() => {
    const fromUrl = searchParams.get('nicho') as OrderNiche;
    return fromUrl || 'gastronomia';
  });
  const [activeTab, setActiveTab] = useState<'operacao' | 'mesas_taptable' | 'crm' | 'financeiro' | 'integracoes_api' | 'placa_nfc'>('operacao');
  const [suites, setSuites] = useState<SuiteRoom[]>(INITIAL_SUITES);
  const [tables, setTables] = useState<TapTableFloorSeat[]>(INITIAL_TABLES);
  const [products, setProducts] = useState<RetailProduct[]>(INITIAL_PRODUCTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados dos Conectores de Chave API
  const [apiConnections, setApiConnections] = useState({
    asaasPixSplit: true,
    whatsappCloud: true,
    thermalPrinter: true,
    kamraChannelManager: true,
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
  };

  // Filtragem dos pedidos de acordo com o nicho selecionado
  const nicheOrders = orders.filter((o) => {
    if (selectedNiche === 'gastronomia') return o.niche === 'gastronomia';
    if (selectedNiche === 'hospedagem') return o.niche === 'hospedagem';
    if (selectedNiche === 'passeios_barcos') return o.niche === 'passeios_barcos';
    return o.niche === 'conveniencia' || o.niche === 'servicos';
  });

  // Métricas financeiras
  const totalGross = nicheOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalPix = nicheOrders.filter((o) => o.paymentMethod === 'pix').reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCard = totalGross - totalPix;
  const estimatedIfoodLoss = totalGross * 0.25;

  // Cálculos visuais dos gráficos
  const pixPercentage = totalGross > 0 ? Math.round((totalPix / totalGross) * 100) : 65;
  const cardPercentage = 100 - pixPercentage;

  // Métricas de Ocupação do Mini PMS
  const occupiedSuites = suites.filter((s) => s.status === 'ocupado' || s.status === 'checkin_hoje').length;
  const suitesOccupancyRate = Math.round((occupiedSuites / suites.length) * 100);

  // Métricas de Ocupação das Mesas TapTable
  const occupiedTables = tables.filter((t) => t.status !== 'livre').length;
  const tablesOccupancyRate = Math.round((occupiedTables / tables.length) * 100);

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

  const handleCloseTableBill = (tableNumber: string) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status: 'livre', currentTotal: 0, openSince: '-' } : t))
    );
  };

  return (
    <div className="min-h-screen bg-[#07090A] text-[#FFF4ED] font-sans pb-32 selection:bg-[#F6C945] selection:text-slate-950">
      {/* Topbar Cirúrgico */}
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
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reloadData}
              className={`p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition ${
                isRefreshing ? 'animate-spin text-[#F6C945]' : ''
              }`}
              title="Atualizar painel"
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

      {/* SELETOR RÁPIDO DO ESTABELECIMENTO */}
      <div className="border-b border-white/[0.06] bg-[#0A0D10] px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            <Store className="w-3.5 h-3.5 text-[#F6C945]" /> Estabelecimento:
          </span>

          <button
            onClick={() => handleNicheChange('gastronomia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'gastronomia'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Boteco do Pará (Bar & KDS)</span>
          </button>

          <button
            onClick={() => handleNicheChange('hospedagem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'hospedagem'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Pousada Casa da Praia (Mini PMS)</span>
          </button>

          <button
            onClick={() => handleNicheChange('passeios_barcos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'passeios_barcos'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Caraíva Brasil (Lanchas & Buggy)</span>
          </button>

          <button
            onClick={() => handleNicheChange('conveniencia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer ${
              selectedNiche === 'conveniencia'
                ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Ateliê Arte da Terra (Loja & Varejo)</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD VISUAL EM WIDGETS TÁTEIS (GRÁFICOS MOBILE-FIRST) */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Widget 1: Donut Visual Pix vs Cartão */}
          <div className="p-4 rounded-3xl bg-[#111417] border border-white/[0.08] flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Faturamento
              </span>
              <p className="text-xl font-black text-white">{formatCurrency(totalGross)}</p>
              <div className="flex items-center gap-2 text-[10px] pt-1">
                <span className="flex items-center gap-1 text-[#F6C945] font-bold" title={`Total no Pix: ${formatCurrency(totalPix)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F6C945]" /> {pixPercentage}% Pix ({formatCurrency(totalPix)})
                </span>
                <span className="flex items-center gap-1 text-sky-400 font-bold" title={`Total no Cartão: ${formatCurrency(totalCard)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> {cardPercentage}% Cartão
                </span>
              </div>
            </div>

            {/* SVG Donut Visual */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22272e" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#F6C945"
                  strokeWidth="4"
                  strokeDasharray={`${pixPercentage * 0.88} 100`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray={`${cardPercentage * 0.88} 100`}
                  strokeDashoffset={`-${pixPercentage * 0.88}`}
                  strokeLinecap="round"
                />
              </svg>
              <Zap className="w-4 h-4 text-[#F6C945] absolute" />
            </div>
          </div>

          {/* Widget 2: Termômetro de Ocupação Visual */}
          <div className="p-4 rounded-3xl bg-[#111417] border border-white/[0.08] flex flex-col justify-between shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {selectedNiche === 'hospedagem' ? 'Ocupação Suítes' : 'Ocupação Mesas'}
              </span>
              <span className="text-xs font-black text-[#F6C945]">
                {selectedNiche === 'hospedagem' ? `${suitesOccupancyRate}%` : `${tablesOccupancyRate}%`}
              </span>
            </div>

            {/* Barra Termômetro */}
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#F6C945] transition-all duration-500"
                style={{
                  width: `${selectedNiche === 'hospedagem' ? suitesOccupancyRate : tablesOccupancyRate}%`,
                }}
              />
            </div>

            <p className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>
                {selectedNiche === 'hospedagem'
                  ? `${occupiedSuites} de ${suites.length} suítes reservadas`
                  : `${occupiedTables} de ${tables.length} mesas com comanda`}
              </span>
              <span className="text-emerald-400 font-bold">Ao Vivo</span>
            </p>
          </div>

          {/* Widget 3: Gráfico de Horários de Pico (Bar Chart Sparkline) */}
          <div className="p-4 rounded-3xl bg-[#111417] border border-white/[0.08] flex flex-col justify-between shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Picos de Venda
              </span>
              <span className="text-[10px] font-bold text-[#F6C945] flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#F6C945]" /> 17h Pôr do Sol
              </span>
            </div>

            {/* Barrinhas de Horários */}
            <div className="flex items-end justify-between h-7 gap-1 pt-1">
              {[
                { label: '11h', h: '35%' },
                { label: '13h', h: '70%' },
                { label: '15h', h: '45%' },
                { label: '17h', h: '100%', hot: true },
                { label: '19h', h: '60%' },
                { label: '21h', h: '85%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      bar.hot ? 'bg-[#F6C945] shadow-xs shadow-[#F6C945]' : 'bg-white/20'
                    }`}
                    style={{ height: bar.h }}
                  />
                  <span className="text-[8px] text-slate-500">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Economia vs iFood / Intermediários */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-[#111417] border border-emerald-500/30 flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                Economia Real
              </span>
              <p className="text-xl font-black text-emerald-400">
                + {formatCurrency(estimatedIfoodLoss)}
              </p>
              <p className="text-[10px] text-slate-300">Preservado do seu bolso</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
              0%
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO DE ABAS OPERACIONAIS */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('operacao')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'operacao'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F6C945]" />
            <span>
              {selectedNiche === 'hospedagem'
                ? 'Mapa de Suítes (Mini PMS)'
                : selectedNiche === 'gastronomia'
                ? 'Cozinha & KDS'
                : selectedNiche === 'conveniencia'
                ? 'Estoque & Catálogo'
                : 'Manifesto de Saídas'}
            </span>
          </button>

          {/* Aba Exclusiva do TapTable: Salão & Mesas Físicas NFC */}
          {selectedNiche === 'gastronomia' && (
            <button
              onClick={() => setActiveTab('mesas_taptable')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === 'mesas_taptable'
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Mapa do Salão TapTable ({occupiedTables}/{tables.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>CRM & Clientes ({uniqueCustomers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('integracoes_api')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'integracoes_api'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>Chaves & Integrações API</span>
          </button>

          <button
            onClick={() => setActiveTab('placa_nfc')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === 'placa_nfc'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Placa NFC</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ABA DE OPERAÇÃO                                       */}
      {/* ======================================================== */}
      {activeTab === 'operacao' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          {/* POUSADAS: MINI PMS VISUAL */}
          {selectedNiche === 'hospedagem' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Mapa de Ocupação & Governança</h3>
                  <p className="text-xs text-slate-400">Atualizações de check-in e liberação de quartos.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suites.map((suite) => (
                  <div
                    key={suite.id}
                    className={`p-5 rounded-3xl border transition shadow-xl space-y-3.5 ${
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
                          {suite.category.toUpperCase()}
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
                          ? 'Ocupado'
                          : suite.status === 'checkin_hoje'
                          ? 'Check-in Hoje'
                          : suite.status === 'limpeza'
                          ? 'Limpeza Pendente'
                          : 'Disponível'}
                      </span>
                    </div>

                    {suite.currentGuest ? (
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-white">{suite.currentGuest.name}</strong>
                          <span className="text-emerald-400 font-bold">
                            Pago: {formatCurrency(suite.currentGuest.paidAmount)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Estadia: {suite.currentGuest.checkIn} até {suite.currentGuest.checkOut}
                        </p>
                        <a
                          href={`https://wa.me/55${suite.currentGuest.phone}?text=${encodeURIComponent(
                            `Olá ${suite.currentGuest.name}! Aqui é da recepção da pousada. Seu ${suite.name} já está preparado!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] pt-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Enviar Senha do Portão no WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-black/20 border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                        <span>Quarto vago para novas reservas no Guia</span>
                        <span className="text-emerald-400 font-bold">Aberto</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      {suite.status === 'limpeza' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'disponivel')}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
                        >
                          ✓ Marcar como Limpo
                        </button>
                      )}
                      {suite.status === 'checkin_hoje' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'ocupado')}
                          className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <DoorOpen className="w-3.5 h-3.5" />
                          <span>Registrar Entrada (Check-in)</span>
                        </button>
                      )}
                      {suite.status === 'ocupado' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'limpeza')}
                          className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition"
                        >
                          Registrar Saída ➔ Limpeza
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GASTRONOMIA: KDS DE COZINHA */}
          {selectedNiche === 'gastronomia' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Pedidos ao Vivo (Delivery & Balcão)</h3>
                  <p className="text-xs text-slate-400">Controle de tempo de preparo e despacho.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nicheOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-3.5 shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-black text-slate-400">{order.orderNumber}</span>
                          <h4 className="text-base font-bold text-white mt-0.5">{order.customer.name}</h4>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="flex items-start justify-between">
                            <span className="text-slate-200">
                              <strong className="text-white">{i.quantity}x</strong> {i.name}
                            </span>
                            <span className="text-slate-400">{formatCurrency(i.subtotal)}</span>
                          </div>
                        ))}
                        {order.destination && (
                          <p className="pt-2 border-t border-white/5 text-[11px] text-amber-300">
                            📍 {order.destination.detail}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        {order.status === 'novo' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'preparando')}
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
                          >
                            Mandar para a Cozinha
                          </button>
                        )}
                        {order.status === 'preparando' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'em_rota')}
                            className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Despachar Entrega / Chamar Mesa</span>
                          </button>
                        )}
                        {order.status === 'em_rota' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'concluido')}
                            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
                          >
                            ✓ Finalizar Atendimento
                          </button>
                        )}
                        {order.status === 'concluido' && (
                          <div className="w-full py-2 rounded-xl bg-emerald-500/10 text-center text-xs font-bold text-emerald-400 border border-emerald-500/20">
                            ✓ Concluído com Sucesso
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VAREJO & LOJAS */}
          {selectedNiche === 'conveniencia' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white">Catálogo & Estoque da Loja</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 rounded-3xl bg-[#141719] border border-white/10 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{product.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {product.available ? 'Ativo' : 'Pausado'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{product.name}</h4>
                    <p className="text-base font-black text-[#F6C945]">{formatCurrency(product.price)}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                      <span>Estoque: {product.stock} un</span>
                      <button onClick={() => handleToggleProduct(product.id)} className="font-bold underline cursor-pointer text-slate-300">
                        {product.available ? 'Pausar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NÁUTICA */}
          {selectedNiche === 'passeios_barcos' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white">Manifesto de Embarque de Lanchas</h3>
              <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Lancha Ponta do Corumbau (Saída 09:30)</h4>
                  <span className="text-xs font-bold text-[#F6C945]">5 / 12 Vagas Ocupadas</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 text-xs text-slate-300 space-y-1">
                  <p>• Lucas Ferreira (+1) — R$ 440,00 Pago</p>
                  <p>• Marcelo Siqueira (+2) — R$ 660,00 Pago</p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ======================================================== */}
      {/* 2. ABA TAPTABLE: MAPA VISUAL DO SALÃO (MESAS COM NFC)   */}
      {/* ======================================================== */}
      {activeTab === 'mesas_taptable' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white">Mapa Visual do Salão TapTable</h3>
              <p className="text-xs text-slate-400">
                Toque na mesa com a plaquinha NFC para ver comanda aberta e fechar a conta.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Livre ({tables.filter(t => t.status === 'livre').length})
              </span>
              <span className="flex items-center gap-1.5 text-[#F6C945] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F6C945]" /> Comanda Aberta ({tables.filter(t => t.status === 'comanda_aberta').length})
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Pedindo Conta ({tables.filter(t => t.status === 'pedindo_conta').length})
              </span>
            </div>
          </div>

          {/* Grid Interativo das Mesas com Placas NFC */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.tableNumber}
                className={`p-4 rounded-3xl border transition shadow-xl space-y-3 relative overflow-hidden ${
                  table.status === 'pedindo_conta'
                    ? 'bg-[#211414] border-rose-500/50 ring-1 ring-rose-500/30'
                    : table.status === 'comanda_aberta'
                    ? 'bg-[#1e1c15] border-amber-500/40'
                    : 'bg-[#121614] border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{table.zone}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      table.status === 'pedindo_conta'
                        ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                        : table.status === 'comanda_aberta'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {table.status === 'pedindo_conta' ? 'Pediu Conta' : table.status === 'comanda_aberta' ? 'Consumindo' : 'Livre'}
                  </span>
                </div>

                <div className="text-center py-1">
                  <h4 className="text-2xl font-black text-white">Mesa {table.tableNumber}</h4>
                  <p className="text-xs text-[#F6C945] font-black mt-0.5">
                    {table.status !== 'livre' ? formatCurrency(table.currentTotal) : 'R$ 0,00'}
                  </p>
                  <span className="text-[10px] text-slate-400">Tempo: {table.openSince}</span>
                </div>

                {table.status !== 'livre' ? (
                  <button
                    onClick={() => handleCloseTableBill(table.tableNumber)}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition"
                  >
                    Fechar Conta (Pix / Card)
                  </button>
                ) : (
                  <div className="py-2 text-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded-xl">
                    Pronta p/ Aproximação NFC
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 3. ABA CHAVES & INTEGRAÇÕES MODULARES DE API              */}
      {/* ======================================================== */}
      {activeTab === 'integracoes_api' && (
        <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">Hub de Chaves & Integrações API</h3>
            <p className="text-xs text-slate-400">
              Conecte o sistema a adquirentes bancárias, WhatsApp Cloud e motores de PMS externos.
            </p>
          </div>

          <div className="space-y-3">
            {/* Conector 1: Asaas / Pagar.me */}
            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black">
                  Pix
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Gateway Bancário & Split de Pagamentos (Asaas / Pagar.me)</h4>
                  <p className="text-xs text-slate-400">Recebimento de Pix na mesa e cartão online com 0% espera.</p>
                </div>
              </div>
              <button
                onClick={() => setApiConnections(p => ({ ...p, asaasPixSplit: !p.asaasPixSplit }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  apiConnections.asaasPixSplit ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}
              >
                {apiConnections.asaasPixSplit ? '✓ Ativo' : 'Pausado'}
              </button>
            </div>

            {/* Conector 2: WhatsApp Cloud API */}
            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Meta WhatsApp Cloud API Oficial</h4>
                  <p className="text-xs text-slate-400">Disparo automático de senhas de quarto, status de entrega e vouchers.</p>
                </div>
              </div>
              <button
                onClick={() => setApiConnections(p => ({ ...p, whatsappCloud: !p.whatsappCloud }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  apiConnections.whatsappCloud ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}
              >
                {apiConnections.whatsappCloud ? '✓ Ativo' : 'Pausado'}
              </button>
            </div>

            {/* Conector 3: Impressora Térmica KDS */}
            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Impressora Térmica de Cozinha (ESC/POS)</h4>
                  <p className="text-xs text-slate-400">Impressão automática das comandas quando o cliente pede na mesa ou delivery.</p>
                </div>
              </div>
              <button
                onClick={() => setApiConnections(p => ({ ...p, thermalPrinter: !p.thermalPrinter }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  apiConnections.thermalPrinter ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}
              >
                {apiConnections.thermalPrinter ? '✓ Ativo' : 'Pausado'}
              </button>
            </div>

            {/* Conector 4: Kamra PMS Channel Manager */}
            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sincronizador Kamra / Airbnb / Booking Channel</h4>
                  <p className="text-xs text-slate-400">Webhook bidirecional para não ter overbooking entre o Guia e OTAs.</p>
                </div>
              </div>
              <button
                onClick={() => setApiConnections(p => ({ ...p, kamraChannelManager: !p.kamraChannelManager }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  apiConnections.kamraChannelManager ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}
              >
                {apiConnections.kamraChannelManager ? '✓ Ativo' : 'Pausado'}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 4. ABA CRM DIRETO                                        */}
      {/* ======================================================== */}
      {activeTab === 'crm' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">CRM Direto & Clientes Fidelizados</h3>
            <p className="text-xs text-slate-400">Contato direto no WhatsApp sem pagar comissões para plataformas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueCustomers.map((c, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-3.5 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400">{c.phone}</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    {c.ordersCount} compras
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Total Gasto:</span>
                  <strong className="text-base font-black text-[#F6C945]">{formatCurrency(c.totalSpent)}</strong>
                </div>

                <a
                  href={`https://wa.me/${c.whatsappFormatted}?text=${encodeURIComponent(
                    `Olá ${c.name}! Vimos que você já visitou nossa casa em Caraíva. Estamos com condições exclusivas hoje!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Chamar no WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 5. ABA PLACA DE MESA / QUARTO NFC                        */}
      {/* ======================================================== */}
      {activeTab === 'placa_nfc' && (
        <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-base font-black text-white">
              {selectedNiche === 'hospedagem' ? 'Plaquinha NFC da Suíte / Quarto' : 'Placa de Mesa NFC Black Piano'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Acrílico Black Piano cortado a laser com chip NTAG213 e QR Code direto.
            </p>
          </div>

          <div className="max-w-sm mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#181C20] via-[#0D1012] to-[#060809] border-2 border-[#F6C945]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F6C945] to-transparent" />

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#F6C945]">
                TapTable • Caraíva Digital
              </span>
              <h4 className="text-xl font-black text-white">
                {selectedNiche === 'hospedagem' ? 'Bangalô das Águas' : 'Mesa 08 (Beira-Rio)'}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedNiche === 'hospedagem' ? 'Pousada Casa da Praia' : 'Boteco do Pará'}
              </p>
            </div>

            <div className="w-44 h-44 mx-auto p-3 rounded-2xl bg-white flex items-center justify-center shadow-inner">
              <QrCode className="w-36 h-36 text-slate-950" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/30 text-xs font-bold text-[#F6C945]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aproxime o Celular (NFC)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedNiche === 'hospedagem'
                  ? 'Fale com a recepção • Peça café da manhã • Agende passeios'
                  : 'Cardápio sem baixar app • Pedido direto na cozinha • Pagamento na mesa'}
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
