import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeBasket,changeQuantity,basketTotal} from './basket.js';
test('stored input, price arithmetic and quantity boundaries remain safe',()=>{
  assert.deepEqual(sanitizeBasket({espresso:1000,latte:-4,matcha:'2',unknown:8}),{espresso:99});
  assert.deepEqual(sanitizeBasket(null),{});
  let basket=changeQuantity({},'espresso',1);
  basket=changeQuantity(basket,'latte',2);
  assert.equal(basketTotal(basket),1090);
  assert.equal(changeQuantity(basket,'unknown',1),basket);
  basket=changeQuantity(basket,'espresso',-99);
  assert.equal(basketTotal(basket),840);
  assert.equal(changeQuantity(basket,'latte',1000).latte,99);
});
