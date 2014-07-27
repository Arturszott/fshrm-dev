'use strict';

var _ = require('../utils');
var storage = require('../storage');
var itemsRegistry = require('../itemsRegistry');
var parts = require('../parts');

var Crew = require('./crew');
var Building = require('./buildingBoard');

var Garage = function(game, x, y) {
	this.signKey = 'garage-sign';
	this.boardKey = 'garage-board';
	this.itemBgKey = 'garage-item-bg';
	// this.noItemsKey = 'shop-all-sold';

	this.arrLeftKey = 'arr-left-garage';
	this.arrRightKey = 'arr-right-garage';

	Building.call(this, game, x, y);

	_.scale(this.sign, 0.85)

};

Garage.prototype = Object.create(Building.prototype);
Garage.prototype.constructor = Garage;

Garage.prototype.initialize = function() {
	// createFishAmount.call(this);
}


/////////////////// ITEM SLIDER ///////////////////////

Garage.prototype.showItem = function() {

	this.itemGroup && this.itemGroup.destroy();
	this.current = this.sliderItems[this.currentItemIndex];

	// this.currentItem = this.create(0, 0, this.current.name);
	// this.currentItem.data = this.current;
	// _.anchorC(this.currentItem);

	// var scale = this.itemBg.height / this.currentItem.height * 0.75;

	// scale = scale > 0.8 * 0.75 ? 0.8 : scale;
	// this.currentItem.scale.x = scale;
	// this.currentItem.scale.y = scale;

	this.partIcon = this.create(0, -20, 'part');
	_.anchorC(this.partIcon);

	this.game.add.tween(this.partIcon).to({
		y: this.partIcon.y + 10
	}, 400, Phaser.Easing.Linear.None, true, 0, 1, true);

	this.itemTitle = this.game.add.bitmapText(0, -this.itemBg.height / 2 - 12, 'brown', this.current.title.toUpperCase() || '', 22);
	this.itemTitle.position.x = this.itemTitle.position.x - this.itemTitle.textWidth / 2;
	this.itemTitle.position.y = this.itemTitle.position.y - this.itemTitle.textHeight / 2;

	var ownedParts = parts.findPartById(this.current.id);
	ownedParts = ownedParts ? ownedParts.owned : 0;

	this.partsText = this.game.add.bitmapText(0, 40, 'fisherman', ownedParts + '/' + this.current.parts + '', 22);
	this.partsText.position.x = this.partsText.position.x - this.partsText.textWidth / 2;
	this.partsText.position.y = this.partsText.position.y - this.partsText.textHeight / 2;

	if (ownedParts === this.current.parts) {
		this.craftButton = this.game.add.button(0, this.itemBg.height / 2 + 30, 'btn_craft', this.startCrafting.bind(this, this.current.name), this, 0, 0, 1, 0);
	} else {
		this.craftButton = this.game.add.button(0, this.itemBg.height / 2 + 30, 'btn_no_craft', this.noCraft, this, 0, 0, 0, 0);
	}

	_.anchorC(this.craftButton);
	_.scale(this.craftButton, 0.85);

	this.itemGroup = this.game.add.group();

	this.itemGroup.add(this.craftButton);
	this.itemGroup.add(this.partsText);
	this.itemGroup.add(this.itemTitle);
	this.itemGroup.add(this.partIcon);

	this.board.addChild(this.itemGroup);
}
Garage.prototype.noCraft = function() {

}
Garage.prototype.startCrafting = function(name) {
	console.log('crafting started')
	// storage.setEquipment(this.currentCategory, name);

	// function tweenOut(el, onComplete) {
	// 	var onComplete = onComplete || function() {};

	// 	this.game.add.tween(el).to({
	// 		x: el.x - this.game.width
	// 	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0).onComplete.add(onComplete.bind(this));
	// }

	// tweenOut.call(this, this.selectButton, function() {
	// 	this.selectButton.loadTexture('btn_using', 0);
	// 	this.game.add.tween(this.selectButton).to({
	// 		x: 0
	// 	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);
	// }.bind(this));

}
Garage.prototype.getAvailableItems = function(category) {
	var all, unlocked, availableItems;

	all = itemsRegistry.findByType(category);
	var craftables = itemsRegistry.filterCraftables(all);

	var parts = storage.getOwnedParts();
	unlocked = storage.getUnlockedItems();

	availableItems = craftables.filter(function(item) {
		return unlocked.indexOf(item.id) === -1;
	});
	return availableItems;
}

module.exports = Garage;