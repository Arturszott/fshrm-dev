'use strict';

function Preload() {
    this.asset = null;
    this.ready = false;
}

var itemsRegistry = require('../itemsRegistry');

function preloadRegistry(c) {
    itemsRegistry.getItems().forEach(function(item) {
        c.load.spritesheet(item.name, 'assets/items/' + item.type + '/' + item.name + '.png', item.x, item.y, item.frame);
    }, c);
}

Preload.prototype = {
    preload: function() {

        this.asset = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);

        this.load.setPreloadSprite(this.asset);
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

        this.add.sprite((this.game.width - 288) / 2, 0, 'splash');

        preloadRegistry(this);

        this.load.image('background', 'assets/water.png');
        this.load.image('bottom', 'assets/bottom.png');
        this.load.image('waterlayer', 'assets/sea.png');
        this.load.image('timer', 'assets/timer.png');
        this.load.image('timebar', 'assets/time.png');

        this.load.image('title', 'assets/logo.png');

        // BUTTONS
        this.load.image('playBtn', 'assets/btn_play.png');
        this.load.image('homeBtn', 'assets/btn_home.png');
        this.load.image('rankBtn', 'assets/btn_rank.png');

        // others
        this.load.image('compassButton', 'assets/compassbtn.png');
        this.load.image('instructions', 'assets/instructiondarks.png');
        this.load.image('getReady', 'assets/get-ready.png');

        // bay
        this.load.spritesheet('building_shop', 'assets/shop2.png', 100, 100, 1);
        this.load.spritesheet('building_parts', 'assets/parts.png', 100, 100, 1);
        this.load.spritesheet('building_house', 'assets/house.png', 100, 100, 1);

        this.load.image('board', 'assets/menu-shorter.png');
        this.load.image('gameover', 'assets/gameover.png');
        // this.load.image('gameover', 'assets/gameover2.png');

        this.load.bitmapFont('fisherman', 'assets/fonts/fisherman.png', 'assets/fonts/fisherman.fnt');

        // @key, @src, @frame x, @frame y, @number of frames
        this.load.spritesheet('fish', 'assets/fish1.png', 100, 144, 4);

        this.load.spritesheet('skull', 'assets/skull.png', 56, 68, 1);

        this.load.spritesheet('water-wave', 'assets/water-wave.png', 144, 380, 4);
        this.load.spritesheet('water-splash', 'assets/water-splash.png', 72, 100, 6);

        this.load.spritesheet('mine', 'assets/BOMB.png', 112, 132, 5);
        this.load.spritesheet('explosion', 'assets/explosion.png', 64, 62, 16);
        this.load.spritesheet('boom', 'assets/boom.png', 288, 555, 11);

        if (!!PGLowLatencyAudio) {
            PGLowLatencyAudio.preloadFX('flap', 'assets/flap.wav');
            PGLowLatencyAudio.preloadFX('score', 'assets/score.wav');
            PGLowLatencyAudio.preloadFX('pipe-hit', 'assets/pipe-hit.wav');
            PGLowLatencyAudio.preloadFX('ground-hit', 'assets/ground-hit.wav');
        }
    },
    create: function() {


    },
    update: function() {
        var that = this;
        if (!!this.ready) {
            this.ready = false;
            setTimeout(function() {
                that.game.state.start('menu');
            }, 10);
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preload;