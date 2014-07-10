'use strict';

var storageHandler = {
	addFish: function(amount){
		var fishCount;

		fishCount = Number(localStorage.getItem('fishCount'));
		fishCount += amount;
		localStorage.setItem('fishCount', fishCount);
	},
	removeFish: function(amount){
		var fishCount;

		fishCount = Number(localStorage.getItem('fishCount'));
		fishCount -= amount;

		localStorage.setItem('fishCount', fishCount);
	},
	getFishCount: function(){
		return  Number(localStorage.getItem('fishCount'));
	},
	getEquipment: function(){
		var eqp = JSON.parse(localStorage.getItem('equipment'));
		if(!eqp){
			return this.setDefaultEquipment();
			this.getEquipment();
			
		}
		return eqp;
	},
	setDefaultEquipment: function(){
		console.log('defaultin');

		var eqp = {
			tool: 'pole',
			mount: 'pontoon',
			hero: 'default'
		}

		localStorage.setItem('equipment', JSON.stringify(eqp));

		return eqp;
	},
	getUnlockedItems: function(){
		return localStorage.getItem('unlockedItems') || [0, 100, 1000];
	},
	unlockItem: function(id){
		var items = this.getUnlockedItems();

		if(items.indexOf(id) === -1){
			items.push(id);
			localStorage.setItem('unlockedItems', items);
		}
	}


}

module.exports = storageHandler;