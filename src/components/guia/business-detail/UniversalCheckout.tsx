import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {ecosystemCloud as db} from '../../../services/ecosystemCloud';
import {billableNights,checkoutMode,orderStatus,readSession,writeSession} from '../../../services/checkoutModel';
import './cloud-checkout.css';
type Offering={id:string;kind:string;name:string;price_cents:number;stock:number|null;capacity:number;duration_min:number};
type Order={id:string;status:string;payment_status:string;total_cents:number};
type Draft={request:string;name:string;detail:string;phone:string;pickup:boolean;quantities:Record<string,number>;offeringId:string;people:number;start:string;end:string};
const money=(cents:number)=>(cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function initialDraft(key:string):Draft {
  let selection:Partial<Draft>={};
  try{const stored=JSON.parse(localStorage.getItem(`${key}:selection`)??'null');if(stored?.expires>Date.now())selection=stored.draft;}catch{/* Storage is optional. */}
  const saved={...selection,...readSession<Partial<Draft>>(key,{})};
  return {request:saved.request||crypto.randomUUID(),name:saved.name||'',detail:saved.detail||'',phone:saved.phone||'',pickup:saved.pickup!==false,quantities:saved.quantities||{},offeringId:saved.offeringId||'',people:saved.people||1,start:saved.start||'',end:saved.end||''};
}
function message(reason:unknown):string{return typeof reason==='object'&&reason&&'message'in reason?String(reason.message):'Não foi possível concluir. Sua seleção foi mantida.';}
type CheckoutProps={businessId:string;businessName:string;mode?:string;onClose?:()=>void};
export function CloudCheckout(props:CheckoutProps){return <CheckoutSession key={`${props.businessId}:${checkoutMode(props.mode??'goods')}`} {...props}/>;}
function CheckoutSession({businessId,businessName,mode='goods',onClose}:CheckoutProps) {
  const normalized=checkoutMode(mode),draftKey=`caraiva:checkout:v2:${businessId}:${normalized}`;
  const [draft,setDraft]=useState(()=>initialDraft(draftKey));
  const [offerings,setOfferings]=useState<Offering[]>([]);
  const [accepting,setAccepting]=useState(false),[deliveryFee,setDeliveryFee]=useState(0),[loading,setLoading]=useState(true);
  const [error,setError]=useState(''),[notice,setNotice]=useState(''),[userId,setUserId]=useState<string|null>(null),[authReady,setAuthReady]=useState(false);
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[order,setOrder]=useState<Order|null>(null);
  const lock=useRef(false);
  const patch=(value:Partial<Draft>)=>setDraft(previous=>({...previous,...value}));
  const visible=offerings.filter(item=>normalized==='goods'?['product','retail'].includes(item.kind):item.kind===normalized);
  const selected=visible.find(item=>item.id===draft.offeringId)??visible[0];
  const units=normalized==='room'?billableNights(draft.start,draft.end):draft.people;
  const estimated=normalized==='goods'?visible.reduce((sum,item)=>sum+item.price_cents*(draft.quantities[item.id]??0),0)+(draft.pickup?0:deliveryFee):(selected?.price_cents??0)*units;
  useEffect(()=>{if(!order){writeSession(draftKey,draft);try{const {request,pickup,quantities,offeringId,people,start,end}=draft;localStorage.setItem(`${draftKey}:selection`,JSON.stringify({expires:Date.now()+86400000,draft:{request,pickup,quantities,offeringId,people,start,end}}));}catch{/* Do not persist contact details outside the current tab. */}}},[draft,draftKey,order]);
  useEffect(()=>{
    if(!db){setLoading(false);setError('A conexão de pedidos não está configurada.');return;}
    const client=db;let active=true;
    void client.auth.getUser().then(({data})=>{if(active){setUserId(data.user?.id??null);setAuthReady(true);}});
    const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{if(active){setUserId(session?.user.id??null);setAuthReady(true);}});
    const load=async()=>{
      const [business,items]=await Promise.all([client.from('cd_businesses').select('accepting_orders,delivery_fee_cents').eq('id',businessId).maybeSingle(),client.from('cd_offerings').select('*').eq('business_id',businessId).eq('available',true).order('name')]);
      if(!active)return;setLoading(false);
      if(business.error||items.error){setError('Não foi possível consultar o catálogo. Tente novamente.');return;}
      setAccepting(business.data?.accepting_orders===true);setDeliveryFee(business.data?.delivery_fee_cents??0);setOfferings((items.data??[]) as Offering[]);
    };
    setLoading(true);void load();
    const channel=client.channel(`catalog:${businessId}:${normalized}:${crypto.randomUUID()}`).on('postgres_changes',{event:'*',schema:'public',table:'cd_offerings',filter:`business_id=eq.${businessId}`},()=>void load()).on('postgres_changes',{event:'UPDATE',schema:'public',table:'cd_businesses',filter:`id=eq.${businessId}`},()=>void load()).subscribe();
    const timer=window.setInterval(()=>void load(),20000);
    return()=>{active=false;clearInterval(timer);subscription.unsubscribe();void client.removeChannel(channel);};
  },[businessId,normalized]);
  useEffect(()=>{
    if(!db||!userId)return;let active=true;
    const last=readSession<string>(`${draftKey}:order`,'');
    if(last)void db.from('cd_orders').select('id,status,payment_status,total_cents').eq('id',last).eq('customer_id',userId).maybeSingle().then(({data})=>{if(active&&data)setOrder(data);});
    return()=>{active=false;};
  },[userId,draftKey]);
  useEffect(()=>{
    const client=db;if(!client||!order?.id||!userId)return;let active=true;
    const refresh=async()=>{const {data}=await client.from('cd_orders').select('id,status,payment_status,total_cents').eq('id',order.id).eq('customer_id',userId).maybeSingle();if(active&&data)setOrder(data);};
    const channel=client.channel(`checkout-order:${order.id}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:'cd_orders',filter:`id=eq.${order.id}`},()=>void refresh()).subscribe();
    const timer=window.setInterval(()=>void refresh(),15000);
    return()=>{active=false;clearInterval(timer);void client.removeChannel(channel);};
  },[order?.id,userId]);
  async function authenticate(method:'password'|'signup'|'link') {
    if(!db||lock.current)return;lock.current=true;setBusy(true);setError('');setNotice('');
    try {
      if(!email.trim()||!email.includes('@'))throw Error('Informe um e-mail válido.');
      if(method==='link') {
        writeSession(draftKey,draft);
        const redirect=new URL(`/guia/checkout/${encodeURIComponent(businessId)}`,window.location.origin);redirect.searchParams.set('modo',mode);
        const {error:authError}=await db.auth.signInWithOtp({email:email.trim(),options:{shouldCreateUser:true,emailRedirectTo:redirect.href}});
        if(authError)throw authError;setNotice('Abra o link enviado ao seu e-mail neste navegador. Sua seleção continuará salva.');
      } else {
        const redirect=new URL(`/guia/checkout/${encodeURIComponent(businessId)}`,location.origin);redirect.searchParams.set('modo',mode);
        const result=method==='signup'?await db.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:redirect.href}}):await db.auth.signInWithPassword({email:email.trim(),password});
        if(result.error)throw result.error;
        if(!result.data.session)setNotice('Confirme seu e-mail antes de concluir. Sua seleção está salva neste navegador.');setPassword('');
      }
    }catch(reason){setError(message(reason));}finally{lock.current=false;setBusy(false);}
  }
  async function submit() {
    if(!db||lock.current||!userId)return;lock.current=true;setBusy(true);setError('');
    try {
      const lines=normalized==='goods'?visible.filter(item=>(draft.quantities[item.id]??0)>0).map(item=>({id:item.id,quantity:draft.quantities[item.id]})):selected?[{id:selected.id,quantity:draft.people}]:[];
      if(!draft.name.trim()||!lines.length)throw Error('Informe seu nome e escolha o que deseja.');
      if(normalized==='goods'&&!draft.pickup&&!draft.detail.trim())throw Error('Informe onde o pedido deve ser entregue.');
      if(normalized!=='goods'&&(!draft.start||new Date(draft.start).getTime()<=Date.now()))throw Error('Escolha uma data e horário futuros.');
      if(normalized==='room'&&!billableNights(draft.start,draft.end))throw Error('O check-out deve ocorrer depois do check-in.');
      if(!accepting)throw Error('O estabelecimento pausou o recebimento.');
      const {data,error:checkoutError}=await db.rpc('cd_checkout',{p_business:businessId,p_request:draft.request,p_name:draft.name.trim(),p_destination:{type:normalized!=='goods'?'reserva':draft.pickup?'retirada':'entrega',detail:draft.detail.trim(),phone:draft.phone.trim()},p_lines:lines,p_starts:normalized!=='goods'?new Date(draft.start).toISOString():undefined,p_ends:normalized==='room'?new Date(draft.end).toISOString():undefined});
      if(checkoutError)throw checkoutError;writeSession(`${draftKey}:order`,data);
      const result=await db.from('cd_orders').select('id,status,payment_status,total_cents').eq('id',data).single();
      if(result.error)throw result.error;setOrder(result.data);
      try{sessionStorage.removeItem(draftKey);localStorage.removeItem(`${draftKey}:selection`);}catch{/* Storage is optional. */}
    }catch(reason){setError(message(reason));}finally{lock.current=false;setBusy(false);}
  }
  function newOrder(){try{sessionStorage.removeItem(draftKey);sessionStorage.removeItem(`${draftKey}:order`);localStorage.removeItem(`${draftKey}:selection`);}catch{/* Storage is optional. */}setDraft(initialDraft(draftKey));setOrder(null);setNotice('');setError('');}
  return <section className="cv-checkout" aria-label={`Checkout de ${businessName}`}>
    <header><div><small>CARAÍVA · {normalized==='goods'?'PEDIDOS':'RESERVAS'}</small><h3>{businessName}</h3></div>{onClose&&<button type="button" onClick={onClose} aria-label="Fechar checkout">✕</button>}</header>
    {error&&<p role="alert" className="cv-checkout-alert">{error}</p>}{notice&&<p role="status" className="cv-checkout-notice">{notice}</p>}
    {loading?<p role="status">Consultando disponibilidade…</p>:order&&userId?<>
      <h4>Recebido pelo estabelecimento</h4><p>Código <strong className="cv-checkout-code">{order.id}</strong></p>
      <p role="status">{orderStatus(order.status,normalized!=='goods',!draft.pickup)}</p><strong className="cv-checkout-total">{money(order.total_cents)}</strong>
      <p>{order.payment_status==='paid'?'Pagamento confirmado.':order.payment_status==='refunded'?'Pagamento estornado.':'Pagamento pendente. Nenhuma cobrança foi confirmada pelo aplicativo.'}</p>
      <Link to="/guia/pedidos">Acompanhar meus pedidos e reservas</Link><button type="button" onClick={newOrder}>Fazer outro pedido</button>
    </>:!accepting||!visible.length?<><p>O estabelecimento ainda não disponibilizou {normalized==='goods'?'seu catálogo':'a agenda'} para solicitações no aplicativo.</p><p>Nenhum pedido foi criado.</p></>:<>
      <ol className="cv-checkout-steps" aria-label="Etapas"><li>1 · Escolha</li><li>2 · Seus dados</li><li>3 · Revisão</li></ol>
      {normalized==='goods'?visible.map(item=><label className="cv-checkout-item" key={item.id}><span><strong>{item.name}</strong><small>{money(item.price_cents)}{item.stock===0?' · Esgotado':''}</small></span><input aria-label={`Quantidade de ${item.name}`} type="number" min={0} max={Math.min(99,item.stock??99)} disabled={item.stock===0} value={draft.quantities[item.id]??0} onChange={event=>patch({quantities:{...draft.quantities,[item.id]:Math.max(0,Math.min(item.stock??99,99,Math.trunc(Number(event.target.value)||0)))}})}/></label>):<>
        <label>Escolha a opção<select value={selected?.id??''} onChange={event=>patch({offeringId:event.target.value,people:1})}>{visible.map(item=><option value={item.id} key={item.id}>{item.name} · {money(item.price_cents)}{normalized==='room'?'/diária':''}</option>)}</select></label>
        <div className="cv-checkout-grid"><label>{normalized==='room'?'Hóspedes':'Pessoas'}<input type="number" min={1} max={Math.min(99,selected?.capacity??1)} value={draft.people} onChange={event=>patch({people:Math.max(1,Math.min(99,selected?.capacity??1,Math.trunc(Number(event.target.value)||1)))})}/></label><label>{normalized==='room'?'Check-in':'Data e horário'}<input type="datetime-local" value={draft.start} onChange={event=>patch({start:event.target.value})}/></label></div>
        {normalized==='room'&&<label>Check-out<input type="datetime-local" value={draft.end} onChange={event=>patch({end:event.target.value})}/></label>}
        {normalized==='room'&&units>0&&<p>{units} diária(s) · {draft.people} hóspede(s)</p>}
      </>}
      <label>Seu nome<input autoComplete="name" maxLength={120} value={draft.name} onChange={event=>patch({name:event.target.value})}/></label>
      <label>Telefone para contato sobre o pedido<input type="tel" autoComplete="tel" maxLength={25} value={draft.phone} onChange={event=>patch({phone:event.target.value})}/></label>
      {normalized==='goods'&&<label className="cv-checkout-checkbox"><input type="checkbox" checked={draft.pickup} onChange={event=>patch({pickup:event.target.checked})}/> Retirar no estabelecimento</label>}
      <label>{normalized==='goods'&&!draft.pickup?'Endereço e referência para entrega':'Observações'}<textarea rows={3} maxLength={1000} value={draft.detail} onChange={event=>patch({detail:event.target.value})}/></label>
      <div className="cv-checkout-summary"><span>Total estimado{normalized==='goods'&&!draft.pickup?` · entrega ${money(deliveryFee)}`:''}</span><strong>{money(estimated)}</strong><small>O servidor confere preço, estoque e disponibilidade antes de registrar.</small></div>
      {!authReady?<p>Verificando seu acesso…</p>:!userId?<div className="cv-checkout-auth"><h4>Entre para acompanhar seu pedido</h4><label>E-mail<input type="email" autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)}/></label><button type="button" disabled={busy||!email} onClick={()=>void authenticate('link')}>Receber link de acesso</button><details><summary>Entrar ou cadastrar com senha</summary><label>Senha<input type="password" autoComplete="current-password" value={password} onChange={event=>setPassword(event.target.value)}/></label><button type="button" disabled={busy||!password} onClick={()=>void authenticate('password')}>Entrar</button><button type="button" disabled={busy||password.length<8} onClick={()=>void authenticate('signup')}>Criar acesso</button></details></div>:<button className="cv-checkout-primary" type="button" disabled={busy} onClick={()=>void submit()}>{busy?'Enviando…':normalized==='goods'?'Enviar pedido':'Solicitar reserva'}</button>}
      <small>Pagamento online ainda indisponível. O envio registra uma solicitação; não confirma cobrança.</small>
    </>}
    <footer><Link to="/guia/pedidos">Meus pedidos e reservas</Link></footer>
  </section>;
}
