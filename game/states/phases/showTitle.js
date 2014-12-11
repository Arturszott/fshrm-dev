'use strict';

var _ = require('../../utils');
var config = require('../../config');

// subphases
// var handleMusic = require('../subphases/music');

var showTitle = function() {
    this.title = this.game.add.sprite(this.game.width / 2, this.game.height + 100, 'title');
    this.stitle1 = this.game.add.sprite(this.game.width / 2, this.game.height + 100, 'stitle1');
    this.stitle2 = this.game.add.sprite(this.game.width / 2, this.game.height + 100, 'stitle2');

    _.scale(this.title, 0.75);
    _.scale(this.stitle1, 0.75);
    _.scale(this.stitle2, 0.75);

    _.anchorC(this.title);
    _.anchorC(this.stitle1);
    _.anchorC(this.stitle2);

    this.tapLeft = this.game.add.sprite(-this.game.width / 2 - 10, 100, 'tap-right');
    this.tapRight = this.game.add.sprite(this.game.width * 2 + 10, 100, 'tap-left');

    _.anchorC(this.tapRight);
    _.anchorC(this.tapLeft);

    this.muteButton.show();

    var finalLeft = 50;
    var finalRight = this.game.width - 50;


    this.tapRight.tween = this.game.add.tween(this.tapRight)
        .to({
            x: finalRight
        }, 500, Phaser.Easing.Sinusoidal.Out)
        .to({
            x: finalRight - 10
        }, 200, Phaser.Easing.Sinusoidal.Out).start();

    this.tapLeft.tween = this.game.add.tween(this.tapLeft).to({
        x: finalLeft
    }, 500, Phaser.Easing.Sinusoidal.Out).to({
        x: finalLeft + 10
    }, 200, Phaser.Easing.Sinusoidal.Out).start();


    this.game.add.tween(this.title).to({
        y: this.game.height * 3 / 4 - 70 - 100
    }, 500, Phaser.Easing.Sinusoidal.Out).start();
    this.game.add.tween(this.stitle1).to({
        y: this.game.height * 3 / 4 - 10 - 100
    }, 500, Phaser.Easing.Sinusoidal.Out).start();
    this.game.add.tween(this.stitle2).to({
        y: this.game.height * 3 / 4 + 25 - 100
    }, 500, Phaser.Easing.Sinusoidal.Out).start();

    var buttonsY = this.game.height + 60;

    this.bayButton = this.game.add.button(this.game.width / 2 - 6, buttonsY + 100, 'homeBtn', this.bayTravel, this, 0, 0, 1, 0);
    this.bayButton.anchor.setTo(0.5, 0.5);

    this.rateButton = this.game.add.sprite(this.bayButton.x - this.bayButton.width - 10, buttonsY + 200, 'btn_rate');
    this.rateButton.anchor.setTo(0.5, 0.5);
    this.rateButton.inputEnabled = true;
    this.rateButton.animations.add('wavin');
    this.rateButton.animations.play('wavin', 5, true);
    this.rateButton.events.onInputDown.add(this.rateClick, this);

    this.rankButton = this.game.add.button(this.bayButton.x + this.bayButton.width + 10, buttonsY + 300, 'rankBtn', this.showRanks, this, 0, 0, 1, 0);
    this.rankButton.anchor.setTo(0.5, 0.5);

    this.game.add.tween(this.bayButton).to({
        y: buttonsY - 120
    }, 500, Phaser.Easing.Sinusoidal.Out).start();

    this.game.add.tween(this.rateButton).to({
        y: buttonsY - 120
    }, 500, Phaser.Easing.Sinusoidal.Out).start();
    this.game.add.tween(this.rankButton).to({
        y: buttonsY - 120
    }, 500, Phaser.Easing.Sinusoidal.Out).start();
}

module.exports = showTitle