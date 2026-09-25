export function createBeans(canvas){
const ctx=canvas.getContext("2d");let cw=0,ch=0;const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles=Array.from({length:30},(_,i)=>({x:((i*47+13)%101)/100,y:((i*31+9)%97)/100,size:9+(i*7%23),rot:i*2.7,speed:.25+(i%5)/7,depth:(i%4)/3,phase:i*1.38}));
  function drawBeans(time,progress){
    if(!ctx)return;ctx.clearRect(0,0,cw,ch);
    for(const p of particles){const t=reduced?0:progress*.7*p.speed;const depth=.45+p.depth*.65;const x=p.x*cw+Math.sin(t+p.phase)*24;const y=p.y*ch+Math.cos(t*.8+p.phase)*35;const turn=Math.cos(t+p.phase);ctx.save();ctx.translate(x,y);ctx.rotate(p.rot+t*.6);ctx.scale(.55+Math.abs(turn)*.45,.72);ctx.globalAlpha=.58+p.depth*.4;if(p.depth<.2)ctx.filter='blur(1.5px)';
      const g=ctx.createRadialGradient(-p.size*.34,-p.size*.47,0,0,0,p.size*1.1);g.addColorStop(0,'#82705a');g.addColorStop(.25,'#59412b');g.addColorStop(.65,'#352315');g.addColorStop(1,'#160f09');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,p.size,p.size*.78,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#100b07';ctx.lineWidth=2.1;ctx.beginPath();ctx.moveTo(-p.size*.86,-1);ctx.bezierCurveTo(-p.size*.25,p.size*.32,p.size*.1,-p.size*.34,p.size*.84,1);if(turn>-.25)ctx.stroke();
      ctx.strokeStyle='#b2966c35';ctx.lineWidth=.75;ctx.beginPath();ctx.moveTo(-p.size*.72,-3);ctx.bezierCurveTo(-p.size*.2,p.size*.25,p.size*.08,-p.size*.37,p.size*.75,-2);if(turn>-.25)ctx.stroke();ctx.restore();
    }
  }

return {draw(progress){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio,1.5);if(cw!==r.width||ch!==r.height){cw=r.width;ch=r.height;canvas.width=cw*d;canvas.height=ch*d;ctx?.setTransform(d,0,0,d,0,0)}drawBeans(0,progress)}};
}
