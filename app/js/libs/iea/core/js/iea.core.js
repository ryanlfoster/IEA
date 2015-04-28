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
    
    'use strict';
    
    /**
     * application configuration class which will hold all the application level information and can be accessed anywhere from the application.
     * @method Config
     * @param {} options
     * @param {} app
     * @return
     */
    IEA.Config= function (options, app) {
        Backbone.Model.apply(this, [options]);
        this.app = app;
    };
    
    IEA.Config.extend = Backbone.Model.extend;
    
    _.extend(IEA.Config.prototype, Backbone.Model.prototype, {
    
        defaults: {
            '$htmlAndBody': $('html, body'),
            '$body': $('body'),
            '$window': $(window),
            '$document': $(document),
            'isIE8': $('body').hasClass('lt-ie9'),
            'pageTitle': document.title,
            'isMobileBreakpoint': false,
            'isTabletBreakpoint': false,
            'isDesktopBreakpoint': false,
    
            'FLCN_TEMPLATE': {},
            'FLCN_BASEPATH': 'lib',
            'FLCN_TEMPLATEPATH': 'lib/js/templates/',
            'FLCN_IMAGEPATH': 'lib/images/',
            'FLCN_VIEWPATH': 'lib/js/templates/',
            'FLCN_SASSPATH': 'lib/js/sass/',
            'FLCN_THEMEPATH': 'lib/js/sass/theme/',
            'FLCN_DEPENDENCIES': ['iea.components'],
    
    
            'templateFramework':'Handlebars',
            'defaultTemplateName' : '',
            'dependencies': [],
            'loadErrorMsg' : "Component load error",
            'loadErrorDetails': "could not load the requested component",
            'theme': 'whitelabel',
            'selector': 'enscale',
            'extension': 'jpg',
            'breakpoints': {},
    
    
            // application template and engine settings
            'template':{},
    
            // internationalization settings
            'i18n':{},
    
            // layout settings
            'layout':{},
    
            // debug settings
            'debug': true,
    
            // application folder and file nameing convensions
            'conventions':{},
    
            // other application settings
            'settings':{},
    
            // environment detection and settings
            'environment': {
                'development': [],
                'stage': [],
                'production': [],
            },
    
            // development settings
            'development': {},
    
            // stageserver settings
            'stage': {},
    
            // production settings
            'production': {}
        },
    
        /**
         * configuration object intialize and add the configuration at application level as well as server side json.
         * @method initialize
         * @return
         */
        initialize: function (options) {
            var self = this,
                breakpoints = options.breakpoints,
                deviceSmall = +breakpoints.deviceSmall.slice(0, -2),
                deviceMedium = +breakpoints.deviceMedium.slice(0, -2),
                deviceLarge = +breakpoints.deviceLarge.slice(0, -2),
                deviceXlarge = +breakpoints.deviceXlarge.slice(0, -2);
    
            if (options && typeof options.url !== 'undefined') {
                this.urlRoot = options.url;
            }
    
            this.set({
                template: {
                    namespace: options.template.namespace || options.name
                },
    
                breakpoints: {
                    'mobile': {
                        'media': 'screen and (min-width: ' + deviceSmall + 'px) and (max-width: ' + (deviceLarge - 1) + 'px)',
                        'prefix': '.mobP.high.'
                    },
                    'mobileLandscape': {
                        'media': 'screen and (min-width: ' + deviceSmall + 'px) and (max-width: ' + (deviceLarge - 1) + 'px) and (orientation : landscape)',
                        'prefix':'.mobL.high.'
                    },
                    'tablet': {
                        'media': 'screen and (min-width: ' + deviceLarge + 'px) and (max-width: ' + (deviceXlarge - 1) + 'px)',
                        'prefix': '.tabP.high.'
                    },
                    'tabletLandscape': {
                        'media': 'screen and (min-width: ' + deviceLarge + 'px) and (max-width: ' + (deviceXlarge - 1) + 'px) and (orientation : landscape)',
                        'prefix': '.tabL.high.'
                    },
                    'desktop': {
                        'media': 'screen and (min-width: ' + deviceXlarge + 'px)',
                        'prefix': '.full.high.'
                    }
                }
            });
    
            // add change event to configuration whic will trigger an event at application level
            this.on('change', function (config) {
                if(options.debug) {
                    console.info('%c configuration changed! ', 'background: #222; color: #fff',  config.changed);
                }
                self.app.trigger('configuration:changed', config.changed);
            });
        },
    
        getTemplateSetting: function (argument) {
            return this.get('template');
        },
    
        geti18NSetting: function (argument) {
            return this.get('i18n');
        },
    
        getLayoutSetting: function (argument) {
            return this.get('layout');
        },
    
        getDebugSetting : function (argument) {
            return this.get('debug');
        },
    
        getConventionSetting: function (argument) {
            return this.get('conventions');
        },
    
        getEnvironment: function (argument) {
            return this.get('environment');
        },
    
        getEnvironmentSetting: function (argument) {
            return this.get('environment');
        },
    
        getDevelopmentSetting: function (argument) {
            return this.get('development');
        },
    
        getStageSetting: function (argument) {
            return this.get('stage');
        },
    
        getProductionSetting: function (argument) {
            return this.get('production');
        }
    });
    
    
    // Trigger an event and/or a corresponding method name. Examples:
    //
    // `this.triggerMethod("foo")` will trigger the "foo" event and
    // call the "onFoo" method.
    //
    // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
    // call the "onFooBar" method.
    
    IEA.triggerMethod = function(event) {
    'use strict';
      // split the event name on the ":"
      var splitter = /(^|:)(\w)/gi;
    
      // take the event section ("section1:section2:section3")
      // and turn it in to uppercase name
      function getEventName(match, prefix, eventName) {
        return eventName.toUpperCase();
      }
    
      // get the method name from the event name
      var methodName = 'on' + event.replace(splitter, getEventName);
      var method = this[methodName];
      var result;
    
      // call the onMethodName if it exists
      if (_.isFunction(method)) {
        // pass all arguments, except the event name
        result = method.apply(this, _.tail(arguments));
      }
    
      // trigger the event, if a trigger method exists
      if (_.isFunction(this.trigger)) {
        this.trigger.apply(this, arguments);
      }
    
      return result;
    };
    
    // triggerMethodOn invokes triggerMethod on a specific context
    //
    // e.g. `IEA.triggerMethodOn(view, 'show')`
    // will trigger a "show" event or invoke onShow the view.
    IEA.triggerMethodOn = function(context, event) {
      'use strict';
      var args = _.tail(arguments, 2);
      var fnc;
    
      if (_.isFunction(context.triggerMethod)) {
        fnc = context.triggerMethod;
      } else {
        fnc = IEA.triggerMethod;
      }
    
      return fnc.apply(context, [event].concat(args));
    };
    
    /* jshint maxparams: 9 */
    
    // Module
    // ------
    
    // A simple module system, used to create privacy and encapsulation in
    'use strict';
    
    // IEA applications
    IEA.Module = function(moduleName, app, options) {
        this.moduleName = moduleName;
        this.options = _.extend({}, this.options, options);
        // Allow for a user to overide the initialize
        // for a given module instance.
        this.initialize = options.initialize || this.initialize;
    
        // Set up an internal store for sub-modules.
        this.submodules = {};
    
        this._setupInitializersAndFinalizers();
    
        // Set an internal reference to the app
        // within a module.
        this.app = app;
    
        if (_.isFunction(this.initialize)) {
            this.initialize(moduleName, app, this.options);
        }
    };
    
    IEA.Module.extend = IEA.extend;
    
    // Extend the Module prototype with events / listenTo, so that the module
    // can be used as an event aggregator or pub/sub.
    _.extend(IEA.Module.prototype, Backbone.Events, {
    
        // By default modules start with their parents.
        startWithParent: true,
    
        // Initialize is an empty function by default. Override it with your own
        // initialization logic when extending IEA.Module.
        initialize: function(options) {
            _.extend(this, options);
        },
    
        // Initializer for a specific module. Initializers are run when the
        // module's `start` method is called.
        addInitializer: function(callback) {
            this._initializerCallbacks.add(callback);
        },
    
        // Finalizers are run when a module is stopped. They are used to teardown
        // and finalize any variables, references, events and other code that the
        // module had set up.
        addFinalizer: function(callback) {
            this._finalizerCallbacks.add(callback);
        },
    
        // Start the module, and run all of its initializers
        start: function(options) {
            // Prevent re-starting a module that is already started
            if (this._isInitialized) {
                return;
            }
    
            // start the sub-modules (depth-first hierarchy)
            _.each(this.submodules, function(mod) {
                // check to see if we should start the sub-module with this parent
                if (mod.startWithParent) {
                    mod.start(options);
                }
            });
    
            // run the callbacks to "start" the current module
            this.triggerMethod('before:start', options);
    
            this._initializerCallbacks.run(options, this);
            this._isInitialized = true;
    
            this.triggerMethod('start', options);
        },
    
        // Stop this module by running its finalizers and then stop all of
        // the sub-modules for this module
        stop: function() {
            // if we are not initialized, don't bother finalizing
            if (!this._isInitialized) {
                return;
            }
            this._isInitialized = false;
    
            this.triggerMethod('before:stop');
    
            // stop the sub-modules; depth-first, to make sure the
            // sub-modules are stopped / finalized before parents
            _.each(this.submodules, function(mod) {
                mod.stop();
            });
    
            // run the finalizers
            this._finalizerCallbacks.run(undefined, this);
    
            // reset the initializers and finalizers
            this._initializerCallbacks.reset();
            this._finalizerCallbacks.reset();
    
            this.triggerMethod('stop');
        },
    
        // Configure the module with a definition function and any custom args
        // that are to be passed in to the definition function
        addDefinition: function(moduleDefinition, customArgs) {
            this._runModuleDefinition(moduleDefinition, customArgs);
        },
    
        getViewInstance: function (data) {
            var self = this;
            if(typeof this.View !== 'undefined') {
                return new this.View({
                    className: self.moduleName,
                    parent: self,
                    app: self.app,
                    el: $('<div>'),
                    model: new IEA.Model(data)
                });
            } else {
                return new IEA.View({
                    el: $('<div>'),
                    model: new IEA.Model(data)
                });
            }
        },
    
        // Internal method: run the module definition function with the correct
        // arguments
        _runModuleDefinition: function(definition, customArgs) {
            // If there is no definition short circut the method.
            if (!definition) {
                return;
            }
            // build the correct list of arguments for the module definition
            var args = _.flatten([
                this,
                this.app,
                IEA,
                Backbone.$, _,
                customArgs
            ]);
    
            definition.apply(this, args);
        },
    
        // Internal method: set up new copies of initializers and finalizers.
        // Calling this method will wipe out all existing initializers and
        // finalizers.
        _setupInitializersAndFinalizers: function() {
            this._initializerCallbacks = new IEA.Callbacks();
            this._finalizerCallbacks = new IEA.Callbacks();
        },
    
        // import the `triggerMethod` to trigger events with corresponding
        // methods if the method exists
        triggerMethod: IEA.triggerMethod
    });
    
    // Class methods to create modules
    _.extend(IEA.Module, {
    
        // Create a module, hanging off the app parameter as the parent object.
        create: function(app, moduleNames, moduleDefinition) {
            var module = app;
    
            // get the custom args passed in after the module definition and
            // get rid of the module name and definition function
            var customArgs = slice.call(arguments);
            customArgs.splice(0, 3);
    
            // Split the module names and get the number of submodules.
            // i.e. an example module name of `Doge.Wow.Amaze` would
            // then have the potential for 3 module definitions.
            moduleNames = moduleNames.split('.');
            var length = moduleNames.length;
    
            // store the module definition for the last module in the chain
            var moduleDefinitions = [];
            moduleDefinitions[length - 1] = moduleDefinition;
    
            // Loop through all the parts of the module definition
            _.each(moduleNames, function(moduleName, i) {
                var parentModule = module;
                module = this._getModule(parentModule, moduleName, app, moduleDefinition);
                this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
                //this._loadComponents(module);
            }, this);
    
            // Return the last module in the definition chain
            return module;
        },
    
        _getModule: function(parentModule, moduleName, app, def, args) {
            var options = _.extend({}, def);
            var ModuleClass = this.getClass(def);
    
            // Get an existing module of this name if we have one
            var module = parentModule[moduleName];
    
            if (!module) {
                // Create a new module if we don't have one
                module = new ModuleClass(moduleName, app, options);
                parentModule[moduleName] = module;
                // store the module on the parent
                parentModule.submodules[moduleName] = module;
                parentModule.submodules[moduleName].parent = parentModule;
            }
    
            return module;
        },
    
        // ## Module Classes
        //
        // Module classes can be used as an alternative to the define pattern.
        // The extend function of a Module is identical to the extend functions
        // on other Backbone and IEA classes.
        // This allows module lifecyle events like `onStart` and `onStop` to be called directly.
        getClass: function(moduleDefinition) {
            var ModuleClass = IEA.Module;
    
            if (!moduleDefinition) {
                return ModuleClass;
            }
    
            // If all of the module's functionality is defined inside its class,
            // then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
            if (moduleDefinition.prototype instanceof ModuleClass) {
                return moduleDefinition;
            }
    
            return moduleDefinition.moduleClass || ModuleClass;
        },
    
        // Add the module definition and add a startWithParent initializer function.
        // This is complicated because module definitions are heavily overloaded
        // and support an anonymous function, module class, or options object
        _addModuleDefinition: function(parentModule, module, def, args) {
            var fn = this._getDefine(def);
            var startWithParent = this._getStartWithParent(def, module);
    
            if (fn) {
                module.addDefinition(fn, args);
            }
    
            this._addStartWithParent(parentModule, module, startWithParent);
        },
    
        _getStartWithParent: function(def, module) {
            var swp;
    
            if (_.isFunction(def) && (def.prototype instanceof IEA.Module)) {
                swp = module.constructor.prototype.startWithParent;
                return _.isUndefined(swp) ? true : swp;
            }
    
            if (_.isObject(def)) {
                swp = def.startWithParent;
                return _.isUndefined(swp) ? true : swp;
            }
    
            return true;
        },
    
        _getDefine: function(def) {
            if (_.isFunction(def) && !(def.prototype instanceof IEA.Module)) {
                return def;
            }
    
            if (_.isObject(def)) {
                return def.define;
            }
    
            return null;
        },
    
        _addStartWithParent: function(parentModule, module, startWithParent) {
            module.startWithParent = module.startWithParent && startWithParent;
    
            if (!module.startWithParent || !!module.startWithParentIsConfigured) {
                return;
            }
    
            module.startWithParentIsConfigured = true;
    
            parentModule.addInitializer(function(options) {
                if (module.startWithParent) {
                    module.start(options);
                }
            });
        },
    
        _loadComponents: function(module) {
    
            if (module.parent === 'undefined' || module.parent.moduleName !== 'UI') {
                return;
            }
    
            module.addInitializer(function(options) {
                var self = this,
    
                    // add initialier which gets triggered once the page is loaded. this will make sure that the inline component
                    // markup is binded with the backbone view
    
                    renderStaticCompnent = function(el, data, viewOptions) {
                        // create new instance of the module view and add the data as model
                        this.view = new this.View(_.extend(viewOptions, {
                            el: el,
                            model: new IEA.Model(data)
                        }));
    
                        // in case of serverside component, no need the render the page
                        // only fire enable to make sure the logic is applied.
                        this.view.triggerMethod('before:show', this);
                        this.app.trigger('component:loaded', this);
                        this.view.enable();
                        this.view.triggerMethod('show', this);
                        this.app.trigger('image:lazyload', this);
    
                        //imageloader binding
                        self.view.$el.imagesLoaded()
                        .done( function( instance ) {
                            self.view.triggerMethod('image:load', this);
                        })
                        .fail( function() {
                            self.view.triggerMethod('image:fail', this);
                        });
    
                        // add instance object to DOM for future reference
                        el.data('module', self);
                    },
    
                    renderDynamicComponent = function(el, data, viewOptions) {
                        // create new instance of the module view and add the data as model
                        this.view = new this.View(_.extend(viewOptions, {
                            el: el,
                            model: new IEA.Model(data)
                        }));
    
                        this.view.triggerMethod('before:show', this);
                        this.app.trigger('component:loaded', this);
                        this.view.render();
                        this.view.triggerMethod('show', this);
                        setTimeout(function () {
                            self.app.trigger('image:lazyload', self);
    
                            //imageloader binding
                            self.view.$el.imagesLoaded()
                            .done( function( instance ) {
                                self.view.triggerMethod('image:load', this);
                            })
                            .fail( function() {
                                self.view.triggerMethod('image:fail', this);
                            });
    
                        }, 300);
    
                        // add instance object to DOM for future reference
                        el.data('module', self);
                    };
    
                // this call also be fired with app.UI.accordion.start()
                $('[data-role="' + module.moduleName + '"]').each(function(indx, component) {
                    var $component = $(component),
                        isServerComponent = $component.data('server'),
                        compConfig = $('#' + $component.data('config')),
                        compDataURL = $component.data('path');
    
                    _.extend(module.View.prototype, {
                        className: module.moduleName,
                        parent: module,
                        app: module.app,
                        isServerComponent:  isServerComponent,
                        template : module.app.getTemplate(module.moduleName)
                    });
    
                    // this is a default view binding with server rendered component.
                    var viewOptions = {};
    
                    if (typeof compConfig !== 'undefined' && compConfig.length) {
                        console.log('%c Serverside component found : ', 'background: #428bca; color: #fff',  module.moduleName);
    
                        try {
                            compConfig = JSON.parse(compConfig.html());
                        } catch (err) {
                            compConfig = {};
                        }
    
                        renderStaticCompnent.apply(self, [$component, compConfig, viewOptions]);
    
                    } else if (typeof compDataURL !== 'undefined' && typeof compDataURL === 'string') {
                        console.log('%c Clientside component found : ', 'background: #428bca; color: #fff',  module.moduleName);
    
                        var compxhr,
                            componentData = new IEA.Model({
                                url: compDataURL
                            });
    
                        compxhr = componentData.fetch();
    
                        compxhr.done(function (data) {
    
                            if(_.isEmpty(data)) {
                                data = {
                                    status: "Error",
                                    details: "No data found"
                                };
    
                                viewOptions = {
                                    template: module.app.getTemplate('notfound'),
                                    _isEnabled: true
                                };
                            }
    
                            renderDynamicComponent.apply(self, [$component, data, viewOptions]);
                        });
    
                        compxhr.fail(function (object, status, details) {
    
                            renderDynamicComponent.apply(self, [$component, {
                                status: status,
                                details: details
                            }, {
                                template: module.app.getTemplate('notfound'),
                                _isEnabled: true
                            }]);
                        });
    
                    } else {
                        console.log('%c Serverside component found : ', 'background: #428bca; color: #fff',  module.moduleName);
    
                        renderStaticCompnent.apply(self, [$component, {},
                            viewOptions
                        ]);
                    }
                });
            });
    
            // finalizer get called when the module is stopped and make sure that all the binding is unbinded
            // can be called using app.UI.accordion.stop();
            module.addFinalizer(function(component) {
                var self = this;
                //TODO: need to correct this logic
                $('[data-role="' + module.moduleName + '"]').each(function(indx, component) {
                    var view = $(this).data('view');
                    view.stop();
                });
            });
        }
    });
    
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
    
    'use strict';
    
    // Callbacks
    // ---------
    
    /**
     * A simple way of managing a collection of callbacks and executing them at a later point in time, using jQuery's `Deferred` object.
     * @method Callbacks
     * @return
     */
    IEA.Callbacks = function() {
        this._deferred = IEA.Deferred();
        this._callbacks = [];
    };
    
    _.extend(IEA.Callbacks.prototype, {
    
        /**
         * Add a callback to be executed. Callbacks added here are// guaranteed to execute, even if they are added after the// `run` method is called.
         * @method add
         * @param {} callback
         * @param {} contextOverride
         * @return
         */
        add: function(callback, contextOverride) {
            var promise = _.result(this._deferred, 'promise');
    
            this._callbacks.push({
                cb: callback,
                ctx: contextOverride
            });
    
            promise.then(function(args) {
                if (contextOverride) {
                    args.context = contextOverride;
                }
                callback.call(args.context, args.options);
            });
        },
    
        /**
         * Run all registered callbacks with the context specified.// Additional callbacks can be added after this has been run// and they will still be executed.
         * @method run
         * @param {} options
         * @param {} context
         * @return
         */
        run: function(options, context) {
            this._deferred.resolve({
                options: options,
                context: context
            });
        },
    
        /**
         * Resets the list of callbacks to be run, allowing the same list// to be run multiple times - whenever the `run` method is called.
         * @method reset
         * @return
         */
        reset: function() {
            var callbacks = this._callbacks;
            this._deferred = IEA.Deferred();
            this._callbacks = [];
    
            _.each(callbacks, function(cb) {
                this.add(cb.cb, cb.ctx);
            }, this);
        }
    });
    
    /*jshint nocap: true*/
    
    'use strict';
    
    // Application
    
    /**
     * IEA Application class
     * @return
     * @method Application
     * @param {object} options
     * @return
     */
    IEA.Application = function(options) {
        this._initCallbacks = new IEA.Callbacks();
        this.submodules = {};
        this.dependencies = [];
        this.initialize.apply(this, arguments);
    };
    
    // Copy the `extend` function used by Backbone's classes
    IEA.Application.extend = IEA.extend;
    
    _.extend(IEA.Application.prototype, Backbone.Events, {
    
        /**
         * Initialize is an empty function by default. Override it with your own
         * @return
         * @method initialize
         * @param {} options
         * @return
         */
        initialize: function(options) {
            var self = this,
                configURL = $('body').data('config');
    
            // add the current application instance to IEA scope for future use
            IEA.currentInstance = this;
    
            // create a new backbone configuration model and add it to application scope
            if (typeof configURL !== 'undefined' && configURL !== '') {
                options = _.extend(options, {
                    url: configURL
                });
            }
    
            // create a config model with basic configuration
            this.config = new IEA.Config(options, this);
    
            try {
                // fetch the configuration json and update the option model.
                this.config.fetch({
    
                    success: function(data) {
                        self.triggerMethod('config:loaded', self);
                    },
    
                    error: function() {
                        console.info('Configuration load error');
                    }
                });
            } catch (err) {
                // put a very minor delay to make sure that the listeners are registered before its fired.
                setTimeout($.proxy(this.triggerMethod, this, 'config:loaded', this), 100);
            }
    
            this.on('config:loaded', function(app) {
                // run the consolify funtion to make sure that console is either diabled or gracefully killed.
                IEA.consolify(self.config.getDebugSetting());
    
                // add dependecies to be loaded before the application starts
                self.addDependencies(app.getValue('FLCN_DEPENDENCIES'));
                self.addDependencies(app.getValue('dependencies'));
    
                // add all the application start stuffs
                self.addInitializer($.proxy(self._registerModules, self, self));
                self.addInitializer($.proxy(self._listenToWindowEvents, self));
                self.addInitializer($.proxy(self._setUserAgent, self));
                self.addInitializer($.proxy(self._listenToViewportEvents, self));
                self.addInitializer($.proxy(self._loadComponentModules, self));
    
                // $.when(self.loadDependencies(app.getValue('dependencies'))).done($.proxy(self._loadComponentModules, self));
    
                setTimeout($.proxy(self.triggerMethod, self, 'application:ready', self), 100);
            });
    
            this.on('image:lazyload', $.proxy(this._handleLazyLoad, this));
        },
    
        /**
         * Add an initializer that is either run at when the `start` method is called, or run immediately if added after `start` has already been called.
         * @return
         * @method addInitializer
         * @param {function} initializer
         * @return
         */
        addInitializer: function(initializer) {
            this._initCallbacks.add(initializer);
        },
    
        /**
         * kick off all of the application's processes. initializes all of the initializer functions
         * @return
         * @method start
         * @param {} options
         * @return
         */
        start: function(options) {
            this.triggerMethod('before:start', options);
            this._initCallbacks.run(options, this);
            this.triggerMethod('start', options);
        },
    
        /**
         * Create a module, attached to the application
         * @method module
         * @param {string} moduleNames
         * @param {function} moduleDefinition
         * @return CallExpression
         */
        addModule: function(moduleNames, moduleDefinition) {
    
            // Overwrite the module class if the user specifies one
            var ModuleClass = IEA.Module.getClass(moduleDefinition);
    
            // slice the args, and add this application object as the
            // first argument of the array
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
    
            // see the IEA.Module object for more information
            return ModuleClass.create.apply(ModuleClass, args);
        },
    
        /**
         * Retrieve an object, function or other value from a target object or its `options`, with `options` taking precedence.
         * @method getValue
         * @param {} optionName
         * @return value
         */
        getValue: function(optionName) {
            if (!optionName) {
                return;
            }
            var value;
    
            if (typeof this.config !== undefined) {
                value = this.config.get(optionName);
            }
    
            return value;
        },
    
        /**
         * set value to the application level options
         * @method setValue
         * @param {string} optionName
         * @param {any} value
         * @return Literal
         */
        setValue: function(optionName, value) {
            if (!optionName) {
                return false;
            }
    
            if (typeof this.config !== undefined) {
                this.config.set(optionName, value);
            }
    
            return true;
        },
    
        /**
         * Description
         * @method getTemplateFramework
         * @return CallExpression
         */
        getTemplateFramework: function() {
            return this.getValue('templateFramework');
        },
    
        /**
         * Description
         * @method getTemplateExtension
         * @return xtn
         */
        getTemplateExtension: function() {
            var xtn = '';
    
            switch (this.getValue('templateFramework')) {
                case 'Handlebars':
                    xtn = 'hbss';
                    break;
            }
    
            return xtn;
        },
    
        /**
         * Description
         * @method getTemplate
         * @param {} templateName
         * @return MemberExpression
         */
        getTemplate: function(templateName, templatePath) {
    
            // if there is a default template settingused, the rather than folder name it used defaultTemplatenname
            // templatefilename can also be an array of possible names
            var templateFileName = (typeof this.getValue('defaultTemplateName') !== 'undefined' && this.getValue('defaultTemplateName') !== '') ? this.getValue('defaultTemplateName') : templateName,
                templateKey, appTemplate, ieaTemplate, componentNS = this.getValue('componentLookupSeq');
    
            // if templateName is empty means the use has send a custom templatePath to explicity load
            // moslty used in case of sub view load.
            if (!templateName) {
                return false;
            }
    
            for (var indx = 0; indx < componentNS.length; indx++) {
    
                // if application specific template exists then use that rather than looking into iea templates.
                if (window[componentNS[indx]]) {
    
                    //if user has send templatPath specifically , then use that rather than deriving the url based on templateName
                    if (typeof templatePath !== 'undefined' && _.isString(templatePath) && templatePath.indexOf(this.getValue('templatePath')) < 0) {
    
                        // if the templatPath is relative then prefix the path with templatePath
                        appTemplate = this.getValue('templatePath') + templatePath;
    
                        // if the path does not have the extendion then append the extension
                        if (appTemplate.indexOf(this.getTemplateExtension()) < 0) {
                            appTemplate = appTemplate + '.' + this.getTemplateExtension();
                        }
                    }
    
                    // if user has send custom path, then use it else derive the path from templateName and templateFileNames
                    if (appTemplate) {
                        templateKey = appTemplate;
                    } else {
                        // if the defaultTemplates is an array then we have to loop it and see which one exist
                        if (_.isArray(templateFileName)) {
                            for (var i = 0; i < templateFileName.length; i++) {
                                templateKey = this.getValue('templatePath') + templateName + '/' + templateFileName[i] + '.' + this.getTemplateExtension();
    
                                // if the template exist in the application namespace, then use it. else if will
                                // exit the condition and go to iea template fetching logic
                                if (_.has(window[componentNS[indx]], templateKey)) {
                                    console.info('%c '+componentNS[indx]+' HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                                    return window[componentNS[indx]][templateKey]
                                }
                            };
                        } else {
                            templateKey = this.getValue('templatePath') + templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
                        }
                    }
    
                    // if the template exist in the application namespace, then use it. else if will
                    // exit the condition and go to iea template fetching logic
                    if (_.has(window[componentNS[indx]], templateKey)) {
                        console.info('%c '+ componentNS[indx] + ' HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                        return window[componentNS[indx]][templateKey]
                    }
                }
    
            };
    
            // if not found anywhere in the compnent NS then pick the one from iea lib
    
            if (typeof templatePath !== 'undefined' && _.isString(templatePath) && templatePath.indexOf(this.getValue('FLCN_BASEPATH')) < 0) {
                ieaTemplate = this.getValue('FLCN_TEMPLATEPATH') + templatePath;
    
                if (ieaTemplate.indexOf(this.getTemplateExtension()) < 0) {
                    ieaTemplate = ieaTemplate + '.' + this.getTemplateExtension();
                }
            }
    
            if (ieaTemplate) {
                templateKey = ieaTemplate;
            } else {
                if (_.isArray(templateFileName)) {
                    for (var i = 0; i < templateFileName.length; i++) {
                        templateKey = this.getValue('FLCN_TEMPLATEPATH') + templateName + '/' + templateFileName[i] + '.' + this.getTemplateExtension();
    
                        // if the template exist in the iea namespace, then use it.
                        if (_.has(window[this.getValue('FLCN_BASEPATH')], templateKey)) {
                            console.info('%c IEA HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                            return window[this.getValue('FLCN_BASEPATH')][templateKey];
                        }
                    };
                } else {
                    templateKey = this.getValue('FLCN_TEMPLATEPATH') + templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
                }
            }
    
            if (_.has(window[this.getValue('FLCN_BASEPATH')], templateKey)) {
                console.info('%c IEA HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                return window[this.getValue('FLCN_BASEPATH')][templateKey];
            }
    
    
            // if client template is available pick it else pick application template
            /*if (this.getValue('appBasePath')) {
                templateAvailable = (typeof window[this.getValue('appBasePath')][this.getValue('templatePath') + this.getValue('FLCN_TEMPLATE')[templateName]] !== 'undefined') ? window[this.getValue('appBasePath')][this.getValue('templatePath') + this.getValue('FLCN_TEMPLATE')[templateName]] : window.app[this.getValue('FLCN_TEMPLATEPATH') + this.getValue('FLCN_TEMPLATE')[templateName]];
            } else {
                templateAvailable = window.app[this.getValue('FLCN_TEMPLATEPATH') + this.getValue('FLCN_TEMPLATE')[templateName]];
            }
    
            return templateAvailable;*/
        },
    
        /**
         * Description
         * @method registerTemplate
         * @param {} templateName
         * @param {} templateName
         * @return MemberExpression
         */
        registerTemplate: function(templateName, partialPath) {
    
            var templateFileName = (typeof this.getValue('defaultTemplateName') !== 'undefined' && this.getValue('defaultTemplateName') !== '') ? this.getValue('defaultTemplateName') : templateName,
                path = '';
    
            if (!templateName) {
                return false;
            }
    
            if (partialPath) {
                //path = this.getValue('templatePath') + partialPath + '.' + this.getTemplateExtension();
                path = partialPath + '.' + this.getTemplateExtension();
            } else {
                //path = this.getValue('templatePath') + templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
                path = templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
            }
            if (typeof this.config.attributes.FLCN_TEMPLATE !== undefined) {
                this.getValue('FLCN_TEMPLATE')[templateName] = path;
            }
            //this.setValue(templateName, path);
    
            return true;
        },
    
        /**
         * returns currently set application breakpoint
         * @method getCurrentBreakpoint
         * @return currentBreakpoint
         */
        getCurrentBreakpoint: function() {
            var currentBreakpoint = 'matchDesktop';
    
            if (this.getValue('isMobileBreakpoint')) {
                currentBreakpoint = 'matchMobile';
            } else if (this.getValue('isTabletBreakpoint')) {
                currentBreakpoint = 'matchTablet';
            } else if (this.getValue('isDesktopBreakpoint')) {
                currentBreakpoint = 'matchDesktop'
            }
    
            return currentBreakpoint;
        },
        /**
         * Description
         * @method addDependencies
         * @param {} dep
         * @return MemberExpression
         */
        addDependencies: function(dep) {
            if (_.isArray(dep)) {
                this.dependencies = this.dependencies.concat(dep)
            } else {
                this.dependencies.push(dep);
            }
            return this.dependencies;
        },
        /**
         * Description
         * @method loadDependencies
         * @param {} callback
         * @return
         */
        loadDependencies: function(deps, callback) {
            if (_.isFunction(deps)) {
                callback = deps;
                deps = this.dependencies;
            }
    
            function load(queue, results) {
                if (queue.length) {
                    require([queue.shift()], function(result) {
                        results.push(result);
                        load(queue, results);
                    });
                } else {
                    callback.apply(null, results);
                }
            }
    
            load(deps, []);
        },
    
        // import the `triggerMethod` to trigger events with corresponding
        // methods if the method exists
        triggerMethod: IEA.triggerMethod,
    
        /* -----------------------------------------------------------------------------
         Private Methods
         ----------------------------------------------------------------------------- */
    
        /**
         * load all component modules when the application is loaded.
         * @return
         * @method _loadComponentModules
         * @return
         */
        _loadComponentModules: function() {
            var self = this;
    
            this.loadDependencies(function() {
                $('[data-role]', $(document)).each(function(indx, component) {
                    var $component = $(component),
                        componentName = $component.data('role'),
                        isServerComponent = $component.data('server'),
                        compConfig = $('#' + $component.data('config')),
                        compTemplatePath = $component.data('template'),
                        compName = $component.data('name'),
                        compDataURL = $component.data('path'),
                        module = '';
    
                    if (typeof self.UI !== 'undefined' && typeof self.UI[componentName] !== 'undefined') {
                        module = self.UI[componentName];
                        module.View = IEA.View.extend(module);
                        module.name = compName || 'view';
    
                        _.extend(module.View.prototype, {
                            className: module.moduleName,
                            parent: module,
                            app: module.app,
                            isServerComponent: isServerComponent,
                            template: module.app.getTemplate(module.moduleName)
                        });
    
                        // this is a default view binding with server rendered component.
                        var viewOptions = {};
    
                        if (typeof compConfig !== 'undefined' && typeof compDataURL === 'undefined' && compConfig.length) {
                            console.info('%c SSR component enabled : ', 'background: #428bca; color: #fff', module.moduleName);
    
                            try {
                                compConfig = JSON.parse(compConfig.html());
                            } catch (err) {
                                compConfig = {};
                            }
    
                            self._renderStaticCompnent.apply(self, [module, $component, compConfig, viewOptions]);
    
                        } else if (typeof compDataURL !== 'undefined' && typeof compDataURL === 'string') {
                            console.info('%c CSR component rendered : ', 'background: #428bca; color: #fff', module.moduleName, compDataURL);
    
                            var compxhr,
                                componentData = new IEA.Model({
                                    url: compDataURL
                                });
    
                            compxhr = componentData.fetch();
    
                            compxhr.done(function(data) {
    
                                if (_.isEmpty(data)) {
                                    data = {
                                        status: module.app.getValue('loadErrorMsg') || "Component Error",
                                        details: module.app.getValue('loadErrorDetails') || "Component cannot be loaded"
                                    };
    
                                    viewOptions = {
                                        template: module.app.getTemplate('notfound'),
                                        _isEnabled: true
                                    };
                                }
    
                                self._renderDynamicComponent.apply(self, [module, $component, data, viewOptions]);
                            });
    
                            compxhr.fail(function(object, status, details) {
    
                                self._renderDynamicComponent.apply(self, [module, $component, {
                                    status: module.app.getValue('loadErrorMsg') || status,
                                    details: module.app.getValue('loadErrorMsg') || details
                                }, {
                                    template: module.app.getTemplate('notfound'),
                                    _isEnabled: true
                                }]);
                            });
    
                        } else {
                            console.info('%c Serverside component enabled : ', 'background: #428bca; color: #fff', module.moduleName);
    
                            self._renderStaticCompnent.apply(self, [module, $component, {}, viewOptions]);
                        }
    
                    }
                });
            });
        },
        /**
         * Description
         * @method _renderStaticCompnent
         * @param {} module
         * @param {} el
         * @param {} data
         * @param {} viewOptions
         * @return
         */
        _renderStaticCompnent: function(module, el, data, viewOptions) {
            // create new instance of the module view and add the data as model
            module[module.name] = new module.View(_.extend(viewOptions, {
                el: el,
                model: new IEA.Model(data)
            }));
    
            // in case of serverside component, no need the render the page
            // only fire enable to make sure the logic is applied.
            module[module.name].triggerMethod('before:show', module);
            module.app.trigger('component:loaded', module);
            module[module.name].enable();
            module[module.name].triggerMethod('show', module);
            module.app.trigger('image:lazyload', module[module.name]);
    
            // add instance object to DOM for future reference
            el.data('module', module);
        },
    
        /**
         * Description
         * @method _renderDynamicComponent
         * @param {} module
         * @param {} el
         * @param {} data
         * @param {} viewOptions
         * @return
         */
        _renderDynamicComponent: function(module, el, data, viewOptions) {
            // create new instance of the module view and add the data as model
            module[module.name] = new module.View(_.extend(viewOptions, {
                el: el,
                model: new IEA.Model(data)
            }));
    
            module[module.name].triggerMethod('before:show', module);
            module.app.trigger('component:loaded', module);
            module[module.name].render();
            module[module.name].triggerMethod('show', module);
    
            //setTimeout(function() {
            module.app.trigger('image:lazyload', module[module.name]);
            //}, 300);
    
            // add instance object to DOM for future reference
            el.data('module', module);
        },
    
        /**
         * Initialize enquire setup.
         * @return
         * @method _listenToViewportEvents
         * @return
         */
        _listenToViewportEvents: function() {
            var self = this;
    
            if (this.getValue('isIE8')) {
                this.setValue('isMobileBreakpoint', false);
                this.setValue('isTabletBreakpoint', false);
                this.setValue('isDesktopBreakpoint', true);
                self.trigger('matchDesktop');
            } else {
                enquire.register(this.getValue('breakpoints').mobile.media, {
                    /**
                     * Description
                     * @return
                     * @method setup
                     * @return
                     */
                    setup: function() {
                        // body...
                    },
                    /**
                     * Description
                     * @return
                     * @method match
                     * @return
                     */
                    match: function() {
                        self.setValue('isMobileBreakpoint', true);
                        self.setValue('isTabletBreakpoint', false);
                        self.setValue('isDesktopBreakpoint', false);
                        self.trigger('matchMobile');
                    },
                    /**
                     * Description
                     * @return
                     * @method unmatch
                     * @return
                     */
                    unmatch: function() {
                        self.setValue('isMobileBreakpoint', false);
                        self.trigger('unMatchMobile');
                    }
    
                }).register(this.getValue('breakpoints').tablet.media, {
                    /**
                     * Description
                     * @return
                     * @method setup
                     * @return
                     */
                    setup: function() {
                        // body...
                    },
                    /**
                     * Description
                     * @return
                     * @method match
                     * @return
                     */
                    match: function() {
                        self.setValue('isMobileBreakpoint', false);
                        self.setValue('isTabletBreakpoint', true);
                        self.setValue('isDesktopBreakpoint', false);
                        self.trigger('matchTablet');
                    },
                    /**
                     * Description
                     * @return
                     * @method unmatch
                     * @return
                     */
                    unmatch: function() {
                        self.setValue('isTabletBreakpoint', false);
                        self.trigger('unmatchTablet');
                    }
                }).register(this.getValue('breakpoints').desktop.media, {
                    /**
                     * Description
                     * @return
                     * @method setup
                     * @return
                     */
                    setup: function() {
                        // body...
                    },
                    /**
                     * Description
                     * @return
                     * @method match
                     * @return
                     */
                    match: function() {
                        self.setValue('isMobileBreakpoint', false);
                        self.setValue('isTabletBreakpoint', false);
                        self.setValue('isDesktopBreakpoint', true);
                        self.trigger('matchDesktop');
                    },
                    /**
                     * Description
                     * @return
                     * @method unmatch
                     * @return
                     */
                    unmatch: function() {
                        self.setValue('isDesktopBreakpoint', false);
                        self.trigger('unmatchDesktop');
                    }
                }, true);
            }
        },
    
    
        //_.debounce: http://rifatnabi.com/post/detect-end-of-jquery-resize-event-using-underscore-debounce
        //resize: http://stackoverflow.com/a/1921259
    
        /**
         * initialize applicatin level window event listeners and event emitters
         * @method _listenToWindowEvents
         * @return
         */
        _listenToWindowEvents: function() {
            var self = this,
                $window = $(window),
                width = $window.width(),
                height = $window.height(),
                newWidth = 0,
                newHeight = 0;
    
            $window.on('resize orientationchange', _.debounce(function(evt) {
                newWidth = $window.width();
                newHeight = $window.height();
    
                if (newWidth !== width || newHeight !== height) {
                    width = newWidth;
                    height = newHeight;
    
                    //TODO: this needs to be standardized
                    self._handleLazyLoad(self);
                    self.trigger('window:resized', evt);
                }
            }, 500));
    
            $window.on('scroll', _.debounce(function(evt) {
                self.trigger('window:scrolled', evt);
                self.trigger('image:lazyload', self);
            }, 100));
    
            self.trigger('window:resized');
        },
    
        /**
         * Description
         * @method _handleLazyLoad
         * @return
         */
        _handleLazyLoad: function(view) {
            Picturefill();
    
            if (view instanceof IEA.View) {
                view.loadedImageCount = 0;
    
                view.$el.imagesLoaded()
                    .progress(function(imgLoad, image) {
                        var $image = $(image.img),
                            $item = $image.parent();
    
                        $item.removeClass('is-loading').addClass('loaded');
    
                        IEA.triggerMethodOn($image, 'load');
    
                        if (!image.isLoaded) {
                            $item.addClass('is-broken');
                            IEA.triggerMethodOn($image, 'fail');
                        } else {
                            $item.removeClass('is-loading').addClass('loaded');
                        }
    
                        view.loadedImageCount++;
                    })
                    .always(function(instance) {
                        view.triggerMethod('image:loaded');
                        $('picture.loaded', view.$el).removeClass('is-broken');
                    });
    
            }
        },
    
        /**
         * application level UA sniffer
         * @method _setUserAgent
         * @return
         */
        _setUserAgent: function() {
            var ieInfo = IEA.checkNonConditionalIEVersion(),
                isiPad = navigator.userAgent.match(/iPad/i) !== null,
                $body = $('body');
    
            this.setValue('isIE', ieInfo.isIE);
            this.setValue('IEVersion', ieInfo.version);
    
            if (ieInfo.isIE && ieInfo.version >= 10) {
                $body.addClass('ie ie' + ieInfo.version);
            }
    
            if (isiPad) {
                $body.addClass('iPad');
            }
        },
    
        _registerModules: IEA.registerModules,
    });
    
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
    
    'use strict';
    
    //A convenient super method for the popular JavaScript library, Backbone.js.
    // https://github.com/lukasolson/backbone-super
    
    /*
    Brief aside on super: JavaScript does not provide a simple way to call
    super — the function of the same name defined higher on the prototype chain.
    If you override a core function like set, or save, and you want to invoke
    the parent object's implementation, you'll have to explicitly call it,
    along these lines:
    
    usage
    
    old way
    
    set: function(attributes, options) {
        Backbone.Model.prototype.set.call(this, attributes, options);
        ...
    }
    
    with super
    
    set: function(attributes, options) {
        this._super(attributes, options);
        ...
    }
    
    */
    
    IEA.Model.extend = IEA.Collection.extend = IEA.View.extend = IEA.AbstractView.extend = function(protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    };
    
    var unImplementedSuper = function(method) {
        throw "Super does not implement this method: " + method;
    };
    
    var fnTest = /\b_super\b/;
    
    var makeWrapper = function(parentProto, name, fn) {
        var wrapper = function() {
            var tmp = this._super;
    
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = parentProto[name] || unImplementedSuper(name);
    
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret;
            try {
                ret = fn.apply(this, arguments);
            } finally {
                this._super = tmp;
            }
            return ret;
        };
    
        //we must move properties from old function to new
        for (var prop in fn) {
            wrapper[prop] = fn[prop];
            delete fn[prop];
        }
    
        return wrapper;
    };
    
    var ctor = function() {},
        inherits = function(parent, protoProps, staticProps) {
            var child, parentProto = parent.prototype;
    
            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                child = protoProps.constructor;
            } else {
                child = function() {
                    return parent.apply(this, arguments);
                };
            }
    
            // Inherit class (static) properties from parent.
            _.extend(child, parent, staticProps);
    
            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            ctor.prototype = parentProto;
            child.prototype = new ctor();
    
            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) {
                _.extend(child.prototype, protoProps);
    
                // Copy the properties over onto the new prototype
                for (var name in protoProps) {
                    // Check if we're overwriting an existing function
                    if (typeof protoProps[name] == "function" && fnTest.test(protoProps[name])) {
                        child.prototype[name] = makeWrapper(parentProto, name, protoProps[name]);
                    }
                }
            }
    
            // Add static properties to the constructor function, if supplied.
            if (staticProps) _.extend(child, staticProps);
    
            // Correctly set child's `prototype.constructor`.
            child.prototype.constructor = child;
    
            // Set a convenience property in case the parent's prototype is needed later.
            child.__super__ = parentProto;
    
            return child;
        };
    

    return IEA;
}));
