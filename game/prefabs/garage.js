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

	var sliceItem = function(item) {
		var scale = this.itemBg.height / item.y * 0.75;

		scale = scale > 0.8 * 0.75 ? 0.8 : scale;

		var slicesGroup = this.game.add.group();
		var slice;

		return slicesGroup;
	}

	this.currentItem = sliceItem.call(this, this.current);
	this.currentItem.data = this.current;

	this.itemTitle = this.game.add.bitmapText(0, -this.itemBg.height / 2 - 20, 'brown', this.current.title.toUpperCase() || '', 24);
	this.itemTitle.position.x = this.itemTitle.position.x - this.itemTitle.textWidth / 2;
	this.itemTitle.position.y = this.itemTitle.position.y - this.itemTitle.textHeight / 2;

	var ownedParts = parts.findPartById(this.current.id);
	ownedParts = ownedParts ? ownedParts.owned : 0;

	this.partsText = this.game.add.bitmapText(0, this.itemBg.height / 2 - 10, 'fisherman', ownedParts + '/' + this.current.parts + '', 22);
	this.partsText.position.x = this.partsText.position.x - this.partsText.textWidth / 2;
	// this.partsText.position.y = this.partsText.position.y - this.partsText.textHeight / 2;

	if (ownedParts === this.current.parts) {
		this.craftButton = this.game.add.button(0, this.itemBg.height / 2 + 60, 'btn_craft', this.startCrafting.bind(this, this.current), this, 0, 0, 1, 0);
	} else {
		this.craftButton = this.game.add.button(0, this.itemBg.height / 2 + 60, 'btn_no_craft', this.noCraft, this, 0, 0, 0, 0);
	}

	_.anchorC(this.craftButton);
	_.scale(this.craftButton, 0.85);

	this.itemGroup = this.game.add.group();

	this.itemGroup.add(this.currentItem);
	this.itemGroup.add(this.craftButton);
	this.itemGroup.add(this.partsText);
	this.itemGroup.add(this.itemTitle);

	this.board.addChild(this.itemGroup);
}
Garage.prototype.noCraft = function() {

}
Garage.prototype.startCrafting = function(name) {
	if(this.currentItem.isCrafted) return;

	this.game.add.tween(this.partsText).to({
		y: -this.game.height
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);
	this.game.add.tween(this.craftButton).to({
		y: this.game.height
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0);


	this.tapRight = this.game.add.sprite(-this.game.width - this.itemBg.width / 2 - 10, 0, 'tap-right');
	this.tapLeft = this.game.add.sprite(this.game.width + this.itemBg.width / 2 + 10, 0, 'tap-left');

	_.anchorC(this.tapRight);
	_.anchorC(this.tapLeft);

	this.itemGroup.add(this.tapRight);
	this.itemGroup.add(this.tapLeft);

	var finalLeft = this.tapLeft.x - this.game.width;
	var finalRight = this.tapRight.x + this.game.width

	this.game.add.tween(this.tapRight).to({
		x: finalRight
	}, 200, Phaser.Easing.Sinusoidal.Out, true, 0).to({
		x: finalRight - 10
	}, 200, Phaser.Easing.Sinusoidal.Out, true, 0, 3, true);

	this.game.add.tween(this.tapLeft).to({
		x: finalLeft
	}, 200, Phaser.Easing.Sinusoidal.Out, true, 0).to({
		x: finalLeft + 10
	}, 200, Phaser.Easing.Sinusoidal.Out, true, 0, 3, true);;

	this.tapped = 0;

	this.itemBg.inputEnabled = true;
	this.itemBg.events.onInputDown.add(function() {
		this.cloud && this.cloud.destroy();
		this.cloud = this.game.add.sprite(0, 0, 'crafting');
		_.anchorC(this.cloud);
		_.scale(this.cloud, 2);
		this.cloud.smokin = this.cloud.animations.add('smokin');
		this.cloud.smokin.killOnComplete = true;
		this.cloud.animations.play('smokin', 14, 2);
		this.itemGroup.add(this.cloud);
		this.currentItem.children[this.tapped].alpha = 1;

		this.tapped++;

		if (this.tapped === this.currentItem.children.length) {
			console.log('end of tappin')

			var key = this.currentItem.data.name;
			this.currentItem.destroy();
			this.currentItem = this.create(0, 0, key);
			_.anchorC(this.currentItem);
			this.itemGroup.add(this.currentItem);
			this.currentItem.animations.add('wind');
			this.currentItem.animations.play('wind', 8, true);

			this.itemBg.inputEnabled = false;

			this.game.add.tween(this.tapRight).to({
				x: finalRight - this.game.width
			}, 200, Phaser.Easing.Sinusoidal.Out, true, 0);

			this.game.add.tween(this.tapLeft).to({
				x: finalLeft + this.game.width
			}, 200, Phaser.Easing.Sinusoidal.Out, true, 0);

			this.craftButton.loadTexture('buy-btn-bought');
			this.game.add.tween(this.craftButton).to({
				y: this.itemBg.height / 2 + 60
			}, 200, Phaser.Easing.Sinusoidal.Out, true, 0);

			this.currentItem.isCrafted = true;
			storage.unlockItem(this.current.id);

		} else {
			this.game.add.tween(this.tapRight).to({
				x: finalRight - 10
			}, 200, Phaser.Easing.Sinusoidal.Out, true, 0, 3, true);

			this.game.add.tween(this.tapLeft).to({
				x: finalLeft + 10
			}, 200, Phaser.Easing.Sinusoidal.Out, true, 0, 3, true);
		}
	}, this);
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