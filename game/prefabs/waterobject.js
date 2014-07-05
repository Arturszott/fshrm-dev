'use strict';

var Waterobject = function(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);

	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enableBody(this);

	this.body.allowGravity = false;
	this.body.immovable = true;
	this.body.velocity.y = -40;
};
Waterobject.prototype = Object.create(Phaser.Sprite.prototype);
Waterobject.prototype.constructor = Waterobject;

Waterobject.prototype.checkOnScreen = function() {
	if (!this.inWorld && this.y < 0) {
		this.exists = false;
		this.destroy();
	}
};
Waterobject.prototype.addToWorld = function() {
	if(this.underwater) {
		this.game.world.addAt(this, 1)
	} else {
		this.game.add.existing(this);
	}
};

Waterobject.prototype.update = function() {
	this.checkOnScreen();
};

module.exports = Waterobject;