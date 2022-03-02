exports = {};
  exports.quarters = [0, String.fromCharCode(188), String.fromCharCode(189), String.fromCharCode(190), 0];

  exports.compactTime = function(t) {
    return ''+t.getHours()+this.quarters[Math.round(t.getMinutes()/15)];
  };

  exports.draw = function draw (x,y, Radius, Settings) {
    let halfScreenWidth   = g.getWidth() / 2;
    let largeComplication = (x === halfScreenWidth);
    
    hands = require("origclockhands.js");
    //g.setColor(Settings.Foreground === 'Theme' ? g.theme.fg : Settings.Foreground || '#000000');
    //g.setFont('Vector', 18);
    //g.setFontAlign(0,0);

    let today = new Date(), Text;
    //this.compactTime(today);
    if (largeComplication) {
      Text = this.compactTime(today)+'-22'+String.fromCharCode(190);
    } else {
      Text = this.compactTime(today);
    }


    for (let i = 0; i < 12; i++) {
      let Phi = i * Math.PI*2/12;

      let dotx = x + Radius * Math.sin(Phi);
      let doty = y - Radius * Math.cos(Phi);
      g.drawCircle(dotx,doty, 0.5);
    }
    //  g.drawString(Text, x,y);
    console.log("x y " + x + "  " + y + " " + Radius);
    hands.draw(Settings, x, y, Radius, 6, 10, 00)
  };
//})();

let Clockwork = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clockwork/main/Clockwork.js');

Clockwork.windUp({
  size: require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-size/main/ClockSize.js'),
  complications: {
      l:exports
  }
});
