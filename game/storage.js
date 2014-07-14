'use strict';

var storageHandler = {


	addFish: function(amount) {
		var fishCount;

		fishCount = Number(localStorage.getItem('fishCount'));
		fishCount += amount;
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


	getEquipment: function() {
		var eqp = JSON.parse(localStorage.getItem('equipment'));
		if (!eqp) {
			return this.setDefaultEquipment();
			this.getEquipment();

		}
		return eqp;
	},
	setDefaultEquipment: function() {
		console.log('defaultin');

		var eqp = {
			tool: 'pole',
			mount: 'pontoon',
			hero: 'default'
		}

		localStorage.setItem('equipment', JSON.stringify(eqp));

		return eqp;
	},
	getUnlockedItems: function() {
		return localStorage.getItem('unlockedItems') || [0, 100, 1000];
	},
	unlockItem: function(id) {
		var items = this.getUnlockedItems();

		if (items.indexOf(id) === -1) {
			items.push(id);
			localStorage.setItem('unlockedItems', items);
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