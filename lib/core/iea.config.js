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

        this.set(this.get(this.getEnvironment()));

        // add change event to configuration whic will trigger an event at application level
        this.on('change', function (config) {
            if(this.get('debug')) {
                console.info('%c '+ this.getEnvironment() +' configuration changed! ', 'background: #222; color: #fff',  config.changed);
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
        var env, envs = this.get('environment'), ptrn,debugPtrn = new RegExp('debug=iea');
        for (env in envs) {
            for (var i = 0; i < envs[env].length; i++) {
                ptrn = new RegExp(envs[env][i]);
                if(ptrn.test(location.hostname)) {
                    return env;
                }
            };
        }

        if(debugPtrn.test(window.location.href)) {
            return 'development';
        }

        return 'production';
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

