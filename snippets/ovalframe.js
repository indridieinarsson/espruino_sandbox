g.clear();
//th = 3
//x1=20, y1=43;
//r = 21
function find_split_segment(csseg, nrtf){
  for (var i = 0; i < csseg.length; i++) {
    if (nrtf < csseg[i]){
      return i;
    }
  }
}

function cumsum(segs) {
  retval = [];
  segs.forEach(function(nr, ix){
    if (ix==0) {
      retval.push(nr);
    }
    else {
      retval.push(nr+retval[ix-1]);
    }
  });
  return retval;
}

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
  //g.setColor(0x646464);
  g.fillCircle(x,y,r);
  g.setColor(0xFFFFFF);
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
function topleft(){
  thickring(0+rad  ,0+rad  , rad, th);
}
function topright(){
  thickring(w-rad-2,0+rad  , rad, th);
}
function bottomleft(){
  thickring(0+rad  ,h-rad-2, rad, th);
}
function bottomright(){
  thickring(w-rad-2,h-rad-2, rad, th);
}
g.setColor(255,255,255);

// bogalengd : 2*pi*rad/4 = 
bl = Math.round(0.5*Math.PI*rad);

halflength = (whalf-rad) + bl + (h-rad-rad) + bl + (whalf-rad);
n_hbl = Math.round((whalf-rad)/bl);
n_bl = Math.round((w-2*rad)/bl);

nrtofind = 200;
tarcnr = n_hbl;
barcnr = tarcnr + n_bl+1;
console.log("arc indices " + tarcnr + " , "+barcnr);



nrs = [];
for (var i=0; i<n_bl; i++){
  nrs.push(i);
}

l = w-2*rad-2

intervals = nrs.map(x => [rad+Math.round(x*l/6), rad+Math.round((x+1)*l/6)]);
lengths = nrs.map(x => Math.round((x+1)*l/n_bl) - Math.round(x*l/n_bl));
// construct length of all segments:
all_lengths = []
all_lengths=all_lengths.concat(lengths.slice(n_hbl,n_bl));
all_lengths.push(bl);
all_lengths=all_lengths.concat(lengths);
all_lengths.push(bl);
all_lengths=all_lengths.concat(lengths.slice().reverse().slice(n_hbl,n_bl));
cumsum_all = cumsum(all_lengths);
a = find_split_segment(cumsum_all, nrtofind);

g.setColor(0x646464);
rtop = a<tarcnr;
if (rtop) {g.setColor(128,128,0);}
topright();
rbot = a<barcnr;
if (rbot) {g.setColor(128,128,0);} else {g.setColor(0x646464);}
bottomright();
console.log("rtop, rbot" + rtop + rbot);
// fill rest of center
g.setColor(255,255,255);
g.fillRect(0+rad,0,     w-rad-2,h);
g.fillRect(0    ,0+rad, w      ,h-rad-2);

g.setColor(0,128,128);
// Top
r_intervals = intervals.slice(n_hbl, n_bl);
l_intervals = intervals.slice(0, n_hbl);
r_rects=[];
r_intervals.forEach(it => {
  tmp=[it[0], 0, it[1], th]
  r_rects.push(tmp);
});
// Right
intervals.forEach(it => {
  r_rects.push([w-th-2, it[0], w, it[1]]);
});
// Bottom
r_intervals.slice().reverse().forEach(it => {
  r_rects.push([it[0], h-th-2, it[1], h]);
});
r_rects.forEach(it => g.fillRect(it[0],it[1],it[2],it[3]));
