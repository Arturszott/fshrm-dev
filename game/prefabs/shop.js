'use strict';

var utils = require('../utils');
var storage = require('../storage');

function createFishAmount() {
	var amount = storage.getFishCount();

	this.totalText = this.game.add.bitmapText(0, 40 - this.board.height / 2, 'fisherman', (amount || 0) + '', 18);
	this.totalText.position.x = this.totalText.position.x - this.totalText.textWidth / 2;
}

var Shop = function(game, x, y) {

	Phaser.Group.call(this, game);

	this.categoryLabels = [];

	this.board = this.create(this.game.width / 2, 200, 'long-board');
	this.board.anchor.setTo(0.5, 0.5);

	var shopSign = this.create(this.game.width / 2, 10, 'shop-sign');
	shopSign.anchor.setTo(0.5, 0);

	var y = y + 300;

	this.clothesLabel = this.game.add.button(x + 30, y - 50, 'category-label-clothes', this.categoryShow.bind(this, 'clothes'), this);
	this.clothesLabel.anchor.setTo(0.5, 0.5);
	this.clothesLabel.baseY = y - 50 - 300;

	this.mountsLabel = this.game.add.button(x - 20, y + 50, 'category-label-mounts', this.categoryShow.bind(this, 'mounts'), this);
	this.mountsLabel.anchor.setTo(0.5, 0.5);
	this.mountsLabel.baseY = y + 50 - 300;

	this.toolsLabel = this.game.add.button(x - 40, y - 40, 'category-label-tools', this.categoryShow.bind(this, 'tools'), this);
	this.toolsLabel.anchor.setTo(0.5, 0.5);
	this.toolsLabel.baseY = y - 40 - 300;

	this.postcardsLabel = this.game.add.button(x + 70, y - 0, 'category-label-postcards', this.categoryShow.bind(this, 'postcards'), this);
	this.postcardsLabel.anchor.setTo(0.5, 0.5);
	this.postcardsLabel.baseY = y - 0 - 300;

	this.categoryLabels.push(this.clothesLabel);
	this.categoryLabels.push(this.mountsLabel);
	this.categoryLabels.push(this.toolsLabel);
	this.categoryLabels.push(this.postcardsLabel);

	this.categoryLabels.forEach(function(label) {
		label.scale.x = 0.75;
		label.scale.y = 0.75;
	}, this);

	createFishAmount.call(this);

	this.y = -this.game.height;
	this.x = 0;
};

Shop.prototype = Object.create(Phaser.Group.prototype);
Shop.prototype.constructor = Shop;

// CATEGORY FUNCTION, IMPORTANT
Shop.prototype.switchCategory = function(label, name) {

	if (label.isPicked) return;

	this.categoryLabels.forEach(function(label) {
		label.isPicked = false;
	}, this);

	label.isPicked = true;

	utils.rmLoopTween(this.game, this.labelWave);

	label.y = label.baseY;

	this.labelWave = this.game.add.tween(label).to({
		y: label.baseY + 13
	}, 250, Phaser.Easing.Linear.None, true, 0, 1000, true);
}

Shop.prototype.show = function(score) {
	if (this.isShown) return false;

	this.isShown = true;
	this.board.addChild(this.totalText);

	this.game.add.tween(this).to({
		y: 0
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);

	this.categoryLabels.forEach(function(label) {
		this.game.add.tween(label).to({
			y: label.y - 300
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0).onComplete.add(function() {
			this.switchCategory(this.clothesLabel);
		}.bind(this));
	}, this);

};
Shop.prototype.categoryShow = function(category) {
	var label = this[category + 'Label'];

	this.switchCategory(label)
}
Shop.prototype.hide = function() {
	var y = -this.game.height;
	var that = this;

	this.isShown = false;

	utils.rmLoopTween(this.game, this.labelWave);
	this.categoryLabels.forEach(function(label) {
		this.game.add.tween(label).to({
			y: label.y + 300
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);
	}, this);

	this.game.add.tween(this)
		.to({
			y: y
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0)
		.onComplete.add(function() {
			setTimeout(function() {
				that.destroy();
			}, 10);
		});


}

Shop.prototype.startClick = function() {
	this.game.state.start('play');
};
Shop.prototype.bayClick = function() {
	this.hide();
	// this.game.bay.travel();
};


module.exports = Shop;