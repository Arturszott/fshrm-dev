'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {

    this.asset = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.add.sprite((this.game.width - 288) / 2, 0, 'splash');

    this.load.image('background', 'assets/water.png');
    this.load.image('bottom', 'assets/bottom.png');
    this.load.image('waterlayer', 'assets/sea.png');
    this.load.image('timer', 'assets/timer.png');
    this.load.image('timebar', 'assets/time.png');

    this.load.image('title', 'assets/logo.png');
    this.load.image('startButton', 'assets/start-button.png');
    this.load.image('instructions', 'assets/instructiondarks.png');
    this.load.image('getReady', 'assets/get-ready.png');

    // this.load.image('scoreboard', 'assets/bonescore.png');
    this.load.image('board', 'assets/menu.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.image('particle', 'assets/particle.png');

    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');

    // @key, @src, @frame x, @frame y, @number of frames
    this.load.spritesheet('fish', 'assets/fish1.png', 100, 144, 4);
    this.load.spritesheet('mount', 'assets/ponton1.png', 144, 372, 4);
    this.load.spritesheet('fisherman', 'assets/Fm.png', 144, 152, 4);
    this.load.spritesheet('pole', 'assets/pole.png', 76, 128, 4);

    // this.load.spritesheet('mine', 'assets/mine.png', 108, 108, 6);
    this.load.spritesheet('mine', 'assets/bomba2.png', 104, 104, 1);
    this.load.spritesheet('medals', 'assets/medals.png', 44, 46, 2);
    this.load.spritesheet('explosion', 'assets/explosion.png', 64, 62, 16);

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