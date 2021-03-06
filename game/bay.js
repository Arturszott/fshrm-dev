'use strict';

var Crew = require('./prefabs/crew');
var Shop = require('./prefabs/shop');
var House = require('./prefabs/home');
var Garage = require('./prefabs/garage');

var createBuilding = function(name, x, y) {
	var building = this.game.add.sprite(x, y, 'building_' + name);
	building.animations.add('living');
	building.animations.play('living', 2, true);
	building.label = this.game.add.sprite(x, y - 80, 'building_label_' + name);
	building.label.anchor.set(0.5);
	building.label.scale.x = 0.8;
	building.label.scale.y = 0.8;

	this.game.add.existing(building);
	this.game.add.existing(building.label);

	building.label.waveTween = this.game.add.tween(building.label).to({
		y: building.label.y + 10
	}, 1000, Phaser.Easing.Linear.None, true, 500 * Math.random(), 1000, true);

	building.anchor.set(0.5);
	building.inputEnabled = true;
	building.scale.x = 0.8;
	building.scale.y = 0.8;

	building.events.onInputDown.add(this['visit' + name].bind(this), this);

	this.buildings.push(building);
	this.labels.push(building.label);
	return building;
}

var Bay = function(game) {
	this.game = game;

	this.buildings = [];
	this.labels = [];

	var x = -100;

	this.crew = new Crew(this.game, this.game.width / 6 * 4, -300, 1);
	this.crew.hero.visible = false;
	this.crew.tool.visible = false;

	this.crew.btn = this.game.add.button(this.crew.hero.x, this.crew.hero.y + 30, 'playBtn', this.goFishing, this, 0, 0, 1, 0);
	this.game.add.existing(this.crew);

	this.garage = createBuilding.call(this, 'garage', x, this.game.CELL_SIZE * 1 + 30);
	this.house = createBuilding.call(this, 'house', x, this.game.CELL_SIZE * 2 + 30);
	this.shop = createBuilding.call(this, 'shop', x, this.game.CELL_SIZE * 5);

	this.crew.btn.scale.x = 0.82;
	this.crew.btn.scale.y = 0.82;
	this.crew.btn.anchor.setTo(0.5, 0.5);
	this.crew.add(this.crew.btn);
}

Bay.prototype = {
	destroy: function(){
		this.baseState = null;
		this.buildings.forEach(function(el){
			el.destroy();
		});
		this.labels.forEach(function(el){
			el.destroy();
		});
		this.crew.destroy();
		this.game = null;
		this.garage.destroy();
		this.house.destroy();
		this.shop.destroy();
	},
	travel: function() {
		var that = this;

		this.travelStart();

		setTimeout(this.travelStop.bind(this), 1000);

		if(this.game.monster){
			this.game.add.tween(this.game.monster).to({
				x: this.game.monster.x + this.game.width,
			}, 800, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function(){
				this.game.monster.destroy();
			}.bind(this));
		}

		this.game.add.tween(this.garage).to({
			x: this.game.width / 1.75,
		}, 800, Phaser.Easing.Sinusoidal.Out, true, 600).start();
		this.game.add.tween(this.garage.label).to({
			x: this.game.width / 1.75 + 20,
		}, 800, Phaser.Easing.Sinusoidal.Out, true, 600).start();

		this.game.add.tween(this.shop).to({
			x: this.game.width / 4,
		}, 700, Phaser.Easing.Sinusoidal.Out, true, 600).start();
		this.game.add.tween(this.shop.label).to({
			x: this.game.width / 4 + 20,
		}, 700, Phaser.Easing.Sinusoidal.Out, true, 600).start();

		this.game.add.tween(this.house).to({
			x: this.game.width / 4,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600).start();
		this.game.add.tween(this.house.label).to({
			x: this.game.width / 4,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600).start();

		this.game.add.tween(this.crew).to({
			y: this.game.height * 1,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600).start().onComplete.add(this.crew.rest.bind(this.crew));

		setTimeout(function() {
			this.game.add.tween(this.game.water).to({
				x: -50,
			}, 2500, Phaser.Easing.Sinusoidal.None, true, 0, 1000, true);
		}.bind(this), 1200);


	},
	visitshop: function() {
		if (!this.shopBoard) {
			this.shopBoard = new Shop(this.game, this.shop.x, this.shop.y);
			this.game.add.existing(this.shopBoard);
		}

		this.showBuilding(this.shop, this.shopBoard);

	},
	visitgarage: function() {
		if (!this.garageBoard) {
			this.garageBoard = new Garage(this.game, this.shop.x, this.shop.y);
			this.game.add.existing(this.garageBoard);
		}
		this.showBuilding(this.garage, this.garageBoard);
	},
	visithouse: function() {
		if (!this.houseBoard) {
			this.houseBoard = new House(this.game, this.shop.x, this.shop.y);
			this.houseBoard.outsideCrew = this.crew;
			this.game.add.existing(this.houseBoard);
		}
		this.showBuilding(this.house, this.houseBoard);
	},
	addBayButton: function() {
		if (this.currentBoard && this.currentBoard.isShown) return;

		this.bayButton = this.game.add.button(this.game.width - 10, this.game.height + 100, 'homeBtn', this.hideBuilding, this);
		this.game.stage.addChild(this.bayButton);
		this.game.stage.addChild(this.game.add.image(0, 0, ''));
		
		this.bayButton.anchor.setTo(1, 1);

		this.bayButton.scale.y = 0.8;
		this.bayButton.scale.x = 0.8;

		this.game.add.tween(this.bayButton).to({
			y: this.game.height - 10,
		}, 400, Phaser.Easing.Sinusoidal.None, true, 0).start();
	},
	showBuilding: function(building, board) {
		if (this.leaving || (this.currentBoard && this.currentBoard.isShown)) return;

		// fade building labels
		this.labels.forEach(function(label) {
			this.game.add.tween(label).to({
				alpha: 0
			}, 500, Phaser.Easing.Linear.None, true, 0).start();
		}, this);

		this.addBayButton();

		// calculate building moving offset 
		// to place them on bottom left corner of the screen

		this.buildingOffset = {
			y: this.shop.y - building.y,
			x: this.shop.x - building.x
		}
		this.boatOffset = this.buildingOffset.y > 0 ? 100 : 0;

		// move the buildings if necessery
		this.buildings.forEach(function(b) {
			this.game.add.tween(b).to({
				y: b.y + this.buildingOffset.y,
				x: b.x + this.buildingOffset.x,
			}, 300, Phaser.Easing.Linear.None, true, 0).start();
		}.bind(this));

		this.game.add.tween(this.crew).to({
			y: this.crew.y + this.buildingOffset.y + this.boatOffset,
			x: this.crew.x + this.buildingOffset.x
		}, 300, Phaser.Easing.Linear.None, true, 0).start();

		this.currentBoard = board;

		board.show();

	},
	hideBuilding: function() {
		if (this.currentBoard && this.currentBoard.isShown) {

			this.game.add.tween(this.bayButton).to({
				y: this.game.height + 100,
			}, 400, Phaser.Easing.Sinusoidal.None, true, 0).start().onComplete.add(function() {
				this.bayButton.destroy();
			}.bind(this));

			this.game.add.tween(this.crew).to({
				y: this.crew.y - this.buildingOffset.y - this.boatOffset,
				x: this.crew.x - this.buildingOffset.x
			}, 300, Phaser.Easing.Linear.None, true, 0).start();

			this.currentBoard.hide();

			this.labels.forEach(function(label) {
				this.game.add.tween(label).to({
					alpha: 1
				}, 500, Phaser.Easing.Linear.None, true, 0).start();
			}, this);

			this.buildings.forEach(function(b) {
				this.game.add.tween(b).to({
					y: b.y - this.buildingOffset.y,
					x: b.x - this.buildingOffset.x
				}, 300, Phaser.Easing.Linear.None, true, 0, false);
			}.bind(this));

			this.currentBoard = null;
		}
	},
	travelStart: function() {
		this.game.audio.bay.play();
		this.game.water.autoScroll(5, 0);
		this.game.background.autoScroll(4.5, 0);
	},
	travelStop: function() {
		this.game.water.autoScroll(0, 0);
		this.game.background.autoScroll(0, 0);
	},
	goFishing: function() {
		if (this.leaving || (this.currentBoard && this.currentBoard.isShown)) return;

		this.leaving = true;

		var baseY = this.crew.hero.y;

		this.crew.hero.visible = true;
		this.game.world.bringToTop(this.crew);
		var hack = this.game.add.image(0, 0, '');
		this.game.world.bringToTop(hack);
		this.crew.hero.y = -this.game.height - this.crew.hero.height;

		var duration = 500;

		this.game.add.tween(this.crew.hero).to({
			y: baseY
		}, duration * 3, Phaser.Easing.Bounce.Out, true, duration).start().onComplete.add(function() {
			this.crew.awake.call(this.crew);
		}.bind(this));

		this.game.add.tween(this.crew.btn).to({
			alpha: 0
		}, duration * 1, Phaser.Easing.Sinusoidal.Out, true, 0).start();

		this.game.add.tween(this.crew).to({
			y: this.game.height * 2
		}, duration * 3, Phaser.Easing.Linear.None, true, duration * 4).start().onComplete.add(function() {
			this.game.bayReturn.call(this.baseState);
		}.bind(this));

		this.buildings.forEach(function(building) {
			this.game.add.tween(building).to({
				y: building.y - this.game.height
			}, 1200 * 1, Phaser.Easing.Linear.None, true, 2000).start();

			setTimeout(function() {
				building.label.waveTween.stop();
			}.bind(this), duration * 4);

			this.game.add.tween(building.label).to({
				y: building.label.y - this.game.height
			}, 1200 * 1, Phaser.Easing.Linear.None, true, 2000).start();
		}.bind(this));

		setTimeout(function() {
			this.game.water.autoScroll(0, -4);
			this.game.background.autoScroll(0, -3);
		}.bind(this), duration * 4);
	}
}

module.exports = Bay;