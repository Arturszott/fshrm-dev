'use strict';

//global variables
window.appStarted = false;

window.onload = function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	setTimeout(function() {
		onDeviceReady()
	}, 200);
};
window.onDeviceReady = function() {
	if(window.appStarted) return;
	window.appStarted = true;

	var w = window.innerWidth,
		h = window.innerHeight;

	if (window.plugins) {
		window.PGLowLatencyAudio = window.plugins.LowLatencyAudio;
	} else {
		window.PGLowLatencyAudio = null;
	}
	var screenRatio = w / h;

	var game = new Phaser.Game(505 * screenRatio, 505, Phaser.CANVAS, 'flappy-hell');

	game.widthRatio = 505 * screenRatio / 288;

	// Game States
	 game.state.add('boot', require('./states/boot'));  game.state.add('menu', require('./states/menu'));  game.state.add('play', require('./states/play'));  game.state.add('preload', require('./states/preload')); 

	game.state.start('boot');
}
