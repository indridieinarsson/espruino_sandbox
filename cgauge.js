// cgauge.js - circular gauge
// allObjects - forum.espruiono.com
// 2020-11-27
// left/top = x/y = 0/0
// Circular Gauge cg0:
// - visual: 270 degree clock-wise gauge starting mid left bottom quadrant
// - graphics: ...starting mid 2nd quadrant ending mid 1st quadrant
// - showing values from 0..300 clockwise with initial value of 100
var cg0
  , cg1,cg1c,cg1f,cg1t,cg1h
  , cg2,cg2c,cg2f,cg2t,cg2h
  , cg3,cg3c,cg3f,cg3t,cg3h
  , cg4
  , b1w,b2w,b3w
  ;
function run() {
  halt();
  cg1=new CGauge("cg1",10, 10, 20,[1,1,0],[0  ,1  ,1  ],0,90,null, 80,212, 16,13);
  cg1.setVal( 10,-1);
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
function CGauge(id,val,minV,maxV,color,fColor,begDeg,degs,deg0,x,y,rOuter,rInner) {
  var _=0||this;
  _.mxXY=239;    // x, y max graph coord - defaults for BangleJS Graphics
  _.pps=2;       // 'pixel per segment'/jaggedness/graphical precision/resolution
  _.tikL=0;      // tick-length (set to 0 post construction for no ticks drawing)
  _.id=id;       // id of the circular gauge
  _.val=null;    // temporary, set at end of construction
  _.minV=minV;   // minimum value (arc all in fColor)
  _.maxV=maxV;   // maximum value (arc all in color)
  _.clr=color;   // color - as required by Graphics - for the value arc
  _.fClr=fColor; // color - as required by Graphics - for to complete the arc
  _.begD=begDeg; // 0 degrees: +x-Axis
  _.degs=degs;   // gauge full arc in degrees -/+ = counter/clockwise
  _.deg0=(deg0)?deg0:begDeg; // for 0/center value mark; falsy defaults to begDeg
  _.x=x;         // center x
  _.y=y;         // center y
  _.rOut=rOuter; // radius outer
  _.rIn=rInner;  // radius inner (optional)
  _.begR=_.rad(_.begD);                              // begin radian
  _.arcR=(_.degs==360)?Math.PI*2:_.rad(_.degs);      // arc rad used for sCnt only
  _.segR=(Math.PI/(4/_.pps)/_.rOut)*((degs>0)?1:-1); // segment radian
  _.sCnt=Math.round(Math.abs(_.arcR/_.segR));        // segment count in arc
  _.cUp=[];                                          // clean up vertices 
  _.setVal(val,-1); // set value only
} p=CGauge.prototype;
p.setVal=function(v,opt) { // --- set min/max adj'd val, draw != && opt=0 || opt>0; 
  console.log("minv, maxv  " + this.minV + " " + this.maxV);
  var chd = (v=(v<this.minV)?this.minV:(v>this.maxV)?this.maxV:v)!=this.val; // ret
  console.log("chd = " + chd);
  console.log("v = " + v);
  if (opt<0) { this.val=v; // update value only, NO drawing
  } else if (v!=this.val||opt>0) { this.val=v; this.draw(opt); }
  return chd; };
p.draw=function(o) { // --- draw circular gauge (o-pt w/ extras, such as 0-tick)
  console.log("draw");
  var s=this.sCnt,v=Math.round(s/(this.maxV-this.minV)*(this.val-this.minV)),h=!!this.rIn,vs;
  //if (o) { if (this.tikL) this.drawTicks(h); } // console.log(this.id,this.val,v,s,this.cUp);
  g.setColor(0,0,0); while (this.cUp.length) g.drawLine.apply(g,this.cUp.pop());
  if (v<s) g.setColor.apply(g,this.fClr).fillPoly(this._pvs(v,s,0),h);
  vs=this._pvs(0,v,1);
  g.setColor.apply(g,this.clr).fillPoly(vs,h); };
//p.drawTicks=function(h) { // --- draw ticks, begin and end and 0-tick
//  var x=this.x,y=this.y,rTO=(h)?this.rIn:this.rOut,rTI=rTO-this.tikL,bR=this.begR
//    , eR=bR+this.sCnt*this.segR,rTS=((rTI<0)?0:rTI)/rTO; // console.log(this.id,rTO,rTI,rTS);
//  this.drawTick(x,y,rTO,rTS,eR,this.fClr);this.drawTick(x,y,rTO,rTS,bR,this.clr);
//  if (this.deg0!=this.begD) this.drawTick(x,y,rTO,rTS,bR,this.clr); };
//p.drawTick=function(x,y,t,s,r,c) { // --- draw tick;
//  var vX=t*Math.cos(r),vY=t*Math.sin(r); g.setColor.apply(g,c); g.drawLine(
//    Math.round(x+vX),Math.round(y+vY),Math.round(x+vX*s),Math.round(y+vY*s)); };
p._pvs=function(f,t,c) { // --- calc polygon vertices from..to
  var x=this.x, y=this.y, rO=this.rOut, rI=this.rIn, bR=this.begR, sR=this.segR
    , l=(t-f+1)*2*((rI)?2:1) // len of array for vertices (double w/ inner radius
    , v=((this.mxXY<=355) ? new Uint8Array(l) : new Uint16Array(l)) // vertices array
    , s=f-1  // segment index 
    , i=-1,j // vertices array index (running and 'turn around'/last outer)
    , r      // radian
    ; // console.log(x,y,rO,rI,bR,sR,f,t,s,i);
  while(++s<=t) { r=bR+s*sR;
    v[++i]=Math.round(x+rO*Math.cos(r));
    v[++i]=Math.round(y+rO*Math.sin(r)); } // console.log(this.id,s,r,v[i-1],v[i]); }
  if (rI) { j=i;
    while (--s>=f) { r=bR+s*sR;
      v[++i]=Math.round(x+rI*Math.cos(r));
      v[++i]=Math.round(y+rI*Math.sin(r)); }
    this.cUp.push((c)?v.slice(j-1,j+3):v.slice(0,2).concat(v.slice(-2)));
  } // console.log(this.id,c,j,v.slice(0,4),this.cUp); }
  return v; };
p.rad=function(degrs) { return 2*Math.PI*(degrs%360)/360; }; // radian <-- degrees
// p.v=function(x,y,r,rO,ri) { // <--- vertice
//  return [
function r() { run(); }
function h() { halt(); }
function c() { cont(); }
setTimeout(run,99);
