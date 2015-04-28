module.exports = function(grunt, options) {
    return {
        app: {
            options: {
                templateSettings: {
                    variable: 'data'
                },
                namespace: function(filePath) {
                    //var pieces = filePath.split('/');
                    //return pieces[0];
                    return (options.config.template && options.config.template.namespace) ? options.config.template.namespace : options.config.name;
                },
                amd: ['handlebars']
            },
            files: {
                '.tmp/js/<%= config.name %>.templates.js': ['<%= config.app %>/js/templates/**/*.hbss']
            }
        },

        iea: {
            options: {
                templateSettings: {
                    variable: 'data'
                },
                namespace: function(filePath) {
                    var pieces = filePath.split('/');
                    return pieces[0];
                },
                amd: ['handlebars','helpers']
            },
            files: {
                '<%= config.app %>/js/libs/iea/core/js/iea.templates.js': ['<%= config.lib %>/js/templates/**/*.hbss']
            }
        }
    };
}
