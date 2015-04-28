/*jshint -W079 */

'use strict';

var LIVERELOAD_PORT = 35729,
    SERVER_PORT = 9000,
    fs = require('fs'),
    _ = require('underscore'),
    config = require('./config/config.js'),
    IEAComponents = [],
    APPComponents = [],
    pkg,
    libModules,
    appModules;

module.exports = function(grunt) {
    // package specific configuration
    pkg = grunt.file.readJSON('package.json');

    //read all the view files from iea and app
    libModules = fs.readdirSync(config.lib + '/js/views/');
    appModules = fs.readdirSync(config.app + '/js/views/');


    // create array of files which needs to be loaded
    _.each(libModules, function(model) {
        var str = model.replace('.js', '');
        IEAComponents.push('views/' + str + '/_' + str);
    });
    IEAComponents.push('iea.templates');

    // create array of files which needs to be loaded
    _.each(appModules, function(model) {
        var str = model.replace('.js', '');
        APPComponents.push('views/' + str + '/' + str);
    });
    APPComponents.push(config.name+'.templates');


    // grunt basic config balues
    grunt.option('LIVERELOAD_PORT', LIVERELOAD_PORT);
    grunt.option('port', SERVER_PORT);
    grunt.option('host', '0.0.0.0'); // change this to '0.0.0.0' to access the server from outside
    grunt.option('config', config);
    grunt.option('version', pkg.version);

    require('load-grunt-config')(grunt, {
        //data passed into config.  Can use with <%= test %>
        data: {
            LIVERELOAD_PORT: LIVERELOAD_PORT,
            port: SERVER_PORT,
            config: config,
            pkg: pkg,
            host: '0.0.0.0'
        }
    });

    // create AMD list of all the iea components
    grunt.registerTask('loadIEAComponents', function() {
        grunt.file.write(config.app + '/js/libs/iea/core/js/iea.components.js', 'define(["' + IEAComponents.join('","') + '"],function(){return Array.prototype.slice.call(arguments);});');
    });

    // create AMD list of all the app components
    grunt.registerTask('loadAPPComponents', function() {
        grunt.file.write('.tmp/js/'+ config.name+ '.components.js', 'define(["' + APPComponents.join('","') + '"],function(){return Array.prototype.slice.call(arguments);});');
    });

    // 'grunt server' by default wiill run 'grunt server:app' which kickstarts the application
    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : ':app')]);
    });

    /*******************************************************************************************************/
    /******************************************IEA AND APP START********************************************/
    /*******************************************************************************************************/

    grunt.registerTask('serve', function(target) {

        /*******************************IEA SPECIFIC TASKS**********************************************/

        if (target === 'all') {
            return grunt.task.run([
                'server:iea',
                'server:app'
            ]);
        }

        if (target === 'iea') {
            return grunt.task.run([
                'env:dev',
                'jshint',
                'clean:iea',
                'loadIEAComponents',
                'handlebars:iea',
                'preprocess:iea',
                'template:iea',
                'requirejs:iea',
                'requirejs:ieac',
                'copy:iea',
                'compass:iea',
                'uglify:iea',
                'cssmin:iea',
                'imagemin:iea',
                'clean:iearesidue'
            ]);
        }

        /***********************************APPLICATION SPECIFIC GRUNT TASK********************************/

        if (target === 'app') {
            return grunt.task.run([
                'jshint',
                'clean:app',
                'loadAPPComponents',
                'handlebars:app',
                'template:app',
                'compass:app',
                'server:start'
            ]);
        }

        if (target === 'start') {
            return grunt.task.run([
                'connect:livereload',
                'open:server',
                'watch'
            ]);
        }
    });

    /*******************************************************************************************************/
    /******************************************BUILD RELATED GRUNT TASKS************************************/
    /*******************************************************************************************************/

    grunt.registerTask('build', function(type) {
        if (type === 'cq') {
            return grunt.task.run([
                'server:iea',
                'default',
                'copy:cq',
                'clean:cq'
            ]);
        }

        grunt.task.run([
            'default'
        ]);
    });

    grunt.registerTask('default', [
        'env:build',
        'clean:dist',
        'clean:app',
        'loadAPPComponents',
        'handlebars:app',
        'template:app',
        'requirejs:appc',
        'requirejs:dist',
        'compass:app',
        'imagemin:dist',
        'useminPrepare',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify',
        'copy:def',
        'usemin'
    ]);

};
