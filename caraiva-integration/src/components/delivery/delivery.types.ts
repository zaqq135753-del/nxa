export type DeliveryZoneId = "beira-rio" | "praia-barra" | "centro-igreja" | "xando" | "aldeia";

export interface DeliveryZone {
  id: DeliveryZoneId;
  name: string;
  referenceHint: string;
  baseFee: number;
  estimatedMinutes: string;
  courierModal: "Bike Cargueira" | "A Pé pela Areia" | "Carroça / Quadriciclo";
}

export interface ProductOptionItem {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  id: string;
  title: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: ProductOptionItem[];
}

export interface DeliveryMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  serves?: string;
  prepTime?: string;
  isPopular?: boolean;
  optionGroups?: ProductOptionGroup[];
}

export interface DeliveryMerchant {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: number; // 0 = Grátis
  minOrder: number;
  isOpen: boolean;
  isSuperMerchant?: boolean;
  promoTag?: string;
  coverImage: string;
  logoImage: string;
  addressZone: string;
  menuCategories: string[];
  menu: DeliveryMenuItem[];
}

export interface CartItemSelection {
  cartItemId: string;
  merchantId: string;
  merchantName: string;
  menuItem: DeliveryMenuItem;
  quantity: number;
  selectedOptions: {
    groupTitle: string;
    optionName: string;
    price: number;
  }[];
  notes: string;
  unitTotal: number;
  lineTotal: number;
}

export type DeliveryOrderStatus = "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED";

export interface ActiveDeliveryOrder {
  orderId: string;
  createdAt: string;
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  items: CartItemSelection[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: DeliveryOrderStatus;
  deliveryMode: "DELIVERY" | "PICKUP";
  zone: DeliveryZone;
  pousadaOrAddress: string;
  referencePoint: string;
  confirmationPin: string; // 4 dígitos estilo iFood
  courier: {
    name: string;
    modal: string;
    rating: number;
    avatar: string;
    progressPct: number;
  };
}

export interface DeliveryCoupon {
  code: string;
  title: string;
  description: string;
  discountAmount: number;
  minOrderValue: number;
  expiresIn: string;
}
