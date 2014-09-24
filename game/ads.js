'use strict';

var storage = require('./storage');
var config = require('./config');

var params = {
	"fullscreenAdUnit": "6eb2f44e1a0d4f4a93a8adb0de999e71",
    // "fullscreenAdUnit-iPad": "agltb3B1Yi1pbmNyDQsSBFNpdGUYjf30Eww",
    // "fullscreenAdUnit-iPhone": "agltb3B1Yi1pbmNyDQsSBFNpdGUYjf30Eww",
    "refresh": 20
};

var adsManager = {
	fullscreen: null,
	ready: false,
	init: function(){
		try {
			this.fullscreen = CocoonJS.Ad.createFullscreen(params);
			this.fullscreen.onFullScreenShown.addEventListener(this.onFullScreenShown);
			this.fullscreen.onFullScreenHidden.addEventListener(this.onFullScreenHidden);

			this.fullscreen.onFullScreenReady.addEventListener(this.onFullScreenReady);
			this.fullscreen.refreshFullScreen();
		} catch(e){
			console.log(e);
		}
	},
	// functions to bind to
	onFullScreenShown: function(){},
	onFullScreenHidden: function(){},

	onFullScreenReady: function(){
		adsManager.ready = true;
	},
	refresh: function(){
		this.fullscreen.refreshFullScreen();
	},
	show: function(){
		if(!this.ready) return false;
		var games = storage.getStat('games');

		if(games > 10 && games % 5 === 0){
			console.log('showing add')
			this.fullscreen.showFullScreen();
		}
	}

}

module.exports = adsManager;