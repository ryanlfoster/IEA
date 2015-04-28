'use strict';

/**
 * iea abstract view function class
 * @method AbstractView
 * @param {} options
 * @return
 */
IEA.AbstractView = function(options) {
    Backbone.View.apply(this, [options]);
};

// set Layout intitial configuration to use view as layouts and disable elements
Backbone.Layout.configure({
    manage: false,
    el: false
});

// add extend to abstractView from backbone
IEA.AbstractView.extend = Backbone.View.extend;

// add LayoutManager into IEA scope. From here onways IEA.View also is equipped with Layout manager and
// all its features
IEA.Layout = Backbone.Layout;

_.extend(IEA.AbstractView.prototype, Backbone.View.prototype, {
    /* ----------------------------------------------------------------------------- *\
           Public Methods
    \* ----------------------------------------------------------------------------- */

    /**
    * Executed immediately when creating a new instance. Hides the containing element so that we can use the transitioning methods to show it.
    * @method initialize
    * @return {null}
    **/
    initialize: function(options) {
        var self = this;
        _.extend(this, options);

        // bind listeners for reponsive behavior
        this.app.on('matchMobile', $.proxy(this.triggerMethod, this, 'matchMobile'));
        this.app.on('unmatchMobile', $.proxy(this.triggerMethod, this, 'unmatchMobile'));
        this.app.on('matchTablet', $.proxy(this.triggerMethod, this, 'matchTablet'));
        this.app.on('unmatchTablet', $.proxy(this.triggerMethod, this, 'unmatchTablet'));
        this.app.on('matchDesktop', $.proxy(this.triggerMethod, this, 'matchDesktop'));
        this.app.on('unmatchDesktop', $.proxy(this.triggerMethod, this, 'unmatchDesktop'));
        this.app.on('window:resized', $.proxy(this.triggerMethod, this, 'window:resized'));

        // when view is intialized, fire the current breakpoint event
        setTimeout(function () {
            self.triggerMethod(self.app.getCurrentBreakpoint());
        },300);

        // view level variables
        this._isEnabled= false;

    },

    /**
    Clears the provided element's styles from the DOM.
    @method clearStyles
    @example
        this.clearStyles(this.$el);
    @param {jQuery Element} el The element to clear the styles of
    @return {null}
    **/
    clearStyles: function($el) {
        $el.attr('style', '');
    },

    /**
    Disposes of the view.  Unbinds its events and removes it from the DOM.
    @method dispose
    @return {null}
    **/
    stop: function() {
        this.undelegateEvents();
        this.remove();
    },

    /**
    show the view
    @method show
    @return {null}
    **/
    show: function() {
        this.$el.fadeIn(0);
    },

    /**
    hide the view
    @method hide
    @return {null}
    **/
    hide: function(cb, scope, params) {
        this.$el.fadeOut(0, function() {
            if (typeof cb === 'function') {
                if (typeof params === 'undefined') {
                    params = [];
                }
                cb.apply(scope, params);
            }
        });
    },

    /**
    Cleans up the view.  Unbinds its events and removes it from the DOM.
    @method clean
    @return {null}
    **/
    clean: function() {

    },

    triggerMethod: IEA.triggerMethod,

    /* ----------------------------------------------------------------------------- *\
        Event Handlers
    \* ----------------------------------------------------------------------------- */

});
