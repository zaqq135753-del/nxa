import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Waves,
  Sun,
  Sunset,
  Moon,
  Fish,
  Flame,
  Wine,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Users,
  QrCode,
  Clock,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  X,
  Radio,
} from 'lucide-react';
import { useCaraivaWeatherAndTide } from '../useCaraivaWeatherAndTide';
import { addToCart, type CatalogProduct } from '../../../services/catalogCartService';
import { Caraiva3DFloatingDishShowcase } from './Caraiva3DFloatingDishShowcase';

export interface CaraivaLivingDish {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  description: string;
  category: 'leve_praia' | 'compartilhar' | 'almoco' | 'drinks' | 'sobremesas';
  tags: string[];
  image: string;
  portionInfo?: string;
  pairingSuggestion?: string;
  prepTimeMinutes?: number;
  highlightBadge?: string;
}

export const CARAIVA_NATIVE_FEATURED_DISHES: CaraivaLivingDish[] = [
  {
    id: 'pastel-arraia-artesanal',
    name: 'Pastel de Arraia Artesanal com Vinagrete da Casa',
    price: 38,
    formattedPrice: 'R$ 38,00',
    description: 'Massa fina e ultracrocante aberta na hora, recheada com carne de arraia fresca desfiada e temperada na tradição costeira de Caraíva. Acompanha vinagrete da casa com coentro da horta e pimenta de cheiro aromática.',
    category: 'leve_praia',
    tags: ['Pescado do Dia', 'Receita Pataxó', 'Melhor na Maré Baixa'],
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    portionInfo: '4 unidades generosas',
    pairingSuggestion: 'Harmoniza divinamente com Caipirinha de Cacau Nativo ou cerveja bem gelada na areia.',
    prepTimeMinutes: 15,
    highlightBadge: 'Clássico da Vila',
  },
  {
    id: 'moqueca-baiana-mista',
    name: 'Moqueca Baiana Mista de Peixe & Camarão com Farofa de Dendê',
    price: 145,
    formattedPrice: 'R$ 145,00',
    description: 'Servida borbulhante na panela de barro artesanal. Postas suculentas de peixe fresco da foz com camarões médios selecionados, leite de coco tirado no dia, azeite de dendê puro na medida exata, pimentões em tiras finas e coentro selvagem. Acompanha arroz branco e farofa crocante de dendê.',
    category: 'compartilhar',
    tags: ['Pescado do Dia', 'Para Compartilhar', 'Almoço Completo'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    portionInfo: 'Serve 2 a 3 pessoas fartamente',
    pairingSuggestion: 'Perfeita com suco de cajá fresco sob a brisa morna do meio-dia.',
    prepTimeMinutes: 30,
    highlightBadge: 'Mais Pedido',
  },
  {
    id: 'polvo-grelhado-brasa',
    name: 'Polvo Grelhado na Brasa com Batatas ao Murro',
    price: 128,
    formattedPrice: 'R$ 128,00',
    description: 'Tentáculos tenros de polvo da costa do Sul da Bahia defumados na brasa alta de lenha frutífera, emulsionados no azeite extravirgem aromatizado com ervas da restinga, alho confitado e batatas douradas ao murro salpicadas com flor de sal.',
    category: 'almoco',
    tags: ['Pescado do Dia', 'Almoço Completo', 'Melhor na Maré Baixa'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    portionInfo: 'Serve 1 a 2 pessoas',
    pairingSuggestion: 'Excelente ao lado de um vinho branco gelado ou caipiroska cítrica.',
    prepTimeMinutes: 25,
    highlightBadge: 'Toque do Chef',
  },
  {
    id: 'caipirinha-cacau-nativo',
    name: 'Caipirinha de Cacau com Mel de Cacau Nativo & Gengibre',
    price: 36,
    formattedPrice: 'R$ 36,00',
    description: 'Cachaça artesanal de alambique da Bahia com polpa fresca e mel de cacau nativo extraído diretamente das cabrucas do extremo sul baiano, equilibrada com raspas de gengibre selvagem e gelo puro de água de coco.',
    category: 'drinks',
    tags: ['Receita Pataxó', 'Drinks Tropicais', 'Melhor na Maré Baixa'],
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    portionInfo: 'Taça de 380ml com fruta in natura',
    pairingSuggestion: 'Combinação sagrada com o Pastel de Arraia assistindo ao entardecer no rio.',
    prepTimeMinutes: 5,
    highlightBadge: 'Assinatura',
  },
  {
    id: 'cocada-cremosa-forno',
    name: 'Cocada Cremosa de Forno com Sorvete de Tapioca',
    price: 32,
    formattedPrice: 'R$ 32,00',
    description: 'Cocada dourada assada na cerâmica até atingir crosta crocante caramelizada e recheio leitoso e aveludado de coco fresco ralado à mão. Servida quente com uma bola generosa de sorvete de tapioca flocada.',
    category: 'sobremesas',
    tags: ['Receita Pataxó', 'Para Compartilhar'],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
    portionInfo: 'Serve até 2 pessoas',
    pairingSuggestion: 'Ideal com café especial da Chapada Diamantina ou licor nativo de jenipapo.',
    prepTimeMinutes: 12,
    highlightBadge: 'Doce da Vila',
  },
];

export interface LivingCartItem {
  dish: CaraivaLivingDish;
  quantity: number;
  notes?: string;
}

export interface CaraivaLivingMenuSectionProps {
  businessId?: string;
  businessName?: string;
  whatsappNumber?: string;
  onOpenGlobalCart?: () => void;
  onOpenCheckout?: () => void;
  className?: string;
}

export const CaraivaLivingMenuSection: React.FC<CaraivaLivingMenuSectionProps> = ({
  businessId = 'restaurante-caraiva',
  businessName = 'Restaurante & Bar Pé na Areia',
  whatsappNumber: _whatsappNumber = '5573999999999',
  onOpenGlobalCart: _onOpenGlobalCart,
  onOpenCheckout: _onOpenCheckout,
  className = '',
}) => {
  // Live weather and tide context for Sommelier da Areia
  const weatherTide = useCaraivaWeatherAndTide();
  
  // State for menu items & interactive comanda
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [comandaItems, setComandaItems] = useState<Record<string, LivingCartItem>>({});
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [isComandaDrawerOpen, setIsComandaDrawerOpen] = useState<boolean>(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [tableNumber] = useState<string>('Mesa 04 (Areia)');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutType, setCheckoutType] = useState<'pix' | 'taptable_nfc'>('pix');
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [nfcScanning, setNfcScanning] = useState<boolean>(false);
  const [orderSentSuccess, setOrderSentSuccess] = useState<boolean>(false);

  // Filter Categories
  const filterCategories = [
    { id: 'todos', label: 'Tudo', icon: UtensilsCrossed },
    { id: 'leve_praia', label: 'Leve de Praia', icon: Waves },
    { id: 'compartilhar', label: 'Para Compartilhar', icon: Users },
    { id: 'almoco', label: 'Almoço Completo', icon: Flame },
    { id: 'drinks', label: 'Drinks Tropicais', icon: Wine },
  ];

  // Filtered dishes
  const displayedDishes = useMemo(() => {
    if (activeFilter === 'todos') return CARAIVA_NATIVE_FEATURED_DISHES;
    return CARAIVA_NATIVE_FEATURED_DISHES.filter(
      (d) => d.category === activeFilter || (activeFilter === 'compartilhar' && d.tags.includes('Para Compartilhar'))
    );
  }, [activeFilter]);

  // Totals calculations
  const totalItemCount = useMemo(() => {
    return Object.values(comandaItems).reduce((sum, item) => sum + item.quantity, 0);
  }, [comandaItems]);

  const subtotal = useMemo(() => {
    return Object.values(comandaItems).reduce(
      (sum, item) => sum + item.dish.price * item.quantity,
      0
    );
  }, [comandaItems]);

  const pricePerPerson = useMemo(() => {
    if (peopleCount <= 0 || subtotal === 0) return 0;
    return subtotal / peopleCount;
  }, [subtotal, peopleCount]);

  // Contextual Sommelier Recommendation
  const sommelierContext = useMemo(() => {
    const isLowTide = weatherTide.tideState === 'baixa';
    const now = new Date();
    const hour = now.getHours();
    
    let solarPhase = 'tarde';
    let solarPhaseLabel = 'Entardecer na Vila';
    let icon = Sunset;

    if (hour >= 6 && hour < 12) {
      solarPhase = 'manha';
      solarPhaseLabel = 'Manhã Ensolarada';
      icon = Sun;
    } else if (hour >= 12 && hour < 17) {
      solarPhase = 'almoco';
      solarPhaseLabel = 'Almoço com Brisa do Rio';
      icon = Sun;
    } else if (hour >= 17 && hour < 19) {
      solarPhase = 'entardecer';
      solarPhaseLabel = 'Pôr do Sol Mágico';
      icon = Sunset;
    } else {
      solarPhase = 'noite';
      solarPhaseLabel = 'Noite Estrelada';
      icon = Moon;
    }

    // Recommendation logic
    if (solarPhase === 'entardecer' || solarPhase === 'tarde') {
      return {
        phaseLabel: solarPhaseLabel,
        Icon: icon,
        title: 'Entardecer: Caipirinha de Cacau + Pastel de Arraia',
        description: 'O sol está tocando a foz do rio. O frescor do cacau cabruca harmoniza com a textura crocante e o recheio de arraia na maré baixa.',
        dishIds: ['caipirinha-cacau-nativo', 'pastel-arraia-artesanal'],
        badge: 'Harmonização Solar #01',
      };
    } else if (solarPhase === 'almoco') {
      return {
        phaseLabel: solarPhaseLabel,
        Icon: icon,
        title: 'Almoço Completo: Moqueca Mista na Panela de Barro',
        description: isLowTide
          ? 'Maré baixa perfeita após a praia. Aqueça a alma com o dendê puro, robalo e camarão acompanhado de farofa crocante.'
          : 'Brisa refrescante na beira-mar. Experimente a Moqueca Mista borbulhante para compartilhar.',
        dishIds: ['moqueca-baiana-mista'],
        badge: 'Prato do Dia',
      };
    } else {
      return {
        phaseLabel: solarPhaseLabel,
        Icon: icon,
        title: 'Noite na Areia: Polvo na Brasa & Cocada Quente',
        description: 'Música suave e lanternas acesas. A defumação do polvo na brasa com batatas ao murro, fechando com a cocada artesanal de forno.',
        dishIds: ['polvo-grelhado-brasa', 'cocada-cremosa-forno'],
        badge: 'Menu Noturno',
      };
    }
  }, [weatherTide]);

  // Handlers
  const handleAddDish = (dish: CaraivaLivingDish) => {
    setComandaItems((prev) => {
      const existing = prev[dish.id];
      const newQty = existing ? existing.quantity + 1 : 1;
      return {
        ...prev,
        [dish.id]: {
          dish,
          quantity: newQty,
        },
      };
    });

    // Animate badge/button
    setJustAddedId(dish.id);
    setTimeout(() => setJustAddedId(null), 1200);

    // Sync to global catalog cart
    const catalogItem: CatalogProduct = {
      id: dish.id,
      name: dish.name,
      category: dish.category,
      price: dish.price,
      formattedPrice: dish.formattedPrice,
      description: dish.description,
      image: dish.image,
      stockStatus: 'em_estoque',
      badge: (dish.highlightBadge as any) || 'Pé na Areia',
    };
    addToCart(catalogItem, businessId, businessName, 'gastronomia');
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setComandaItems((prev) => {
      const existing = prev[dishId];
      if (!existing) return prev;
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[dishId];
        return copy;
      }
      return {
        ...prev,
        [dishId]: {
          ...existing,
          quantity: nextQty,
        },
      };
    });
  };

  const handleAddSommelierPairing = () => {
    sommelierContext.dishIds.forEach((id) => {
      const dish = CARAIVA_NATIVE_FEATURED_DISHES.find((d) => d.id === id);
      if (dish) handleAddDish(dish);
    });
    setIsComandaDrawerOpen(true);
  };

  const handleTriggerNfcTap = () => {
    setNfcScanning(true);
    setTimeout(() => {
      setNfcScanning(false);
      setOrderSentSuccess(true);
      setTimeout(() => {
        setOrderSentSuccess(false);
        setCheckoutModalOpen(false);
        setComandaItems({});
      }, 2500);
    }, 1800);
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136caraiva-live-taptable-f932-pix@banco.com.br520400005303986540' + subtotal.toFixed(2));
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 0. DESTAQUE CINEMÁTICO 3D: PRATOS VIVOS DA TERRA */}
      <Caraiva3DFloatingDishShowcase
        onAddDishToCart={(dishName) => {
          const matched = CARAIVA_NATIVE_FEATURED_DISHES.find(
            (d) => d.name.toLowerCase().includes(dishName.toLowerCase().split(' ')[0])
          ) || CARAIVA_NATIVE_FEATURED_DISHES[0];
          handleAddDish(matched);
        }}
      />

      {/* 1. ASSISTENTE SOMMELIER DA AREIA (IA CONTEXTUAL DO CARDÁPIO) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#141719] via-[#090B0C] to-[#141719] border border-[#F6C945]/30 p-4 sm:p-5 shadow-2xl shadow-black/60"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C945]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Header do Sommelier */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#F6C945]/15 border border-[#F6C945]/30 text-[#F6C945]">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F6C945]">
                  Sommelier da Areia • IA Gastronômica
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#FFF4ED] tracking-tight">
                  Harmonização Solar & Ciclo de Marés
                </h3>
              </div>
            </div>

            {/* Status Solar & Maré Atual */}
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <sommelierContext.Icon className="w-3.5 h-3.5 text-[#F6C945]" />
                <span className="font-semibold">{sommelierContext.phaseLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold text-[11px]">
                <Waves className="w-3.5 h-3.5" />
                <span>Maré {weatherTide.tideState === 'baixa' ? 'Baixa (Vazante)' : 'Cheia'}</span>
              </span>
            </div>
          </div>

          {/* Sugestão Dinâmica de Harmonização */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.03] p-3.5 rounded-2xl border border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#F6C945]/20 text-[#F6C945] font-black text-[10px] tracking-wider uppercase">
                  {sommelierContext.badge}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#FFF4ED]">
                  {sommelierContext.title}
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-xl">
                {sommelierContext.description}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAddSommelierPairing}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F6C945] to-amber-500 text-[#090B0C] font-black text-xs flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Pedir Harmonização Completa</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2. BARRA DE FILTROS RÁPIDOS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Fish className="w-4 h-4 text-[#F6C945]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#FFF4ED]">
              Cardápio Sensorial Nativo
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {displayedDishes.length} receitas autênticas
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterCategories.map((cat) => {
            const isActive = activeFilter === cat.id;
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#F6C945] text-[#090B0C] shadow-md shadow-[#F6C945]/20 font-black'
                    : 'bg-[#141719] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#090B0C]' : 'text-[#F6C945]'}`} />
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. LISTA DE PRATOS EM DESTAQUE (CARD GRID SENSORIAL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedDishes.map((dish) => {
          const inCartCount = comandaItems[dish.id]?.quantity || 0;
          const isJustAdded = justAddedId === dish.id;

          return (
            <motion.div
              key={dish.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#141719] border border-white/10 hover:border-[#F6C945]/40 transition-all shadow-lg shadow-black/40"
            >
              <div>
                {/* Imagem do Prato com Overlays */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141719] via-black/40 to-transparent" />

                  {/* Badges superiores */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {dish.highlightBadge && (
                      <span className="px-2 py-0.5 rounded-md bg-[#090B0C]/80 backdrop-blur-md text-[#F6C945] font-black text-[10px] tracking-wide border border-[#F6C945]/30">
                        ★ {dish.highlightBadge}
                      </span>
                    )}
                    {dish.portionInfo && (
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-200 font-semibold text-[10px] border border-white/10">
                        {dish.portionInfo}
                      </span>
                    )}
                  </div>

                  {/* Preço em Destaque */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-3 py-1 rounded-xl bg-[#090B0C]/90 backdrop-blur-md text-[#F6C945] font-black text-sm sm:text-base border border-[#F6C945]/40 shadow-md">
                      {dish.formattedPrice}
                    </span>
                  </div>
                </div>

                {/* Conteúdo textual */}
                <div className="p-4 space-y-2.5">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#FFF4ED] group-hover:text-[#F6C945] transition-colors leading-snug">
                    {dish.name}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Tags Ricas */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dish.tags.map((tag, idx) => {
                      const isMare = tag.includes('Maré');
                      const isPataxo = tag.includes('Pataxó');
                      const isPescado = tag.includes('Pescado');

                      let tagStyle = 'bg-white/5 text-slate-300 border-white/10';
                      if (isMare) tagStyle = 'bg-sky-500/15 text-sky-300 border-sky-500/30 font-bold';
                      else if (isPataxo) tagStyle = 'bg-amber-500/15 text-[#F6C945] border-[#F6C945]/30 font-bold';
                      else if (isPescado) tagStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold';

                      return (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border ${tagStyle} flex items-center gap-1`}
                        >
                          {isMare && <Waves className="w-2.5 h-2.5" />}
                          {isPataxo && <Flame className="w-2.5 h-2.5" />}
                          {isPescado && <Fish className="w-2.5 h-2.5" />}
                          <span>{tag}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Harmonização do Prato */}
                  {dish.pairingSuggestion && (
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2 text-[11px] text-slate-400 mt-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#F6C945] shrink-0 mt-0.5" />
                      <span>{dish.pairingSuggestion}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ação de Adicionar / Comanda Viva */}
              <div className="p-4 pt-1 border-t border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>~{dish.prepTimeMinutes || 20} min no fogo</span>
                </div>

                <div className="flex items-center gap-2">
                  {inCartCount > 0 ? (
                    <div className="flex items-center gap-1.5 bg-[#090B0C] p-1 rounded-xl border border-white/10">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleUpdateQuantity(dish.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </motion.button>
                      <span className="w-6 text-center text-xs font-black text-[#F6C945]">
                        {inCartCount}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleAddDish(dish)}
                        className="w-7 h-7 rounded-lg bg-[#F6C945] hover:bg-amber-400 text-[#090B0C] font-black flex items-center justify-center cursor-pointer transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                      onClick={() => handleAddDish(dish)}
                      className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                        isJustAdded
                          ? 'bg-emerald-500 text-[#090B0C]'
                          : 'bg-gradient-to-r from-[#F6C945] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#090B0C]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Na Bandeja!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pedir para a Mesa</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. BANDEJA NA AREIA / COMANDA FLUTUANTE (BOTTOM BAR & DRAWER) */}
      <AnimatePresence>
        {totalItemCount > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-[480px] z-50 pointer-events-auto"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#090B0C]/95 backdrop-blur-xl border border-[#F6C945]/40 shadow-2xl shadow-black/80 p-3 sm:p-4 text-[#FFF4ED] space-y-3">
              {/* Top Row: Total e Expansor */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative p-2 rounded-xl bg-[#F6C945]/15 border border-[#F6C945]/30 text-[#F6C945]">
                    <ShoppingBag className="w-4 h-4" />
                    <motion.span
                      key={totalItemCount}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#F6C945] text-[#090B0C] text-[10px] font-black flex items-center justify-center shadow-xs"
                    >
                      {totalItemCount}
                    </motion.span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Bandeja na Areia</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{tableNumber}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-black text-[#F6C945]">
                        R$ {subtotal.toFixed(2).replace('.', ',')}
                      </span>
                      {peopleCount > 1 && (
                        <span className="text-[11px] text-slate-300 font-medium">
                          ({peopleCount} pessoas = R$ {pricePerPerson.toFixed(2).replace('.', ',')}/cada)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsComandaDrawerOpen(!isComandaDrawerOpen)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Expandir Comanda"
                >
                  {isComandaDrawerOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Seletor Rápido de Divisão da Conta por Pessoa */}
              <div className="flex items-center justify-between bg-white/[0.04] p-2 rounded-xl border border-white/5 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 text-[11px] font-semibold">
                  <Users className="w-3.5 h-3.5 text-[#F6C945]" />
                  Dividir a conta:
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                    disabled={peopleCount <= 1}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-black text-[#F6C945] text-xs px-1">
                    {peopleCount} {peopleCount === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPeopleCount((p) => Math.min(12, p + 1))}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Gaveta Expandida (Itens Detalhados da Comanda) */}
              <AnimatePresence>
                {isComandaDrawerOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-2 border-t border-white/10 pt-2.5 max-h-48 overflow-y-auto pr-1"
                  >
                    {Object.values(comandaItems).map((ci) => (
                      <div
                        key={ci.dish.id}
                        className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="font-bold text-[#F6C945]">{ci.quantity}x</span>
                          <span className="truncate text-slate-200">{ci.dish.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-slate-300">
                            R$ {(ci.dish.price * ci.quantity).toFixed(2).replace('.', ',')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(ci.dish.id, -1)}
                            className="text-rose-400 hover:text-rose-300 text-[10px] px-1 py-0.5 rounded bg-rose-500/10 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botões de Fechamento da Comanda */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setCheckoutType('pix');
                    setCheckoutModalOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#F6C945]" />
                  <span>Pix Instantâneo</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setCheckoutType('taptable_nfc');
                    setCheckoutModalOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F6C945] to-amber-500 text-[#090B0C] font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>NFC TapTable</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MODAL DE FECHAMENTO (PIX OU NFC TAPTABLE) */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-[#090B0C] border border-[#F6C945]/40 p-5 sm:p-6 shadow-2xl text-[#FFF4ED] space-y-4"
            >
              {/* Fechar Modal */}
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/30 text-[#F6C945] font-black text-[10px] uppercase tracking-widest">
                  {checkoutType === 'pix' ? 'Pagamento Instantâneo Pix' : 'TapTable NFC • Fechar na Mesa'}
                </span>
                <h3 className="text-lg font-black text-[#FFF4ED]">
                  {businessName}
                </h3>
                <p className="text-xs text-slate-400">
                  {tableNumber} • Total: <strong className="text-[#F6C945]">R$ {subtotal.toFixed(2).replace('.', ',')}</strong>
                  {peopleCount > 1 && ` (R$ ${pricePerPerson.toFixed(2).replace('.', ',')} / cada)`}
                </p>
              </div>

              {/* Conteúdo de acordo com o método */}
              {checkoutType === 'pix' ? (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#141719] border border-white/10 space-y-3">
                    <div className="w-44 h-44 rounded-xl bg-white p-2.5 flex items-center justify-center shadow-inner">
                      {/* Simulação QR Code Pix */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=pix-caraiva-${subtotal}`}
                        alt="QR Code Pix Caraíva"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 text-center">
                      Escaneie com o app do seu banco ou copie a chave Pix abaixo
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 cursor-pointer transition"
                  >
                    {pixCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Chave Copia e Cola Copiada!</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 text-[#F6C945]" />
                        <span>Copiar Código Pix Copia e Cola</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#141719] border border-white/10 space-y-3 text-center">
                    <motion.div
                      animate={nfcScanning ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-20 h-20 rounded-full bg-[#F6C945]/15 border border-[#F6C945]/40 flex items-center justify-center text-[#F6C945]"
                    >
                      <Radio className="w-10 h-10 animate-pulse" />
                    </motion.div>

                    {orderSentSuccess ? (
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" /> Comanda Vinculada com Sucesso!
                        </h4>
                        <p className="text-xs text-slate-300">
                          A cozinha e o bar já receberam seus pedidos para a {tableNumber}.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-[#FFF4ED]">
                          Aproxime o Celular da Plaqueta NFC da Mesa
                        </h4>
                        <p className="text-xs text-slate-400">
                          Toque na plaqueta de madeira inteligente cravada na sua mesa pé na areia.
                        </p>
                      </div>
                    )}
                  </div>

                  {!orderSentSuccess && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleTriggerNfcTap}
                      disabled={nfcScanning}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6C945] to-amber-500 text-[#090B0C] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      {nfcScanning ? (
                        <span>Sincronizando com a Mesa...</span>
                      ) : (
                        <>
                          <Radio className="w-4 h-4" />
                          <span>Simular Toque NFC na Mesa</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              )}

              {/* Informação do TapTable */}
              <div className="text-center pt-2 border-t border-white/5">
                <p className="text-[10px] text-slate-400">
                  Integrado ao Ecossistema <strong>TapTable Caraíva</strong> • Sem filas, no seu ritmo
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
