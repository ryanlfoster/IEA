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
