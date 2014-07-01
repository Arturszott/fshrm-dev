'use strict';

var Fish = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'fish', frame);

	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enableBody(this);

	this.animations.add('splash');
	this.animations.play('splash', 2, true);

	this.body.allowGravity = false;
	this.body.immovable = true;
	this.body.velocity.y = -40;
};
Fish.prototype = Object.create(Phaser.Sprite.prototype);
Fish.prototype.constructor = Fish;

Fish.prototype.checkOnScreen = function() {
	if (!this.inWorld && this.y < 0) {
		this.exists = false;
		// this.destroy();
	}
};

Fish.prototype.update = function() {
	this.checkOnScreen();
};

module.exports = Fish;