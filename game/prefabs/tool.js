'use strict';

var Tool = function(game, x, y, type, offset, parent) {
	this.offset = offset;

	this.basePosition = {
		x: x + offset.x,
		y: y + offset.y - 5
	}

	Phaser.Sprite.call(this, game, x + offset.x, y + offset.y, type + 'full', 0);

	// 2h tool case
	if (type === 'laserpistol') {
		this.windAnim = this.animations.add('idle-left', [0, 1, 2, 3]);
		this.windAnimRight = this.animations.add('idle-right', [4, 5, 6, 7]);
		this.swingLeft = this.animations.add('swingLeft', [8, 9, 10, 11]);
		this.swingRight = this.animations.add('swingRight', [12, 13, 14, 15]);
	} else {
		this.windAnim = this.animations.add('idle-left', [0, 1, 2, 3]);
		this.windAnimRight = this.animations.add('idle-right', [0, 1, 2, 3]);
		this.swingLeft = this.animations.add('swingLeft', [4, 5, 6, 7]);
		this.swingRight = this.animations.add('swingRight', [8, 9, 10, 11]);
	}

	this.animations.play('idle-left', 8, true);

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
	// var anim;

	this.idleTimeout ? clearTimeout(this.idleTimeout) : true;
	this.animations.stop();

	if (side === 'right') {
		this.x = this.game.width / 2 + swimDistance - this.offset.x;

		this.y = this.basePosition.y + 40;
		// anim = this.swingRight;
		this.animations.play('swingRight', 24, 1);
	}
	if (side === 'left') {
		this.x = this.game.width / 2 - swimDistance + this.offset.x;

		this.y = this.basePosition.y + 40;
		// anim = this.swingLeft;
		this.animations.play('swingLeft', 24, 1);
	}

	this.idleTimeout = setTimeout(function() {
		this.animations.play('idle-' + side);
	}.bind(this), 200);



};

module.exports = Tool;