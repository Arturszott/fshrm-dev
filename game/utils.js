'use strict';

var utils = {
	rmLoopTween: function(game, tween){
		var i = game.tweens._tweens.indexOf(tween);

		if (i !== -1) {
			game.tweens._tweens.splice(i, 1);
		}
	},
	anchorC: function(obj){
		obj.anchor.set(0.5);
	},
	scale: function(obj, scale){
		obj.scale.x = scale;
		obj.scale.y = scale;
	}
}

module.exports = utils;