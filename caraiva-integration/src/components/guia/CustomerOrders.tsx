import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  MessageCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  getUnifiedOrders,
  type UnifiedOrder,
  getStatusBadge,
  formatCurrency,
} from '../../services/villageUnifiedOrdersService';

export const CustomerOrders: React.FC = () => {
  const [orders, setOrders] = useState<UnifiedOrder[]>(() => getUnifiedOrders());
  const [activeTab, setActiveTab] = useState<'todos' | 'delivery' | 'reservas'>('todos');
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const reloadOrders = () => {
    setIsRefreshing(true);
    setOrders(getUnifiedOrders());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    const handleSync = (e: any) => {
      if (e.detail) {
        setOrders(e.detail);
      } else {
        setOrders(getUnifiedOrders());
      }
    };
    window.addEventListener('caraiva:orders-updated', handleSync);
    return () => window.removeEventListener('caraiva:orders-updated', handleSync);
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'delivery') return o.orderType === 'delivery';
    if (activeTab === 'reservas') return o.orderType === 'hospedagem' || o.orderType === 'passeio' || o.orderType === 'mesa';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090B0C] text-[#FFF4ED] font-sans pb-24">
      {/* Header Fixo */}
      <header className="sticky top-0 z-30 bg-[#090B0C]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            to="/guia"
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Guia</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-[#F6C945] uppercase">
              Caraíva Digital
            </span>
          </div>

          <button
            onClick={reloadOrders}
            className={`p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white transition ${
              isRefreshing ? 'animate-spin text-[#F6C945]' : ''
            }`}
            title="Atualizar status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* Título & Boas-Vindas */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F6C945] px-2 py-0.5 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/30">
              Minha Viagem Conectada
            </span>
            <span className="text-[10px] text-slate-400">Atualizações em tempo real</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Meus Pedidos & Reservas
          </h1>
          <p className="text-xs text-slate-300">
            Acompanhe entregas na sua pousada, reservas de mesas, passeios de barco e vouchers na vila.
          </p>
        </div>

        {/* Abas Rápidas */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#141719] border border-white/10">
          <button
            onClick={() => setActiveTab('todos')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'todos'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'delivery'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Delivery ({orders.filter((o) => o.orderType === 'delivery').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'reservas'
                ? 'bg-[#F6C945] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservas ({orders.filter((o) => o.orderType !== 'delivery').length})</span>
          </button>
        </div>

        {/* Lista de Pedidos */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#141719]/50 border border-white/10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Nenhum pedido encontrado nesta aba</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore o guia para pedir pratos na sua pousada, reservar sua mesa beira-rio ou agendar passeios de lancha.
              </p>
            </div>
            <Link
              to="/guia"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6C945] text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-[#F6C945]/20"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Explorar Vila de Caraíva</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="p-4 sm:p-5 rounded-3xl bg-[#141719] border border-white/10 hover:border-[#F6C945]/50 transition cursor-pointer space-y-3.5 shadow-md group"
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400">{order.orderNumber}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F6C945] transition mt-0.5">
                        {order.businessName}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Valor Total</span>
                      <p className="text-sm sm:text-base font-black text-[#F6C945]">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Resumo dos Itens ou Reserva */}
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 space-y-1.5">
                    {order.orderType === 'delivery' && (
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-slate-400">{formatCurrency(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {order.orderType === 'hospedagem' && order.bookingDetails && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-white font-bold">
                          <Calendar className="w-3.5 h-3.5 text-[#F6C945]" />
                          <span>
                            {order.bookingDetails.roomOrSuiteName || 'Suíte Reservada'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Check-in: {order.bookingDetails.checkInDate} até {order.bookingDetails.checkOutDate} ({order.bookingDetails.guestsCount} hóspedes)
                        </p>
                      </div>
                    )}

                    {order.orderType === 'passeio' && order.bookingDetails && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-white font-bold">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <span>{order.bookingDetails.tourTitle || 'Passeio Náutico'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {order.bookingDetails.timeSlot} • Embarque: {order.bookingDetails.departurePoint}
                        </p>
                      </div>
                    )}

                    {order.orderType === 'mesa' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-white font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-[#F6C945]" />
                          <span>Reserva de Mesa Solar & Consumação</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {order.destination?.detail} • {order.bookingDetails?.timeSlot}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Rodapé do Card */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      {order.destination?.label && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300 truncate max-w-[200px]">{order.destination.label}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[#F6C945] font-bold text-xs">
                      <span>Ver Comprovante</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Detalhes do Pedido / Comprovante */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
          <div className="w-full max-w-lg bg-[#141719] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Topo do Modal */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-black text-[#F6C945] tracking-wider uppercase">
                  {selectedOrder.orderNumber}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedOrder.businessName}
                </h2>
                <p className="text-xs text-slate-400">
                  Emitido em {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Status Stepper Visual */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Status da Operação</span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(selectedOrder.status).bg} ${getStatusBadge(selectedOrder.status).text}`}
                >
                  {getStatusBadge(selectedOrder.status).label}
                </span>
              </div>

              {/* Barra de Progresso */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <div className="h-1.5 rounded-full bg-[#F6C945]" />
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    ['confirmado', 'preparando', 'em_rota', 'checkin_realizado', 'concluido'].includes(selectedOrder.status)
                      ? 'bg-[#F6C945]'
                      : 'bg-white/10'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    ['preparando', 'em_rota', 'checkin_realizado', 'concluido'].includes(selectedOrder.status)
                      ? 'bg-[#F6C945]'
                      : 'bg-white/10'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    ['concluido', 'checkin_realizado'].includes(selectedOrder.status)
                      ? 'bg-emerald-400'
                      : 'bg-white/10'
                  }`}
                />
              </div>
            </div>

            {/* Detalhes Financeiros & Itens */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Itens & Detalhamento
              </h4>
              <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-medium">
                        {item.quantity}x {item.name}
                      </p>
                      {item.notes && <p className="text-[10px] text-slate-400 italic">Obs: {item.notes}</p>}
                    </div>
                    <span className="font-bold text-[#FFF4ED]">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-2.5 mt-2 flex items-center justify-between text-sm font-black">
                  <span className="text-white">Total Pago ({selectedOrder.paymentMethod.toUpperCase()})</span>
                  <span className="text-[#F6C945]">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Informações de Local / Entrega */}
            {selectedOrder.destination && (
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Local de Entrega / Atendimento
                </span>
                <p className="text-xs text-white font-medium">{selectedOrder.destination.detail}</p>
              </div>
            )}

            {/* Ações: Falar com o Local via WhatsApp */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Olá! Gostaria de consultar o status do meu pedido ${selectedOrder.orderNumber} (${selectedOrder.businessName}).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Falar no WhatsApp do Local</span>
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
