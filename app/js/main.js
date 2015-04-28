/*global require*/

'use strict';

require.config({
    shim: {
        'iea': {
            deps: ['jquery','underscore']
        }
    },
    paths: {
        'jquery': '../js/libs/vendor/jquery/dist/jquery',
        'underscore': '../js/libs/vendor/underscore/underscore',
        'iea': ['iea.min','../js/libs/iea/core/js/iea'],
        'iea.components': ['iea.components.min','../js/libs/iea/core/js/iea.components'],
        'twitterWidget' : '//platform.twitter.com/widgets',
        'config': '../../config'
    }
});

require(['app'], function(app) {

    app.on('before:start', function() {
        // before start logic goes here
    });

    app.on('start', function(options) {
        // on application start logic goes here
    });

    app.on('application:ready', function () {
        app.start();
    });
});
