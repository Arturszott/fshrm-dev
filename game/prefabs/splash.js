'use strict';

var WaterObject = require('./waterobject');

var Splash = function(game, x, y) {
  WaterObject.call(this, game, x, y, 'water-splash');
  this.splashAnim = this.animations.add('splashing');
  this.animations.play('splashing', 24, 1);
  this.body.velocity.y = -600;
  // initialize your prefab here
  
};

Splash.prototype = Object.create(WaterObject.prototype);
Splash.prototype.constructor = Splash;

Splash.prototype.update = function() {
	if (this.y < 0) {
		this.destroy();
	}
};

module.exports = Splash;
