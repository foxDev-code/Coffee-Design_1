import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {createBeans} from './beans.js';
gsap.registerPlugin(ScrollTrigger);

export function initMotion(root){
  const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
  const listeners=new AbortController(),media=gsap.matchMedia();let disposed=false,products=null;
  // Three is a separate local chunk. The existing image stays available during loading.
  import('./scenes.js').then(({createProductScenes})=>{if(!disposed)products=createProductScenes(root)}).catch(error=>console.warn('3D unavailable; image fallback retained:',error.message));
  const beans=createBeans($('#beans'));
  const originalLabels=new Map($$('.product-meta>span,.product-number').map(el=>[el,el.textContent]));
  media.add({reduced:'(prefers-reduced-motion: reduce)',regular:'(prefers-reduced-motion: no-preference)'},context=>{
    const reduced=context.conditions.reduced;
    const pose={x:.2,y:0,z:.2},storyPose={x:.22,y:-.12,z:-.18},beanPose={progress:0};
    let heroActive=true,storyActive=false,dirty=true;
    const visibility=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.target===$('#home'))heroActive=e.isIntersecting;else storyActive=e.isIntersecting;dirty=true}),{rootMargin:'100px'});
    visibility.observe($('#home'));visibility.observe($('#story'));
    function draw(){if(document.hidden)return;
      const scenes=products?.scenes;
      if(heroActive){scenes?.hero?.render(pose.x,pose.y,pose.z);scenes?.bag?.render(-.04+(pose.x-.2)*.18,-.28+pose.y*.33,-.1+(pose.z-.2)*.3)}
      if(storyActive){scenes?.story?.render(storyPose.x,storyPose.y,storyPose.z);if(!reduced||dirty)beans.draw(beanPose.progress)}
      dirty=false;
    }
    gsap.ticker.add(draw);
    const intro=gsap.timeline({defaults:{ease:'power3.out'}}),load={value:0};
    const revealElements=$$('.reveal');
    function revealTimeline(el){
      const tl=gsap.timeline({paused:true}),lines=el.querySelectorAll('.motion-line>.line-content'),words=el.querySelectorAll('.word-reveal>span');
      if(lines.length){
        [...lines].forEach((line,i)=>{if(line.parentElement.tagName==='EM')tl.fromTo(line,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.7,ease:'none'},.21);else tl.fromTo(line,{yPercent:110},{yPercent:0,duration:.49,ease:'power3.out'},i*.049)});
      }else if(el.classList.contains('word-reveal')){
        tl.fromTo(el.querySelectorAll(':scope>span'),{y:7,opacity:0},{y:0,opacity:1,duration:.42,stagger:.0126,ease:'power2.out'});
      }else tl.fromTo(el,{opacity:0,y:8},{opacity:1,y:0,duration:.4,ease:'power2.out'});
      return tl;
    }
    if(reduced){gsap.set($('.loader'),{autoAlpha:0,display:'none'});document.body.classList.add('ready');gsap.set($$('.line-content,.word-reveal>span,.reveal'),{opacity:1,y:0,clipPath:'none'});gsap.set($('.receipt'),{yPercent:0});}
    else{
      // Animate SVG geometry directly: CSS transforms otherwise collapse the fill.
      gsap.set($('.coffee-fill'),{attr:{y:310,height:0}});
      intro.to(load,{value:100,duration:1.4,ease:'none',onUpdate(){ $('.load-count').textContent=String(Math.round(load.value)).padStart(2,'0');const height=270*load.value/100;gsap.set($('.coffee-fill'),{attr:{y:310-height,height}})}})
        .to($('.loader'),{autoAlpha:0,duration:.28,onStart(){document.body.classList.add('ready')},onComplete(){gsap.set($('.loader'),{display:'none'})}},'+=.105');
      revealElements.forEach(el=>{
        const tl=revealTimeline(el);
        if(el.closest('.hero'))intro.add(tl.play(),1.52);
        else ScrollTrigger.create({trigger:el,start:'top 92%',animation:tl,toggleActions:'play none none reverse'});
      });
      intro.fromTo($$('.site-header nav a,.site-header>.wordmark,.order-link,.hero-bottom>div,.hero-bottom>a'),{opacity:0,y:-5},{opacity:1,y:0,duration:.35,stagger:.04},1.52);
      $$('.product-card').forEach((card,index)=>{
        const tl=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});
        tl.fromTo(card.querySelector('img'),{opacity:0,y:20},{opacity:1,y:0,duration:.49},index*.04);
        [...card.querySelectorAll('.product-meta>span,.product-number')].forEach((el,i)=>{
          const text=originalLabels.get(el),start=index*.084+i*.063;
          el.setAttribute('aria-label',text);
          if(text.startsWith('$')){
            el.replaceChildren();
            [...text].forEach((character,j)=>{
              const cell=document.createElement('span');cell.setAttribute('aria-hidden','true');
              if(!/\d/.test(character)){cell.textContent=character;el.append(cell);return}
              cell.className='price-digit';const strip=document.createElement('span');strip.className='price-strip';
              const steps=10+Number(character);
              for(let n=0;n<=steps;n++){const digit=document.createElement('span');digit.textContent=n%10;strip.append(digit)}
              cell.append(strip);el.append(cell);
              tl.fromTo(strip,{y:'0em'},{y:-steps+'em',duration:.735},start+j*.0245);
            });
          }else{
            const state={length:0};
            tl.to(state,{length:text.length,duration:.56,ease:'none',onUpdate(){el.textContent=text.slice(0,Math.floor(state.length))+'\u00a0'.repeat(text.length-Math.floor(state.length))}},start);
          }
        });
        card.setAttribute('aria-label',[...card.querySelectorAll('.product-meta>span')].map(el=>originalLabels.get(el)).join(' '));
        ScrollTrigger.create({trigger:card,start:'top 90%',animation:tl,toggleActions:'restart none none reverse'});
      });
      gsap.fromTo($('.clock-drink'),{rotation:0},{rotation:32.5,ease:'none',scrollTrigger:{trigger:$('#locations'),start:'top 10%',end:'bottom top',scrub:.16}});
      gsap.to(storyPose,{x:.26,y:-.24,z:-.21,ease:'none',scrollTrigger:{trigger:$('#story'),start:'top bottom',end:'bottom top',scrub:.16}});
      gsap.fromTo(beanPose,{progress:-1},{progress:1.3,ease:'none',scrollTrigger:{trigger:$('#story'),start:'top bottom',end:'bottom top',scrub:.16}});
      gsap.fromTo($('.receipt'),{yPercent:-103},{yPercent:0,ease:'none',scrollTrigger:{trigger:$('#order'),start:'top 85%',end:'top 20%',scrub:.14}});
      $$('.paper-word').forEach(el=>gsap.fromTo(el,{y:-60},{y:70,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:.2}}));
      gsap.fromTo($('.order-backdrop'),{y:20},{y:-25,ease:'none',scrollTrigger:{trigger:$('#order'),start:'top bottom',end:'bottom top',scrub:.2}});
    }
    // Shared scroll state uses native scrolling; no competing wheel interception.
    ScrollTrigger.create({start:0,end:'max',onUpdate:self=>gsap.set($('.page-progress span'),{scaleY:self.progress,transformOrigin:'top'})});
    ScrollTrigger.create({trigger:$('#menu'),start:'top 40px',endTrigger:$('#story'),end:'top 40px',onToggle:self=>$('.site-header').classList.toggle('on-light',self.isActive)});
    const stage=$('.hero-stage'),hover=$('.product-hover');
    const followX=gsap.quickTo(pose,'x',{duration:.28,ease:'power3.out'}),followY=gsap.quickTo(pose,'y',{duration:.28,ease:'power3.out'}),followZ=gsap.quickTo(pose,'z',{duration:.28,ease:'power3.out'});
    let dragging=false,originX=0,originY=0,startYaw=0;
    function show(isBag){$('.hover-label').textContent=isBag?'// In the bag':'// In the cup';$('.hover-name').textContent=isBag?'SLOW ROAST':'HOUSE LATTE';$('.hover-price').textContent=isBag?'$18.00':'$4.20';$('.hover-detail').textContent=isBag?'250 G · WHOLE BEAN · COPENHAGEN':'250 ML · BREWED DAILY · TO GO';hover.classList.add('show')}
    const events=new AbortController(),on=(el,type,fn)=>el.addEventListener(type,fn,{signal:events.signal});
    on(stage,'pointermove',e=>{if(e.pointerType==='touch')return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;show(x>.54);if(!reduced){followX(dragging?gsap.utils.clamp(-.1,.55,.2+(originY-e.clientY)*.0014):.2-(y-.5)*.12);followY(dragging?gsap.utils.clamp(-.9,.9,startYaw+(e.clientX-originX)*.004):(x-.5)*.32);followZ(.2+(x-.5)*.05)}});
    on(stage,'pointerdown',e=>{if(e.pointerType==='touch'){show(true);return}dragging=true;originX=e.clientX;originY=e.clientY;startYaw=pose.y;stage.setPointerCapture(e.pointerId)});
    on(stage,'pointerup',()=>{dragging=false});on(stage,'pointercancel',()=>{dragging=false});
    on(stage,'pointerleave',()=>{if(!dragging){hover.classList.remove('show');followX(.2);followY(0);followZ(.2)}});
    on(stage,'focus',()=>show(true));on(stage,'blur',()=>hover.classList.remove('show'));
    on(stage,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();show(e.key==='ArrowRight');if(!reduced){if(e.key==='ArrowLeft'||e.key==='ArrowRight')followY(gsap.utils.clamp(-.9,.9,pose.y+(e.key==='ArrowRight'?.14:-.14)));else followX(gsap.utils.clamp(-.1,.55,pose.x+(e.key==='ArrowUp'?.08:-.08)))}});
    const resize=new ResizeObserver(()=>{dirty=true;ScrollTrigger.refresh()});resize.observe($('main'));
    ScrollTrigger.refresh();
    return ()=>{events.abort();visibility.disconnect();resize.disconnect();gsap.ticker.remove(draw);originalLabels.forEach((text,el)=>{el.textContent=text});document.body.classList.remove('ready')};
  },root);
  function jumpToHash(){const id=decodeURIComponent(location.hash.slice(1));if(id){const target=document.getElementById(id);target?.scrollIntoView({behavior:'instant'})}ScrollTrigger.refresh()}
  document.fonts.ready.then(()=>{if(!disposed)jumpToHash()});
  window.addEventListener('load',jumpToHash,{once:true,signal:listeners.signal});
  return ()=>{disposed=true;listeners.abort();media.revert();products?.dispose()};
}
