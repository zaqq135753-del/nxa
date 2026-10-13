"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Check, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  X 
} from "lucide-react";
import { Back } from "@/components/Back";
import { UnifiedCheckoutModal } from "@/components/UnifiedCheckoutModal";
import { useTagContext } from "@/components/useTagContext";
import { triggerConfetti } from "@/components/ui/Confetti";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { 
  brl, 
  byId, 
  establishments, 
  REGISTERED_POUSADAS, 
  ZONES, 
  type Product, 
  type StoreCategory 
} from "@/lib/data";
import { computeSplit } from "@/lib/pricing";
import { useStore } from "@/lib/store";

const CATEGORIES: { id: StoreCategory | "todos"; label: string; icon: string }[] = [
  { id: "todos", label: "Todos", icon: "✨" },
  { id: "bebidas", label: "Bebidas & Gelo", icon: "🧊" },
  { id: "restaurante", label: "Restaurantes", icon: "🍔" },
  { id: "farmacia", label: "Farmácia & Saúde", icon: "💊" },
  { id: "mercado", label: "Mercadinhos", icon: "🛒" },
];

function DeliveryFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const tag = useTagContext(null);
  const { products, addOrder } = useStore();

  const allDeliveryStores = establishments.filter((e) => e.niche === "delivery");
  const storeParam = params.get("loja") || params.get("store") || params.get("id");
  const initialStore = storeParam && allDeliveryStores.some((s) => s.id === storeParam) 
    ? storeParam 
    : allDeliveryStores[0].id;

  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | "todos">("todos");
  const [activeStoreId, setActiveStoreId] = useState<string>(initialStore);

  // Se vier com ?loja= na URL, fixa direto a loja do estabelecimento
  useEffect(() => {
    if (storeParam && allDeliveryStores.some((s) => s.id === storeParam)) {
      setActiveStoreId(storeParam);
      const matched = allDeliveryStores.find((s) => s.id === storeParam);
      if (matched) setSelectedCategory(matched.category);
    }
  }, [storeParam, allDeliveryStores]);
  
  // Lojas filtradas pela categoria
  const filteredStores = useMemo(() => {
    if (selectedCategory === "todos") return allDeliveryStores;
    return allDeliveryStores.filter((s) => s.category === selectedCategory);
  }, [allDeliveryStores, selectedCategory]);

  // Se trocar de categoria e a loja ativa não estiver nela, muda para a primeira loja válida
  useEffect(() => {
    if (filteredStores.length > 0 && !filteredStores.some((s) => s.id === activeStoreId)) {
      setActiveStoreId(filteredStores[0].id);
    }
  }, [filteredStores, activeStoreId]);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [zone, setZone] = useState<string>(ZONES[0].id);
  
  // Endereço inteligente: Pousada selecionada + complemento de quarto
  const [pousadaName, setPousadaName] = useState<string>(REGISTERED_POUSADAS[0]);
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [customAddress, setCustomAddress] = useState<string>("");
  const [isCustomAddress, setIsCustomAddress] = useState<boolean>(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  // Preenchimento automático pelo chip NFC
  useEffect(() => {
    if (tag) {
      setCustomAddress(tag.deliveryAddress);
      setIsCustomAddress(true);
    }
  }, [tag]);

  // Se vier com item da busca ou IA
  useEffect(() => {
    const add = params.get("add");
    const p = add && byId(products, add);
    if (p) {
      setActiveStoreId(p.establishmentId);
      setCart({ [p.id]: 1 });
    }
  }, [params]);

  const activeStore = byId(establishments, activeStoreId) || allDeliveryStores[0];
  const menu = products.filter((p) => p.establishmentId === activeStoreId);
  const menuCategories = [...new Set(menu.map((p) => p.category))];

  // Cálculos do carrinho
  const cartLines = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ p: byId(products, id)!, qty }));

  const subtotal = cartLines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const totalItemCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const deliveryFee = ZONES.find((z) => z.id === zone)!.fee;
  const split = useMemo(() => computeSplit(subtotal, activeStore.plan, deliveryFee), [subtotal, activeStore.plan, deliveryFee]);

  const bump = (id: string, delta: number) => {
    setCart((prev) => {
      const nextQty = Math.max(0, (prev[id] ?? 0) + delta);
      if (nextQty === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: nextQty };
    });
  };

  const finalDeliveryAddress = isCustomAddress 
    ? customAddress 
    : `${pousadaName}${roomNumber ? ` · Quarto/Bangalô ${roomNumber}` : ""}`;

  return (
    <main className="mx-auto max-w-lg px-4 pb-44 pt-5">
      <Back title="Na Areia Delivery" sub="O delivery oficial de Caraíva: pede no quarto, chega na areia." />

      {/* Pílulas de Categoria no Topo (UI/UX Pro Max) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x overscroll-x-contain">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition min-h-[44px] touch-manipulation ${
                isSelected 
                  ? "bg-coral-400 text-noite-900 shadow-md scale-[1.02]" 
                  : "bg-white/[0.04] text-areia-200 border border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Carrossel de Lojas do Nicho */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x overscroll-x-contain">
        {filteredStores.map((store) => {
          const isActive = store.id === activeStoreId;
          return (
            <button
              key={store.id}
              onClick={() => {
                setActiveStoreId(store.id);
                // Limpa carrinho se mudar de loja para evitar mistura de pedidos
                if (Object.keys(cart).length > 0 && !cartLines.some(l => l.p.establishmentId === store.id)) {
                  setCart({});
                }
              }}
              className={`relative overflow-hidden rounded-2xl border text-left shrink-0 w-64 transition duration-200 ${
                isActive 
                  ? "border-coral-400 ring-1 ring-coral-400/50 bg-white/[0.06] shadow-glow" 
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              {/* Foto de Capa da Loja */}
              <div className="h-24 w-full overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={store.image} 
                  alt={store.name} 
                  className="h-full w-full object-cover transition duration-500 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noite-900 via-transparent to-transparent" />
                <span className="absolute top-2 right-2 rounded-full bg-mata-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-areia-50 shadow">
                  Aberto agora
                </span>
              </div>

              {/* Informações da Loja */}
              <div className="p-3">
                <p className="font-display text-base font-bold text-areia-50 truncate">{store.name}</p>
                <p className="text-[11px] text-areia-300 truncate mt-0.5">{store.tagline}</p>
                
                <div className="mt-2 flex items-center justify-between text-[11px] text-areia-200">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-coral-400 text-coral-400" />
                    <strong>{store.rating}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-areia-300">
                    <Clock size={11} /> {store.deliveryTime}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Banner da Loja Ativa */}
      <div className="mt-5 card p-4 flex items-center justify-between bg-gradient-to-r from-coral-500/10 via-noite-800 to-noite-900 border-coral-400/20">
        <div>
          <span className="chip text-[10px] uppercase tracking-wider text-coral-400 border-coral-400/30">
            Cardápio Selecionado
          </span>
          <h2 className="mt-1 font-display text-xl text-areia-50">{activeStore.name}</h2>
          <p className="text-xs text-areia-300">{activeStore.tagline} · Entrega direta na pousada</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-mata-400 block">⚡ Entrega Rápida</span>
          <span className="text-[11px] text-areia-300">Frete por setor</span>
        </div>
      </div>

      {/* Lista de Produtos por Categoria Interna com Fotos Reais (UI/UX Pro Max) */}
      <div className="mt-6 space-y-6">
        {menuCategories.map((catName) => (
          <section key={catName}>
            <h3 className="label font-bold text-areia-100 mb-3">{catName}</h3>
            <div className="space-y-3">
              {menu.filter((p) => p.category === catName).map((product) => {
                const qty = cart[product.id] || 0;
                return (
                  <div 
                    key={product.id}
                    className="card p-3 flex gap-3 items-center hover:border-white/20 transition group"
                  >
                    {/* Foto Real do Produto */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                      />
                      <span className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1 text-[10px] backdrop-blur-sm">
                        {product.emoji}
                      </span>
                    </div>

                    {/* Descrição e Preço */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-areia-100 leading-snug">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-areia-300/80 line-clamp-2 mt-0.5 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      <p className="mt-1.5 font-display text-base font-bold text-coral-400">
                        {brl(product.price)}
                      </p>
                    </div>

                    {/* Controle Tátil de Quantidade (UI/UX Pro Max: 44px min-height) */}
                    <div className="shrink-0 flex items-center">
                      {qty > 0 ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-white/10 p-1 border border-white/10">
                          <button 
                            onClick={() => bump(product.id, -1)}
                            className="h-11 w-11 min-h-[44px] min-w-[44px] grid place-items-center rounded-full bg-white/10 text-areia-50 hover:bg-white/20 active:scale-95 transition"
                            aria-label={`Diminuir ${product.name}`}
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-areia-50">{qty}</span>
                          <button 
                            onClick={() => bump(product.id, 1)}
                            className="h-11 w-11 min-h-[44px] min-w-[44px] grid place-items-center rounded-full bg-coral-400 text-noite-900 font-bold hover:bg-coral-500 active:scale-95 transition"
                            aria-label={`Aumentar ${product.name}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => bump(product.id, 1)}
                          className="btn-primary min-h-[44px] px-4 text-xs font-bold rounded-xl shadow-md"
                        >
                          <Plus size={14} /> Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Barra de Pedido Flutuante (Dynamic Island do 21st.dev) */}
      {subtotal > 0 && !isCheckoutOpen && (
        <div className="fixed inset-x-0 bottom-4 z-50 px-4 animate-rise">
          <div className="mx-auto max-w-md rounded-2xl bg-noite-800/95 border border-coral-400/40 p-3.5 shadow-2xl backdrop-blur-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral-400 text-noite-900 font-bold shadow-md">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-xs text-areia-300">
                  <strong className="text-areia-50 font-bold">{totalItemCount}</strong> {totalItemCount === 1 ? "item" : "itens"} em {activeStore.name}
                </p>
                <p className="font-display text-lg font-bold text-coral-400">
                  {brl(subtotal)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="btn-primary min-h-[44px] px-5 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
            >
              Ver Sacola <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal / Bottom Sheet de Checkout e Confirmação de Entrega */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md p-3 sm:items-center">
          <div className="card w-full max-w-md animate-rise bg-noite-800 p-6 border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-xl text-areia-50">Sua Sacola</h3>
                <p className="text-xs text-areia-300">{activeStore.name}</p>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-full bg-white/5 text-areia-300 hover:text-areia-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Itens do Pedido */}
            <div className="mt-4 divide-y divide-white/5 max-h-40 overflow-y-auto pr-1">
              {cartLines.map((line) => (
                <div key={line.p.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-areia-100">{line.qty}x {line.p.name}</span>
                    <span className="text-areia-300 block">{brl(line.p.price)} cada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-areia-50">{brl(line.p.price * line.qty)}</span>
                    <button 
                      onClick={() => bump(line.p.id, -1)} 
                      className="text-red-400 text-xs px-1 hover:underline"
                    >
                      remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Endereço Inteligente de Entrega em Caraíva */}
            <div className="mt-5 border-t border-white/10 pt-4 space-y-3">
              <label className="label block font-bold text-areia-100 flex items-center justify-between">
                <span>Onde Entregar na Vila?</span>
                <button 
                  onClick={() => setIsCustomAddress(!isCustomAddress)} 
                  className="text-[10px] text-coral-400 underline font-normal"
                >
                  {isCustomAddress ? "Escolher da lista de pousadas" : "Digitar endereço manual"}
                </button>
              </label>

              {isCustomAddress ? (
                <input 
                  className="input text-xs" 
                  placeholder="Ex: Casa de temporada perto da igrejinha..." 
                  value={customAddress} 
                  onChange={(e) => setCustomAddress(e.target.value)} 
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select 
                      className="input text-xs cursor-pointer"
                      value={pousadaName}
                      onChange={(e) => setPousadaName(e.target.value)}
                    >
                      {REGISTERED_POUSADAS.map((p) => (
                        <option key={p} value={p} className="bg-noite-900">{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input 
                      className="input text-xs" 
                      placeholder="Quarto/Bangalô" 
                      value={roomNumber} 
                      onChange={(e) => setRoomNumber(e.target.value)} 
                    />
                  </div>
                </div>
              )}

              {/* Setor de Entrega da Vila e Taxa */}
              <div>
                <label className="text-[11px] text-areia-300 block mb-1">Setor da Vila (para cálculo do frete na areia):</label>
                <select 
                  className="input text-xs cursor-pointer"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                >
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id} className="bg-noite-900">
                      {z.name} · taxa {brl(z.fee)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total e Split Transparente */}
            <div className="mt-5 border-t border-white/10 pt-3 space-y-1.5 text-xs text-areia-300">
              <div className="flex justify-between">
                <span>Subtotal dos produtos:</span>
                <span className="font-medium text-areia-100">{brl(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete ilustrativo (repasse não realizado):</span>
                <span className="font-medium text-areia-100">{brl(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-areia-50">
                <span>Total no Pix:</span>
                <span className="font-display text-lg text-coral-400">{brl(split.gross)}</span>
              </div>
            </div>

            <ShimmerButton
              onClick={() => setPaying(true)}
              shimmerColor="#F08A5D"
              className="w-full min-h-[50px] mt-5 text-sm font-bold shadow-xl shadow-coral-500/20"
            >
              Continuar com demonstração · {brl(split.gross)}
            </ShimmerButton>
          </div>
        </div>
      )}

      {/* Modal Checkout Integrado Mockup */}
      {paying && (
        <UnifiedCheckoutModal
          title={`Pedido em ${activeStore.name}`}
          subtitle={`Entrega: ${finalDeliveryAddress}`}
          split={split}
          onClose={() => {
            setPaying(false);
            setIsCheckoutOpen(false);
            router.push("/turista/carteira");
          }}
          onDemoCompleted={() => {
            triggerConfetti();
            addOrder({
              establishmentId: activeStoreId,
              items: cartLines.map((l) => ({ name: l.p.name, qty: l.qty, price: l.p.price })),
              address: finalDeliveryAddress,
              zone,
              split,
              paymentStatus: "simulated",
            });
            setCart({});
          }}
        />
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <DeliveryFlow />
    </Suspense>
  );
}
