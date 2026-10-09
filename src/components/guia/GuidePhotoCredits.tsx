import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import photos from '../../data/caraivaPhotoCredits.json';
import { asset } from '../../lib/asset';

export function GuidePhotoCredits({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => previous?.focus({ preventScroll: true });
  }, []);
  return <dialog ref={dialog} className="cv-photo-credits" aria-labelledby="cv-photo-credits-title" onCancel={onClose}>
    <header><div><small>OLHARES REAIS DA VILA</small><h2 id="cv-photo-credits-title">Caraíva, por quem fotografou.</h2></div><button type="button" onClick={onClose} aria-label="Fechar créditos das fotografias"><X size={22}/></button></header>
    <p>Fotografias identificadas como Caraíva nas fontes originais. Registros de diferentes anos; as imagens de ambiente não representam um estabelecimento específico ou sua disponibilidade atual.</p>
    {photos.map(photo => <article key={photo.id}><img src={asset(`assets/caraiva-photos/${photo.id}-640.webp`)} alt="" loading="lazy"/><div><strong>{photo.title}</strong><span>{photo.author}</span><a href={photo.source} target="_blank" rel="noreferrer">Fonte original</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a><small>{photo.changes} Adaptações sob a licença original quando exigido.</small></div></article>)}
  </dialog>;
}
