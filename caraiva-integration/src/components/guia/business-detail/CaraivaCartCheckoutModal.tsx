import React, { useState } from 'react';
import { cloudCheckoutEnabled } from '../../../services/ecosystemCloud';
import { CloudCheckout } from './CloudCheckout';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  MapPin,
  Send,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  type CartItem,
  type VillageOrderPayload,
  updateCartQuantity,
  clearCart,
  clearCartForBusiness,
  buildVillageOrderPayload,
} from '../../../services/catalogCartService';

interface CaraivaCartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  cartItems: CartItem[];
  onOrderCompleted?: (order: VillageOrderPayload) => void;
}

export const CaraivaCartCheckoutModal: React.FC<CaraivaCartCheckoutModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  cartItems,
}) => {
  const [destinationType, setDestinationType] = useState<'pousada' | 'praia' | 'retirada'>('pousada');
  const [destinationDetail, setDestinationDetail] = useState(() => {
    try {
      const preset = JSON.parse(localStorage.getItem('caraiva_guest_preset') || 'null');
      return preset?.deliveryPreset || '';
    } catch {
      return '';
    }
  });
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_entrega' | 'dinheiro'>('pix');
  const [submittedOrder, setSubmittedOrder] = useState<VillageOrderPayload | null>(null);

  if (!isOpen) return null;
  if (cloudCheckoutEnabled) return <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-3"><div className="w-full max-w-lg"><CloudCheckout key={businessId} businessId={businessId} businessName={businessName} onClose={onClose}/></div></div>;

  // Itens deste comércio
  const currentItems = cartItems.filter((i) => i.businessId === businessId);
  const subtotal = currentItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const deliveryFee = destinationType === 'retirada' ? 0 : 10;
  const total = subtotal + deliveryFee;

  const handleSendOrder = () => {
    if (currentItems.length === 0) return;

    const payload = buildVillageOrderPayload({
      businessId,
      businessName,
      businessNiche: currentItems[0]?.businessNiche || 'conveniencia',
      customerName: customerName.trim() || 'Visitante de Caraíva',
      destinationType,
      destinationDetail: destinationDetail.trim() || 'A combinar na vila',
      paymentMethod,
    });

    setSubmittedOrder(payload);

    // Sincroniza em tempo real com o KDS do Business (/business/delivery) via BroadcastChannel e localStorage
    try {
      const businessStoreKey = "caraiva-demo-v2";
      const rawStore = localStorage.getItem(businessStoreKey);
      const storeData = rawStore ? JSON.parse(rawStore) : { orders: [], bookings: [], products: [] };
      
      const newEcosystemOrder = {
        id: payload.orderId,
        establishmentId: businessId,
        items: payload.items.map(i => ({ name: i.name, qty: i.quantity, price: i.unitPrice })),
        address: `${payload.destinationType === 'pousada' ? '🏨 ' : payload.destinationType === 'praia' ? '🏖️ ' : '🛍️ '}${payload.destinationDetail}`,
        zone: payload.destinationType,
        split: { gross: payload.totalAmount, merchantNet: payload.totalAmount - payload.deliveryFee, courierNet: payload.deliveryFee, platformFee: 0 },
        status: "novo",
        createdAt: Date.now(),
        customerName: payload.customerName,
        paymentMethod: payload.paymentMethod,
        paymentStatus: "paid"
      };

      storeData.orders = [newEcosystemOrder, ...(storeData.orders || [])];
      localStorage.setItem(businessStoreKey, JSON.stringify(storeData));

      // Dispara sinal imediato para todas as abas do Business e Guia
      const bc = new BroadcastChannel(businessStoreKey);
      bc.postMessage("sync");
      bc.close();
      window.dispatchEvent(new Event(businessStoreKey));
    } catch (e) {
      console.warn("Ecosystem sync fallback:", e);
    }

    try {
      const existingOrders = JSON.parse(localStorage.getItem('caraiva_orders_history') || '[]');
      existingOrders.unshift(payload);
      localStorage.setItem('caraiva_orders_history', JSON.stringify(existingOrders));
      window.dispatchEvent(new CustomEvent('caraiva:order-submitted', { detail: payload }));
    } catch {
      // Storage fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          background: 'var(--cv-paper)',
          borderColor: 'var(--cv-line)',
        }}
      >
        {/* Header da Sacola */}
        <div className="p-4 border-b border-[var(--cv-line)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white" style={{ color: 'var(--cv-ink)' }}>
                Sua Sacola em {businessName}
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--cv-muted)' }}>
                {currentItems.length} {currentItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentItems.length > 0 && !submittedOrder && (
              <button
                type="button"
                onClick={() => clearCartForBusiness(businessId)}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Esvaziar sacola deste estabelecimento"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Esvaziar Sacola</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {submittedOrder ? (
            /* Confirmação ativa do pedido com sincronização imediata */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Pedido #{submittedOrder.orderId} Confirmado
                </span>
                <h3 className="text-lg font-black text-white mt-2" style={{ color: 'var(--cv-ink)' }}>
                  Pedido Enviado para {businessName}!
                </h3>
                <p className="text-xs max-w-sm mx-auto mt-1" style={{ color: 'var(--cv-muted)' }}>
                  O estabelecimento já recebeu seu pedido na cozinha. Você pode acompanhar o status de preparo e rota.
                </p>
              </div>

              {/* Card de Resumo do Pedido */}
              <div
                className="p-3.5 rounded-2xl border text-left space-y-2 text-xs"
                style={{ background: 'var(--cv-soft)', borderColor: 'var(--cv-line)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-500">Resumo da Solicitação</span>
                  <span className="text-[11px] font-bold text-emerald-400">Em Preparo ⏱️</span>
                </div>
                <div className="space-y-1">
                  {submittedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]" style={{ color: 'var(--cv-ink)' }}>
                      <span>{it.quantity}x {it.name}</span>
                      <span>R$ {it.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-[var(--cv-line)] flex justify-between font-bold text-xs" style={{ color: 'var(--cv-ink)' }}>
                    <span>Total ({submittedOrder.destinationType})</span>
                    <span className="text-amber-400">R$ {submittedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  📍 Entrega: {submittedOrder.destinationDetail}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="/guia/pedidos"
                  onClick={() => {
                    clearCart();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acompanhar meus Pedidos & Status</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all"
                >
                  Voltar ao Guia de Caraíva
                </button>
              </div>
            </div>
          ) : currentItems.length === 0 ? (
            /* SACOLA VAZIA */
            <div className="text-center py-10 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-500 opacity-40" />
              <p className="text-xs font-semibold" style={{ color: 'var(--cv-muted)' }}>
                Sua sacola está vazia neste comércio.
              </p>
            </div>
          ) : (
            /* LISTA DE ITENS + FORMULÁRIO DE ENTREGA */
            <>
              {/* Itens na Sacola */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--cv-muted)' }}>
                    Itens no Pedido ({currentItems.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => clearCartForBusiness(businessId)}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpar itens</span>
                  </button>
                </div>
                {currentItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3"
                    style={{ background: 'var(--cv-soft)', borderColor: 'var(--cv-line)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate" style={{ color: 'var(--cv-ink)' }}>
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-amber-500 font-extrabold">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                        <span className="text-[10px] font-normal opacity-70 ml-1">
                          ({item.quantity}x {item.product.formattedPrice})
                        </span>
                      </p>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-1.5 bg-black/10 rounded-lg p-1 border border-white/10">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, businessId, -1)}
                        className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1" style={{ color: 'var(--cv-ink)' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, businessId, 1)}
                        className="w-5 h-5 rounded bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Destino da Entrega */}
              <div className="space-y-2 pt-2 border-t border-[var(--cv-line)]">
                <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--cv-ink)' }}>
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Onde entregar em Caraíva?</span>
                </label>

                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'pousada', label: '🏨 Pousada/Casa' },
                    { id: 'praia', label: '🏖️ Ponto na Areia' },
                    { id: 'retirada', label: '🛍️ Retirar no Local' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDestinationType(opt.id as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        destinationType === opt.id
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-white/5 text-[var(--cv-muted)] border-[var(--cv-line)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={destinationDetail}
                  onChange={(e) => setDestinationDetail(e.target.value)}
                  placeholder={
                    destinationType === 'pousada'
                      ? 'Nome da pousada ou quarto (ex: Pousada da Barra, Suíte 03)'
                      : destinationType === 'praia'
                      ? 'Ponto de referência na areia (ex: Perto da Barraca do Caju)'
                      : 'Retirada pessoal no balcão'
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/5 border border-[var(--cv-line)] focus:outline-none focus:border-amber-400 transition"
                  style={{ color: 'var(--cv-ink)' }}
                />
              </div>

              {/* Identificação do Cliente */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold block" style={{ color: 'var(--cv-ink)' }}>
                  Seu Nome ou Apelido
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Como o comércio deve te chamar?"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/5 border border-[var(--cv-line)] focus:outline-none focus:border-amber-400 transition"
                  style={{ color: 'var(--cv-ink)' }}
                />
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold block" style={{ color: 'var(--cv-ink)' }}>
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pix', label: '⚡ Pix Direto' },
                    { id: 'cartao_entrega', label: '💳 Maquininha' },
                    { id: 'dinheiro', label: '💵 Dinheiro' },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setPaymentMethod(pay.id as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        paymentMethod === pay.id
                          ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                          : 'bg-white/5 text-[var(--cv-muted)] border-[var(--cv-line)]'
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div
                className="p-3.5 rounded-2xl border space-y-1.5 text-xs"
                style={{ background: 'var(--cv-soft)', borderColor: 'var(--cv-line)' }}
              >
                <div className="flex justify-between" style={{ color: 'var(--cv-muted)' }}>
                  <span>Subtotal dos itens</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between" style={{ color: 'var(--cv-muted)' }}>
                  <span>Taxa de entrega na vila</span>
                  <span>{deliveryFee === 0 ? 'Grátis (Retirada)' : `R$ ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div
                  className="pt-2 border-t border-[var(--cv-line)] flex justify-between font-black text-sm"
                  style={{ color: 'var(--cv-ink)' }}
                >
                  <span>Total do Pedido</span>
                  <span className="text-amber-500 text-base">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer com Botão de Ação */}
        {!submittedOrder && currentItems.length > 0 && (
          <div className="p-4 border-t border-[var(--cv-line)] bg-black/10">
            <button
              type="button"
              onClick={handleSendOrder}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 active:scale-98 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido para {businessName}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
