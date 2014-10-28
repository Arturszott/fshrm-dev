'use strict';

var WaterObject = require('./waterobject');

var Pumpkin = function(game, x, y, frame) {
	WaterObject.call(this, game, x, y, 'pumpkin' + Math.floor(Math.random() * 2), frame);

	this.animations.add('splash');
	this.animations.play('splash', 9, true);

	this.scale.x = 0.7;
	this.scale.y = 0.7;
	this.underwater = false;
	this.harmful = true;
};
Pumpkin.prototype = Object.create(WaterObject.prototype);
Pumpkin.prototype.constructor = Pumpkin;

Pumpkin.prototype.throwAway = function(side) {
	this.visible = false;

	var possibilities = [this.game.timer.lucky.bind(this.game.timer), this.game.timer.unlucky.bind(this.game.timer)];
	var n = Math.floor(Math.random() * 2);
	possibilities[n]();
	if(n){
		this.game.audio.pumpkin.play();
	} else {
		this.game.audio.pumpkinWin.play();
	}
	

	possibilities.pop();
	possibilities.pop();

	this.destroy();
},

module.exports = Pumpkin;