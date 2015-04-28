/*global define*/

define(function() {

    'use strict';

    var Hotspot = IEA.module('UI.hotspot', function(hotspot, app, iea) {

        _.extend(hotspot, {
            // Extendable hooks and API methods goes here

            onInit: function() {
                this.updateSetting({
                    baseImage: '.new-base'
                });

            },

            onRender: function() {

            },

            onEnable: function() {

            },

            onError: function(msg) {

            }
        });
    });

    return Hotspot;
});
