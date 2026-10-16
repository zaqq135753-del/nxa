import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/** Secondary options are disclosed on phones and visible on desktop. */
export function GuideRefinePanel({ children, active }: { children: ReactNode; active: boolean }) {
  const [open, setOpen] = useState(() => matchMedia('(min-width:768px)').matches);
  useEffect(() => {
    const media = matchMedia('(min-width:768px)');
    const update = () => setOpen(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <details className="cv-refine-panel" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>Refinar por vibe{active && <span>1 ativo</span>}<ChevronDown size={17} aria-hidden="true"/></summary>
    {children}
  </details>;
}
