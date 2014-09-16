'use strict';

var config = require('../config');
var storage = require('../storage');
var ads = require('../ads');
    ads.init();


var itemsRegistry = require('../itemsRegistry');
var parts = require('../parts');
var Intro = require('../intro');

var Bay = require('../bay');

var Crew = require('../prefabs/crew');
var Fish = require('../prefabs/fish');
var Splash = require('../prefabs/splash');
var Bottom = require('../prefabs/bottom');
var Water = require('../prefabs/water');
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
    render: function() {
        if (this.game.slowTriggered) {
            this.game.slowTriggered = false;
            this.game.isAccelerated = false;
        }
    },
    create: function() {

        this.game.onPause.add(function() {
            this.game.wasPaused = true;
        }, this);

        this.game.audio = {};
        this.game.audio.music = this.game.add.audio('main', 1, true);
        this.game.audio.bay = this.game.add.audio('bay', 1, true);
        this.game.audio.over = this.game.add.audio('gameover', 1);
        

        this.game.audio.explosion = this.game.add.audio('explosion', 1);
        this.game.audio.monster = this.game.add.audio('monster', 1);
        this.game.audio.start = this.game.add.audio('start', 1);
        this.game.audio.tap = this.game.add.audio('tap', 1);

        this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'boom');
        this.background = new Bottom(this.game, 0, 0, 'bottom');
        this.water = new Water(this.game, 0, 0, 'water');


        this.boomSprite = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'boom');
        this.boomSprite.anchor.setTo(0.5, 0.5);
        this.boomSprite.scale.x = this.game.width / 144;
        this.boomSprite.scale.y = this.game.width / 144;
        this.boomSprite.visible = false;
        this.boomSprite.animations.add('splashing');

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 0;

        CELL_SIZE = this.game.height * config.verticalCellSize;
        LEFT_POSITION = this.game.width / 6;
        RIGHT_POSITION = this.game.width / 6 * 5;

        this.game.background = this.background;
        this.game.water = this.water;
        this.game.CELL_SIZE = CELL_SIZE;
        this.game.bayReturn = this.bayReturn;

        this.setInput();

        // FUCKING IMPORTANT FUNCTION
        this.refreshGame();

        // if (!storage.isIntroPlayed()) {
        if (false) {
            // setTimeout(function() {}.bind(this), 600);
            this.playIntro()
            // this.startGame();
        }
    },
    destroyLayers: function() {
        this.fishLayer && this.fishLayer.destroy(true);
        this.mineLayer && this.mineLayer.destroy(true);
    },
    refreshGame: function() {

        this.destroyLayers();
        this.game.add.existing(this.background);

        this.fishLayer = this.game.add.group();
        this.game.add.existing(this.water);
        this.mineLayer = this.game.add.group();

        this.itemPart = parts.randomizeItem();

        this.elemArrays.left = [];
        this.elemArrays.right = [];

        this.createScoreBox();
        this.game.level = 1;


        // muteButton // -----------------------------------------------------------

        this.muteButton = this.game.add.button(this.game.width, -100, 'soundBtn', this.muteAll, this, 0, 0, 0, 0);
        this.muteButton.anchor.setTo(1, 0);
        _.scale(this.muteButton, 0.5);

        this.muteButton.show = function(){
            this.game.add.tween(this.muteButton).to({
                y: 4
            }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
        }.bind(this);

        this.muteButton.hide = function(){
            this.game.add.tween(this.muteButton).to({
                y: -100
            }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
        }.bind(this);

        this.game.muteButton = this.muteButton;

        // muteButton END // --------------------------------------------------------

        this.timer = new Timer(this.game, config.GAME_TIME, this.summonMonster.bind(this));
        this.crew = new Crew(this.game, this.game.width / 2, -CELL_SIZE * 2, 1);
        this.game.add.existing(this.crew);

        // other functions eq. update depend on this
        this.gameover = false;
        this.starting = true

        this.white = this.game.add.sprite(0, 0, 'introlayer');
        this.white.height = this.game.height;
        this.white.width = this.game.width;

        this.game.add.tween(this.white).to({
            alpha: 0
        }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false);

        this.slideDownCrew();

        if (this.game.startInstant) {
            if (this.game.bay) {
                this.game.bay.destroy();
            }
            setTimeout(this.startGame.bind(this), 600);
        } else {
            this.game.startInstant = true;
            this.slideUpTitle();
            this.checkSound();
            this.startInput = this.game.input.onDown.add(this.startGame, this);
        }

        ads.show();
    },
    playIntro: function() {
        this.intro = new Intro(this.game, this);
        this.intro.playStep();
    },
    bayReturn: function() {
        // this.refreshGame(true);
        this.game.state.start('play');
    },
    setInput: function() {
        this.game.input.onDown.add(this.sideAction, this);
    },
    createScoreBox: function() {
        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width / 2, this.game.height + 100, 'fisherman', this.score.toString(), 24);
        this.game.stage.addChild(this.scoreText);
        this.scoreText.updateTransform();
        this.scoreText.position.x = (this.game.width - this.scoreText.textWidth) / 2;
        this.scoreText.visible = false;
    },
    addSplash: function(x, y, side) {
        this.mineLayer.addChild(new Splash(this.game, x, y, 0));
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

        this.crew.catch(side, nextElem);
        this.game.audio.tap.play();
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
        this.game.isAccelerated = true;
    },
    slowDownAll: function() {
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

            this.game.add.tween(elem).to({
                y: elem.y - this.game.height
            }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
                this.starting = false;
            }.bind(this));
        }, this);

        var t1 = {
            y: this.game.height * 2 / 3 + -30
        }
        var t2 = {
            y: this.game.height * 2 / 3
        }
        this.game.add.tween(this.scoreText)
            .to(t1, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false)
            .to(t2, 200, Phaser.Easing.Sinusoidal.Out, true, 0, false);

        setTimeout(function() {
            this.timer.start();
            this.game.audio.music.play('', 0, 1, true);

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
            that.game.add.tween(elem).to({
                x: that.game.width + 100,
            }, 1000, Phaser.Easing.Sinusoidal.Out, true, 300, false).onComplete.add(function() {
                var t = setTimeout(function() {
                    elem.destroy();
                }, 10);
            });
        });

        this.elemArrays.left.forEach(function(elem) {
            that.game.add.tween(elem).to({
                x: -100,
            }, 1000, Phaser.Easing.Sinusoidal.Out, true, 300, false).onComplete.add(function() {
                var t = setTimeout(function() {
                    elem.destroy();
                }, 10);
            });
        });
    },
    dispose: function() {
        this.elemArrays.left.shift().dispose();
        this.elemArrays.right.shift().dispose();
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
        element = null;
    },
    placeElement: function(elem, side) {
        var x;

        var sideArr = this.elemArrays[side];
        var lastElem = sideArr[sideArr.length - 1];

        if (side === 'left') x = LEFT_POSITION;
        if (side === 'right') x = RIGHT_POSITION;

        var y = this.game.height;
        var obj = new elem(this.game, x, y + CELL_SIZE);

        if (obj.key === 'fish') {
            this.fishLayer.addChild(obj);
        } else {
            this.mineLayer.addChild(obj);
        }

        if (lastElem) {
            obj.y = lastElem.y + CELL_SIZE;
        }

        sideArr.push(obj);
        obj = null;
        lastElem = null;
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
        elements = null;
    },
    update: function() {
        if (this.game.audio.music._sound) {
            this.game.audio.music._sound.playbackRate.value = 1 + 0.05 * (this.game.level / 2);
        };
        var now = new Date().getTime();

        if (this.then && !this.game.wasPaused) {
            this.game.multiplier = (now - this.then) * 60 / 1000;
        } else {
            this.game.wasPaused = false;
            this.game.multiplier = 1;
        }

        if (!this.gameover) {
            this.timer.decrease();
        }
        this.then = now;
    },
    shutdown: function() {
        this.elemArrays = {};

        this.game.audio.music.stop();
        this.crew.destroy();
        this.scoreboard && this.scoreboard.destroy();
        this.game.bay && this.game.bay.destroy();
        this.game.audio.bay.stop();
        this.game.bay = null;
    },
    slideDownCrew: function() {
        this.game.add.tween(this.crew).to({
            y: this.game.height / 2 - CELL_SIZE / 3 * 2
        }, 500, Phaser.Easing.Linear.None, true, 100, false).onComplete.add(function() {

        }.bind(this));
    },
    slideUpTitle: function() {
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
        this.tapRight = this.game.add.sprite(this.game.width *2 + 10, 100, 'tap-left');

        _.anchorC(this.tapRight);
        _.anchorC(this.tapLeft);

        var finalLeft = 50;
        var finalRight = this.game.width - 50;

        this.muteButton.show();

        this.tapRight.tween = this.game.add.tween(this.tapRight).to({
            x: finalRight
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100).to({
            x: finalRight - 10
        }, 200, Phaser.Easing.Sinusoidal.Out, true, 0, 4, true);

        this.tapLeft.tween = this.game.add.tween(this.tapLeft).to({
            x: finalLeft
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100).to({
            x: finalLeft + 10
        }, 200, Phaser.Easing.Sinusoidal.Out, true, 0, 4, true);


        this.game.add.tween(this.title).to({
            y: this.game.height * 3 / 4 - 70 - 100
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
        this.game.add.tween(this.stitle1).to({
            y: this.game.height * 3 / 4 - 10 - 100
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
        this.game.add.tween(this.stitle2).to({
            y: this.game.height * 3 / 4 + 25 - 100
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);

        var buttonsY = this.game.height + 60;

        this.bayButton = this.game.add.button(this.game.width / 2 - 6, buttonsY + 100, 'homeBtn', this.bayTravel, this, 0, 0, 1, 0);
        this.bayButton.anchor.setTo(0.5, 0.5);



        this.startButton = this.game.add.sprite(this.bayButton.x - this.bayButton.width - 10, buttonsY + 200, 'btn_rate');
        this.startButton.anchor.setTo(0.5, 0.5);
        this.startButton.inputEnabled = true;
        this.startButton.animations.add('wavin');
        this.startButton.animations.play('wavin', 5, true);
        this.startButton.events.onInputDown.add(this.rateClick, this);

        this.rankButton = this.game.add.button(this.bayButton.x + this.bayButton.width + 10, buttonsY + 300, 'rankBtn', this.showRanks, this, 0, 0, 1, 0);
        this.rankButton.anchor.setTo(0.5, 0.5);

        this.game.add.tween(this.bayButton).to({
            y: buttonsY - 120
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);

        this.game.add.tween(this.startButton).to({
            y: buttonsY - 120
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
        this.game.add.tween(this.rankButton).to({
            y: buttonsY - 120
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
    },
    rateClick: function() {
        window.rateApp && window.rateApp();
    },
    showRanks: function() {
        if (!socialService.isLoggedIn()) {
            socialService.login(function(loggedIn, error) {
                if (error) {
                    console.error("login error: " + error.message + " " + error.code);
                }
                else if (loggedIn) {
                    console.log("login suceeded");
                }
                else {
                    console.log("login cancelled");
                }
            });
        }
        socialService && socialService.showLeaderboard(function(error) {
            if (error)
                console.error("showLeaderbord error: " + error.message);
        });
    },
    checkSound: function(){
        var isMuted = storage.getMuted();

        if(isMuted){
            this.game.sound.mute = true;
            this.muteButton.setFrames(1, 1, 1);
        } else {
            this.game.sound.mute = false;
            this.muteButton.setFrames(0, 0, 0);
        }
    },
    muteAll: function() {
        if (this.game.sound.mute) {
            this.muteButton.setFrames(0, 0, 0);
            this.game.sound.mute = false;
            storage.mute(false);
        } else {
            this.muteButton.setFrames(1, 1, 1);
            this.game.sound.mute = true;
            storage.mute(true);
        }
    },
    bayTravel: function() {
        this.slideDownTitle();
        this.game.add.tween(this.muteButton).to({
            y: -100
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);

        this.startInput.detach();
        this.game.add.tween(this.crew).to({
            y: this.game.height * 2
        }, 600, Phaser.Easing.Linear.None, true, 0, false).onComplete.add(function() {
            this.crew.destroy();
        }.bind(this));
        this.game.bay = new Bay(this.game);
        this.game.bay.baseState = this;
        this.game.bay.travel();
        storage.addStat('bay-visits', 1);
        
    },
    slideDownTitle: function() {
        var buttonsY = this.game.height + 60;


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
        this.game.add.tween(this.startButton).to({
            y: buttonsY + 120
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
        this.game.add.tween(this.rankButton).to({
            y: buttonsY + 120
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
        this.game.add.tween(this.muteButton).to({
            y: -100
        }, 500, Phaser.Easing.Sinusoidal.Out, true, 100, false);
    },
    startGame: function(pointer) {
        storage.addStat('games', 1);

        // TERRIBLE HACK, SHOULD BE MORE DYNAMIC
        if (pointer && (pointer.positionDown.y > this.game.height * 3 / 4) || (pointer && pointer.positionDown.y < this.muteButton.height)) {

        } else {
            this.startInput.detach();
            if (!this.crew.alive && !this.gameover) {
                this.game.audio.start.play();
                this.slideDownTitle();
                this.placeStartElements();
                this.crew.alive = true;
                this.scoreText.visible = true;
            }
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
        this.game.bay = new Bay(this.game);
        this.game.bay.baseState = this;

        this.muteButton.show();

        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
        this.scoreboard.showRanks = this.showRanks;
        socialService && socialService.submitScore(this.score);
    },
    randomMonster: function(location) {
        // mocked one
        var monstersNumber = 4
        return 'monster_' + Math.floor(Math.random() * monstersNumber);
    },
    randomSplash: function(location) {
        // mocked one
        var splashNumber = 3
        return 'splash_' + Math.floor(Math.random() * splashNumber);
    },
    summonMonster: function() {
        if (!this.gameover) {
            storage.addStat('summoned-monsters', 1);
            this.gameover = true;
            this.game.audio.monster.play();
            this.game.audio.music.stop();
            this.game.add.tween(this.scoreText).to({
                y: this.game.height + 100
            }, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
                this.scoreText.destroy();
            }.bind(this));

            this.monsterSprite = this.game.add.sprite(this.game.width / 2, -CELL_SIZE * 2, this.randomMonster());
            this.monsterSprite.scale.x = 0.8;
            this.monsterSprite.scale.y = 0.8;
            this.monsterSprite.anchor.setTo(0.5, 0.5);


            var monsterAnim = this.monsterSprite.animations.add('monstering');
            this.monsterSprite.animations.play('monstering', 10, true);

            this.game.monster = this.monsterSprite;

            setTimeout(function() {
                var splashSprite = this.game.add.sprite(this.game.width / 2, CELL_SIZE / 3 * 2 + 30, this.randomSplash());
                this.game.add.existing(splashSprite);
                splashSprite.anchor.setTo(0.5, 0.5);

                var splashAnim = splashSprite.animations.add('monstering');
                splashAnim.killOnComplete = true;
                splashSprite.animations.play('monstering', 4, 0);

                this.crew.destroy();
            }.bind(this), 150);

            this.stopAllElements();

            this.game.add.tween(this.monsterSprite).to({
                y: CELL_SIZE
            }, 150, Phaser.Easing.Linear.None, true, 100, false).onComplete.add(function() {

            }.bind(this));

            setTimeout(function() {
                this.showScoreboard();
                this.game.audio.over.play();
            }.bind(this), 1200);
        }
    },
    deathHandler: function(elem) {

        if (!this.gameover) {
            storage.addStat('explosions', 1);
            this.slowDownAll();
            this.game.audio.music.stop();
            this.game.audio.over.play();
            this.game.audio.over._sound.playbackRate.value = 1.2;

            this.timer.stop();
            this.timer.destroyAll();
            this.scoreText.destroy();
            this.crew.destroy();

            this.boomSprite.visible = true;
            this.game.world.bringToTop(this.boomSprite);
            this.boomSprite.animations.play('splashing', 16, 0).onComplete.add(function() {
                this.boomSprite.visible = false;
            }.bind(this));
            this.game.audio.explosion.play('', 0, 1, false);

            // NUKE FUNCTION
            this.destroyLayers();

            this.showScoreboard();

            this.gameover = true;
        }
    }
};

module.exports = Play;