'use strict';

var Crew = require('./prefabs/crew');

var createBuilding = function(name, x, y) {
	var building = this.game.add.sprite(x, y, 'building_' + name);

	building.anchor.set(0.5);
	building.inputEnabled = true;

	building.events.onInputDown.add(this['visit' + name].bind(this), this);

	return building;
}

var Bay = function(game) {
	this.game = game;

	var x = -100;
	this.shop = createBuilding.call(this, 'shop', x, this.game.CELL_SIZE);

	this.workshop = createBuilding.call(this, 'parts', x, this.game.CELL_SIZE * 3);
	this.house = createBuilding.call(this, 'house', x, this.game.CELL_SIZE * 5);

	this.crew = new Crew(this.game, this.game.width / 6 * 5, -300, 1);
	this.crew.hero.visible = false;
	this.crew.tool.visible = false;

	this.crew.btn = this.game.add.button(this.crew.hero.x, this.crew.hero.y + 10, 'playBtn', this.goFishing, this);
	this.crew.btn.scale.x = 0.6;
	this.crew.btn.scale.y = 0.6;
	this.crew.btn.anchor.setTo(0.5, 0.5);
	this.crew.add(this.crew.btn);

}

Bay.prototype = {

	travel: function() {
		var that = this;

		this.travelStart();

		setTimeout(this.travelStop.bind(this), 1000);
		console.log('traveling to bay');

		this.game.add.tween(this.shop).to({
			x: this.game.width / 6,
		}, 700, Phaser.Easing.Sinusoidal.Out, true, 600, false);
		this.game.add.tween(this.workshop).to({
			x: this.game.width / 6,
		}, 800, Phaser.Easing.Sinusoidal.Out, true, 600, false);
		this.game.add.tween(this.house).to({
			x: this.game.width / 6,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600, false);

		this.game.add.tween(this.crew).to({
			y: this.game.height,
		}, 900, Phaser.Easing.Sinusoidal.Out, true, 600, false).onComplete.add(this.crew.rest.bind(this.crew));

		this.game.add.tween(this.game.water).to({
			x: -50,
		}, 4000, Phaser.Easing.Sinusoidal.None, true, 0, 1000, true);

	},
	visitshop: function() {
		console.log('visiting shop')
	},
	visitparts: function() {
		console.log('visiting parts')
	},
	visithouse: function() {
		console.log('visiting house')
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
		if(this.leaving) return;

		this.leaving = true;
		console.log('go Fishing!!')

		var baseY = this.crew.hero.y;

		this.crew.hero.y = -this.game.height - this.crew.hero.height;
		this.crew.hero.visible = true;

		var duration = 500;

		this.game.add.tween(this.crew.hero).to({
			y: baseY
		}, duration*3, Phaser.Easing.Bounce.Out, true, duration, false).onComplete.add(function(){
			this.crew.awake.call(this.crew);
		}.bind(this));

		this.game.add.tween(this.crew.btn).to({
			alpha: 0
		}, duration*1, Phaser.Easing.Sinusoidal.Out, true, 0, false);

		this.game.add.tween(this.crew).to({
			y: this.game.height * 2
		}, duration*3, Phaser.Easing.Sinusoidal.Out, true, duration * 4, false);
	}
}

module.exports = Bay;