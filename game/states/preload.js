'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {

    // this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.game.scale.setScreenSize(true);
    // this.game.scale.refresh();        // Scale the game to fit the screen
    // this.game.stage.scale.startFullScreen();

    this.asset = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.add.sprite((this.game.width - 288) / 2, 0, 'splash');

    this.load.image('background', 'assets/water.png');
    this.load.image('mine', 'assets/mine.png');
    // this.load.image('fish', 'assets/fish.png');
    // this.load.image('fisherman', 'assets/fisherman.png');
    this.load.image('title', 'assets/logo.png');
    this.load.image('startButton', 'assets/start-button.png');
    this.load.image('instructions', 'assets/instructiondarks.png');
    this.load.image('getReady', 'assets/get-ready.png');

    this.load.image('scoreboard', 'assets/bonescore.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.spritesheet('medals', 'assets/medals.png', 44, 46, 2);
    this.load.spritesheet('explosion', 'assets/explosion.png', 64, 62, 16);
    this.load.image('particle', 'assets/particle.png');

    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');

    if (!!PGLowLatencyAudio) {
      PGLowLatencyAudio.preloadFX('flap', 'assets/flap.wav');
      PGLowLatencyAudio.preloadFX('score', 'assets/score.wav');
      PGLowLatencyAudio.preloadFX('pipe-hit', 'assets/pipe-hit.wav');
      PGLowLatencyAudio.preloadFX('ground-hit', 'assets/ground-hit.wav');
    }

    // this.load.spritesheet('pipe', 'assets/bonepipes.png', 54, 320, 2);
    this.load.spritesheet('fisherman', 'assets/fisherman.png', 98, 154, 1);
    this.load.spritesheet('fish', 'assets/fish.png', 40, 64, 2);
    this.load.spritesheet('nocatch', 'assets/nofish.png', 279, 130, 1);
    this.load.spritesheet('catchright', 'assets/fishight.png', 279, 130, 1);
    this.load.spritesheet('catchleft', 'assets/fishlef.png', 279, 130, 1);
    this.load.spritesheet('mine', 'assets/mine.png', 40, 38, 1);
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