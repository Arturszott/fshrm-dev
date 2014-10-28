'use strict';

var storage = require('../../storage');

// subphases

var explode = function() {
    if (this.gameover) {
        return;
    }

    storage.addStat('explosions', 1);
    this.slowDownAll();
    this.game.audio.music.stop();
    this.game.audio.over.play();
    // this.game.audio.over._sound.playbackRate.value = 1.2;

    this.timer.stop();
    this.timer.destroyAll();
    this.scoreText.destroy();
    this.sideInput.detach();
    this.crew.destroy();

    this.boomSprite.show();

    // NUKE FUNCTION
    this.destroyLayers();
    this.showScoreboard();

    this.gameover = true;
}

module.exports = explode