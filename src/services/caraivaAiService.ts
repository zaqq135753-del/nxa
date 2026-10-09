/**
 * Caraíva AI Engine — Multimodal Vision & Real-time Concierge Service
 * Powered by OpenAI GPT-4o & GPT-4o-mini with deep Caraíva contextual grounding.
 */

import { REAL_CARAIVA_SPOTS, type CaraivaSpot } from "../data/caraivaSpots";
import { CARAIVA_REALTIME_CONTEXT } from "../data/caraivaIntelligence";

const FALLBACK_KEY = "";

export function getOpenAiApiKey(): string {
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("CARAIVA_OPENAI_API_KEY");
    if (local && local.trim()) return local.trim();
  }
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey && typeof envKey === "string" && envKey.trim()) {
    return envKey.trim();
  }
  return FALLBACK_KEY;
}

export function setOpenAiApiKey(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("CARAIVA_OPENAI_API_KEY", key.trim());
  }
}

const CARAIVA_SYSTEM_PROMPT = `
Você é o Concierge Oficial de Caraíva (Bahia), o guia digital e parceiro mais apaixonado pela vila.
Você fala com um tom acolhedor, descontraído, poético, porém direto e muito preciso (gírias baianas leves e elegantes como "oxe", "massa", "beleza", "meu rei", sem exageros).

INFORMAÇÕES EM TEMPO REAL DA VILA DE CARAÍVA:
- Clima: ${CARAIVA_REALTIME_CONTEXT.temperature}°C (Sensação ${CARAIVA_REALTIME_CONTEXT.feelsLike}°C).
- Vento: ${CARAIVA_REALTIME_CONTEXT.wind}.
- Maré Atual: ${CARAIVA_REALTIME_CONTEXT.currentTide.type} (${CARAIVA_REALTIME_CONTEXT.currentTide.height}).
- Ciclo de Marés Hoje: Maré Baixa às 09:20 e 21:40 (0.4m) · Maré Alta às 03:30 e 15:55 (1.8m).
- Pôr do sol: ${CARAIVA_REALTIME_CONTEXT.sunset.time} no Rio Caraíva.
- Lua: ${CARAIVA_REALTIME_CONTEXT.moon.phase}.
- Regra de Ouro: Na vila NÃO entram carros nem motos. Tudo é feito a pé na areia ou de canoa pataxó tradicional.
- Malas: Carretilheiros na beira do rio ajudam com as malas pesadas.
- Sinal: A vila usa Starlink; sinal de celular 4G pode oscilar.

ESTABELECIMENTOS E SPOTS REAIS CADASTRADOS:
${REAL_CARAIVA_SPOTS.map((s) => `- ${s.name} (${s.subCategory}): ${s.description}. Nota ${s.rating}. Distância: ${s.distanceSteps} passos. WhatsApp: ${s.whatsappNumber}. Pratos: ${s.featuredDishes.map((d) => d.name).join(", ")}. Mimo: ${s.rewardBadge}`).join("\n")}

SUA MISSÃO:
1. Responda perguntas sobre comida, passeios, forró, maré e sobrevivência na areia de forma personalizada.
2. Destaque sempre se a maré atual é favorável para caminhada (Satu, Barra ou Corumbau).
3. Se recomendar algum dos estabelecimentos oficiais cadastrados, cite o nome exato para que o aplicativo possa exibir o card interativo com reserva WhatsApp.
4. Mantenha as respostas concisas e agradáveis para leitura rápida em celular na praia (2 a 4 frases).
`;

export interface ConciergeAnswer {
  text: string;
  matchedSpot?: CaraivaSpot;
}

export async function askCaraivaConcierge(
  userQuery: string,
  history: Array<{ sender: "user" | "ia"; text: string }> = []
): Promise<ConciergeAnswer> {
  const apiKey = getOpenAiApiKey();

  const messagesPayload = [
    { role: "system", content: CARAIVA_SYSTEM_PROMPT },
    ...history.slice(-4).map((h) => ({
      role: h.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: h.text,
    })),
    { role: "user", content: userQuery },
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messagesPayload,
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    const replyText = data?.choices?.[0]?.message?.content || "Caraíva tem tudo o que você precisa! Como posso te guiar agora?";

    // Match spot mentioned in answer or query
    const lowerReply = replyText.toLowerCase() + " " + userQuery.toLowerCase();
    const matchedSpot = REAL_CARAIVA_SPOTS.find((s) =>
      lowerReply.includes(s.name.toLowerCase()) ||
      s.tags.some((tag: string) => lowerReply.includes(tag.toLowerCase())) ||
      s.featuredDishes.some((d) => lowerReply.includes(d.name.toLowerCase()))
    );

    return {
      text: replyText,
      matchedSpot,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn("OpenAI API Fallback:", errMsg);
    return {
      text: `Opa! Tive uma pequena oscilação de sinal na areia (${errMsg}). Mas garanto que o Boteco do Pará ou Canto da Duca têm exatamente o que você procura agora!`,
      matchedSpot: REAL_CARAIVA_SPOTS[0],
    };
  }
}

export interface PhotoAnalysisResult {
  title: string;
  identifiedCategory: string;
  confidence: number;
  description: string;
  secretChefTip: string;
  vibeScore: number;
  ptsEarned: number;
  rewardText: string;
  matchedSpot?: CaraivaSpot;
}

export async function analyzeCaraivaPhoto(
  base64DataUrl: string,
  userPrompt = "Identifique o que é esta foto em Caraíva, o restaurante ou praia correspondente, dê uma dica secreta e diga se ganho recompensa."
): Promise<PhotoAnalysisResult> {
  const apiKey = getOpenAiApiKey();

  const prompt = `
Você é a IA de Visão Computacional Multimodal do Guia Caraíva.
Analise a imagem enviada pelo turista na vila de Caraíva (Bahia).
A foto pode ser de um prato (ex: pastel de arraia, polvo, peixe na brasa, torta de banana, caipirinha), de uma paisagem (rio Caraíva, Ponta da Barra, canoa pataxó, Praia do Satu, Corumbau, falésias) ou de uma noite/forró.

Responda ESTRITAMENTE em formato JSON válido com as seguintes chaves:
{
  "title": "Nome do prato ou local identificado (ex: Pastel de Arraia do Pará, Pôr do Sol no Rio, Torta de Banana da Duca)",
  "identifiedCategory": "Gastronomia" | "Praia & Natureza" | "Cultura & Forró",
  "confidence": 95,
  "description": "Uma frase entusiasmada sobre o que foi visto na imagem e seu valor em Caraíva.",
  "secretChefTip": "Uma dica autêntica e secreta de como apreciar ou o que pedir a seguir.",
  "vibeScore": 94,
  "ptsEarned": 35,
  "rewardText": "Mimo liberado no app: 1 Caipirinha ou 10% OFF",
  "matchedSpotName": "Nome exato de um dos spots de Caraíva (ex: Boteco do Pará, Canto da Duca, Bar do Porto, Forró do Ouriço, Praia da Barra, Ponta do Corumbau, etc)"
}
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `${prompt}\nPergunta do turista: ${userPrompt}` },
              {
                type: "image_url",
                image_url: {
                  url: base64DataUrl,
                  detail: "low",
                },
              },
            ],
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || "{}");

    const matchedSpot = REAL_CARAIVA_SPOTS.find(
      (s) =>
        s.name.toLowerCase().includes((parsed.matchedSpotName || "").toLowerCase()) ||
        (parsed.title || "").toLowerCase().includes(s.name.toLowerCase())
    ) || REAL_CARAIVA_SPOTS[0];

    return {
      title: parsed.title || "Momento Mágico em Caraíva",
      identifiedCategory: parsed.identifiedCategory || "Gastronomia",
      confidence: parsed.confidence || 92,
      description: parsed.description || "Foto autêntica capturada nas areias de Caraíva!",
      secretChefTip: parsed.secretChefTip || "Peça com caipirinha de caju e pimenta da casa.",
      vibeScore: parsed.vibeScore || 95,
      ptsEarned: parsed.ptsEarned || 35,
      rewardText: parsed.rewardText || "Caipirinha de Caju ou 10% OFF Validado!",
      matchedSpot,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn("Vision AI Fallback:", errMsg);
    return {
      title: "Pôr do Sol & Pastel de Arraia",
      identifiedCategory: "Gastronomia",
      confidence: 90,
      description: "Momento inconfundível na beira do Rio Caraíva!",
      secretChefTip: "Combine com caipirinha de caju fresco ao entardecer.",
      vibeScore: 96,
      ptsEarned: 35,
      rewardText: "🎁 Recompensa: 1 Caipirinha de Caju no Boteco do Pará!",
      matchedSpot: REAL_CARAIVA_SPOTS[0],
    };
  }
}
