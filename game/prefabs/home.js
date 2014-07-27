'use strict';

var _ = require('../utils');
var storage = require('../storage');
var itemsRegistry = require('../itemsRegistry');


var Crew = require('./crew');
var Building = require('./buildingBoard');

var Home = function(game, x, y) {
	this.signKey = 'home-sign';
	this.boardKey = 'home-board';
	this.itemBgKey = 'home-item-bg';
	// this.noItemsKey = 'shop-all-sold';

	this.arrLeftKey = 'arr-left-home';
	this.arrRightKey = 'arr-right-home';

	Building.call(this, game, x, y);

	_.scale(this.sign, 0.85)

};

Home.prototype = Object.create(Building.prototype);
Home.prototype.constructor = Home;

Home.prototype.initialize = function() {
	// createFishAmount.call(this);
}


/////////////////// ITEM SLIDER ///////////////////////

Home.prototype.showItem = function() {

	this.itemGroup && this.itemGroup.destroy();

	this.crew = new Crew(this.game, 0, -60);
	this.crew.wave.visible = false;
	this.crew.rest();

	this.crew[this.currentCategory].waveTween
	this.crew[this.currentCategory].animations.stop();
	this.crew[this.currentCategory].loadTexture(this.sliderItems[this.currentItemIndex].name);

	this.itemTitle = this.game.add.bitmapText(0, -this.itemBg.height / 2 - 12, 'brown', this.sliderItems[this.currentItemIndex].title.toUpperCase() || '', 22);
	this.itemTitle.position.x = this.itemTitle.position.x - this.itemTitle.textWidth / 2;
	this.itemTitle.position.y = this.itemTitle.position.y - this.itemTitle.textHeight / 2;
	// this.currentItem = this.create(0, 0, this.sliderItems[this.currentItemIndex].name);
	// this.currentItem.data = this.sliderItems[this.currentItemIndex];
	// _.anchorC(this.currentItem);

	// var scale = this.itemBg.height / this.currentItem.height * 0.75;

	// scale = scale > 0.8 * 0.75 ? 0.8 : scale;
	// this.currentItem.scale.x = scale;
	// this.currentItem.scale.y = scale;


	if(storage.getEquipment()[this.currentCategory] === this.sliderItems[this.currentItemIndex].name){
		this.selectButton = this.game.add.button(0, this.itemBg.height/2, 'btn_using', this.itemUsed, this, 0, 0, 0, 0);
	} else {
		this.selectButton = this.game.add.button(0, this.itemBg.height/2, 'btn_select', this.useItem.bind(this, this.sliderItems[this.currentItemIndex].name), this, 0, 0, 1, 0);
	}

	_.anchorC(this.selectButton);
	_.scale(this.selectButton, 0.85);

	this.itemGroup = this.game.add.group();

	this.itemGroup.add(this.selectButton);
	// this.itemGroup.add(this.currentItem);
	this.itemGroup.add(this.itemTitle);
	this.itemGroup.add(this.crew);

	this.board.addChild(this.itemGroup);
}
Home.prototype.itemUsed = function() {

}
Home.prototype.useItem = function(name) {
	storage.setEquipment(this.currentCategory, name);

	function tweenOut(el, onComplete) {
		var onComplete = onComplete || function() {};

		this.game.add.tween(el).to({
			x: el.x - this.game.width
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0).onComplete.add(onComplete.bind(this));
	}

	tweenOut.call(this, this.selectButton, function() {
		this.selectButton.loadTexture('btn_using', 0);
		this.game.add.tween(this.selectButton).to({
			x: 0
		}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);
	}.bind(this));

}
Home.prototype.getAvailableItems = function(category) {
	var all, unlocked, availableItems;

	all = itemsRegistry.findByType(category);
	unlocked = storage.getUnlockedItems();

	availableItems = all.filter(function(item) {
		return unlocked.indexOf(item.id) !== -1;
	});

	return availableItems;
}

module.exports = Home;