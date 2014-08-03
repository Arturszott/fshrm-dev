'use strict';

var Bottom = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'bottom', 0);
	this.x = -this.width / 2
	this.scroll = {
		x: 0,
		y: -2
	}
};

Bottom.prototype = Object.create(Phaser.Sprite.prototype);
Bottom.prototype.constructor = Bottom;
Bottom.prototype.autoScroll = function(x, y) {
	this.scroll.x = x || this.scroll.x;
	this.scroll.y = y || this.scroll.y;
}
Bottom.prototype.update = function() {
	this.y = this.y + this.scroll.y;
	this.x = this.x + this.scroll.x;

	if (this.y <= -this.height / 2 || this.y >= this.height / 2) {
		this.y = 0;
	}
	if (this.x <= -this.width / 2 || this.x >= this.width / 2) {
		this.x = 0;
	}

};

module.exports = Bottom;