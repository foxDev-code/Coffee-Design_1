import React,{useState,useRef,useEffect,useLayoutEffect,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {Loader,Sections} from './Sections.jsx';
import {products,money,sanitizeBasket,changeQuantity,basketTotal} from './basket.js';
import {initMotion} from './motion.js';

function App(){
  const root=useRef(null),dialog=useRef(null),confirmation=useRef(null),opener=useRef(null),toastTimer=useRef(null);
  const [menuOpen,setMenuOpen]=useState(false),[mobileOpen,setMobileOpen]=useState(false),[selected,setSelected]=useState(null);
  const [basket,setBasket]=useState(()=>{try{return sanitizeBasket(JSON.parse(localStorage.getItem('brewns-basket')||'{}'))}catch{return {}}});
  const [pickup,setPickup]=useState('139 Coffee Street'),[preview,setPreview]=useState(false),[toast,setToast]=useState('');
  const count=Object.values(basket).reduce((a,b)=>a+b,0),total=basketTotal(basket);
  const onOrder=useCallback(id=>{opener.current=document.activeElement;setSelected(typeof id==='string'?id:null);setPreview(false);setMenuOpen(true)},[]);
  const close=()=>{setMenuOpen(false);setPreview(false)};
  useLayoutEffect(()=>initMotion(root.current),[]);
  useEffect(()=>{try{localStorage.setItem('brewns-basket',JSON.stringify(basket))}catch{}},[basket]);
  useEffect(()=>()=>clearTimeout(toastTimer.current),[]);
  useEffect(()=>{
    if(menuOpen){if(!dialog.current.open)dialog.current.showModal();if(selected){const button=dialog.current.querySelector(`[data-menu-product="${selected}"] button`);button?.scrollIntoView({block:'nearest'});button?.focus({preventScroll:true})}}
    else if(dialog.current.open){dialog.current.close();opener.current?.focus({preventScroll:true})}
  },[menuOpen,selected]);
  useEffect(()=>{if(preview){confirmation.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});confirmation.current?.focus({preventScroll:true})}},[preview]);
  function change(id,delta){setBasket(b=>changeQuantity(b,id,delta));setPreview(false)}
  function add(p){change(p.id,1);setToast(p.name+' added to your order');clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),2200)}
  return <div ref={root}>
    <Loader />
    <header className="site-header"><nav className={mobileOpen?'open':''} aria-label="Main navigation">{[['home','Shop'],['menu','Menu'],['story','Our story'],['locations','Locations']].map(([id,name])=><a key={id} href={'#'+id} onClick={()=>setMobileOpen(false)}>{name}</a>)}</nav><a className="wordmark" href="#home" aria-label="Brewns home">brewns<sup>®</sup></a><button className="order-link" onClick={onOrder}>Order online <span>↗</span><span className="cart-count" hidden={!count}>{count}</span></button><button className="mobile-toggle" aria-label={mobileOpen?'Close navigation':'Open navigation'} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?'✕':'☰'}</button></header>
    <Sections onOrder={onOrder}/>
    <div className="page-progress" aria-hidden="true"><span /></div><div className="viewport-frame" aria-hidden="true"/>
    <dialog ref={dialog} id="menu-dialog" aria-labelledby="dialog-title" onCancel={close} onClose={()=>setMenuOpen(false)} onClick={e=>{if(e.target===dialog.current){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
      <div className="dialog-header"><span className="wordmark">brewns<sup>®</sup></span><button className="close-dialog" aria-label="Close menu" onClick={close}>✕</button></div><p className="eyebrow">// Made daily</p><h2 id="dialog-title">YOUR NEXT<br/>GOOD MOMENT.</h2>
      <div className="dialog-products">{products.map(p=><article key={p.id} className="dialog-product" data-menu-product={p.id}><img src={'assets/'+p.id+'.png'} alt={p.name}/><div><h3>{p.name} · {money(p.price)}</h3><p>{p.description}</p></div><button aria-label={'Add '+p.name+' to order'} onClick={()=>add(p)}>+</button></article>)}</div>
      <div className="basket-section"><h3 className="mono">YOUR ORDER <span id="basket-count">{count}</span></h3><div id="basket-items">{products.filter(p=>basket[p.id]).map(p=><div key={p.id} className="basket-item"><span>{p.name}</span><div className="quantity"><button aria-label={'Remove one '+p.name} onClick={()=>change(p.id,-1)}>−</button><span>{basket[p.id]}</span><button aria-label={'Add one '+p.name} onClick={()=>change(p.id,1)}>+</button><span>{money(p.price*basket[p.id])}</span><button className="remove" aria-label={'Remove '+p.name+' from order'} onClick={()=>change(p.id,-99)}>×</button></div></div>)}</div><p id="empty-basket" hidden={count>0}>Choose something good from the menu above.</p><div className="basket-total mono"><span>Total</span><strong id="basket-total">{money(total)}</strong></div><label className="pickup-label mono" htmlFor="pickup">PICKUP LOCATION</label><select id="pickup" value={pickup} onChange={e=>setPickup(e.target.value)}>{['139 Coffee Street','310 Valencia Street','56 Columbus Avenue'].map(place=><option key={place}>{place}</option>)}</select><button className="checkout" disabled={!count} onClick={()=>setPreview(true)}>PREVIEW ORDER <span>↗</span></button><p className="demo-note">Local website demo. Orders and payments are not sent.</p></div>
      <div ref={confirmation} id="order-confirmation" hidden={!preview} aria-live="polite" tabIndex={-1}>{preview&&<><h3>YOUR MOMENT,<br/>READY TO PREVIEW.</h3>{products.filter(p=>basket[p.id]).map(p=><div key={p.id}>{basket[p.id]} × {p.name} — {money(basket[p.id]*p.price)}</div>)}<p><strong>TOTAL {money(total)}</strong><br/>Pickup: {pickup}</p><p>This is a local order preview. No order has been placed and no payment has been taken.</p><button className="back-menu" onClick={()=>{setPreview(false);dialog.current.querySelector('.checkout').focus()}}>BACK TO MENU ↑</button></>}</div>
    </dialog><div className={'toast mono'+(toast?' show':'')} role="status" aria-live="polite">{toast}</div>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
