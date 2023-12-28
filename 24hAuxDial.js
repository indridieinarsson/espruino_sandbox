;(function () {
    let SecondHandOffset = 0;
    let SecondHandLength = 0;

    let twoPi  = 2*Math.PI, deg2rad = Math.PI/180;
    let Pi     = Math.PI;
    let halfPi = Math.PI/2;

    let sin = Math.sin, cos = Math.cos;

    exports.draw = function draw (
        Settings, CenterX, CenterY, outerRadius, Hours,Minutes,Seconds
    ) {
        function drawdot(i){
            let Phi = i * Math.PI*2/12;
            let dotx = CenterX + outerRadius * Math.sin(Phi);
            let doty = CenterY - outerRadius * Math.cos(Phi);
            g.drawCircle(dotx,doty, 1);
        }

	function draw24htime(h, m){
            let SecondsAngle   = (h+(m/60))/24 * twoPi - Pi;
            sPhi = Math.sin(SecondsAngle), cPhi = Math.cos(SecondsAngle);
            let SecondHandLength = outerRadius * 0.9;
            g.drawLine(
                CenterX + SecondHandOffset*sPhi,
                CenterY - SecondHandOffset*cPhi,
                CenterX - SecondHandLength*sPhi,
                CenterY + SecondHandLength*cPhi
            );
        }
        g.setColor('#00FFFF');//Cyan
        for (let i = -2; i < 3; i++) {
            drawdot(i);
        }
        g.setColor('#FF0000');//red
        for (let i = 4; i < 9; i++) {
            drawdot(i);
        }
        g.setColor('#FF00FF');//Magenta
        drawdot(-3);
        drawdot(3);

        g.setColor(Settings.Seconds === 'Theme' ? g.theme.fgH : Settings.Seconds || '#FF0000');
	draw24htime(Hours, Minutes);
        g.setColor(Settings.Foreground === 'Theme' ? g.theme.fg : Settings.Foreground || '#000000');
	let now = new Date();
	let Hoursn   = now.getHours() % 12;
	let Minutesn = now.getMinutes();
	draw24htime(Hoursn, Minutesn);
    };
})();
