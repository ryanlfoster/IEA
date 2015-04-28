/*global define, enquire*/

define([
    'iea',
    'config'
], function(
    IEA,
    Config) {

    'use strict';

    _.extend(Config, {
        'custom': 'value'
    });

    var app = new IEA.Application(Config);

    app.addInitializer(function() {
        //console.log('app intialize');
    });

    app.on('start', function (options) {
        //console.log('app start');
    });

    /* ----------------------------------------------------------------------------- *\
       Private Methods
    \* ----------------------------------------------------------------------------- */


    /**
     * intialize router
     * @method _initRouter
     * @return
     */
    var _initRouter = function() {
        console.log('router initialized');
        //Router.initialize();
    };


    return app;
});
