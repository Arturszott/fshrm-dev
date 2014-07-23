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
	getCraftables: function(){
		return this.items.filter(function(item){
			return item.hasOwnProperty('craftable');
		})
	},
	getRawItems: function() {
		return this.items;
	},
	items: [
		// TOOLS
		{
			name: 'pole',
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
			name: 'spear',
			title: 'super spear',
			id: 2,
			type: 'tool',
			x: 76,
			y: 128,
			craftable: true,
			parts: 2,
			tier: 1,
			move: [128, 160]
		},
		{
			name: 'spear',
			title: 'ultra spear',
			id: 3,
			type: 'tool',
			x: 76,
			y: 128,
			craftable: true,
			parts: 5,
			tier: 1,
			move: [128, 160]
		},
		// {name: 'harpoon', id: 1, type: 'tool'},

		// HEROS
		{
			name: 'default',
			id: 100,
			type: 'hero',
			x: 144,
			y: 152
		},
		// {name: 'blackbeard', id: 101, type: 'hero'},

		// MOUNTS
		{
			name: 'pontoon',
			id: 1000,
			type: 'mount',
			x: 144,
			y: 184
		},
		{
			name: 'blackboat',
			title: 'black boat',
			id: 1002,
			type: 'mount',
			x: 144,
			y: 184,
			price: 100
		},
		{
			name: 'blackboat',
			title: 'RED boat',
			id: 1003,
			type: 'mount',
			x: 144,
			y: 184,
			price: 100000
		},
		{
			name: 'blackboat',
			title: 'YELLOW boat',
			id: 1004,
			type: 'mount',
			x: 144,
			y: 184,
			price: 100000
		},
		// {name: 'raft', id: 1001, type: 'mount'},
	]
}

module.exports = itemsRegistry;