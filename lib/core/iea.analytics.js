'use strict';

//TODO : look for more options which was be part of IEA like
// https://github.com/kendagriff/backbone.analytics/blob/master/backbone.analytics.js

/**
 * IEA Analytics class
 * @method Analytics
 * @param {object} options
 * @return
 */
IEA.Analytics = function (options) {
    this.options = options;
    this._initCallbacks = new IEA.Callbacks();
    _.extend(this, options);
    this.initialize.apply(this, arguments);
};

// Copy the `extend` function used by Backbone's classes
IEA.Analytics.extend = IEA.extend;

_.extend(IEA.Analytics.prototype, {

    /**
     * analytics intialize function
     * @method initialize
     * @return
     */
    initialize: function () {},

    /**
     * Add an initializer that is either run at when the `start`method is called, or run immediately if added after `start` has already been called.
     * @method addInitializer
     * @param {} initializer
     * @return
     */
    addInitializer: function(initializer) {
        this._initCallbacks.add(initializer);
    },

    /**
     * kick off all of the application's processes.initializes all of the initializer functions
     * @method start
     * @param {object} options
     * @return
     */
    start: function(options) {
        this._initCallbacks.run(options, this);
    },

    /**
     * Description
     * @method page
     * @return
     */
    page: function () {
        //page track;
    },

    /**
     * Description
     * @method component
     * @return
     */
    component: function () {
        //CTA Track;
    },

    /**
     * Description
     * @method link
     * @return
     */
    link: function () {
        // body...
    },

    /**
     * Description
     * @method video
     * @return
     */
    video: function () {
        // body...
    },

    /**
     * Description
     * @method custom
     * @return
     */
    custom: function () {
        // body...
    },

    /**
     * Description
     * @method _clearVariables
     * @return
     */
    _clearVariables: function () {
        // body...
    }


});
