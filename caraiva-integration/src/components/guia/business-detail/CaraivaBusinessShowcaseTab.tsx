import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Search,
  X,
  Sparkles,
  ChevronRight,
  Clock,
  UtensilsCrossed,
  Flame,
} from 'lucide-react';
import {
  type BusinessCatalog,
  type CartItem,
  type CatalogProduct,
  addToCart,
  updateCartQuantity,
} from '../../../services/catalogCartService';
import { SafeBusinessImage } from '../SafeBusinessImage';

interface CaraivaBusinessShowcaseTabProps {
  catalog: BusinessCatalog;
  businessName: string;
  cartItems: CartItem[];
  onOpenCartModal: () => void;
  onCartUpdated?: () => void;
}

export const CaraivaBusinessShowcaseTab: React.FC<CaraivaBusinessShowcaseTabProps> = ({
  catalog,
  businessName,
  cartItems,
  onOpenCartModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductDetail, setSelectedProductDetail] = useState<CatalogProduct | null>(null);
  const [itemNote, setItemNote] = useState<string>('');
  const [modalQty, setModalQty] = useState<number>(1);

  // Itens deste comércio que estão no carrinho
  const currentBusinessCart = cartItems.filter((i) => i.businessId === catalog.businessId);
  const totalItemsCount = currentBusinessCart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartValue = currentBusinessCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  const getItemCount = (productId: string) => {
    const found = currentBusinessCart.find((i) => i.product.id === productId);
    return found ? found.quantity : 0;
  };

  // Filtra itens por categoria e por busca
  const filteredItems = useMemo(() => {
    let items = catalog.items;

    if (selectedCategory !== 'todos') {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return items;
  }, [catalog.items, selectedCategory, searchQuery]);

  // Identifica o prato estrela / destaque do chef da categoria atual
  const heroHighlightDish = useMemo(() => {
    if (searchQuery.trim()) return null; // Quando busca, mostra lista direta
    return filteredItems.find(
      (item) => item.badge === 'Famoso' || item.badge === 'Mais Vendido' || item.badge === 'Exclusivo'
    ) || (filteredItems.length > 0 && selectedCategory !== 'todos' ? filteredItems[0] : null);
  }, [filteredItems, searchQuery, selectedCategory]);

  // Lista dos demais pratos (excluindo o destaque hero se ele estiver ativo)
  const remainingDishes = useMemo(() => {
    if (!heroHighlightDish) return filteredItems;
    return filteredItems.filter((item) => item.id !== heroHighlightDish.id);
  }, [filteredItems, heroHighlightDish]);

  const openDishDetail = (product: CatalogProduct) => {
    setSelectedProductDetail(product);
    setItemNote('');
    setModalQty(1);
  };

  const handleAddFromModal = () => {
    if (!selectedProductDetail) return;
    for (let i = 0; i < modalQty; i++) {
      addToCart(selectedProductDetail, catalog.businessId, businessName, catalog.niche);
    }
    setSelectedProductDetail(null);
  };

  return (
    <div className="space-y-4 select-none pb-12">
      {/* 1. BARRA DE BUSCA GASTRONÔMICA ELEGANTE */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar prato, petisco, ingrediente ou bebida..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. PÍLULAS DE CATEGORIAS MINIMALISTAS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
        {catalog.categories.map((cat) => {
          const active = selectedCategory === cat.id;
          const count = cat.id === 'todos' 
            ? catalog.items.length 
            : catalog.items.filter((i) => i.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-gradient-to-r from-amber-400 to-[#F6C945] text-slate-950 font-black shadow-md shadow-amber-400/20'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  active ? 'bg-black/20 text-slate-950' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. HERO / PRATO ESTRELA DO CHEF (SE HOUVER DESTAQUE) */}
      {heroHighlightDish && (
        <div
          onClick={() => openDishDetail(heroHighlightDish)}
          className="relative rounded-3xl overflow-hidden border border-amber-400/30 bg-gradient-to-b from-[#181d22] to-[#0e1216] shadow-xl hover:border-amber-400/60 transition-all cursor-pointer group"
        >
          {/* Imagem Widescreen 16:9 */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950">
            <SafeBusinessImage
              src={heroHighlightDish.image || ''}
              alt={heroHighlightDish.name}
              category="gastronomia"
              fallbackSeed={heroHighlightDish.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradiente de sombra cinematográfica na base */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1216] via-[#0e1216]/40 to-transparent" />

            {/* Badge de Destaque */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>{heroHighlightDish.badge || 'Destaque do Cardápio'}</span>
            </div>

            {/* Tempo de Preparo estimado se houver */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-bold">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{heroHighlightDish.estimatedPrepTime || '20-25 min'}</span>
            </div>
          </div>

          {/* Informações do Prato Estrela */}
          <div className="p-4 sm:p-5 -mt-6 relative z-10 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-black text-white font-serif tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                  {heroHighlightDish.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {heroHighlightDish.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-amber-400 font-serif">
                  {heroHighlightDish.formattedPrice}
                </span>
                {heroHighlightDish.unit && (
                  <span className="text-[11px] text-slate-400">
                    • {heroHighlightDish.unit}
                  </span>
                )}
              </div>

              {/* Botão Anti-Quebra de Linha */}
              <div onClick={(e) => e.stopPropagation()}>
                {getItemCount(heroHighlightDish.id) > 0 ? (
                  <div className="flex items-center gap-1.5 bg-black/90 backdrop-blur-md border border-amber-400/50 rounded-full p-1 shadow-lg shadow-black/80">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(heroHighlightDish.id, catalog.businessId, -1)}
                      className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black px-2 text-amber-300 min-w-[20px] text-center">
                      {getItemCount(heroHighlightDish.id)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(heroHighlightDish, catalog.businessId, businessName, catalog.niche)}
                      className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(heroHighlightDish, catalog.businessId, businessName, catalog.niche)}
                    className="whitespace-nowrap shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-[#F6C945] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Adicionar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. LISTA EDITORIAL DOS DEMAIS PRATOS */}
      <div className="space-y-3 pt-1">
        {remainingDishes.map((product) => {
          const qty = getItemCount(product.id);
          return (
            <div
              key={product.id}
              onClick={() => openDishDetail(product)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 hover:shadow-lg flex items-center gap-3.5 cursor-pointer group ${
                qty > 0
                  ? 'bg-[#12181e] border-teal-500/40 shadow-teal-500/10'
                  : 'bg-[#141719]/90 border-white/[0.08] hover:border-amber-400/30 hover:bg-[#181d22]'
              }`}
            >
              {/* Informações do Prato (Esquerda 65%) */}
              <div className="flex-1 min-w-0 pr-1">
                {product.badge && (
                  <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 mb-1">
                    {product.badge}
                  </span>
                )}

                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {product.name}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs sm:text-sm font-black text-amber-400 font-serif">
                    {product.formattedPrice}
                  </span>
                  {product.unit && (
                    <span className="text-[10px] text-slate-400">
                      • {product.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Foto Harmônica à Direita com Botão Anti-Quebra (35%) */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-md border border-white/10 bg-slate-950">
                <SafeBusinessImage
                  src={product.image || ''}
                  alt={product.name}
                  category="gastronomia"
                  fallbackSeed={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Botão de Adicionar / Controle de Quantidade */}
                <div
                  className="absolute bottom-1.5 right-1.5 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {qty > 0 ? (
                    <div className="flex items-center gap-1 bg-black/90 backdrop-blur-md border border-amber-400/50 rounded-full p-0.5 shadow-lg shadow-black/80">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(product.id, catalog.businessId, -1)}
                        className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-[11px] font-black px-1 text-amber-300 min-w-[16px] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(product, catalog.businessId, businessName, catalog.niche)}
                        className="w-5 h-5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-sm"
                      >
                        <Plus className="w-2.5 h-2.5 stroke-[3]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(product, catalog.businessId, businessName, catalog.niche)}
                      className="whitespace-nowrap shrink-0 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-[#F6C945] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 shadow-md shadow-amber-400/30 active:scale-95 transition-all cursor-pointer"
                      title="Adicionar à sacola"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span className="whitespace-nowrap">Adicionar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center space-y-2">
          <UtensilsCrossed className="w-8 h-8 text-slate-500 mx-auto opacity-40" />
          <p className="text-xs text-slate-400">Nenhum prato encontrado para "{searchQuery}".</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
            }}
            className="text-xs text-amber-400 underline font-bold"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* 5. MODAL / DRAWER DE DETALHES GOURMET DO PRATO */}
      {selectedProductDetail && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in"
          onClick={() => setSelectedProductDetail(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0c141a] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Foto do Prato no Header do Modal */}
            <div className="relative h-48 sm:h-56 w-full bg-slate-950 shrink-0">
              <SafeBusinessImage
                src={selectedProductDetail.image || ''}
                alt={selectedProductDetail.name}
                category="gastronomia"
                fallbackSeed={selectedProductDetail.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c141a] via-transparent to-black/50" />
              <button
                type="button"
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {selectedProductDetail.badge && (
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{selectedProductDetail.badge}</span>
                </div>
              )}
            </div>

            {/* Conteúdo & Ingredientes */}
            <div className="p-5 space-y-4 overflow-y-auto no-scrollbar flex-1">
              <div>
                <h3 className="text-lg font-black text-white font-serif tracking-tight">
                  {selectedProductDetail.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {selectedProductDetail.description}
                </p>
              </div>

              {/* Destaque Gastronômico da Foz */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preparo Nativo Sob Encomenda</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ingredientes frescos selecionados diariamente de pescadores e agricultores da região de Caraíva.
                </p>
              </div>

              {/* Campo Opcional de Observação do Cliente */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Observações para a cozinha (opcional):
                </label>
                <input
                  type="text"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  placeholder="Ex: sem coentro, ponto do peixe bem grelhado..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Rodapé Fixo do Modal com Stepper e CTA */}
            <div className="p-4 bg-[#0a1015] border-t border-white/10 flex items-center gap-3 shrink-0">
              {/* Stepper */}
              <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-2xl p-1.5">
                <button
                  type="button"
                  onClick={() => setModalQty((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black px-2 text-white min-w-[24px] text-center">
                  {modalQty}
                </span>
                <button
                  type="button"
                  onClick={() => setModalQty((prev) => prev + 1)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Botão de Adicionar à Sacola */}
              <button
                type="button"
                onClick={handleAddFromModal}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-[#F6C945] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-amber-400/25 active:scale-98 transition-all cursor-pointer"
              >
                <span>Adicionar à Sacola</span>
                <span>
                  R$ {(selectedProductDetail.price * modalQty).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. BARRA FLUTUANTE DA SACOLA ATIVA (DARK LUXURY) */}
      {totalItemsCount > 0 && (
        <div className="sticky bottom-2 z-30 animate-in fade-in slide-in-from-bottom-2">
          <div
            onClick={onOpenCartModal}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#141719] via-[#1a2026] to-[#141719] border border-amber-400/40 text-white shadow-2xl flex items-center justify-between cursor-pointer active:scale-98 transition-all ring-1 ring-amber-400/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
                <ShoppingBag className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <p className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'} na Sacola</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </p>
                <p className="text-[10px] text-slate-400">
                  Toque para revisar pedido em {businessName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-amber-400 font-serif">
                R$ {totalCartValue.toFixed(2)}
              </span>
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
