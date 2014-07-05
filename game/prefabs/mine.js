'use strict';

var WaterObject = require('./waterobject');

var Mine = function(game, x, y, frame) {
	WaterObject.call(this, game, x, y, 'mine', frame);

	this.animations.add('splash');
	this.animations.play('splash', 6, true);

	this.scale.x = 0.6;
	this.scale.y = 0.6;
	
	this.underwater = false;
};
Mine.prototype = Object.create(WaterObject.prototype);
Mine.prototype.constructor = Mine;
Mine.prot

module.exports = Mine;