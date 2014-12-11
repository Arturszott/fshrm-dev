'use strict';
var config = require('../config');
var Waterobject = function(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	this.anchor.setTo(0.5, 0.5);
};
Waterobject.prototype = Object.create(Phaser.Sprite.prototype);
Waterobject.prototype.constructor = Waterobject;

Waterobject.prototype.dispose = function() {
	this.disposed = true;
	this.alive = false;
}
Waterobject.prototype.update = function() {
	if (this.y < 0) {
		this.animations.destroy()
		this.destroy();
	} else if (this.alive && !this.disposed) {
		if (this.game.isAccelerated) {
			this.y -= 12 * this.game.multiplier;
		} else {
			this.y -= 0.2 * this.game.multiplier;
		}
		if (this.y < 170) {
			this.game.slowTriggered = true;
		}
	} else {
		if (this.disposed) {
			this.y -= 12
		}
	}
};

module.exports = Waterobject;