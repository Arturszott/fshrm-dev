var socialService, gp;

if (/ios/i.test(navigator.userAgent)) {
    // TODO ADD GAMECENTER
    // gp = CocoonJS.Social.GooglePlayGames;
} else if (/android/i.test(navigator.userAgent)) {
    gp = CocoonJS.Social.GooglePlayGames;
}


//clientId is not required in android
var iosClientId = "273377255436-omilg308s7ev1jf4t6bspcrhae3odu3m.apps.googleusercontent.com";
// var webClientId = "273377255436-d8vme49kjo6bisprjp3lda82s2b6r097.apps.googleusercontent.com";

gp.init({
    clientId: navigator.isCocoonJS ? iosClientId : webClientId,
    defaultLeaderboard: "CgkIrMD5suwHEAIQAA"
});

//you can use the GP extension with the official API or use it with CocoonJS SocialGaming API
socialService = gp.getSocialInterface();
socialService.onLoginStatusChanged.addEventListener(function(loggedIn, error) {
    console.log('logged im bitchys')
});

// socialService.login();


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