'use strict';

var Fisherman = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'fisherman', frame);
	this.anchor.setTo(0.5, 0.5);
	this.animations.add('flap');
	this.animations.play('flap', 12, true);

	this.flapSound = this.game.flapSound;

	this.name = 'fisherman';
	this.alive = false;
	this.onGround = false;

	this.events.onKilled.add(this.onKilled, this);
};

Fisherman.prototype = Object.create(Phaser.Sprite.prototype);
Fisherman.prototype.constructor = Fisherman;

Fisherman.prototype.catch = function(side) {
	var that = this;

	if (this.alive) {
		PGLowLatencyAudio && PGLowLatencyAudio.play('catch');

		console.log('catchin, side: ' + side);

		if (side === 'right') {
			this.game.add.tween(this).to({
				x: this.game.width / 2 + 30,
			}, 100, Phaser.Easing.Linear.None, true);
			// this.x = this.game.width / 2 + 30;
			// this.loadTexture('catchright', 0);
			this.animations.add('catchright');
			this.animations.play('catchright', 2, true);
		}
		if (side === 'left') {
			this.game.add.tween(this).to({
				x: this.game.width / 2 - 30,
			}, 100, Phaser.Easing.Linear.None, true);
			// this.x = this.game.width / 2 - 30;
			// this.loadTexture('catchleft', 0);
			this.animations.add('catchleft');
			this.animations.play('catchleft', 2, true);
		}
		// setTimeout(function() {
		// 	that.loadTexture('nocatch', 0);
		// }, 80);
	}
};
Fisherman.prototype.update = function() {};
Fisherman.prototype.applyDeath = function() {
	this.loadTexture('explosion', 0);
	this.animations.add('explosion');
	this.animations.play('explosion', 16, 1);
	this.alive = false;
};
Fisherman.prototype.onKilled = function() {
	this.exists = true;
	this.visible = true;
	this.killed = true;
	this.animations.stop();
};

module.exports = Fisherman;