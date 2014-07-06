'use strict';

var Splash = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'splash', frame);

  // initialize your prefab here
  
};

Splash.prototype = Object.create(Phaser.Sprite.prototype);
Splash.prototype.constructor = Splash;

Splash.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Splash;
