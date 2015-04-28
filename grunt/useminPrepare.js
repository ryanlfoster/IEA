module.exports = function(grunt, options) {
    return {
        html: '<%= config.app %>/index.html',
        options: {
            dest: '<%= config.dist %>'
        }
    };
}
