export function createLabelCanvases(){
  const texture=document.createElement('canvas');texture.width=2048;texture.height=1024;
  const c=texture.getContext('2d');c.fillStyle='#ede9df';c.fillRect(0,0,2048,1024);
  c.fillStyle='#171715';c.textAlign='center';
  c.font='bold 156px Arial';c.fillText('brewns',1024,275,670);
  c.font='30px Arial';c.fillText('®',1375,189);
  c.font='35px Arial';c.fillText('C O F F E E   H O U S E',1024,339,640);
  c.strokeStyle='#68685f';c.lineWidth=2;
  [453,686].forEach(y=>{c.beginPath();c.moveTo(740,y);c.lineTo(1310,y);c.stroke();});
  c.font='34px Arial';c.fillText('GOOD COFFEE',1024,543);c.fillText('GOOD MOOD',1024,590);
  c.font='28px Arial';c.fillText('250 ML',863,799);c.fillText('BREWED',1175,772);c.fillText('DAILY',1175,820);
  c.beginPath();c.moveTo(1020,721);c.lineTo(1020,860);c.stroke();
  const bagTexture=document.createElement('canvas');bagTexture.width=1024;bagTexture.height=2048;
  const b=bagTexture.getContext('2d');b.fillStyle='#efece1';b.fillRect(0,0,1024,2048);
  b.fillStyle='#1b1b18';b.textAlign='left';b.font='25px Consolas';b.fillText('ROAST DATE',90,120);b.fillText('12/05/24',735,120);
  b.strokeStyle='#a5a397';b.lineWidth=2;[180,215,244,1775].forEach(y=>{b.beginPath();b.moveTo(30,y);b.lineTo(994,y);b.stroke();});
  b.font='italic bold 154px Arial';b.fillText('brewns',95,560,820);b.font='27px Arial';b.fillText('®',895,468);b.font='36px Arial';b.fillText('C O F F E E  H O U S E',116,626,770);
  b.fillStyle='#696b61';b.font='italic 215px "Segoe Script", cursive';b.fillText('slow',66,942,840);b.fillText('roast',94,1130,820);
  b.fillStyle='#292b24';b.font='30px Arial';['CRAFT ROASTED IN','SMALL BATCHES.','DESIGNED FOR A CLEAN','SWEETNESS, BALANCED','ACIDITY AND A','SMOOTH FINISH.'].forEach((t,i)=>b.fillText(t,88,1310+i*52,440));
  b.fillText('FLAVOR NOTES',595,1330);['CARAMEL','BROWN SUGAR','ROASTED ALMOND'].forEach((t,i)=>b.fillText(t,595,1450+i*65,345));
  b.beginPath();b.moveTo(550,1250);b.lineTo(550,1680);b.moveTo(580,1390);b.lineTo(950,1390);b.moveTo(80,1720);b.lineTo(950,1720);b.stroke();b.fillText('WHOLE BEAN',88,1820);b.fillText('ROASTED IN',620,1810);b.fillText('COPENHAGEN',620,1860);

return {cup:texture,bag:bagTexture};
}
