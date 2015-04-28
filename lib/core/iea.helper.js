/* jshint unused: false */
'use strict';

// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

// Borrow the Backbone `extend` method so we can use it as needed
IEA.extend = Backbone.Model.extend;
IEA.modules = {};

/**
 * Retrieve an object, function or other value from a target
 * object or its `options`, with `options` taking precedence.
 * @method getOption
 * @param {} target
 * @param {} optionName
 * @return value
 */
IEA.getOption = function(target, optionName) {
    if (!target || !optionName) {
        return;
    }
    var value;

    if (target.options && (target.options[optionName] !== undefined)) {
        value = target.options[optionName];
    } else {
        value = target[optionName];
    }

    return value;
};

/**
 * application set options
 * @method setOption
 * @param {} target
 * @param {} optionName
 * @param {} value
 * @return Literal
 */
IEA.setOption = function(target, optionName, value) {
    if (!target || !optionName) {
        return false;
    }

    if (target.options && (target.options[optionName] !== undefined)) {
        target.options[optionName] = value;
    } else {
        target[optionName] = value;
    }

    return true;

};

/**
 * prototypical way of creating new instance of an object
 * @method create
 * @param {} o
 * @return
 */
IEA.create = function(o) {
    if (typeof Object.create !== 'function') {
        Object.create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    } else {
        return Object.create(o);
    }
};

/**
 * get applicatin instance
 * @method getApplication
 * @return application
 */
IEA.getApplication = function() {
    return IEA.instance;
};

/**
 * get IEA Version
 * @method getVersion
 * @return application
 */
IEA.getVersion = function() {
    return IEA.VERSION;
};

/**
 * create iea module. regiter them immediately if the application is running or put it to scope
 * and wait for application to load and register all of them
 * @method addModule
 * @param {} moduleName
 * @param {} moduleDefenition
 * @return
 */
IEA.module = function(moduleName, moduleDefenition) {
    var args = Array.prototype.slice.call(arguments);

    if (typeof IEA.currentInstance !== 'undefined') {
        return IEA.currentInstance.addModule.apply(IEA.currentInstance, args);
    } else {
        return IEA.modules[moduleName] = moduleDefenition;
    }
};

/**
 * create new iea service and return new instances everytime the service is requested
 * @method service
 * @param {} serviceName
 * @param {} serviceDefenition
 * @return serviceDefenition
 */
IEA.service = function(serviceName, serviceDefenition) {
    /**
     * Description
     * @method serviceName
     * @param {} options
     * @return CallExpression
     */
    IEA[serviceName] = function(options) {
        // build the correct list of arguments for the module definition
        var args = _.flatten([
                this,
                IEA.currentInstance,
                IEA,
                Backbone.$, _
            ]),
            serviceArgs = Array.prototype.slice.call(arguments),
            newInstance, serviceDef;

        serviceDef = serviceDefenition.apply(this, args),

            _.extend(serviceDef.prototype, Backbone.Events, {
                _initCallbacks: new IEA.Callbacks(),

                /**
                 * Add an initializer that is either run at when the `start`
                 * method is called, or run immediately if added after `start`
                 * has already been called.
                 * @method addInitializer
                 * @param {} initializer
                 * @return
                 */
                addInitializer: function(initializer) {
                    this._initCallbacks.add(initializer);
                },

                /**
                 * kick off all of the application's processes.
                 * initializes all of the initializer functions
                 * @method start
                 * @param {} options
                 * @return
                 */
                start: function(options) {
                    this._initCallbacks.run(options, this);
                },

                triggerMethod: IEA.triggerMethod
            });

        newInstance = new serviceDef
        return newInstance.initialize.apply(newInstance, serviceArgs);
    };

    return serviceDefenition;
};

/**
 * once the application is started it lookes through the iea modules which are not yet registerd and hen register the same
 * @method registerModules
 * @param {} app
 * @return
 */
IEA.registerModules = function(app) {
    setTimeout(function() {
        for (var module in IEA.modules) {
            app.addModule(module, IEA.modules[module]);
        }
    }, 100);
};

/**
 * IEA Event aggregator instance from the backbone core.
 * @method EventAggregator
 * @return EA
 */
IEA.EventAggregator = function() {

    /**
     * Description
     * @method EA
     * @return
     */
    var EA = function() {};

    // Copy the `extend` function used by Backbone's classes
    EA.extend = Backbone.Model.extend;

    // Copy the basic Backbone.Events on to the event aggregator
    _.extend(EA.prototype, Backbone.Events);

    return EA;
};


/**
 * Mix in methods from Underscore, for iteration, and other
 * collection related features.
 * Borrowing this code from Backbone.Collection:
 * http://backbonejs.org/docs/backbone.html#section-121
 * @method actAsCollection
 * @param {} object
 * @param {} listProperty
 * @return
 */
IEA.actAsCollection = function(object, listProperty) {
    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
        'select', 'reject', 'every', 'all', 'some', 'any', 'include',
        'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
        'last', 'without', 'isEmpty', 'pluck'
    ];

    _.each(methods, function(method) {
        /**
         * Description
         * @method method
         * @return CallExpression
         */
        object[method] = function() {
            var list = _.values(_.result(this, listProperty));
            var args = [list].concat(_.toArray(arguments));
            return _[method].apply(_, args);
        };
    });
};

IEA.serializeFormObject = function(el) {
    "use strict";

    var a = {},
        b = function(b, c) {
            var d = a[c.name];
            "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push($.trim(c.value)) : a[c.name] = [d, $.trim(c.value)] : a[c.name] = $.trim(c.value)
        };

    return $.each(el.serializeArray(), b), a
};

/**
 * Protect window.console method calls, e.g. console is not defined on IE8
 * unless dev tools are open, and IE doesn't define console.debug.
 * From http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
 * @method consolify
 * @param {} debug
 * @return
 */
IEA.consolify = function(debug) {

    /**
     * Description
     * @method dummy
     * @return
     */
    function dummy() {}

    if (!window.console) {
        window.console = {};
    }

    // union of Chrome, FF, IE, and Safari console methods
    // keep log out from this for now 'log',
    var m = ['info','warn', 'error', 'debug', 'trace', 'dir', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'dirxml', 'assert', 'count', 'markTimeline', 'timeStamp', 'clear'],
        i = 0,
        len = m.length;

    if(typeof debug === 'object') {

    }

    // define undefined methods as noops to prevent errors
    for (i; i < len; i++) {
        if (!window.console[m[i]] || debug === false) {
            window.console[m[i]] = dummy;
        }
    }
};

/**
 * IE 10+ doesn't support conditional comments so this helps to check which version of IE is being used.
 * We have to wrap the check inside of a Function to avoid minification of JS code removing the comment.
 * http://stackoverflow.com/a/16367030
 * @method checkNonConditionalIEVersion
 * @return ObjectExpression
 */
IEA.checkNonConditionalIEVersion = function() {
    var isIE = false,
        actualVersion = null,
        Fn = Function, // https://github.com/jshint/jshint/issues/525
        jscriptVersion = new Fn('/*@cc_on return @_jscript_version; @*/')();

    if (!!window.MSInputMethodContext) {
        // http://stackoverflow.com/a/22082397
        isIE = true;
        actualVersion = 11;
    } else if (jscriptVersion !== undefined) {
        isIE = true;
        actualVersion = jscriptVersion;
    }

    return {
        isIE: isIE,
        version: Number(actualVersion)
    };
};
