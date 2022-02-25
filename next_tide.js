var tides = require("Storage").readJSON("tides.data.js",true) || {};
console.log("test");
//var l = f.readLine();
//console.log(f);
//while (l!==undefined) {
//  console.log(l);
//  l = f.readLine();
//}
now = Date();
for(var key in tides){
  test = Date(tides[key]['time']);
  if(test>now){
    nextTide = tides[key]
    break;
  }
  lastTide=test;
}
msg="next tide : " + nextTide['time'] + " "+nextTide['level']/100;
console.log(msg);
g.setFont('Vector', 18);
g.drawString(msg, 10,10);
g.flip()
