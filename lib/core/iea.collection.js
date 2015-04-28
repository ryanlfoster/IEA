'use strict';

/**
 * Description
 * @method Collection
 * @param {} options
 * @return
 */
IEA.Collection = function(options) {
    Backbone.Collection.apply(this, [options]);
};

IEA.Collection.extend = Backbone.Collection.extend;

_.extend(IEA.Collection.prototype, Backbone.Collection.prototype, {
    model: IEA.Model,

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
