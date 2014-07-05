'use strict';

var Tool = function(game, x, y, type, offset) {
	this.offset = offset;

	Phaser.Sprite.call(this, game, x + offset.x, y + offset.y, type || 'pole', 0);
	this.animations.add('wind');
	this.animations.play('wind', 8, true);

	// initialize your prefab here
	this.anchor.setTo(0.5, 0.5);
	this.scale.x = 0.6;
	this.scale.y = 0.6;

	this.game.add.tween(this).to({
		y: this.y + 10
	}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true);

};

Tool.prototype = Object.create(Phaser.Sprite.prototype);
Tool.prototype.constructor = Tool;

Tool.prototype.update = function() {

	// write your prefab's specific update code here

};
Tool.prototype.catch = function(side) {
	this.bringToTop();
	var that = this;

	if (side === 'right') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 + 30 + this.offset.x,
		}, 80, Phaser.Easing.Linear.None, true);
	}
	if (side === 'left') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 - 30 + this.offset.x,
		}, 80, Phaser.Easing.Linear.None, true);
	}
};

module.exports = Tool;