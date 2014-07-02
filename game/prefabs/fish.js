'use strict';

var WaterObject = require('./waterobject');
var config = require('../config');

var Fish = function(game, x, y, frame) {
	WaterObject.call(this, game, x, y, 'fish', frame);

	this.animations.add('splash');
	this.animations.play('splash', 2, true);
};
Fish.prototype = Object.create(WaterObject.prototype);
Fish.prototype.constructor = Fish;

Fish.prototype.throwAway = function(side) {
	var x = side === 'left' ? -60 : this.game.width + 60;

	return this.game.add.tween(this).to({
		x: x,
		angle: side === 'left' ? -config.fishRotationAngle : config.fishRotationAngle
	}, config.throwAnimationTime, Phaser.Easing.Linear.None, true);
},

module.exports = Fish;