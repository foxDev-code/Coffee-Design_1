export const products=[
  {id:'espresso',name:'Espresso',price:250,description:'A small cup. A good start.'},
  {id:'latte',name:'Latte',price:420,description:'Smooth espresso and silky milk.'},
  {id:'matcha',name:'Iced coffee',price:450,description:'The iced favorite from our daily menu.'},
  {id:'roll',name:'Cinnamon roll',price:380,description:'Soft, sweet, and freshly baked.'}
];
export const money=cents=>'$'+(cents/100).toFixed(2);
export function sanitizeBasket(value){return Object.fromEntries(products.filter(p=>Number.isInteger(value?.[p.id])&&value[p.id]>0).map(p=>[p.id,Math.min(99,value[p.id])]))}
export function changeQuantity(basket,id,delta){
  if(!products.some(p=>p.id===id)||!Number.isInteger(delta))return basket;
  const next={...basket,[id]:Math.max(0,Math.min(99,(basket[id]||0)+delta))};
  if(!next[id])delete next[id];
  return next;
}
export const basketTotal=basket=>products.reduce((sum,p)=>sum+p.price*(basket[p.id]||0),0);
