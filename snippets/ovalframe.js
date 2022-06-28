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

// construct length of all segments:
function get_cumlength(l, n_bl, nrs){
  lengths = nrs.map(x => Math.round((x+1)*l/n_bl) - Math.round(x*l/n_bl));
  all_lengths = []
  all_lengths=all_lengths.concat(lengths.slice(n_hbl,n_bl));
  all_lengths.push(bl);
  all_lengths=all_lengths.concat(lengths);
  all_lengths.push(bl);
  all_lengths=all_lengths.concat(lengths.slice().reverse().slice(n_hbl,n_bl));
  return cumsum(all_lengths);
}

function thickring(x,y, r, th){
  //g.setColor(0x646464);
  g.fillCircle(x,y,r);
  g.setColor(g.theme.bg);
  g.fillCircle(x,y,r-th-1);
}
h = g.getHeight();
w = g.getWidth();
rad = 8;
th=3;
theme_bright="#00FFFF";
theme_dark = "#002222";
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
g.setColor(g.theme.fg);

// bogalengd : 2*pi*rad/4 = 
bl = Math.round(0.5*Math.PI*rad);

halflength = (w/2-rad) + bl + (h-rad-rad) + bl + (w/2-rad);
n_hbl = Math.round((w/2-rad)/bl);
n_bl = Math.round((w-2*rad)/bl);

nrtofind = 160;
tarcnr = n_hbl;
barcnr = tarcnr + n_bl+1;
console.log("number of segments : "+n_bl + ", ", n_hbl);
console.log("arc indices " + tarcnr + " , "+barcnr);

nrs = [];
for (var i=0; i<n_bl; i++){
  nrs.push(i);
}

l = w-2*rad-2
intervals = nrs.map(x => [rad+Math.round(x*l/n_bl), rad+Math.round((x+1)*l/n_bl)]);
cumsum_all = get_cumlength(l, n_bl, nrs);
a = find_split_segment(cumsum_all, nrtofind);
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

l_rects=[];
l_intervals.forEach(it => {
  l_rects.push([it[0], 0, it[1], th]);
});
// Left
intervals.forEach(it => {
  l_rects.push([0, it[0], th, it[1]]);
});
// Bottom
l_intervals.slice().reverse().forEach(it => {
  l_rects.push([it[0], h-th-2, it[1], h]);
});


g.setColor(theme_dark);
rtop = a<tarcnr;
if (rtop) {g.setColor(theme_dark);} else {g.setColor(theme_bright);}
topright();
rbot = a<barcnr;
if (rbot) {g.setColor(theme_dark);} else {g.setColor(theme_bright);}
bottomright();
g.setColor(theme_dark);
topleft();
g.setColor(theme_dark);
bottomleft();
console.log("rtop, rbot" + rtop + rbot);
// fill rest of center
g.setColor(g.theme.bg);
g.fillRect(0+rad,0,     w-rad-2,h);
g.fillRect(0    ,0+rad, w      ,h-rad-2);

g.setColor(theme_bright);
// Top
//for (var i=0; i<r_rects.length
r_rects.forEach((it,index) => {
  if (index >= a) {g.setColor(theme_dark);}
  console.log("index" + index);
  g.fillRect(it[0],it[1],it[2],it[3]);
}
  );
l_rects.forEach((it,index) => {
  if (index >= a) {g.setColor(theme_dark);}
  console.log("index" + index);
  g.fillRect(it[0],it[1],it[2],it[3]);
}
  );
