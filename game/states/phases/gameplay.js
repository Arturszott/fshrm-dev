'use strict';

var _ = require('../../utils');
var config = require('../../config');

var Fish = require('../../prefabs/fish');
var Splash = require('../../prefabs/splash');
var Mine = require('../../prefabs/mine');
var Pumpkin = require('../../prefabs/pumpkin');
var Barrel = require('../../prefabs/barrel');

// subphases
// var handleMusic = require('../subphases/music');

var setupGameplay = function() {
    this.sideAction = function(pointer, e) {
        if (!this.crew.alive || this.gameover || this.game.starting) return;

        var side = pointer.positionDown.x > this.game.width / 2 ? 'right' : 'left';
        var nextElem = this.elemArrays[side][0];

        if (!nextElem.deadly) {
            this.addSplash(nextElem.x, this.CELL_SIZE * 1.6, side);
        }

        this.crew.catch(side, nextElem);
        this.game.audio.tap.play();
        this.timer.increase();
        this.accelerateAll();

        if (nextElem.key === 'barrel') {
            this.addPart();
        }
        if (nextElem.deadly) {
            return this.deathHandler(nextElem);
        } else {
            this.checkScore();
        }

        this.dispose();
        this.refill()
        nextElem.throwAway(side);
    };
    this.accelerateAll = function() {
        if (this.game.isAccelerated) return;
        this.game.isAccelerated = true;
    };
    this.slowDownAll = function() {
        this.game.isAccelerated = false;
    };
    this.placeStartElements = function() {
        var elements = [];

        for (var i = 0; i <= 1 / config.verticalCellSize - 1; i++) {

            this.elemArrays.left.forEach(function(elem) {
                elem.y -= this.CELL_SIZE;
            }.bind(this));
            this.elemArrays.right.forEach(function(elem) {
                elem.y -= this.CELL_SIZE;
            }.bind(this));

            this.placeElementsPair();
        }

        this.getAllElements().forEach(function(elem) {
            elem.y = elem.y + this.game.height;

            this.game.add.tween(elem).to({
                y: elem.y - this.game.height
            }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
                this.game.starting = false;
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
            this.game.audio.over.stop();
            this.game.audio.music.play();

        }.bind(this), 600);
    };
    this.getAllElements = function() {
        return this.elemArrays.left.concat(this.elemArrays.right);
    };
    this.stopAllElements = function() {
        var that = this;

        this.water.autoScroll(0, 0);
        this.background.autoScroll(0, 0);

        this.elemArrays.right.forEach(function(elem) {
            that.game.add.tween(elem)
                .to({
                    x: that.game.width + 100,
                }, 1000, Phaser.Easing.Sinusoidal.Out, true, 300, false)
                .onComplete.add(function() {
                    var t = setTimeout(function() {
                        elem.destroy();
                    }, 10);
                });
        });

        this.elemArrays.left.forEach(function(elem) {
            that.game.add.tween(elem)
                .to({
                    x: -100,
                }, 1000, Phaser.Easing.Sinusoidal.Out, true, 300, false)
                .onComplete.add(function() {
                    var t = setTimeout(function() {
                        elem.destroy();
                    }, 10);
                });
        });
    };
    this.dispose = function() {
        this.elemArrays.left.shift().dispose();
        this.elemArrays.right.shift().dispose();
    };
    this.refill = function() {
        var leftElement, rightElement;

        var elements = [this.pickElement(), this.pickElement()];

        if ((new elements[0](this.game)).harmful && (new elements[1](this.game)).harmful) {
            elements[Math.floor(Math.random() * 2)] = Fish;
        }

        this.placeElement(elements[0], 'left');
        this.placeElement(elements[1], 'right');

        elements.pop();
        elements.pop();
    };
    this.placeElement = function(elem, side) {
        var x;

        var sideArr = this.elemArrays[side];
        var lastElem = sideArr[sideArr.length - 1];

        if (side === 'left') x = this.LEFT_POSITION;
        if (side === 'right') x = this.RIGHT_POSITION;

        var y = this.game.height;
        var obj = new elem(this.game, x, y + this.CELL_SIZE);

        if (obj.underwater) {
            this.fishLayer.addChild(obj);
        } else {
            this.mineLayer.addChild(obj);
        }

        if (lastElem) {
            obj.y = lastElem.y + this.CELL_SIZE;
        }

        sideArr.push(obj);
        obj = null;
        lastElem = null;
    };
    this.pickElement = function() {
        var elements = [Mine, Fish];
        var n = Math.floor(Math.random() * 2);

        if (elements[n] === Mine) {
            if (this.score > config.pumpkinScore && Math.random() < config.pumpkinChance) {
                return Pumpkin;
            }
        }

        if (this.itemPart && this.score > this.itemPart.score && !this.itemPart.rolledOut) {
            this.itemPart.rolledOut = true;
            return Barrel
        }
        return elements[n];
    };
    this.placeElementsPair = function() {
        var elements = [];
        elements.push(this.pickElement());
        elements.push(this.pickElement());

        if (elements[0] === Mine && elements[1] === Mine) {
            elements[Math.floor(Math.random() * 2)] = Fish;
        }

        this.placeElement(elements[0], 'left');
        this.placeElement(elements[1], 'right');
        elements = null;
    };
    this.addSplash = function(x, y, side) {
        this.mineLayer.addChild(new Splash(this.game, x, y, 0));
    };
}

module.exports = setupGameplay