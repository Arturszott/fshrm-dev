'use strict';

var utils = {
	init: function(game) {
		this.game = game;
	},
	rmLoopTween: function(game, tween) {
		var i = game.tweens._tweens.indexOf(tween);

		if (i !== -1) {
			game.tweens._tweens.splice(i, 1);
		}
	},
	anchorC: function(obj) {
		obj.anchor.set(0.5);
	},
	scale: function(obj, scale) {
		obj.scale.x = scale;
		obj.scale.y = scale;
	},
	anims: {
		scale: function(obj, scale, time) {
			game.add.tween(obj.scale).to({
				x: obj.scale.x * scale,
				y: obj.scale.y * scale
			}, time || 400, Phaser.Easing.Linear.None, true, 0, 1, true);
		}.bind(this)
	}
}

module.exports = utils;