exports = {};
  exports.draw = function draw (x,y, Radius, Settings) {
    hands = require("origclockhands.js");
    hands.draw(Settings, x, y, Radius, 6, 10, 00)
  };
//})();

let Clockwork = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clockwork/main/Clockwork.js');
auxdial = require("origclockhands.js");
Clockwork.windUp({
  size: require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-size/main/ClockSize.js'),
  complications: {
      l: exports, 
      r: exports,
      bl:exports,
      br:exports,
      tl:exports,
      tr:exports
  }
});
