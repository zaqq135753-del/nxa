import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  Store,
  ChevronRight,
} from 'lucide-react';
import {
  type BusinessCatalog,
  type CartItem,
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

  // Filtra itens por categoria
  const filteredItems = selectedCategory === 'todos'
    ? catalog.items
    : catalog.items.filter((item) => item.category === selectedCategory);

  // Itens deste comércio que estão no carrinho
  const currentBusinessCart = cartItems.filter((i) => i.businessId === catalog.businessId);
  const totalItemsCount = currentBusinessCart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartValue = currentBusinessCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  const getItemCount = (productId: string) => {
    const found = currentBusinessCart.find((i) => i.product.id === productId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="space-y-4 select-none pb-8">
      {/* 1. Header do Catálogo / Nicho */}
      <div
        className="p-4 rounded-3xl border shadow-lg relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--cv-paper), var(--cv-soft))',
          borderColor: 'var(--cv-line)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-tight" style={{ color: 'var(--cv-ink)' }}>
                  Vitrine & Catálogo Oficial
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Pronto para Pedir
                </span>
              </div>
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--cv-muted)' }}>
                {catalog.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Informações de Entrega ou Atendimento */}
        <div className="mt-3 pt-3 border-t border-[var(--cv-line)] flex items-center justify-between text-xs" style={{ color: 'var(--cv-muted)' }}>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            <span>{catalog.deliveryTimeEstimate}</span>
          </div>
          {catalog.deliveryAvailable && (
            <span className="font-semibold text-emerald-600">
              Taxa de entrega: R$ {catalog.deliveryFee.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* 2. Categorias em Pílula */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar select-none">
        {catalog.categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`cv-showcase-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                active
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Grid de Produtos / Serviços da Vitrine */}
      <div className="space-y-3">
        {filteredItems.map((product) => {
          const qty = getItemCount(product.id);
          return (
            <div
              key={product.id}
              className="p-3.5 rounded-2xl border transition-all duration-200 hover:shadow-md flex items-center gap-3.5"
              style={{
                background: 'var(--cv-paper)',
                borderColor: qty > 0 ? '#14B8A6' : 'var(--cv-line)',
                boxShadow: qty > 0 ? '0 0 16px rgba(20, 184, 166, 0.15)' : 'none',
              }}
            >
              {/* Foto do Produto */}
              {product.image && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[var(--cv-line)] bg-slate-900">
                  <SafeBusinessImage
                    src={product.image}
                    alt={product.name}
                    category="gastronomia"
                    fallbackSeed={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.badge && (
                    <span className="absolute top-1 left-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Informações & Estoque */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate" style={{ color: 'var(--cv-ink)' }}>
                    {product.name}
                  </h4>
                  {product.stockStatus === 'ultimas_unidades' && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-500">
                      Restam {product.inStockQuantity}
                    </span>
                  )}
                </div>

                <p className="text-[11px] line-clamp-2 mt-0.5 leading-relaxed" style={{ color: 'var(--cv-muted)' }}>
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-xs sm:text-sm font-black text-amber-500">
                      {product.formattedPrice}
                    </span>
                    {product.unit && (
                      <span className="text-[10px] ml-1" style={{ color: 'var(--cv-muted)' }}>
                        /{product.unit}
                      </span>
                    )}
                  </div>

                  {/* Controles de Quantidade / Adicionar à Sacola */}
                  <div className="flex items-center gap-1.5">
                    {qty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, catalog.businessId, -1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold px-1 text-teal-400">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(product, catalog.businessId, businessName, catalog.niche)}
                          className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 font-bold flex items-center justify-center active:scale-90 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(product, catalog.businessId, businessName, catalog.niche)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Barra Flutuante de Sacola Ativa (se houver itens) */}
      {totalItemsCount > 0 && (
        <div className="sticky bottom-2 z-30 animate-in fade-in slide-in-from-bottom-2">
          <div
            onClick={onOpenCartModal}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-teal-500 text-slate-950 shadow-2xl flex items-center justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xs shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black tracking-tight leading-tight">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item na Sacola' : 'itens na Sacola'}
                </p>
                <p className="text-[10px] font-bold opacity-80">
                  Toque para revisar e enviar para {businessName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-black text-xs">
              <span className="text-sm">R$ {totalCartValue.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
