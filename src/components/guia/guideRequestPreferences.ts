import type { ConciergeQuery } from '../../services/conciergeProvider';
/** Suggest only supported local preferences; the visitor reviews the form before generating. */
export function guideRequestPreferences(request:string):Partial<ConciergeQuery>{
 const text=request.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const result:Partial<ConciergeQuery>={};
 if(/familia|crianca|filho/.test(text))result.companions='familia';else if(/amig|grupo/.test(text))result.companions='amigos';else if(/sozinh|solo/.test(text))result.companions='solo';else if(/casal|romant/.test(text))result.companions='casal';
 if(/barat|econom|pouco dinheiro/.test(text))result.mood='economico';else if(/forro|festa|dancar/.test(text))result.mood='festa_forro';else if(/praia|natureza|relax|canoa|mangue/.test(text))result.mood='natureza_relax';else if(/comer|jantar|almoco|gastronom/.test(text))result.mood='gastronomico';else if(/romant|casal/.test(text))result.mood='romantico';
 if(/dia inteiro|dia completo/.test(text))result.timeOfDay='dia_completo';else if(/noite|forro|jantar/.test(text))result.timeOfDay='noite';else if(/tarde|por do sol/.test(text))result.timeOfDay='tarde';else if(/manha|cafe/.test(text))result.timeOfDay='manha';return result;
}
