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
				// toolMoveSprites.push({
				// 	name: item.name + '-left',
				// 	type: 'tool',
				// 	x: item.move[0],
				// 	y: item.move[1],
				// 	frames: 4
				// });
				// toolMoveSprites.push({
				// 	name: item.name + '-right',
				// 	type: 'tool',
				// 	x: item.move[0],
				// 	y: item.move[1],
				// 	frames: 4
				// });
				toolMoveSprites.push({
					name: item.name + 'full',
					type: 'tool',
					x: item.move[0],
					y: item.move[1],
					frames: item.frames || 12
				});
			}
			item.frames = item.frames || 4;

		}, this);

		return items.concat(toolMoveSprites);
	},
	getItems: function() {
		return this.setDefaultValues(this.items);
	},
	filterCraftables: function(items) {
		return items.filter(function(item) {
			return item.craftable && item.craftable === true;
		});
	},
	getCraftables: function() {
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
		}, {
			name: 'lasso',
			title: "Lucky Lasso",
			id: 1,
			type: 'tool',
			x: 96,
			y: 120,
			price: 3000,
			move: [128, 120]
		},

		{
			name: 'sword',
			title: "King's Sword",
			id: 2,
			type: 'tool',
			x: 60,
			y: 124,
			price: 5600,
			move: [160, 227]
		}, {
			name: 'thorshammer2',
			title: "Thor's Hammer",
			id: 3,
			type: 'tool',
			x: 100,
			y: 136,
			cx: 120,
			cy: 144,
			move: [190, 190],
			craftable: true,
			tier: 3,
			parts: 3,
		}, {
			name: 'cake',
			title: "Berry Pie",
			id: 4,
			type: 'tool',
			x: 102,
			y: 124,
			price: 14000,
			move: [120, 200]
		}, {
			name: 'laserpistol',
			title: "Laser Gun",
			id: 5,
			frames: 16,
			type: 'tool',
			x: 96,
			y: 72,
			price: 21000,
			move: [132, 100]
		},

		// {name: 'harpoon', id: 1, type: 'tool'},

		// HEROS
		{
			name: 'origin',
			id: 99,
			type: 'hero',
			title: 'Al Fish',
			x: 144,
			y: 152
		},
		{
			name: 'default',
			id: 100,
			type: 'hero',
			title: 'Ron Kowalski',
			x: 144,
			y: 152
		}, {
			name: 'irish',
			id: 101,
			type: 'hero',
			title: 'Paddy',
			x: 144,
			y: 152,
			price: 6666
		}, {
			name: 'chinese',
			id: 102,
			type: 'hero',
			title: 'Yu Yu San',
			x: 144,
			y: 152,
			price: 9860
		}, {
			name: 'sailor',
			id: 103,
			type: 'hero',
			title: 'Pink Beard',
			x: 144,
			y: 152,
			price: 12000
		}, {
			name: 'bavarian',
			id: 104,
			type: 'hero',
			title: 'Helmut',
			x: 144,
			y: 152,
			price: 14000
		}, {
			name: 'diver',
			id: 105,
			type: 'hero',
			title: 'Johny Deep',
			x: 144,
			y: 152,
			price: 16000
		}, {
			name: 'swimmer',
			id: 106,
			type: 'hero',
			title: 'Thorpedo',
			x: 144,
			y: 152,
			price: 18000
		},
		{
			name: 'gangsta',
			id: 106,
			type: 'hero',
			title: 'El Gaucho',
			x: 144,
			y: 152,
			price: 20000
		},
		{
			name: 'style',
			id: 106,
			type: 'hero',
			title: 'Mr Dynamite',
			x: 144,
			y: 152,
			price: 22000
		},
		{
			name: 'princess',
			id: 106,
			type: 'hero',
			title: 'Princess',
			x: 144,
			y: 152,
			price: 24000
		},
		// MOUNTS
		{
			name: 'pontoon',
			title: 'Old pontoon',
			id: 1000,
			type: 'mount',
			x: 144,
			y: 184
		}, {
			name: 'woodboat',
			title: 'Simple Boat',
			id: 1001,
			type: 'mount',
			x: 144,
			y: 184,
			price: 2000
		}, {
			name: 'raft',
			title: 'Rafty Raft',
			id: 1002,
			type: 'mount',
			cx: 132,
			cy: 148,
			x: 144,
			y: 184,
			craftable: true,
			tier: 1,
			parts: 4,
		}, {
			name: 'raftt',
			title: 'Woody',
			id: 1003,
			type: 'mount',
			cx: 112,
			cy: 156,
			x: 144,
			y: 184,
			craftable: true,
			tier: 2,
			parts: 4,
		}, {
			name: 'crocodile',
			title: 'Mighty Croc',
			id: 1004,
			type: 'mount',
			x: 144,
			y: 184,
			price: 4000
		}, {
			name: 'motorboat',
			title: 'Shiny Boat',
			id: 1005,
			type: 'mount',
			x: 144,
			y: 184,
			price: 12000
		}, {
			name: 'rafttt',
			title: 'Sweet Ana',
			id: 1006,
			type: 'mount',
			cx: 144,
			cy: 180,
			x: 144,
			y: 184,
			craftable: true,
			tier: 2,
			parts: 5,
		},
	]
}

module.exports = itemsRegistry;