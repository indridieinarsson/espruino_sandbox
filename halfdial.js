;(function () {

const NDots = 20;
exports.draw = function draw (Settings, CenterX, CenterY, outerRadius, value) {
function drawdot(i){
    let Phi = (i+NDots/4) * Math.PI*2/NDots; // Phi from 1/4 x 2Pi -> 3/4x2Pi
    let dotx = CenterX + outerRadius * Math.sin(Phi);
    let doty = CenterY - outerRadius * Math.cos(Phi);
    g.fillCircle(dotx,doty, 3);
}
function drawArm(i){
    let Phi = (0.5+i)*Math.PI;
    let dotx = CenterX - outerRadius*0.7 * Math.sin(Phi);
    let doty = CenterY - outerRadius*0.7 * Math.cos(Phi);
    let dotx2 = CenterX - outerRadius*0.95 * Math.sin(Phi);
    let doty2 = CenterY - outerRadius*0.95 * Math.cos(Phi);
    g.drawLine(dotx,doty,dotx2,doty2,);
}

g.setColor('#FF0000');//red
for (let i = 0; i <= NDots/2; i++) {
    drawdot(i);
}
g.setColor('#000000');//black
drawArm(value);
}
})();
