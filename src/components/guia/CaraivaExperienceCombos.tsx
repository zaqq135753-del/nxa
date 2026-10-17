import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CARAIVA_BUSINESSES } from '../../data/caraivaDigitalData';
import { addPlanBusiness } from '../../services/journeyModel';
import { asset } from '../../lib/asset';
import './journey/journey.css';
export interface ComboIncludedItem {
  category: 'hospedagem' | 'restaurante' | 'passeio' | 'noite';
  title: string;
  businessName: string;
  businessId: string;
  description: string;
  voucherValue: string;
}

export interface CaraivaCombo {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  originalPrice: number;
  comboPrice: number;
  heroImage: string;
  highlights: string[];
  included: ComboIncludedItem[];
  itinerarySummary: {
    period: string;
    description: string;
  }[];
}

export const CARAIVA_COMBOS: CaraivaCombo[] = [
  {
    id: 'combo-caraiva-magica',
    slug: 'combo-caraiva-magica',
    title: 'Passaporte Caraíva Mágica',
    subtitle: 'A experiência definitiva: Hospedagem pé na areia + Gastronomia ícone + Corumbau + Noite',
    badge: 'Mais Desejado · Economize 26%',
    duration: '3 Dias & 2 Noites',
    originalPrice: 1980,
    comboPrice: 1460,
    heroImage: asset('assets/caraiva-photos/caraiva-05-640.webp'),
    highlights: [
      '2 Noites em Pousada parceira com café da manhã tropical',
      'Almoço exclusivo com Pastel de Arraia no Boteco do Pará',
      'Passeio de barco náutico até a Ponta do Corumbau',
      'Acesso sem fila e welcome drink no Forró do Ouriço',
      'Passaporte Digital com validação por QR Code'
    ],
    included: [
      {
        category: 'hospedagem',
        title: 'Hospedagem Raiz & Conforto',
        businessName: 'Pousada da Vila Parceira',
        businessId: 'pousada-da-vila',
        description: '2 diárias para casal com varanda de rede e café colonial na areia',
        voucherValue: 'R$ 1.100',
      },
      {
        category: 'restaurante',
        title: 'Experiência Beira-Rio',
        businessName: 'Boteco do Pará',
        businessId: 'boteco-do-para',
        description: 'Mesa preferencial na maré baixa + 4 pastéis famosos + 2 caipirinhas de cacau',
        voucherValue: 'R$ 220',
      },
      {
        category: 'passeio',
        title: 'Expedição Náutica Corumbau',
        businessName: 'Barco Corumbau Raiz',
        businessId: 'barco-corumbau',
        description: 'Navegação até a ponta de areia que entra no mar com parada nos recifes',
        voucherValue: 'R$ 480',
      },
      {
        category: 'noite',
        title: 'Noite de Forró Tradicional',
        businessName: 'Forró do Ouriço',
        businessId: 'forro-ourico',
        description: '2 ingressos rápidos com pulseira VIP e 2 cervejas artesanais baianas',
        voucherValue: 'R$ 180',
      },
    ],
    itinerarySummary: [
      { period: 'Dia 1 · Chegada', description: 'Travessia de canoa no rio, check-in na pousada e almoço pé na areia no Boteco do Pará.' },
      { period: 'Dia 2 · Mar & Recifes', description: 'Expedição matinal de barco até Corumbau com banho de mar cristalino e retorno ao pôr do sol.' },
      { period: 'Dia 2 · Noite', description: 'Jantar livre e noite embalada pelo legítimo forró pé de serra no Ouriço.' },
      { period: 'Dia 3 · Despedida', description: 'Café colonial prolongado, banho no encontro do rio com o mar e check-out tranquilo.' },
    ]
  },
  {
    id: 'combo-dia-perfeito-mare',
    slug: 'combo-dia-perfeito-mare',
    title: 'Combo 1 Dia na Maré Baixa',
    subtitle: 'Ideia entre rio e mar — confirme as condições locais antes de sair',
    badge: '100% Sincronizado com IA',
    duration: '1 Dia Completo',
    originalPrice: 460,
    comboPrice: 340,
    heroImage: asset('assets/caraiva-photos/caraiva-07-640.webp'),
    highlights: [
      'Caminhada guiada pelas falésias até a Praia do Satu',
      'Almoço com moqueca pé na areia no Jacarandá',
      'Pôr do sol à beira-rio com drinks artesanais',
      'Crédito TapTable integrado no app'
    ],
    included: [
      {
        category: 'passeio',
        title: 'Trilha & Piscinas do Satu',
        businessName: 'Guia Nativo da Ponta',
        businessId: 'guia-satu',
        description: 'Travessia e caminhada na hora exata da maré seca com banho de lagoa',
        voucherValue: 'R$ 160',
      },
      {
        category: 'restaurante',
        title: 'Almoço Sob a Copa da Árvore',
        businessName: 'Restaurante Jacarandá',
        businessId: 'restaurante-jacaranda',
        description: 'Crédito de almoço para 2 pessoas com peixe fresco da costa',
        voucherValue: 'R$ 220',
      },
      {
        category: 'noite',
        title: 'Sunset Session no Rio',
        businessName: 'Bar Beira-Rio',
        businessId: 'bar-beira-rio',
        description: 'Dois drinks de frutas regionais durante a hora mágica do sol poente',
        voucherValue: 'R$ 80',
      },
    ],
    itinerarySummary: [
      { period: '10:00 · Maré Seca', description: 'Travessia para a praia e caminhada pelas piscinas naturais do Satu.' },
      { period: '14:30 · Almoço', description: 'Mesa reservada sob as árvores do Jacarandá com gastronomia afetiva.' },
      { period: '17:20 · Pôr do Sol', description: 'Assistir o sol mergulhar no Rio Caraíva com drink de cacau na mão.' },
    ]
  },
  {
    id: 'combo-circuito-gastronomico',
    slug: 'combo-circuito-gastronomico',
    title: 'Passaporte Gastronômico da Vila',
    subtitle: 'Degustação itinerante nas 4 cozinhas mais aclamadas de Caraíva',
    badge: 'Crédito Digital TapTable',
    duration: 'Válido por toda a estadia',
    originalPrice: 380,
    comboPrice: 285,
    heroImage: asset('assets/caraiva-photos/caraiva-12-640.webp'),
    highlights: [
      'Créditos para usar em 4 restaurantes parceiros',
      'Sobremesa de cortesia em cada parada',
      'Sem filas com comanda digital integrada',
      'Válido por até 7 dias após a ativação'
    ],
    included: [
      {
        category: 'restaurante',
        title: 'Petiscos da Foz',
        businessName: 'Boteco do Pará',
        businessId: 'boteco-do-para',
        description: 'Voucher degustação de pasteis e caldo de sururu',
        voucherValue: 'R$ 95',
      },
      {
        category: 'restaurante',
        title: 'Cozinha Nativa Contemporânea',
        businessName: 'Canto da Duca',
        businessId: 'canto-da-duca',
        description: 'Voucher almoço vegetariano e doce tradicional de banana',
        voucherValue: 'R$ 95',
      },
      {
        category: 'restaurante',
        title: 'Massa Artesanal & Forno a Lenha',
        businessName: 'Bar do Porto',
        businessId: 'bar-do-porto',
        description: 'Voucher pizza de fermentação natural com vista para as canoas',
        voucherValue: 'R$ 100',
      },
      {
        category: 'noite',
        title: 'Coquetelaria Autoral',
        businessName: 'Beco da Lua',
        businessId: 'beco-da-lua',
        description: 'Crédito no bar para 2 drinks autorais com especiarias baianas',
        voucherValue: 'R$ 90',
      },
    ],
    itinerarySummary: [
      { period: 'Uso Livre', description: 'Abra o QR Pass na mesa de qualquer um dos 4 estabelecimentos para debitar automaticamente da sua comanda.' },
    ]
  }
];


export function CaraivaExperienceCombos({onSelectBusiness}:{onSelectBusiness?:(id:string)=>void}) {
 const [notice,setNotice]=useState(''),[expanded,setExpanded]=useState('');
 return <section className="cj-panel"><small>ENCONTROS QUE COMBINAM</small><h2>Uma estadia. Muitas descobertas.</h2><p>Inspire-se nestas combinações. Cada etapa tem sua própria consulta de preço, disponibilidade e reserva.</p><div className="cj-combo-grid">{CARAIVA_COMBOS.map(combo=><article className="cj-combo" key={combo.id}><img src={combo.heroImage} alt={combo.title} loading="lazy"/><div><small>{combo.duration}</small><h3>{combo.title}</h3><p>{combo.subtitle}</p><button type="button" aria-expanded={expanded===combo.id} onClick={()=>setExpanded(previous=>previous===combo.id?'':combo.id)}>Conhecer as etapas</button>{expanded===combo.id&&<div className="cj-stack">{combo.included.map((item,index)=><button type="button" key={index} onClick={()=>onSelectBusiness?.(item.businessId)}>{item.businessName} →</button>)}<button className="cj-primary" type="button" onClick={()=>{try{let added=0;for(const item of combo.included){const business=CARAIVA_BUSINESSES.find(candidate=>candidate.id===item.businessId);if(business){addPlanBusiness(business);added++;}}setNotice(added?'Etapas disponíveis salvas no roteiro. Nenhuma reserva ou cobrança foi feita.':'Consulte os locais disponíveis no catálogo.');}catch{setNotice('Não foi possível salvar neste navegador.');}}}>Salvar etapas no roteiro</button></div>}</div></article>)}</div>{notice&&<p role="status">{notice}</p>}<Link to="/guia/viagem">Organizar minha viagem →</Link></section>;
}
export default CaraivaExperienceCombos;
