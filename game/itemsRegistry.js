'use strict';

var itemsRegistry = {
	findByID: function(id) {
		return this.items.filter(function(item) {
			return item.id === id;
		});
	},
	findByName: function(name) {
		return this.items.filter(function(item) {
			return item.name === name;
		});
	},
	findByType: function(type) {
		return this.items.filter(function(item) {
			return item.type === type;
		});
	},
	setDefaultValues: function(items) {
		var toolMoveSprites = [];

		items.forEach(function(item) {
			if (item.type === 'tool') {
				toolMoveSprites.push({
					name: item.name + '-left',
					type: 'tool',
					x: item.move[0],
					y: item.move[1],
					frames: 4
				});
				toolMoveSprites.push({
					name: item.name + '-right',
					type: 'tool',
					x: item.move[0],
					y: item.move[1],
					frames: 4
				});
			}
			item.frames = item.frames || 4;

		}, this);

		return items.concat(toolMoveSprites);
	},
	getItems: function() {
		return this.setDefaultValues(this.items);
	},
	filterCraftables: function(items){
		return items.filter(function(item){
			return item.craftable && item.craftable === true;
		});
	},
	getCraftables: function(){
		return this.filterCraftables(this.items);
	},
	getRawItems: function() {
		return this.items;
	},
	items: [
		// TOOLS
		{
			name: 'pole',
			title: 'Old net',
			id: 0,
			type: 'tool',
			x: 76,
			y: 128,
			move: [128, 160]
		},
		{
			name: 'spear',
			title: 'sharp spear',
			id: 1,
			type: 'tool',
			x: 76,
			y: 128,
			price: 100,
			move: [128, 160]
		},
		{
			name: 'thorshammer2',
			title: "Thor's Hammer",
			id: 2,
			type: 'tool',
			x: 100,
			y: 136,
			craftable: true,
			tier: 4,
			parts: 3,
			move: [190, 190]
		},
		{
			name: 'sword2',
			title: "King's Sword",
			id: 3,
			type: 'tool',
			x: 60,
			y: 124,
			price: 7000,
			move: [155, 227]
		},
		// {name: 'harpoon', id: 1, type: 'tool'},

		// HEROS
		{
			name: 'default',
			id: 100,
			type: 'hero',
			title: 'True Jack',
			x: 144,
			y: 152
		},
		{
			name: 'chinese',
			id: 101,
			type: 'hero',
			title: 'Yu Yu San',
			x: 144,
			y: 152,
			price: 8000
		},
		{
			name: 'irish',
			id: 102,
			type: 'hero',
			title: 'Paddy',
			x: 144,
			y: 152,
			price: 6666
		},
		{
			name: 'sailor',
			id: 103,
			type: 'hero',
			title: 'Pink Beard',
			x: 144,
			y: 152,
			price: 13000
		},
		// {name: 'blackbeard', id: 101, type: 'hero'},

		// MOUNTS
		{
			name: 'pontoon',
			title: 'Old pontoon',
			id: 1000,
			type: 'mount',
			x: 144,
			y: 184
		},
		{
			name: 'blackboat',
			title: 'black boat',
			id: 1001,
			type: 'mount',
			x: 144,
			y: 184,
			price: 100
		},
		{
			name: 'raft',
			title: 'Raw Raft',
			id: 1002,
			type: 'mount',
			x: 144,
			y: 184,
			craftable: true,
			tier: 1,
			parts: 2,
		},
		{
			name: 'raftt',
			title: 'Rafty Raft',
			id: 1003,
			type: 'mount',
			x: 144,
			y: 184,
			craftable: true,
			tier: 2,
			parts: 3,
		},
		{
			name: 'crocodile',
			title: 'Mighty Croc',
			id: 1004,
			type: 'mount',
			x: 144,
			y: 184,
			price: 4000
		},

	]
}

module.exports = itemsRegistry;