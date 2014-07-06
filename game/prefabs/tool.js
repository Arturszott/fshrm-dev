'use strict';

var Tool = function(game, x, y, type, offset, parent) {
	this.offset = offset;

	this.basePosition = {
		x: x + offset.x,
		y: y + offset.y
	}

	Phaser.Sprite.call(this, game, x + offset.x, y + offset.y, type || 'pole', 0);
	this.windAnim = this.animations.add('wind');
	this.animations.play('wind', 8, true);

	this.type = type;

	// initialize your prefab here
	this.anchor.setTo(0.5, 0.5);
	this.scale.x = 0.6;
	this.scale.y = 0.6;

	this.waveTween = this.game.add.tween(this).to({
		y: this.y + 10
	}, 300, Phaser.Easing.Linear.None, true, 0, 1000, true);

};

Tool.prototype = Object.create(Phaser.Sprite.prototype);
Tool.prototype.constructor = Tool;

Tool.prototype.update = function() {

	// write your prefab's specific update code here

};
Tool.prototype.catch = function(side, swimDistance) {
	var that = this;
	var anim;

	this.loadTexture(this.type + '-' + side, 0);
	this.waveTween.pause();

	if (side === 'right') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 + swimDistance - this.offset.x,
		}, 80, Phaser.Easing.Linear.None, true);

		this.y = this.basePosition.y + 40;
	}
	if (side === 'left') {
		this.game.add.tween(this).to({
			x: this.game.width / 2 - swimDistance + this.offset.x,
		}, 80, Phaser.Easing.Linear.None, true);

		this.y = this.basePosition.y + 40;
	}

	anim = this.animations.add('swing');
	this.animations.play('swing', 24, 1);

	anim.onComplete.add(function() {
		this.waveTween.resume();

		this.loadTexture(this.type, 0);
		this.windAnim = this.animations.add('wind');
		this.animations.play('wind', 8, true);

	}, this);



};

module.exports = Tool;