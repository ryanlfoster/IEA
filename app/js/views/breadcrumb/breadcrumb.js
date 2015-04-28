/*global define*/

define(function() {
    'use strict';

    var Breadcrumb = IEA.module('UI.breadcrumb', function(breadcrumb, app, IEA) {

        _.extend(breadcrumb, {
            // Extendable hooks and API methods goes here\
            onBeforeInit: function(options) {

            },

            onInit: function (options) {

            },

            onBeforeRender: function() {

            },

            onRender: function () {

            },

            onEnable: function() {

            },

            // Hook for handling page click event

            OnBeforeLinkClick: function () {

            }

        });
    });

    return Breadcrumb;
});
