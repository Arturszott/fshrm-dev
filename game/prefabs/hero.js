'use strict';

var Hero = function(game, x, y, type) {
	var y = y + 50;
	Phaser.Sprite.call(this, game, x, y, type || 'fisherman', 0);

	this.anchor.setTo(0.5, 0.5);
	this.swimAnim = this.animations.add('swim');
	this.animations.play('swim', 7, true);

	this.scale.x = 0.75;
	this.scale.y = 0.75;

	this.flapSound = this.game.flapSound;

	this.name = type || 'fisherman';

	this.events.onKilled.add(this.onKilled, this);
};

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.catch = function(side, swimDistance) {
	var that = this;

	PGLowLatencyAudio && PGLowLatencyAudio.play('catch');

	if (side === 'right') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 + swimDistance,
		}, 80, Phaser.Easing.Linear.None, true);
	}
	if (side === 'left') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 - swimDistance,
		}, 100, Phaser.Easing.Linear.None, true);
	}
};
Hero.prototype.update = function() {};
Hero.prototype.applyDeath = function() {
	var hero = this;

	this.loadTexture('explosion', 0);

	this.animations.add('explosion').onComplete.add(function(){
		hero.loadTexture('skull', 0);
	});

	this.animations.play('explosion', 32, 1);
	this.alive = false;
};
Hero.prototype.onKilled = function() {
	this.exists = true;
	this.visible = true;
	this.killed = true;
	this.animations.stop();
};

module.exports = Hero;