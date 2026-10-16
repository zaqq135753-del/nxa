/**
 * TapTable Live Sync Service
 * Sincronização em tempo real entre o ecossistema Caraíva Digital e o sistema TapTable (NFC + Gestão de Mesas e Comandas)
 */

export interface TapTableLiveState {
  venueId: string;
  tableCount: number;
  availableTables: number;
  activeOrdersCount: number;
  currentWaitMinutes: number;
  supportsNfcTap: boolean;
  pixSplitActive: boolean;
  lastSyncedAt: string;
}

// Mock inicial inteligente sincronizado com os estabelecimentos de Caraíva
const MOCK_LIVE_VENUES: Record<string, TapTableLiveState> = {
  "boteco-do-para": {
    venueId: "boteco-do-para",
    tableCount: 22,
    availableTables: 5,
    activeOrdersCount: 17,
    currentWaitMinutes: 0,
    supportsNfcTap: true,
    pixSplitActive: true,
    lastSyncedAt: new Date().toISOString(),
  },
  "bar-da-costa": {
    venueId: "bar-da-costa",
    tableCount: 16,
    availableTables: 2,
    activeOrdersCount: 14,
    currentWaitMinutes: 10,
    supportsNfcTap: true,
    pixSplitActive: true,
    lastSyncedAt: new Date().toISOString(),
  },
  "canto-da-duca": {
    venueId: "canto-da-duca",
    tableCount: 12,
    availableTables: 4,
    activeOrdersCount: 8,
    currentWaitMinutes: 0,
    supportsNfcTap: true,
    pixSplitActive: true,
    lastSyncedAt: new Date().toISOString(),
  },
  "forro-do-ourico": {
    venueId: "forro-do-ourico",
    tableCount: 30,
    availableTables: 12,
    activeOrdersCount: 45,
    currentWaitMinutes: 5,
    supportsNfcTap: true,
    pixSplitActive: true,
    lastSyncedAt: new Date().toISOString(),
  },
  "restaurante-do-mora": {
    venueId: "restaurante-do-mora",
    tableCount: 18,
    availableTables: 3,
    activeOrdersCount: 15,
    currentWaitMinutes: 15,
    supportsNfcTap: true,
    pixSplitActive: true,
    lastSyncedAt: new Date().toISOString(),
  },
  "mangalada": {
    venueId: "mangalada",
    tableCount: 14,
    availableTables: 6,
    activeOrdersCount: 8,
    currentWaitMinutes: 0,
    supportsNfcTap: true,
    pixSplitActive: true,
    lastSyncedAt: new Date().toISOString(),
  },
};

export class TapTableSyncService {
  private static listeners: Set<(states: Record<string, TapTableLiveState>) => void> = new Set();
  private static intervalId: number | null = null;
  private static venueStates: Record<string, TapTableLiveState> = { ...MOCK_LIVE_VENUES };

  /**
   * Obtém o estado das mesas de um estabelecimento específico
   */
  public static getLiveTableStatus(businessId: string): TapTableLiveState {
    if (!this.venueStates[businessId]) {
      // Fallback dinâmico determinístico para qualquer estabelecimento
      const hash = businessId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const total = 10 + (hash % 12);
      const available = (hash % 6);
      return {
        venueId: businessId,
        tableCount: total,
        availableTables: available,
        activeOrdersCount: total - available,
        currentWaitMinutes: available === 0 ? 15 : 0,
        supportsNfcTap: true,
        pixSplitActive: true,
        lastSyncedAt: new Date().toISOString(),
      };
    }
    return this.venueStates[businessId];
  }

  /**
   * Inscreve-se para atualizações em tempo real do TapTable (Supabase Realtime ou Mock Polling)
   */
  public static subscribeToLiveTables(
    callback: (states: Record<string, TapTableLiveState>) => void
  ): () => void {
    this.listeners.add(callback);
    callback(this.venueStates);

    if (!this.intervalId && typeof window !== "undefined") {
      this.intervalId = window.setInterval(() => {
        // Simula micro-oscilações no status de mesas em tempo real
        const keys = Object.keys(this.venueStates);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const current = this.venueStates[randomKey];
        if (current) {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const nextAvailable = Math.max(0, Math.min(current.tableCount, current.availableTables + delta));
          this.venueStates = {
            ...this.venueStates,
            [randomKey]: {
              ...current,
              availableTables: nextAvailable,
              activeOrdersCount: current.tableCount - nextAvailable,
              currentWaitMinutes: nextAvailable === 0 ? 15 : 0,
              lastSyncedAt: new Date().toISOString(),
            },
          };
          this.notifyListeners();
        }
      }, 12000);
    }

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0 && this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach((cb) => cb(this.venueStates));
  }

  /**
   * Gera o deep-link ou payload NFC para o TapTable
   */
  public static generateNfcDeepLink(businessId: string, tableNumber?: number): string {
    const tableParam = tableNumber ? `&table=${tableNumber}` : "";
    return `https://taptable.app/c/${businessId}?source=caraiva.digital${tableParam}`;
  }

  /**
   * Executa divisão autônoma Pix Split entre parceiro local e taxa do ecossistema
   */
  public static async processInstantPixSplit(
    _orderId: string,
    splitBreakdown: { partnerShare: number; platformShare: number }
  ): Promise<{ success: boolean; txHash: string; message: string }> {
    // Simula liquidação via Banco Central / BACEN Pix Instantâneo
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = `pix_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        resolve({
          success: true,
          txHash,
          message: `Split Pix de R$ ${(splitBreakdown.partnerShare + splitBreakdown.platformShare).toFixed(2)} liquidado instantaneamente.`,
        });
      }, 650);
    });
  }
}
