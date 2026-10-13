/**
 * Caraíva Digital — Concierge Provider Adapter
 * Padrão Strategy/Adapter para o Concierge Inteligente de Caraíva.
 * Permite alternar entre o Provedor Determinístico Local e Provedores LLM Reais no futuro.
 */

import { CARAIVA_BUSINESSES, type Business } from "../data/caraivaDigitalData";

export interface ConciergeStep {
  time: string;
  title: string;
  business?: Business;
  description: string;
  estimatedCost: string;
  distanceTime: string;
  ctaLabel: string;
}

export interface ConciergePlan {
  headline: string;
  budgetTotal: string;
  vibe: string;
  steps: ConciergeStep[];
  localTip: string;
}

export interface ConciergeQuery {
  budget?: number;
  mood: "romantico" | "economico" | "festa_forro" | "natureza_relax" | "gastronomico";
  timeOfDay: "manha" | "tarde" | "noite" | "dia_completo";
  companions: "casal" | "amigos" | "solo" | "familia";
}

export interface ConciergeProvider {
  createItinerary(query: ConciergeQuery): Promise<ConciergePlan>;
}

/**
 * Provedor Canônico Local de Caraíva (Mock Concierge Provider)
 * Constrói roteiros autênticos sem inventar dados ou simular IA falsa.
 */
export class MockConciergeProvider implements ConciergeProvider {
  async createItinerary(query: ConciergeQuery): Promise<ConciergePlan> {
    // Simula pequena latência perceptiva realista (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const para = CARAIVA_BUSINESSES.find((b) => b.id === "boteco-do-para");
    const duca = CARAIVA_BUSINESSES.find((b) => b.id === "canto-da-duca");
    const porto = CARAIVA_BUSINESSES.find((b) => b.id === "bar-do-porto");
    const ourico = CARAIVA_BUSINESSES.find((b) => b.id === "forro-do-ourico");
    const culinaria = CARAIVA_BUSINESSES.find((b) => b.id === "culinaria-central");

    if (query.mood === "romantico" || query.companions === "casal") {
      return {
        headline: "Noite Romântica Inesquecível a Dois em Caraíva",
        budgetTotal: "Aprox. R$ 280 - R$ 380 para o casal",
        vibe: "Luz de velas, jazz suave, marulho do rio e brisa na amendoeira",
        localTip: "Chegue no Boteco do Pará às 16h45 para pegar a mesa da ponta do deck na hora que o sol toca a água.",
        steps: [
          {
            time: "17:00",
            title: "Pôr do Sol Mágico no Deck do Rio",
            business: para,
            description: "Apreciar o pôr do sol com caipirinhas de caju e o lendário pastel crocante de arraia.",
            estimatedCost: "R$ 78 (2 drinks + 1 pastel)",
            distanceTime: "2 min a pé da foz",
            ctaLabel: "Ver no Mapa",
          },
          {
            time: "20:30",
            title: "Jantar à Luz de Velas sobre o Rio",
            business: porto,
            description: "Pizzas artesanais no forno a lenha, vinho selecionado e mesas iluminadas por velas no deck flutuante.",
            estimatedCost: "R$ 190 (Pizza + Vinho)",
            distanceTime: "3 min a pé",
            ctaLabel: "Reservar Mesa",
          },
        ],
      };
    }

    if (query.mood === "festa_forro") {
      return {
        headline: "Circuito da Noite: Samba, Cerveja e Forró na Areia",
        budgetTotal: "Aprox. R$ 160 - R$ 220 por pessoa",
        vibe: "Areia fofa, sanfona ao vivo até as 05h da manhã e energia contagiante",
        localTip: "Guarde energia: o forró em Caraíva só esquenta de verdade depois da meia-noite.",
        steps: [
          {
            time: "19:30",
            title: "Jantar Especial e Drinks Pré-Forró",
            business: culinaria,
            description: "Frutos do mar frescos na brasa e caipirinhas artesanais para iniciar a noite.",
            estimatedCost: "R$ 85",
            distanceTime: "3 min a pé",
            ctaLabel: "Reservar Mesa",
          },
          {
            time: "23:00",
            title: "Forró do Ouriço até o Amanhecer",
            business: ourico,
            description: "Dançar coladinho na pista de areia com os melhores sanfoneiros da Bahia.",
            estimatedCost: "R$ 60 (Ingresso) + R$ 30 (Consumo)",
            distanceTime: "6 min a pé",
            ctaLabel: "Garantir Ingresso",
          },
        ],
      };
    }

    // Default: Dia Perfeito em Caraíva
    return {
      headline: "O Roteiro Essencial: Sabores, Rio e Maré Baixa",
      budgetTotal: "Aprox. R$ 180 por pessoa",
      vibe: "Ritmo calmo, pés na areia e contato com a natureza exuberante",
      localTip: "Caminhe para a Praia da Barra 1 hora antes do pico da maré baixa para ver as piscinas naturais.",
      steps: [
        {
          time: "09:00",
          title: "Café Colonial e Torta dos Deuses",
          business: duca,
          description: "Café passado no coador de pano com pães artesanais e torta histórica de cacau puro.",
          estimatedCost: "R$ 45",
          distanceTime: "4 min a pé",
          ctaLabel: "Ver no Guia",
        },
        {
          time: "17:00",
          title: "Encontro no Boteco do Pará",
          business: para,
          description: "O momento mais clássico da vila no final da tarde.",
          estimatedCost: "R$ 60",
          distanceTime: "2 min a pé",
          ctaLabel: "Abrir no app",
        },
      ],
    };
  }
}

/**
 * Instância singleton ativa do Concierge
 */
export const activeConcierge: ConciergeProvider = new MockConciergeProvider();
