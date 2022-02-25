//ble = (function () {
exports = {}

  exports.draw = function draw (x,y, Radius, Settings) {
    let halfScreenWidth   = g.getWidth() / 2;
    let largeComplication = (x === halfScreenWidth);
      let hands = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-hands/main/ClockHands.js')

    g.setColor(Settings.Foreground === 'Theme' ? g.theme.fg : Settings.Foreground || '#000000');
    g.setFont('Vector', 18);
    g.setFontAlign(0,0);

    let today = new Date(), Text;
    if (largeComplication) {
      Text = today.getHours()+':'+String.fromCharCode(188);
    } else {
      Text = '' + today.getDate()+'-';
    }

    g.drawString(Text, x,y);
    //  hands.draw(Settings, x, y, Radius, 12, 15, 30)
  };
//})();

let Clockwork = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clockwork/main/Clockwork.js')

Clockwork.windUp({
  size: require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-size/main/ClockSize.js'),
  complications: {
    r:require('https://raw.githubusercontent.com/rozek/banglejs-2-date-complication/main/Complication.js'),
    t:require('https://raw.githubusercontent.com/indridieinarsson/banglejs-2-date-complication/main/Complication.js'),
      b:exports
  }
});
