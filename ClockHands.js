;(function () {
  let HourHandWidth   = 2*3, halfHourHandWidth   = HourHandWidth/2;
  let MinuteHandWidth = 2*2, halfMinuteHandWidth = MinuteHandWidth/2;

  let SecondHandOffset = halfHourHandWidth + 10;

  let BoltRadius = 3;
  let HandOffset = BoltRadius + 15;

  let twoPi  = 2*Math.PI, deg2rad = Math.PI/180;
  let Pi     = Math.PI;
  let halfPi = Math.PI/2;

  let sin = Math.sin, cos = Math.cos;

  let sine = [0, sin(30*deg2rad), sin(60*deg2rad), 1];

  let HandPolygon = [
    -sine[3],-sine[0], -sine[2],-sine[1], -sine[1],-sine[2], -sine[0],-sine[3],
     sine[0],-sine[3],  sine[1],-sine[2],  sine[2],-sine[1],  sine[3],-sine[0],
     sine[3], sine[0],  sine[2], sine[1],  sine[1], sine[2],  sine[0], sine[3],
     0,0,
    -sine[0], sine[3], -sine[1], sine[2], -sine[2], sine[1], -sine[3], sine[0]
  ];

  let HourHandLength  = 0;
  let HourHandPolygon = new Array(HandPolygon.length);

  function prepareHourHandPolygon(newHourHandLength) {
    if (HourHandLength === newHourHandLength) { return; }

    HourHandLength = newHourHandLength;
    for (let i = 0, l = HandPolygon.length; i < l; i+=2) {
      HourHandPolygon[i]   = halfHourHandWidth*HandPolygon[i];
      HourHandPolygon[i+1] = halfHourHandWidth*HandPolygon[i+1];
      if (i < l/2) { HourHandPolygon[i+1] -= HourHandLength; }
      if (i > l/2) { HourHandPolygon[i+1] -= HandOffset; }
    }
    HourHandPolygon[25] = -BoltRadius;
  }

  let MinuteHandLength  = 0;
  let MinuteHandPolygon = new Array(HandPolygon.length);

  function prepareMinuteHandPolygon(newMinuteHandLength) {
    if (MinuteHandLength === newMinuteHandLength) { return; }

    MinuteHandLength = newMinuteHandLength;
    for (let i = 0, l = HandPolygon.length; i < l; i+=2) {
      MinuteHandPolygon[i]   = halfMinuteHandWidth*HandPolygon[i];
      MinuteHandPolygon[i+1] = halfMinuteHandWidth*HandPolygon[i+1];
      if (i < l/2) { MinuteHandPolygon[i+1] -= MinuteHandLength; }
      if (i > l/2) { MinuteHandPolygon[i+1] -= HandOffset; }
    }
    MinuteHandPolygon[25] = -BoltRadius;
  }

  let transformedPolygon = new Array(HandPolygon.length);

  function transformPolygon (originalPolygon, OriginX,OriginY, Phi) {
    let sPhi = sin(Phi), cPhi = cos(Phi), x,y;

    for (let i = 0, l = originalPolygon.length; i < l; i+=2) {
      x = originalPolygon[i];
      y = originalPolygon[i+1];

      transformedPolygon[i]   = OriginX + x*cPhi + y*sPhi;
      transformedPolygon[i+1] = OriginY + x*sPhi - y*cPhi;
    }
  }

  exports.draw = function draw (
    Settings, CenterX, CenterY, outerRadius, Hours,Minutes,Seconds
  ) {
    prepareHourHandPolygon  (outerRadius * 0.5);
    prepareMinuteHandPolygon(outerRadius * 0.8);

    let HoursAngle   = (Hours+(Minutes/60))/12 * twoPi - Pi;
    let MinutesAngle = (Minutes/60)            * twoPi - Pi;

    let filled = (Settings.FillColor != null);

    transformPolygon(HourHandPolygon, CenterX,CenterY, HoursAngle);
      if (filled) {
        g.setColor(Settings.FillColor === 'Theme' ? g.theme.fgH : Settings.FillColor || '#FFFF00');
        g.fillPoly(transformedPolygon);
      }
    g.setColor(Settings.ArmsColor === 'Theme' ? g.theme.fg : Settings.ArmsColor || '#000000');
    g.drawPoly(transformedPolygon, true);

    transformPolygon(MinuteHandPolygon, CenterX,CenterY, MinutesAngle);
    if (filled) {
      g.setColor(Settings.FillColor === 'Theme' ? g.theme.fgH : Settings.FillColor || '#FFFF00');
      g.fillPoly(transformedPolygon);
    }
    g.setColor(Settings.ArmsColor === 'Theme' ? g.theme.fg : Settings.ArmsColor || '#000000');
    g.drawPoly(transformedPolygon, true);

    if (Seconds != null) {
      g.setColor(Settings.Seconds === 'Theme' ? g.theme.fgH : Settings.Seconds || '#FF0000');

      let SecondsAngle = (Seconds/60) * twoPi - Pi;

      let sPhi = Math.sin(SecondsAngle), cPhi = Math.cos(SecondsAngle);

      let SecondHandLength = outerRadius * 0.9;
      g.drawLine(
        CenterX + SecondHandOffset*sPhi,
        CenterY - SecondHandOffset*cPhi,
        CenterX - SecondHandLength*sPhi,
        CenterY + SecondHandLength*cPhi
      );
      g.setColor(Settings.ArmsColor === 'Theme' ? g.theme.fg : Settings.ArmsColor || '#000000');
    }

    g.drawCircle(CenterX,CenterY, BoltRadius);
  };
})();

