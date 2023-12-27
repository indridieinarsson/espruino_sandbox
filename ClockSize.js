;(function () {
  let AppRect;

  exports.CenterX = function CenterX () {
    if (AppRect == null) { AppRect = {x:0, y:0, w:g.getWidth(), h:g.getHeight()}; }
    return AppRect.x + AppRect.w/2;
  };

  exports.CenterY = function CenterY () {
    if (AppRect == null) { AppRect = {x:0, y:0, w:g.getWidth(), h:g.getHeight()}; }
    return AppRect.y + AppRect.h/2;
  };

  exports.outerRadius = function outerRadius () {
    if (AppRect == null) { AppRect = {x:0, y:0, w:g.getWidth(), h:g.getHeight()}; }
    return Math.min(AppRect.w/2,AppRect.h/2);
  };
})();
