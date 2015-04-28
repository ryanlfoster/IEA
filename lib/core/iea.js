(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {

        define(['backbone', 'underscore', 'layoutmanager', 'relational','paginator', 'bootstrap', 'enquire', 'picturefill', 'imagesloaded'], function(Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded) {
            return (root.IEA = factory(root, Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded));
        });

    } else if (typeof exports !== 'undefined') {

        var Backbone = require('backbone'),
            _ = require('underscore'),
            Layoutmanager = require('layoutmanager'),
            Relational = require('relational'),
            Bootstrap = require('boostrap'),
            Enquire = require('enquire'),
            Picturefill = require('picturefill'),
            Paginator = require('paginator');
            Imagesloaded = require('imagesloaded');


        module.exports = factory(root, Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded);

    } else {
        root.IEA = factory(root, root.Backbone, root._, root.Layoutmanager, root.Relational, root.Paginator, root.Bootstrap, root.Enquire, root.Picturefill, root.Imagesloaded);
    }

}(this, function(root, Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded) {
    'use strict';

    var previousIEA = root.IEA;

    var IEA = Backbone.IEA = {};

    IEA.VERSION = '<%= version %>';

    IEA.History = Backbone.History;

    IEA.noConflict = function() {
        root.IEA = previousIEA;
        return this;
    };

    // Get the Deferred creator for later use
    IEA.Deferred = Backbone.$.Deferred;

    // @include iea.helper.js
    // @include iea.config.js
    // @include iea.event.js
    // @include iea.module.js
    // @include iea.model.js
    // @include iea.collection.js
    // @include iea.abstractview.js
    // @include iea.view.js
    // @include iea.callbacks.js
    // @include iea.application.js
    // @include iea.analytics.js
    // @include iea.super.js

    return IEA;
}));
