/**
 * Caraíva Digital — Real-Time Pixel & Telemetry Engine
 * 
 * Coleta anônima e contínua do comportamento do turista/lead:
 * - Telas acessadas (Home, Mapa 3D, Concierge, Perfil, Hospede)
 * - Estabelecimentos visualizados e tempo de atenção
 * - Traçado de rotas a pé
 * - Eventos de sacola e pedidos
 */

export interface TelemetryEvent {
  id: string;
  visitorId: string;
  sessionId: string;
  eventType: 'page_view' | 'business_view' | 'route_started' | 'cart_action' | 'order_completed' | 'nfc_tap';
  screen: string;
  businessId?: string;
  businessName?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

const VISITOR_KEY = 'cd_pixel_visitor_id';
const SESSION_KEY = 'cd_pixel_session_id';
const EVENTS_KEY = 'cd_pixel_events_buffer';
const LIVE_PULSE_KEY = 'cd_pixel_live_pulse';

function getOrCreateId(key: string, prefix: string): string {
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `${prefix}_fallback`;
  }
}

export function trackPixelEvent(
  eventType: TelemetryEvent['eventType'],
  screen: string,
  extra?: { businessId?: string; businessName?: string; metadata?: Record<string, any> }
) {
  if (typeof window === 'undefined') return;

  const visitorId = getOrCreateId(VISITOR_KEY, 'usr');
  const sessionId = getOrCreateId(SESSION_KEY, 'ses');

  const event: TelemetryEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    visitorId,
    sessionId,
    eventType,
    screen,
    businessId: extra?.businessId,
    businessName: extra?.businessName,
    metadata: extra?.metadata,
    timestamp: Date.now(),
  };

  try {
    // 1. Armazena buffer de eventos locais
    const raw = localStorage.getItem(EVENTS_KEY);
    const events: TelemetryEvent[] = raw ? JSON.parse(raw) : [];
    events.unshift(event);
    if (events.length > 200) events.pop(); // Mantém os últimos 200 eventos
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    // 2. Atualiza batimento cardíaco / live pulse em tempo real
    const livePulse = {
      visitorId,
      lastScreen: screen,
      activeBusiness: extra?.businessName,
      lastSeen: Date.now(),
    };
    localStorage.setItem(LIVE_PULSE_KEY, JSON.stringify(livePulse));

    // 3. Emite sinal no BroadcastChannel para o Dashboard do Admin
    const bc = new BroadcastChannel('cd_telemetry_radar');
    bc.postMessage({ type: 'EVENT', event });
    bc.close();
  } catch {
    // Silent telemetry
  }
}

// Hook de batimento para manter visitante ativo enquanto a aba estiver aberta
export function initVisitorHeartbeat(currentScreen: string) {
  if (typeof window === 'undefined') return;
  trackPixelEvent('page_view', currentScreen);

  const timer = setInterval(() => {
    trackPixelEvent('page_view', currentScreen, { metadata: { pulse: true } });
  }, 15000); // Batimento a cada 15 segundos

  return () => clearInterval(timer);
}
