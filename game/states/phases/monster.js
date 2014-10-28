'use strict';

var storage = require('../../storage');

// subphases

var summonMonster = function() {
    if (this.gameover) {
        return;
    }

    this.randomMonster = function(location) {
        var monstersNumber = 4
        return 'monster_' + Math.floor(Math.random() * monstersNumber);
    };
    this.randomSplash = function(location) {
        var splashNumber = 3
        return 'splash_' + Math.floor(Math.random() * splashNumber);
    };

    storage.addStat('summoned-monsters', 1);
    this.gameover = true;
    this.game.audio.monster.play();
    this.game.audio.music.stop();
    this.game.add.tween(this.scoreText).to({
        y: this.game.height + 100
    }, 300, Phaser.Easing.Sinusoidal.Out, true, 0, false).onComplete.add(function() {
        this.scoreText.destroy();
    }.bind(this));

    this.monsterSprite = this.game.add.sprite(this.game.width / 2, -this.CELL_SIZE * 2, this.randomMonster());
    this.monsterSprite.scale.x = 0.8;
    this.monsterSprite.scale.y = 0.8;
    this.monsterSprite.anchor.setTo(0.5, 0.5);


    var monsterAnim = this.monsterSprite.animations.add('monstering');
    this.monsterSprite.animations.play('monstering', 10, true);

    this.game.monster = this.monsterSprite;

    setTimeout(function() {
        var splashSprite = this.game.add.sprite(this.game.width / 2, this.CELL_SIZE / 3 * 2 + 30, this.randomSplash());
        this.game.add.existing(splashSprite);
        splashSprite.anchor.setTo(0.5, 0.5);

        var splashAnim = splashSprite.animations.add('monstering');
        splashAnim.killOnComplete = true;
        splashSprite.animations.play('monstering', 4, 0);

        this.crew.alive = false;
        this.crew.destroy();
    }.bind(this), 150);

    this.stopAllElements();

    this.game.add.tween(this.monsterSprite).to({
        y: this.CELL_SIZE
    }, 150, Phaser.Easing.Linear.None, true, 100, false).onComplete.add(function() {

    }.bind(this));

    setTimeout(function() {
        this.showScoreboard();
        this.game.audio.over.play();
    }.bind(this), 1200);
}

module.exports = summonMonster