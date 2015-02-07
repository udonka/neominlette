// config/auth.js
var port = process.env.PORT || 80;

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '836371623071912', // your App ID
        'clientSecret'  : '0908394977ebcd8f478c562c99be62c8', // your App Secret
        'callbackURL'   : 'http://minlette-ubuntu.cloudapp.net/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'IFHcdoMwqc5wcN06JnEec4nXL',
        'consumerSecret'    : 'mdr1cQ7ijtRp4fPun3JYUjIL4Qhg2GIEcRkLfQeLmGu79OQNvg',
        'callbackURL'       : 'http://minlette-ubuntu.cloudapp/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
