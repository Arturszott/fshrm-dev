'use strict';

var _ = require('../utils');

var Timer = function(game, time, deathHandler) {
	Phaser.Sprite.call(this, game, game.width / 2, game.height + 100, 'timer', 0);
	this.anchor.setTo(0.5, 0.5);

	this.maxDuration = time;
	this.currentTime = time;

	this.visible = false;
	this.started = false;
	this.deathHandler = deathHandler;

	this.game.add.existing(this)
	this.timebarWidth = this.width - 50;
	this.bar = this.game.add.sprite(-this.timebarWidth / 2, 0, 'timebar');
	this.game.stage.addChild(this);
	this.bar.anchor.setTo(0, 0.5);
	this.addChild(this.bar);
	this.setBar();
};
Timer.prototype = Object.create(Phaser.Sprite.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.setBar = function() {
	this.bar.width = this.timebarWidth * this.currentTime / this.maxDuration;
};
Timer.prototype.start = function() {
	this.visible = true;
	// this.currentTime = this.currentTime / 2;

	this.game.add.tween(this).to({
		y: this.game.height - 120
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false).to({
		y: this.game.height - 100
	}, 200, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
		this.started = true;
	}.bind(this));

};
Timer.prototype.destroyAll = function() {
	this.bar.destroy();
	this.destroy();
};

Timer.prototype.stop = function() {
	this.started = false;
};
Timer.prototype.decrease = function() {
	if (!this.started) return false;
	var magicNumber = 70;
	var decreaseValue = Math.tan(Math.sqrt(this.game.level + 2) / 10) * magicNumber;

	if (this.currentTime - decreaseValue <= 0) {
		this.currentTime = 0;

		this.game.add.tween(this).to({
			y: this.game.height + 100
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
			this.started = false;
			this.destroyAll();
		}.bind(this));

		this.deathHandler();
	} else {
		this.currentTime -= decreaseValue;
	}

	this.setBar();
};
Timer.prototype.increase = function() {
	if (!this.started) return false;

	var increaseValue = 200 + this.game.level * 10;

	if (this.currentTime + increaseValue >= this.maxDuration) {
		this.currentTime = this.maxDuration;
	} else {
		this.currentTime += increaseValue;
	}

	this.setBar();


};
// Timer.prototype.update = function() {
// 	this.decrease();

// };

module.exports = Timer;