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

	this.heroLabel = this.game.add.button(x + 30, y - 50, 'category-label-hero', this.categoryShow.bind(this, 'hero'), this);
	this.heroLabel.anchor.setTo(0.5, 0.5);
	this.heroLabel.baseY = y - 50 - 300;

	this.mountLabel = this.game.add.button(x - 20, y + 50, 'category-label-mount', this.categoryShow.bind(this, 'mount'), this);
	this.mountLabel.anchor.setTo(0.5, 0.5);
	this.mountLabel.baseY = y + 50 - 300;

	this.toolLabel = this.game.add.button(x - 40, y - 40, 'category-label-tool', this.categoryShow.bind(this, 'tool'), this);
	this.toolLabel.anchor.setTo(0.5, 0.5);
	this.toolLabel.baseY = y - 40 - 300;

	this.postcardLabel = this.game.add.button(x + 70, y - 0, 'category-label-postcard', this.categoryShow.bind(this, 'postcard'), this);
	this.postcardLabel.anchor.setTo(0.5, 0.5);
	this.postcardLabel.baseY = y - 0 - 300;

	this.categoryLabels.push(this.heroLabel);
	this.categoryLabels.push(this.mountLabel);
	this.categoryLabels.push(this.toolLabel);
	this.categoryLabels.push(this.postcardLabel);

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
	// TODO REMOVE PREVIOUS SLIDER
	this.leftArrow && this.leftArrow.destroy();
	this.rightArrow && this.rightArrow.destroy();
	this.itemBg && this.itemBg.destroy();
	this.currentItem && this.currentItem.destroy();

	this.leftArrow = this.create(-this.board.width / 2 + 5, 0, 'arr-left');
	this.leftArrow.anchor.set(0.5, 0.5);
	this.leftArrow.visible = false;

	this.rightArrow = this.create(this.board.width / 2 - 5, 0, 'arr-right');
	this.rightArrow.anchor.set(0.5, 0.5);
	this.rightArrow.visible = false;

	this.board.addChild(this.leftArrow);
	this.board.addChild(this.rightArrow);

	var items = this.getAvailableItems(category);

	if(items.length > 0) {
		this.itemBg = this.game.add.sprite(0, 0, 'shop-item-bg', 0);
		this.itemBg.animations.add('scrollin');
		this.itemBg.animations.play('scrollin', 24, true);
		console.log();
		
	} else {
		this.itemBg = this.game.add.sprite(0, 0, 'shop-all-sold', 0);
		this.itemBg.animations.add('wavin');
		this.itemBg.animations.play('wavin', 1, true);
	}

	this.itemBg.anchor.setTo(0.5, 0.5);
	this.itemBg.scale.x = 0.8;
	this.itemBg.scale.y = 0.8;
	this.board.addChild(this.itemBg);

	if(items.length){
		this.currentItem = this.create(0, 0, items[0].name);
		this.currentItem.anchor.setTo(0.5, 0.5);
		var scale = this.itemBg.height/this.currentItem.height;
		scale = scale > 0.8 ? 0.8 : scale;
		this.currentItem.scale.x = scale;
		this.currentItem.scale.y = scale;

		this.board.addChild(this.currentItem);
	}
	


	this.buyButton = this.game.add.button(0, this.board.height / 2, 'buy-btn', this.buyItem, this, 1, 0);
	this.buyButton.anchor.set(0.5, 1);
	this.board.addChild(this.buyButton);


	// var scrollAnim = this.itemBg.animations.add('scrollin');
	// this.itemBg.animations.play('scrollin', 24, true);
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
			this.categoryShow('hero');
		}.bind(this));
	}, this);

};
Shop.prototype.buyItem = function() {
	console.log('buyin')
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
Shop.prototype.categoryShow = function(category) {

	if (this.currentCategory === category) return;

	this.currentCategory = category;


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