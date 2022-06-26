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
  g.fillCircle(x,y,r-th-1);
  
}
h = g.getHeight();
w = g.getWidth();
whalf = w / 2;
console.log(whalf)
console.log(g.getHeight());
ur_corner(20, 43, 21, 4);
//ul_corner(70, 83, 21, 3);
rad = 16;
th=3;
thickring(0+rad  ,0+rad  , rad, th);
thickring(w-rad-2,0+rad  , rad, th);
thickring(0+rad  ,h-rad-2, rad, th);
thickring(w-rad-2,h-rad-2, rad, th);
// bogalengd : 2*pi*rad/4 = 
bl = Math.round(0.5*Math.PI*rad);
//segments = []
//segments.push(whalf-rad);
segments = [(whalf-rad), bl, (h-rad-rad), bl, (whalf-rad)];
cssegments = [];
segments.forEach(function(nr, ix){
  if (ix==0) {
    cssegments.push(nr);
  }
  else {
  cssegments.push(nr+cssegments[ix-1]);
  }
});
console.log(cssegments);
console.log(segments);
halflength = (whalf-rad) + bl + (h-rad-rad) + bl + (whalf-rad);
n_hbl = Math.round((whalf-rad)/bl);
n_bl = Math.round((w-2*rad)/bl);
console.log("nr of corners in straight segments : " + n_hbl + " , " + n_bl);
console.log("bogalengd :" + bl);
console.log("total length :" + halflength);

nrtofind = 200;
function find_split_segment(csseg, nrtf){
for (var i = 0; i < csseg.length; i++) {
    //console.log(cssegments[i]);
  if (nrtf < csseg[i]){
    console.log("found it" + i);
    return i;
  }
}
}
a = find_split_segment(cssegments, nrtofind);
g.fillRect(0+rad,0,     w-rad-2,h);
g.fillRect(0    ,0+rad, w      ,h-rad-2);
// Top segment:g.fillRect(0+rad,0, w-rad-2, th);
g.setColor(128,128,0);
g.fillRect(0+rad,0, whalf, th);
g.setColor(255,0,0);
g.fillRect(whalf,0, w-rad-2, th);

// Bottom segment
g.setColor(0,255,0);
g.fillRect(0+rad,h-th-2, w-rad-2, h);
// Left segment
g.setColor(0,0,255);
g.fillRect(0,0+rad, th, h-rad-2);
// Right segment
g.setColor(255,0,255);
g.fillRect(w-th-2,0+rad, w, h-rad-2);
