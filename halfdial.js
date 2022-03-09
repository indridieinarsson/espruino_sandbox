;(function () {

const NDots = 20;
const dphi = 2*Math.PI/50

function draw (Settings, CenterX, CenterY, outerRadius, value) {
  function drawdot(Phi){
      let dotx = CenterX + outerRadius * Math.sin(Phi);
      let doty = CenterY - outerRadius * Math.cos(Phi);
      g.fillCircle(dotx,doty, 1.5);
  }

  function drawArm(i){
      let Phi = Math.PI-10*dphi+20*dphi*value
      let dotx = CenterX - outerRadius*0.7 * Math.sin(Phi);
      let doty = CenterY - outerRadius*0.7 * Math.cos(Phi);
      let dotx2 = CenterX - outerRadius*0.95 * Math.sin(Phi);
      let doty2 = CenterY - outerRadius*0.95 * Math.cos(Phi);
      g.drawLine(dotx,doty,dotx2,doty2);
  }

  g.setColor('#FFFFFF');//red
  for (let i = 0; i <= 10; i++) {
    drawdot(Math.PI+i*dphi);
    drawdot(Math.PI-i*dphi);
  }
  g.setColor('#FFFFFF');//black
  drawArm(value);
  }})();
