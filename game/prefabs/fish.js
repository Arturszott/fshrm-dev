'use strict';

var WaterObject = require('./waterobject');
var config = require('../config');

var Fish = function(game, x, y, frame) {
	WaterObject.call(this, game, x, y, 'fish', frame);

	this.animations.add('splash');
	this.animations.play('splash', 9, true);

	this.scale.x = 0.5;
	this.scale.y = 0.5;

	this.underwater = true;

	this.game.add.tween(this.scale).to({
		x: 0.6,
		y: 0.6
	}, 1200, Phaser.Easing.Linear.None, true, 0, 1000, true);
};
Fish.prototype = Object.create(WaterObject.prototype);
Fish.prototype.constructor = Fish;

Fish.prototype.throwAway = function(side) {
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

module.exports = Fish;