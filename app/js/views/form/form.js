/*global define*/

define(function() {

    'use strict';

    var Form = IEA.module('UI.form', function(form, app, iea) {

        _.extend(form, {
            // Extendable hooks and API methods goes here

            onInit: function() {
                this.updateSetting({
                    calenderAutoclose: false
                });
            },

            onEnable: function() {

            },

            onFormSubmit: function() {

            },

            onSuccess: function() {

            },

            onError: function(msg) {

            }

        });
    });

    return Form;
});
