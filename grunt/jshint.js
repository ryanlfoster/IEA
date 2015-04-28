module.exports = function(grunt, options) {
    return {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
        },
        all: [
            'Gruntfile.js',
            '<%= config.lib %>/js/{,*/}*.js',
            '<%= config.app %>/js/{,*/}*.js',
            '!<%= config.app %>/js/libs/vendor/*'
        ]
    };
}
