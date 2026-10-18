import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle2,
  Send,
  Printer,
  BellRing,
  Sparkles,
  Flame,
  Wine,
  PlusCircle,
  Timer,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  type UnifiedOrder,
  type OrderNiche,
  formatCurrency,
  updateOrderStatus
} from '../../../services/villageUnifiedOrdersService';

interface CaraivaKdsActionTabProps {
  niche: OrderNiche;
  orders: UnifiedOrder[];
  onOrderUpdated: () => void;
  onOpenPosLauncher: () => void;
}

// Síntese de som tátil de cozinha via Web Audio API (sem dependência de arquivo externo)
function playKdsChime(type: 'dispatch' | 'bell' | 'print') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'dispatch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      // Print scratch sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch {
    // Silencioso se o áudio estiver bloqueado pelo navegador
  }
}

export const CaraivaKdsActionTab: React.FC<CaraivaKdsActionTabProps> = ({
  niche: _niche,
  orders,
  onOrderUpdated,
  onOpenPosLauncher,
}) => {
  const [selectedStation, setSelectedStation] = useState<'todas' | 'cozinha' | 'bar' | 'forno'>('todas');
  const [printingOrderId, setPrintingOrderId] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Filtro de pedidos por estação
  const filteredOrders = orders.filter((order) => {
    if (selectedStation === 'todas') return true;
    if (selectedStation === 'bar') {
      return order.items.some((i) => i.name.toLowerCase().includes('drink') || i.name.toLowerCase().includes('gin') || i.name.toLowerCase().includes('cerveja') || i.name.toLowerCase().includes('suco'));
    }
    if (selectedStation === 'forno') {
      return order.items.some((i) => i.name.toLowerCase().includes('pizza') || i.name.toLowerCase().includes('pão') || i.name.toLowerCase().includes('telha'));
    }
    return true;
  });

  const activeOrdersCount = orders.filter((o) => o.status !== 'concluido' && o.status !== 'cancelado').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'preparando').length;
  const readyOrdersCount = orders.filter((o) => o.status === 'em_rota' || o.status === 'confirmado').length;

  const handleAdvance = (orderId: string, nextStatus: 'preparando' | 'em_rota' | 'concluido') => {
    playKdsChime('dispatch');
    updateOrderStatus(orderId, nextStatus);
    onOrderUpdated();
    const label = nextStatus === 'preparando' ? 'em preparo na cozinha' : nextStatus === 'em_rota' ? 'pronto para servir no salão' : 'concluído com sucesso';
    setLastNotification(`Pedido atualizado: ${label}!`);
    setTimeout(() => setLastNotification(null), 3500);
  };

  const handleSimulatePrint = (orderId: string) => {
    playKdsChime('print');
    setPrintingOrderId(orderId);
    setTimeout(() => setPrintingOrderId(null), 2400);
  };

  const handleRingWaiter = (orderNumber: string) => {
    playKdsChime('bell');
    setLastNotification(`Garçom notificado via NFC para o pedido ${orderNumber}!`);
    setTimeout(() => setLastNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header com Notificação Flutuante de Sucesso */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4EEDB2]/10 border border-[#4EEDB2]/30 text-[#4EEDB2] text-[11px] font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KDS & Linha de Produção Inteligente</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>FILA DE PREPARO EM TEMPO REAL</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
              {activeOrdersCount} ATIVOS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Sincronizado automaticamente com aproximações de celular nas Placas NFC das mesas e chamados do salão.
          </p>
        </div>

        {/* Ação Rápida de Adicionar Pedido Manual */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPosLauncher}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(255,255,255,0.15)] transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Lançar Pedido Manual</span>
          </button>
        </div>
      </div>

      {/* Alerta Visual de Ação Recente */}
      <AnimatePresence>
        {lastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="p-3.5 rounded-2xl bg-[#0E1E17] border border-[#4EEDB2]/40 text-[#4EEDB2] text-xs font-semibold flex items-center gap-2.5 shadow-[0_10px_30px_rgba(78,237,178,0.2)]"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4EEDB2]" />
            <span>{lastNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Painel Visual de Métricas em Cards 3D Táteis (Apple Watch Activity / Gauges) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: SLA Médio de Preparo */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Tempo Médio de Saída</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-white font-mono">08:14</strong>
              <span className="text-[11px] text-[#4EEDB2] font-semibold">-2m vs ontem</span>
            </div>
            <p className="text-[10px] text-slate-500">Meta do salão: até 15 min</p>
          </div>
          {/* Gauge Circular SVG */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#4EEDB2]"
                strokeDasharray="78, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white font-mono">
              78%
            </div>
          </div>
        </motion.div>

        {/* Card 2: Em Preparo na Cozinha */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Na Linha de Fogo</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-[#FFD15C] font-mono">{preparingOrdersCount}</strong>
              <span className="text-[11px] text-slate-400">pedidos quentes</span>
            </div>
            <p className="text-[10px] text-slate-500">Cozinha operando a 100%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFD15C]/10 border border-[#FFD15C]/25 flex items-center justify-center text-[#FFD15C] shadow-inner">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </motion.div>

        {/* Card 3: Prontos para Servir */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Prontos no Balcão</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-[#38BDF8] font-mono">{readyOrdersCount}</strong>
              <span className="text-[11px] text-slate-400">aguardando garçom</span>
            </div>
            <p className="text-[10px] text-slate-500">Aviso via NFC disponível</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center justify-center text-[#38BDF8] shadow-inner">
            <BellRing className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Card 4: Faturamento na Esteira */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Total em Produção</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-xl font-black text-white">
                {formatCurrency(
                  orders
                    .filter((o) => o.status !== 'concluido' && o.status !== 'cancelado')
                    .reduce((acc, curr) => acc + curr.totalAmount, 0)
                )}
              </strong>
            </div>
            <p className="text-[10px] text-[#4EEDB2]">100% liquidado via Pix NFC D+0</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#4EEDB2]/10 border border-[#4EEDB2]/25 flex items-center justify-center text-[#4EEDB2] shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* 3. Seletor de Estações de Trabalho Táteis */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0A0D10] border border-white/10">
          {[
            { id: 'todas', label: 'Todas as Praças', icon: Sparkles },
            { id: 'cozinha', label: 'Cozinha Quente', icon: Flame },
            { id: 'bar', label: 'Bar & Coquetéis', icon: Wine },
            { id: 'forno', label: 'Forno & Pizzas', icon: Timer },
          ].map((station) => {
            const Icon = station.icon;
            const isActive = selectedStation === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station.id as 'todas' | 'cozinha' | 'bar' | 'forno')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{station.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500">
          Exibindo {filteredOrders.length} pedido(s) filtrados
        </span>
      </div>

      {/* 4. Grade de Tickets KDS Táteis 3D com Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.map((order) => {
          const isPreparing = order.status === 'preparando';
          const isReady = order.status === 'em_rota' || order.status === 'confirmado';
          const isDone = order.status === 'concluido';
          const isPrinting = printingOrderId === order.id;

          return (
            <motion.div
              key={order.id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden backdrop-blur-xl flex flex-col justify-between space-y-4 ${
                isDone
                  ? 'bg-[#090C0E]/70 border-white/[0.05] opacity-60'
                  : isReady
                  ? 'bg-[#0D1815] border-[#4EEDB2]/40 shadow-[0_15px_35px_rgba(78,237,178,0.12)]'
                  : isPreparing
                  ? 'bg-[#15120B] border-[#FFD15C]/40 shadow-[0_15px_35px_rgba(255,209,92,0.12)]'
                  : 'bg-[#0C1014] border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
              }`}
            >
              {/* Efeito de Slip Térmico sendo impresso */}
              <AnimatePresence>
                {isPrinting && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 120, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="absolute top-0 left-4 right-4 bg-white text-slate-900 rounded-b-xl p-3 shadow-2xl z-20 font-mono text-[10px] space-y-1 overflow-hidden border border-slate-300"
                  >
                    <div className="flex justify-between font-bold border-b pb-1">
                      <span>CARAÍVA KDS ESC/POS</span>
                      <span>#{order.orderNumber}</span>
                    </div>
                    <p className="text-slate-600">Mesa: {order.destination?.label || 'Salão Principal'}</p>
                    <p className="font-semibold text-slate-800">
                      {order.items.map((it) => `${it.quantity}x ${it.name}`).join(' • ')}
                    </p>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold pt-1">
                      <Check className="w-3 h-3" /> Imprimindo via USB/Rede...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Borda Iluminada no Topo do Ticket */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isReady ? 'bg-[#4EEDB2]' : isPreparing ? 'bg-[#FFD15C]' : 'bg-white/20'
                }`}
              />

              <div className="space-y-3">
                {/* Top do Ticket: Número, Destino e SLA */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-black text-white font-mono tracking-tight">
                        {order.orderNumber}
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/10">
                        {order.destination?.label || 'Mesa 01'}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-300 mt-1">
                      Cliente: <strong className="text-white">{order.customer.name}</strong>
                    </h4>
                  </div>

                  {/* Timer de SLA em Anel Circular Neon */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-slate-200">
                    <Clock className="w-3 h-3 text-[#FFD15C]" />
                    <span>06:40</span>
                  </div>
                </div>

                {/* Itens do Pedido com Destaque de Quantidade */}
                <div className="p-3.5 rounded-2xl bg-[#070A0D] border border-white/[0.06] space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs">
                      <div>
                        <span className="text-white font-bold">{item.quantity}x</span>{' '}
                        <span className="text-slate-200 font-medium">{item.name}</span>
                        {item.notes && (
                          <p className="text-[10px] text-[#FFD15C] mt-0.5 bg-[#FFD15C]/10 px-1.5 py-0.5 rounded inline-block">
                            Obs: {item.notes}
                          </p>
                        )}
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] font-semibold">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Total Pago via NFC</span>
                    <strong className="text-sm font-bold text-[#4EEDB2]">
                      {formatCurrency(order.totalAmount)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Tátil & Integração */}
              <div className="space-y-2 pt-1">
                {/* Ações de Linha de Produção */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulatePrint(order.id)}
                    className="py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Comanda Térmica</span>
                  </button>

                  <button
                    onClick={() => handleRingWaiter(order.orderNumber)}
                    className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-amber-500/20 transition"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Chamar Garçom</span>
                  </button>
                </div>

                {/* Avanço de Status */}
                <div>
                  {order.status === 'novo' && (
                    <button
                      onClick={() => handleAdvance(order.id, 'preparando')}
                      className="w-full py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-[0_4px_15px_rgba(255,255,255,0.2)]"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>Iniciar Preparo na Cozinha</span>
                    </button>
                  )}

                  {order.status === 'preparando' && (
                    <button
                      onClick={() => handleAdvance(order.id, 'em_rota')}
                      className="w-full py-2.5 rounded-xl bg-[#4EEDB2] text-slate-950 hover:bg-[#3ddba3] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-[0_4px_20px_rgba(78,237,178,0.3)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Pronto p/ Servir no Salão</span>
                    </button>
                  )}

                  {(order.status === 'em_rota' || order.status === 'confirmado') && (
                    <button
                      onClick={() => handleAdvance(order.id, 'concluido')}
                      className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/15 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4EEDB2]" />
                      <span>Confirmar Entrega na Mesa</span>
                    </button>
                  )}

                  {order.status === 'concluido' && (
                    <div className="w-full py-2 rounded-xl bg-white/[0.03] text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Pedido Entregue & Finalizado</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
