/*global define*/

define(function() {

    'use strict';

    var Navigation = IEA.module('UI.navigation', function(module, app, iea) {

        _.extend(module, {
            // Extendable hooks and API methods goes here

            onInit: function() {

                this.updateSetting({
                    enableHover: true
                });

            },

            clickHandler: function() {

            },

            // Hook for handling mouse click event
            onMouseclick: function() {

            },

            // Hook for handling mouse enter event
            onMouseenter: function(event) {

            },

            // Hook for handling mouse leave event
            onMouseleave: function() {

            },

            // Hook for handling load event
            onEnable: function () {

            }

        });
    });

    return Navigation;
});
