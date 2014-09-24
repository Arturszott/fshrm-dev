'use strict';

var itemsRegistry = require('./itemsRegistry');

var storageHandler = {

	// fish // ---------------------------------------------------------
	addFish: function(amount) {
		var fishCount;

		fishCount = Number(localStorage.getItem('fishCount'));
		fishCount += amount;
		this.addStat('total-fish', amount);
		localStorage.setItem('fishCount', fishCount);
	},
	removeFish: function(amount) {
		var fishCount;

		fishCount = Number(localStorage.getItem('fishCount'));
		fishCount -= amount;

		localStorage.setItem('fishCount', fishCount);
	},
	getFishCount: function() {
		return Number(localStorage.getItem('fishCount'));
	},
	mute: function(isMuted) {
		if (isMuted) {
			localStorage.setItem('isMuted', true);
		} else {
			localStorage.setItem('isMuted', false);
		}
	},
	getMuted: function() {
		return JSON.parse(localStorage.getItem('isMuted'));
	},
	// statistics // ---------------------------------------------------------
	addStat: function(type, amount){
		var stats = JSON.parse(localStorage.getItem('stats')) || {};
		stats[type] = stats[type] ? stats[type]: 0;
		stats[type] += amount || 1;
		localStorage.setItem('stats', JSON.stringify(stats));
	},
	getStat: function(type){
		var stats = localStorage.getItem('stats');
		if(!stats){
			localStorage.setItem('stats', JSON.stringify({}));
		}
		return JSON.parse(localStorage.getItem('stats'))[type];
	},
	// parts // -------------------------------------------------------------
	addPart: function(id) {
		var parts = this.getOwnedParts() || [];

		var itemParts = parts.filter(function(item) {
			return item.id === id;
		})[0];

		if (itemParts) {
			parts[parts.indexOf(itemParts)].owned++;

			localStorage.setItem('parts', JSON.stringify(parts));

		} else {
			var totalParts = itemsRegistry.findByID(id).parts;

			parts.push({
				id: id,
				owned: 1,
				total: totalParts
			});

			localStorage.setItem('parts', JSON.stringify(parts));
		}
	},
	getOwnedParts: function() {
		var parts = JSON.parse(localStorage.getItem('parts')) || [];
		return parts;
	},

	// eqp // ---------------------------------------------------------
	getEquipment: function() {
		var eqp = JSON.parse(localStorage.getItem('equipment'));
		if (!eqp) {
			return this.setDefaultEquipment();
			this.getEquipment();
		}
		return eqp;
	},
	setEquipment: function(category, item) {
		var eqp = this.getEquipment();

		eqp[category] = item;

		localStorage.setItem('equipment', JSON.stringify(eqp));
	},
	setDefaultEquipment: function() {
		var eqp = {
			tool: 'pole',
			mount: 'pontoon',
			hero: 'origin'
		}

		localStorage.setItem('equipment', JSON.stringify(eqp));

		return eqp;
	},
	getUnlockedItems: function() {
		return JSON.parse(localStorage.getItem('unlockedItems')) || [0, 99, 100, 1000];
	},
	unlockItem: function(id) {
		var items = this.getUnlockedItems();
		if (items.indexOf(id) === -1) {
			items.push(id);
			localStorage.setItem('unlockedItems', JSON.stringify(items));
		} else {
			return false;
		}
	},
	checkOwned: function(id) {
		var items = this.getUnlockedItems();
		if (items.indexOf(id) === -1) {
			return false;
		} else {
			return true;
		}
	},
	// every time the function is called, last time played is updated to the current time
	getLastTimePlayed: function(unit) {
		var last = localStorage.getItem('lastTimePlayed') || false;
		var now = Date.now();

		localStorage.setItem('lastTimePlayed', now);

		if (!last) return false;

		last = now - last;

		if (!unit) return last;
		if (unit === 'seconds') return last / 1000;
		if (unit === 'minutes') return last / 1000 / 60;
		if (unit === 'hours') return last / 1000 / 60 / 60;
		if (unit === 'days') return last / 1000 / 60 / 60 / 24;
	},
	isIntroPlayed: function(set) {
		if (set) {
			return localStorage.setItem('introPlayed', true);
		} else {
			return localStorage.getItem('introPlayed') || false;
		}
	}


}

module.exports = storageHandler;