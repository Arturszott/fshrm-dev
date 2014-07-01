'use strict';

var Fisherman = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'nocatch', frame);
	this.anchor.setTo(0.5, 0.5);
	this.animations.add('flap');
	this.animations.play('flap', 12, true);

	this.flapSound = this.game.flapSound;

	this.name = 'fisherman';
	this.alive = false;
	this.onGround = false;

	// this.game.physics.arcade.enableBody(this);
	// this.body.allowGravity = false;
	// this.body.collideWorldBounds = true;

	this.events.onKilled.add(this.onKilled, this);
};

Fisherman.prototype = Object.create(Phaser.Sprite.prototype);
Fisherman.prototype.constructor = Fisherman;

Fisherman.prototype.catch = function(side) {
	var that = this;

	if(this.alive){
		PGLowLatencyAudio && PGLowLatencyAudio.play('catch');
		
		console.log('catchin, side: ' + side);

		if(side === 'right'){
			this.x = this.game.width / 2 + 30;
			this.loadTexture('catchright', 0);
		    this.animations.add('catchright');
		    this.animations.play('catchright', 2, true);
		}
		if(side === 'left'){
			this.x = this.game.width / 2 - 30;
			this.loadTexture('catchleft', 0);
		    this.animations.add('catchleft');
		    this.animations.play('catchleft', 2, true);
		}
		setTimeout(function() {
			that.loadTexture('nocatch', 0);
		}, 80);
	}
	

};
Fisherman.prototype.update = function() {

};

Fisherman.prototype.onKilled = function() {
	this.exists = true;
	this.visible = true;
	this.killed = true;
	this.animations.stop();
	// var duration = 90 / this.y * 300;
	// this.game.add.tween(this).to({
	// 	angle: 90
	// }, duration).start();
	console.log('killed');
	console.log('alive:', this.alive);
};

module.exports = Fisherman;