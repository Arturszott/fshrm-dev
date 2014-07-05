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

	var game = new Phaser.Game(505 * screenRatio, 505, Phaser.AUTO, '<%= _.slugify(projectName) %>');

	game.widthRatio = 505 * screenRatio / 288;

	// Game States
	<% _.forEach(gameStates, function(gameState) { %> game.state.add('<%= gameState.shortName %>', require('./states/<%= gameState.shortName %>')); <%
	}); %>

	game.state.start('boot');
}
