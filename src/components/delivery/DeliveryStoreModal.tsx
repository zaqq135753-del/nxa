import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Star,
  Clock,
  Bike,
  Sparkles,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  Flame,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import type {
  DeliveryMerchant,
  DeliveryMenuItem,
  ProductOptionGroup,
  ProductOptionItem,
  CartItemSelection,
} from "./delivery.types";

interface DeliveryStoreModalProps {
  merchant: DeliveryMerchant | null;
  onClose: () => void;
  onAddToCart: (item: CartItemSelection) => void;
}

export const DeliveryStoreModal: React.FC<DeliveryStoreModalProps> = ({
  merchant,
  onClose,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customizingItem, setCustomizingItem] = useState<DeliveryMenuItem | null>(null);
  const [selectedMap, setSelectedMap] = useState<Record<string, ProductOptionItem[]>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    setActiveCategory("all");
    setCustomizingItem(null);
  }, [merchant?.id]);

  const openItemCustomization = (item: DeliveryMenuItem) => {
    const initialSelections: Record<string, ProductOptionItem[]> = {};
    if (item.optionGroups) {
      for (const group of item.optionGroups) {
        if (group.required && group.options.length > 0) {
          initialSelections[group.id] = [group.options[0]];
        } else {
          initialSelections[group.id] = [];
        }
      }
    }
    setSelectedMap(initialSelections);
    setQuantity(1);
    setNotes("");
    setCustomizingItem(item);
  };

  const handleToggleOption = (group: ProductOptionGroup, option: ProductOptionItem) => {
    setSelectedMap((prev) => {
      const current = prev[group.id] ?? [];
      const exists = current.some((o) => o.id === option.id);

      if (group.maxSelect === 1) {
        return { ...prev, [group.id]: [option] };
      }

      if (exists) {
        if (group.required && current.length <= group.minSelect) {
          return prev;
        }
        return { ...prev, [group.id]: current.filter((o) => o.id !== option.id) };
      } else {
        if (current.length >= group.maxSelect) {
          return prev;
        }
        return { ...prev, [group.id]: [...current, option] };
      }
    });
  };

  const isCustomizationValid = useMemo(() => {
    if (!customizingItem?.optionGroups) return true;
    return customizingItem.optionGroups.every((group) => {
      if (!group.required) return true;
      const chosen = selectedMap[group.id] ?? [];
      return chosen.length >= group.minSelect;
    });
  }, [customizingItem, selectedMap]);

  const unitTotal = useMemo(() => {
    if (!customizingItem) return 0;
    let extra = 0;
    for (const items of Object.values(selectedMap)) {
      for (const opt of items) {
        extra += opt.price;
      }
    }
    return customizingItem.price + extra;
  }, [customizingItem, selectedMap]);

  const lineTotal = unitTotal * quantity;

  const handleConfirmItem = () => {
    if (!merchant || !customizingItem || !isCustomizationValid) return;

    const flattenedOptions: CartItemSelection["selectedOptions"] = [];
    if (customizingItem.optionGroups) {
      for (const group of customizingItem.optionGroups) {
        const chosen = selectedMap[group.id] ?? [];
        for (const opt of chosen) {
          flattenedOptions.push({
            groupTitle: group.title,
            optionName: opt.name,
            price: opt.price,
          });
        }
      }
    }

    const selection: CartItemSelection = {
      cartItemId: `${customizingItem.id}-${Date.now()}`,
      merchantId: merchant.id,
      merchantName: merchant.name,
      menuItem: customizingItem,
      quantity,
      selectedOptions: flattenedOptions,
      notes: notes.trim(),
      unitTotal,
      lineTotal,
    };

    onAddToCart(selection);
    setCustomizingItem(null);
  };

  if (!merchant) return null;

  const filteredMenu =
    activeCategory === "all"
      ? merchant.menu
      : merchant.menu.filter((item) => item.category === activeCategory);

  return (
    <AnimatePresence>
      <motion.div
        key="store-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 48, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 48, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#090B0C] text-[#FFF4ED] shadow-2xl sm:rounded-3xl"
        >
          {/* Store Header Banner */}
          <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-52">
            <img
              src={merchant.coverImage}
              alt={merchant.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090B0C] via-[#090B0C]/45 to-black/30" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar loja"
              className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {merchant.isSuperMerchant && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-[#F6C945]/40 bg-black/70 px-3 py-1 text-xs font-semibold text-[#F6C945] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Super Restaurante
              </div>
            )}

            <div className="absolute right-5 bottom-3 left-5 flex items-end gap-3.5">
              <img
                src={merchant.logoImage}
                alt={merchant.name}
                className="h-16 w-16 shrink-0 rounded-2xl border-2 border-[#F6C945]/60 object-cover shadow-lg"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {merchant.name}
                </h2>
                <p className="truncate text-xs text-white/70">
                  {merchant.category} • {merchant.addressZone}
                </p>
              </div>
            </div>
          </div>

          {/* Telemetry Bar (Rating, Delivery Time, Fee) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#141719] px-5 py-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-bold text-[#F6C945]">
                <Star className="h-4 w-4 fill-[#F6C945] text-[#F6C945]" />
                {merchant.rating.toFixed(1)}
                <span className="font-normal text-white/50">
                  ({merchant.reviewsCount})
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-white/80">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                {merchant.deliveryTime}
              </span>
              <span className="flex items-center gap-1.5 text-white/80">
                <Bike className="h-3.5 w-3.5 text-[#F6C945]" />
                {merchant.deliveryFee === 0 ? (
                  <span className="font-semibold text-emerald-400">Entrega Grátis</span>
                ) : (
                  `R$ ${merchant.deliveryFee.toFixed(2).replace(".", ",")}`
                )}
              </span>
            </div>
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
              Pedido mín. R$ {merchant.minOrder}
            </span>
          </div>

          {/* Menu Category Pills */}
          <div className="flex gap-2 overflow-x-auto border-b border-white/5 bg-[#090B0C] px-5 py-3 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                activeCategory === "all"
                  ? "bg-[#EA1D2C] text-white shadow-sm"
                  : "bg-[#141719] text-white/70 hover:text-white"
              }`}
            >
              Cardápio Completo
            </button>
            {merchant.menuCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-[#EA1D2C] text-white shadow-sm"
                    : "bg-[#141719] text-white/70 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {filteredMenu.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => openItemCustomization(item)}
                className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#141719]/90 p-3.5 transition hover:border-[#F6C945]/40 hover:bg-[#191D20]"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {item.isPopular && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#EA1D2C]/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#FF5A65] uppercase">
                        <Flame className="h-3 w-3" /> Mais Pedido
                      </span>
                    )}
                    {item.serves && (
                      <span className="text-[11px] text-white/45">{item.serves}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#F6C945]">
                    {item.name}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-white/60">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-extrabold text-emerald-400">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-white/40 line-through">
                        R$ {item.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute right-1.5 bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#EA1D2C] text-white shadow-md">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nested Product Customization Bottom Sheet */}
          <AnimatePresence>
            {customizingItem && (
              <motion.div
                key="item-customizer"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="absolute inset-0 z-20 flex flex-col bg-[#090B0C]"
              >
                {/* Item Header Image */}
                <div className="relative h-48 w-full shrink-0 overflow-hidden">
                  <img
                    src={customizingItem.image}
                    alt={customizingItem.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090B0C] via-black/30 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setCustomizingItem(null)}
                    aria-label="Voltar ao cardápio"
                    className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-5 right-5">
                    <span className="rounded-md bg-[#F6C945]/20 px-2 py-0.5 text-[10px] font-bold text-[#F6C945] uppercase">
                      {customizingItem.category}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white">
                      {customizingItem.name}
                    </h3>
                  </div>
                </div>

                {/* Customization Scroll Body */}
                <div className="flex-1 space-y-5 overflow-y-auto p-5">
                  <p className="text-xs leading-relaxed text-white/70">
                    {customizingItem.description}
                  </p>

                  {customizingItem.optionGroups?.map((group) => {
                    const selectedForGroup = selectedMap[group.id] ?? [];
                    return (
                      <div
                        key={group.id}
                        className="rounded-2xl border border-white/10 bg-[#141719] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold tracking-wide text-white uppercase">
                              {group.title}
                            </h4>
                            <p className="text-[11px] text-white/50">
                              Escolha até {group.maxSelect}{" "}
                              {group.maxSelect === 1 ? "opção" : "opções"}
                            </p>
                          </div>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              group.required
                                ? "bg-[#EA1D2C]/20 text-[#FF5A65]"
                                : "bg-white/10 text-white/60"
                            }`}
                          >
                            {group.required ? "Obrigatório" : "Opcional"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {group.options.map((opt) => {
                            const isChecked = selectedForGroup.some(
                              (o) => o.id === opt.id
                            );
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleToggleOption(group, opt)}
                                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs transition ${
                                  isChecked
                                    ? "border-[#EA1D2C] bg-[#EA1D2C]/10 text-white"
                                    : "border-white/5 bg-[#090B0C]/60 text-white/80 hover:border-white/20"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                      isChecked
                                        ? "border-[#EA1D2C] bg-[#EA1D2C] text-white"
                                        : "border-white/30"
                                    }`}
                                  >
                                    {isChecked && <Check className="h-2.5 w-2.5" />}
                                  </div>
                                  <span className="font-medium">{opt.name}</span>
                                </div>
                                <span className="font-semibold text-[#F6C945]">
                                  {opt.price === 0
                                    ? "Grátis"
                                    : `+ R$ ${opt.price.toFixed(2).replace(".", ",")}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Kitchen Notes */}
                  <div className="rounded-2xl border border-white/10 bg-[#141719] p-4">
                    <label className="mb-2 flex items-center gap-2 text-xs font-bold text-white">
                      <MessageSquareText className="h-4 w-4 text-[#F6C945]" />
                      Alguma observação para a cozinha?
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Sem coentro, pimenta à parte, caprichar no gelo..."
                      className="w-full rounded-xl border border-white/10 bg-[#090B0C] p-3 text-xs text-white placeholder-white/35 focus:border-[#F6C945] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-[11px] text-emerald-300">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                    Embalagem térmica lacrada com código de segurança Caraíva Delivery.
                  </div>
                </div>

                {/* Sticky Add to Bag Footer */}
                <div className="flex items-center gap-3 border-t border-white/10 bg-[#141719] p-4">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Diminuir quantidade"
                      className="text-white/70 hover:text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-5 text-center text-sm font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Aumentar quantidade"
                      className="text-[#EA1D2C] hover:text-[#ff4754]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!isCustomizationValid}
                    onClick={handleConfirmItem}
                    className="flex flex-1 items-center justify-between rounded-xl bg-[#EA1D2C] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#EA1D2C]/25 transition hover:bg-[#d81927] disabled:opacity-40"
                  >
                    <span>Adicionar à Sacola</span>
                    <span>R$ {lineTotal.toFixed(2).replace(".", ",")}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
