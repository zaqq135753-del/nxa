/**
 * CARAÍVA DIGITAL DESIGN SYSTEM — TOKENS
 * Direção: Tech + Praiano + Cartoon Leve
 */

export const CD_COLORS = {
  // Paleta Principal: Areia & Sol da Bahia
  sand: {
    50: '#FDFBF7',
    100: '#FAF6EE',
    200: '#F4ECE0',
    300: '#E8DCC8',
    400: '#D5C4A8',
    500: '#BC9F78',
    900: '#4A3B2C',
  },

  // Água & Oceano (Turquesa & Cyan Tech)
  ocean: {
    deep: '#0D2834',   // Azul maré profunda / Texto principal
    dark: '#13394A',   // Superfícies escuras
    teal: '#0FA3A5',   // Turquesa Caraíva
    cyanGlow: '#14C2C5',
    neon: '#38BDF8',   // IA & badges tech suaves
    soft: '#E0F2FE',   // Fundo de pílulas ativas
  },

  // Calor Baiano & Restinga
  tropical: {
    coral: '#F76B52',      // Pôr do sol / Destaques
    coralSoft: '#FFEBE7',
    gold: '#F59E0B',       // Areia dourada / Estrelas
    goldSoft: '#FEF3C7',
    jungle: '#15803D',     // Natureza / Rotas a pé
    jungleSoft: '#DCFCE7',
  },

  // Status Funcionais
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    ai: '#06B6D4',
  },

  // Vidro & Glassmorphism
  glass: {
    white: 'rgba(255, 255, 255, 0.82)',
    whiteBorder: 'rgba(255, 255, 255, 0.65)',
    sand: 'rgba(253, 251, 247, 0.88)',
    dark: 'rgba(13, 40, 52, 0.85)',
    darkBorder: 'rgba(255, 255, 255, 0.12)',
  },
} as const;

export const CD_RADII = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '22px',
  xl: '28px',
  full: '9999px',
} as const;

export const CD_SHADOWS = {
  xs: '0 2px 4px rgba(13, 40, 52, 0.04)',
  sm: '0 4px 12px rgba(13, 40, 52, 0.06)',
  md: '0 8px 20px -3px rgba(13, 40, 52, 0.09)',
  lg: '0 14px 30px -4px rgba(13, 40, 52, 0.14)',
  card3D: '0 12px 28px -4px rgba(13, 40, 52, 0.12), 0 2px 6px rgba(13, 40, 52, 0.04)',
  aiPulse: '0 0 20px rgba(56, 189, 248, 0.35)',
  coralGlow: '0 6px 20px rgba(247, 107, 82, 0.28)',
} as const;
