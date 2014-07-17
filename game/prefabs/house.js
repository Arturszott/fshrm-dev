'use strict';

var _ = require('../utils');
var storage = require('../storage');
var itemsRegistry = require('../itemsRegistry');

var House = function(game, x, y) {

	Phaser.Group.call(this, game);

	this.categoryLabels = [];

	this.board = this.create(this.game.width / 2, 180, 'long-board');
	_.anchorC(this.board);

	var houseSign = this.create(0, 10, 'home-sign');
	houseSign.anchor.setTo(0.0, 0);
	_.scale(houseSign, 0.7)

	var y = y + 300;

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

	this.y = -this.game.height;
	this.x = 0;
};

House.prototype = Object.create(Phaser.Group.prototype);
House.prototype.constructor = House;

// CATEGORY FUNCTION, IMPORTANT
House.prototype.switchCategory = function(label, name) {

	if (label.isPicked) return;

	this.categoryLabels.forEach(function(label) {
		label.isPicked = false;
	}, this);

	label.isPicked = true;

	_.rmLoopTween(this.game, this.labelWave);

	label.y = label.baseY;

	this.labelWave = this.game.add.tween(label).to({
		y: label.baseY + 13
	}, 250, Phaser.Easing.Linear.None, true, 0, 1000, true);
}



/////////////////// ITEM SLIDER ///////////////////////


var showItem = function() {

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

	this.itemTitle = this.game.add.bitmapText(0, -this.itemBg.height / 2 -16, 'brown', this.currentItem.data.title.toUpperCase() || '', 22);
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
var previousItem = function() {
	this.currentItemIndex--;
	this.rightArrow.visible = true;
	showItem.call(this);

	if (this.currentItemIndex - 1 < 0) {
		this.leftArrow.visible = false;
	}
}
var nextItem = function() {
	this.currentItemIndex++;
	this.leftArrow.visible = true;
	showItem.call(this);

	if (this.currentItemIndex + 1 >= this.itemsLength) {
		this.rightArrow.visible = false;
	}
}

House.prototype.createItemSlider = function(category) {

	this.leftArrow && this.leftArrow.destroy();
	this.rightArrow && this.rightArrow.destroy();
	this.itemBg && this.itemBg.destroy();

	this.itemGroup && this.itemGroup.destroy();


	this.leftArrow = this.game.add.button(-this.board.width / 2 + 5, 0, 'arr-left', previousItem, this, 0, 0, 1, 0);
	this.leftArrow.anchor.set(0.5);
	this.leftArrow.visible = false;

	this.rightArrow = this.game.add.button(this.board.width / 2 - 5, 0, 'arr-right', nextItem, this, 0, 0, 1, 0);
	this.rightArrow.anchor.set(0.5);
	this.rightArrow.visible = false;

	this.board.addChild(this.leftArrow);
	this.board.addChild(this.rightArrow);

	var items = this.getAvailableItems(category);

	this.sliderItems = items;
	this.itemsLength = items.length;

	console.log(items);

	if (this.itemsLength > 0) {
		this.itemBg = this.game.add.sprite(0, 0, 'shop-item-bg', 0);
		this.itemBg.animations.add('scrollin');
		this.itemBg.animations.play('scrollin', 24, true);

	} else {
		this.itemBg = this.game.add.sprite(0, 0, 'shop-all-sold', 0);
		this.itemBg.animations.add('wavin');
		this.itemBg.animations.play('wavin', 1, true);
	}

	_.anchorC(this.itemBg);
	_.scale(this.itemBg, 1);

	this.board.addChild(this.itemBg);

	if (this.itemsLength) {
		this.currentItemIndex = 0;
		showItem.call(this, items);

		if (this.itemsLength > 1) {
			this.rightArrow.visible = true;
		}

	}



	// var scrollAnim = this.itemBg.animations.add('scrollin');
	// this.itemBg.animations.play('scrollin', 24, true);
}
House.prototype.show = function(score) {
	if (this.isShown) return false;

	this.isShown = true;
	this.game.add.tween(this).to({
		y: 0
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);

	this.categoryLabels.forEach(function(label) {
		this.game.add.tween(label).to({
			y: label.y - 300
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0).onComplete.add(function() {
			this.categoryShow('hero');
		}.bind(this));
	}, this);

};
House.prototype.buyItem = function() {

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
House.prototype.getAvailableItems = function(category) {
	var all, unlocked, availableItems;

	all = itemsRegistry.findByType(category);
	unlocked = storage.getUnlockedItems();

	availableItems = all.filter(function(item) {
		return unlocked.indexOf(item.id) === -1;
	});

	return availableItems;
}
House.prototype.categoryShow = function(category) {
	this.currentItem && this.currentItem.destroy();

	if (this.currentCategory === category) return;

	this.currentCategory = category;
	this.switchCategory(this[category + 'Label']);

	this.createItemSlider(category);
}
House.prototype.hide = function() {
	var y = -this.game.height;
	var that = this;

	this.isShown = false;

	_.rmLoopTween(this.game, this.labelWave);
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
			// setTimeout(function() {
			// 	that.destroy();
			// }, 10);
		});
}

House.prototype.startClick = function() {
	this.game.state.start('play');
};
House.prototype.bayClick = function() {
	this.hide();
};


module.exports = House;