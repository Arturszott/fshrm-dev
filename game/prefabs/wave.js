'use strict';

var Wave = function(game, x, y, type) {
	// var y = y + 55;
	Phaser.Sprite.call(this, game, x, y, 'water-wave', 0);
	this.waveAnim = this.animations.add('waving');
	this.animations.play('waving', 7, true);
	this.anchor.setTo(0.5, 0.5);
	this.scale.x = 0.75;
	this.scale.y = 0.75;

};

Wave.prototype = Object.create(Phaser.Sprite.prototype);
Wave.prototype.constructor = Wave;

Wave.prototype.update = function() {

	// write your prefab's specific update code here

};
Wave.prototype.applyDeath = function() {
	this.waveAnim.stop();
	this.visible = false;
};
Wave.prototype.catch = function(side, swimDistance) {
	var that = this;

	if (side === 'right') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 + swimDistance,
		}, 80, Phaser.Easing.Linear.None, true);
	}
	if (side === 'left') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 - swimDistance,
		}, 80, Phaser.Easing.Linear.None, true);
	}
};

module.exports = Wave;