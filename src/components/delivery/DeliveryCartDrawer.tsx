import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import {
  X,
  ShoppingBag,
  MapPin,
  Ticket,
  Trash2,
  Plus,
  Minus,
  QrCode,
  Copy,
  Check,
  Sparkles,
  Bike,
  Store,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type {
  CartItemSelection,
  DeliveryZone,
  DeliveryCoupon,
  ActiveDeliveryOrder,
} from "./delivery.types";
import { DELIVERY_ZONES, DELIVERY_COUPONS, DELIVERY_MERCHANTS } from "./delivery.data";
import { playRiderTacticalSound } from "../../services/riderDispatchService";

interface DeliveryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItemSelection[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onClearCart: () => void;
  onOrderCreated: (order: ActiveDeliveryOrder) => void;
}

export const DeliveryCartDrawer: React.FC<DeliveryCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  selectedZone,
  onSelectZone,
  onUpdateQuantity,
  onClearCart,
  onOrderCreated,
}) => {
  const [deliveryMode, setDeliveryMode] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [pousadaOrAddress, setPousadaOrAddress] = useState<string>(
    "Pousada Vila do Mar — Suíte 04"
  );
  const [referencePoint, setReferencePoint] = useState<string>(
    "Portão azul próximo à amendoeira"
  );
  const [selectedCoupon, setSelectedCoupon] = useState<DeliveryCoupon | null>(
    DELIVERY_COUPONS[0]
  );
  const [checkoutStep, setCheckoutStep] = useState<"REVIEW" | "PIX">("REVIEW");
  const [pixQrDataUrl, setPixQrDataUrl] = useState<string>("");
  const [copiedPix, setCopiedPix] = useState<boolean>(false);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.lineTotal, 0),
    [cart]
  );

  const merchant = useMemo(() => {
    if (cart.length === 0) return null;
    return (
      DELIVERY_MERCHANTS.find((m) => m.id === cart[0].merchantId) ??
      DELIVERY_MERCHANTS[0]
    );
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (deliveryMode === "PICKUP") return 0;
    const merchantBase = merchant?.deliveryFee ?? 0;
    return merchantBase + selectedZone.baseFee;
  }, [deliveryMode, merchant, selectedZone]);

  const discount = useMemo(() => {
    if (!selectedCoupon) return 0;
    if (subtotal < selectedCoupon.minOrderValue) return 0;
    return selectedCoupon.discountAmount;
  }, [selectedCoupon, subtotal]);

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const pixPayload = useMemo(() => {
    const cleanTotal = total.toFixed(2);
    return `00020126580014BR.GOV.BCB.PIX0136caraiva-delivery-pay@nxacorp.com.br520400005303986540${cleanTotal.length}${cleanTotal}5802BR5920CARAIVA DELIVERY VIP6007CARAIVA62070503***6304ABCD`;
  }, [total]);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep("REVIEW");
      return;
    }
    let mounted = true;
    QRCode.toDataURL(pixPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: "#090B0C",
        light: "#FFF4ED",
      },
    })
      .then((url: string) => {
        if (mounted) setPixQrDataUrl(url);
      })
      .catch(() => {
        if (mounted) setPixQrDataUrl("");
      });
    return () => {
      mounted = false;
    };
  }, [isOpen, pixPayload]);

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixPayload).catch(() => {});
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2200);
  };

  const handleFinalizeOrder = () => {
    if (cart.length === 0 || !merchant) return;
    playRiderTacticalSound("cash_register");

    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const newOrder: ActiveDeliveryOrder = {
      orderId: `IFD-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: "Agora mesmo",
      merchantId: merchant.id,
      merchantName: merchant.name,
      merchantLogo: merchant.logoImage,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      total,
      status: "CONFIRMED",
      deliveryMode,
      zone: selectedZone,
      pousadaOrAddress:
        deliveryMode === "PICKUP"
          ? `Retirada no Balcão — ${merchant.name}`
          : pousadaOrAddress || "Pousada Central Caraíva",
      referencePoint:
        deliveryMode === "PICKUP"
          ? merchant.addressZone
          : referencePoint || selectedZone.referenceHint,
      confirmationPin: pin,
      courier: {
        name: "Neto Pataxó • Frota Caraíva VIP",
        modal: selectedZone.courierModal,
        rating: 4.99,
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        progressPct: 18,
      },
    };

    onOrderCreated(newOrder);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#090B0C] text-[#FFF4ED] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#141719] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EA1D2C]/15 text-[#EA1D2C]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {checkoutStep === "REVIEW"
                      ? "Sua Sacola Caraíva"
                      : "Checkout Pix Instantâneo"}
                  </h2>
                  <p className="text-[11px] text-white/55">
                    {merchant ? merchant.name : "Adicione itens para pedir"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && checkoutStep === "REVIEW" && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="rounded-lg px-2 py-1 text-[11px] font-semibold text-[#FF5A65] hover:bg-white/5"
                  >
                    Limpar
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar sacola"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/30">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Sua sacola está vazia
                </h3>
                <p className="mt-1 max-w-xs text-xs text-white/55">
                  Explore os melhores restaurantes, moquecas, pastéis e drinks gelados de Caraíva para receber na pousada ou na areia.
                </p>
              </div>
            ) : checkoutStep === "REVIEW" ? (
              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                {/* Mode Toggle: Delivery vs Pickup */}
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#141719] p-1.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode("DELIVERY")}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      deliveryMode === "DELIVERY"
                        ? "bg-[#EA1D2C] text-white shadow"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Bike className="h-4 w-4" />
                    Entrega ({selectedZone.estimatedMinutes})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode("PICKUP")}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      deliveryMode === "PICKUP"
                        ? "bg-[#EA1D2C] text-white shadow"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    Retirada (Grátis)
                  </button>
                </div>

                {/* Address / Zone Box */}
                {deliveryMode === "DELIVERY" && (
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141719] p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#F6C945]">
                        <MapPin className="h-4 w-4" />
                        Zona Logística de Caraíva
                      </span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                        {selectedZone.courierModal}
                      </span>
                    </div>

                    <select
                      aria-label="Selecionar zona de entrega em Caraíva"
                      value={selectedZone.id}
                      onChange={(e) => {
                        const found = DELIVERY_ZONES.find(
                          (z) => z.id === e.target.value
                        );
                        if (found) onSelectZone(found);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2.5 text-xs font-semibold text-white focus:border-[#F6C945] focus:outline-none"
                    >
                      {DELIVERY_ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} • {z.estimatedMinutes} (
                          {z.baseFee === 0 ? "Taxa Base Grátis" : `+R$ ${z.baseFee}`}
                          )
                        </option>
                      ))}
                    </select>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={pousadaOrAddress}
                        onChange={(e) => setPousadaOrAddress(e.target.value)}
                        placeholder="Nome da Pousada, Casa ou Barraca de Praia"
                        className="w-full rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2 text-xs text-white placeholder-white/35 focus:border-[#F6C945] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={referencePoint}
                        onChange={(e) => setReferencePoint(e.target.value)}
                        placeholder="Ponto de referência (Ex: Portão azul, perto da igreja)"
                        className="w-full rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2 text-xs text-white placeholder-white/35 focus:border-[#F6C945] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Cart Items */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold tracking-wider text-white/60 uppercase">
                    Itens do Pedido ({cart.length})
                  </h3>
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="rounded-2xl border border-white/10 bg-[#141719] p-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white">
                            {item.quantity}x {item.menuItem.name}
                          </h4>
                          {item.selectedOptions.length > 0 && (
                            <ul className="mt-1 space-y-0.5 text-[11px] text-white/55">
                              {item.selectedOptions.map((opt, idx) => (
                                <li key={idx}>
                                  • {opt.optionName}{" "}
                                  {opt.price > 0 && `(+R$ ${opt.price})`}
                                </li>
                              ))}
                            </ul>
                          )}
                          {item.notes && (
                            <p className="mt-1 rounded-md bg-white/5 px-2 py-1 text-[11px] italic text-[#F6C945]">
                              Obs: &ldquo;{item.notes}&rdquo;
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs font-extrabold text-emerald-400">
                          R$ {item.lineTotal.toFixed(2).replace(".", ",")}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/5 pt-2.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          aria-label="Remover uma unidade"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-[#090B0C] text-white/70 hover:text-white"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="h-3.5 w-3.5 text-[#FF5A65]" />
                          ) : (
                            <Minus className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <span className="min-w-5 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          aria-label="Adicionar uma unidade"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-[#090B0C] text-[#EA1D2C]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupons Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Ticket className="h-4 w-4 text-[#F6C945]" />
                      Cupons Clube iFood Caraíva
                    </span>
                  </div>
                  <div className="space-y-2">
                    {DELIVERY_COUPONS.map((coupon) => {
                      const isSelected = selectedCoupon?.code === coupon.code;
                      const isEligible = subtotal >= coupon.minOrderValue;
                      return (
                        <button
                          key={coupon.code}
                          type="button"
                          onClick={() =>
                            setSelectedCoupon(isSelected ? null : coupon)
                          }
                          className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                            isSelected
                              ? "border-[#F6C945] bg-[#F6C945]/10"
                              : "border-white/10 bg-[#141719] hover:border-white/20"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-[#F6C945]/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#F6C945]">
                                {coupon.code}
                              </span>
                              <span className="text-xs font-bold text-white">
                                {coupon.title}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-white/55">
                              {isEligible
                                ? coupon.description
                                : `Faltam R$ ${(coupon.minOrderValue - subtotal).toFixed(2).replace(".", ",")} para liberar este cupom`}
                            </p>
                          </div>
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              isSelected && isEligible
                                ? "border-[#F6C945] bg-[#F6C945] text-black"
                                : "border-white/25"
                            }`}
                          >
                            {isSelected && isEligible && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary Breakdown */}
                <div className="space-y-2 rounded-2xl border border-white/10 bg-[#141719] p-4 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal dos itens</span>
                    <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Taxa de entrega ({selectedZone.name})</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-emerald-400">Grátis</span>
                      ) : (
                        `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-semibold text-[#F6C945]">
                      <span>Desconto Cupom ({selectedCoupon?.code})</span>
                      <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-2.5 text-sm font-extrabold text-white">
                    <span>Total a pagar</span>
                    <span className="text-emerald-400">
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* PIX 1-CLICK STEP */
              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <div className="rounded-3xl border border-[#F6C945]/30 bg-gradient-to-b from-[#141719] to-[#090B0C] p-5 text-center">
                  <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    Aprovação em Tempo Real • Split Automático
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Escaneie ou copie o Pix Copia e Cola
                  </h3>
                  <p className="mt-1 text-xs text-white/60">
                    Assim que confirmado, seu pedido entra direto no KDS da cozinha de{" "}
                    <strong className="text-white">{merchant?.name}</strong>.
                  </p>

                  <div className="mx-auto my-4 flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-[#F6C945] bg-[#FFF4ED] p-3 shadow-lg">
                    {pixQrDataUrl ? (
                      <img
                        src={pixQrDataUrl}
                        alt="QR Code Pix Caraíva Delivery"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <QrCode className="h-20 w-20 text-black/40" />
                    )}
                  </div>

                  <div className="mb-3 text-xl font-black text-emerald-400">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        Código Pix Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-[#F6C945]" />
                        Copiar Código Pix Copia e Cola
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-[#141719] p-3.5 text-xs text-white/70">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#F6C945]" />
                  <div>
                    <strong className="block text-white">
                      Código de Segurança na Entrega
                    </strong>
                    Ao confirmar, você receberá um PIN de 4 dígitos para informar ao entregador na chegada à sua pousada.
                  </div>
                </div>
              </div>
            )}

            {/* Footer Action */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 bg-[#141719] p-4">
                {checkoutStep === "REVIEW" ? (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("PIX")}
                    className="flex w-full items-center justify-between rounded-2xl bg-[#EA1D2C] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#EA1D2C]/25 transition hover:bg-[#d81927]"
                  >
                    <span>Escolher Pagamento Pix</span>
                    <span className="flex items-center gap-1.5">
                      R$ {total.toFixed(2).replace(".", ",")}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleFinalizeOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                    >
                      <Check className="h-4 w-4 stroke-[2.5]" />
                      Já Paguei • Acompanhar Pedido ao Vivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("REVIEW")}
                      className="w-full py-1.5 text-center text-xs text-white/60 hover:text-white"
                    >
                      Voltar para revisão da sacola
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
