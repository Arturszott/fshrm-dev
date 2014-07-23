'use strict';

var WaterObject = require('./waterobject');
var config = require('../config');

var Barrel = function(game, x, y, frame) {
	WaterObject.call(this, game, x, y, 'barrel', frame);

	this.animations.add('splash');
	this.animations.play('splash', 6, true);

	this.scale.x = 0.6;
	this.scale.y = 0.6;
	
	this.underwater = false;
};
Barrel.prototype = Object.create(WaterObject.prototype);
Barrel.prototype.constructor = Barrel;
Barrel.prototype.throwAway = function(side) {
	// this.visible = false;
	this.body.velocity.y = -200;

	var x = side === 'left' ? -80 : this.game.width + 80;

	this.game.add.tween(this.scale).to({
		x: 1,
		y: 1
	}, config.throwAnimationTime, Phaser.Easing.Linear.None, true);

	return this.game.add.tween(this).to({
		x: x,
		angle: side === 'left' ? -config.fishRotationAngle : config.fishRotationAngle
	}, config.throwAnimationTime, Phaser.Easing.Linear.None, true);
},

module.exports = Barrel;