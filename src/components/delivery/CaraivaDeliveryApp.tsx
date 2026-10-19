import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  House,
  Search,
  Bike,
  Ticket,
  UserRound,
  MapPin,
  Star,
  Clock,
  ShoppingBag,
  ChevronRight,
  ChevronDown,
  Flame,
  SlidersHorizontal,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { BubbleNavigation } from "../navigation/BubbleNavigation";
import type { BubbleNavItem } from "../navigation/navigation.types";
import type {
  DeliveryZone,
  DeliveryMerchant,
  CartItemSelection,
  ActiveDeliveryOrder,
  DeliveryOrderStatus,
} from "./delivery.types";
import {
  DELIVERY_CATEGORIES,
  DELIVERY_ZONES,
  DELIVERY_MERCHANTS,
  DELIVERY_COUPONS,
  INITIAL_DEMO_ACTIVE_ORDER,
} from "./delivery.data";
import { CaraivaDelivery3DHero } from "./CaraivaDelivery3DHero";
import { DeliveryStoreModal } from "./DeliveryStoreModal";
import { DeliveryCartDrawer } from "./DeliveryCartDrawer";
import { DeliveryLiveTracker } from "./DeliveryLiveTracker";

const TAB_ORDER = ["inicio", "busca", "pedidos", "cupons", "perfil"] as const;

export const CaraivaDeliveryApp: React.FC = () => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("caraiva_delivery_theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "dark";
  });

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("caraiva_delivery_theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const [activeTab, setActiveTab] = useState<string>("inicio");
  const [tabDirection, setTabDirection] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState<boolean>(false);
  const [onlySuperMerchants, setOnlySuperMerchants] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);

  const [selectedMerchant, setSelectedMerchant] = useState<DeliveryMerchant | null>(
    null
  );
  const [cart, setCart] = useState<CartItemSelection[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<ActiveDeliveryOrder>(
    INITIAL_DEMO_ACTIVE_ORDER
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSwitchTab = (nextTabId: string) => {
    if (nextTabId === activeTab) return;
    const prevIdx = TAB_ORDER.indexOf(activeTab as (typeof TAB_ORDER)[number]);
    const nextIdx = TAB_ORDER.indexOf(nextTabId as (typeof TAB_ORDER)[number]);
    setTabDirection(nextIdx >= prevIdx ? 1 : -1);
    setActiveTab(nextTabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const deliveryNavItems: BubbleNavItem[] = useMemo(
    () => [
      {
        id: "inicio",
        label: "Início",
        icon: House,
        color: "#EA1D2C",
        accentGlow: "rgba(234, 29, 44, 0.48)",
      },
      {
        id: "busca",
        label: "Buscar",
        icon: Search,
        color: "#F6C945",
        accentGlow: "rgba(246, 201, 69, 0.45)",
      },
      {
        id: "pedidos",
        label: "Pedidos",
        icon: Bike,
        color: "#22C55E",
        accentGlow: "rgba(34, 197, 94, 0.45)",
        badge: activeOrder.status !== "DELIVERED" ? "LIVE" : undefined,
      },
      {
        id: "cupons",
        label: "Cupons",
        icon: Ticket,
        color: "#A855F7",
        accentGlow: "rgba(168, 85, 247, 0.45)",
        badge: DELIVERY_COUPONS.length,
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: UserRound,
        color: "#38BDF8",
        accentGlow: "rgba(56, 189, 248, 0.45)",
      },
    ],
    [activeOrder.status]
  );

  const activeNavItem = useMemo(
    () => deliveryNavItems.find((i) => i.id === activeTab) ?? deliveryNavItems[0],
    [deliveryNavItems, activeTab]
  );

  const filteredMerchants = useMemo(() => {
    return DELIVERY_MERCHANTS.filter((m) => {
      if (selectedCategory !== "todos" && m.categoryId !== selectedCategory) {
        return false;
      }
      if (onlyFreeDelivery && m.deliveryFee > 0) {
        return false;
      }
      if (onlySuperMerchants && !m.isSuperMerchant) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchMerchant =
          m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
        const matchDish = m.menu.some(
          (dish) =>
            dish.name.toLowerCase().includes(q) ||
            dish.description.toLowerCase().includes(q)
        );
        return matchMerchant || matchDish;
      }
      return true;
    });
  }, [selectedCategory, onlyFreeDelivery, onlySuperMerchants, searchQuery]);

  const popularDishesShowcase = useMemo(() => {
    const list: { merchant: DeliveryMerchant; item: DeliveryMerchant["menu"][0] }[] = [];
    for (const merchant of DELIVERY_MERCHANTS) {
      for (const item of merchant.menu) {
        if (item.isPopular) {
          list.push({ merchant, item });
        }
      }
    }
    return list;
  }, []);

  const handleAddToCart = (item: CartItemSelection) => {
    setCart((prev) => [...prev, item]);
    triggerToast(`Adicionado: ${item.quantity}x ${item.menuItem.name}`);
  };

  const handleQuickAddPopular = (
    merchant: DeliveryMerchant,
    dish: DeliveryMerchant["menu"][0]
  ) => {
    const defaultOptions: CartItemSelection["selectedOptions"] = [];
    let extraOptionsCost = 0;
    if (dish.optionGroups) {
      for (const g of dish.optionGroups) {
        if (g.required && g.options[0]) {
          defaultOptions.push({
            groupTitle: g.title,
            optionName: g.options[0].name,
            price: g.options[0].price,
          });
          extraOptionsCost += g.options[0].price;
        }
      }
    }
    const unitTotal = dish.price + extraOptionsCost;
    const selection: CartItemSelection = {
      cartItemId: `${dish.id}-${Date.now()}`,
      merchantId: merchant.id,
      merchantName: merchant.name,
      menuItem: dish,
      quantity: 1,
      selectedOptions: defaultOptions,
      notes: "",
      unitTotal,
      lineTotal: unitTotal,
    };
    setCart((prev) => [...prev, selection]);
    triggerToast(`1x ${dish.name} na sacola!`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId !== cartItemId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          return {
            ...item,
            quantity: nextQty,
            lineTotal: item.unitTotal * nextQty,
          };
        })
        .filter((x): x is CartItemSelection => x !== null)
    );
  };

  const handleOrderCreated = (newOrder: ActiveDeliveryOrder) => {
    setActiveOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    setSelectedMerchant(null);
    handleSwitchTab("pedidos");
    triggerToast(`Pedido #${newOrder.orderId} enviado para a cozinha!`);
  };

  const handleUpdateOrderStatus = (
    nextStatus: DeliveryOrderStatus,
    nextProgress: number
  ) => {
    setActiveOrder((prev) => ({
      ...prev,
      status: nextStatus,
      courier: {
        ...prev.courier,
        progressPct: nextProgress,
      },
    }));
  };

  const cartItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.lineTotal, 0),
    [cart]
  );

  return (
    <div
      className={`relative min-h-dvh overflow-x-hidden ${
        cartItemsCount > 0 ? "pb-60" : "pb-44"
      } transition-colors duration-300 ${
        themeMode === "light"
          ? "bg-[#F8FAFC] text-[#0F172A]"
          : "bg-[#090B0C] text-[#FFF4ED]"
      } selection:bg-[#EA1D2C] selection:text-white`}
    >
      {/* Subtle Ambient Top Glow synced with Active Tab */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 z-0 h-64 w-[680px] -translate-x-1/2 rounded-full opacity-15 blur-[110px] transition-colors duration-700"
        style={{ backgroundColor: activeNavItem.color }}
      />

      {/* Apple Dynamic Island / Single-Row Glass Bar */}
      <header
        className={`sticky top-0 z-30 w-full border-b backdrop-blur-2xl transition-colors duration-300 ${
          themeMode === "light"
            ? "border-slate-200/80 bg-white/90 text-slate-900 shadow-sm"
            : "border-white/[0.06] bg-[#090B0C]/85 shadow-lg shadow-black/40"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:px-4">
          {/* Left: Voltar + Pill Compacto de Localização com Chevron */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/guia"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition active:scale-95 ${
                themeMode === "light"
                  ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                  : "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              }`}
              title="Voltar ao Super-App Caraíva"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            {/* Location Dropdown Pill integrado */}
            <div
              className={`relative flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 transition ${
                themeMode === "light"
                  ? "border-slate-200 bg-white shadow-sm"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#EA1D2C]" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#EA1D2C] leading-none">
                  Entregar em
                </span>
                <select
                  aria-label="Zona de entrega em Caraíva"
                  value={selectedZone.id}
                  onChange={(e) => {
                    const z = DELIVERY_ZONES.find((item) => item.id === e.target.value);
                    if (z) setSelectedZone(z);
                  }}
                  className={`cursor-pointer appearance-none bg-transparent pr-4 text-xs font-bold focus:outline-none truncate ${
                    themeMode === "light" ? "text-slate-900" : "text-white"
                  }`}
                >
                  {DELIVERY_ZONES.map((zone) => (
                    <option
                      key={zone.id}
                      value={zone.id}
                      className={themeMode === "light" ? "bg-white text-slate-900" : "bg-[#141719] text-white"}
                    >
                      {zone.name} • {zone.estimatedMinutes}
                    </option>
                  ))}
                </select>
              </div>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
            </div>
          </div>

          {/* Center Desktop Pill Switcher (Sincronizado ao BubbleNavigation) */}
          <nav
            className={`hidden items-center gap-1 rounded-full border p-1 md:flex transition ${
              themeMode === "light"
                ? "border-slate-200 bg-slate-100 shadow-inner"
                : "border-white/10 bg-[#141719]/90 shadow-md"
            }`}
          >
            {deliveryNavItems.map((nav) => {
              const Icon = nav.icon;
              const isCurrent = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => handleSwitchTab(nav.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                    isCurrent
                      ? themeMode === "light"
                        ? "bg-white text-slate-900 shadow"
                        : "bg-white text-black shadow-sm"
                      : themeMode === "light"
                      ? "text-slate-500 hover:text-slate-900"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: isCurrent && themeMode !== "light" ? undefined : nav.color }} />
                  <span>{nav.label}</span>
                  {nav.badge && (
                    <span className="rounded-full bg-[#EA1D2C] px-1.5 py-0.2 text-[9px] font-black text-white">
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Active Order Pill + Theme Switcher + Cart Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {activeOrder.status !== "DELIVERED" && (
              <button
                type="button"
                onClick={() => handleSwitchTab("pedidos")}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2 sm:px-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20 active:scale-95"
                title="Rastrear pedido ativo"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px]">#{activeOrder.orderId}</span>
              </button>
            )}

            {/* Alternador de Tema: Clean Light / Dark Luxury */}
            <button
              type="button"
              onClick={toggleTheme}
              title={
                themeMode === "dark"
                  ? "Alternar para modo Clean Light"
                  : "Alternar para modo Dark Luxury"
              }
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${
                themeMode === "light"
                  ? "border-slate-200 bg-white text-amber-500 shadow-sm hover:bg-slate-50"
                  : "border-white/10 bg-white/[0.04] text-yellow-400 hover:border-white/20 hover:bg-white/[0.08]"
              }`}
            >
              {themeMode === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Sacola Dinâmica */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex h-9 items-center gap-2 rounded-xl bg-[#EA1D2C] px-3 sm:px-3.5 text-xs font-extrabold text-white shadow-md shadow-[#EA1D2C]/25 transition hover:bg-[#d81927] active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">
                {cartItemsCount > 0
                  ? `R$ ${cartSubtotal.toFixed(2).replace(".", ",")}`
                  : "Sacola"}
              </span>
              {cartItemsCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#EA1D2C]">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container with Spatial Tab Transitions */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              x: tabDirection * 28,
              scale: 0.985,
              filter: "blur(6px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              x: tabDirection * -28,
              scale: 0.985,
              filter: "blur(4px)",
            }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 30,
              mass: 0.8,
            }}
          >
            {/* TAB 1: INÍCIO (MARKETPLACE IFOOD CLEAN + THREE.JS 3D HERO) */}
            {activeTab === "inicio" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Search & Quick Filter Bar (Apple Spotlight Style) */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#EA1D2C]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar prato, moqueca, pastel do Pará, açaí ou restaurante..."
                      className={`w-full rounded-2xl border py-3 pr-10 pl-10 text-xs font-medium placeholder-white/40 shadow-inner transition focus:outline-none sm:text-sm ${
                        themeMode === "light"
                          ? "border-slate-200 bg-white text-slate-900 focus:border-[#EA1D2C]"
                          : "border-white/10 bg-white/[0.04] text-white focus:border-[#F6C945]"
                      }`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setOnlyFreeDelivery((v) => !v)}
                      className={`shrink-0 rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                        onlyFreeDelivery
                          ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-400 shadow-md shadow-emerald-500/10"
                          : themeMode === "light"
                          ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span>🛵</span>
                      <span>Entrega Grátis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnlySuperMerchants((v) => !v)}
                      className={`shrink-0 rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                        onlySuperMerchants
                          ? "border-[#F6C945] bg-[#F6C945]/20 text-[#F6C945] shadow-md shadow-[#F6C945]/10"
                          : themeMode === "light"
                          ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Star className="h-3.5 w-3.5 fill-[#F6C945] text-[#F6C945]" />
                      <span>Super Restaurantes</span>
                    </button>
                  </div>
                </div>

                {/* Tactile Glass Chips Categories (Zero Clutter / Apple Fluid Scroll) */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <h2 className={`text-xs font-extrabold uppercase tracking-wider ${themeMode === "light" ? "text-slate-600" : "text-white/70"}`}>
                        Categorias da Vila
                      </h2>
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold text-[#F6C945]">
                        Palco 3D Sincronizado
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 hidden sm:inline">
                      Modal: {selectedZone.courierModal}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                    {DELIVERY_CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`group relative flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-all duration-200 active:scale-95 ${
                            isActive
                              ? "border border-[#EA1D2C] bg-gradient-to-r from-[#EA1D2C] to-[#d81927] text-white shadow-lg shadow-[#EA1D2C]/25"
                              : themeMode === "light"
                              ? "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 shadow-sm"
                              : "border border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          <span className="text-sm transition-transform duration-200 group-hover:scale-125">
                            {cat.emoji}
                          </span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Three.js 3D Interactive Hero Stage */}
                <CaraivaDelivery3DHero
                  activeCategory={selectedCategory}
                  activeTabColor={activeNavItem.color}
                  selectedZoneName={selectedZone.name}
                  selectedZoneEta={selectedZone.estimatedMinutes}
                  onOrderFeatured={() => {
                    const targetMerchant =
                      filteredMerchants[0] ?? DELIVERY_MERCHANTS[0];
                    setSelectedMerchant(targetMerchant);
                  }}
                  onOpenTracker={() => handleSwitchTab("pedidos")}
                />

                {/* 1-Click Popular Dishes Shelf (Apple/Google Spatial Cards) */}
                <div>
                  <div className="mb-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EA1D2C]/20 text-[#EA1D2C]">
                        <Flame className="h-3.5 w-3.5" />
                      </div>
                      <h2 className="text-sm font-extrabold text-white sm:text-base">
                        Peça em 1 Toque — Campeões de Pedidos Hoje
                      </h2>
                    </div>
                    <span className="text-[11px] font-semibold text-[#F6C945]">
                      Embalagem térmica lacrada
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {popularDishesShowcase.slice(0, 6).map(({ merchant, item }) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -3 }}
                        className="flex flex-col justify-between rounded-[24px] border border-white/10 border-t-white/20 bg-gradient-to-b from-[#171B1E] to-[#111417] p-4 shadow-xl transition hover:border-[#F6C945]/45"
                      >
                        <div
                          onClick={() => setSelectedMerchant(merchant)}
                          className="flex cursor-pointer gap-3.5"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 object-cover shadow-md"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-[10px] font-bold tracking-wide text-[#F6C945] uppercase">
                              {merchant.name}
                            </span>
                            <h3 className="mt-0.5 line-clamp-2 text-xs font-extrabold text-white">
                              {item.name}
                            </h3>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm font-black text-emerald-400">
                                R$ {item.price.toFixed(2).replace(".", ",")}
                              </span>
                              {item.prepTime && (
                                <span className="text-[10px] text-white/45">
                                  • {item.prepTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.07] pt-3">
                          <button
                            type="button"
                            onClick={() => setSelectedMerchant(merchant)}
                            className="text-[11px] font-semibold text-white/60 transition hover:text-white"
                          >
                            Personalizar prato
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAddPopular(merchant, item)}
                            className="flex items-center gap-1 rounded-xl bg-[#EA1D2C] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-md shadow-[#EA1D2C]/25 transition hover:bg-[#d81927] active:scale-95"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Adicionar
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Restaurants / Merchants Listing */}
                <div>
                  <div className="mb-3.5 flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-white">
                      Lojas e Restaurantes em Caraíva ({filteredMerchants.length})
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredMerchants.map((merchant) => (
                      <motion.div
                        key={merchant.id}
                        whileHover={{ y: -3 }}
                        onClick={() => setSelectedMerchant(merchant)}
                        className="group cursor-pointer overflow-hidden rounded-[26px] border border-white/10 border-t-white/20 bg-[#141719] shadow-xl transition hover:border-[#EA1D2C]/50"
                      >
                        <div className="relative h-40 w-full overflow-hidden">
                          <img
                            src={merchant.coverImage}
                            alt={merchant.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141719] via-transparent to-black/30" />

                          {merchant.promoTag && (
                            <span className="absolute top-3 left-3 rounded-full bg-[#EA1D2C] px-3 py-1 text-[10px] font-extrabold text-white shadow-lg">
                              {merchant.promoTag}
                            </span>
                          )}

                          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 text-xs font-bold text-[#F6C945] backdrop-blur-md">
                            <Star className="h-3.5 w-3.5 fill-[#F6C945]" />
                            {merchant.rating.toFixed(1)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 p-4">
                          <div className="flex min-w-0 items-center gap-3.5">
                            <img
                              src={merchant.logoImage}
                              alt={merchant.name}
                              className="h-12 w-12 shrink-0 rounded-2xl border border-white/15 object-cover"
                            />
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-extrabold text-white group-hover:text-[#F6C945]">
                                {merchant.name}
                              </h3>
                              <p className="truncate text-xs text-white/55">
                                {merchant.category} • {merchant.addressZone}
                              </p>
                              <div className="mt-1 flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1 text-white/80">
                                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                                  {merchant.deliveryTime}
                                </span>
                                <span className="font-bold text-emerald-400">
                                  {merchant.deliveryFee === 0
                                    ? "Entrega Grátis"
                                    : `Entrega R$ ${merchant.deliveryFee.toFixed(2).replace(".", ",")}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition group-hover:bg-[#EA1D2C] group-hover:text-white">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BUSCA E EXPLORAÇÃO */}
            {activeTab === "busca" && (
              <div className="space-y-5">
                <div className="rounded-[28px] border border-white/12 bg-gradient-to-br from-[#141719] to-[#0D1013] p-6 shadow-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6C945]/15 px-3 py-1 text-[10px] font-bold text-[#F6C945] uppercase">
                    <Sparkles className="h-3.5 w-3.5" />
                    Spotlight Search • Caraíva
                  </span>
                  <h2 className="mt-2 text-xl font-black text-white">
                    Busca Inteligente de Pratos & Restaurantes
                  </h2>
                  <p className="mt-0.5 text-xs text-white/60">
                    Pesquise por ingrediente, prato típico, bebida trincando ou restaurante da vila.
                  </p>

                  <div className="relative mt-4">
                    <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#F6C945]" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ex: camarão, arraia, pizza burrata, açaí, corona..."
                      className="w-full rounded-2xl border border-white/15 bg-[#090B0C] py-3.5 pr-4 pl-11 text-sm text-white placeholder-white/40 focus:border-[#F6C945] focus:outline-none"
                    />
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {[
                      "Moqueca",
                      "Pastel de Arraia",
                      "Pizza",
                      "Açaí",
                      "Vegano",
                      "Corona",
                    ].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchQuery(term)}
                        className="rounded-full border border-white/10 bg-[#090B0C] px-3.5 py-1.5 text-xs font-semibold text-white/75 transition hover:border-[#F6C945] hover:text-[#F6C945]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {filteredMerchants.map((merchant) => (
                    <motion.div
                      key={merchant.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedMerchant(merchant)}
                      className="flex cursor-pointer items-center justify-between rounded-[24px] border border-white/10 bg-[#141719] p-4 transition hover:border-[#F6C945]/50"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={merchant.logoImage}
                          alt={merchant.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            {merchant.name}
                          </h3>
                          <p className="text-xs text-white/55">
                            {merchant.category} • {merchant.deliveryTime}
                          </p>
                          <span className="mt-1 inline-block text-xs font-bold text-emerald-400">
                            {merchant.menu.length} itens no cardápio
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: RASTREIO DE PEDIDOS AO VIVO (IFOOD TRACK 3D) */}
            {activeTab === "pedidos" && (
              <DeliveryLiveTracker
                order={activeOrder}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            )}

            {/* TAB 4: CLUBE & CUPONS */}
            {activeTab === "cupons" && (
              <div className="space-y-4">
                <div className="rounded-[28px] border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-[#141719] to-[#141719] p-6 shadow-xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                    <Ticket className="h-3.5 w-3.5" />
                    Clube iFood Caraíva VIP
                  </span>
                  <h2 className="mt-2 text-xl font-extrabold text-white">
                    Seus Cupons Ativos na Vila
                  </h2>
                  <p className="mt-1 text-xs text-white/65">
                    Todos os cupons abaixo já estão sincronizados com sua Sacola Pix 1-Click.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {DELIVERY_COUPONS.map((coupon) => (
                    <motion.div
                      key={coupon.code}
                      whileHover={{ y: -3 }}
                      className="flex flex-col justify-between rounded-[26px] border border-white/10 border-t-white/20 bg-[#141719] p-5 shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-lg bg-[#F6C945]/15 px-2.5 py-1 font-mono text-xs font-black text-[#F6C945]">
                            {coupon.code}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-400">
                            {coupon.expiresIn}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-extrabold text-white">
                          {coupon.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/60">
                          {coupon.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handleSwitchTab("inicio");
                          triggerToast(
                            `Cupom ${coupon.code} pronto para uso na sacola!`
                          );
                        }}
                        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#EA1D2C] py-2.5 text-xs font-bold text-white transition hover:bg-[#d81927]"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Usar Cupom Agora
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PERFIL E ECOSSISTEMA */}
            {activeTab === "perfil" && (
              <div className="space-y-4">
                <div className="rounded-[28px] border border-white/10 bg-[#141719] p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EA1D2C]/20 text-xl font-black text-[#EA1D2C]">
                      VIP
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-white">
                        Hóspede Verificado Caraíva
                      </h2>
                      <p className="text-xs text-white/60">
                        Zona Padrão: {selectedZone.name} • PIN de Entrega Ativo ({activeOrder.confirmationPin})
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Link
                      to="/demonstracao/business"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#090B0C] p-4 transition hover:border-[#F6C945]"
                    >
                      <div>
                        <span className="text-xs font-bold text-[#F6C945]">
                          Visão do Restaurante (KDS)
                        </span>
                        <p className="text-xs text-white/60">
                          Acessar Cockpit do Parceiro e Despacho de Entregadores
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40" />
                    </Link>

                    <Link
                      to="/navegacao"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#090B0C] p-4 transition hover:border-emerald-400"
                    >
                      <div>
                        <span className="text-xs font-bold text-emerald-400">
                          Laboratório Sliding Bubble
                        </span>
                        <p className="text-xs text-white/60">
                          Inspecionar física de mola e Pointer Events da barra
                        </p>
                      </div>
                      <SlidersHorizontal className="h-5 w-5 text-white/40" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141719] p-4 text-xs text-white/70">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                  Operação conectada ao Supabase Realtime, TapTable NFC e Frota Nativa de Caraíva.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating iFood Red Bag Bar (when cart has items) */}
      <AnimatePresence>
        {cartItemsCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed right-4 bottom-24 left-4 z-30 mx-auto max-w-md"
          >
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-[#EA1D2C] px-5 py-3.5 text-white shadow-2xl shadow-[#EA1D2C]/40 transition hover:bg-[#d81927]"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-xs font-black">
                  {cartItemsCount}
                </span>
                <span className="text-xs font-bold">Ver Sacola Caraíva</span>
              </div>
              <span className="text-sm font-black">
                R$ {cartSubtotal.toFixed(2).replace(".", ",")}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 left-4 z-50 mx-auto flex max-w-sm items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-[#141719]/95 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Bubble Navigation Docked at Bottom (Mobile First com Safe-Area) */}
      <div className="fixed right-0 bottom-0 left-0 z-40 flex justify-center pb-[max(12px,env(safe-area-inset-bottom))] px-3 pointer-events-none md:hidden">
        <div className="pointer-events-auto w-full max-w-md">
          <BubbleNavigation
            items={deliveryNavItems}
            activeId={activeTab}
            onChange={(id) => handleSwitchTab(id)}
            theme={themeMode}
            enableDrag={true}
            showLabels={true}
            showTitleHeader={false}
          />
        </div>
      </div>

      {/* Store Menu & Customization Modal */}
      <DeliveryStoreModal
        merchant={selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & Pix 1-Click Checkout Drawer */}
      <DeliveryCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCart([])}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
};

export default CaraivaDeliveryApp;
