'use strict';

var utils = {
	rmLoopTween: function(game, tween){
		var i = game.tweens._tweens.indexOf(tween);

		if (i !== -1) {
			game.tweens._tweens.splice(i, 1);
		}
	}
}

module.exports = utils;