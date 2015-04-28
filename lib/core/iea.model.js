'use strict';

/**
 * Description
 * @method Model
 * @param {} options
 * @return
 */
IEA.Model = function(options) {
    Backbone.Model.apply(this, [options]);
};

IEA.Model.extend = Backbone.Model.extend;

_.extend(IEA.Model.prototype, Backbone.Model.prototype, {

    defaults: {
        hasShown: false
    },

    /**
     * Description
     * @method initialize
     * @param {} options
     * @return
     */
    initialize: function(options) {
        _.extend(this, options);

        if (options && typeof options.url !== 'undefined') {
            this.urlRoot = options.url;
        }

    }
});
