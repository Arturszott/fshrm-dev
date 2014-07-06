'use strict';

var Scoreboard = function(game) {

	var gameover;

	Phaser.Group.call(this, game);

	this.scoreboard = this.create(this.game.width / 2, 235, 'board');
	this.scoreboard.anchor.setTo(0.5, 0.5);

	gameover = this.create(this.game.width / 2, 30, 'gameover');
	gameover.anchor.setTo(0.5, 0);

	var scoreX = 25

	this.scoreText = this.game.add.bitmapText(scoreX, -62, 'fisherman', '', 18);
	this.scoreLabel = this.game.add.bitmapText(-this.scoreboard.width / 2 + 30, -62, 'fisherman', 'Score:', 18);

	this.bestScoreText = this.game.add.bitmapText(scoreX, -30, 'fisherman', '', 18);
	this.bestScoreLabel = this.game.add.bitmapText(-this.scoreboard.width / 2 + 30, -30, 'fisherman', 'Best:', 18);

	this.bayButton = this.game.add.button(this.game.width / 2 + 10, 310, 'compassButton', this.startClick, this);
	this.bayButton.anchor.setTo(0, 0.5);

	this.startButton = this.game.add.button(this.game.width / 2 - this.bayButton.width - 10, 310, 'startButton', this.startClick, this);
	this.startButton.anchor.setTo(0, 0.5);

	this.add(this.startButton);
	this.add(this.bayButton);

	this.y = -this.game.height;
	this.x = 0;

};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;
Scoreboard.prototype.show = function(score) {
	var bestScore;

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
		y: 0
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 400);
};
Scoreboard.prototype.startClick = function() {
	this.game.state.start('play');
};


module.exports = Scoreboard;