'use strict';

function Preload() {
    this.asset = null;
    this.ready = false;
}

var itemsRegistry = require('../itemsRegistry');

function preloadRegistry(c) {
    itemsRegistry.getItems().forEach(function(item) {
        c.load.spritesheet(item.name, 'assets/items/' + item.type + '/' + item.name + '.png', item.x, item.y, item.frame);
        if (item.craftable) {
            c.load.spritesheet(item.name + '_craft', 'assets/items/crafts/' + item.type + '/' + item.name + '.png', item.cx, item.cy, item.parts + 1);
        }
    }, c);
}

Preload.prototype = {
    preload: function() {
        this.game.time.advancedTiming = true;
        window.game = this.game;
        this.asset = this.add.sprite(this.game.width / 2, this.game.height / 2, 'splash');
        // this.loader = this.add.sprite(this.game.width / 2, 40, 'preloader');
        // this.loader.position.x = this.loader.position.x - this.asset.width / 2 + 10; 
        this.asset.scale.x = this.game.width / this.asset.width;
        this.asset.scale.y = this.game.height / this.asset.height;
        this.asset.anchor.setTo(0.5, 0.5);
        // this.loader.anchor.setTo(0.5, 0.5);
        this.load.crossOrigin = "Anonymous";

        // this.load.setPreloadSprite(this.loader);
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

        preloadRegistry(this);

        this.load.image('bottom', 'assets/tileBottom.png');
        this.load.image('water', 'assets/tileWater.png');
        this.load.image('introlayer', 'assets/play/introtile.png');
        this.load.image('waterlayer', 'assets/play/sea.png');
        this.load.image('white', 'assets/play/white.png');
        this.load.image('timer', 'assets/play/timer.png');
        this.load.image('timebar', 'assets/play/time.png');

        this.load.image('title', 'assets/title/title.png');
        this.load.image('stitle1', 'assets/title/stitle1.png');
        this.load.image('stitle2', 'assets/title/stitle2.png');

        // BUTTONS
        this.load.spritesheet('hackBtn', 'assets/icons/btn_home.png', 80, 68, 2);
        this.load.spritesheet('playBtn', 'assets/icons/btn_play.png', 80, 68, 2);
        this.load.spritesheet('homeBtn', 'assets/icons/btn_home2.png', 80, 68, 2);
        this.load.spritesheet('rankBtn', 'assets/icons/btn_rank.png', 80, 68, 2);

        this.load.spritesheet('soundBtn', 'assets/icons/btn_sound.png', 104, 96, 2);

        this.load.spritesheet('lassoFull', 'assets/items/tool/lassofull.png', 128, 120, 12);

        // others
        this.load.image('getReady', 'assets/icons/getready.png');
        this.load.image('howto', 'assets/icons/howto.png');
        this.load.image('dead', 'assets/icons/dead.png');
        this.load.image('heart', 'assets/icons/heart.png');
        this.load.image('tap-left', 'assets/icons/tapL.png');
        this.load.image('tap-right', 'assets/icons/tapR.png');

        // bay
        this.load.spritesheet('building_house', 'assets/bay/b_home.png', 164, 164, 4);
        this.load.spritesheet('building_garage', 'assets/bay/b_garage.png', 128, 164, 4);
        this.load.spritesheet('building_shop', 'assets/bay/b_shop.png', 156, 156, 4);

        this.load.spritesheet('fishcoin', 'assets/icons/fishcoin.png', 38, 18, 1);

        this.load.spritesheet('building_label_house', 'assets/bay/l_home.png', 108, 64, 1);
        this.load.spritesheet('building_label_garage', 'assets/bay/l_garage.png', 136, 72, 1);
        this.load.spritesheet('building_label_shop', 'assets/bay/l_shop.png', 92, 64, 1);

        this.load.spritesheet('buy-btn', 'assets/icons/buy.png', 76, 60, 2);
        this.load.spritesheet('buy-btn-bought', 'assets/icons/bought.png', 80, 72, 1);
        this.load.spritesheet('buy-btn-nomoney', 'assets/icons/notenough.png', 76, 60, 1);

        this.load.spritesheet('btn_craft', 'assets/icons/craft.png', 108, 60, 3);
        // this.load.spritesheet('btn_no_craft', 'assets/icons/notenough.png', 76, 60, 1);

        this.load.spritesheet('ok-btn', 'assets/icons/ok.png', 80, 68, 2);

        this.load.spritesheet('shop-item-bg', 'assets/icons/checkedbg2.png', 120, 168, 8);
        this.load.spritesheet('home-item-bg', 'assets/checkedhome.png', 128, 168, 1);
        this.load.spritesheet('garage-item-bg', 'assets/parchment.png', 144, 180, 1);

        this.load.spritesheet('shop-all-sold', 'assets/icons/items-sold.png', 128, 96, 1);
        this.load.spritesheet('garage-all-sold', 'assets/icons/garageempty.png', 164, 104, 1);

        this.load.image('board', 'assets/menu-shorter.png');
        this.load.image('long-board', 'assets/menu.png');
        this.load.image('home-board', 'assets/HOMEboard.png');
        this.load.image('garage-board', 'assets/GARAGEboard.png');

        this.load.image('money-board', 'assets/icons/SHOPboard.png');
        this.load.spritesheet('btn_select', 'assets/icons/select.png', 124, 60, 2);
        this.load.spritesheet('btn_using', 'assets/icons/using.png', 104, 60, 2);
        this.load.spritesheet('btn_rate', 'assets/icons/rate1.png', 80, 68, 2);
        this.load.image('part', 'assets/icons/part.png');

        this.load.image('category-label-hero', 'assets/icons/SHOPcharacter2.png');
        this.load.image('category-label-tool', 'assets/icons/SHOPtool.png');
        this.load.image('category-label-mount', 'assets/icons/SHOPboat.png');
        this.load.image('category-label-postcard', 'assets/icons/SHOPpostcard.png');

        this.load.image('arr-left', 'assets/icons/L.png');
        this.load.image('arr-right', 'assets/icons/R.png');

        this.load.image('arr-left-home', 'assets/icons/Ly.png');
        this.load.image('arr-right-home', 'assets/icons/Ry.png');

        this.load.image('arr-left-garage', 'assets/icons/Lg.png');
        this.load.image('arr-right-garage', 'assets/icons/Rg.png');

        this.load.image('gameover', 'assets/gm.png');
        this.load.image('shop-sign', 'assets/shop.png');
        this.load.image('home-sign', 'assets/HOME.png');
        this.load.image('garage-sign', 'assets/garage.png');

        // HACK HACK HACK
        this.load.image('pixel', 'assets/hack.png');

        this.load.bitmapFont('fisherman', 'assets/fonts/fisherman2.png', 'assets/fonts/fisherman2.fnt');
        this.load.bitmapFont('brown', 'assets/fonts/brown/brown.png', 'assets/fonts/brown/brown.fnt');
        this.load.spritesheet('fish', 'assets/play/fish1.png', 100, 144, 4);

        this.load.spritesheet('water-wave', 'assets/play/water-wave.png', 144, 380, 4);
        this.load.spritesheet('water-splash', 'assets/play/water-splash.png', 72, 100, 6);

        this.load.spritesheet('mine', 'assets/play/BOMB.png', 112, 132, 5);
        this.load.spritesheet('mineRed', 'assets/play/BOMB2.png', 112, 132, 5);
        this.load.spritesheet('barrel', 'assets/play/barrel.png', 108, 120, 5);
        this.load.spritesheet('boom', 'assets/play/boom.png', 144, 278, 10);

        this.load.spritesheet('monster_0', 'assets/monsters/monsterI.png', 324, 312, 6);
        this.load.spritesheet('monster_1', 'assets/monsters/monsterII.png', 280, 250, 6);
        this.load.spritesheet('monster_2', 'assets/monsters/monster3.png', 220, 204, 6);
        this.load.spritesheet('monster_3', 'assets/monsters/monster4.png', 232, 288, 6);

        this.load.spritesheet('splash_0', 'assets/monsters/splash.png', 352, 296, 5);
        this.load.spritesheet('splash_1', 'assets/monsters/splash1.png', 352, 296, 5);
        this.load.spritesheet('splash_2', 'assets/monsters/ZIP.png', 352, 296, 5);

        this.load.spritesheet('crafting', 'assets/play/crafting.png', 136, 136, 7);

        this.load.audio('main', 'assets/ost/FM7b.ogg');
        this.load.audio('gameover', 'assets/ost/gameover.ogg');
        this.load.audio('bay', 'assets/ost/zatoka.ogg');
        this.load.audio('explosion', 'assets/sounds/explosion2.ogg');
        this.load.audio('monster', 'assets/sounds/monsters3.ogg');
        this.load.audio('start', 'assets/sounds/tap.ogg');
        this.load.audio('tap', 'assets/sounds/tap.ogg');

    },
    create: function() {
        this.game.add.image(0, 0, 'pixel');
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