'use strict';

var _ = require('../utils');
var storage = require('../storage');
var itemsRegistry = require('../itemsRegistry');

var Building = require('./buildingBoard');

function createFishAmount() {
	this.totalFish = storage.getFishCount();

	this.moneyBoard = this.create(-16, -this.board.height / 2 + 10, 'money-board');
	_.scale(this.moneyBoard, 0.9)
	// _.anchorC(this.moneyBoard);
	this.moneyBoard.anchor.set(0, 0.5);

	this.fishcoin = this.create(this.moneyBoard.width + this.moneyBoard.x + 12, this.moneyBoard.y, 'fishcoin');
	this.fishcoin.anchor.set(1, 0.5);

	this.totalText = this.game.add.bitmapText(-2, this.moneyBoard.y - 12, 'fisherman', (this.totalFish || 0) + '', 18);
	// this.totalText.position.x = this.totalText.position.x - this.totalText.textWidth / 2;

	this.board.addChild(this.moneyBoard);
	this.board.addChild(this.fishcoin);
	this.board.addChild(this.totalText);
}

function createLabels(x, y) {
	this.categoryLabels = [];

	this.heroLabel = this.game.add.button(x + 30, y - 50, 'category-label-hero', this.categoryShow.bind(this, 'hero'), this);
	_.anchorC(this.heroLabel);
	this.heroLabel.baseY = y - 50 - 300;

	this.mountLabel = this.game.add.button(x - 20, y + 40, 'category-label-mount', this.categoryShow.bind(this, 'mount'), this);
	_.anchorC(this.mountLabel);
	this.mountLabel.baseY = y + 40 - 300;

	this.toolLabel = this.game.add.button(x - 40, y - 40, 'category-label-tool', this.categoryShow.bind(this, 'tool'), this);
	_.anchorC(this.toolLabel);
	this.toolLabel.baseY = y - 40 - 300;

	this.postcardLabel = this.game.add.button(x + 70, y - 0, 'category-label-postcard', this.categoryShow.bind(this, 'postcard'), this);
	_.anchorC(this.postcardLabel);
	this.postcardLabel.baseY = y - 0 - 300;

	this.categoryLabels.push(this.heroLabel);
	this.categoryLabels.push(this.mountLabel);
	this.categoryLabels.push(this.toolLabel);
	this.categoryLabels.push(this.postcardLabel);

	this.categoryLabels.forEach(function(label) {
		_.scale(label, 0.75);
	}, this);
}
var Shop = function(game, x, y) {
	Building.call(this, game, x, y);

	this.signKey = 'shop-sign';
	this.boardKey = 'long-board';
	this.itemBgKey = 'shop-item-bg';
	this.noItemsKey = 'shop-all-sold';
};

Shop.prototype = Object.create(Building.prototype);
Shop.prototype.constructor = Shop;

Shop.prototype.initialize = function() {
	createFishAmount.call(this);
}


/////////////////// ITEM SLIDER ///////////////////////

Shop.prototype.showItem = function() {

	this.itemGroup && this.itemGroup.destroy();

	this.currentItem = this.create(0, 0, this.sliderItems[this.currentItemIndex].name);
	this.currentItem.data = this.sliderItems[this.currentItemIndex];
	_.anchorC(this.currentItem);

	var scale = this.itemBg.height / this.currentItem.height * 0.75;

	// scale = scale > 0.8 * 0.75 ? 0.8 : scale;
	this.currentItem.scale.x = scale;
	this.currentItem.scale.y = scale;


	this.priceLabel = this.create(-40, this.board.height / 2 - 20, 'money-board');
	_.anchorC(this.priceLabel);
	_.scale(this.priceLabel, 1.1);

	this.fishcoinPrice = this.create(this.priceLabel.width + this.priceLabel.x - 88, this.priceLabel.y - 10, 'fishcoin');
	this.fishcoinPrice.anchor.set(0.5, 0);

	this.priceText = this.game.add.bitmapText(this.priceLabel.x, this.priceLabel.y, 'fisherman', (this.currentItem.data.price || 69) + '', 22);
	this.priceText.position.x = this.priceText.position.x - this.priceLabel.width / 2 + 15;
	this.priceText.position.y = this.priceText.position.y - this.priceText.textHeight / 2 + 2;

	this.itemTitle = this.game.add.bitmapText(0, -this.itemBg.height / 2 - 16, 'brown', this.currentItem.data.title.toUpperCase() || '', 22);
	this.itemTitle.position.x = this.itemTitle.position.x - this.itemTitle.textWidth / 2;
	this.itemTitle.position.y = this.itemTitle.position.y - this.itemTitle.textHeight / 2;

	this.buyButton = this.game.add.button(this.board.width / 2 + this.priceLabel.x + 15, this.priceLabel.y, 'buy-btn', this.buyItem, this, 0, 0, 1, 0);
	_.anchorC(this.buyButton);
	_.scale(this.buyButton, 0.85);

	if (this.currentItem.data.price > this.totalFish) {
		this.buyButton.loadTexture('buy-btn-nomoney', 0);
	}

	this.itemGroup = this.game.add.group();

	this.itemGroup.add(this.priceLabel);
	this.itemGroup.add(this.buyButton);
	this.itemGroup.add(this.fishcoinPrice);
	this.itemGroup.add(this.currentItem);
	this.itemGroup.add(this.priceText);
	this.itemGroup.add(this.itemTitle);

	this.board.addChild(this.itemGroup);
}
Shop.prototype.buyItem = function() {

	function tweenOut(el, onComplete) {
		var onComplete = onComplete || function() {};

		this.game.add.tween(el).to({
			x: el.x - this.game.width
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0).onComplete.add(onComplete.bind(this));
	}

	if (this.totalFish > this.currentItem.data.price) {
		// handle buying animations
		tweenOut.call(this, this.buyButton, function() {
			this.buyButton.loadTexture('buy-btn-bought', 0);
			this.game.add.tween(this.buyButton).to({
				x: 0
			}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);
		}.bind(this));


		// handle fish amount change
		tweenOut.call(this, this.priceText, function() {
			storage.removeFish(this.currentItem.data.price);
			storage.unlockItem(this.currentItem.data.id);

			this.totalText.setText((this.totalFish - this.currentItem.data.price) + '');
		});
		tweenOut.call(this, this.priceLabel);
		tweenOut.call(this, this.fishcoinPrice);
	}
}
Shop.prototype.getAvailableItems = function(category) {
	var all, unlocked, availableItems;

	all = itemsRegistry.findByType(category);
	unlocked = storage.getUnlockedItems();

	availableItems = all.filter(function(item) {
		return unlocked.indexOf(item.id) === -1;
	});

	return availableItems;
}

module.exports = Shop;