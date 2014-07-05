'use strict';

var config = require('../config');

var Crew = require('../prefabs/crew');
var Fish = require('../prefabs/fish');
var Mine = require('../prefabs/mine');
var Timer = require('../prefabs/timer');
var Scoreboard = require('../prefabs/scoreboard');

var CELL_SIZE = 0;
var LEFT_POSITION = 0;
var RIGHT_POSITION = 0;

function Play() {};

Play.prototype = {
    create: function() {
        this.game.level = 1;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 0;

        // almost constant, aye?
        CELL_SIZE = this.game.height * config.verticalCellSize;
        LEFT_POSITION = this.game.width / 6;
        RIGHT_POSITION = this.game.width / 6 * 5;

        // we will hold there fish & mines
        this.elemArrays.left = [];
        this.elemArrays.right = [];

        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bottom');
        this.background.autoScroll(0, config.baseBottomSpeed);

        this.water = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'waterlayer');
        this.game.water = this.water;
        this.water.autoScroll(0, config.baseWaterSpeed);

        this.timer = new Timer(this.game, config.GAME_TIME, this.deathHandler.bind(this));

        this.crew = new Crew(this.game, this.game.width / 2, CELL_SIZE / 3 * 2, 1);
        this.game.world.addAt(this.crew, 2);

        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, 'flappyfont', this.score.toString(), 24);
        this.scoreText.visible = false;

        this.game.input.onDown.add(this.sideAction, this);
        this.game.input.onDown.addOnce(this.startGame, this);
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        this.instructionGroup = this.game.add.group();
        this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 100, 'getReady'));
        // this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 325, 'instructions'));
        this.instructionGroup.setAll('anchor.x', 0.5);
        this.instructionGroup.setAll('anchor.y', 0.5);

        this.gameover = false;
    },
    elemArrays: {
        left: [],
        right: []
    },
    sideAction: function(pointer, e) {
        if (!this.crew.alive || this.gameover) return;

        var side = pointer.positionDown.x > this.game.width / 2 ? 'right' : 'left';
        var nextElem = this.elemArrays[side][0];
        nextElem.bringToTop();
        this.crew.catch(side, nextElem);
        this.timer.increase();
        this.accelerateAll();

        if (nextElem.key === 'mine') {
            this.deathHandler(nextElem);
        } else {
            this.checkScore();
            nextElem.throwAway(side);
        }

        this.dispose();
        this.refill()
    },
    accelerateAll: function() {
        if (this.game.isAccelerated) return;

        this.background.autoScroll(0, config.bottomAccelerationSpeed);
        this.water.autoScroll(0, config.waterAccelerationSpeed);

        this.getAllElements().forEach(function(elem) {
            elem.body.velocity.y = -600;
        });

        this.game.isAccelerated = true;
    },
    slowDownAll: function() {
        this.background.autoScroll(0, config.baseBottomSpeed);
        this.water.autoScroll(0, config.baseBottomSpeed);
        this.getAllElements().forEach(function(elem) {
            // elem.body.acceleration.y = 0;
            elem.body.velocity.y = config.baseElementSpeed;
        });
        this.game.isAccelerated = false;
    },
    placeStartElements: function() {
        var element;

        for (var i = 0; i <= 1 / config.verticalCellSize - 1; i++) {
            this.elemArrays.left.forEach(function(elem) {
                elem.y -= CELL_SIZE;
            });

            element = this.pickElement();
            this.placeElement(element, 'left');
        }
        for (var i = 0; i <= 1 / config.verticalCellSize - 1; i++) {
            this.elemArrays.right.forEach(function(elem) {
                elem.y -= CELL_SIZE;
            });

            if (this.elemArrays.left[this.elemArrays.right.length].key === 'mine') {
                element = Fish;
            } else {
                element = this.pickElement();
            }

            this.placeElement(element, 'right');
        }
    },
    getAllElements: function() {
        return this.elemArrays.left.concat(this.elemArrays.right);
    },
    stopAllElements: function() {
        this.getAllElements().forEach(function(elem) {
            elem.body.velocity.y = 0;
            elem.body.acceleration.y = 0;
        }, this);

        this.background.autoScroll(0, 0);
    },
    dispose: function() {
        this.elemArrays.left.shift();
        this.elemArrays.right.shift();
    },
    refill: function() {
        var element;

        // refill left
        element = this.pickElement();
        this.placeElement(element, 'left');

        // refill right
        if (this.elemArrays.left[this.elemArrays.right.length].key === 'mine') {
            element = Fish;
        } else {
            element = this.pickElement();
        }
        this.placeElement(element, 'right');
    },
    placeElement: function(elem, side) {
        var x;

        var sideArr = this.elemArrays[side];
        var lastElem = sideArr[sideArr.length - 1];

        if (side === 'left') x = LEFT_POSITION;
        if (side === 'right') x = RIGHT_POSITION;

        var y = this.game.height;
        var obj = new elem(this.game, x, y + CELL_SIZE);
        obj.addToWorld();

        if (lastElem) {
            obj.y = lastElem.y + CELL_SIZE;
            obj.body.velocity.y = lastElem.body.velocity.y;
            obj.body.acceleration.y = lastElem.body.acceleration.y;
        }

        sideArr.push(obj);
    },
    pickElement: function() {
        var elements = [Fish, Fish];
        var n = Math.floor(Math.random() * 2);
        return elements[n];
    },
    update: function() {
        var fishes = this.getAllElements();
        this.timer.decrease();

        fishes.forEach(function(elem) {
            if (this.game.isAccelerated && elem.y - 120 < this.crew.y) {
                this.slowDownAll();
            }

        }, this);
    },
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.crew.destroy();
        this.scoreboard.destroy();
    },
    startGame: function() {
        if (!this.crew.alive && !this.gameover) {
            this.timer.start();
            this.placeStartElements();

            // this.crew.body.allowGravity = true;
            this.crew.alive = true;
            this.scoreText.visible = true;

            this.instructionGroup.destroy();
        }
    },
    checkScore: function(pipeGroup) {
        this.score++;

        if (Math.floor(this.score / 20) == this.game.level) {
            this.game.level++;
        }
        this.scoreText.setText(this.score.toString());
        PGLowLatencyAudio && PGLowLatencyAudio.play('score');
    },
    showScoreboard: function() {
        var that = this;
        setTimeout(function() {
            that.scoreboard = new Scoreboard(that.game);
            that.game.add.existing(that.scoreboard);
            that.scoreboard.show(that.score);
        }, 500);

    },
    deathHandler: function(elem) {

        if (!this.gameover) {

            this.timer.stop();
            this.timer.destroyAll();

            this.crew.applyDeath();

            this.gameover = true;

            if (elem) {
                elem.destroy();
            }
            this.slowDownAll();
            this.stopAllElements();
            this.showScoreboard();

        }
    }
};

module.exports = Play;