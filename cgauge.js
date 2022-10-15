// dualgauge : 
const h = g.getHeight();
const w = g.getWidth();
const rad = 16;
const th = 3;
const bl = Math.round(0.5*Math.PI*rad);
const halflength = (w/2-rad) + bl + (h-rad-rad) + bl + (w/2-rad);
const n_hbl = Math.round((w/2-rad)/bl);
const n_bl = Math.round((w-2*rad)/bl);
const showtides = true;

var settings;
var location;

// variable for controlling idle alert
let lastStep = getTime();
let warned = 0;
let idle = false;
let IDLE_MINUTES = 26;

const infoLine = (3*h/4) - 6;
const infoWidth = 56;
const infoHeight = 11;
var drawingSteps = false;



function loadSettings() {
  try{
  settings = require("Storage").readJSON(SETTINGS_FILE,1)||{};
  } catch(e) { settings={};}
  settings.gy = settings.gy|| [0,0.2,0];
  settings.fg = settings.fg|| [0,1,0];
  settings.idle_check = settings.idle_check||true;
}

function find_split_segment(csseg, nrtf){
    for (var i = 0; i < csseg.length; i++) {
        if (nrtf < csseg[i]){
            return i;
        }
    }
    return csseg.length;
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
    all_lengths = [];
    all_lengths=all_lengths.concat(lengths.slice(n_hbl,n_bl));
    all_lengths.push(bl);
    all_lengths=all_lengths.concat(lengths);
    all_lengths.push(bl);
    all_lengths=all_lengths.concat(lengths.slice().reverse().slice(n_hbl,n_bl));
    return cumsum(all_lengths);
}

//function thickring(x,y, r, th, color){
//    g.setColor(color);
//    g.fillCircle(x,y,r);
//    g.setColor(g.theme.bg);
//    g.fillCircle(x,y,r-th-1);
//}

function topleft(color){
  console.log("topleft");
  cg_topleft.setVal(0);
  //thickring(0+rad  ,0+rad  , rad, th, color);
}

function topright(color){
  console.log("topright");
    //thickring(w-rad-2,0+rad  , rad, th, color);
  cg_topright.setVal(0);
}


function bottomleft(color){
  console.log("bottomleft");
  cg_bottomleft.setVal(0);
    //thickring(0+rad  ,h-rad-2, rad, th, color);
}

function bottomright(color){
  console.log("bottomright");
  cg_bottomright.setVal(0)
    //thickring(w-rad-2,h-rad-2, rad, th, color);
}

function drawGauge(percL, percR){
    // g.setColor(g.theme.fg);
    // bogalengd : 2*pi*rad/4 = 
    tarcnr = n_hbl;
    barcnr = tarcnr + n_bl+1;

    nrs = [];
    for (var i=0; i<n_bl; i++){
        nrs.push(i);
    }

    l = w-2*rad-2;
    intervals = nrs.map(x => [rad+Math.round(x*l/n_bl), rad+Math.round((x+1)*l/n_bl)]);
    cumsum_all = get_cumlength(l, n_bl, nrs);
    maxPixels=cumsum_all[cumsum_all.length - 1];
    nrtofindR = Math.round(percR*maxPixels/100);
    gaugePosR = find_split_segment(cumsum_all, nrtofindR);

    nrtofindL = Math.round(percL*maxPixels/100);
    gaugePosL = find_split_segment(cumsum_all, nrtofindL);

    r_intervals = intervals.slice(n_hbl, n_bl);
    l_intervals = intervals.slice(0, n_hbl);
    r_rects=[];

    r_intervals.forEach(it => {
        tmp=[it[0], 0, it[1], th+1];
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

    r_rects.reverse();

    l_rects=[];
    l_intervals.slice().reverse().forEach(it => {
        l_rects.push([it[0], 0, it[1], th+1]);
    });
    // Left
    intervals.forEach(it => {
        l_rects.push([0, it[0], th+1, it[1]]);
    });
    // Bottom
    l_intervals.forEach(it => {
        l_rects.push([it[0], h-th-2, it[1], h]);
    });

    l_rects.reverse();
    if (gaugePosR<barcnr) {topright(settings.gy);} else {topright(settings.fg);}
    if (gaugePosR<tarcnr) {bottomright(settings.gy);} else {bottomright(settings.fg);}

    if (gaugePosL<barcnr) {topleft(settings.gy);} else {topleft(settings.fg);}
    if (gaugePosL<tarcnr) {bottomleft(settings.gy);} else {bottomleft(settings.fg);}
    // fill rest of center
    g.setColor(g.theme.bg);
    //g.fillRect(0+rad,0,     w-rad-2,h);
    //g.fillRect(0    ,0+rad, w      ,h-rad-2);
    g.setColor(settings.fg);
    // Top
    r_rects.forEach((it,index) => {
        if (index >= gaugePosR) {g.setColor(settings.gy);}
        g.fillRect(it[0],it[1],it[2],it[3]);
    });

    g.setColor(settings.fg);
    l_rects.forEach((it,index) => {
        if (index >= gaugePosL) {g.setColor(settings.gy);}
        g.fillRect(it[0],it[1],it[2],it[3]);
    });
}




// cgauge.js - circular gauge
// allObjects - forum.espruiono.com
// 2020-11-27
// left/top = x/y = 0/0
// Circular Gauge cg0:
// - visual: 270 degree clock-wise gauge starting mid left bottom quadrant
// - graphics: ...starting mid 2nd quadrant ending mid 1st quadrant
// - showing values from 0..300 clockwise with initial value of 100
var cg1,cg1c,cg1f,cg1t,cg1h, b1w;
function run() {
  halt();
  cg1=new CGauge("cg1",100, 100, 110,[1,0,0],[0  ,0,1  ],0,90,null, 80,112, 16,13);
  cg1.setVal( 100,-1);
  drawAll();
  cg1c=2; cg1f=function(){ if (!cg1.setVal(cg1.val+cg1c)) cg1c=-cg1c; };
  cg1t=750;
  if (!b1w) b1w=setWatch(cg1f,BTN1,{edge:"rising",repeat:true});
  cont();
}
function cont() {
   cg1h=setInterval(cg1f,cg1t);
}
function halt() {
  if (cg1h) cg1h=clearInterval(cg1h);
}
function drawAll() { 
  g.clear(); setTimeout(function() {
    cg1.draw(1);
  }
    , 100); }

var p; // temp for prototype references
function CGauge(id,val,minV,maxV,color,fColor,begDeg,degs,deg0
               ,x,y,rOuter,rInner,fill,fFill,bgColor) {
  var _=0||this;
  _.mxXY=239;     // x, y max graph coord - defaults for BangleJS Graphics
  _.pps=2;        // 'pixel per segment'/jaggedness/graphical precision/resolution
  _.tikL=6;       // tick-length (set to 0 post construction for no ticks drawing)
  _.dado=1;       // draw arc delta only
  _.bClr=[0,0,0]; // background color (used as default)
  _.id=id;        // id of the circular gauge
  _.val=null;     // temporary, set at end of construction
  _.minV=minV;    // minimum value (arc all in fColor)
  _.maxV=maxV;    // maximum value (arc all in color)
  _.clr=color;    // color - as required by Graphics - for the value arc
  _.fClr=fColor;  // color - as required by Graphics - for to complete the arc
  _.begD=begDeg;  // 0 degrees: +x-Axis
  _.degs=degs;    // gauge full arc in degrees -/+ = counter/clockwise
  _.deg0=(deg0==null)?deg0:begDeg; // for 0/center value mark; null defaults to begDeg
  _.x=x;          // center x
  _.y=y;          // center y
  _.rOut=rOuter;  // radius outer
  _.rIn=rInner;   // radius inner (optional)
  _.fV=fill;      // fill value arc w/ color
  _.fF=fFill;     // fill filler arc w/ fColor
  _.bClr=(bgColor)?bgColor:this.bClr;                // opt bg color, defaults blk 
  _.begR=_.rad(_.begD);                              // begin radian
  _.arcR=(_.degs==360)?Math.PI*2:_.rad(_.degs);      // arc rad used for sCnt only
  _.segR=(Math.PI/(4/_.pps)/_.rOut)*((degs>0)?1:-1); // segment radian
  _.sCnt=Math.round(Math.abs(_.arcR/_.segR));        // segment count in arc
  _.cUp=[];                                          // clean up vertices 
  _.vLD=null;       // (display/draw) value (v) last displayed/drawn
  _.setVal(val,-1); // set value only
} p=CGauge.prototype;
p.setVal=function(v,o1,o2) { // --- set min/max adj'd val, draw != && o1=0 || o1>0; 
  console.log("extras:" +v+o1 + o2);
  var chd = (v=(v<this.minV)?this.minV:(v>this.maxV)?this.maxV:v)!=this.val; // ret
  console.log("chd :"+ chd + "| "+v + "| "+ this.val);
  if (o1<0) { this.val=v; this.vLD=null; // update value only, NO drawing & never draw
  } else if (v!=this.val||o1>0||o2) { this.val=v; this.draw(o1,o2); }
  return chd; };
p.draw=function(o1,o2) { // --- draw circular gauge (otp1:value, 2:ticks+extras)
  var s=this.sCnt,v=Math.round(s/(this.maxV-this.minV)*(this.val-this.minV))
    , h=(this.rIn)?1:0,fV=!!this.fV,fF=!!this.fF,bC=this.bClr
    , vL,vs,m; // console.log(this.id,this.val,v,s,o1,o2,this.cUp);
  if (o2) { this.drawXtras(s,v,h,o1); }
  if (o1!=-1) { if (h&&(fV==fF)) { g.setColor.apply(g,bC);
         while (this.cUp.length) g.drawLine.apply(g,this.cUp.pop()); 
      } else { this.cUp=[]; }
    if (o1==1||!this.dado||(vL=this.vLD)==null) {
      if (v<s) { vs=this._pvs(v,s,-1,0);
        if (h&&!fF&&fV) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
        g.setColor.apply(g,this.fClr).drawPoly(vs,h);
        if (h&&fF) this.fSs(vs,vs.length); vs=null; }
      vs=this._pvs(0,v,1,1);
      if (h&&!fV&&fF) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
      g.setColor.apply(g,this.clr).drawPoly(vs,h);
      if (h&&fV) this.fSs(vs,vs.length); vs=null;
    } else if (v>vL) { vs=this._pvs(vL,v,1,1);
      if (h&&!fV&&fF) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
      g.setColor.apply(g,this.clr).drawPoly(vs,h&&vL==0);
      if (h&&fV) this.fSs(vs,vs.length); vs=null;
    } else if (v<vL) { vs=this._pvs(v,vL,-1,1);
      if (h&&!fF&&fV) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
      g.setColor.apply(g,this.fClr).drawPoly(vs,h&&vL==s);
      if (h&&fF) this.fSs(vs,vs.length);
      vs=(h)?vs.slice((m=vs.length/2-2),m+4):(m=vs.slice(-2)).concat(m);
      g.setColor.apply(g,this.clr);g.drawLine.apply(g,vs);
  } } this.vLD=v; };
p.fSs=function(vs,vsL) { // --- fill
  if (vsL<64) { g.fillPoly(vs,1); // console.log("------",vsL/2);
  } else { var k=30,l=vsL/2,i=0,j=vsL-k,n; // console.log("start:",k,":",i,i+k,l,j,j+k);
    while (i<l) { // console.log(":",k,":",i,i+k,l,j,j+k);
      g.fillPoly(vs.slice(i,i+=k).concat(vs.slice(j,j+k)),1);
      if (i<l) { i-=2; if ((n=l-i)<30) k=n; j-=k-2;
        if (k==2) { k+=2; i-=2; j+=2; }
  } } } };
p.drawXtras=function(s,v,h,o1) { // --- draw extras... place holder for custom override
  if (this.tikL) this.drawTicks(h); }; // incl drawTicks() in custom override if needed 
p.drawTicks=function(h) { // --- draw ticks, begin and end and 0-tick
  var x=this.x,y=this.y,rTO=(h)?this.rIn:this.rOut,rTI=rTO-this.tikL,bR=this.begR
    , eR=bR+this.sCnt*this.segR,rTS=((rTI<0)?0:rTI)/rTO; // console.log(this.id,rTO,rTI,rTS);
  this.drawTick(x,y,rTO,rTS,eR,this.fClr);this.drawTick(x,y,rTO,rTS,bR,this.clr);
  if (this.deg0!=this.begD) this.drawTick(x,y,rTO,rTS,bR,this.clr); };
p.drawTick=function(x,y,t,s,r,c) { // --- draw tick x,y,radius,scale,radian,color
  var vX=t*Math.cos(r),vY=t*Math.sin(r); g.setColor.apply(g,c); g.drawLine(
    Math.round(x+vX),Math.round(y+vY),Math.round(x+vX*s),Math.round(y+vY*s)); };
p._pvs=function(f,t,d,c) { // --- calc polygon vertices from..to in direction
  var x=this.x, y=this.y, rO=this.rOut, rI=this.rIn, bR=this.begR, sR=this.segR
    , l=(t-f+1)*2*((rI)?2:1) // len of array for vertices (double w/ inner radius
    , v=((this.mxXY<=355) ? new Uint8Array(l) : new Uint16Array(l)) // vertices array
    , s=f-1  // segment index 
    , i=-1,j // vertices array index (running and 'turn around'/last outer)
    , m=(d>0)?f:t,r // segmentRadian 'multiplier' (starting w/ f or t+1), radian
    ; // console.log(this.id,f,t,d,"|",x,y,rO,rI,bR,sR,m,s,i);
  while (++s<=t) { r=bR+m*sR; m+=d;
    v[++i]=Math.round(x+rO*Math.cos(r));
    v[++i]=Math.round(y+rO*Math.sin(r)); } // console.log(this.id,s,r,v[i-1],v[i]); }
  if (rI) { j=i;
    while (--s>=f) { m-=d; r=bR+m*sR;
      v[++i]=Math.round(x+rI*Math.cos(r));
      v[++i]=Math.round(y+rI*Math.sin(r)); }
    if (c) this.cUp.push(v.slice(j-1,j+3));
  } // console.log(this.id,d,j,i,v.slice(0,4),this.cUp);
  return v; };
p.rad=function(degrs) { return 2*Math.PI*(degrs%360)/360; }; // radian <-- degrees


var q; // temp for prototype references
function BGauge(id, val,minV,maxV,color,fColor
               ,x1,y1,x2,y2,bgColor) {
  //var _=0||this;
  var _ = this;
  _.mxXY=239;     // x, y max graph coord - defaults for BangleJS Graphics
  _.bClr=[0,0,0]; // background color (used as default)
  _.id=id;        // id of the circular gauge
  _.val=null;     // temporary, set at end of construction
  _.minV=minV;    // minimum value (arc all in fColor)
  _.maxV=maxV;    // maximum value (arc all in color)
  _.clr=color;    // color - as required by Graphics - for the value arc
  _.fClr=fColor;  // color - as required by Graphics - for to complete the arc
  _.begX=x1;//begX;  // 0 degrees: +x-Axis
  _.x1=x1;          // center x
  _.y1=y1;          // center y
  _.x2=x2;          // center x
  _.y2=y2;          // center y
  _.xrange=x2-x1;
  _.bClr=(bgColor)?bgColor:this.bClr;                // opt bg color, defaults blk 
  _.vLD=null;       // (display/draw) value (v) last displayed/drawn
  _.setVal(val,-1); // set value only
} q=BGauge.prototype;
q.setVal=function(v,o1,o2) { // --- set min/max adj'd val, draw != && o1=0 || o1>0; 
  console.log("extras:" +v+o1 + o2);
  //var chd = (v=(v<Math.min(this.minV,this.maxV))?this.minV:(v>Math.max(this.maxV,this.minV))?this.maxV:v)!=this.val; // ret
  var chd = (v=(v<this.minV)?this.minV:(v>this.maxV)?this.maxV:v)!=this.val; // ret
  console.log("chd :"+ chd + "| "+v + "| "+ this.val);
  if (o1<0) { this.val=v; this.vLD=null; // update value only, NO drawing & never draw
  } else if (v!=this.val||o1>0||o2) { this.val=v; this.draw(o1,o2); }
  return chd; };
q.draw=function(o1,o2) {
  xi = (this.val-this.minV)*this.xrange/(this.maxV-this.minV) + this.begX;
  console.log("drawing ", this.begX, xi, this.begX+this.xrange);
  g.setColor.apply(g,this.clr);
  console.log("rect 1 :",this.x1,this.y1, xi,this.y2, this.clr);
  g.fillRect(this.x1,this.y1, xi,this.y2);
  if (xi==this.x2) {return;}
  g.setColor.apply(g,this.fClr);
  console.log("rect 2: ", xi,this.y1,this.x2,this.y2, this.fClr)
  g.fillRect(xi,this.y1,this.x2,this.y2);
  //xi = (x-v1)*l/(v2-v1)+x1;
  };
// p.v=function(x,y,r,rO,ri) { // <--- vertice
//  return [
function r() { run(); }
function hh() { console.log("someting happened");
                            halt(); }
function c() { cont(); }
loadSettings();
console.log("colors :" +settings.fg + settings.gy);
var cg_topleft=new CGauge("topleft",0, 0, 100, settings.fg, settings.gy, 180, 90,null, 0+rad,0+rad, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);

var cg_topright=new CGauge("topright",0, 0, 200, settings.fg, settings.gy, 270, 90,null, w-rad-1,0+rad, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);

var cg_bottomleft=new CGauge("bottomleft",100, 100, 200, settings.fg, settings.gy, 90, 90,null, 0+rad  ,h-rad-1, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);

var cg_bottomright=new CGauge("bottomright",100, 100, 200, settings.fg, settings.gy, 90, -90,null, w-rad-1,h-rad-1, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);
cg_bottomleft.draw();
cg_topright.draw();
cg_topleft.draw();
cg_bottomright.draw();


var bg = new BGauge("testgauge", 0,0,100,settings.fg, settings.gy, w/2,40+0, w-rad-th/2,40+th+1, [0,0,0]);
// setTimeout(run,99);
//cg_topleft.draw(1);
drawGauge(45,60);

bg.setVal(50);
