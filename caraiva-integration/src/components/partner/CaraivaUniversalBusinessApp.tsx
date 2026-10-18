import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CheckCircle2,
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

export const CaraivaUniversalBusinessApp: React.FC = () => {
  const [orders, setOrders] = useState<UnifiedOrder[]>(() => getUnifiedOrders());
  const [selectedNiche, setSelectedNiche] = useState<OrderNiche | 'todos'>('todos');
  const [activeTab, setActiveTab] = useState<'operacao' | 'crm' | 'financeiro' | 'placa_nfc'>('operacao');
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtro de status na operação
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendentes' | 'concluidos'>('pendentes');

  const reloadData = () => {
    setIsRefreshing(true);
    setOrders(getUnifiedOrders());
    setTimeout(() => setIsRefreshing(false), 400);
  };

  useEffect(() => {
    const handleSync = () => setOrders(getUnifiedOrders());
    window.addEventListener('caraiva:orders-updated', handleSync);
    return () => window.removeEventListener('caraiva:orders-updated', handleSync);
  }, []);

  // Filtragem dos pedidos de acordo com o nicho e aba de operação
  const filteredOrders = orders.filter((o) => {
    if (selectedNiche !== 'todos' && o.niche !== selectedNiche) return false;
    if (statusFilter === 'pendentes') {
      return !['concluido', 'recusado', 'cancelado'].includes(o.status);
    }
    if (statusFilter === 'concluidos') {
      return ['concluido', 'recusado', 'cancelado'].includes(o.status);
    }
    return true;
  });

  // Métricas financeiras e de CRM
  const totalGross = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalPix = orders.filter((o) => o.paymentMethod === 'pix').reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCard = totalGross - totalPix;
  const estimatedIfoodLoss = totalGross * 0.25; // 25% de comissão que o iFood morderia

  // Lista única de clientes para o CRM
  const uniqueCustomers = Array.from(
    new Map(
      orders.map((o) => [
        o.customer.phone,
        {
          name: o.customer.name,
          phone: o.customer.phone,
          whatsappFormatted: o.customer.whatsappFormatted,
          totalSpent: orders
            .filter((x) => x.customer.phone === o.customer.phone)
            .reduce((sum, item) => sum + item.totalAmount, 0),
          ordersCount: orders.filter((x) => x.customer.phone === o.customer.phone).length,
          lastOrderDate: o.createdAt,
          niche: o.niche,
        },
      ])
    ).values()
  );

  const handleAdvanceStatus = (orderId: string, nextStatus: UnifiedOrderStatus) => {
    const updated = updateOrderStatus(orderId, nextStatus);
    if (updated) {
      setOrders(getUnifiedOrders());
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07090A] text-[#FFF4ED] font-sans pb-24 selection:bg-[#F6C945] selection:text-slate-950">
      {/* Header Fixo do Business Cockpit */}
      <header className="sticky top-0 z-40 bg-[#07090A]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/guia"
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              ← Guia B2C
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-sm font-black text-white tracking-wide uppercase">
                  Caraíva Business OS
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F6C945]/15 text-[#F6C945] border border-[#F6C945]/30">
                  Universal Cockpit
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reloadData}
              className={`p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition ${
                isRefreshing ? 'animate-spin text-[#F6C945]' : ''
              }`}
              title="Recarregar dados da vila"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/guia/pedidos"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
            >
              <span>Ver Tela do Cliente</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Barra de Filtro de Nicho (Adaptação Inteligente do Negócio) */}
      <div className="border-b border-white/10 bg-[#0C0F12] px-4 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-[#F6C945]" /> Nicho:
          </span>

          <button
            onClick={() => setSelectedNiche('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedNiche === 'todos'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            Todos os Nichos
          </button>

          <button
            onClick={() => setSelectedNiche('gastronomia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
              selectedNiche === 'gastronomia'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Gastronomia & Bares (KDS)</span>
          </button>

          <button
            onClick={() => setSelectedNiche('hospedagem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
              selectedNiche === 'hospedagem'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Pousadas & Suítes</span>
          </button>

          <button
            onClick={() => setSelectedNiche('passeios_barcos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
              selectedNiche === 'passeios_barcos'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Passeios & Lanchas</span>
          </button>
        </div>
      </div>

      {/* Navegação Principal por Abas */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('operacao')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'operacao'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#F6C945]" />
            <span>Operação & Pedidos ao Vivo</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#F6C945]/20 text-[#F6C945] text-[10px]">
              {filteredOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'financeiro'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Financeiro & DRE</span>
          </button>

          <button
            onClick={() => setActiveTab('placa_nfc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'placa_nfc'
                ? 'bg-white/10 text-white border border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Placa de Mesa NFC</span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA OPERAÇÃO */}
      {activeTab === 'operacao' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          {/* Subfiltro de Operação */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('pendentes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === 'pendentes'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Em Andamento / Pendentes
              </button>
              <button
                onClick={() => setStatusFilter('concluidos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === 'concluidos'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Concluídos & Histórico
              </button>
              <button
                onClick={() => setStatusFilter('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === 'todos'
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Mostrando <strong className="text-white">{filteredOrders.length}</strong> ordens registradas
            </p>
          </div>

          {/* Grid de Pedidos (KDS / Operação) */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-[#141719]/40 border border-white/10 space-y-2">
              <ShoppingBag className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">Nenhum pedido no momento</h3>
              <p className="text-xs text-slate-400">
                Novos pedidos de delivery, reservas e passeios aparecerão aqui em tempo real.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-3xl bg-[#141719] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition shadow-lg relative group"
                  >
                    {/* Topo do Card */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400 tracking-wider">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {order.customer.name}
                        </h3>
                        <p className="text-[11px] text-slate-400">{order.businessName}</p>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-slate-300">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2">
                            <span>
                              <strong className="text-white">{item.quantity}x</strong> {item.name}
                            </span>
                            <span className="text-slate-400 shrink-0">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        ))}

                        {/* Detalhes de Reserva ou Destino */}
                        {order.destination && (
                          <div className="pt-2 border-t border-white/5 text-[11px] text-amber-300 flex items-center gap-1.5">
                            <span>📍 {order.destination.detail}</span>
                          </div>
                        )}

                        {order.bookingDetails && (
                          <div className="pt-2 border-t border-white/5 text-[11px] text-sky-300 space-y-0.5">
                            <p>📅 {order.bookingDetails.timeSlot || order.bookingDetails.checkInDate}</p>
                            {order.bookingDetails.guestsCount && (
                              <p>👥 {order.bookingDetails.guestsCount} pessoas</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rodapé & Ações do KDS */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Total Pago ({order.paymentMethod}):</span>
                        <strong className="text-sm font-black text-[#F6C945]">
                          {formatCurrency(order.totalAmount)}
                        </strong>
                      </div>

                      {/* Botões de Ação Dinâmica de Status */}
                      <div className="flex items-center gap-1.5">
                        {order.status === 'novo' && (
                          <>
                            <button
                              onClick={() => handleAdvanceStatus(order.id, 'confirmado')}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
                            >
                              Aceitar Pedido
                            </button>
                            <button
                              onClick={() => handleAdvanceStatus(order.id, 'recusado')}
                              className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition border border-rose-500/30"
                            >
                              Recusar
                            </button>
                          </>
                        )}

                        {order.status === 'confirmado' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'preparando')}
                            className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>Mandar para a Cozinha / Separar</span>
                          </button>
                        )}

                        {order.status === 'preparando' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'em_rota')}
                            className="w-full py-2.5 px-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Despachar Entrega / Chamar Mesa</span>
                          </button>
                        )}

                        {order.status === 'em_rota' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'concluido')}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmar Entrega Concluída</span>
                          </button>
                        )}

                        {order.status === 'concluido' && (
                          <div className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-400">
                            ✓ Atendimento Finalizado
                          </div>
                        )}
                      </div>

                      {/* Botão de WhatsApp do Cliente */}
                      <a
                        href={`https://wa.me/${order.customer.whatsappFormatted}?text=${encodeURIComponent(
                          `Olá ${order.customer.name}! Aqui é do ${order.businessName}. Estamos cuidando do seu pedido ${order.orderNumber}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Abrir WhatsApp do Cliente</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* CONTEÚDO DA ABA CRM & CLIENTES */}
      {activeTab === 'crm' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Base de Clientes & CRM</h2>
            <p className="text-xs text-slate-300">
              Lista exclusiva de clientes que já compraram ou reservaram. Dados 100% seus, sem intermediários.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueCustomers.map((customer, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-4 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{customer.name}</h3>
                    <p className="text-xs text-slate-400">{customer.phone}</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {customer.ordersCount} pedidos
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Gasto na Casa:</span>
                    <strong className="text-sm font-black text-[#F6C945]">
                      {formatCurrency(customer.totalSpent)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Última Compra:</span>
                    <span className="text-slate-300">
                      {new Date(customer.lastOrderDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${customer.whatsappFormatted}?text=${encodeURIComponent(
                    `Olá ${customer.name}! Vimos que você já visitou nossa casa em Caraíva. Estamos com novidades exclusivas para hoje!`
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

      {/* CONTEÚDO DA ABA FINANCEIRO & DRE */}
      {activeTab === 'financeiro' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Demonstrativo Financeiro (DRE em Tempo Real)</h2>
            <p className="text-xs text-slate-300">
              Controle de faturamento, divisão de recebíveis por método de pagamento e economia de taxas.
            </p>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Faturamento Bruto
              </span>
              <p className="text-2xl font-black text-white">{formatCurrency(totalGross)}</p>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 100% transacionado na plataforma
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pix Direto (0% Espera)
              </span>
              <p className="text-2xl font-black text-[#F6C945]">{formatCurrency(totalPix)}</p>
              <span className="text-[11px] text-slate-400">
                {totalGross > 0 ? ((totalPix / totalGross) * 100).toFixed(0) : 0}% das transações
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-[#141719] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cartões Online / Mesa
              </span>
              <p className="text-2xl font-black text-sky-400">{formatCurrency(totalCard)}</p>
              <span className="text-[11px] text-slate-400">
                {totalGross > 0 ? ((totalCard / totalGross) * 100).toFixed(0) : 0}% das transações
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-[#141719] border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Economia vs. iFood (25%)
              </span>
              <p className="text-2xl font-black text-emerald-400">
                + {formatCurrency(estimatedIfoodLoss)}
              </p>
              <span className="text-[11px] text-slate-300">
                Dinheiro que ficou no seu bolso
              </span>
            </div>
          </div>
        </main>
      )}

      {/* CONTEÚDO DA ABA PLACA DE MESA NFC */}
      {activeTab === 'placa_nfc' && (
        <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-black text-white">Placa de Mesa Black Piano com NFC</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              A peça física que substitui o garçom no fechamento da conta e elimina filas de espera.
            </p>
          </div>

          <div className="max-w-sm mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#181C20] via-[#0D1012] to-[#060809] border-2 border-[#F6C945]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F6C945] to-transparent" />

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#F6C945]">
                TapTable • Caraíva Digital
              </span>
              <h3 className="text-xl font-black text-white">Mesa 08</h3>
              <p className="text-xs text-slate-400">Boteco do Pará • Beira-Rio</p>
            </div>

            <div className="w-44 h-44 mx-auto p-3 rounded-2xl bg-white flex items-center justify-center shadow-inner">
              <QrCode className="w-36 h-36 text-slate-950" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/30 text-xs font-bold text-[#F6C945]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aproxime o Celular (NFC)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cardápio sem baixar app • Pedido direto na cozinha • Pagamento na mesa
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
