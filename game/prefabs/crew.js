'use strict';

var Mount = require('./mount');
var Wave = require('./wave');
var Hero = require('./hero');
var Tool = require('./tool');

var storage = require('../storage');

var Crew = function(game, x, y) {
	Phaser.Group.call(this, game, game.world, 'crew');

	this.eqp = storage.getEquipment();

	if (!!localStorage) {
		this.toolType = localStorage.getItem('tool') || 'pole';
	}
	this.wave = new Wave(game, x, y, null);
	this.mount = new Mount(game, x, y, this.eqp.mount);
	this.hero = new Hero(game, x, y, this.eqp.hero);

	this.tool = new Tool(game, x, y, this.eqp.tool, {
		// offset
		x: -46 * this.game.widthRatio,
		y: 10
	});

	this.add(this.wave);
	this.add(this.mount);
	this.add(this.hero);
	this.add(this.tool);

	this.alive = false;
	this.onGround = false;

};

Crew.prototype = Object.create(Phaser.Group.prototype);
Crew.prototype.constructor = Crew;
Crew.prototype.catch = function(side, element) {
	this.parent.bringToTop(this);

	var swimDistance = 40 * this.game.widthRatio;

	this.hero.catch(side, swimDistance);
	this.tool.catch(side, swimDistance);
	this.mount.catch(side, swimDistance);
	this.wave.catch(side, swimDistance);
}
Crew.prototype.applyDeath = function(side) {
	this.destroy();
	// this.hero.applyDeath();
	// this.wave.applyDeath();
	// this.mount.applyDeath();
	// this.tool.destroy();
}
Crew.prototype.rest = function() {
	this.game.add.tween(this.wave).to({
		alpha: 0
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false);
	// this.wave.visible = false;
	this.hero.swimAnim.stop();
	this.mount.swimAnim.stop();
	this.tool.waveTween._duration = 1000;
}
Crew.prototype.awake = function() {
	this.game.add.tween(this.wave).to({
		alpha: 1
	}, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false);
	this.hero.swimAnim.play();
	this.mount.swimAnim.play();
	this.tool.waveTween._duration = 300;
}
Crew.prototype.update = function() {

	// write your prefab's specific update code here

};

module.exports = Crew;