'use strict';

var Mount = require('./mount');
var Hero = require('./hero');
var Tool = require('./tool');

var Crew = function(game, x, y) {
	Phaser.Group.call(this, game, x, y, 'crew');

	var type = null;


	if (!!localStorage) {
		this.toolType = localStorage.getItem('tool') || 'pole';
	}

	this.mount = new Mount(game, x, y, type);
	this.hero = new Hero(game, x, y, type);

	this.tool = new Tool(game, x, y, this.toolType, {
		// offset
		x: -46 * this.game.widthRatio,
		y: 10
	});

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
}
Crew.prototype.applyDeath = function(side) {
	this.hero.applyDeath();
}
Crew.prototype.update = function() {

	// write your prefab's specific update code here

};

module.exports = Crew;