
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
  	this.stage.backgroundColor = '#e6e6e6';
    this.load.image('preloader', 'assets/preloader.gif');
    this.load.image('splash', 'assets/splashScreen.png');
    this.stage.smoothed = false;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;
