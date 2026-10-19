/**
 * Módulo de Segurança & Proteção de Propriedade Intelectual
 * Caraíva Digital & TapTable Ecosystem • NXA Corp
 * 
 * Controla o Gatekeeper de Acesso por Senha (Passcode Gate),
 * prevenção contra força bruta, bloqueio de indexação e avisos de integridade.
 */

const STORAGE_KEY = 'caraiva_project_passcode_auth_v1';
const ATTEMPTS_KEY = 'caraiva_gate_failed_attempts';
const LOCKOUT_KEY = 'caraiva_gate_lockout_until';

// Chaves autorizadas para acesso ao ecossistema
const VALID_PASSCODES = new Set<string>([
  'caraiva2026',
  'nxa2026',
  'zaq2026',
  'caraiva',
  'nxa',
  'zaq',
  // Chave personalizada do .env se existir
  ...(import.meta.env.VITE_PROJECT_PASSWORD ? [String(import.meta.env.VITE_PROJECT_PASSWORD).trim().toLowerCase()] : []),
  ...(import.meta.env.VITE_SITE_ACCESS_KEY ? [String(import.meta.env.VITE_SITE_ACCESS_KEY).trim().toLowerCase()] : []),
]);

export interface SecurityStatus {
  isUnlocked: boolean;
  failedAttempts: number;
  isLockedOut: boolean;
  lockoutRemainingSeconds: number;
}

/**
 * Verifica se o projeto está desbloqueado no dispositivo atual
 */
export function isProjectUnlocked(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Verifica se foi passado parâmetro de convite/chave direto na URL
  const searchParams = new URLSearchParams(window.location.search);
  const urlKey = (
    searchParams.get('key') ||
    searchParams.get('pass') ||
    searchParams.get('senha') ||
    searchParams.get('token') ||
    searchParams.get('acesso') ||
    searchParams.get('bypass')
  )?.trim().toLowerCase();

  if (urlKey && VALID_PASSCODES.has(urlKey)) {
    // Autenticado via link VIP!
    setProjectUnlocked(true, true);
    // Limpa a chave da URL para não ficar exposta no histórico do navegador
    try {
      searchParams.delete('key');
      searchParams.delete('pass');
      searchParams.delete('senha');
      searchParams.delete('token');
      searchParams.delete('acesso');
      searchParams.delete('bypass');
      const newQuery = searchParams.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    } catch {
      // Ignora erro de manipulação de histórico
    }
    return true;
  }

  // 2. Verifica armazenamento local e de sessão
  try {
    const localAuth = localStorage.getItem(STORAGE_KEY);
    const sessionAuth = sessionStorage.getItem(STORAGE_KEY);
    const legacyBypass = sessionStorage.getItem('caraiva_maintenance_bypass') === 'true' || 
                         localStorage.getItem('caraiva_maintenance_bypass') === 'true';

    if (localAuth === 'authorized' || sessionAuth === 'authorized' || legacyBypass) {
      return true;
    }
  } catch {
    // Em caso de restrição de cookie/localStorage
  }

  return false;
}

/**
 * Salva a autorização no dispositivo
 */
export function setProjectUnlocked(unlocked: boolean, rememberDevice = true): void {
  try {
    if (unlocked) {
      if (rememberDevice) {
        localStorage.setItem(STORAGE_KEY, 'authorized');
        localStorage.setItem('caraiva_maintenance_bypass', 'true');
      } else {
        sessionStorage.setItem(STORAGE_KEY, 'authorized');
        sessionStorage.setItem('caraiva_maintenance_bypass', 'true');
      }
      // Reseta tentativas
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('caraiva_maintenance_bypass');
      sessionStorage.removeItem('caraiva_maintenance_bypass');
    }
  } catch {
    // Tratamento de sandbox
  }
}

/**
 * Valida a senha digitada pelo usuário com proteção de taxa
 */
export function validatePasscode(input: string, rememberDevice = true): { success: boolean; error?: string } {
  const status = getSecurityStatus();
  if (status.isLockedOut) {
    return {
      success: false,
      error: `Muitas tentativas incorretas. Aguarde ${status.lockoutRemainingSeconds}s para tentar novamente.`,
    };
  }

  const clean = input.trim().toLowerCase();
  if (VALID_PASSCODES.has(clean)) {
    setProjectUnlocked(true, rememberDevice);
    return { success: true };
  }

  // Registra tentativa falha
  const nextAttempts = status.failedAttempts + 1;
  localStorage.setItem(ATTEMPTS_KEY, String(nextAttempts));

  if (nextAttempts >= 5) {
    // Bloqueia temporariamente por 30 segundos
    const lockoutUntil = Date.now() + 30 * 1000;
    localStorage.setItem(LOCKOUT_KEY, String(lockoutUntil));
    return {
      success: false,
      error: 'Limite de tentativas excedido. Acesso bloqueado por 30 segundos.',
    };
  }

  return {
    success: false,
    error: `Chave de acesso incorreta (${5 - nextAttempts} tentativas restantes).`,
  };
}

/**
 * Retorna o status de segurança e tentativas
 */
export function getSecurityStatus(): SecurityStatus {
  try {
    const isUnlocked = isProjectUnlocked();
    const attemptsStr = localStorage.getItem(ATTEMPTS_KEY) || '0';
    const failedAttempts = parseInt(attemptsStr, 10) || 0;
    const lockoutUntilStr = localStorage.getItem(LOCKOUT_KEY) || '0';
    const lockoutUntil = parseInt(lockoutUntilStr, 10) || 0;
    const now = Date.now();

    const isLockedOut = lockoutUntil > now;
    const lockoutRemainingSeconds = isLockedOut ? Math.ceil((lockoutUntil - now) / 1000) : 0;

    return {
      isUnlocked,
      failedAttempts,
      isLockedOut,
      lockoutRemainingSeconds,
    };
  } catch {
    return {
      isUnlocked: false,
      failedAttempts: 0,
      isLockedOut: false,
      lockoutRemainingSeconds: 0,
    };
  }
}

/**
 * Tranca a sessão imediatamente
 */
export function lockProject(): void {
  setProjectUnlocked(false);
  window.location.reload();
}

/**
 * Inicializa defesas de console e propriedade intelectual
 */
export function initConsoleSecurityBanner(): void {
  if (typeof window === 'undefined') return;

  // Imprime aviso formal no DevTools
  try {
    console.clear();
    console.log(
      '%c🔒 CARAÍVA DIGITAL & TAPTABLE ECOSYSTEM — CÓDIGO PROPRIETÁRIO',
      'background: #090B0C; color: #F6C945; font-size: 15px; font-weight: 800; padding: 10px 14px; border-radius: 8px; border: 1px solid #F6C945;'
    );
    console.log(
      '%cAVISO LEGAL: Todo o código-fonte, arquitetura de software, modelos tridimensionais e lógica de negócios deste ecossistema são protegidos por direitos de propriedade intelectual da NXA Corp e Caraíva Digital. Qualquer tentativa de cópia, engenharia reversa, raspagem ou redistribuição sem autorização expressa é estritamente proibida.',
      'color: #94A3B8; font-size: 11px; line-height: 1.5; font-family: monospace;'
    );
  } catch {
    // Ignora restrições de console
  }
}
