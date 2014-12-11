'use strict';

var storage = require('./storage');
var config = require('./config');

var params = {
	"fullscreenAdUnit": "6eb2f44e1a0d4f4a93a8adb0de999e71",
    "fullscreenAdUnit-iPad": "e365ae5347804fcb9dcb79744babf92b",
    "fullscreenAdUnit-iPhone": "2a594d51560e46aab335c7ed00bbe1e4",
    "refresh": 20
};

var adsManager = {
	fullscreen: null,
	ready: false,
	init: function(){
		try {
			this.fullscreen = CocoonJS.Ad.createFullscreen(params);
			this.fullscreen.onFullScreenShown.addEventListener(this.onFullScreenShown.bind(this));
			this.fullscreen.onFullScreenHidden.addEventListener(this.onFullScreenHidden.bind(this));

			this.fullscreen.onFullScreenReady.addEventListener(this.onFullScreenReady.bind(this));
			this.fullscreen.refreshFullScreen();
		} catch(e){
			console.log(e);
		}
	},
	// functions to bind to
	onFullScreenShown: function(){
		window.game.paused = true;
	},
	onFullScreenHidden: function(){
		window.game.paused = false;
	},

	onFullScreenReady: function(){
		adsManager.ready = true;
	},
	refresh: function(){
		this.fullscreen.refreshFullScreen();
	},
	show: function(){
		if(!this.ready) return false;
		var games = storage.getStat('games');

		if(games > 40 && games % 7 === 0){
			this.fullscreen.showFullScreen();
		}
	}

}

module.exports = adsManager;