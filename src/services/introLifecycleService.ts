/**
 * Smart Intro & Onboarding Lifecycle Controller
 * Garante que a Intro 3D e o Tour inicial apareçam APENAS:
 * 1. No primeiro acesso absoluto de um novo visitante;
 * 2. Quando houver uma grande virada de temporada/versão após inatividade (> 14 dias);
 * 3. Quando o usuário clicar manualmente no botão "Rever Intro" (Sol) no cabeçalho.
 *
 * Nunca repete ao dar F5 (reload), mesmo que a URL tivesse ?intro=1 antes.
 */

export const CURRENT_INTRO_SEASON = "2026.10-verao";
const INTRO_STATE_KEY = "caraiva_intro_lifecycle_v2";
const LEGACY_INTRO_KEY = "caraiva_intro_seen_v1";
const TOUR_ISLAND_KEY = "caraiva:tour_island_v1";
const COOKIE_NAME = "caraiva_intro_seen";
const INACTIVITY_DAYS_FOR_SEASON_REPLAY = 14;

export type IntroTriggerReason =
  | "first_visit"
  | "season_update"
  | "manual_replay"
  | "suppressed_seen"
  | "suppressed_reload"
  | "suppressed_deep_link"
  | "suppressed_returning_user";

export interface IntroLifecycleState {
  seen: boolean;
  seasonVersion: string;
  firstSeenAt: string;
  lastSeenAt: string;
  timesShown: number;
}

function hasCookieSeen(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((item) => item.trim().startsWith(`${COOKIE_NAME}=1`));
}

function setCookieSeen(): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${COOKIE_NAME}=1; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignora restrições de cookie
  }
}

function isBrowserPageReload(): boolean {
  if (typeof window === "undefined" || typeof performance === "undefined") return false;
  try {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (entries && entries.length > 0) {
      return entries[0].type === "reload" || entries[0].type === "back_forward";
    }
  } catch {
    // Fallback silencioso
  }
  return false;
}

/**
 * Verifica se o usuário já possui pegadas reais de uso no ecossistema
 * (favoritos, pedidos de delivery, preferências de guia ou sessão ativa).
 */
function hasExistingEcosystemFootprint(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(LEGACY_INTRO_KEY) === "true") return true;
    if (localStorage.getItem(LEGACY_INTRO_KEY) === "true") return true;
    if (hasCookieSeen()) return true;

    const existingKeys = [
      "caraiva_favorites_v1",
      "caraiva:welcome:v1",
      "caraiva_unified_orders_v1",
      "caraiva_first_visit_date",
    ];
    return existingKeys.some((k) => Boolean(localStorage.getItem(k)));
  } catch {
    return false;
  }
}

export function readIntroLifecycleState(): IntroLifecycleState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(INTRO_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IntroLifecycleState>;
    if (typeof parsed.seen !== "boolean") return null;
    return {
      seen: parsed.seen,
      seasonVersion: parsed.seasonVersion || CURRENT_INTRO_SEASON,
      firstSeenAt: parsed.firstSeenAt || new Date().toISOString(),
      lastSeenAt: parsed.lastSeenAt || new Date().toISOString(),
      timesShown: typeof parsed.timesShown === "number" ? parsed.timesShown : 1,
    };
  } catch {
    return null;
  }
}

/**
 * Grava imediatamente em TODAS as camadas (localStorage, sessionStorage e Cookie)
 * que o usuário já viu a intro, além de limpar ?intro=1 da URL para evitar loop no F5.
 */
export function markIntroAsSeen(): void {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();

  try {
    const prev = readIntroLifecycleState();
    const nextState: IntroLifecycleState = {
      seen: true,
      seasonVersion: CURRENT_INTRO_SEASON,
      firstSeenAt: prev?.firstSeenAt || now,
      lastSeenAt: now,
      timesShown: (prev?.timesShown || 0) + 1,
    };

    localStorage.setItem(INTRO_STATE_KEY, JSON.stringify(nextState));
    localStorage.setItem(LEGACY_INTRO_KEY, "true");
    if (!localStorage.getItem("caraiva_first_visit_date")) {
      localStorage.setItem("caraiva_first_visit_date", now);
    }
  } catch {
    // Fallback caso localStorage esteja bloqueado
  }

  try {
    sessionStorage.setItem(LEGACY_INTRO_KEY, "true");
  } catch {
    // Ignora
  }

  setCookieSeen();
  stripIntroParamsFromUrl();
}

/**
 * Remove ?intro=... e ?tour=... da barra de endereço sem recarregar a página,
 * garantindo que um F5 futuro nunca reexecute o parâmetro.
 */
export function stripIntroParamsFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    let mutated = false;
    if (url.searchParams.has("intro")) {
      url.searchParams.delete("intro");
      mutated = true;
    }
    if (url.searchParams.has("tour")) {
      url.searchParams.delete("tour");
      mutated = true;
    }
    if (mutated) {
      window.history.replaceState(window.history.state, "", url.toString());
    }
  } catch {
    // Ignora
  }
}

/**
 * Decide de forma inteligente se a Intro deve abrir na montagem do /guia.
 */
export function evaluateShouldShowIntro(): {
  shouldShow: boolean;
  reason: IntroTriggerReason;
} {
  if (typeof window === "undefined") {
    return { shouldShow: false, reason: "suppressed_seen" };
  }

  const params = new URLSearchParams(window.location.search);
  const introParam = params.get("intro");

  // 1. Supressão explícita via URL (?intro=0 ou ?intro=false)
  if (introParam === "0" || introParam === "false") {
    markIntroAsSeen();
    return { shouldShow: false, reason: "suppressed_seen" };
  }

  // 2. Pedido explícito via URL (?intro=1), MAS somente se NÃO for um F5 (reload)!
  if (introParam === "1" || introParam === "true") {
    stripIntroParamsFromUrl();
    if (isBrowserPageReload()) {
      markIntroAsSeen();
      return { shouldShow: false, reason: "suppressed_reload" };
    }
    markIntroAsSeen();
    return { shouldShow: true, reason: "manual_replay" };
  }

  // 3. Se o usuário entrou direto em uma aba específica (ex: /guia?tab=mapa), não bloqueia com intro
  const tabParam = params.get("tab");
  if (tabParam && tabParam !== "inicio") {
    markIntroAsSeen();
    return { shouldShow: false, reason: "suppressed_deep_link" };
  }

  // 4. Se o carregamento atual é um Reload (F5 / Ctrl+R / Pull-to-refresh), NUNCA bloqueia com intro!
  const state = readIntroLifecycleState();
  const hasFootprint = hasExistingEcosystemFootprint();

  if (isBrowserPageReload()) {
    markIntroAsSeen();
    return { shouldShow: false, reason: "suppressed_reload" };
  }

  // 5. Verifica se já viu a intro antes
  if (state?.seen || hasFootprint) {
    // Só reapresenta automaticamente se mudou a temporada E o usuário ficou > 14 dias sem entrar
    if (state && state.seasonVersion !== CURRENT_INTRO_SEASON) {
      const lastSeenMs = Date.parse(state.lastSeenAt);
      const daysSinceLastSeen = Number.isNaN(lastSeenMs)
        ? 0
        : (Date.now() - lastSeenMs) / (1000 * 60 * 60 * 24);

      if (daysSinceLastSeen >= INACTIVITY_DAYS_FOR_SEASON_REPLAY) {
        markIntroAsSeen();
        return { shouldShow: true, reason: "season_update" };
      }
    }

    // Garante que o novo formato v2 esteja sincronizado
    if (!state?.seen) {
      markIntroAsSeen();
    }
    return { shouldShow: false, reason: "suppressed_returning_user" };
  }

  // 6. Primeiro visitante genuíno! Marca imediatamente como visto para não repetir em caso de F5
  markIntroAsSeen();
  return { shouldShow: true, reason: "first_visit" };
}

/**
 * Decide se a ilha de tour (CaraivaDynamicTourIsland) deve abrir automaticamente.
 * Só abre 1 única vez no primeiro acesso ou quando acionado pelo botão do header.
 */
export function evaluateShouldShowTourIsland(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const tourParam = params.get("tour");

  if (tourParam === "1" || tourParam === "true") {
    stripIntroParamsFromUrl();
    if (isBrowserPageReload()) return false;
    markTourIslandAsSeen();
    return true;
  }

  try {
    if (localStorage.getItem(TOUR_ISLAND_KEY)) {
      return false;
    }
    // Se for reload de página, não abre o tour sozinho
    if (isBrowserPageReload()) {
      markTourIslandAsSeen();
      return false;
    }
    // Marca imediatamente na 1ª abertura para nunca mais repetir no F5
    markTourIslandAsSeen();
    return true;
  } catch {
    return false;
  }
}

export function markTourIslandAsSeen(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOUR_ISLAND_KEY, "completed");
  } catch {
    // Ignora
  }
}
