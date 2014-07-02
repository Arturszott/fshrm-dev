'use strict';

var Timer = function(game, time, deathHandler) {
	Phaser.Sprite.call(this, game, game.width / 2, game.height - 100, 'timer', 0);
	this.anchor.setTo(0.5, 0.5);

	this.maxDuration = time;
	this.currentTime = time;

	this.started = false;
	this.deathHandler = deathHandler;


	this.game.add.existing(this);
	this.timebarWidth = this.width - 50;

	this.bar = this.game.add.tileSprite(this.x - this.width / 2 + 25, this.y - this.height / 2 + 16, this.timebarWidth, 28, 'timebar');
};
Timer.prototype = Object.create(Phaser.Sprite.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.setBar = function() {
	this.bar.width = this.timebarWidth * this.currentTime / this.maxDuration;
};
Timer.prototype.start = function() {
	this.started = true;
	console.log(this);
};
Timer.prototype.destroyAll = function() {
	this.bar.destroy();
	this.destroy();
};
Timer.prototype.stop = function() {
	this.started = false;
	console.log(this);
};
Timer.prototype.decrease = function() {
	if (!this.started) return false;

	var decreaseValue = 16;

	if (this.currentTime - decreaseValue <= 0) {
		this.currentTime = 0;
		this.deathHandler();
	} else {
		this.currentTime -= decreaseValue;
	}

	this.setBar();
};
Timer.prototype.increase = function() {
	if (!this.started) return false;

	var increaseValue = 300;

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