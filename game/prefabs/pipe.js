'use strict';

var Pipe = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'pipe', frame);

	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enableBody(this);

	this.body.allowGravity = false;
	this.body.immovable = true;
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.demolish = function() {
	this.body.allowGravity = true;
	this.body.velocity.y = -40;
	this.body.gravity.set(0, -1100);
	this.game.add.tween(this).to({
		angle: -40
	}, 10000).start();

	this.demolished = true;
}

Pipe.prototype.update = function() {

};

module.exports = Pipe;