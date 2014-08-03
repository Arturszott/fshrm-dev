'use strict';

var Water = function(game, x, y) {
	Phaser.Sprite.call(this, game, x - 144, y, 'water', 0);
	this.scroll = {
		x: 0,
		y: -2
	}
};

Water.prototype = Object.create(Phaser.Sprite.prototype);
Water.prototype.constructor = Water;
Water.prototype.autoScroll = function(x, y) {
	this.scroll.x = x || this.scroll.x;
	this.scroll.y = y || this.scroll.y;
}
Water.prototype.update = function() {
	this.y = this.y + this.scroll.y;
	this.x = this.x + this.scroll.x;

	if (this.y <= -144 || this.y >= 144) {
		this.y = 0;
	}
	if (this.x <= -144 || this.x >= 144) {
		this.x = 0;
	}
};

module.exports = Water;