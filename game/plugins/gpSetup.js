var socialService, gp;

if (/ios/i.test(navigator.userAgent)) {
	console.log('ios')
    // TODO ADD GAMECENTER
    gp = CocoonJS.Social.GameCenter;
} else if (/android/i.test(navigator.userAgent)) {
    gp = CocoonJS.Social.GooglePlayGames;
}


//clientId is not required in android
var iosClientId = "919657677";
// var webClientId = "273377255436-d8vme49kjo6bisprjp3lda82s2b6r097.apps.googleusercontent.com";

if (/android/i.test(navigator.userAgent)) {
	gp.init({
	    clientId: iosClientId,
	    defaultLeaderboard: "CgkIrMD5suwHEAIQBw"
	});
}

//you can use the GP extension with the official API or use it with CocoonJS SocialGaming API
socialService = gp.getSocialInterface();
socialService.onLoginStatusChanged.addEventListener(function(loggedIn, error) {
    // console.log('logged im bitchys')
});

// rating module!!

var IOS_RATING_URL = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=519623307&onlyLatestVersion=false&type=Purple+Software";
var ANDROID_RATING_URL = "market://details?id=com.fishermangame";

var ratingURL = null;

if (/ios/i.test(navigator.userAgent)) {
    ratingURL = IOS_RATING_URL;
} else if (/android/i.test(navigator.userAgent)) {
    ratingURL = ANDROID_RATING_URL;
}

window.rateApp = function() {
    CocoonJS.App.openURL(ratingURL);
}