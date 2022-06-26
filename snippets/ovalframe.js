g.clear();
//th = 3
//x1=20, y1=43;
//r = 21

function ur_corner(x1, y1, r, th){
  urcorn_o = [x1, y1, x1+r,y1, x1+r,y1+r];
  urcorn_i = [x1+r-th,y1+r,  x1+r-th,y1+th, x1,y1+th ];
  urbcv_o = g.quadraticBezier(urcorn_o, 10);
  urbcv_i = g.quadraticBezier(urcorn_i, 2);
  console.log(urbcv_o);
  console.log(urbcv_o.concat(urbcv_i));
  g.drawPoly(urbcv_o.concat(urbcv_i), true);
  //g.drawPoly(urbcv_i, false);
}

function ul_corner(x1, y1, r, th){
  urcorn_o = [x1, y1, x1-r,y1, x1-r,y1-r];
  urcorn_i = [x1,y1+th, x1-r-th,y1+th, x1-r-th,y1-r];
  urbcv_o = g.quadraticBezier(urcorn_o, 4);
  urbcv_i = g.quadraticBezier(urcorn_i, 3).reverse();

  g.drawPoly(urbcv_o, false);
  g.drawPoly(urbcv_i, false);
}


function thickring(x,y, r, th){
  g.setColor(0,0,0);
  g.fillCircle(x,y,r);
  g.setColor(255,255,255);
  g.fillCircle(x,y,r-th);
  
}
h = g.getHeight();
w = g.getWidth();

console.log(g.getHeight());
ur_corner(20, 43, 21, 4);
//ul_corner(70, 83, 21, 3);
rad = 18
thickring(0+rad,0+rad, rad, 3);
thickring(w-rad-1,0+rad, rad, 3);
thickring(0+rad,h-rad-1, rad, 3);
thickring(w-rad-1,h-rad-1, rad, 3);

g.fillRect(0+rad,0,     w-rad-1,h);
g.fillRect(0    ,0+rad, w      ,h-rad-1);
