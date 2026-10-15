/* Progressive, viewport-scoped motion. No dependencies or scroll interception. */
(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
let dispose=()=>{};
function setup(){
 dispose();if(reduce.matches)return;
 const cleanup=[],on=(target,event,fn,options)=>{target.addEventListener(event,fn,options);cleanup.push(()=>target.removeEventListener(event,fn,options));};
 dispose=()=>{cleanup.splice(0).reverse().forEach(fn=>fn());document.documentElement.classList.remove('motion-ready','motion-paused');};
 try{
  document.documentElement.classList.add('motion-ready');
  const targets=[...document.querySelectorAll('.page-intro > *,.section-heading,.service-row,.course-card,.about-grid > *,.two-columns > div,.team-grid > article,.location-card,.faq-section details,.booking-grid > div,.booking-form,.detail-grid > *,.empty-state,.prose > h2,.footer-refined > *,.payment-heading,.payment-methods > li')];
  const positions=new Map();
  const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-revealed');reveal.unobserve(entry.target);}},{threshold:.06,rootMargin:'0px 0px -12px 0px'});
  for(const el of targets){const index=positions.get(el.parentElement)||0;positions.set(el.parentElement,index+1);el.style.setProperty('--reveal-delay',`${Math.min(index,4)*55}ms`);el.classList.add('motion-reveal');reveal.observe(el);}
  cleanup.push(()=>{reveal.disconnect();for(const el of targets){el.classList.remove('motion-reveal','is-revealed');el.style.removeProperty('--reveal-delay');}});
  on(document,'focusin',event=>{for(let el=event.target;el;el=el.parentElement)if(el.classList?.contains('motion-reveal'))el.classList.add('is-revealed');});

  const header=document.querySelector('.site-header'),progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let scrollFrame=0,maxScroll=0,scrolled=false;
  const updateScroll=()=>{scrollFrame=0;progress.style.transform=`scaleX(${maxScroll>0?Math.min(1,Math.max(0,scrollY/maxScroll)):0})`;const next=scrollY>24;if(next!==scrolled){scrolled=next;header?.classList.toggle('is-scrolled',next);}};
  const queueScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);};
  const layout=new ResizeObserver(()=>{maxScroll=Math.max(0,document.documentElement.scrollHeight-innerHeight);queueScroll();});layout.observe(document.body);
  on(window,'scroll',queueScroll,{passive:true});on(window,'resize',()=>{maxScroll=Math.max(0,document.documentElement.scrollHeight-innerHeight);queueScroll();},{passive:true});queueScroll();
  cleanup.push(()=>{cancelAnimationFrame(scrollFrame);layout.disconnect();progress.remove();header?.classList.remove('is-scrolled');});

  const cards=createCardMotion(on);cleanup.push(cards.dispose);
  on(document,'click',event=>{if(!event.target.closest('[data-filter]'))return;for(const card of document.querySelectorAll('.course-card:not([hidden])')){card.classList.add('is-revealed');cards.enter(card);}});
  const visibility=()=>{document.documentElement.classList.toggle('motion-paused',document.hidden);cards.visibility();};on(document,'visibilitychange',visibility);visibility();
  const hero=document.querySelector('.hero-visual');if(hero)cleanup.push(createFluid(hero,on));
 }catch(error){dispose();console.warn('Motion enhancement unavailable:',error.message);}
}
function createCardMotion(on){
 const states=new Map();
 function sweep(state,delay=0){
  if(document.hidden||!state.visible||state.card.hidden)return;
  state.animation?.cancel();state.animation=state.sheen.animate([
   {transform:'translate3d(-48%,0,0) rotate(14deg)',opacity:0},
   {opacity:.42,offset:.28},{opacity:.3,offset:.62},
   {transform:'translate3d(48%,0,0) rotate(14deg)',opacity:0}
  ],{duration:1450,delay,easing:'cubic-bezier(.22,.61,.36,1)'});
 }
 function reset(state){cancelAnimationFrame(state.raf);state.raf=0;state.card.classList.remove('glass-active');state.card.style.removeProperty('--tilt-x');state.card.style.removeProperty('--tilt-y');state.rect=null;}
 const observer=new IntersectionObserver(entries=>{let index=0;for(const entry of entries){const state=states.get(entry.target);state.visible=entry.isIntersecting;entry.target.classList.toggle('motion-in-view',state.visible);if(state.visible)sweep(state,Math.min(index++,5)*65+150);else{state.animation?.cancel();reset(state);}}},{threshold:.08});
 for(const card of document.querySelectorAll('.service-row,.course-card,.location-card,.payment-methods > li,.social-links > a,.team-grid > article,.empty-state')){
  const sheen=document.createElement('span'),light=document.createElement('span');sheen.className='card-sheen';light.className='card-light';sheen.setAttribute('aria-hidden','true');light.setAttribute('aria-hidden','true');card.append(light,sheen);card.classList.add('glass-card');
  const state={card,sheen,light,animation:null,visible:false,raf:0,rect:null,x:0,y:0};states.set(card,state);observer.observe(card);
  on(card,'pointerenter',event=>{if(!fine.matches||event.pointerType==='touch')return;state.rect=card.getBoundingClientRect();card.classList.add('glass-active');sweep(state);});
  on(card,'pointermove',event=>{if(!fine.matches||event.pointerType==='touch'||document.hidden)return;state.x=event.clientX;state.y=event.clientY;if(state.raf)return;state.raf=requestAnimationFrame(()=>{state.raf=0;if(!state.visible)return;const rect=state.rect||(state.rect=card.getBoundingClientRect()),x=Math.min(rect.width,Math.max(0,state.x-rect.left)),y=Math.min(rect.height,Math.max(0,state.y-rect.top));light.style.transform=`translate3d(${x-130}px,${y-130}px,0)`;card.style.setProperty('--tilt-x',`${(y/rect.height-.5)*-2.4}deg`);card.style.setProperty('--tilt-y',`${(x/rect.width-.5)*2.4}deg`);});},{passive:true});
  on(card,'pointerleave',()=>reset(state));on(card,'pointercancel',()=>reset(state));
  // Passive touch feedback never captures a gesture or blocks a link or native scrolling.
  on(card,'pointerdown',()=>sweep(state),{passive:true});on(card,'focusin',()=>sweep(state));
 }
 on(window,'scroll',()=>{for(const state of states.values())state.rect=null;},{passive:true});
 return {enter(card){const state=states.get(card);if(state)sweep(state);},visibility(){for(const state of states.values())if(document.hidden){state.animation?.cancel();reset(state);}else if(state.visible)sweep(state);},dispose(){observer.disconnect();for(const state of states.values()){state.animation?.cancel();reset(state);state.card.classList.remove('glass-card','motion-in-view');state.sheen.remove();state.light.remove();}states.clear();}};
}
function createFluid(host,on){
 const photo=host.querySelector('.hero-photo img');if(!photo)return()=>{};
 let canvas,gl,program,vs,fs,buffer,texture,uniforms,disposed=false,loaded=false,lost=false,inView=false,raf=0,timer=0,idle=0,idleIsTimeout=false,presented=false;
 let last=0,deadline=0,elapsed=0,rect=null,mouse={x:.64,y:.5},smooth={x:.64,y:.5};
 const interval=1000/(fine.matches?30:24);
 const vert='attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}';
 const frag=`precision mediump float;
 uniform sampler2D u_image;uniform vec2 u_inverseResolution,u_uvScale,u_pointer;uniform float u_time;
 vec3 imageAt(vec2 uv){return texture2D(u_image,clamp(uv,.002,.998)).rgb;}
 void main(){
 vec2 uv=gl_FragCoord.xy*u_inverseResolution;float t=u_time*.24;
 float aspect=u_inverseResolution.y/u_inverseResolution.x;vec2 p=uv-.5;p.x*=aspect;
 float phase=p.x*2.8+p.y*1.5+sin(p.y*3.1+t)*.42-t*.65;
 float fold=sin(phase*3.8);float r=max(0.,1.-abs(fold));float r2=r*r;float r4=r2*r2;float ridge=r4*r4*r4;
 vec2 mouse=uv-u_pointer;mouse.x*=aspect;float lens=exp(-dot(mouse,mouse)*13.);
 vec2 normal=vec2(cos(phase*3.8)*.65,sin(phase*3.8+1.1)*.48);
 vec2 bend=normal*(.006+.017*ridge)+mouse*lens*.055;
 vec2 sampleUV=(uv+bend-.5)*u_uvScale+.5;
 vec2 dispersion=normal*(.0018*ridge+.0008*lens)*u_uvScale;
 vec3 color=vec3(imageAt(sampleUV+dispersion).r,imageAt(sampleUV).g,imageAt(sampleUV-dispersion).b);
 float g=max(0.,1.-abs(fold-.09));float g2=g*g;float g4=g2*g2;float g8=g4*g4;float g16=g8*g8;float glint=g16*g16*g8;
 float s=max(0.,1.-abs(fold+.16));float s2=s*s;float s4=s2*s2;float shadow=s4*s4*s4*s2;
 color*=1.-shadow*.045;
 color+=vec3(.80,.91,.72)*ridge*.085+vec3(1.,.96,.84)*glint*.12;
 float rim=exp(-abs(length(mouse)-.225)*150.)*lens;color+=vec3(.84,.94,.78)*rim*.10;
 gl_FragColor=vec4(color,1.);
 }`;
 const paused=()=>document.hidden||document.body.classList.contains('menu-open');
 const visible=()=>loaded&&inView&&!paused()&&!lost&&!disposed;
 function stop(){cancelAnimationFrame(raf);clearTimeout(timer);raf=timer=0;last=0;}
 function release(){if(!gl||lost)return;if(texture)gl.deleteTexture(texture);if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);texture=buffer=program=vs=fs=null;}
 function fallback(){loaded=false;stop();release();canvas?.remove();host.classList.add('fluid-fallback');}
 function shader(type,source){const result=gl.createShader(type);gl.shaderSource(result,source);gl.compileShader(result);if(!gl.getShaderParameter(result,gl.COMPILE_STATUS)){gl.deleteShader(result);throw Error('Shader compile failed');}return result;}
 function resize(){
  rect=null;if(!gl||lost||disposed)return;
  const bounds=host.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,fine.matches?1.25:1),width=Math.max(1,Math.round(bounds.width*ratio)),height=Math.max(1,Math.round(bounds.height*ratio));
  // Do not clear/reallocate the drawing buffer for duplicate ResizeObserver notifications.
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
  gl.uniform2f(uniforms.resolution,1/width,1/height);
  const screen=width/height,image=(photo.naturalWidth||1120)/(photo.naturalHeight||1400);gl.uniform2f(uniforms.scale,Math.min(screen/image,1),Math.min(image/screen,1));
 }
 function render(now){
  raf=0;if(!visible())return;
  if(last)elapsed+=Math.min((now-last)/1000,.1);else deadline=now;last=now;
  const drift=fine.matches?0:.025;const x=mouse.x+Math.sin(elapsed*.45)*drift,y=mouse.y+Math.cos(elapsed*.38)*drift;
  const blend=1-Math.exp(-interval/190);smooth.x+=(x-smooth.x)*blend;smooth.y+=(y-smooth.y)*blend;
  gl.uniform2f(uniforms.pointer,smooth.x,smooth.y);gl.uniform1f(uniforms.time,elapsed);gl.drawArrays(gl.TRIANGLES,0,3);
  if(!presented){canvas.dataset.ready='true';presented=true;}
  // One rAF per rendered frame. A deadline prevents the old 30→20 fps cadence drift.
  deadline+=interval;if(deadline<now+4)deadline=now+interval;
  timer=setTimeout(()=>{timer=0;if(visible())raf=requestAnimationFrame(render);},Math.max(0,deadline-performance.now()-4));
 }
 function sync(){if(visible()&&!raf&&!timer)raf=requestAnimationFrame(render);else if(!visible())stop();}
 function init(){
  idle=0;if(disposed||gl||!inView||paused())return;
  canvas=document.createElement('canvas');canvas.className='fluid-canvas';canvas.setAttribute('aria-hidden','true');host.append(canvas);
  gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
  if(!gl){fallback();return;}
  on(canvas,'webglcontextlost',event=>{event.preventDefault();lost=true;stop();canvas.removeAttribute('data-ready');presented=false;host.classList.add('fluid-fallback');});
  on(canvas,'webglcontextrestored',()=>{if(disposed)return;lost=loaded=false;program=vs=fs=buffer=texture=null;allocate();});
  allocate();
 }
 function allocate(){
  try{
   vs=shader(gl.VERTEX_SHADER,vert);fs=shader(gl.FRAGMENT_SHADER,frag);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link failed');gl.useProgram(program);
   buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
   texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.uniform1i(gl.getUniformLocation(program,'u_image'),0);
   uniforms={resolution:gl.getUniformLocation(program,'u_inverseResolution'),scale:gl.getUniformLocation(program,'u_uvScale'),time:gl.getUniformLocation(program,'u_time'),pointer:gl.getUniformLocation(program,'u_pointer')};
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,photo);resize();loaded=true;
   host.classList.remove('fluid-fallback');sync();
  }catch{fallback();}
 }
 function schedule(){
  if(disposed||gl||idle||!inView||paused()||!photo.complete||!photo.naturalWidth)return;
  // Let the browser paint the full-quality image before compiling/uploading the effect.
  if('requestIdleCallback' in window){idleIsTimeout=false;idle=requestIdleCallback(init,{timeout:700});}else{idleIsTimeout=true;idle=setTimeout(init,80);}
 }
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;host.classList.toggle('motion-in-view',inView);schedule();sync();},{threshold:0});observer.observe(host);
 const size=new ResizeObserver(resize);size.observe(host);
 const menuState=new MutationObserver(()=>{schedule();sync();});menuState.observe(document.body,{attributes:true,attributeFilter:['class']});
 on(photo,'load',schedule);on(photo,'error',fallback);
 on(host,'pointerenter',()=>{rect=host.getBoundingClientRect();},{passive:true});
 on(host,'pointermove',event=>{const bounds=rect||(rect=host.getBoundingClientRect());mouse.x=Math.min(1,Math.max(0,(event.clientX-bounds.left)/bounds.width));mouse.y=Math.min(1,Math.max(0,1-(event.clientY-bounds.top)/bounds.height));},{passive:true});
 on(host,'pointerleave',()=>{mouse={x:.64,y:.5};rect=null;});on(host,'pointercancel',()=>{mouse={x:.64,y:.5};});on(window,'scroll',()=>{rect=null;},{passive:true});
 on(document,'visibilitychange',()=>{schedule();sync();});
 return()=>{disposed=true;stop();if(idle){if(idleIsTimeout)clearTimeout(idle);else cancelIdleCallback(idle);}observer.disconnect();size.disconnect();menuState.disconnect();canvas?.remove();host.classList.remove('fluid-fallback','motion-in-view');release();if(gl&&!lost)gl.getExtension('WEBGL_lose_context')?.loseContext();};
}
reduce.addEventListener('change',setup);fine.addEventListener('change',setup);setup();
window.addEventListener('pagehide',()=>dispose());window.addEventListener('pageshow',event=>{if(event.persisted)setup();});
})();
