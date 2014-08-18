'use strict';

var WaterObject = require('./waterobject');

var Splash = function(game, x, y) {
	WaterObject.call(this, game, x, y, 'water-splash');
	this.splashAnim = this.animations.add('splashing');
	this.animations.play('splashing', 24, 1);
};

Splash.prototype = Object.create(WaterObject.prototype);
Splash.prototype.constructor = Splash;

Splash.prototype.update = function() {
	this.y -= 12;
	if (this.y < 0) {
		this.destroy();
	}
};

module.exports = Splash;