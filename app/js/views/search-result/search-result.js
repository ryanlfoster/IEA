/*global define*/
define( function() {

    'use strict';

    var SearchResult = IEA.module('UI.search-result', function (module, app, iea) {

        _.extend(module, {
            // Extendable hooks and API methods goes here

            onInit: function() {
                this.updateSetting({
                    searchContainer: '.search-result-container'
                });
            },
            onEnable: function() {

            },
            onError: function(err) {

            },
            onDataLoad: function(response) {

            },
            onFirstPage: function(response) {

            },
            onLastPage: function(response) {

            }
        });
    });
    return SearchResult;
});
