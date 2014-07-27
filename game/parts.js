'use strict';

var storage = require('./storage');
var itemsRegistry = require('./itemsRegistry');
var config = require('./config');

var partsManager = {

	getMissingParts: function() {
		var allCraftables = itemsRegistry.getCraftables();
		var unlocked = storage.getUnlockedItems();
		var ownedParts = storage.getOwnedParts();

		var craftableItems = allCraftables.filter(function(item) {
			return unlocked.indexOf(item.id) === -1;
		});

		if (!ownedParts) return craftableItems;

		return craftableItems.filter(function(item) {
			var itemParts = this.findPartById(item.id);
			// console.log(itemParts, item)
			return !itemParts || item.parts > itemParts.owned;
		}.bind(this));
	},

	findPartById: function(id) {
		var parts = storage.getOwnedParts().filter(function(itemParts) {
			return itemParts.id === id;
		});
		return parts ? parts[0] : null;
	},

	isInGame: function() {
		return Math.random() < config.itemChance;
	},
	randomizeItem: function() {
		if (!this.isInGame()) return false;

		var items = this.getMissingParts();
		if(!items.length) return false;

		var item = items[Math.floor(Math.random() * items.length)];
		var tierRange = config.tiers[item.tier];
		return {
			item: item,
			score: Math.floor(Math.random() * (tierRange[1] - tierRange[0]) + tierRange[0])
		};

	},

}

module.exports = partsManager;