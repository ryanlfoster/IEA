'use strict';


/**
 * IEA view
 * @return
 * @method View
 * @param {} options
 * @return
 */
IEA.View = function(options) {
    IEA.AbstractView.apply(this, [options]);
};


IEA.View.extend = IEA.AbstractView.extend;

// extend abstract view into iea view to give it more power.
_.extend(IEA.View.prototype, IEA.AbstractView.prototype, {

    /**
     * intialize function
     * @return
     * @method initialize
     * @param {} options
     * @return
     */
    initialize: function(options) {
        IEA.AbstractView.prototype.initialize.apply(this, arguments);

        //get all the options and set it to the view scope
        _.extend(this, options);
        _.bindAll(this, 'render');

        //any change in the component model will trigger the render again
        this.listenTo(this.model, 'change', function(data) {
            this.triggerMethod('model:change', this.model.changed);
        });

        // add the module name as the class to the component element to bind the the css
        this.$el.addClass(this.parent.moduleName);
    },

    addEvent: function (viewEvents, callback) {
        if(_.isObject(viewEvents)) {
            _.extend(this.events, viewEvents);
        }

        if(_.isString(viewEvents)) {
            this.events[viewEvents] = callback;
        }
    },

    removeEvent: function (viewEventName) {
        this.events = _.omit(this.events, viewEventName);
    },

    updateSetting: function (settings, callback) {
        if(_.isObject(settings)) {
            _.extend(this.defaultSettings, settings);
        }

        if(_.isString(settings)) {
            this.defaultSettings[settings] = callback;
        }
    },

    /**
     * get component template
     * @method getTemplate
     * @param {} name
     * @return CallExpression
     */
    getTemplate: function(name, path) {
        var args = Array.prototype.slice.call(arguments);
        return this.app.getTemplate.apply(this.app, args);
    },

    /**
     * get component name
     * @method getViewName
     * @return MemberExpression
     */
    getViewName: function() {
        return this.parent.moduleName;
    },

    /**
     * parse the data from the form to model
     * @method parse
     * @param {} objName
     * @return
     */
    parse: function(objName) {
        var self = this,
            _recurse_form = function(object, objName) {
                _.each(object, function(v, k) {
                    if (v instanceof Object) {
                        object[k] = _recurse_form(v, objName + '[' + k + '_attributes]');
                    } else {
                        object[k] = self.$('[name="' + objName + '[' + k + ']"]').val();
                    }
                });
                return object;
            };

        this.model.attributes = _recurse_form(this.model.attributes, objName);
    },

    /**
     * populate model data into the form
     * @method populate
     * @param {} objName
     * @return
     */
    populate: function(objName) {
        var self = this,
            _recurse_obj = function(object, objName) {
                _.each(object, function(v, k) {
                    if (v instanceof Object) {
                        _recurse_obj(v, objName + '[' + k + '_attributes]');
                    } else if (_.isString(v)) {
                        self.$('[name="' + objName + '[' + k + ']"]').val(v);
                    }
                });
            };

        _recurse_obj(this.model.attributes, objName);
    }
});
