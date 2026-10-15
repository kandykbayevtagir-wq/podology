import {esc} from './render.mjs';
const supported={'apple-pay':'Apple Pay','samsung-pay':'Samsung Pay','google-pay':'Google Pay','kaspi':'Kaspi.kz','halyk':'Halyk Bank'};
// No method is published without an explicit confirmation in project content.
export function paymentSection(settings,{base='',lang='ru'}={}){
 const confirmed=[...new Set((Array.isArray(settings.paymentMethods)?settings.paymentMethods:[]).filter(x=>x?.confirmed===true&&Object.hasOwn(supported,x.id)).map(x=>x.id))];
 if(!confirmed.length)return '';
 return `<section class="payment-section container" aria-labelledby="payment-heading"><div><h2 id="payment-heading">${lang==='kk'?'Орталықта төлеу':'Оплата в центре'}</h2><p>${lang==='kk'?'Төлем шарттарын әкімшіден нақтылаңыз.':'Условия оплаты уточняйте у администратора.'}</p></div><ul class="payment-methods">${confirmed.map(id=>`<li><img src="${esc(base)}/assets/payments/${id}.svg" alt="${supported[id]}" width="140" height="48" loading="lazy"></li>`).join('')}</ul></section>`;
}
