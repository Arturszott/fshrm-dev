'use strict';

function Menu() {}

Menu.prototype = {
  preload: function() {
    // add the background sprite
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
  },
  create: function() {
    this.titleGroup = this.game.add.group();

    this.title = this.game.add.sprite(this.game.width / 2, 0, 'title');
    this.title.anchor.setTo(0.5, 0.5);
    this.titleGroup.add(this.title);

    this.titleGroup.x = 0;
    this.titleGroup.y = 100;

    this.game.add.tween(this.titleGroup).to({
      y: 115
    }, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    this.startButton = this.game.add.button(this.game.width / 2, 300, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5, 0.5);


  },
  startClick: function() {
    this.game.state.start('play');
  },
  update: function() {

  }
};

module.exports = Menu;