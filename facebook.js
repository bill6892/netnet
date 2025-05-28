window.fbAsyncInit = function () {
    // Initialize the SDK with your app and the Graph API version for your app 
    FB.init({
        appId: '357140426152444',
        xfbml: true,
        version: 'v19.0',
        status: true
    });
};

// Add the Facebook SDK for Javascript
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/fr_FR/sdk.js";
    js.onerror = function () {
        showError("Veuillez désactiver votre bloqueur de pubs pour permettre l'accès à Facebook.")
    };
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function isFBConnected() {
    return new Promise((resolve, reject) => {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                resolve(response.authResponse.accessToken)
            } else {
                resolve(false)
            }
        });
    })
}

const NETFLIXY_PAGE_ID = '275781865624176'

function isPageLiked() {
    return new Promise((resolve, _reject) => {
        FB.api('/me/likes/' + NETFLIXY_PAGE_ID, function (response) {
            if (response.data.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        });
    })
}
