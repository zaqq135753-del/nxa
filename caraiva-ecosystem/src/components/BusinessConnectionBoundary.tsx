"use client";
import { usePathname } from 'next/navigation';
import { BusinessCloudPanel } from './BusinessCloudPanel';
const scopes:Record<string,string[]>={delivery:['restaurante','mercado','farmacia'],pousada:['pousada'],passeios:['passeio'],restaurante:['restaurante','noite'],farmacia:['farmacia'],servicos:['servico'],loja:['loja']};
export function BusinessConnectionBoundary({children}:{children:React.ReactNode}) {
  const path=usePathname();
  if(process.env.NEXT_PUBLIC_CARAIVA_CLOUD!=='true')return <>{children}</>;
  const section=path.split('/')[2];
  return <><BusinessCloudPanel niches={scopes[section]} deliveryOnly={section==='entregador'}/><details className="card my-6 p-4"><summary className="cursor-pointer">Prévia dos recursos especializados · demonstração local</summary><p className="my-3 text-sm text-areia-300">Esta prévia preserva os recursos anteriores. Seus dados são demonstrativos e não alteram o banco compartilhado acima.</p>{children}</details></>;
}
