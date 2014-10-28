'use strict';

var WaterObject = require('./waterobject');

var Fish = function(game, x, y, frame) {
	WaterObject.call(this, game, x, y, 'fish', frame);

	this.animations.add('splash');
	this.animations.play('splash', 9, true);

	this.scale.x = 0.5;
	this.scale.y = 0.5;
	this.underwater = true;
};
Fish.prototype = Object.create(WaterObject.prototype);
Fish.prototype.constructor = Fish;

Fish.prototype.throwAway = function(side) {
	this.visible = false;
	this.destroy();
},

module.exports = Fish;