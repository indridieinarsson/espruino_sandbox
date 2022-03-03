;(function () {
    let HourHandOffset = 0
    let MinuteHandOffset = 0
    let SecondHandOffset = 0;

    let twoPi  = 2*Math.PI, deg2rad = Math.PI/180;
    let Pi     = Math.PI;
    let halfPi = Math.PI/2;

    let sin = Math.sin, cos = Math.cos;

    let HourHandLength  = 0;
    let MinuteHandLength  = 0;

    exports.draw = function draw (
        Settings, CenterX, CenterY, outerRadius, Hours,Minutes,Seconds
    ) {
        HourHandLength = outerRadius * 0.6;
        MinuteHandLength  = outerRadius * 0.9;

        let HoursAngle   = (Hours+(Minutes/60))/12 * twoPi - Pi;
        let MinutesAngle = (Minutes/60)            * twoPi - Pi;

        g.setColor(Settings.Foreground === 'Theme' ? g.theme.fg : Settings.Foreground || '#000000');
        let sPhi = Math.sin(HoursAngle), cPhi = Math.cos(HoursAngle);
        g.drawLine(
            CenterX + HourHandOffset*sPhi,
            CenterY - HourHandOffset*cPhi,
            CenterX - HourHandLength*sPhi,
            CenterY + HourHandLength*cPhi
        );

        sPhi = Math.sin(MinutesAngle), cPhi = Math.cos(MinutesAngle);
        g.drawLine(
            CenterX + MinuteHandOffset*sPhi,
            CenterY - MinuteHandOffset*cPhi,
            CenterX - MinuteHandLength*sPhi,
            CenterY + MinuteHandLength*cPhi
        );

        for (let i = 0; i < 12; i++) {
            let Phi = i * Math.PI*2/12;
            let dotx = CenterX + Radius * Math.sin(Phi);
            let doty = CenterY - Radius * Math.cos(Phi);
            g.drawCircle(dotx,doty, 0.5);
        }

        if (Seconds != null) {
            g.setColor(Settings.Seconds === 'Theme' ? g.theme.fgH : Settings.Seconds || '#FF0000');
            // 24 hour clock
            let SecondsAngle   = (Hours+(Minutes/60))/24 * twoPi - Pi;
            sPhi = Math.sin(SecondsAngle), cPhi = Math.cos(SecondsAngle);
            let SecondHandLength = outerRadius * 0.9;
            g.drawLine(
                CenterX + SecondHandOffset*sPhi,
                CenterY - SecondHandOffset*cPhi,
                CenterX - SecondHandLength*sPhi,
                CenterY + SecondHandLength*cPhi
            );
        }
    };
})();
