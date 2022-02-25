let Clockwork = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clockwork/main/Clockwork.js')
Clockwork.windUp({
  size: require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clock-size/main/ClockSize.js'),
  complications: {
    r:require('https://raw.githubusercontent.com/rozek/banglejs-2-date-complication/main/Complication.js'),
    t:require('https://raw.githubusercontent.com/indridieinarsson/banglejs-2-date-complication/main/Complication.js'),
      b:require('ble')

  }
});
