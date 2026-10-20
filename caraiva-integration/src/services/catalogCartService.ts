/**
 * Caraíva Digital — Multi-Niche Catalog & Order Cart Service
 * 
 * Gerencia catálogos segmentados por nicho (Gastronomia, Mercadinho/Hortifrúti,
 * Tatuagem & Arte, Passeios & Barcos, Pousadas/Diárias, Noite & Cultura) e a sacola unificada
 * com geração de payload para integração com o aplicativo de diálogo/gestão do comércio.
 */

export type BusinessNiche = 
  | 'gastronomia'
  | 'conveniencia'   // Mercadinhos, Hortifrúti, Depósitos, Farmácia, Adega
  | 'tatuagem_arte'  // Tatuadores, Ateliers, Artesanato Pataxó
  | 'passeios_barcos'// Lanchas, Barcos para Corumbau, Boia no Rio
  | 'hospedagem'     // Pousadas, Suítes, Casas
  | 'noite_cultura'  // Forró, Festas, Bares Noturnos
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
  badge?: 'Mais Vendido' | 'Essencial' | 'Orgânico' | 'Flash Tattoo' | 'Pé na Areia' | 'Exclusivo' | 'Famoso' | 'Artesanal';
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
  // ----------------------------------------------------
  // 1. BOTECO DO PARÁ (Petiscos, Beira-Rio, Pôr do Sol)
  // ----------------------------------------------------
  'boteco-do-para': {
    businessId: 'boteco-do-para',
    niche: 'gastronomia',
    tabLabel: '🍽️ Cardápio Vivo',
    subtitle: 'Os lendários pastéis de arraia, moquecas e drinks na beira do Rio Caraíva',
    deliveryAvailable: true,
    deliveryFee: 12,
    minimumOrder: 40,
    deliveryTimeEstimate: '25-40 min na vila ou consumo nas mesas',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'pasteis', label: 'Pastéis Famosos' },
      { id: 'pratos', label: 'Moquecas & Pratos' },
      { id: 'petiscos', label: 'Petiscos da Beira' },
      { id: 'bebidas', label: 'Caipirinhas & Cervejas' },
    ],
    items: [
      {
        id: 'bp-1',
        name: 'Pastel de Arraia Tradicional',
        category: 'pasteis',
        price: 28.0,
        formattedPrice: 'R$ 28,00',
        unit: 'unidade grande',
        description: 'Massa fininha e crocante recheada com arraia fresca desfiada e temperos nativos da foz.',
        stockStatus: 'em_estoque',
        badge: 'Famoso',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bp-2',
        name: 'Pastel de Camarão com Catupiry',
        category: 'pasteis',
        price: 32.0,
        formattedPrice: 'R$ 32,00',
        unit: 'unidade grande',
        description: 'Camarões rosa selecionados salteados no azeite com requeijão cremoso e massa dourada.',
        stockStatus: 'em_estoque',
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bp-3',
        name: 'Moqueca de Robalo com Camarão na Panela de Barro',
        category: 'pratos',
        price: 195.0,
        formattedPrice: 'R$ 195,00',
        unit: 'serve 2 a 3 pessoas',
        description: 'Postas de robalo fresco e camarões em leite de coco natural, dendê suave, arroz, pirão e farofa.',
        stockStatus: 'em_estoque',
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bp-4',
        name: 'Isca de Peixe do Rio com Molho Tártaro Artesanal',
        category: 'petiscos',
        price: 58.0,
        formattedPrice: 'R$ 58,00',
        unit: 'porção 400g',
        description: 'Tiras crocantes empanadas na farinha de mandioca crocante da Bahia com molho da casa.',
        stockStatus: 'em_estoque',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bp-5',
        name: 'Caipirinha de Caju com Limão & Gengibre',
        category: 'bebidas',
        price: 34.0,
        formattedPrice: 'R$ 34,00',
        unit: 'copo 400ml',
        description: 'Caju fresco colhido na vila, cachaça artesanal alambique e gelo cristalino triturado.',
        stockStatus: 'em_estoque',
        badge: 'Pé na Areia',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bp-6',
        name: 'Cerveja Puro Malte Artesanal 600ml',
        category: 'bebidas',
        price: 22.0,
        formattedPrice: 'R$ 22,00',
        unit: 'garrafa 600ml',
        description: 'Estupidamente gelada, ideal para brindar o pôr do sol nas mesinhas sob as amendoeiras.',
        stockStatus: 'em_estoque',
        image: 'https://images.unsplash.com/photo-1608270104958-396556cf912b?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 2. CULINÁRIA CENTRAL (Frutos do Mar, Tradição)
  // ----------------------------------------------------
  'culinaria-central': {
    businessId: 'culinaria-central',
    niche: 'gastronomia',
    tabLabel: '🍽️ Cardápio Vivo',
    subtitle: 'Pratos brasileiros clássicos, moquecas e peixes no coração da Rua Sete de Setembro',
    deliveryAvailable: true,
    deliveryFee: 10,
    minimumOrder: 45,
    deliveryTimeEstimate: '30-45 min na vila ou salão',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'moquecas', label: 'Moquecas & Bobós' },
      { id: 'grelhados', label: 'Peixes & Frutos do Mar' },
      { id: 'carnes', label: 'Carnes & Vegetariano' },
      { id: 'sobremesas', label: 'Sobremesas da Vila' },
    ],
    items: [
      {
        id: 'cc-1',
        name: 'Bobó de Camarão da Costa do Descobrimento',
        category: 'moquecas',
        price: 168.0,
        formattedPrice: 'R$ 168,00',
        unit: 'serve 2 pessoas',
        description: 'Camarões rosa selecionados em creme aveludado de mandioca com leite de coco fresco e azeite de dendê.',
        stockStatus: 'em_estoque',
        badge: 'Famoso',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cc-2',
        name: 'Peixe Inteiro na Brasa com Banana da Terra',
        category: 'grelhados',
        price: 154.0,
        formattedPrice: 'R$ 154,00',
        unit: 'serve 2 pessoas',
        description: 'Robalo ou Vermelho fresco assado no carvão, servido com banana grelhada, vinagrete e farofa de dendê.',
        stockStatus: 'em_estoque',
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cc-3',
        name: 'Polvo Grelhado no Azeite de Ervas e Batatas ao Murro',
        category: 'grelhados',
        price: 178.0,
        formattedPrice: 'R$ 178,00',
        unit: 'serve 2 pessoas',
        description: 'Tentáculos tenros tostados na chapa de ferro com chimichurri baiano e alho confit.',
        stockStatus: 'em_estoque',
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cc-4',
        name: 'Moqueca Vegana de Caju e Palmito Pupunha',
        category: 'moquecas',
        price: 110.0,
        formattedPrice: 'R$ 110,00',
        unit: 'serve 2 pessoas',
        description: 'Caju caramelizado e palmito pupunha fresco em caldo aromático de coco e pimentões coloridos.',
        stockStatus: 'em_estoque',
        badge: 'Orgânico',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cc-5',
        name: 'Cocada Cremosa de Forno com Sorvete de Tapioca',
        category: 'sobremesas',
        price: 32.0,
        formattedPrice: 'R$ 32,00',
        unit: 'porção individual',
        description: 'Coco ralado fresco assado até dourar, servido quentinho com sorvete artesanal de tapioca.',
        stockStatus: 'em_estoque',
        badge: 'Artesanal',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 3. CANTO DA DUCA (Café, Vegetariano, Arte)
  // ----------------------------------------------------
  'canto-da-duca': {
    businessId: 'canto-da-duca',
    niche: 'gastronomia',
    tabLabel: '☕ Café & Quitutes',
    subtitle: 'A famosa torta de chocolate, pratos vegetarianos e arte nativa da Duca',
    deliveryAvailable: false,
    deliveryFee: 0,
    minimumOrder: 30,
    deliveryTimeEstimate: 'Consumo no jardim com arte nativa',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'doces', label: 'Doces Famosos' },
      { id: 'pratos', label: 'Almoço Vegetariano' },
      { id: 'cafes', label: 'Cafés & Sucos Vivos' },
      { id: 'arte', label: 'Obras de Arte da Duca' },
    ],
    items: [
      {
        id: 'cd-1',
        name: 'Torta Lendária de Chocolate Artesanal',
        category: 'doces',
        price: 28.0,
        formattedPrice: 'R$ 28,00',
        unit: 'fatia generosa',
        description: 'A mundialmente elogiada fatia densa e aveludada de chocolate meio amargo com receita secreta da Duca.',
        stockStatus: 'em_estoque',
        badge: 'Famoso',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cd-2',
        name: 'Prato Feito Vegetariano da Duca',
        category: 'pratos',
        price: 56.0,
        formattedPrice: 'R$ 56,00',
        unit: 'prato individual',
        description: 'Arroz integral com castanhas, moqueca de banana da terra com leite de coco nativo, feijão fradinho e salada da horta.',
        stockStatus: 'em_estoque',
        badge: 'Orgânico',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cd-3',
        name: 'Suco Energético de Cacau Fresco com Mel Nativo',
        category: 'cafes',
        price: 24.0,
        formattedPrice: 'R$ 24,00',
        unit: 'copo 400ml',
        description: 'Polpa pura de cacau fresco do sul da Bahia batida bem gelada com mel silvestre da mata atlântica.',
        stockStatus: 'em_estoque',
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cd-4',
        name: 'Azulejo Original Pintado à Mão por Duca',
        category: 'arte',
        price: 130.0,
        formattedPrice: 'R$ 130,00',
        unit: 'obra única assinada',
        description: 'Azulejo esmaltado autoral retratando casario histórico de Caraíva, o Rio e coqueirais.',
        stockStatus: 'ultimas_unidades',
        inStockQuantity: 4,
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 4. RESTAURANTE DO JACARANDÁ (Alta Gastronomia)
  // ----------------------------------------------------
  'restaurante-do-jacaranda': {
    businessId: 'restaurante-do-jacaranda',
    niche: 'gastronomia',
    tabLabel: '🍽️ Menu Degustação',
    subtitle: 'Gastronomia contemporânea com raízes baianas sob a copa das árvores centenárias',
    deliveryAvailable: false,
    deliveryFee: 0,
    minimumOrder: 60,
    deliveryTimeEstimate: 'Serviço à la carte no bistrô',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'entradas', label: 'Entradas & Ceviches' },
      { id: 'principais', label: 'Pratos Principais' },
      { id: 'drinks', label: 'Mixologia Autoral' },
    ],
    items: [
      {
        id: 'jc-1',
        name: 'Nhoque de Mandioca com Ragu de Carne de Sol',
        category: 'principais',
        price: 88.0,
        formattedPrice: 'R$ 88,00',
        unit: 'prato individual',
        description: 'Nhoque artesanal dourado na manteiga de garrafa com ragu de carne de sol cozido lentamente por 8 horas.',
        stockStatus: 'em_estoque',
        badge: 'Famoso',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'jc-2',
        name: 'Ceviche de Robalo com Leite de Tigre de Caju',
        category: 'entradas',
        price: 72.0,
        formattedPrice: 'R$ 72,00',
        unit: 'entrada',
        description: 'Cubos de peixe branco fresco, cebola roxa marinada, manga em cubos e caldo cítrico de caju.',
        stockStatus: 'em_estoque',
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'jc-3',
        name: 'Risoto de Frutos do Mar ao Açafrão da Terra',
        category: 'principais',
        price: 118.0,
        formattedPrice: 'R$ 118,00',
        unit: 'prato individual',
        description: 'Arroz carnaroli com camarão rosa, polvo grelhado e lula flambados no vinho branco com cúrcuma fresca.',
        stockStatus: 'em_estoque',
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 5. POUSADA VILA DO MAR (Hospedagem & Charme)
  // ----------------------------------------------------
  'pousada-vila-do-mar': {
    businessId: 'pousada-vila-do-mar',
    niche: 'hospedagem',
    tabLabel: '🛏️ Suítes & Diárias',
    subtitle: 'Refúgio de charme a 100m da praia com piscina vulcânica e café colonial',
    deliveryAvailable: false,
    deliveryFee: 0,
    minimumOrder: 450,
    deliveryTimeEstimate: 'Check-in a partir das 14h / Check-out 12h',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'suites', label: 'Suítes & Bangalôs' },
      { id: 'experiencias', label: 'Experiências do Hóspede' },
    ],
    items: [
      {
        id: 'pvm-1',
        name: 'Suíte Areia com Varanda e Rede Privativa',
        category: 'suites',
        price: 580.0,
        formattedPrice: 'R$ 580,00',
        unit: 'diária casal',
        description: 'Cama king-size com dossel antialérgico, ar-condicionado inverter silencioso, chuveiro aquecido solar e café artesanal incluso.',
        stockStatus: 'em_estoque',
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'pvm-2',
        name: 'Bangalô Master com Vista Coqueiral',
        category: 'suites',
        price: 890.0,
        formattedPrice: 'R$ 890,00',
        unit: 'diária casal',
        description: 'Espaço amplo de 48m², deck de madeira privativo, banheira de imersão e amenidades botânicas da Bahia.',
        stockStatus: 'ultimas_unidades',
        inStockQuantity: 2,
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'pvm-3',
        name: 'Massagem Relaxante com Óleos da Restinga (60 min)',
        category: 'experiencias',
        price: 220.0,
        formattedPrice: 'R$ 220,00',
        unit: 'sessão 60 min',
        description: 'Atendimento no gazebo integrado ao jardim com terapeuta nativa e óleos aromáticos de capim-limão.',
        stockStatus: 'em_estoque',
        badge: 'Artesanal',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 6. FORRÓ DO OURIÇO (Noite, Cultura & Tradição)
  // ----------------------------------------------------
  'forro-do-ourico': {
    businessId: 'forro-do-ourico',
    niche: 'noite_cultura',
    tabLabel: '🪗 Ingressos & Bar',
    subtitle: 'O autêntico forró pé de serra pé na areia até o amanhecer',
    deliveryAvailable: false,
    deliveryFee: 0,
    minimumOrder: 40,
    deliveryTimeEstimate: 'Abertura às 23:00 / Shows até 05:00',
    categories: [
      { id: 'todos', label: 'Tudo' },
      { id: 'ingressos', label: 'Ingressos da Noite' },
      { id: 'bar', label: 'Bar do Forró' },
    ],
    items: [
      {
        id: 'fo-1',
        name: 'Ingresso Antecipado Forró do Ouriço',
        category: 'ingressos',
        price: 40.0,
        formattedPrice: 'R$ 40,00',
        unit: 'ingresso individual',
        description: 'Entrada garantida sem fila na porta. Trio de forró tradicional ao vivo no salão de areia fofa.',
        stockStatus: 'em_estoque',
        badge: 'Famoso',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'fo-2',
        name: 'Ingresso Duplo / Casal',
        category: 'ingressos',
        price: 70.0,
        formattedPrice: 'R$ 70,00',
        unit: '2 ingressos',
        description: 'Válido para entrada de 2 pessoas na mesma noite.',
        stockStatus: 'em_estoque',
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'fo-3',
        name: 'Balde com 5 Cervejas Long Neck Geladas',
        category: 'bar',
        price: 75.0,
        formattedPrice: 'R$ 75,00',
        unit: 'balde com gelo',
        description: 'Heineken, Stella ou Corona estupidamente geladas para acompanhar o arrasta-pé.',
        stockStatus: 'em_estoque',
        image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'fo-4',
        name: 'Dose de Cachaça da Terra com Mel e Limão',
        category: 'bar',
        price: 18.0,
        formattedPrice: 'R$ 18,00',
        unit: 'dose 60ml',
        description: 'A dose nativa tradicional que dá energia para forrozear a noite inteira.',
        stockStatus: 'em_estoque',
        badge: 'Pé na Areia',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 7. CARAÍVA BRASIL / PASSEIOS (Náutica, Corumbau, Boia)
  // ----------------------------------------------------
  'caraiva-brasil': {
    businessId: 'caraiva-brasil',
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
        inStockQuantity: 6,
        badge: 'Mais Vendido',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'ps-3',
        name: 'Lancha Privativa: Praia do Espelho & Recifes',
        category: 'privativo',
        price: 950.0,
        formattedPrice: 'R$ 950,00',
        unit: 'grupo até 5 pessoas',
        description: 'Passeio VIP exclusivo com marinheiro habilitado, parada para snorkel nos corais e cooler abastecido.',
        stockStatus: 'sob_encomenda',
        badge: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 8. MERCADINHO / CONVENIÊNCIA & HORTIFRÚTI (Padrão)
  // ----------------------------------------------------
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
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cv-5',
        name: 'Repelente Natural de Citronela e Andiroba',
        category: 'snacks',
        price: 28.0,
        formattedPrice: 'R$ 28,00',
        unit: 'frasco spray 120ml',
        description: 'Fórmula suave e ecológica contra mosquitinhos e pernilongos da restinga. Não agride a pele.',
        stockStatus: 'em_estoque',
        badge: 'Essencial',
        image: 'https://images.unsplash.com/photo-1608248597359-0097651a7e43?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },

  // ----------------------------------------------------
  // 9. TATUAGEM & ARTE AUTORAL (Padrão)
  // ----------------------------------------------------
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
        image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'tt-3',
        name: 'Gamela Tradicional Pataxó em Madeira Nobre',
        category: 'arte_quadros',
        price: 85.0,
        formattedPrice: 'R$ 85,00',
        unit: 'peça esculpida',
        description: 'Peça rústica artesanal esculpida à mão por artesãos indígenas da Reserva da Jaqueira/Porto do Boi.',
        stockStatus: 'em_estoque',
        badge: 'Artesanal',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
};

// Aliases dinâmicos para cobrir todos os comércios
CARAIVA_NICHED_CATALOGS['manga-rosa'] = {
  ...CARAIVA_NICHED_CATALOGS['culinaria-central'],
  businessId: 'manga-rosa',
  subtitle: 'Peixes frescos, frutos do mar e drinks tropicais à beira do Rio',
};
CARAIVA_NICHED_CATALOGS['bar-do-porto'] = {
  ...CARAIVA_NICHED_CATALOGS['boteco-do-para'],
  businessId: 'bar-do-porto',
  tabLabel: '🍕 Pizzas & Jazz',
  subtitle: 'Pizzas artesanais no forno a lenha, vinhos e drinks com vista do Rio',
};
CARAIVA_NICHED_CATALOGS['forro-do-pele'] = {
  ...CARAIVA_NICHED_CATALOGS['forro-do-ourico'],
  businessId: 'forro-do-pele',
  subtitle: 'Forró autêntico na Rua do Campo com grandes mestres sanfoneiros',
};
CARAIVA_NICHED_CATALOGS['beco-da-lua'] = {
  ...CARAIVA_NICHED_CATALOGS['boteco-do-para'],
  businessId: 'beco-da-lua',
  tabLabel: '🌙 Noite & Gastronomia',
  subtitle: 'O point noturno mais charmoso com música ao vivo, drinks e bistrôs',
};
CARAIVA_NICHED_CATALOGS['pousada-casa-de-areia'] = {
  ...CARAIVA_NICHED_CATALOGS['pousada-vila-do-mar'],
  businessId: 'pousada-casa-de-areia',
  subtitle: 'Bangalôs pé na areia com alta gastronomia e vista deslumbrante do oceano',
};
CARAIVA_NICHED_CATALOGS['pousada-nativa'] = {
  ...CARAIVA_NICHED_CATALOGS['pousada-vila-do-mar'],
  businessId: 'pousada-nativa',
  subtitle: 'Hospedagem rústico chic com conforto, silêncio e atendimento acolhedor',
};

/**
 * Obtém o catálogo adequado para qualquer negócio e nicho de Caraíva.
 * NUNCA retorna null para estabelecimentos comerciais ativos!
 */
export function getBusinessCatalog(businessId: string, category: string, subCategory?: string): BusinessCatalog | null {
  // Pontos turísticos históricos públicos e praias abertas não vendem produtos
  if (category === 'pontos' || category === 'praias') {
    return null;
  }

  // 1. Verifica se existe catálogo específico cadastrado para este businessId
  if (CARAIVA_NICHED_CATALOGS[businessId]) {
    return CARAIVA_NICHED_CATALOGS[businessId];
  }

  // 2. Mapeamento por nicho de Gastronomia / Bares / Cafés
  if (category === 'restaurantes' || category === 'bares' || category === 'cafes') {
    return {
      ...CARAIVA_NICHED_CATALOGS['culinaria-central'],
      businessId,
    };
  }

  // 3. Mapeamento por nicho de Hospedagens
  if (category === 'hospedagens') {
    return {
      ...CARAIVA_NICHED_CATALOGS['pousada-vila-do-mar'],
      businessId,
    };
  }

  // 4. Mapeamento por nicho de Passeios e Lanchas
  if (category === 'passeios') {
    return {
      ...CARAIVA_NICHED_CATALOGS['caraiva-brasil'],
      businessId,
    };
  }

  // 5. Mapeamento por nicho de Noite e Forró
  if (category === 'noite') {
    return {
      ...CARAIVA_NICHED_CATALOGS['forro-do-ourico'],
      businessId,
    };
  }

  // 6. Mapeamento por Tatuagem, Artesanato ou Arte
  const isArt = subCategory?.toLowerCase().includes('tattoo') ||
    subCategory?.toLowerCase().includes('arte') ||
    subCategory?.toLowerCase().includes('artesanato') ||
    subCategory?.toLowerCase().includes('atelier');
  if (isArt) {
    return {
      ...CARAIVA_NICHED_CATALOGS['tatuagem-padrao'],
      businessId,
    };
  }

  // 7. Mapeamento padrão para Lojas, Conveniência e Mercearias
  if (category === 'lojas' || category === 'conveniencia') {
    return {
      ...CARAIVA_NICHED_CATALOGS['conveniencia-padrao'],
      businessId,
    };
  }

  // Fallback seguro
  return {
    ...CARAIVA_NICHED_CATALOGS['culinaria-central'],
    businessId,
  };
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
