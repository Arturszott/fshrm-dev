'use strict';

// var _ = require('../../utils');

// subphases
// var handleMusic = require('../subphases/music');

var hideTitle = function() {
    var buttonsY = this.game.height + 60;

    // another hack...
    if (!this.title || !this.stitle1 || !this.stitle2 || !this.bayButton) return false;

    this.game.add.tween(this.tapRight).to({
        x: 600
    }, 600, Phaser.Easing.Sinusoidal.Out, true, 100).onComplete.add(function() {
        this.tapRight.destroy();
    }.bind(this));
    this.game.add.tween(this.tapLeft).to({
        x: -600
    }, 600, Phaser.Easing.Sinusoidal.Out, true, 100).onComplete.add(function() {
        this.tapLeft.destroy();
    }.bind(this));

    this.game.add.tween(this.title).to({
        y: this.game.height + 100
    }, 600, Phaser.Easing.Sinusoidal.Out, true, 100, false).onComplete.add(function() {
        this.title.destroy();
    }.bind(this));
    this.game.add.tween(this.stitle1).to({
        y: this.game.height + 100
    }, 600, Phaser.Easing.Sinusoidal.Out, true, 100, false).onComplete.add(function() {
        this.stitle1.destroy();
    }.bind(this));;
    this.game.add.tween(this.stitle2).to({
        y: this.game.height + 100
    }, 600, Phaser.Easing.Sinusoidal.Out, true, 100, false).onComplete.add(function() {
        this.stitle2.destroy();
    }.bind(this));;

    this.game.add.tween(this.bayButton).to({
        y: buttonsY + 120
    }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
    this.game.add.tween(this.rateButton).to({
        y: buttonsY + 120
    }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
    this.game.add.tween(this.rankButton).to({
        y: buttonsY + 120
    }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
    this.game.add.tween(this.muteButton).to({
        y: -100
    }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
}

module.exports = hideTitle