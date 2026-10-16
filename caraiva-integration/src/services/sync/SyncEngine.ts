/**
 * CARAÍVA DIGITAL — DATA SYNCHRONIZATION & MULTITENANT ARCHITECTURE
 * 
 * Camada de abstração que unifica o Painel do Parceiro com o Guia Público,
 * estruturada para integração com Supabase (Auth, RLS, Storage).
 */

export type ContentStatus = 'draft' | 'under_review' | 'approved' | 'published' | 'archived';

export interface PartnerPost {
  id: string;
  businessId: string;
  title: string;
  content: string;
  mediaUrl: string;
  type: 'post' | 'story' | 'oferta' | 'evento';
  status: ContentStatus;
  createdAt: string;
  publishedAt?: string;
  expiresAt?: string;
  metrics: {
    views: number;
    clicks: number;
    whatsappLeads: number;
    saves: number;
  };
}

export interface SyncEngineState {
  businessId: string;
  posts: PartnerPost[];
  lastSyncedAt: string;
  isOnline: boolean;
}

const LOCAL_STORAGE_POSTS_KEY = 'caraiva:partner_posts_store';

export const SyncEngine = {
  /**
   * Salva ou publica um novo conteúdo criado pelo parceiro
   */
  publishContent(post: Omit<PartnerPost, 'id' | 'createdAt' | 'metrics'>): PartnerPost {
    const newPost: PartnerPost = {
      ...post,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      publishedAt: post.status === 'published' ? new Date().toISOString() : undefined,
      metrics: {
        views: 0,
        clicks: 0,
        whatsappLeads: 0,
        saves: 0,
      },
    };

    const existing = SyncEngine.getAllPosts();
    const updated = [newPost, ...existing];
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(updated));

    // Dispara evento para sincronização em tempo real na aba do turista
    window.dispatchEvent(new CustomEvent('caraiva:content-published', { detail: newPost }));

    return newPost;
  },

  /**
   * Retorna todos os posts do armazenamento local/cache
   */
  getAllPosts(): PartnerPost[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Retorna os posts aprovados/publicados de um estabelecimento para exibir no Guia Público
   */
  getPublicPostsForBusiness(businessId: string): PartnerPost[] {
    return SyncEngine.getAllPosts().filter(
      (p) => p.businessId === businessId && p.status === 'published'
    );
  },

  /**
   * Assistente de IA para geração de Copy e Sugestão de Stories
   */
  generateAiContentSuggestion(businessName: string, _category?: string, _vibe?: string) {
    const suggestions = [
      {
        title: `Pôr do Sol no ${businessName}`,
        copy: `Hoje a maré está perfeita e a vila tá mágica! 🌅 Venha curtir o final de tarde no ${businessName} com nossa energia pé na areia e drinks frescos.`,
        type: 'story' as const,
        suggestedHour: '16:30 às 18:00',
      },
      {
        title: `Prato Destaque da Semana`,
        copy: `Sabor autêntico da Bahia com tempero local de Caraíva. 🍽️ Ingredientes selecionados e atendimento acolhedor esperando por você.`,
        type: 'post' as const,
        suggestedHour: '11:30 às 13:00',
      },
      {
        title: `Oferta Relâmpago Caraíva Digital`,
        copy: `Mostre este story do Guia Caraíva Digital e ganhe uma água de coco ou cortesia na sua reserva hoje! 🌴`,
        type: 'oferta' as const,
        suggestedHour: 'Próximas 2 horas',
      },
    ];

    return suggestions;
  },
};
