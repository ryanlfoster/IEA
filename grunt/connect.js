module.exports = function(grunt, options) {
    var lrSnippet = require('connect-livereload')({
        port: grunt.option('LIVERELOAD_PORT')
    });

    var mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    return {
        options: {
            port: grunt.option('port'),
            hostname: grunt.option('host')
        },
        livereload: {
            options: {
                middleware: function(connect) {
                    return [
                        lrSnippet,
                        mountFolder(connect, '.tmp'),
                        mountFolder(connect, 'docs'),
                        mountFolder(connect, options.config.app),
                        mountFolder(connect, 'config')
                    ];
                }
            }
        },
        test: {
            options: {
                port: 9001,
                middleware: function(connect) {
                    return [
                        lrSnippet,
                        mountFolder(connect, '.tmp'),
                        mountFolder(connect, 'test'),
                        mountFolder(connect, options.config.app)
                    ];
                }
            }
        },
        dist: {
            options: {
                middleware: function(connect) {
                    return [
                        mountFolder(connect, options.config.dist)
                    ];
                }
            }
        }
    };
}
