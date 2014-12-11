
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
  	this.stage.backgroundColor = '#e6e6e6';
    // this.load.image('preloader', 'assets/preloader.gif');
    this.load.image('splash', 'assets/splashScreen.png');

  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.stage.smoothed = false;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
    this.game.state.start('preload');
    // this.game.paused = true;

    setTimeout(function() {
      this.game.paused = false;
    }.bind(this), 100);
    // this.game.add.image(0, 0, 'pixel');
  }
};

module.exports = Boot;
