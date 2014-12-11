'use strict';

var Bottom = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'bottom', 0);
	// this.x = -this.width / 2
	this.scroll = {
		x: 0,
		y: -1
	}
};

Bottom.prototype = Object.create(Phaser.Sprite.prototype);
Bottom.prototype.constructor = Bottom;
Bottom.prototype.autoScroll = function(x, y) {
	this.scroll.x = x;
	this.scroll.y = y;
}
Bottom.prototype.update = function() {
	if (this.skipped) {
		this.skipped = false;
		return;
	}

	this.y += this.scroll.y * 2;
	this.x += this.scroll.x * 2;

	if (this.y <= -this.height / 2 || this.y >= this.height / 2) {
		this.y = 0;
	}
	if (this.x > 0) {
		this.x = -this.width / 2 / game.widthRatio;
	}
	if (this.game.isAccelerated) {
		this.y -= 12;
	}
	this.skipped = true

};

module.exports = Bottom;