'use strict';

var storage = require('../../storage');
var _ = require('../../utils');

var createScoreBox = function() {
    this.score = 0;
    this.scoreText = this.game.add.bitmapText(this.game.width / 2, this.game.height + 100, 'fisherman', this.score.toString(), 24);
    this.game.stage.addChild(this.scoreText);
    this.game.stage.addChild(this.game.add.image(0, 0, ''));
    this.scoreText.updateTransform();
    this.scoreText.position.x = (this.game.width - this.scoreText.textWidth) / 2;
    this.scoreText.visible = false;
};

module.exports = createScoreBox