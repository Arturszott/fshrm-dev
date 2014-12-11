'use strict';

var Bottom = require('../../prefabs/bottom');
var Water = require('../../prefabs/water');
var Boom = require('../../prefabs/boom');

var Crew = require('../../prefabs/crew');
var Timer = require('../../prefabs/timer');

var Intro = require('../../intro');

var config = require('../../config');
var storage = require('../../storage');

var showTitle = require('./showTitle');
var setupGameplay = require('./gameplay');
var summonMonster = require('./monster');

var ads = require('../../ads');
ads.init();

var parts = require('../../parts');

// subphases
var handleMusic = require('../subphases/music');
var createScoreBox = require('../subphases/scorebox');

var playIntro = function() {
    this.intro = new Intro(this.game, this);
    this.intro.playStep();
};
var refreshGame = function() {
    this.destroyLayers();

    this.game.add.existing(this.boomSprite);
    this.game.add.existing(this.background);

    this.fishLayer = this.game.add.group();
    this.game.add.existing(this.water);
    this.mineLayer = this.game.add.group();

    this.itemPart = parts.randomizeItem();

    this.elemArrays.left = [];
    this.elemArrays.right = [];


    this.game.level = 1;

    this.timer = new Timer(this.game, config.GAME_TIME, summonMonster.bind(this));
    this.game.timer = this.timer;

    this.crew = new Crew(this.game, this.game.width / 2, -this.CELL_SIZE * 2, 1);

    this.game.add.existing(this.crew);

    // other functions eq. update depend on this
    this.gameover = false;
    this.game.starting = true

    this.white = this.game.add.sprite(0, 0, 'introlayer');
    this.white.height = this.game.height;
    this.white.width = this.game.width;

    this.game.add.tween(this.white).to({
        alpha: 0
    }, 1000, Phaser.Easing.Sinusoidal.Out).start();

    this.slideDownCrew();

}
var create = function() {
    this.game.onPause.add(function() {
        this.game.wasPaused = true;
    }, this);

    // binds music events & objects
    handleMusic.call(this);

    // setup gameplay functions
    setupGameplay.call(this);

    // create score box
    createScoreBox.call(this);



    this.background = new Bottom(this.game, 0, 0, 'bottom');
    this.water = new Water(this.game, 0, 0, 'water');

    this.boomSprite = new Boom(this.game, this.game.width / 2, this.game.height / 2);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;

    this.CELL_SIZE = this.game.height * config.verticalCellSize;
    this.LEFT_POSITION = this.game.width / 6;
    this.RIGHT_POSITION = this.game.width / 6 * 5;

    this.game.background = this.background;
    this.game.water = this.water;
    this.game.CELL_SIZE = this.CELL_SIZE;
    this.game.bayReturn = this.bayReturn;

    this.setInput();

    // FUCKING IMPORTANT FUNCTION
    refreshGame.call(this);

    if (!storage.isIntroPlayed()) {
        // if (true) {
        playIntro.call(this);
    } else {
        if (this.game.startInstant) {
            if (this.game.bay) {
                this.game.bay.destroy();
            }
            setTimeout(this.startGame.bind(this), 600);
        } else {
            this.game.startInstant = true;
            showTitle.call(this);

            this.startInput = this.game.input.onDown.add(this.startGame, this);
        }
    }
    this.game.add.image(0, 0, 'pixel');
}

module.exports = create