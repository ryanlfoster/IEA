module.exports = function(grunt, options) {
    var requireConfig = {
        iea: {
            // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
            options: {
                baseUrl: '<%= config.lib %>/js',
                optimize: 'none',
                paths: {
                    'iea': '../../<%= config.app %>/js/libs/iea/core/js/iea.core',
                    'jquery': 'empty:',
                    'underscore': 'empty:',
                    'handlebars': '../../<%= config.lib %>/js/libs/vendor/handlebars/handlebars',
                },
                preserveLicenseComments: false,
                useStrict: true,
                name: 'iea',
                out: '<%= config.app %>/js/libs/iea/core/js/iea.js',
                mainConfigFile: '<%= config.lib %>/js/iea.js',
                include:['handlebars','helpers','slider','video','popup','brightcoveVideo','validator','tooltip']
            }
        },
        ieac: {
            options: {
                baseUrl: '<%= config.lib %>/js',
                optimize: 'none',
                paths: {
                    'iea': '../../<%= config.app %>/js/libs/iea/core/js/iea',
                    'jquery': 'empty:',
                    'underscore': 'empty:',
                    'iea.components': '../../<%= config.app %>/js/libs/iea/core/js/iea.components',
                    'iea.templates': '../../<%= config.app %>/js/libs/iea/core/js/iea.templates',
                    'handlebars': '../../<%= config.lib %>/js/libs/vendor/handlebars/handlebars',
                },
                preserveLicenseComments: false,
                useStrict: true,
                name: 'iea.components',
                out: '<%= config.app %>/js/libs/iea/core/js/iea.components.js',
                mainConfigFile: '<%= config.lib %>/js/iea.js',
                include: [],
                exclude: ['iea','handlebars']
            }
        },
        appc: {
            options: {
                baseUrl: '<%= config.app %>/js',
                optimize: 'none',
                paths: {
                    'iea': '../../<%= config.app %>/js/libs/iea/core/js/iea',
                    'iea.components': '../../<%= config.app %>/js/libs/iea/core/js/iea.components',
                    'jquery': 'empty:',
                    'underscore': 'empty:',
                    'handlebars': '../../<%= config.lib %>/js/libs/vendor/handlebars/handlebars',
                },
                preserveLicenseComments: false,
                findNestedDependencies: true,
                useStrict: true,
                name: '<%= config.name %>.components',
                out: '.tmp/js/<%= config.name %>.components.js',
                exclude: ['iea','handlebars']
            }
        },
        dist: {
            // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
            options: {
                baseUrl: '<%= config.app %>/js',
                optimize: 'none',
                paths: {
                    'iea': '../../<%= config.app %>/js/libs/iea/core/js/iea',
                    'iea.components': '../../<%= config.app %>/js/libs/iea/core/js/iea.components',
                    'jquery': 'empty:',
                    'underscore': 'empty:',
                    'handlebars': '../../<%= config.lib %>/js/libs/vendor/handlebars/handlebars',
                    'config': '../../config/config'
                },
                preserveLicenseComments: false,
                useStrict: true,
                name: 'main',
                out: '<%= config.dist %>/js/main.js',
                exclude: ['iea']
            }
        }
    };

    // temporary hack to add dyamic asset names to require config.
    requireConfig.appc.options.paths[options.config.name + '.components'] = '../../.tmp/js/<%= config.name %>.components';
    requireConfig.appc.options.paths[options.config.name + '.templates'] = '../../.tmp/js/<%= config.name %>.templates';

    return requireConfig;
}
