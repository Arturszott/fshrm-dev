'use strict';

var Mine = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'mine', frame);

	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enableBody(this);

	this.body.allowGravity = false;
	this.body.immovable = true;
	this.body.velocity.y = -40;
};
Mine.prototype = Object.create(Phaser.Sprite.prototype);
Mine.prototype.constructor = Mine;

Mine.prototype.checkOnScreen = function() {
	if (!this.inWorld && this.y < 0) {
		this.exists = false;
		// this.destroy();
	}
};

Mine.prototype.update = function() {
	this.checkOnScreen();
};

module.exports = Mine;