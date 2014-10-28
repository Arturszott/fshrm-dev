'use strict';

var storage = require('../../storage');
var _ = require('../../utils');

var handleMusic = function() {

    this.game.audio = {};

    var isMuted = storage.getMuted() ? 0 : 1;

    this.game.audio.music = this.game.add.audio('main', isMuted, true);
    this.game.audio.bay = this.game.add.audio('bay', isMuted, true);
    this.game.audio.over = this.game.add.audio('gameover', isMuted);
    this.game.audio.explosion = this.game.add.audio('explosion', isMuted);
    this.game.audio.monster = this.game.add.audio('monster', isMuted);
    this.game.audio.start = this.game.add.audio('start', isMuted);
    this.game.audio.tap = this.game.add.audio('tap', isMuted);
    this.game.audio.pumpkin = this.game.add.audio('pumpkin', isMuted);
    this.game.audio.pumpkinWin = this.game.add.audio('pumpkingood', isMuted);

    this.checkSound = function() {
        var isMuted = storage.getMuted();

        if (isMuted) {
            this.game.sound.mute = true;
            this.muteButton.setFrames(1, 1, 1);
        } else {
            this.game.sound.mute = false;
            this.muteButton.setFrames(0, 0, 0);
        }
    };
    this.muteAll = function() {
        if (this.game.sound.mute) {
            this.muteButton.setFrames(0, 0, 0);
            this.game.sound.mute = false;
            storage.mute(false);
        } else {
            this.muteButton.setFrames(1, 1, 1);
            this.game.sound.mute = true;
            storage.mute(true);
        }
    };

    this.muteButton = this.game.add.button(this.game.width, -100, 'soundBtn', this.muteAll, this, 0, 0, 0, 0);
    this.muteButton.anchor.setTo(1, 0);
    _.scale(this.muteButton, 0.5);

    this.muteButton.show = function() {
        this.game.world.bringToTop(this.muteButton);
        this.game.add.tween(this.muteButton).to({
            y: 4
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
    }.bind(this);

    this.muteButton.hide = function() {
        this.game.add.tween(this.muteButton).to({
            y: -100
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
    }.bind(this);

    this.game.muteButton = this.muteButton;

    this.checkSound();
}

module.exports = handleMusic