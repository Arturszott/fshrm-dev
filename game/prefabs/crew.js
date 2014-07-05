'use strict';

var Mount = require('./mount');
var Hero = require('./hero');
var Tool = require('./tool');

var Crew = function(game, x, y) {
	Phaser.Group.call(this, game, x, y, 'crew');
	console.log(this);

	var type = null;

	this.mount = new Mount(game, x, y, type);
	this.hero = new Hero(game, x, y, type);

	this.tool = new Tool(game, x, y, type, {
		// offset
		x: -46,
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
Crew.prototype.catch = function(side) {
	this.hero.catch(side);
	this.tool.catch(side);
	this.mount.catch(side);
}
Crew.prototype.applyDeath = function(side) {
	this.hero.applyDeath();
}
Crew.prototype.update = function() {

	// write your prefab's specific update code here

};

module.exports = Crew;