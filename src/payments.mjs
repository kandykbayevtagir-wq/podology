import {esc} from './render.mjs';
import {icon} from './icons.mjs';
const supported={cash:['Наличные','Қолма-қол'],kaspi:['Kaspi QR · перевод','Kaspi QR · аударым'],halyk:['Halyk Bank','Halyk Bank'],'bank-cards':['Банковские карты','Банк карталары'],'apple-pay':['Apple Pay','Apple Pay'],'google-pay':['Google Pay','Google Pay'],'samsung-pay':['Samsung Pay','Samsung Pay']};
// Acceptance is explicitly confirmed by the owner in content; display only, no checkout.
export function paymentSection(settings,{base='',lang='ru'}={}){
 const confirmed=[...new Set((Array.isArray(settings.paymentMethods)?settings.paymentMethods:[]).filter(x=>x?.confirmed===true&&Object.hasOwn(supported,x.id)).map(x=>x.id))];
 if(!confirmed.length)return '';
 const kk=lang==='kk';
 return `<section class="payment-section container" aria-labelledby="payment-heading"><div class="payment-heading"><h2 id="payment-heading">${kk?'Төлем тәсілдері':'Принимаем к оплате'}</h2><p>${kk?'Орталықта өзіңізге ыңғайлы тәсілмен төлеңіз.':'В центре — удобным для вас способом.'}</p></div><ul class="payment-methods">${confirmed.map(id=>{const label=supported[id][kk?1:0];return `<li>${id==='cash'||id==='bank-cards'?`<span class="payment-generic">${icon(id==='cash'?'cash':'card')}<span>${label}</span></span>`:`<img draggable="false" src="${esc(base)}/assets/payments/${id}.${id==='samsung-pay'?'png':'svg'}" alt="${label}" width="140" height="56" loading="lazy" decoding="async">${id==='kaspi'?`<span class="payment-caption">QR · ${kk?'аударым':'перевод'}</span>`:''}`}</li>`;}).join('')}</ul></section>`;
}
