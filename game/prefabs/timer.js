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
	this.timebarWidth = this.width - 24;
	this.bar = this.game.add.sprite(-this.timebarWidth / 2, 10, 'timebar');

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
	this.game.add.tween(this).to({
		y: this.game.height - 120
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false).to({
		y: this.game.height - 80
	}, 200, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
		this.started = true;
	}.bind(this));

};
Timer.prototype.destroyAll = function() {
	this.bar.destroy();
	this.destroy();
};
Timer.prototype.update = function() {
	this.decrease();
}
Timer.prototype.stop = function() {
	this.started = false;
};
Timer.prototype.decrease = function() {
	if (!this.started) return false;
	var magicNumber = 67;
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
Timer.prototype.unlucky = function() {
	this.currentTime = this.maxDuration / 5;
	this.pumpkinify();

	this.setBar();
};
Timer.prototype.pumpkinify = function(){
	this.timeout && clearTimeout(this.timeout);
	this.timeout = setTimeout(function(){
		if(!this.visible) return;

		this.loadTexture('timer');
		this.bar.loadTexture('timebar');
		this.pumpkinified = false;
	}.bind(this), 2000);

	if(this.pumpkinified) return false;

	this.pumpkinified = true;
	this.cloud = this.game.add.sprite(0, 0, 'crafting');
	this.cloud.smokin = this.cloud.animations.add('smokin');
	this.cloud.smokin.killOnComplete = true;
	this.cloud.animations.play('smokin', 14, 1);
	_.anchorC(this.cloud);
	_.scale(this.cloud, 1);

	this.addChild(this.cloud);

	this.loadTexture('timer-pumpkin');
	this.bar.loadTexture('timebar-yellow');
};
Timer.prototype.lucky = function() {
	this.currentTime = this.maxDuration;
	this.pumpkinify();
	this.setBar();
};
Timer.prototype.increase = function() {
	if (!this.started) return false;

	var increaseValue = 200 + this.game.level * 9;

	if (this.currentTime + increaseValue >= this.maxDuration) {
		this.currentTime = this.maxDuration;
	} else {
		this.currentTime += increaseValue;
	}

	this.setBar();
};

module.exports = Timer;