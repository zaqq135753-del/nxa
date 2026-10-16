import React from 'react';
import { Sparkles, Search, X, Loader2 } from 'lucide-react';

/* ==========================================================================
   1. BOTÕES (CDButton & CDIconButton)
   ========================================================================== */
export interface CDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'coral' | 'ghost' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const CDButton: React.FC<CDButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  style,
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: size === 'sm' ? 12 : size === 'lg' ? 20 : 16,
    fontWeight: 700,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    width: fullWidth ? '100%' : 'auto',
    userSelect: 'none',
    boxSizing: 'border-box',
    textDecoration: 'none',
    fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
    padding: size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 24px' : '11px 18px',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #0FA3A5, #0D8284)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px rgba(15, 163, 165, 0.3)',
    },
    secondary: {
      background: '#F4ECE0',
      color: '#0D2834',
      border: '1px solid rgba(13, 40, 52, 0.08)',
    },
    coral: {
      background: 'linear-gradient(135deg, #F76B52, #E2573F)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px rgba(247, 107, 82, 0.3)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(12px)',
      color: '#0D2834',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 4px 12px rgba(13, 40, 52, 0.05)',
    },
    ai: {
      background: 'linear-gradient(135deg, #0FA3A5, #38BDF8)',
      color: '#FFFFFF',
      boxShadow: '0 4px 18px rgba(56, 189, 248, 0.35)',
    },
    ghost: {
      background: 'transparent',
      color: '#0D2834',
    },
  };

  return (
    <button
      className={`cd-btn-tactile ${className}`}
      style={{ ...baseStyles, ...variantStyles[variant], ...style }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : icon}
      {children}
    </button>
  );
};

export const CDIconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: number;
  variant?: 'glass' | 'white' | 'dark';
}> = ({ size = 40, variant = 'glass', style, children, ...props }) => (
  <button
    className="cd-btn-tactile"
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: variant === 'glass' ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(13,40,52,0.08)',
      background: variant === 'glass' ? 'rgba(255,255,255,0.8)' : variant === 'white' ? '#FFFFFF' : '#0D2834',
      color: variant === 'dark' ? '#FFFFFF' : '#0D2834',
      backdropFilter: 'blur(10px)',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(13,40,52,0.08)',
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

/* ==========================================================================
   2. INPUTS & SEARCH BAR
   ========================================================================== */
export const CDSearchBar: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onClear?: () => void;
}> = ({ value, onChange, placeholder = 'Buscar em Caraíva...', onClear }) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      border: '1.5px solid rgba(13, 40, 52, 0.08)',
      borderRadius: 20,
      padding: '4px 14px',
      boxShadow: '0 4px 16px rgba(13, 40, 52, 0.05)',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    <Search size={18} color="#0FA3A5" style={{ flexShrink: 0, marginRight: 8 }} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 14,
        fontWeight: 500,
        color: '#0D2834',
        padding: '8px 0',
      }}
    />
    {value && onClear && (
      <button
        onClick={onClear}
        style={{
          border: 'none',
          background: '#F1F5F9',
          borderRadius: '50%',
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={12} color="#64748B" />
      </button>
    )}
  </div>
);

/* ==========================================================================
   3. CHIPS & BADGES DE FILTRO
   ========================================================================== */
export const CDChip: React.FC<{
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}> = ({ label, active = false, icon, onClick }) => (
  <button
    onClick={onClick}
    className="cd-btn-tactile"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 14px',
      borderRadius: 9999,
      fontSize: 13,
      fontWeight: 700,
      border: active ? '1.5px solid #0FA3A5' : '1px solid rgba(13,40,52,0.08)',
      background: active ? '#0FA3A5' : 'rgba(255, 255, 255, 0.85)',
      color: active ? '#FFFFFF' : '#0D2834',
      backdropFilter: 'blur(8px)',
      boxShadow: active ? '0 4px 12px rgba(15, 163, 165, 0.25)' : 'none',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    }}
  >
    {icon}
    {label}
  </button>
);

export const CDBadge: React.FC<{
  label: string;
  variant?: 'open' | 'closed' | 'verified' | 'ai' | 'coral';
}> = ({ label, variant = 'verified' }) => {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    open: { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0' },
    closed: { bg: '#FEE2E2', color: '#B91C1C', border: '#FECACA' },
    verified: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
    coral: { bg: '#FFEBE7', color: '#E2573F', border: '#FED7D0' },
    ai: { bg: 'linear-gradient(135deg, #E0F2FE, #CCFBF1)', color: '#0369A1', border: '#BAE6FD' },
  };

  const st = styles[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 700,
        background: st.bg,
        color: st.color,
        border: `1px solid ${st.border}`,
      }}
    >
      {label}
    </span>
  );
};

/* ==========================================================================
   4. INDICADOR DE IA (PULSO TRANQUILO)
   ========================================================================== */
export const CDAiIndicator: React.FC<{ text?: string }> = ({ text = 'Caraíva IA' }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      background: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(56, 189, 248, 0.4)',
      boxShadow: '0 2px 10px rgba(56, 189, 248, 0.2)',
      fontSize: 12,
      fontWeight: 700,
      color: '#0369A1',
    }}
  >
    <Sparkles size={14} color="#0FA3A5" className="cd-ai-glow" />
    <span>{text}</span>
  </div>
);

/* ==========================================================================
   5. SKELETON LOADER
   ========================================================================== */
export const CDSkeleton: React.FC<{ width?: string | number; height?: string | number; radius?: number }> = ({
  width = '100%',
  height = 20,
  radius = 12,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #F3EBD6 25%, #FAF6EE 50%, #F3EBD6 75%)',
      backgroundSize: '200% 100%',
      animation: 'cd-shimmer-sweep 1.8s infinite linear',
    }}
  />
);
