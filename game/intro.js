'use strict';
var _ = require('./utils');

var storage = require('./storage');
var Fish = require('./prefabs/fish');
var Mine = require('./prefabs/mine');

var Intro = function(game, parent) {
	this.game = game;

	this.parent = parent;
	this.parent.crew.tool.visible = false;
	this.isPlaying = false;

	this.playStep = function() {

		if (this.isPlaying) return;

		this.isPlaying = true;
		this['step' + currentStep].call(this);
	}


	var half = this.game.width / 2;
	var fullheight = this.game.height;

	var leftSide = this.game.add.tileSprite(-half, 0, half, fullheight, 'introlayer');
	var rightSide = this.game.add.tileSprite(half * 3, 0, half, fullheight, 'introlayer');
	var line = this.game.add.tileSprite(half, 2 * fullheight, 32, fullheight, 'line');
	_.anchorC(line);

	var currentStep = 0;
	var isPlaying = false;

	var LEFT_POSITION = this.game.width / 6;
	var RIGHT_POSITION = this.game.width / 6 * 5;

	var howTo = this.game.add.sprite(RIGHT_POSITION, -100, 'howto');
	var dead = this.game.add.sprite(LEFT_POSITION, -100, 'dead');
	var heart = this.game.add.sprite(RIGHT_POSITION, -100, 'heart');
	var tapRight = this.game.add.sprite(RIGHT_POSITION + half, fullheight / 2, 'tap-right');
	var tapLeft = this.game.add.sprite(LEFT_POSITION - half, fullheight / 2, 'tap-left');

	this.okButton = this.game.add.button(RIGHT_POSITION + half, 50 + howTo.height, 'ok-btn', this.playStep, this, 0, 0, 1, 0);

	_.anchorC(this.okButton);
	_.anchorC(tapRight);
	_.anchorC(tapLeft);
	_.scale(this.okButton, 0.85);

	_.anchorC(dead);
	_.scale(dead, 0.85);

	_.anchorC(heart);
	_.scale(heart, 0.85);


	_.anchorC(howTo);
	_.scale(howTo, 0.8);

	this.introGroup = this.game.add.group();
	this.introGroup.add(leftSide);
	this.introGroup.add(rightSide);
	this.introGroup.add(line);
	this.introGroup.add(howTo);
	this.introGroup.add(dead);
	this.introGroup.add(heart);
	this.introGroup.add(tapRight);
	this.introGroup.add(tapLeft);
	this.introGroup.add(this.okButton);

	leftSide.alpha = 0.8;
	rightSide.alpha = 0.8;

	var mine = new Mine(this.game, LEFT_POSITION - half, this.game.CELL_SIZE * 2);
	mine.body.velocity.y = 0;
	mine.scale.x = 0.8;
	mine.scale.y = 0.8;

	var fish = new Fish(this.game, RIGHT_POSITION + half, this.game.CELL_SIZE * 2);
	fish.body.velocity.y = 0;
	fish.scale.x = 0.8;
	fish.scale.y = 0.8;

	this.game.add.existing(mine);
	this.game.add.existing(fish);

	this.step0 = function() {
		console.log('step 0');

		var delay = 600;

		this.game.add.tween(leftSide).to({
			x: 0
		}, 500, Phaser.Easing.Sinusoidal.Out, true, delay, false);
		this.game.add.tween(rightSide).to({
			x: half
		}, 500, Phaser.Easing.Sinusoidal.Out, true, delay, false);

		this.game.world.bringToTop(this.parent.crew);



		this.game.add.tween(howTo).to({
			y: 50
		}, 500, Phaser.Easing.Linear.Out, true, 1100, false).onComplete.add(function() {
			howTo.waveTween = this.game.add.tween(howTo).to({
				y: howTo.y + 10
			}, 300, Phaser.Easing.Linear.None, true, 0, 1000, true);
		}.bind(this));

		this.game.add.tween(this.okButton).to({
			x: RIGHT_POSITION
		}, 500, Phaser.Easing.Linear.Out, true, 1100, false).onComplete.add(function() {
			this.isPlaying = false;
			currentStep++;
		}.bind(this));
	};
	this.step1 = function() {
		console.log('step1')

		this.game.add.tween(howTo).to({
			y: -100
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			howTo.destroy();
		}.bind(this));

		this.game.add.tween(this.okButton).to({
			x: RIGHT_POSITION + half
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			this.okButton.x = -half;
			this.okButton.y = this.okButton.y + 150;

			this.game.add.tween(this.okButton).to({
				x: LEFT_POSITION
			}, 500, Phaser.Easing.Linear.Out, true, 400, false).onComplete.add(function() {
				this.isPlaying = false;
				currentStep++;
			}.bind(this));

		}.bind(this));

		this.game.add.tween(mine).to({
			x: LEFT_POSITION
		}, 500, Phaser.Easing.Linear.Out, true, 0, false);

		this.game.add.tween(dead).to({
			y: 50
		}, 500, Phaser.Easing.Linear.Out, true, 400, false).onComplete.add(function() {
			dead.waveTween = this.game.add.tween(dead).to({
				y: dead.y + 10
			}, 300, Phaser.Easing.Linear.None, true, 0, 1000, true);
		}.bind(this));


	};

	this.step2 = function() {
		this.game.add.tween(dead).to({
			y: -100
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			dead.destroy();
		}.bind(this));

		this.game.add.tween(mine).to({
			x: LEFT_POSITION - half
		}, 500, Phaser.Easing.Linear.Out, true, 0, false);

		this.game.add.tween(fish).to({
			x: RIGHT_POSITION
		}, 500, Phaser.Easing.Linear.Out, true, 400, false);

		this.game.add.tween(heart).to({
			y: 50
		}, 500, Phaser.Easing.Linear.Out, true, 400, false).onComplete.add(function() {
			heart.waveTween = this.game.add.tween(heart).to({
				y: heart.y + 10
			}, 300, Phaser.Easing.Linear.None, true, 0, 1000, true);
		}.bind(this));

		this.game.add.tween(this.okButton).to({
			x: LEFT_POSITION - half
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			this.okButton.x = half * 3;

			this.game.add.tween(this.okButton).to({
				x: RIGHT_POSITION
			}, 500, Phaser.Easing.Linear.Out, true, 400, false).onComplete.add(function() {
				this.isPlaying = false;
				currentStep++;
			}.bind(this));

		}.bind(this));
	}
	this.step3 = function() {
		this.game.add.tween(heart).to({
			y: -100
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			heart.destroy();
		}.bind(this));

		this.game.add.tween(fish).to({
			x: RIGHT_POSITION + half
		}, 500, Phaser.Easing.Linear.Out, true, 0, false);

		this.game.add.tween(this.okButton).to({
			x: RIGHT_POSITION + half
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			this.okButton.y = fullheight + 100;
			this.okButton.x = half;
			this.okButton.loadTexture('playBtn');

			this.game.add.tween(this.okButton).to({
				y: fullheight / 2
			}, 800, Phaser.Easing.Bounce.Out, true, 1000, false).onComplete.add(function() {

				this.isPlaying = false;
				currentStep++;
			}.bind(this));

		}.bind(this));

		this.game.add.tween(line).to({
			y: this.game.height / 2
		}, 600, Phaser.Easing.Linear.Out, true, 0, false);

		this.game.add.tween(tapLeft).to({
			x: LEFT_POSITION + 25
		}, 400, Phaser.Easing.Linear.Out, true, 0, false);
		this.game.add.tween(leftSide).to({
			alpha: 0.3
		}, 100, Phaser.Easing.Linear.Out, true, 0, 5, true);

		this.game.add.tween(tapRight).to({
			x: RIGHT_POSITION - 25
		}, 400, Phaser.Easing.Linear.Out, true, 600, false);

		setTimeout(function() {
			this.game.add.tween(rightSide).to({
				alpha: 0.3
			}, 100, Phaser.Easing.Linear.Out, true, 0, 5, true);
		}.bind(this), 600);

	}

	this.step4 = function() {
		this.game.add.tween(leftSide).to({
			x: -half
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			leftSide.destroy();
		});
		this.game.add.tween(rightSide).to({
			x: 3 * half
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			rightSide.destroy();
		});
		this.game.add.tween(line).to({
			y: -fullheight
		}, 500, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			line.destroy();
		});

		this.game.add.tween(tapRight).to({
			x: RIGHT_POSITION + half
		}, 400, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			tapRight.destroy();
		});
		this.game.add.tween(tapLeft).to({
			x: LEFT_POSITION - half
		}, 400, Phaser.Easing.Linear.Out, true, 0, false).onComplete.add(function() {
			tapLeft.destroy();
		});
		this.game.add.tween(this.okButton).to({
			y: fullheight +200
		}, 700, Phaser.Easing.Bounce.Out, true, 1200, false).onComplete.add(function() {
			this.okButton.destroy();
			this.parent.startGame();
			storage.isIntroPlayed(true);
			this.parent.crew.tool.visible = true;
		}.bind(this));
	}

}



module.exports = Intro;