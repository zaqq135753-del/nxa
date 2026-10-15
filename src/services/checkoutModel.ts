export type CheckoutMode = 'goods' | 'room' | 'tour' | 'service' | 'table' | 'ticket';
export function checkoutMode(category: string): CheckoutMode {
  if (['hospedagens','pousada','room'].includes(category)) return 'room';
  if (['passeios','passeio','tour'].includes(category)) return 'tour';
  if (['servicos','servico','service'].includes(category)) return 'service';
  if (['noite','ticket'].includes(category)) return 'ticket';
  if (['restaurantes','bares','cafes','table'].includes(category)) return 'table';
  return 'goods';
}
export function allowedKinds(niche: string): string[] {
  return ({restaurante:['product','table'],mercado:['product'],farmacia:['product'],pousada:['room'],passeio:['tour'],servico:['service'],loja:['retail'],noite:['ticket','table','product']} as Record<string,string[]>)[niche] ?? [];
}
export function orderStatus(status: string, booking=false, delivery=false): string {
  return ({novo:'Aguardando o estabelecimento',preparando:booking?'Reserva aceita':'Em preparação',em_rota:'Saiu para entrega',entregue:booking?'Atendimento concluído':delivery?'Entregue':'Concluído',recusado:'Recusado pelo estabelecimento',cancelado:'Cancelado'} as Record<string,string>)[status] ?? status;
}
export function billableNights(start:string,end:string):number {
  const interval=new Date(end).getTime()-new Date(start).getTime();
  return Number.isFinite(interval)&&interval>0?Math.ceil(interval/86400000):0;
}
export function readSession<T>(key:string,fallback:T):T {
  try{return JSON.parse(sessionStorage.getItem(key)??'null')??fallback;}catch{return fallback;}
}
export function writeSession(key:string,value:unknown):void {
  try{sessionStorage.setItem(key,JSON.stringify(value));}catch{/* Storage is optional. */}
}
