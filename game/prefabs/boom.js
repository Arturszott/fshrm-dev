'use strict';

var Boom = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'boom', 0);
	this.game = game;

	this.anchor.setTo(0.5, 0.5);
	this.scale.x = game.width / 144;
	this.scale.y = game.width / 144;
	this.visible = false;

	var anim = this.animations.add('splashing');
	anim.killOnComplete = true;
};

Boom.prototype = Object.create(Phaser.Sprite.prototype);
Boom.prototype.constructor = Boom;
Boom.prototype.update = function() {
};
Boom.prototype.show = function(){
	this.visible = true;
	this.game.audio.explosion.play();
	this.game.world.bringToTop(this);
	this.animations.play('splashing', 16, 0);
}

module.exports = Boom;