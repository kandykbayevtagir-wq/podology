/* Podology MK: progressive motion enhancement; no external libraries. */
(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
let dispose=()=>{};
function setup(){dispose();if(reduce.matches)return;const cleanup=[];const on=(target,event,fn,opts)=>{target.addEventListener(event,fn,opts);cleanup.push(()=>target.removeEventListener(event,fn,opts));};
try{
 document.documentElement.classList.add('motion-ready');
 const selectors=['.hero-copy > *','.hero-visual','.page-intro > *','.section-heading','.service-row','.course-card','.about-grid > *','.two-columns > div','.team-grid > article','.location-card','.faq-section details','.booking-grid > div','.booking-form','.team-teaser > div','.learning-gallery > *','.insole-feature > *','.detail-grid > *','.empty-state','.prose > *','.footer-grid > div'];
 const targets=[...new Set(document.querySelectorAll(selectors.join(',')))];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}},{threshold:.08,rootMargin:'0px 0px -22px 0px'});
 for(const el of targets){if(el.closest('.prose')&&el.tagName==='P')continue;el.classList.add('motion-reveal');const siblings=[...el.parentElement.children].filter(x=>targets.includes(x));el.style.setProperty('--reveal-delay',`${Math.min(siblings.indexOf(el),4)*65}ms`);observer.observe(el);}
 cleanup.push(()=>{observer.disconnect();targets.forEach(el=>{el.classList.remove('motion-reveal','is-revealed');el.style.removeProperty('--reveal-delay');});document.documentElement.classList.remove('motion-ready');});
 // Keep keyboard navigation immediate, including off-screen controls.
 on(document,'focusin',e=>{for(let el=e.target;el;el=el.parentElement)if(el.classList?.contains('motion-reveal'))el.classList.add('is-revealed');});
 const header=document.querySelector('.site-header'),progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);let queued=false;
 const updateScroll=()=>{queued=false;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;header?.classList.toggle('is-scrolled',scrollY>24);};
 on(window,'scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();cleanup.push(()=>{progress.remove();header?.classList.remove('is-scrolled');});
 // Entering cards after a filter change should never remain transparent.
 on(document,'click',e=>{if(e.target.closest('[data-filter]')){document.querySelectorAll('.course-card:not([hidden])').forEach((card,i)=>{card.classList.add('is-revealed');card.animate([{opacity:0,transform:'translateY(16px)',filter:'blur(4px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:440,delay:Math.min(i,4)*40,easing:'cubic-bezier(.2,.75,.2,1)',fill:'backwards'});});}});
 if(fine.matches){for(const card of document.querySelectorAll('.course-card,.location-card')){let frame=0;on(card,'pointermove',e=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const rect=card.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width,y=(e.clientY-rect.top)/rect.height;card.style.setProperty('--pointer-x',`${x*100}%`);card.style.setProperty('--pointer-y',`${y*100}%`);card.style.setProperty('--tilt-x',`${(y-.5)*-3}deg`);card.style.setProperty('--tilt-y',`${(x-.5)*3}deg`);});});on(card,'pointerleave',()=>{cancelAnimationFrame(frame);frame=0;card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});cleanup.push(()=>{cancelAnimationFrame(frame);card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');});}}
 const hero=document.querySelector('.hero-visual');if(hero)cleanup.push(createFluid(hero,on));
}catch(error){document.documentElement.classList.remove('motion-ready');console.warn('Motion enhancement unavailable:',error.message);}
 dispose=()=>{cleanup.reverse().forEach(fn=>fn());document.querySelectorAll('.motion-reveal').forEach(el=>el.classList.remove('motion-reveal','is-revealed'));};
}
function createFluid(host,on){
 const canvas=document.createElement('canvas');canvas.className='fluid-canvas';canvas.setAttribute('aria-hidden','true');host.append(canvas);
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power',premultipliedAlpha:false});
 if(!gl){canvas.remove();host.classList.add('fluid-fallback');return()=>host.classList.remove('fluid-fallback');}
 const vert=`attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}`;
 const frag=`precision mediump float;
 uniform vec2 u_resolution;uniform vec2 u_pointer;uniform float u_time;
 float ribbon(float d,float w){return exp(-abs(d)*w);}
 void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;vec2 p=uv-.5;p.x*=u_resolution.x/u_resolution.y;
 float t=u_time*.22;vec2 mouse=u_pointer-.5;
 float wave=sin(p.x*3.8+t+sin(p.y*2.8-t)*.75)*.18;
 float flow=p.y+wave+sin(p.x*6.-t*.7)*.045;
 float glow=ribbon(flow-.12,8.5);float fold=ribbon(flow+.20+mouse.x*.04,15.);
 float veil=.5+.5*sin(flow*9.+t*1.4);
 vec3 sage=vec3(.64,.76,.64);vec3 pearl=vec3(.97,.94,.84);vec3 gold=vec3(.78,.66,.46);
 vec3 color=mix(sage,pearl,veil);color=mix(color,gold,fold*.33);
 float pointerGlow=exp(-length(uv-u_pointer)*4.);
 float contour=pow(.5+.5*sin(flow*48.+t),18.)*.13*glow;
 float alpha=(glow*.31+fold*.22+pointerGlow*.09+contour)*(.65+.35*sin(uv.y*3.14159));
 gl_FragColor=vec4(color,alpha);
 }`;
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Shader compile failed');}return s;}
 let program,vs,fs,buffer;
 try{vs=shader(gl.VERTEX_SHADER,vert);fs=shader(gl.FRAGMENT_SHADER,frag);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link failed');gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);}catch{if(program)gl.deleteProgram(program);if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);if(buffer)gl.deleteBuffer(buffer);canvas.remove();host.classList.add('fluid-fallback');return()=>host.classList.remove('fluid-fallback');}
 const resolution=gl.getUniformLocation(program,'u_resolution'),time=gl.getUniformLocation(program,'u_time'),pointer=gl.getUniformLocation(program,'u_pointer');
 let raf=0,inView=true,lost=false,last=0,elapsed=0,previous=0,mouse={x:.5,y:.5},smooth={x:.5,y:.5};const fps=fine.matches?30:24;
 const resize=()=>{const rect=host.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,fine.matches?1.35:1);canvas.width=Math.max(1,Math.round(rect.width*ratio));canvas.height=Math.max(1,Math.round(canvas.getBoundingClientRect().height*ratio));gl.viewport(0,0,canvas.width,canvas.height);};
 const visible=()=>inView&&!document.hidden&&!lost;
 function frame(now){raf=0;if(!visible())return;raf=requestAnimationFrame(frame);if(now-last<1000/fps)return;last=now;if(previous)elapsed+=Math.min((now-previous)/1000,.06);previous=now;smooth.x+=(mouse.x-smooth.x)*.07;smooth.y+=(mouse.y-smooth.y)*.07;gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform2f(pointer,smooth.x,smooth.y);gl.uniform1f(time,elapsed);gl.drawArrays(gl.TRIANGLES,0,6);canvas.dataset.frames=String(Number(canvas.dataset.frames||0)+1);}
 function sync(){if(visible()&&!raf){previous=0;raf=requestAnimationFrame(frame);}else if(!visible()){cancelAnimationFrame(raf);raf=0;}}
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();});observer.observe(host);const size=new ResizeObserver(resize);size.observe(host);resize();
 on(host,'pointermove',e=>{const r=host.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width;mouse.y=1-(e.clientY-r.top)/r.height;},{passive:true});on(host,'pointerleave',()=>{mouse={x:.5,y:.5};});on(document,'visibilitychange',sync);
 on(canvas,'webglcontextlost',e=>{e.preventDefault();lost=true;host.classList.add('fluid-fallback');sync();});on(canvas,'webglcontextrestored',()=>{canvas.remove();host.classList.add('fluid-fallback');});sync();
 return()=>{cancelAnimationFrame(raf);observer.disconnect();size.disconnect();canvas.remove();host.classList.remove('fluid-fallback');if(!lost){gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
}
reduce.addEventListener('change',setup);setup();window.addEventListener('pagehide',()=>dispose());window.addEventListener('pageshow',e=>{if(e.persisted)setup();});
})();
