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
            self.addInitializer(function () {
                if(self.config.getEnvironment() !== 'production') {
                    self.config.get('$body').append('<p style="padding:1px;position:absolute;z-index:999;background-color:yellow;font-size:8px"> IEA Version : '+ IEA.getVersion() +' | '+ self.config.get('name') +' | '+self.config.getEnvironment()+'</p>');
                }
            });

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
