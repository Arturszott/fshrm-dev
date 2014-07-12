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
        this.load.image('getReady', 'assets/get-ready.png');

        // bay
        this.load.spritesheet('building_house', 'assets/bay/b_home.png', 164, 164, 4);
        this.load.spritesheet('building_garage', 'assets/bay/b_garage.png', 128, 164, 4);
        this.load.spritesheet('building_shop', 'assets/bay/b_shop.png', 156, 156, 4);

        this.load.spritesheet('fishcoin', 'assets/icons/fishcoin.png', 38, 18, 1);

        this.load.spritesheet('building_label_house', 'assets/bay/l_home.png', 108, 64, 1);
        this.load.spritesheet('building_label_garage', 'assets/bay/l_garage.png', 136, 72, 1);
        this.load.spritesheet('building_label_shop', 'assets/bay/l_shop.png', 92, 64, 1);

        this.load.spritesheet('buy-btn', 'assets/icons/buy.png', 76, 60, 2);
        this.load.spritesheet('shop-item-bg', 'assets/icons/checkedbg2.png', 120, 168, 8);
        this.load.spritesheet('shop-all-sold', 'assets/icons/items-sold.png', 120, 168, 2);

        this.load.image('board', 'assets/menu-shorter.png');
        this.load.image('long-board', 'assets/menu.png');
        this.load.image('money-board', 'assets/icons/SHOPboard.png');

        this.load.image('category-label-hero', 'assets/icons/SHOPcharacter.png');
        this.load.image('category-label-tool', 'assets/icons/SHOPtool.png');
        this.load.image('category-label-mount', 'assets/icons/SHOPboat.png');
        this.load.image('category-label-postcard', 'assets/icons/SHOPpostcard.png');

        this.load.image('arr-left', 'assets/icons/L.png');
        this.load.image('arr-right', 'assets/icons/R.png');


        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('shop-sign', 'assets/shop.png');
        // this.load.image('gameover', 'assets/gameover2.png');

        this.load.bitmapFont('fisherman', 'assets/fonts/fisherman.png', 'assets/fonts/fisherman.fnt');
        this.load.bitmapFont('brown', 'assets/fonts/brown/brown.png', 'assets/fonts/brown/brown.fnt');

        // @key, @src, @frame x, @frame y, @number of frames
        this.load.spritesheet('fish', 'assets/fish1.png', 100, 144, 4);

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
                that.game.state.start('play');
            }, 10);
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preload;