'use strict';

var config = require('../config');
var storage = require('../storage');
var parts = require('../parts');

var Intro = require('../intro');

var Bay = require('../bay');

var Crew = require('../prefabs/crew');
var Fish = require('../prefabs/fish');
var Mine = require('../prefabs/mine');
var Barrel = require('../prefabs/barrel');
var Timer = require('../prefabs/timer');
var Scoreboard = require('../prefabs/scoreboard');

var _ = require('../utils');

var CELL_SIZE = 0;
var LEFT_POSITION = 0;
var RIGHT_POSITION = 0;

function Play() {};

Play.prototype = {
    elemArrays: {
        left: [],
        right: []
    },
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 0;

        // almost constant, aye?
        CELL_SIZE = this.game.height * config.verticalCellSize;
        LEFT_POSITION = this.game.width / 6;
        RIGHT_POSITION = this.game.width / 6 * 5;

        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bottom');
        this.water = this.game.add.tileSprite(0, 0, this.game.width + 100, this.game.height, 'waterlayer');

        this.game.background = this.background;
        this.game.water = this.water;
        this.game.CELL_SIZE = CELL_SIZE;
        this.game.bayReturn = this.bayReturn;

        this.setInput();
        this.showInstructions();

        // FUCKING IMPORTANT FUNCTION
        this.refreshGame();

        if (!storage.isIntroPlayed()) {
            setTimeout(function() {}.bind(this), 600);
            this.playIntro()
            // this.startGame();
        } else {
            this.game.input.onDown.addOnce(this.startGame, this);
        }

        // this.startGame();
    },
    refreshGame: function(isFromBay) {

        this.game.level = 1;
        this.itemPart = parts.randomizeItem();

        // we will hold there fish & mines
        this.elemArrays.left = [];
        this.elemArrays.right = [];

        this.createScoreBox();

        this.water.autoScroll(0, config.baseWaterSpeed);
        this.background.autoScroll(0, config.baseBottomSpeed);

        this.timer = new Timer(this.game, config.GAME_TIME, this.summonMonster.bind(this));
        this.crew = new Crew(this.game, this.game.width / 2, -CELL_SIZE * 2, 1);
        this.game.add.existing(this.crew);

        // other functions eq. update depend on this
        this.gameover = false;
        this.starting = true

        this.slideDownCrew();

        if (isFromBay) {
            setTimeout(this.startGame.bind(this), 600);
        }
    },
    playIntro: function() {
        this.intro = new Intro(this.game, this);

        console.log(this.intro);
        console.log('playing intro!');
        this.intro.playStep();
    },
    bayReturn: function() {
        this.refreshGame(true);
    },
    setInput: function() {
        this.game.input.onDown.add(this.sideAction, this);
    },
    createScoreBox: function() {
        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width / 2, this.game.height + 100, 'fisherman', this.score.toString(), 24);
        this.scoreText.updateTransform();
        this.scoreText.position.x = (this.game.width - this.scoreText.textWidth) / 2;
        this.scoreText.visible = false;
    },
    showInstructions: function() {
        // this.readySign = this.game.add.sprite(RIGHT_POSITION, 60, 'getReady');
        // _.scale(this.readySign, 0.8);
        this.instructionGroup = this.game.add.group();
        // this.instructionGroup.add(this.readySign);
        // // this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 325, 'instructions'));
        // this.instructionGroup.setAll('anchor.x', 0.5);
        // this.instructionGroup.setAll('anchor.y', 0.5);
    },
    addSplash: function(x, y, side) {
        this.splash = this.game.add.sprite(x, y, 'water-splash', 0);
        this.splash.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enableBody(this.splash);
        var splashAnim = this.splash.animations.add('splashing');
        this.splash.animations.play('splashing', 12, 1);

        if (this.elemArrays[side][1].key === 'mine') this.game.world.bringToTop(this.elemArrays[side][1]);

        splashAnim.onComplete.add(function() {
            var that = this;
            this.visibile = false;
            setTimeout(function() {
                that.destroy();
            }, 10);
        }, this.splash);
    },
    addPart: function() {
        storage.addPart(this.itemPart.item.id);
    },
    sideAction: function(pointer, e) {
        if (!this.crew.alive || this.gameover || this.starting) return;

        var side = pointer.positionDown.x > this.game.width / 2 ? 'right' : 'left';
        var nextElem = this.elemArrays[side][0];

        if (nextElem.key === 'fish') {
            this.addSplash(nextElem.x, CELL_SIZE * 1.6, side);
        }

        nextElem.bringToTop();

        this.crew.catch(side, nextElem);
        this.timer.increase();
        this.accelerateAll();

        if (nextElem.key === 'mine') {
            return this.deathHandler(nextElem);
        } else if (nextElem.key === 'barrel') {
            this.addPart();
        } else {
            this.checkScore();
        }

        this.dispose();
        this.refill()
        nextElem.throwAway(side);
    },
    accelerateAll: function() {
        if (this.game.isAccelerated) return;

        this.background.autoScroll(0, config.bottomAccelerationSpeed);
        this.water.autoScroll(0, config.waterAccelerationSpeed);

        this.getAllElements().forEach(function(elem) {
            elem.body.velocity.y = config.accelerationSpeed;
        });

        if (this.splash) {
            this.splash.body.velocity.y = -250;
        }

        this.game.isAccelerated = true;
    },
    slowDownAll: function() {
        this.background.autoScroll(0, config.baseBottomSpeed);
        this.water.autoScroll(0, config.baseBottomSpeed);
        this.getAllElements().forEach(function(elem) {
            elem.body.velocity.y = config.baseElementSpeed;
        });
        this.game.isAccelerated = false;
    },
    placeStartElements: function() {
        var elements = [];

        for (var i = 0; i <= 1 / config.verticalCellSize - 1; i++) {

            this.elemArrays.left.forEach(function(elem) {
                elem.y -= CELL_SIZE;
            });
            this.elemArrays.right.forEach(function(elem) {
                elem.y -= CELL_SIZE;
            });

            this.placeElementsPair();

        }

        this.getAllElements().forEach(function(elem) {
            elem.y = elem.y + this.game.height;
            elem.body.velocity.y = 0;

            this.game.add.tween(elem).to({
                y: elem.y - this.game.height
            }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
                elem.body.velocity.y = config.baseElementSpeed;
                this.starting = false;
            }.bind(this));
        }, this);

        this.game.add.tween(this.scoreText)
            .to({
                y: this.game.height * 2 / 3 + -30
            }, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false)
            .to({
                y: this.game.height * 2 / 3
            }, 200, Phaser.Easing.Sinusoidal.Out, true, 0, false);


        setTimeout(function() {
            this.timer.start();
        }.bind(this), 600);
    },
    getAllElements: function() {
        return this.elemArrays.left.concat(this.elemArrays.right);
    },
    stopAllElements: function() {
        var that = this;

        this.water.autoScroll(0, 0);
        this.background.autoScroll(0, 0);

        this.elemArrays.right.forEach(function(elem) {
            elem.body.velocity.y = 0;
            elem.body.acceleration.y = 0;

            that.game.add.tween(elem).to({
                x: that.game.width + 100,
            }, 1000, Phaser.Easing.Sinusoidal.Out, true, 300, false).onComplete.add(function() {
                setTimeout(function() {
                    elem.destroy();
                }, 10);
            });
        });

        this.elemArrays.left.forEach(function(elem) {
            elem.body.velocity.y = 0;
            elem.body.acceleration.y = 0;

            that.game.add.tween(elem).to({
                x: -100,
            }, 1000, Phaser.Easing.Sinusoidal.Out, true, 300, false).onComplete.add(function() {
                setTimeout(function() {
                    elem.destroy();
                }, 10);
            });
        });


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
        var elements = [Mine, Fish];
        var n = Math.floor(Math.random() * 2);

        if (this.itemPart && this.score > this.itemPart.score && !this.itemPart.rolledOut) {
            this.itemPart.rolledOut = true;
            return Barrel
        }
        return elements[n];
    },
    placeElementsPair: function() {
        var elements = [];
        elements.push(this.pickElement());
        elements.push(this.pickElement());

        if (elements[0] === Mine && elements[1] === Mine) {
            elements[Math.floor(Math.random() * 2)] = Fish;
        }

        this.placeElement(elements[0], 'left');
        this.placeElement(elements[1], 'right');
    },
    update: function() {
        if (!this.gameover) {
            this.timer.decrease();

            this.getAllElements().forEach(function(elem) {
                if (this.game.isAccelerated && elem.y < CELL_SIZE * 2) {
                    this.slowDownAll();
                }
            }, this);
        }
    },
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.crew.destroy();
        this.scoreboard.destroy();
    },
    slideDownCrew: function() {
        this.game.add.tween(this.crew).to({
            y: this.game.height / 2 - CELL_SIZE / 3 * 2
        }, 500, Phaser.Easing.Linear.None, true, 100, false).onComplete.add(function() {

        }.bind(this));
    },
    startGame: function() {
        if (!this.crew.alive && !this.gameover) {

            this.placeStartElements();
            this.crew.alive = true;
            this.scoreText.visible = true;

            this.instructionGroup.destroy();
        }
    },
    checkScore: function() {
        this.score++;

        if (Math.floor(this.score / 15) == this.game.level) {
            this.game.level++;
        }
        this.scoreText.setText(this.score.toString());
        this.scoreText.position.x = (this.game.width - this.scoreText.textWidth) / 2;
        PGLowLatencyAudio && PGLowLatencyAudio.play('score');
    },
    showScoreboard: function() {
        var that = this;

        this.game.bay = new Bay(this.game);
        this.game.bay.baseState = this;

        that.scoreboard = new Scoreboard(that.game);
        that.game.add.existing(that.scoreboard);
        that.scoreboard.show(that.score);
    },
    randomMonster: function(location) {
        // mocked one
        var monstersNumber = 2
        return 'monster_' + Math.floor(Math.random() * monstersNumber);
    },
    randomSplash: function(location) {
        // mocked one
        var splashNumber = 3
        return 'splash_' + Math.floor(Math.random() * splashNumber);
    },
    summonMonster: function() {
        if (!this.gameover) {
            this.gameover = true;

            this.game.add.tween(this.scoreText).to({
                y: this.game.height + 100
            }, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
                this.scoreText.destroy();
            }.bind(this));

            this.monsterSprite = this.game.add.sprite(this.game.width / 2, -CELL_SIZE * 2, this.randomMonster());
            this.monsterSprite.anchor.setTo(0.5, 0.5);

            var monsterAnim = this.monsterSprite.animations.add('monstering');
            this.monsterSprite.animations.play('monstering', 10, true);

            this.game.monster = this.monsterSprite;

            setTimeout(function() {
                var splashSprite = this.game.add.sprite(this.game.width / 2, CELL_SIZE / 3 * 2 + 30, this.randomSplash());
                splashSprite.anchor.setTo(0.5, 0.5);

                var splashAnim = splashSprite.animations.add('monstering');
                splashAnim.killOnComplete = true;
                splashSprite.animations.play('monstering', 10, 0);

                this.crew.destroy();
            }.bind(this), 150);

            this.stopAllElements();

            this.game.add.tween(this.monsterSprite).to({
                y: CELL_SIZE / 3 * 2
            }, 150, Phaser.Easing.Linear.None, true, 100, false).onComplete.add(function() {

            }.bind(this));

            setTimeout(function() {
                this.showScoreboard();
            }.bind(this), 1000);
        }
    },
    deathHandler: function(elem) {

        if (!this.gameover) {
            this.slowDownAll();

            this.timer.stop();
            this.timer.destroyAll();
            this.scoreText.destroy();

            this.crew.destroy();

            var boomSprite = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'boom');
            boomSprite.anchor.setTo(0.5, 0.5);

            boomSprite.scale.x = this.game.width / 288;
            boomSprite.scale.y = this.game.width / 288;
            this.game.physics.arcade.enableBody(boomSprite);

            var boomAnim = boomSprite.animations.add('splashing');

            boomSprite.animations.play('splashing', 16, 0);

            this.getAllElements().forEach(function(elem) {
                elem.visible = false;
            });

            boomAnim.onComplete.add(function() {}, this);

            this.showScoreboard();

            this.gameover = true;
        }
    }
};

module.exports = Play;