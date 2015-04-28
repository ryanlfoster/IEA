module.exports = function(grunt, options) {
    return {
        options: {
            nospawn: true,
            livereload: true
        },
        //gruntchange: {
        //    files: ['Gruntfile.js','grunt/**/*.js'],
        //    tasks: ['jshint', 'template:app', 'compass:app']
        //},
/**************************************IEA WATCH*******************************************************/
        ieacore: {
            files: ['<%= config.lib %>/core/{,*/}*.js'],
            tasks: ['jshint','preprocess:iea', 'requirejs:iea']
        },

        ieacomp: {
            files: ['<%= config.lib %>/js/**/*.js'],
            tasks: ['jshint','requirejs:ieac']
        },

        compassLib: {
            files: ['<%= config.lib %>/sass/**/*.{scss,sass}'],
            tasks: ['template:iea', 'compass:iea']
        },

        ieahbss: {
            files: ['<%= config.lib %>/js/templates/**/*.hbss'],
            tasks: ['handlebars:iea','requirejs:ieac']
        },

        livereloadlib: {
            options: {
                livereload: grunt.option('LIVERELOAD_PORT')
            },
            files: [
                '<%= config.lib %>/css/{,*/}*.css',
                '<%= config.lib %>/js/{,*/}*.js',
                '<%= config.lib %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                '<%= config.lib %>/js/templates/*.{ejs,mustache,hbs,hbss}'
            ]
        },

/********************************APP WATCH*************************************************************/

        livereloadapp: {
            options: {
                livereload: grunt.option('LIVERELOAD_PORT')
            },
            files: [
                '<%= config.app %>/*.html',
                '{.tmp,<%= config.app %>}/css/{,*/}*.css',
                '{.tmp,<%= config.app %>}/js/{,*/}*.js',
                '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                '<%= config.app %>/js/templates/*.{ejs,mustache,hbs,hbss}',
            ]
        },

        appjs: {
            files: ['<%= config.app %>/js/**/*.js','config/*.js'],
            tasks: ['jshint']
        },

        compassApp: {
            files: ['<%= config.app %>/sass/**/*.{scss,sass}'],
            tasks: ['template:app', 'compass:app']
        },

        apphbss: {
            files: ['<%= config.app %>/js/templates/**/*.hbss'],
            tasks: ['handlebars:app']
        }
    };
};
