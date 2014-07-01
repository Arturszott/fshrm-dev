'use strict';

var Fisherman = require('../prefabs/fisherman');
var Fish = require('../prefabs/fish');
var Mine = require('../prefabs/mine');
var Timer = require('../prefabs/timer');
var PipeGroup = require('../prefabs/pipeGroup');
var Scoreboard = require('../prefabs/scoreboard');

var CELL_SIZE = 0;
var CELL_NUMBER = 6;
var LEFT_POSITION = 0;
var RIGHT_POSITION = 0;

var GAME_TIME = 4000; //ms
var level = 0;

function Play() {};

Play.prototype = {
    create: function() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 100;

        CELL_SIZE = this.game.height / 5;
        LEFT_POSITION = this.game.width / 6;
        RIGHT_POSITION = this.game.width / 6 * 5;

        this.elemArrays.left = [];
        this.elemArrays.right = [];

        this.background = this.game.add.tileSprite(0, 0, this.game.width, 555, 'background');
        this.background.autoScroll(0, -40);

        this.timer = new Timer(this.game, GAME_TIME, this.deathHandler.bind(this));

        this.hero = new Fisherman(this.game, this.game.width / 2, CELL_SIZE / 2, 1);
        this.game.add.existing(this.hero);

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
        if (!this.hero.alive || this.gameover) return;

        var side = pointer.positionDown.x > this.game.width / 2 ? 'right' : 'left';
        var sideArr = this.elemArrays[side];
        var nextElem = sideArr[0];

        this.hero.catch(side);
        this.timer.increase();

        this.accelerateAll();

        if (!nextElem) throw 'element is not defined, do something';

        if (nextElem.key === 'mine') {
            this.deathHandler(nextElem);
        } else {
            this.checkScore();
            this.throwAway(nextElem, side);
        }

        this.dispose();
        this.refill()
    },
    accelerateAll: function() {
        this.getAllElements().forEach(function(elem) {
            elem.body.acceleration.y = -3600;
            elem.acceleratedAt = elem.y;
        });
        this.game.isAccelerated = true;
    },
    slowDownAll: function() {
        this.getAllElements().forEach(function(elem) {
            elem.body.acceleration.y = 0;
            elem.body.velocity.y = -40;
        });
        this.game.isAccelerated = false;
    },
    placeStartElements: function() {
        var element;

        for (var i = 0; i < 6; i++) {
            this.elemArrays.left.forEach(function(elem) {
                elem.y -= CELL_SIZE;
            });

            element = this.pickElement();
            this.placeElement(element, 'left');
        }
        for (var i = 0; i < 6; i++) {
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

        var y = this.game.height + 20;
        var obj = new elem(this.game, x, y + CELL_SIZE);

        this.game.add.existing(obj);

        if(lastElem){
            obj.y = lastElem.y + CELL_SIZE;
            obj.body.velocity.y = lastElem.body.velocity.y;
            obj.body.acceleration.y = lastElem.body.acceleration.y;
        }
        sideArr.push(obj);
    },
    pickElement: function() {
        var elements = [Mine, Fish];
        var n = Math.floor(Math.random() * 2);
        return elements[n];
    },
    throwAway: function(elem, side) {
        var x;

        if (side === 'left') x = -60;
        if (side === 'right') x = this.game.width + 60;

        return this.game.add.tween(elem).to({
            x: x,
            angle: 720
        }, 400, Phaser.Easing.Linear.None, true);
    },
    update: function() {

        var fishes = this.getAllElements();
        this.timer.decrease();
        fishes.forEach(function(elem) {
            if (this.game.isAccelerated && elem.y - 60 < this.hero.y) {
                this.slowDownAll();
            }
        }, this);
    },
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.hero.destroy();
        this.scoreboard.destroy();
    },
    startGame: function() {

        if (!this.hero.alive && !this.gameover) {
            this.timer.start();
            this.placeStartElements();

            // this.hero.body.allowGravity = true;
            this.hero.alive = true;
            this.scoreText.visible = true;

            this.instructionGroup.destroy();
        }
    },
    checkScore: function(pipeGroup) {

       this.score++;
       this.scoreText.setText(this.score.toString());
       PGLowLatencyAudio && PGLowLatencyAudio.play('score');
    },
    deathHandler: function(elem) {

        if (!this.gameover) {
            this.timer.stop();
            this.timer.destroyAll();
            this.hero.loadTexture('explosion', 0);
            this.hero.animations.add('explosion');
            this.hero.animations.play('explosion', 16, 1);

            this.gameover = true;
            this.hero.alive = false;

            if(elem){
                elem.destroy();
            }

            this.getAllElements().forEach(function(elem){
                elem.body.velocity.y = 0;
                elem.body.acceleration.y = 0;
            }, this);

            this.background.autoScroll(0,0);

            this.scoreboard = new Scoreboard(this.game);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score);
        }
    }
};

module.exports = Play;