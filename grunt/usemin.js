module.exports = function(grunt, options) {
    return {
        html: ['<%= config.dist %>/{,*/}*.html'],
        css: ['<%= config.dist %>/css/{,*/}*.css'],
        options: {
            dirs: ['<%= config.dist %>']
        }
    };
}
