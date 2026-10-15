(()=>{'use strict';
// Discourage ordinary image saving without blocking text, links or browser shortcuts.
const protectedMedia='img,svg,canvas,.hero-visual,.course-image,.placeholder,.payment-methods li:has(img)';
for(const type of ['contextmenu','dragstart'])document.addEventListener(type,event=>{if(event.target instanceof Element&&event.target.closest(protectedMedia))event.preventDefault();});
document.querySelectorAll('img').forEach(image=>{image.draggable=false;});
const cfg=JSON.parse(document.getElementById('site-config')?.textContent||'{}');const kk=cfg.lang==='kk';const say=(ru,kz)=>kk?kz:ru;
const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('mobile-nav');
function toggleMenu(open,restore=false){if(!menu||!nav)return;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?menu.dataset.labelClose:menu.dataset.labelOpen);nav.hidden=!open;document.body.classList.toggle('menu-open',open);for(const el of document.querySelectorAll('main,footer,.mobile-actions'))el.inert=open;if(restore)menu.focus();}
menu?.addEventListener('click',()=>toggleMenu(menu.getAttribute('aria-expanded')!=='true'));
nav?.addEventListener('click',e=>{if(e.target.closest('a'))toggleMenu(false);});
document.addEventListener('keydown',e=>{if(menu?.getAttribute('aria-expanded')!=='true')return;if(e.key==='Escape'){toggleMenu(false,true);return;}if(e.key==='Tab'){const links=[...document.querySelectorAll('.header-actions a,.menu-toggle,#mobile-nav a')].filter(x=>x.getClientRects().length),first=links[0],last=links.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
matchMedia('(min-width: 981px)').addEventListener('change',e=>{if(e.matches)toggleMenu(false);});
window.addEventListener('pagehide',()=>toggleMenu(false));
document.addEventListener('focusin',e=>{if(e.target.matches('input:not([type=checkbox]),textarea,select'))document.body.classList.add('is-editing');});
document.addEventListener('focusout',()=>{setTimeout(()=>document.body.classList.toggle('is-editing',!!document.activeElement?.matches('input:not([type=checkbox]),textarea,select')),0);});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const category=button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===button);x.setAttribute('aria-pressed',String(x===button));});
 let count=0;
 document.querySelectorAll('.course-card[data-category]').forEach(card=>{
  const match=category==='all'||card.dataset.category===category||(category==='advanced'&&['advanced','orthonyxia','insoles','orthoses'].includes(card.dataset.category));
  card.hidden=!match;if(match)count++;
 });
 const status=document.getElementById('course-results');if(status)status.textContent=say('Показано программ: ','Бағдарламалар саны: ')+count;
 button.scrollIntoView({block:'nearest',inline:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}));
let consent='';try{consent=localStorage.getItem('mk-analytics')||'';}catch{}let loaded=false;
window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
function enableAnalytics(){if(loaded||consent!=='accepted'||(!cfg.ga4Id&&!cfg.adsId))return;loaded=true;gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'denied',ad_personalization:'denied'});const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.ga4Id||cfg.adsId);document.head.append(s);gtag('js',new Date());if(cfg.ga4Id)gtag('config',cfg.ga4Id,{page_location:location.origin+location.pathname,send_page_view:true});if(cfg.adsId)gtag('config',cfg.adsId);}
function track(name,extra={}){if(consent!=='accepted')return;gtag('event',name,{page_path:location.pathname,...extra});}
const cookie=document.querySelector('.cookie-banner');if(cookie&&(cfg.ga4Id||cfg.adsId)&&!consent)cookie.hidden=false;enableAnalytics();document.querySelector('.cookie-settings')?.addEventListener('click',()=>{cookie.hidden=false;});document.querySelectorAll('[data-cookie]').forEach(b=>b.addEventListener('click',()=>{consent=b.dataset.cookie;try{localStorage.setItem('mk-analytics',consent);}catch{}if(consent==='declined'){gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});cookie.hidden=true;if(loaded)location.reload();}else{enableAnalytics();cookie.hidden=true;}}));
const params=new URLSearchParams(location.search),keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'];
const clean=value=>String(value||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim();
let stored={};try{const value=JSON.parse(sessionStorage.getItem('mk-attribution')||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))stored=value;}catch{}
const attribution={};for(const key of keys){const value=params.get(key)||stored[key];if(typeof value==='string'&&value)attribution[key]=clean(value).slice(0,200);}
try{sessionStorage.setItem('mk-attribution',JSON.stringify(attribution));}catch{}
document.querySelectorAll('[data-track]').forEach(a=>a.addEventListener('click',()=>{track(a.dataset.track);if(a.dataset.track==='whatsapp_click'&&cfg.adsId&&cfg.adsWhatsappLabel&&consent==='accepted')gtag('event','conversion',{send_to:cfg.adsId+'/'+cfg.adsWhatsappLabel});}));
// A branch card preselects the location without opening a second booking flow.
document.querySelectorAll('[data-location]').forEach(link=>link.addEventListener('click',event=>{
 const form=document.querySelector('.booking-form'),select=form?.elements.location_id;
 if(!form||!select||!(cfg.locations||[]).some(x=>x.id===link.dataset.location))return;
 event.preventDefault();select.value=link.dataset.location;select.classList.add('field-highlight');setTimeout(()=>select.classList.remove('field-highlight'),1200);
 document.getElementById('booking').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 form.elements.interest.focus({preventScroll:true});
}));
for(const form of document.querySelectorAll('.booking-form')){
 const status=form.querySelector('.form-status'),fallback=form.querySelector('.whatsapp-fallback');
 const syncChoice=()=>{
  const [type,id]=form.elements.interest.value.split(':');
  form.elements.service_id.value=type==='service'?id||'':'';
  form.elements.course_id.value=type==='course'?id||'':'';
  form.elements.topic.value=type==='course'?(id==='outbound-training'?'outbound':'education'):'services';
 };
 form.elements.interest.addEventListener('change',syncChoice);syncChoice();
 form.addEventListener('input',event=>{if(event.target.setCustomValidity)event.target.setCustomValidity('');status.textContent='';fallback.hidden=true;});
 form.addEventListener('change',event=>{if(event.target.setCustomValidity)event.target.setCustomValidity('');status.textContent='';fallback.hidden=true;});
 form.addEventListener('submit',event=>{
  event.preventDefault();syncChoice();
  if(!form.reportValidity())return;
  const values=Object.fromEntries(new FormData(form));if(values.website)return;
  const name=clean(values.name).replace(/\s+/g,' '),digits=String(values.phone||'').replace(/\D/g,'');
  const reject=(field,message)=>{field.setCustomValidity(message);status.textContent=message;field.reportValidity();};
  if(name.length<2||!/[\p{L}]/u.test(name))return reject(form.elements.name,say('Укажите ваше имя.','Есіміңізді жазыңыз.'));
  const phone=digits.length===10?'+7'+digits:digits.length===11&&['7','8'].includes(digits[0])?'+7'+digits.slice(-10):'';
  if(!phone)return reject(form.elements.phone,say('Введите номер: +7 и 10 цифр, например +7 775 123 45 67.','Нөмірді енгізіңіз: +7 және 10 сан, мысалы +7 775 123 45 67.'));
  const [type,id]=values.interest.split(':'),choice=(type==='service'?cfg.services:type==='course'?cfg.courses:[])?.find(x=>x.id===id);
  if(!choice)return reject(form.elements.interest,say('Выберите услугу или курс из списка.','Тізімнен қызметті немесе курсты таңдаңыз.'));
  const locationItem=(cfg.locations||[]).find(x=>x.id===values.location_id);
  if(!locationItem||!/^7\d{10}$/.test(locationItem.whatsapp))return reject(form.elements.location_id,say('Выберите филиал.','Филиалды таңдаңыз.'));
  const specialist=values.specialist_id?form.elements.specialist_id.selectedOptions[0]?.textContent:'';
  const comment=clean(values.comment).slice(0,500);
  const message=[
   say('Здравствуйте! Хочу уточнить запись в Podology MK.','Сәлеметсіз бе! Podology MK-ға жазылуды нақтылағым келеді.'),
   (type==='course'?say('Обучение: ','Оқыту: '):say('Услуга: ','Қызмет: '))+choice.title,
   say('Имя: ','Есім: ')+name,say('Телефон: ','Телефон: ')+phone,
   say('Филиал: ','Филиал: ')+locationItem.title,
   specialist?say('Специалист: ','Маман: ')+specialist:'',
   comment?say('Комментарий: ','Пікір: ')+comment:'',
   say('Страница: ','Бет: ')+location.origin+location.pathname,
   Object.keys(attribution).length?say('Источник: ','Дереккөз: ')+Object.entries(attribution).map(([key,value])=>key+'='+value).join(' | '):'',
   say('Согласие на обработку данных: да.','Деректерді өңдеуге келісім: иә.')
  ].filter(Boolean).join('\n');
  const href='https://wa.me/'+locationItem.whatsapp+'?text='+encodeURIComponent(message);
  fallback.href=href;fallback.hidden=false;
  window.open(href,'_blank','noopener,noreferrer');
  status.textContent=say('Сообщение готово. Отправьте его в WhatsApp — администратор подтвердит время и стоимость. Если WhatsApp не открылся, нажмите кнопку ниже.','Хабарлама дайын. Оны WhatsApp-та жіберіңіз — әкімші уақыт пен бағаны растайды. WhatsApp ашылмаса, төмендегі түймені басыңыз.');
  track('whatsapp_form_open',{lead_type:values.topic,service_id:values.service_id,course_id:values.course_id});
 });
}
})();
