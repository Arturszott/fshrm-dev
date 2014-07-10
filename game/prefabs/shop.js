'use strict';

var utils = require('../utils');
var storage = require('../storage');
var itemsRegistry = require('../itemsRegistry');

function createFishAmount() {
	var amount = storage.getFishCount();


	this.moneyBoard = this.create(0, 45 - this.board.height / 2, 'money-board');
	this.moneyBoard.anchor.setTo(0.5, 0.5);

	this.totalText = this.game.add.bitmapText(0, 30 - this.board.height / 2, 'fisherman', (amount || 0) + '', 22);
	this.totalText.position.x = this.totalText.position.x - this.totalText.textWidth / 2;

	this.board.addChild(this.moneyBoard);
	this.board.addChild(this.totalText);
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
Shop.prototype.createItemSlider = function(category) {
	this.leftArrow = this.create(-this.board.width / 2 +5, 0, 'arr-left');
	this.leftArrow.anchor.set(0.5, 0.5);
	this.rightArrow = this.create(this.board.width / 2 -5, 0, 'arr-right');
	this.rightArrow.anchor.set(0.5, 0.5);

	this.board.addChild(this.leftArrow);
	this.board.addChild(this.rightArrow);

	this.itemBg = this.game.add.sprite(0, 0, 'shop-item-bg', 0);
	this.itemBg.anchor.setTo(0.5, 0.5);
	this.itemBg.scale.x = 0.8;
	this.itemBg.scale.y = 0.8;
	this.board.addChild(this.itemBg);

	this.buyButton = this.game.add.button(0, this.board.height/2, 'buy-btn', this.buyItem, this, 1, 0);
	this.buyButton.anchor.set(0.5, 1);
	this.board.addChild(this.buyButton);


	var scrollAnim = this.itemBg.animations.add('scrollin');
	this.itemBg.animations.play('scrollin', 24, true);
}
Shop.prototype.show = function(score) {
	if (this.isShown) return false;

	this.isShown = true;


	this.game.add.tween(this).to({
		y: 0
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);

	this.categoryLabels.forEach(function(label) {
		this.game.add.tween(label).to({
			y: label.y - 300
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0).onComplete.add(function() {
			this.categoryShow('clothes');
		}.bind(this));
	}, this);

};
Shop.prototype.buyItem = function() {
	console.log('buyin')
}
Shop.prototype.categoryShow = function(category) {
	var label = this[category + 'Label'];

	this.switchCategory(label);
	this.createItemSlider(category);
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