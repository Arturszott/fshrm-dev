'use strict';

var storage = require('../storage');

var Scoreboard = function(game) {

	var gameover;

	Phaser.Group.call(this, game);

	this.scoreboard = this.create(this.game.width / 2, 235, 'board');
	this.scoreboard.anchor.setTo(0.5, 0.5);

	gameover = this.create(this.game.width / 2, 30, 'gameover');
	gameover.anchor.setTo(0.5, 0);

	this.gameoverWave = this.game.add.tween(gameover).to({
		y: 0,
	}, 900, Phaser.Easing.Linear.None, true, 0, 5, true);



	var scoreX = 25

	this.scoreText = this.game.add.bitmapText(scoreX, -62, 'fisherman', '', 18);
	this.scoreLabel = this.game.add.bitmapText(-this.scoreboard.width / 2 + 30, -62, 'fisherman', 'score:', 18);

	this.bestScoreText = this.game.add.bitmapText(scoreX, -30, 'fisherman', '', 18);
	this.bestScoreLabel = this.game.add.bitmapText(-this.scoreboard.width / 2 + 30, -30, 'fisherman', 'best:', 18);

	var buttonsY = 380;

	this.bayButton = this.game.add.button(this.game.width / 2, buttonsY, 'homeBtn', this.bayClick, this, 0, 0, 1, 0);
	this.bayButton.anchor.setTo(0.5, 0.5);

	this.startButton = this.game.add.button(this.bayButton.x - this.bayButton.width - 10, buttonsY, 'playBtn', this.startClick, this, 0, 0, 1, 0);
	this.startButton.anchor.setTo(0.5, 0.5);

	this.rankButton = this.game.add.button(this.bayButton.x + this.bayButton.width + 10, buttonsY, 'rankBtn', this.startClick, this, 0, 0, 1, 0);
	this.rankButton.anchor.setTo(0.5, 0.5);

	this.add(this.rankButton);
	this.add(this.startButton);
	this.add(this.bayButton);

	this.y = -this.game.height;
	this.x = 0;

};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;
Scoreboard.prototype.show = function(score) {
	var bestScore;

	storage.addFish(score);

	this.isShown = true;
	this.scoreboard.addChild(this.scoreText);
	this.scoreboard.addChild(this.bestScoreText);
	this.scoreboard.addChild(this.scoreLabel);
	this.scoreboard.addChild(this.bestScoreLabel);
	this.scoreText.setText(score.toString());

	if (!!localStorage) {
		bestScore = localStorage.getItem('bestScore');

		if (!bestScore || bestScore < score) {
			bestScore = score;
			localStorage.setItem('bestScore', bestScore);
		}
	} else {
		// Fallback. LocalStorage isn't available
		bestScore = 'N/A';
	}
	this.bestScoreText.setText(bestScore + '');

	this.game.add.tween(this).to({
		y: 40
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 400).to({
		y: 0
	}, 200, Phaser.Easing.Sinusoidal.Out, true, 0);;
};

Scoreboard.prototype.hide = function() {
	var y = -this.game.height;
	var that = this;

	this.game.add.tween(this)
		.to({
			y: y
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0)
		.onComplete.add(function() {
			setTimeout(this.destroy.bind(this));
		}.bind(this));
}

Scoreboard.prototype.startClick = function() {
	this.game.state.start('play');
};
Scoreboard.prototype.bayClick = function() {
	this.hide();
	this.game.bay.travel();
};


module.exports = Scoreboard;