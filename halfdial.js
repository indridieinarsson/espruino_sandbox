CenterX = g.getWidth()/2;
CenterY = g.getHeight()/2;

outerRadius=Math.min(CenterX, CenterY);


function drawdot(i){
    let Phi = (i+20/4) * Math.PI*2/20; // Phi from 1/4 x 2Pi -> 3/4x2Pi
    let dotx = CenterX + outerRadius * Math.sin(Phi);
    let doty = CenterY - outerRadius * Math.cos(Phi);
    g.drawCircle(dotx,doty, 5);
}

function drawArm(i){
    let Phi = (0.5+i)*Math.PI;// (i+20/4) * Math.PI*2/20;
    let dotx = CenterX - outerRadius*0.7 * Math.sin(Phi);
    let doty = CenterY - outerRadius*0.7 * Math.cos(Phi);
    let dotx2 = CenterX - outerRadius * Math.sin(Phi);
    let doty2 = CenterY - outerRadius * Math.cos(Phi);
    g.drawLine(dotx,doty,dotx2,doty2);
}

g.setColor('#FF0000');//red
for (let i = 0; i <= 10; i++) {
    drawdot(i);
}
g.setColor('#000000');//black
drawArm(1);
