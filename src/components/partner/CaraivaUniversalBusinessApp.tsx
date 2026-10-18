import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
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
    name: 'Suíte Amendoeira Centenária',
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
    name: 'Suíte Pôr do Sol no Rio',
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
  const [activeTab, setActiveTab] = useState<'operacao' | 'crm' | 'financeiro' | 'placa_nfc'>('operacao');
  const [suites, setSuites] = useState<SuiteRoom[]>(INITIAL_SUITES);
  const [products, setProducts] = useState<RetailProduct[]>(INITIAL_PRODUCTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Métricas financeiras e de CRM
  const totalGross = nicheOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalPix = nicheOrders.filter((o) => o.paymentMethod === 'pix').reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCard = totalGross - totalPix;
  const estimatedIfoodLoss = totalGross * 0.25; // 25% economia em relação ao intermediário tradicional

  // Lista única de clientes para o CRM
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

  return (
    <div className="min-h-screen bg-[#07090A] text-[#FFF4ED] font-sans pb-28 selection:bg-[#F6C945] selection:text-slate-950">
      {/* Topbar Cirúrgico & Minimalista */}
      <header className="sticky top-0 z-40 bg-[#07090A]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/guia"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>← Guia B2C</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h1 className="text-xs font-black tracking-widest uppercase text-white">
                Caraíva Business OS
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F6C945]/15 text-[#F6C945] border border-[#F6C945]/30">
                Operação ao Vivo
              </span>
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
            >
              <span>Tela do Cliente</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* SELETOR DE MODO / NICHO (O NÚCLEO ADAPTATIVO) */}
      <div className="border-b border-white/[0.06] bg-[#0A0D10] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-[#F6C945]" /> Selecionar Negócio:
            </span>

            <button
              onClick={() => handleNicheChange('gastronomia')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                selectedNiche === 'gastronomia'
                  ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-lg shadow-[#F6C945]/20'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Boteco do Pará (Restaurante & Delivery)</span>
            </button>

            <button
              onClick={() => handleNicheChange('hospedagem')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                selectedNiche === 'hospedagem'
                  ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-lg shadow-[#F6C945]/20'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Pousada Casa da Praia (Mini PMS)</span>
            </button>

            <button
              onClick={() => handleNicheChange('passeios_barcos')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                selectedNiche === 'passeios_barcos'
                  ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-lg shadow-[#F6C945]/20'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Caraíva Brasil (Lanchas & Buggy)</span>
            </button>

            <button
              onClick={() => handleNicheChange('conveniencia')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                selectedNiche === 'conveniencia'
                  ? 'bg-gradient-to-r from-[#F6C945] to-[#ffd56b] text-slate-950 shadow-lg shadow-[#F6C945]/20'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Ateliê Arte da Terra (Loja & Varejo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ABAS DIRECIONAIS */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            onClick={() => setActiveTab('operacao')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'operacao'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F6C945]" />
            <span>
              {selectedNiche === 'hospedagem'
                ? 'Mapa de Quartos (Mini PMS)'
                : selectedNiche === 'gastronomia'
                ? 'Cozinha & KDS Delivery'
                : selectedNiche === 'conveniencia'
                ? 'Estoque & Vitrine de Vendas'
                : 'Manifesto de Saídas de Barco'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>CRM & Clientes ({uniqueCustomers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'financeiro'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Caixa & DRE ao Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('placa_nfc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'placa_nfc'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Plaquinha NFC</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ABA DE OPERAÇÃO ESPECÍFICA POR NICHO                  */}
      {/* ======================================================== */}
      {activeTab === 'operacao' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          {/* CASO A: POUSADAS & HOSPEDAGEM (MINI PMS REVOLUCIONÁRIO) */}
          {selectedNiche === 'hospedagem' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white">Grid Visual de Suítes (Mini PMS)</h2>
                  <p className="text-xs text-slate-400">
                    Controle de ocupação, check-in express e governança de quartos em tempo real.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Livre
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Ocupado
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Check-in Hoje
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Limpeza
                  </span>
                </div>
              </div>

              {/* Grid de Quartos do Mini PMS */}
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
                          {suite.category.toUpperCase()}
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">{suite.name}</h3>
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

                    {/* Dados do Hóspede se houver */}
                    {suite.currentGuest ? (
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-white">{suite.currentGuest.name}</strong>
                          <span className="text-emerald-400 font-bold">
                            Total Pago: {formatCurrency(suite.currentGuest.paidAmount)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Estadia: {suite.currentGuest.checkIn} até {suite.currentGuest.checkOut} ({suite.currentGuest.guests} hóspedes)
                        </p>

                        <a
                          href={`https://wa.me/55${suite.currentGuest.phone}?text=${encodeURIComponent(
                            `Olá ${suite.currentGuest.name}! Aqui é da recepção da Pousada Casa da Praia. Estamos preparando tudo para sua estadia no ${suite.name}!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] pt-1 hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Enviar Senha do Portão no WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                        <span>Quarto vago para novas reservas no Guia</span>
                        <span className="text-emerald-400 font-bold">Aberto</span>
                      </div>
                    )}

                    {/* Ações Rápidas de Governança */}
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
                          <span>Registrar Entrada (Check-in Express)</span>
                        </button>
                      )}

                      {suite.status === 'ocupado' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'limpeza')}
                          className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition"
                        >
                          Registrar Saída (Check-out) ➔ Limpeza
                        </button>
                      )}

                      {suite.status === 'disponivel' && (
                        <button
                          onClick={() => handleToggleSuiteStatus(suite.id, 'limpeza')}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition"
                        >
                          Agendar Limpeza
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CASO B: GASTRONOMIA (KDS DE COZINHA & DELIVERY) */}
          {selectedNiche === 'gastronomia' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">KDS de Cozinha & Delivery ao Vivo</h2>
                  <p className="text-xs text-slate-400">
                    Acompanhe pedidos da mesa e entregas na pousada em tempo real.
                  </p>
                </div>
              </div>

              {nicheOrders.length === 0 ? (
                <div className="text-center py-20 rounded-3xl bg-[#141719]/40 border border-white/10 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-500 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Nenhum pedido na fila</h3>
                  <p className="text-xs text-slate-400">
                    Novos pedidos de delivery ou de mesa aparecerão aqui com alerta sonoro.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nicheOrders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <div
                        key={order.id}
                        className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-4 shadow-xl"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-black text-slate-400">{order.orderNumber}</span>
                            <h3 className="text-base font-bold text-white mt-0.5">{order.customer.name}</h3>
                          </div>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        {/* Itens */}
                        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
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

                        {/* Ações do KDS */}
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
                              <span>Despachar Entrega / Chamar Garçom</span>
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
              )}
            </div>
          )}

          {/* CASO C: VAREJO / LOJA (MERCADO LIVRE DA VILA) */}
          {selectedNiche === 'conveniencia' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Catálogo & Estoque (Varejo da Vila)</h2>
                <p className="text-xs text-slate-400">
                  Gerencie produtos à venda no Guia para retirada na loja ou entrega na pousada.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-3 shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {product.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          product.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {product.available ? 'Ativo no Guia' : 'Pausado'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{product.name}</h4>
                      <p className="text-base font-black text-[#F6C945] mt-1">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                      <span>Estoque: {product.stock} un</span>
                      <button
                        onClick={() => handleToggleProduct(product.id)}
                        className="text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer"
                      >
                        {product.available ? 'Pausar Venda' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CASO D: PASSEIOS NÁUTICOS */}
          {selectedNiche === 'passeios_barcos' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Manifesto de Embarque & Saídas</h2>
                <p className="text-xs text-slate-400">
                  Passageiros confirmados para lanchas, barcos e buggys de acordo com a maré.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-sky-400" />
                    <h3 className="text-base font-bold text-white">
                      Expedição Ponta do Corumbau (Lancha Rápida)
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Saída às 09:30 • Maré 0.2m
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>1. Lucas Ferreira (+1 passageiro)</span>
                    <span className="text-emerald-400 font-bold">Pago no Cartão • R$ 440,00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>2. Marcelo Siqueira (+2 passageiros)</span>
                    <span className="text-emerald-400 font-bold">Pago no Pix • R$ 660,00</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Capacidade: 12 vagas (5 preenchidas • 7 livres)</span>
                  <button className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition">
                    Exportar Lista de Embarque
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ======================================================== */}
      {/* 2. ABA CRM & CLIENTES UNIFICADA                          */}
      {/* ======================================================== */}
      {activeTab === 'crm' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">Base de Clientes & CRM Direto</h2>
            <p className="text-xs text-slate-400">
              Histórico de consumo e contato direto no WhatsApp. Dados 100% seus, sem taxas abusivas de anúncios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueCustomers.map((c, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <p className="text-xs text-slate-400">{c.phone}</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {c.ordersCount} compras
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Total Gasto na Casa:</span>
                  <strong className="text-base font-black text-[#F6C945]">
                    {formatCurrency(c.totalSpent)}
                  </strong>
                </div>

                <a
                  href={`https://wa.me/${c.whatsappFormatted}?text=${encodeURIComponent(
                    `Olá ${c.name}! Vimos que você já esteve conosco em Caraíva. Temos novidades exclusivas hoje!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Enviar Mensagem no WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 3. ABA CAIXA & DRE FINANCEIRO                            */}
      {/* ======================================================== */}
      {activeTab === 'financeiro' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">Caixa & DRE ao Vivo</h2>
            <p className="text-xs text-slate-400">
              Controle de faturamento, divisão de recebíveis por método de pagamento e economia de taxas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Faturamento Bruto</span>
              <p className="text-2xl font-black text-white">{formatCurrency(totalGross)}</p>
              <span className="text-[11px] text-emerald-400 font-bold">100% transacionado no app</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pix Direto (0% Espera)</span>
              <p className="text-2xl font-black text-[#F6C945]">{formatCurrency(totalPix)}</p>
              <span className="text-[11px] text-slate-400">Sem aluguel de maquininha</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cartões Online / Mesa</span>
              <p className="text-2xl font-black text-sky-400">{formatCurrency(totalCard)}</p>
              <span className="text-[11px] text-slate-400">Taxas negociadas no atacado</span>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-[#141719] border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Economia vs. iFood (25%)</span>
              <p className="text-2xl font-black text-emerald-400">+ {formatCurrency(estimatedIfoodLoss)}</p>
              <span className="text-[11px] text-slate-300">Dinheiro preservado no seu caixa</span>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 4. ABA PLACA DE MESA / QUARTO NFC                        */}
      {/* ======================================================== */}
      {activeTab === 'placa_nfc' && (
        <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-white">
              {selectedNiche === 'hospedagem' ? 'Plaquinha NFC da Suíte / Quarto' : 'Placa de Mesa NFC Black Piano'}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Peça de acrílico luxo gravada a laser com chip NFC para o cliente aproximar o celular.
            </p>
          </div>

          <div className="max-w-sm mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#181C20] via-[#0D1012] to-[#060809] border-2 border-[#F6C945]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F6C945] to-transparent" />

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#F6C945]">
                TapTable • Caraíva Digital
              </span>
              <h3 className="text-xl font-black text-white">
                {selectedNiche === 'hospedagem' ? 'Bangalô das Águas' : 'Mesa 08 (Beira-Rio)'}
              </h3>
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
