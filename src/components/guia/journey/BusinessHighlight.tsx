import { useState } from 'react';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
import type { Tables } from '../../../services/database.journey.types';
export function BusinessHighlight({ businessId, items }: { businessId: string; items: Tables<'cd_offerings'>[] }) {
  const [itemId, setItemId] = useState(''), [title, setTitle] = useState(''), [expires, setExpires] = useState(''), [busy, setBusy] = useState(false), [notice, setNotice] = useState('');
  async function submit() {
    const item = items.find(candidate => candidate.id === itemId);
    if (!db || !item || busy) return;
    setBusy(true); setNotice('');
    try {
      if (!title.trim() || !expires || new Date(expires).getTime() <= Date.now()) throw Error('Informe o destaque e uma validade futura.');
      const details = typeof item.details === 'object' && item.details !== null && !Array.isArray(item.details) ? item.details : {};
      const result = await db.from('cd_offerings').update({ details: { ...details, public_highlight: title.trim(), highlight_expires_at: new Date(expires).toISOString() } }).eq('id', itemId).eq('business_id', businessId).select('id').single();
      if (result.error) throw result.error;
      setNotice('Destaque salvo. Ele aparece na vitrine enquanto o item estiver ativo, o negócio recebendo e dentro da validade.'); setTitle('');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível publicar.'); } finally { setBusy(false); }
  }
  return <form className="cj-panel cj-stack" style={{ marginTop: 20 }} onSubmit={event => { event.preventDefault(); void submit(); }}><small>OPORTUNIDADES DA SUA OPERAÇÃO</small><h2>Destaque com prazo definido</h2><p>Divulgue um prato, serviço ou horário do catálogo. O preço cobrado continua sendo o preço cadastrado; publicar um destaque não cria disponibilidade.</p><label>Item do catálogo<select required value={itemId} onChange={event => setItemId(event.target.value)}><option value="">Escolha um item ativo</option>{items.filter(item => item.available).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Mensagem para a vitrine<input required maxLength={90} value={title} onChange={event => setTitle(event.target.value)} placeholder="Ex.: Conheça nosso novo prato da casa" /></label><label>Válido até<input required type="datetime-local" value={expires} onChange={event => setExpires(event.target.value)} /></label><button className="cj-primary" disabled={busy || !items.length}>{busy ? 'Salvando…' : 'Publicar destaque temporário'}</button>{notice && <p role="status">{notice}</p>}</form>;
}
