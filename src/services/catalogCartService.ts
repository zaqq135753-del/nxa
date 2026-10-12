/**
 * Caraíva Digital — Multi-Niche Catalog & Order Cart Service
 * 
 * Gerencia catálogos segmentados por nicho (Gastronomia, Mercadinho/Hortifrúti,
 * Tatuagem & Arte, Passeios & Barcos, Pousadas/Diárias) e a sacola unificada
 * com geração de payload para integração com o aplicativo de diálogo/gestão do comércio.
 */

export type BusinessNiche = 
  | 'gastronomia'
  | 'conveniencia'   // Mercadinhos, Hortifrúti, Depósitos, Farmácia, Adega
  | 'tatuagem_arte'  // Tatuadores, Ateliers, Artesanato Pataxó
  | 'passeios_barcos'// Lanchas, Barcos para Corumbau, Boia no Rio
  | 'hospedagem'     // Pousadas, Suítes, Casas
  | 'servicos';      // Massagens, Guias, Carroceiros

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  formattedPrice: string;
  unit?: string;               // 'un', 'kg', 'pacote', 'sessão', 'pessoa', 'diária'
  description: string;
  image?: string;
  badge?: 'Mais Vendido' | 'Essencial' | 'Orgânico' | 'Flash Tattoo' | 'Pé na Areia' | 'Exclusivo';
  stockStatus: 'em_estoque' | 'ultimas_unidades' | 'sob_encomenda';
  inStockQuantity?: number;
  estimatedPrepTime?: string;  // '15-20 min', 'Sob agendamento', 'Entrega na areia'
}

export interface BusinessCatalog {
  businessId: string;
  niche: BusinessNiche;
  tabLabel: string;
  subtitle: string;
  categories: { id: string; label: string; icon?: string }[];
  deliveryAvailable: boolean;
  deliveryFee: number;
  minimumOrder: number;
  deliveryTimeEstimate: string;
  items: CatalogProduct[];
}

export interface CartItem {
  product: CatalogProduct;
  quantity: number;
  businessId: string;
  businessName: string;
  businessNiche: BusinessNiche;
  notes?: string;
}

export interface VillageOrderPayload {
  orderId: string;
  businessId: string;
  businessName: string;
  businessNiche: BusinessNiche;
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes?: string;
  }[];
  totalAmount: number;
  deliveryFee: number;
  destinationType: 'pousada' | 'praia' | 'mesa' | 'retirada';
  destinationDetail: string;
  customerName: string;
  paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
  createdAt: string;
  deepLinkPayload: string;
}

// Catálogos Realistas Pré-configurados por Nicho da Vila
export const CARAIVA_NICHED_CATALOGS: Record<string, BusinessCatalog> = {
  // 1. Mercadinho / Conveniência & Hortifrúti (ex: Mercearia da Vila / Depósito de Bebidas)
  'conveniencia-padrao': {
    businessId: 'conveniencia-padrao',
    niche: 'conveniencia',
    tabLabel: '🛒 Empório & Entrega',
    subtitle: 'Água, gelo, frutas frescas e mantimentos entregues onde você estiver na vila',
    deliveryAvailable: true,
    deliveryFee: 10,
    minimumOrder: 30,
    deliveryTimeEstimate: '20-35 min na pousada ou praia',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'bebidas', label: 'Água & Bebidas' },
      { id: 'gelo_conveniencia', label: 'Gelo & Churrasco' },
      { id: 'hortifruti', label: 'Hortifrúti Fresco' },
      { id: 'snacks', label: 'Petiscos & Mercearia' },
    ],
    items: [
      {
        id: 'cv-1',
        name: 'Galão de Água Mineral 20L',
        category: 'bebidas',
        price: 24.0,
        formattedPrice: 'R$ 24,00',
        unit: 'galão',
        description: 'Galão lacrado com vasilhame em comodato. Essencial para pousadas e casas de aluguel.',
        stockStatus: 'em_estoque',
        inStockQuantity: 18,
        badge: 'Essencial',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'cv-2',
        name: 'Saco de Gelo Filtrado 5kg',
        category: 'gelo_conveniencia',
        price: 18.0,
        formattedPrice: 'R$ 18,00',
        unit: 'saco 5kg',
        description: 'Gelo em cubos limpo para cooler de praia, caipirinhas e refrescar as bebidas na areia.',
        stockStatus: 'em_estoque',
        inStockQuantity: 35,
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'cv-3',
        name: 'Coco Verde Gelado da Foz',
        category: 'bebidas',
        price: 10.0,
        formattedPrice: 'R$ 10,00',
        unit: 'un',
        description: 'Água de coco doce e super gelada, colhida diretamente dos coqueirais da península.',
        stockStatus: 'em_estoque',
        inStockQuantity: 40,
        badge: 'Pé na Areia',
        image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'cv-4',
        name: 'Cesta Hortifrúti Tropical Caraíva',
        category: 'hortifruti',
        price: 38.0,
        formattedPrice: 'R$ 38,00',
        unit: 'cesta',
        description: 'Combo com 4 bananas da terra, 1 mamão papaia doce, 2 mangas e maracujá para suco matinal.',
        stockStatus: 'em_estoque',
        inStockQuantity: 8,
        badge: 'Orgânico',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'cv-5',
        name: 'Carvão Vegetal Ecológico 2.5kg',
        category: 'gelo_conveniencia',
        price: 22.0,
        formattedPrice: 'R$ 22,00',
        unit: 'saco',
        description: 'Carvão de acendimento rápido para churrascos nas casas de temporada.',
        stockStatus: 'em_estoque',
        inStockQuantity: 12,
        image: 'https://images.unsplash.com/photo-1527477378408-1bc09426f4f5?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'cv-6',
        name: 'Cerveja Artesanal Baiana 600ml',
        category: 'bebidas',
        price: 19.0,
        formattedPrice: 'R$ 19,00',
        unit: 'garrafa',
        description: 'Estilo Witbier com raspas de limão e semente de coentro. Estupidamente gelada.',
        stockStatus: 'ultimas_unidades',
        inStockQuantity: 6,
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1608270104958-396556cf912b?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },

  // 2. Estúdio de Tatuagem & Atelier Autoral (ex: Tattoo Caraíva Roots / Arte Pataxó)
  'tatuagem-padrao': {
    businessId: 'tatuagem-padrao',
    niche: 'tatuagem_arte',
    tabLabel: '🎨 Flash Tattoo & Obras',
    subtitle: 'Flash tattoos autorais, sessões exclusivas e peças artísticas para eternizar Caraíva',
    deliveryAvailable: false,
    deliveryFee: 0,
    minimumOrder: 150,
    deliveryTimeEstimate: 'Atendimento no estúdio com hora marcada',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'flash_pequeno', label: 'Flash Pequeno' },
      { id: 'flash_exclusivo', label: 'Autoral & Exclusivo' },
      { id: 'arte_quadros', label: 'Pinturas & Cerâmica' },
    ],
    items: [
      {
        id: 'tt-1',
        name: 'Flash Tattoo: Tartaruga Marinha Minimalista',
        category: 'flash_pequeno',
        price: 250.0,
        formattedPrice: 'R$ 250,00',
        unit: 'sessão 40min',
        description: 'Traço fino (fine-line) autoral de tartaruga de Caraíva. Tamanho até 6cm, materiais 100% esterilizados.',
        stockStatus: 'em_estoque',
        badge: 'Flash Tattoo',
        image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'tt-2',
        name: 'Flash Tattoo: Coqueiro & Maré de Caraíva',
        category: 'flash_pequeno',
        price: 280.0,
        formattedPrice: 'R$ 280,00',
        unit: 'sessão 50min',
        description: 'Silhueta poética dos coqueiros icônicos da foz. Ideal para antebraço, costela ou tornozelo.',
        stockStatus: 'em_estoque',
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'tt-3',
        name: 'Sessão Autoral Exclusiva Personalizada (1/2 Dia)',
        category: 'flash_exclusivo',
        price: 550.0,
        formattedPrice: 'R$ 550,00',
        unit: 'sessão 3h',
        description: 'Criação de desenho único feita junto com você tomando um café na vila, refletindo sua vivência na Bahia.',
        stockStatus: 'sob_encomenda',
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'tt-4',
        name: 'Azulejo Artístico Pintado à Mão na Vila',
        category: 'arte_quadros',
        price: 120.0,
        formattedPrice: 'R$ 120,00',
        unit: 'peça',
        description: 'Pintura à mão esmaltada com casarios coloridos de Caraíva e o Rio. Leve a vila para sua parede.',
        stockStatus: 'ultimas_unidades',
        inStockQuantity: 3,
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },

  // 3. Passeios, Lanchas & Barcos (ex: Saída Corumbau, Boia no Rio)
  'passeios-padrao': {
    businessId: 'passeios-padrao',
    niche: 'passeios_barcos',
    tabLabel: '⛵ Passeios & Vagas',
    subtitle: 'Reserve sua vaga em barcos nativos, lanchas rápidas e experiências fluviais',
    deliveryAvailable: false,
    deliveryFee: 0,
    minimumOrder: 80,
    deliveryTimeEstimate: 'Saídas diárias pela manhã no Porto da Balsa',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'praia_mar', label: 'Costa & Corumbau' },
      { id: 'rio_fluvial', label: 'Rio & Mangue' },
      { id: 'privativo', label: 'Lanchas Privativas' },
    ],
    items: [
      {
        id: 'ps-1',
        name: 'Travessia de Barco até a Ponta do Corumbau',
        category: 'praia_mar',
        price: 130.0,
        formattedPrice: 'R$ 130,00',
        unit: 'por pessoa',
        description: 'Vaga em embarcação segura. Saída às 09:30, 4h livres em Corumbau e retorno pelo pôr do sol.',
        stockStatus: 'ultimas_unidades',
        inStockQuantity: 4,
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'ps-2',
        name: 'Descida do Rio Caraíva de Boia com Guia Nativo',
        category: 'rio_fluvial',
        price: 85.0,
        formattedPrice: 'R$ 85,00',
        unit: 'por pessoa',
        description: 'Subida de barco a motor e descida tranquila flutuando na correnteza das águas escuras e mornas.',
        stockStatus: 'em_estoque',
        badge: 'Pé na Areia',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'ps-3',
        name: 'Lancha Privativa: Praia do Espelho & Recifes',
        category: 'privativo',
        price: 900.0,
        formattedPrice: 'R$ 900,00',
        unit: 'grupo até 5 pessoas',
        description: 'Passeio VIP exclusivo com marinheiro habilitado, parada para snorkel nos corais e cooler abastecido.',
        stockStatus: 'sob_encomenda',
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
};

export function getBusinessCatalog(businessId: string, category: string, subCategory?: string): BusinessCatalog | null {
  // Pousadas, hotéis, casas de aluguel e pontos turísticos NÃO vendem produtos/conveniência
  if (category === 'hospedagens' || category === 'pontos' || category === 'praias') {
    return null;
  }

  // Se for mercado / conveniência / bebidas / hortifruti / mercearia
  const isConvenience = 
    category === 'lojas' || 
    category === 'conveniencia' || 
    subCategory?.toLowerCase().includes('mercado') ||
    subCategory?.toLowerCase().includes('hortifruti') ||
    subCategory?.toLowerCase().includes('bebida') ||
    subCategory?.toLowerCase().includes('deposito') ||
    subCategory?.toLowerCase().includes('mercearia');

  if (isConvenience) {
    return { ...CARAIVA_NICHED_CATALOGS['conveniencia-padrao'], businessId };
  }

  // Se for tatuagem, arte ou atelier
  const isTattooOrArt =
    subCategory?.toLowerCase().includes('tattoo') ||
    subCategory?.toLowerCase().includes('tatuagem') ||
    subCategory?.toLowerCase().includes('atelier') ||
    subCategory?.toLowerCase().includes('arte') ||
    subCategory?.toLowerCase().includes('artesanato');

  if (isTattooOrArt) {
    return { ...CARAIVA_NICHED_CATALOGS['tatuagem-padrao'], businessId };
  }

  // Se for passeio, barco ou lancha
  const isTour = category === 'passeios';
  if (isTour) {
    return { ...CARAIVA_NICHED_CATALOGS['passeios-padrao'], businessId };
  }

  // Se for qualquer outra loja
  if (category === 'lojas') {
    return { ...CARAIVA_NICHED_CATALOGS['conveniencia-padrao'], businessId };
  }

  return null;
}

// ----------------------------------------------------
// GERENCIADOR DE SACOLA / CARRINHO EM MEMÓRIA & STORAGE
// ----------------------------------------------------

const CART_STORAGE_KEY = 'caraiva_tourist_cart';

export function getCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('caraiva:cart-updated', { detail: items }));
  } catch {
    // Storage silent fallback
  }
}

export function getDifferentBusinessInCart(businessId: string): { businessId: string; businessName: string; count: number } | null {
  const current = getCartItems();
  const different = current.filter((i) => i.businessId !== businessId);
  if (different.length === 0) return null;
  const count = different.reduce((acc, i) => acc + i.quantity, 0);
  return {
    businessId: different[0].businessId,
    businessName: different[0].businessName || 'outro comércio',
    count,
  };
}

export interface AddToCartOptions {
  forceReplace?: boolean;
}

export function addToCart(
  product: CatalogProduct,
  businessId: string,
  businessName: string,
  niche: BusinessNiche,
  options?: AddToCartOptions
): boolean {
  let current = getCartItems();
  const conflict = getDifferentBusinessInCart(businessId);

  // Previne mistura de comércios diferentes na mesma sacola
  if (conflict) {
    if (!options?.forceReplace) {
      const confirmReplace = typeof window !== 'undefined' && window.confirm
        ? window.confirm(
            `Sua sacola já contém ${conflict.count} item(ns) de "${conflict.businessName}".\n\nDeseja esvaziar a sacola anterior e iniciar um novo pedido em "${businessName}"?`
          )
        : true;

      if (!confirmReplace) {
        return false;
      }
    }

    // Esvazia os itens do outro estabelecimento para manter o pedido exclusivo
    current = [];
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('caraiva:cart-swapped', {
          detail: {
            previousBusinessName: conflict.businessName,
            newBusinessName: businessName,
          },
        })
      );
    }
  }

  const existingIdx = current.findIndex(
    (i) => i.product.id === product.id && i.businessId === businessId
  );

  if (existingIdx >= 0) {
    current[existingIdx].quantity += 1;
  } else {
    current.push({
      product,
      quantity: 1,
      businessId,
      businessName,
      businessNiche: niche,
    });
  }

  saveCartItems(current);
  return true;
}

export function updateCartQuantity(productId: string, businessId: string, delta: number): void {
  const current = getCartItems();
  const targetIdx = current.findIndex(
    (i) => i.product.id === productId && i.businessId === businessId
  );

  if (targetIdx >= 0) {
    current[targetIdx].quantity += delta;
    if (current[targetIdx].quantity <= 0) {
      current.splice(targetIdx, 1);
    }
    saveCartItems(current);
  }
}

export function clearCartForBusiness(businessId: string): void {
  const current = getCartItems();
  const remaining = current.filter((i) => i.businessId !== businessId);
  saveCartItems(remaining);
}

export function clearCart(): void {
  saveCartItems([]);
}

/**
 * Gera o payload oficial estruturado para o app do negócio / chat direto
 */
export function buildVillageOrderPayload(params: {
  businessId: string;
  businessName: string;
  businessNiche: BusinessNiche;
  customerName: string;
  destinationType: 'pousada' | 'praia' | 'mesa' | 'retirada';
  destinationDetail: string;
  paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
}): VillageOrderPayload {
  const items = getCartItems().filter((i) => i.businessId === params.businessId);
  const totalAmount = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const deliveryFee = params.destinationType === 'retirada' ? 0 : 10;
  const orderId = `CV-${Date.now().toString().slice(-5)}`;

  const orderData: VillageOrderPayload = {
    orderId,
    businessId: params.businessId,
    businessName: params.businessName,
    businessNiche: params.businessNiche,
    items: items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
      unitPrice: i.product.price,
      subtotal: i.product.price * i.quantity,
    })),
    totalAmount: totalAmount + deliveryFee,
    deliveryFee,
    destinationType: params.destinationType,
    destinationDetail: params.destinationDetail,
    customerName: params.customerName,
    paymentMethod: params.paymentMethod,
    createdAt: new Date().toISOString(),
    deepLinkPayload: encodeURIComponent(JSON.stringify({
      orderId,
      bId: params.businessId,
      items: items.map(i => ({ id: i.product.id, q: i.quantity })),
      total: totalAmount + deliveryFee,
      client: params.customerName,
    })),
  };

  return orderData;
}
