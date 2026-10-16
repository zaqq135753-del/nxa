import { Moon, Sun } from 'lucide-react';
import type { GuideTheme } from './useGuideTheme';

export function GuideThemeButton({ theme, onToggle, floating = false }: { theme: GuideTheme; onToggle: () => void; floating?: boolean }) {
  const label = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
  return <button type="button" className={`caraiva-icon-button cv-theme-toggle${floating ? ' cv-theme-floating' : ''}`} onClick={onToggle} aria-label={label} title={label} aria-pressed={theme === 'dark'}>
    {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
  </button>;
}
