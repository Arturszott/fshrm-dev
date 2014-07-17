'use strict';

var Crew = require('./prefabs/crew');
var Shop = require('./prefabs/shop');
var House = require('./prefabs/house');

var createBuilding = function(name, x, y) {
	var building = this.game.add.sprite(x, y, 'building_' + name);

	var scrollAnim = building.animations.add('living');
	building.animations.play('living', 2, true);

	building.label = this.game.add.sprite(x, y - 80, 'building_label_' + name);
	building.label.anchor.set(0.5);

	building.label.scale.x = 0.8;
	building.label.scale.y = 0.8;

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

	this.workshop = createBuilding.call(this, 'garage', x, this.game.CELL_SIZE * 1 + 30);
	this.house = createBuilding.call(this, 'house', x, this.game.CELL_SIZE * 2 + 30);
	this.shop = createBuilding.call(this, 'shop', x, this.game.CELL_SIZE * 5);

	this.crew = new Crew(this.game, this.game.width / 6 * 4, -300, 1);
	console.log(this.crew);
	this.crew.hero.visible = false;
	this.crew.tool.visible = false;

	this.crew.btn = this.game.add.button(this.crew.hero.x, this.crew.hero.y + 10, 'playBtn', this.goFishing, this, 0, 0, 1, 0);
	this.crew.btn.scale.x = 0.8;
	this.crew.btn.scale.y = 0.8;
	this.crew.btn.anchor.setTo(0.5, 0.5);
	this.crew.add(this.crew.btn);

}

Bay.prototype = {

	travel: function() {
		var that = this;

		this.travelStart();

		setTimeout(this.travelStop.bind(this), 1000);
		console.log('traveling to bay');

		this.game.add.tween(this.workshop).to({
			x: this.game.width / 1.75,
		}, 800, Phaser.Easing.Sinusoidal.Out, true, 600, false);
		this.game.add.tween(this.workshop.label).to({
			x: this.game.width / 1.75 + 20,
		}, 800, Phaser.Easing.Sinusoidal.Out, true, 600, false);

		this.game.add.tween(this.shop).to({
			x: this.game.width / 4,
		}, 700, Phaser.Easing.Sinusoidal.Out, true, 600, false);
		this.game.add.tween(this.shop.label).to({
			x: this.game.width / 4 + 20,
		}, 700, Phaser.Easing.Sinusoidal.Out, true, 600, false);

		this.game.add.tween(this.house).to({
			x: this.game.width / 4,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600, false);
		this.game.add.tween(this.house.label).to({
			x: this.game.width / 4,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600, false);

		this.game.add.tween(this.crew).to({
			y: this.game.height * 1,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600, false).onComplete.add(this.crew.rest.bind(this.crew));



		this.game.add.tween(this.game.water).to({
			x: -50,
		}, 4000, Phaser.Easing.Sinusoidal.None, true, 0, 1000, true);

	},
	visitshop: function() {
		console.log('visiting shop')
		if (!this.shopBoard) {
			this.shopBoard = new Shop(this.game, this.shop.x, this.shop.y);
		}
		this.showBuilding(this.shop, this.shopBoard);

	},
	visitgarage: function() {
		console.log('visiting parts')
	},
	visithouse: function() {
		console.log('visiting house')
		if (!this.houseBoard) {
			this.houseBoard = new House(this.game, this.shop.x, this.shop.y);
		}
		this.showBuilding(this.house, this.houseBoard);
	},
	addBayButton: function() {
		if (this.currentBoard && this.currentBoard.isShown) return;

		this.bayButton = this.game.add.button(this.game.width - 10, this.game.height + 100, 'homeBtn', this.hideBuilding, this);
		this.bayButton.anchor.setTo(1, 1);

		this.bayButton.scale.y = 0.8;
		this.bayButton.scale.x = 0.8;

		this.game.add.tween(this.bayButton).to({
			y: this.game.height - 10,
		}, 400, Phaser.Easing.Sinusoidal.None, true, 0, false);
	},
	showBuilding: function(building, board) {
		if (this.leaving || (this.currentBoard && this.currentBoard.isShown)) return;

			// fade building labels
			this.labels.forEach(function(label) {
				this.game.add.tween(label).to({
					alpha: 0
				}, 500, Phaser.Easing.Linear.None, true, 0, false);
			}, this);

			this.addBayButton();

			// calculate building moving offset 
			// to place them on bottom left corner of the screen
			this.buildingOffset = {
				y: this.shop.y - building.y,
				x: this.shop.x - building.x
			}

			// move the buildings if necessery
			this.buildings.forEach(function(b) {
				this.game.add.tween(b).to({
					y: b.y + this.buildingOffset.y,
					x: b.x + this.buildingOffset.x,
				}, 300, Phaser.Easing.Linear.None, true, 0, false);
			}.bind(this));

			this.game.add.tween(this.crew).to({
				y: this.crew.y + this.buildingOffset.y,
				x: this.crew.x + this.buildingOffset.x
			}, 300, Phaser.Easing.Linear.None, true, 0, false);

			this.currentBoard = board; 
			board.show();

		},
		hideBuilding: function() {
			if (this.currentBoard && this.currentBoard.isShown) {

				this.game.add.tween(this.bayButton).to({
					y: this.game.height + 100,
				}, 400, Phaser.Easing.Sinusoidal.None, true, 0, false).onComplete.add(function() {
					this.bayButton.destroy();
				}.bind(this));

				this.game.add.tween(this.crew).to({
					y: this.crew.y - this.buildingOffset.y,
					x: this.crew.x - this.buildingOffset.x
				}, 300, Phaser.Easing.Linear.None, true, 0, false);

				this.currentBoard.hide();

				this.labels.forEach(function(label) {
					this.game.add.tween(label).to({
						alpha: 1
					}, 500, Phaser.Easing.Linear.None, true, 0, false);
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
			this.game.water.autoScroll(300, 0);
			this.game.background.autoScroll(300, 0);
		},
		travelStop: function() {
			this.game.water.autoScroll(0, 0);
			this.game.background.autoScroll(0, 0);
		},
		goFishing: function() {
			if (this.leaving || (this.currentBoard && this.currentBoard.isShown)) return;

			this.leaving = true;
			console.log('go Fishing!!')

			var baseY = this.crew.hero.y;
			var that = this;
			this.game.world.bringToTop(this.crew.hero);
			this.crew.hero.y = -this.game.height - this.crew.hero.height;
			this.crew.hero.visible = true;

			var duration = 500;

			this.game.add.tween(this.crew.hero).to({
				y: baseY
			}, duration * 3, Phaser.Easing.Bounce.Out, true, duration, false).onComplete.add(function() {
				this.crew.awake.call(this.crew);
			}.bind(this));

			this.game.add.tween(this.crew.btn).to({
				alpha: 0
			}, duration * 1, Phaser.Easing.Sinusoidal.Out, true, 0, false);

			this.game.add.tween(this.crew).to({
				y: this.game.height * 2
			}, duration * 3, Phaser.Easing.Linear.None, true, duration * 4, false).onComplete.add(function() {
				that.game.bayReturn.call(that.baseState);
			}.bind(this));

			this.buildings.forEach(function(building) {
				this.game.add.tween(building).to({
					y: building.y - this.game.height
				}, 1200 * 1, Phaser.Easing.Linear.None, true, 2000, false);

				setTimeout(function() {
					building.label.waveTween.stop();
				}.bind(this), duration * 4);

				this.game.add.tween(building.label).to({
					y: building.label.y - this.game.height
				}, 1200 * 1, Phaser.Easing.Linear.None, true, 2000, false);
			}.bind(this));

			setTimeout(function() {
				this.game.water.autoScroll(0, -300);
				this.game.background.autoScroll(0, -300);
			}.bind(this), duration * 4);
		}
	}

	module.exports = Bay;