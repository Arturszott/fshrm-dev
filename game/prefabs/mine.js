'use strict';

var WaterObject = require('./waterobject');

var Mine = function(game, x, y, frame) {
	WaterObject.call(this, game, x, y, 'mine', frame);

	this.animations.add('splash');
	this.animations.play('splash', 2, true);
};
Mine.prototype = Object.create(WaterObject.prototype);
Mine.prototype.constructor = Mine;

module.exports = Mine;