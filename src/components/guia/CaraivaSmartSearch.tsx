import { useId } from 'react';
import { Search, Sparkles, X, ArrowUpRight } from 'lucide-react';
interface Props {query:string;onQueryChange:(q:string)=>void;onSubmit:()=>void;onAskConcierge?:(request:string)=>void;greeting?:string;compact?:boolean;}
export function CaraivaSmartSearch({query,onQueryChange,onSubmit,onAskConcierge,greeting,compact=false}:Props){const id=useId();return <div className={'cv-smart-search'+(compact?' cv-smart-compact':'')}>
 <form onSubmit={event=>{event.preventDefault();onSubmit();}} role="search"><label htmlFor={id}><Sparkles size={13}/>{greeting ? greeting+', por onde vamos?' : 'O que você quer viver hoje?'}</label><div className="cv-smart-field"><Search size={19}/><input id={id} type="search" autoComplete="off" enterKeyHint="search" maxLength={240} value={query} onChange={event=>onQueryChange(event.target.value)} placeholder="Um lugar, um sabor, uma experiência…"/>{query&&<button type="button" aria-label="Limpar busca" onClick={()=>onQueryChange('')}><X size={17}/></button>}<button type="submit" aria-label="Buscar lugares"><ArrowUpRight size={20}/></button></div></form>
 {!compact&&<div className="cv-search-ideas" aria-label="Ideias para sua busca">{['Praia','Café','Forró'].map(text=><button type="button" key={text} onClick={()=>onQueryChange(text)}>{text}</button>)}</div>}
 {onAskConcierge&&<button type="button" className="cv-ask-concierge" onClick={()=>onAskConcierge(query.trim())}><Sparkles size={15}/><span>{query.trim()?'Personalizar esse pedido':'Prefere um roteiro para você?'}</span><ArrowUpRight size={15}/></button>}
 </div>;}
export default CaraivaSmartSearch;
