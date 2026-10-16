import { useEffect } from 'react';

/** One observer for the guide: no scroll render loop, no motion when hidden. */
export function useGuideMotion(tab: string) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.caraiva-guide');
    if (!root) return;
    let frame = 0; let activeCard: HTMLElement | null = null;
    const resetCard = () => { if(activeCard){activeCard.style.removeProperty('--cv-tilt-x');activeCard.style.removeProperty('--cv-tilt-y');activeCard.style.removeProperty('--cv-light-x');activeCard.style.removeProperty('--cv-light-y');activeCard=null;} };
    const pointer = (event: PointerEvent) => { if(event.pointerType!=='mouse'||preference.matches)return; const card=(event.target as Element).closest<HTMLElement>('[data-cv-depth]'); if(card!==activeCard)resetCard();if(!card)return;activeCard=card;cancelAnimationFrame(frame);const x=event.clientX,y=event.clientY;frame=requestAnimationFrame(()=>{if(activeCard!==card)return;const rect=card.getBoundingClientRect();const px=(x-rect.left)/rect.width,py=(y-rect.top)/rect.height;card.style.setProperty('--cv-tilt-x',((.5-py)*7)+'deg');card.style.setProperty('--cv-tilt-y',((px-.5)*9)+'deg');card.style.setProperty('--cv-light-x',(px*100)+'%');card.style.setProperty('--cv-light-y',(py*100)+'%');}); };
    const leave = () => {cancelAnimationFrame(frame);resetCard();};
    root.addEventListener('pointermove',pointer);root.addEventListener('pointerleave',leave);
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { root.dataset.motion = document.hidden || preference.matches ? 'paused' : 'running'; };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.target.classList.contains('cv-coast-hero')) entry.target.classList.toggle('cv-scene-visible', entry.isIntersecting);
      if (entry.isIntersecting) { entry.target.classList.add('cv-revealed'); if (!entry.target.classList.contains('cv-coast-hero')) observer.unobserve(entry.target); }
    }), { threshold: .06 });
    const observed = new WeakSet<Element>();
    const scan = () => root.querySelectorAll('main section, .cv-intention-card, .cv-onboarding-launch, .cv-photo').forEach((element, index) => {
      if (observed.has(element)) return;
      observed.add(element);
      if (element.closest('[role="dialog"]') || element.closest('.fixed')) return;
      element.classList.add('cv-reveal');
      (element as HTMLElement).style.setProperty('--cv-delay', `${Math.min(index % 4, 3) * 65}ms`);
      observer.observe(element);
    });
    const focus = (event: FocusEvent) => { const target = event.target as HTMLElement; target.closest('.cv-reveal')?.classList.add('cv-revealed'); };
    const mutation = new MutationObserver(scan); mutation.observe(root, { childList: true, subtree: true });
    update(); scan(); document.addEventListener('visibilitychange', update); preference.addEventListener('change', update); root.addEventListener('focusin', focus);
    return () => { cancelAnimationFrame(frame);resetCard();root.removeEventListener("pointermove",pointer);root.removeEventListener("pointerleave",leave);observer.disconnect(); mutation.disconnect(); document.removeEventListener('visibilitychange', update); preference.removeEventListener('change', update); root.removeEventListener('focusin', focus); };
  }, [tab]);
}
