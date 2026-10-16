import { useEffect } from 'react';

/** Keep mobile overlays inside the visual viewport when the keyboard opens. */
export function useGuideViewport() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.caraiva-guide');
    const viewport = window.visualViewport;
    if (!root || !viewport) return;
    let frame = 0;
    let restingHeight = viewport.height;
    let previousWidth = viewport.width;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const editable = document.activeElement?.matches('input,textarea,[contenteditable=true]');
        if (!editable || Math.abs(previousWidth - viewport.width) > 80) restingHeight = viewport.height;
        previousWidth = viewport.width;
        root.style.setProperty('--cv-visible-height', `${viewport.height}px`);
        root.dataset.keyboard = String(Boolean(editable && restingHeight - viewport.height > 120));
      });
    };
    update();
    viewport.addEventListener('resize', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', update);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
      root.style.removeProperty('--cv-visible-height');
      delete root.dataset.keyboard;
    };
  }, []);
}
