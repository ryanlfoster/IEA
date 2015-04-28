!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t:e.configObj=t}(this,{
    'name': 'app',
    'theme': 'whitelabel',
    'lib': 'lib',
    'app': 'app',
    'dist': 'dist',
    'appBasePath': 'app',

    // debug settings(true | false | {}) (app.config.getDebugSetting())
    // environment specific setting will override default setting on load.
    'debug': true,

    'dependencies': ['iea.components', 'app.components'],
    'componentLookupSeq': ['app'],
    'defaultTemplateName' : ['defaultView', 'landingView'],
    'templatePath': 'app/js/templates/',
    'imagePath': 'app/images/',
    'sassPath': 'app/sass/',
    'jsPath': 'app/js/',
    'cssPath': 'app/css/',
    'dev': {
        'css': 'css/',
        'fonts': 'css/fonts/',
        'js': 'js/',
        'images': 'images/',
        'templates': 'js/templates',
        'fontPath': 'fonts/',
        'imagePath': '../images/'
    },
    'cq': {
        'css': 'dist/etc/ui/iea/clientlibs/core/core/css',
        'fonts': 'dist/etc/ui/iea/clientlibs/core/core/fonts',
        'js': 'dist/etc/ui/iea/clientlibs/core/require/js',
        'modjs': 'dist/etc/ui/iea/clientlibs/core/core/js',
        'images': 'dist/etc/ui/iea/clientlibs/core/core/images',
        'templates': 'dist/etc/ui/iea/templates/components',
        'fontPath': '../fonts/',
        'imagePath': '../images/'
    },
    'breakpoints': {
        'deviceSmall': '320px',
        'deviceMedium': '480px',
        'deviceLarge': '768px',
        'deviceXlarge': '1025px',
        'containerSmall': 'auto',
        'containerMedium': 'auto',
        'containerLarge': '750px',
        'containerXLarge': '960px'
    },

    // application template and engine settings (app.config.getTemplateSetting())
    'template':{},

    // internationalization settings (app.config.geti18NSetting())
    'i18n':{},

    // layout settings (app.config.getLayoutSetting())
    'layout':{},

    // application folder and file nameing convensions (app.config.getConventionsSetting())
    'conventions':{},

    // other application settings (app.config.getSetting())
    'settings':{},

    // environment detection and settings (app.config.getEvnironmentSetting())
    'environment': {
        'development': ['^localhost','^127.0.0.1'],
        'stage': ['^stage','^beta'],
        'production': [],
    },

    // development settings (app.config.getDevelopmentSetting())
    'development': {
        // debug settings(true | false | {}) (app.config.getDebugSetting())
        'debug': true
    },

    // stageserver settings (app.config.getStageSetting())
    'stage': {
        // debug settings(true | false | {}) (app.config.getDebugSetting())
        'debug': true
    },

    // production settings (app.config.getProductionSetting())
    'production': {
        // debug settings(true | false | {}) (app.config.getDebugSetting())
        'debug': false
    }
});
