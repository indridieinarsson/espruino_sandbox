;(function () {
  exports.draw = function draw (x,y, Radius, Settings) {
    let halfScreenWidth   = g.getWidth() / 2;
    let largeComplication = (x === halfScreenWidth);
 //     let hands = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-hands/main/ClockHands.js')

    g.setColor(Settings.Foreground === 'Theme' ? g.theme.fg : Settings.Foreground || '#000000');
    g.setFont('Vector', 18);
    g.setFontAlign(0,0);

//    let today = new Date(), Text;
//      hands.draw()
//draw (Settings, CenterX, CenterY, outerRadius, Hours, Minutes, Seconds)
    if (largeComplication) {
      Text = today.getHours()+':'+today.getMinutes()+'-23:30';
    } else {
      Text = '' + today.getDate()+'-';
    }

    g.drawString(Text, x,y);
  };
})();
