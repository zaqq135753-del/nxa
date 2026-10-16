import { useEffect, useState } from 'react';

export type GuideTheme = 'light' | 'dark';
const STORAGE_KEY = 'caraiva:theme';

/** Theme belongs to the guide only; never changes the PMS document theme. */
export function useGuideTheme() {
  const [theme, setTheme] = useState<GuideTheme>(() => {
    try {
      if (!localStorage.getItem('caraiva:tech-restored')) {
        localStorage.setItem('caraiva:tech-restored', '1');
        localStorage.setItem(STORAGE_KEY, 'dark');
        return 'dark';
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* Keep theme usable when storage is blocked. */ }
    return 'dark';
  });
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) setTheme(event.newValue);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggleTheme = () => setTheme(current => {
    const next = current === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Session preference still works. */ }
    return next;
  });
  return { theme, toggleTheme };
}
