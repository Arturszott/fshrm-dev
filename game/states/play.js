'use strict';

var config = require('../config');

var itemsRegistry = require('../itemsRegistry');
var storage = require('../storage');


// phases
var create = require('./phases/create');
var hideTitle = require('./phases/hideTitle');
var explode = require('./phases/explosion');

// game objects
var Bay = require('../bay');
var Scoreboard = require('../prefabs/scoreboard');

var _ = require('../utils');

function Play() {};

Play.prototype = {
    elemArrays: {
        left: [],
        right: []
    },
    render: function() {
        if (this.game.slowTriggered) {
            this.game.slowTriggered = false;
            this.game.isAccelerated = false;
        }
    },
    create: function() {
        create.call(this);

    },
    destroyLayers: function() {
        this.fishLayer && this.fishLayer.destroy(true);
        this.mineLayer && this.mineLayer.destroy(true);
    },

    bayReturn: function() {
        this.game.state.start('play');
    },

    setInput: function() {
        this.sideInput = this.game.input.onDown.add(this.sideAction, this);
    },
    detachInput: function() {
        this.sideInput.destroy();
    },
    addPart: function() {
        storage.addPart(this.itemPart.item.id);
    },

    update: function() {
        var now = new Date().getTime();

        if (this.then && !this.game.wasPaused) {
            this.game.multiplier = (now - this.then) * 60 / 1000;
        } else {
            this.game.wasPaused = false;
            this.game.multiplier = 1;
        }

        this.then = now;
    },
    shutdown: function() {
        this.elemArrays = {};
        this.game.audio.music.stop();
        this.crew && this.crew.destroy();
        this.scoreboard && this.scoreboard.destroy();
        this.game.bay && this.game.bay.destroy();
        this.game.audio.bay && this.game.audio.bay.stop();
        this.game.bay = null;
    },
    slideDownCrew: function() {
        this.game.add.tween(this.crew).to({
            y: this.game.height / 2 - this.CELL_SIZE / 3 * 2
        }, 500, Phaser.Easing.Linear.None).start();
    },
    rateClick: function() {
        window.rateApp && window.rateApp();
    },
    showRanks: function() {
        if (!socialService.isLoggedIn()) {
            socialService.login(function(loggedIn, error) {
                if (error) {
                    console.error("login error: " + error.message + " " + error.code);
                } else if (loggedIn) {
                    console.log("login suceeded");
                } else {
                    console.log("login cancelled");
                }
            });
        }
        socialService && socialService.showLeaderboard(function(error) {
            if (error)
                console.error("showLeaderbord error: " + error.message);
        });
    },

    bayTravel: function() {
        hideTitle.call(this);
        this.game.add.tween(this.muteButton).to({
            y: -100
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);

        this.startInput.detach();
        this.game.add.tween(this.crew).to({
            y: this.game.height * 2
        }, 600, Phaser.Easing.Linear.None, true, 0, false).onComplete.add(function() {
            this.crew.destroy();
            this.crew.alive = false;
        }.bind(this));

        this.game.bay = new Bay(this.game);
        this.game.bay.baseState = this;
        this.game.bay.travel();
        storage.addStat('bay-visits', 1);

    },
    startGame: function(pointer) {
        storage.addStat('games', 1);

        if (pointer && (pointer.positionDown.y > this.game.height * 3 / 4) ||
            (pointer && pointer.positionDown.y < this.muteButton.height)) {

        } else {
            this.startInput && this.startInput.detach();

            if (!this.crew.alive && !this.gameover) {
                this.game.audio.start.play();
                hideTitle.call(this);
                this.placeStartElements();
                this.crew.alive = true;
                this.scoreText.visible = true;
            }
        }

    },
    checkScore: function() {
        this.score++;

        if (Math.floor(this.score / 10) == this.game.level) {
            this.game.level++;

            _.anims.scale(this.scoreText, 1.3, 200);
            this.scoreText.updateText();
            this.scoreText.position.x = (this.game.width - this.scoreText.textWidth) / 2;
        }
        this.scoreText.setText(this.score.toString());
    },
    showScoreboard: function() {
        this.game.bay = new Bay(this.game);
        this.game.bay.baseState = this;

        this.muteButton.show();

        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
        this.scoreboard.showRanks = this.showRanks;
        socialService && socialService.submitScore(this.score);
    },
    deathHandler: function() {
        explode.call(this);
    }
};

module.exports = Play;