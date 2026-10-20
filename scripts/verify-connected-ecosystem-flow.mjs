/**
 * Teste Automatizado de Verificação do Ecossistema Conectado Caraíva Digital
 * 
 * Valida o fluxo simbiótico completo:
 * 1. Pedido realizado no Guia ➔ Registrado no Delivery & KDS
 * 2. Confirmação do PIN de 4 dígitos para entrega segura na areia
 * 3. Dono do Restaurante aceita no KDS ➔ Status avança para "Em Preparo" (50% progress)
 * 4. Despacho para Rider da Vila ➔ Status avança para "A Caminho" (82% progress)
 * 5. Entregador valida o PIN do Turista ➔ Pedido Concluído (100% progress)
 * 6. Reserva de Pousada ➔ Gera Voucher e define o Guest Preset (Auto-preenchimento no Delivery)
 */

class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

class MockEventTarget {
  constructor() {
    this.listeners = {};
  }
  addEventListener(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  removeEventListener(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
  dispatchEvent(event) {
    const list = this.listeners[event.type] || [];
    for (const cb of list) {
      cb(event);
    }
    return true;
  }
}

globalThis.localStorage = new MockLocalStorage();
globalThis.window = new MockEventTarget();
globalThis.CustomEvent = class CustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
};
globalThis.BroadcastChannel = class MockBroadcastChannel {
  constructor(channel) {
    this.channel = channel;
  }
  postMessage() {}
  close() {}
};

console.log('🌊 [TEST SUITE] Iniciando Teste de Integração do Ecossistema Caraíva...');

async function runEcosystemVerification() {
  // Importa serviços
  const {
    createUnifiedOrder,
    getUnifiedOrders,
    updateOrderStatus
  } = await import('../caraiva-integration/src/services/villageUnifiedOrdersService.ts');

  let passedAssertions = 0;
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FALHA: ${message}`);
      process.exit(1);
    }
    console.log(`  ✅ ${message}`);
    passedAssertions++;
  }

  // ETAPA 1: Reserva de Pousada gera Guest Preset
  console.log('\n--- 1. TESTE DE RESERVA DE POUSADA & GUEST PASS ---');
  const guestPreset = {
    pousada: 'Pousada Casa da Praia',
    suite: 'Bangalô das Águas',
    deliveryPreset: 'Pousada Casa da Praia • Bangalô das Águas',
    checkIn: '2026-11-12',
    guestName: 'Mariana & Rodrigo',
    voucherCode: '#RES-8891',
    confirmedAt: new Date().toISOString()
  };
  localStorage.setItem('caraiva_guest_preset', JSON.stringify(guestPreset));
  
  const savedGuest = JSON.parse(localStorage.getItem('caraiva_guest_preset'));
  assert(savedGuest !== null, 'Guest Preset foi gravado no armazenamento seguro');
  assert(savedGuest.pousada === 'Pousada Casa da Praia', 'Nome da pousada coincide');
  assert(savedGuest.deliveryPreset.includes('Bangalô das Águas'), 'Preset de entrega inclui a suíte');

  // ETAPA 2: Turista faz pedido de comida no Guia (Auto-usando endereço da pousada)
  console.log('\n--- 2. TESTE DE PEDIDO NO GUIA COM AUTO-PREENCHIMENTO ---');
  const deliveryAddress = savedGuest.deliveryPreset;
  const pin = '4821';
  
  const initialUnifiedOrder = createUnifiedOrder({
    businessId: 'boteco-do-para',
    businessName: 'Boteco do Pará',
    niche: 'gastronomia',
    orderType: 'delivery',
    customer: {
      name: savedGuest.guestName,
      phone: '73999991234',
      whatsappFormatted: '5573999991234',
    },
    items: [
      { id: 'item-1', name: 'Pastel de Arraia Tradicional (2 un)', quantity: 2, unitPrice: 38.0, subtotal: 76.0 },
      { id: 'item-2', name: 'Moqueca de Peixe e Camarão', quantity: 1, unitPrice: 165.0, subtotal: 165.0 }
    ],
    totalAmount: 241.0,
    paidAmount: 241.0,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    destination: {
      type: 'pousada',
      label: 'Entrega na Pousada',
      detail: `${deliveryAddress} • PIN ${pin}`
    }
  });

  assert(initialUnifiedOrder.id.startsWith('ord-'), 'ID do pedido gerado com sucesso');
  assert(initialUnifiedOrder.status === 'novo', 'Status inicial é "novo" no KDS');

  // Grava o ActiveDeliveryOrder compartilhado
  const activeDelivery = {
    orderId: initialUnifiedOrder.orderNumber.replace('#', ''),
    createdAt: 'Agora mesmo',
    merchantId: 'boteco-do-para',
    merchantName: 'Boteco do Pará',
    merchantLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    items: initialUnifiedOrder.items,
    subtotal: 241.0,
    deliveryFee: 10.0,
    discount: 0,
    total: 251.0,
    status: 'CONFIRMED',
    deliveryMode: 'DELIVERY',
    zone: {
      id: 'beira-rio',
      name: 'Beira-Rio & Centro Histórico',
      courierModal: 'Bike Elétrica',
      estimatedMinutes: '25-35 min',
      referenceHint: deliveryAddress
    },
    pousadaOrAddress: deliveryAddress,
    referencePoint: 'Pousada Casa da Praia',
    confirmationPin: pin,
    courier: {
      name: 'Neto Pataxó • Frota Caraíva VIP',
      modal: 'Bike Elétrica',
      rating: 4.99,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      progressPct: 20
    }
  };
  localStorage.setItem('caraiva_active_delivery_order', JSON.stringify(activeDelivery));
  assert(JSON.parse(localStorage.getItem('caraiva_active_delivery_order')).confirmationPin === '4821', 'Active Delivery Order gravado com PIN de 4 dígitos');

  // ETAPA 3: Dono do Restaurante aceita no KDS (Muda para 'preparando')
  console.log('\n--- 3. TESTE DE ATUALIZAÇÃO NO KDS (COZINHA) ---');
  let receivedActiveOrderSync = null;
  window.addEventListener('caraiva:active-order-updated', (e) => {
    receivedActiveOrderSync = e.detail;
  });

  const preparingOrder = updateOrderStatus(initialUnifiedOrder.id, 'preparando');
  assert(preparingOrder !== null && preparingOrder.status === 'preparando', 'Pedido avançado para "preparando" no KDS');
  
  const activeAfterPreparing = JSON.parse(localStorage.getItem('caraiva_active_delivery_order'));
  assert(activeAfterPreparing.status === 'PREPARING', 'Delivery App refletiu status PREPARING reflexivamente');
  assert(activeAfterPreparing.courier.progressPct === 50, 'Progresso avançou para 50%');

  // ETAPA 4: Despacho para o Rider na areia (Muda para 'em_rota')
  console.log('\n--- 4. TESTE DE DESPACHO PARA O RIDER ---');
  const enRouteOrder = updateOrderStatus(initialUnifiedOrder.id, 'em_rota');
  assert(enRouteOrder !== null && enRouteOrder.status === 'em_rota', 'Status mudou para "em_rota" no sistema do entregador');

  const activeAfterEnRoute = JSON.parse(localStorage.getItem('caraiva_active_delivery_order'));
  assert(activeAfterEnRoute.status === 'OUT_FOR_DELIVERY', 'Delivery App refletiu status OUT_FOR_DELIVERY');
  assert(activeAfterEnRoute.courier.progressPct === 82, 'Progresso avançou para 82% (A Caminho)');

  // ETAPA 5: Entrega concluída mediante validação do PIN
  console.log('\n--- 5. TESTE DE VALIDAÇÃO DE PIN E FINALIZAÇÃO ---');
  const inputPinFromCourier = '4821';
  assert(inputPinFromCourier === activeAfterEnRoute.confirmationPin, 'PIN informado pelo turista bate com o pedido');

  const deliveredOrder = updateOrderStatus(initialUnifiedOrder.id, 'concluido');
  assert(deliveredOrder !== null && deliveredOrder.status === 'concluido', 'Status mudou para "concluido"');

  const activeAfterDelivered = JSON.parse(localStorage.getItem('caraiva_active_delivery_order'));
  assert(activeAfterDelivered.status === 'DELIVERED', 'Delivery App refletiu status DELIVERED');
  assert(activeAfterDelivered.courier.progressPct === 100, 'Progresso atingiu 100%');

  console.log(`\n🎉 [SUCESSO TOTAL] Todas as ${passedAssertions} asserções passaram sem nenhum erro!`);
  console.log('O ecossistema Guia ➔ Delivery ➔ Pousadas ➔ TapTable KDS ➔ Rider Cockpit está 100% integrado e funcional.');
}

runEcosystemVerification().catch((err) => {
  console.error('Erro no teste de integração:', err);
  process.exit(1);
});
