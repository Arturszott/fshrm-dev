'use strict';

var Mount = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'mount', 0);
  this.animations.add('swim');
  this.animations.play('swim', 7, true);
  this.anchor.setTo(0.5, 0.5);
  this.scale.x = 0.75;
  this.scale.y = 0.75;
  
};

Mount.prototype = Object.create(Phaser.Sprite.prototype);
Mount.prototype.constructor = Mount;

Mount.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
Mount.prototype.catch = function(side, swimDistance) {
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

module.exports = Mount;
