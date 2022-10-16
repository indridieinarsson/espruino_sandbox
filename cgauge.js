// dualgauge : 
const h = g.getHeight();
const w = g.getWidth();
const rad = 25;
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

loadSettings();
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
  if (o1!=-1) { if (h&&(fV==fF)) { g.setColor.apply(g,bC);
         while (this.cUp.length) {g.drawLine.apply(g,this.cUp.pop()); }
      } else { this.cUp=[]; }
    if (o1==1||!this.dado||(vL=this.vLD)==null) {
      console.log("values : " , vL, v, s);
      if (v<s) { vs=this._pvs(v,s,-1,0);
        if (h&&!fF&&fV) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
        g.setColor.apply(g,this.fClr).drawPoly(vs,h);
        if (h&&fF) this.fSs(vs,vs.length); vs=null; }
      vs=this._pvs(0,v,1,1);
      if (h&&!fV&&fF) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
      g.setColor.apply(g,this.clr).drawPoly(vs,h);
      if (h&&fV) this.fSs(vs,vs.length); vs=null;
    } else if (v>vL) { vs=this._pvs(vL,v,1,1);
                      console.log("values 2 : " , vL, v, s);
      if (h&&!fV&&fF) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
      g.setColor.apply(g,this.clr).drawPoly(vs,h&&vL==0);
      if (h&&fV) this.fSs(vs,vs.length); vs=null;
    } else if (v<vL) { vs=this._pvs(v,vL,-1,1);
                      console.log("values 3: " , vL, v, s);
      if (h&&!fF&&fV) { g.setColor.apply(g,bC); this.fSs(vs,vs.length); }
      g.setColor.apply(g,this.fClr).drawPoly(vs,h&&vL==s);
      if (h&&fF) this.fSs(vs,vs.length);
      vs=(h)?vs.slice((m=vs.length/2-2),m+4):(m=vs.slice(-2)).concat(m);
      g.setColor.apply(g,this.clr);//g.drawLine.apply(g,vs);
  } } this.vLD=v; };
p.fSs=function(vs,vsL) { // --- fill
  if (vsL<64) { g.fillPoly(vs,1); // console.log("------",vsL/2);
  } else { var k=30,l=vsL/2,i=0,j=vsL-k,n; // console.log("start:",k,":",i,i+k,l,j,j+k);
    while (i<l) { // console.log(":",k,":",i,i+k,l,j,j+k);
      g.fillPoly(vs.slice(i,i+=k).concat(vs.slice(j,j+k)),1);
      if (i<l) { i-=2; if ((n=l-i)<30) k=n; j-=k-2;
        if (k==2) { k+=2; i-=2; j+=2; }
  } } } };
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
function HGauge(id, val,minV,maxV,color,fColor
               ,x1,y1,x2,y2) {
  //var _=0||this;
  var _ = this;
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
  _.vLD=null;       // (display/draw) value (v) last displayed/drawn
  _.setVal(val,-1); // set value only
} q=HGauge.prototype;
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

// -----------------
var s; // temp for prototype references
function VGauge(id, val,minV,maxV,color,fColor
               ,x1,y1,x2,y2) {
  //var _=0||this;
  var _ = this;
  _.id=id;        // id of the circular gauge
  _.val=null;     // temporary, set at end of construction
  _.minV=minV;    // minimum value (arc all in fColor)
  _.maxV=maxV;    // maximum value (arc all in color)
  _.clr=color;    // color - as required by Graphics - for the value arc
  _.fClr=fColor;  // color - as required by Graphics - for to complete the arc
  _.begY=y1;      // 0 degrees: +x-Axis
  _.x1=x1;          // center x
  _.y1=y1;          // center y
  _.x2=x2;          // center x
  _.y2=y2;          // center y
  _.yrange=y2-y1;
  _.vLD=null;       // (display/draw) value (v) last displayed/drawn
  _.setVal(val,-1); // set value only
} s=VGauge.prototype;
s.setVal=function(v,o1,o2) { // --- set min/max adj'd val, draw != && o1=0 || o1>0; 
  console.log("extras:" +v+o1 + o2);
  //var chd = (v=(v<Math.min(this.minV,this.maxV))?this.minV:(v>Math.max(this.maxV,this.minV))?this.maxV:v)!=this.val; // ret
  var chd = (v=(v<this.minV)?this.minV:(v>this.maxV)?this.maxV:v)!=this.val; // ret
  console.log("chd :"+ chd + "| "+v + "| "+ this.val);
  if (o1<0) { this.val=v; this.vLD=null; // update value only, NO drawing & never draw
  } else if (v!=this.val||o1>0||o2) { this.val=v; this.draw(o1,o2); }
  return chd; };
s.draw=function(o1,o2) {
  yi = (this.val-this.minV)*this.yrange/(this.maxV-this.minV) + this.begY;
  console.log("drawing ", this.begY, yi, this.begY+this.yrange);
  g.setColor.apply(g,this.clr);
  console.log("rect 1 :",this.x1,this.y1, yi,this.y2, this.clr);
  g.fillRect(this.x1,this.y1, this.x2, yi);
  if (yi==this.y2) {return;}
  g.setColor.apply(g,this.fClr);
  console.log("rect 2: ", yi,this.y1,this.x2,this.y2, this.fClr)
  g.fillRect(this.x1, yi, this.x2,this.y2);
  //xi = (x-v1)*l/(v2-v1)+x1;
  };


var halfl=w/2-rad-1;
var cornerl = Math.PI*rad/2;
var fulll = h-2*rad-1;

var tmp=0;
var hg_rl = new HGauge("hg_rl", tmp,tmp,tmp+=halfl,settings.fg, settings.gy, w/2,h-th-2, w-rad-1,h);
var cg_bottomright=new CGauge("bottomright",tmp+1, tmp+1, tmp+=cornerl, settings.fg, settings.gy, 90, -90,null, w-rad-1,h-rad-1, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);
tmp=tmp+cornerl
var vg_r = new VGauge("vg_r", tmp+1, tmp+1, tmp+=fulll, settings.fg, settings.gy, w, h-rad-1,  w-th-2, rad);
var cg_topright=new CGauge("topright",tmp+1, tmp+1, tmp+=cornerl, settings.fg, settings.gy, 0, -90,null, w-rad-1,0+rad, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);
var hg_ru = new HGauge("hg_ru", tmp+1,tmp+1,tmp+=halfl,settings.fg, settings.gy, w-rad-1,th+1, w/2,0);

tmp=0;
var hg_ll = new HGauge("hg_ll", tmp,tmp,tmp+=halfl,settings.fg, settings.gy, w/2,h-th-2, rad,h);
var cg_bottomleft=new CGauge("bottomleft",tmp+1, tmp+1, tmp+=cornerl, settings.fg, settings.gy, 90, 90,null, 0+rad  ,h-rad-1, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);
var vg_l = new VGauge("vg_l", tmp+1, tmp+1, tmp+=fulll, settings.fg, settings.gy, th+1, h-rad-1, 0, rad);
var cg_topleft=new CGauge("topleft",tmp+1, tmp+1, tmp+=cornerl, settings.fg, settings.gy, 180, 90,null, 0+rad,0+rad, rad,rad-th-1, settings.fg, settings.gy, [0,0,0]);
var hg_lu = new HGauge("hg_lu", tmp+1,tmp+1,tmp+=halfl,settings.fg, settings.gy, rad,th+1, w/2,0);



setvals_r = function(x) {
  cg_topright.setVal(x);
  cg_bottomright.setVal(x);
  vg_r.setVal(x);
  hg_rl.setVal(x);
  hg_ru.setVal(x);
};
setvals_l = function(x) {
  cg_topleft.setVal(x);
  cg_bottomleft.setVal(x);
  vg_l.setVal(x);
  hg_ll.setVal(x);
  hg_lu.setVal(x);
};
setvals = function(x){
  cg_bottomleft.setVal(x);
  cg_bottomright.setVal(x);
  cg_topleft.setVal(x);
  cg_topright.setVal(x);
};
setvals_l(1000);setvals_l(0);
setvals_r(1000);setvals_r(0);

setvals_l(50);
setvals_r(300);
