import { useEffect, useState } from 'react';
export function ConciergeQr({ businessId, name }: { businessId: string; name: string }) {
  const [image, setImage] = useState(''), [notice, setNotice] = useState('');
  const link = new URL(`/guia/viagem?aba=atendimento&pousada=${encodeURIComponent(businessId)}`, location.origin).href;
  useEffect(() => {
    let active = true; setImage('');
    void import('qrcode').then(qr => qr.toDataURL(link, { width: 220, margin: 2, color: { dark: '#090B0C', light: '#FFF4ED' } })).then(result => { if (active) setImage(result); }).catch(() => { if (active) setNotice('O QR não pôde ser gerado. Use o link abaixo.'); });
    return () => { active = false; };
  }, [link]);
  return <section className="cj-panel" style={{ marginTop: 20 }}><small>NA RECEPÇÃO OU NO QUARTO</small><h2>Atendimento de {name}</h2><p>O hóspede abre este QR e envia a solicitação diretamente para sua operação.</p>{image && <img src={image} width={180} height={180} alt={`QR para solicitar atendimento de ${name}`} />}<p style={{ overflowWrap: 'anywhere' }}><a href={link}>{link}</a></p><button onClick={() => { void (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject(new Error('Clipboard unavailable')) ).then(() => setNotice('Link copiado.')).catch(() => setNotice('Copie o link exibido acima.')); }}>Copiar link de atendimento</button>{notice && <p role="status">{notice}</p>}<small>Na publicação, o QR utiliza o domínio em que o painel estiver aberto.</small></section>;
}
