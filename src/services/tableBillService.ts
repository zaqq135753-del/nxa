// Service e estrutura de dados para a Comanda / Conta da Mesa em Caraíva
export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
  notes?: string;
  status: 'delivered' | 'preparing';
}

export interface BillRound {
  id: string;
  time: string;
  label: string;
  items: BillItem[];
}

export interface TableBillData {
  businessId: string;
  businessName: string;
  tableNumber: string;
  locationArea: string;
  openedAt: string;
  serverName: string;
  status: 'open' | 'closing' | 'paid';
  clientName?: string;
  rounds: BillRound[];
  couvertPerPerson: number;
  peopleCount: number;
  serviceFeePercent: number; // ex: 10%
  pixKey: string;
  pixReceiver: string;
}

// Comanda realista de exemplo para restaurantes de Caraíva (ex: Boteco do Pará / Canto da Duca)
export const DEFAULT_MOCK_BILLS: Record<string, TableBillData> = {
  'boteco-do-para': {
    businessId: 'boteco-do-para',
    businessName: 'Boteco do Pará',
    tableNumber: 'Mesa 07',
    locationArea: 'Deck Beira-Rio',
    openedAt: '14:20',
    serverName: 'Carlinhos da Vila',
    status: 'open',
    clientName: 'Visitante',
    couvertPerPerson: 10,
    peopleCount: 2,
    serviceFeePercent: 10,
    pixKey: 'botecodopara@caraiva.pix',
    pixReceiver: 'Boteco do Pará Gastronomia LTDA',
    rounds: [
      {
        id: 'rd-1',
        time: '14:25',
        label: '1ª Rodada • Boas-vindas & Petiscos',
        items: [
          {
            id: 'item-1',
            name: 'Pastel de Aratu Especial',
            quantity: 2,
            unitPrice: 24,
            totalPrice: 48,
            image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80',
            notes: 'Acompanha vinagrete da casa e pimenta baiana',
            status: 'delivered',
          },
          {
            id: 'item-2',
            name: 'Caipirinha de Caju Amigo com Cachaça Artesanal',
            quantity: 2,
            unitPrice: 32,
            totalPrice: 64,
            image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
            notes: 'Caju fresco colhido na restinga',
            status: 'delivered',
          },
        ],
      },
      {
        id: 'rd-2',
        time: '15:10',
        label: '2ª Rodada • Almoço & Prato Principal',
        items: [
          {
            id: 'item-3',
            name: 'Moqueca Mista de Peixe do Dia e Camarão (2 pessoas)',
            quantity: 1,
            unitPrice: 195,
            totalPrice: 195,
            image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
            notes: 'Com arroz soltinho, pirão denso e farofa de dendê',
            status: 'delivered',
          },
          {
            id: 'item-4',
            name: 'Água de Coco Gelada',
            quantity: 2,
            unitPrice: 12,
            totalPrice: 24,
            image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=400&q=80',
            status: 'delivered',
          },
        ],
      },
      {
        id: 'rd-3',
        time: '16:05',
        label: '3ª Rodada • Sobremesa & Café',
        items: [
          {
            id: 'item-5',
            name: 'Cocada Mole Cremosa com Sorvete de Tapioca',
            quantity: 1,
            unitPrice: 28,
            totalPrice: 28,
            image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80',
            notes: 'Receita tradicional da Dona Jura',
            status: 'preparing',
          },
        ],
      },
    ],
  },
};

const STORAGE_KEY_PREFIX = 'caraiva:table_bill:';

export function getTableBill(businessId: string, tableNumber: string = 'Mesa 07'): TableBillData {
  const key = `${STORAGE_KEY_PREFIX}${businessId}:${tableNumber}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }

  // Se não existir salva, usa o mock rico ou gera com base no estabelecimento
  const base = DEFAULT_MOCK_BILLS[businessId] || {
    businessId,
    businessName: businessId.replace(/-/g, ' ').toUpperCase(),
    tableNumber,
    locationArea: 'Área Principal',
    openedAt: '14:30',
    serverName: 'Equipe Caraíva',
    status: 'open',
    clientName: 'Visitante',
    couvertPerPerson: 0,
    peopleCount: 2,
    serviceFeePercent: 10,
    pixKey: `${businessId}@caraiva.pix`,
    pixReceiver: 'Estabelecimento Caraíva Digital',
    rounds: [
      {
        id: 'rd-default',
        time: '14:35',
        label: '1ª Rodada',
        items: [
          {
            id: 'item-def-1',
            name: 'Petisco Autêntico da Vila',
            quantity: 1,
            unitPrice: 42,
            totalPrice: 42,
            status: 'delivered',
          },
          {
            id: 'item-def-2',
            name: 'Bebida Refrescante Tropical',
            quantity: 2,
            unitPrice: 18,
            totalPrice: 36,
            status: 'delivered',
          },
        ],
      },
    ],
  };

  return { ...base, tableNumber };
}

export function saveTableBill(bill: TableBillData): void {
  const key = `${STORAGE_KEY_PREFIX}${bill.businessId}:${bill.tableNumber}`;
  try {
    localStorage.setItem(key, JSON.stringify(bill));
  } catch {
    // fallback
  }
}
