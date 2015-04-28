module.exports = function(grunt, options) {
    return {
        iea: {
            files: [{
                expand: true,
                cwd: '<%= config.lib %>/images',
                src: '{,*/}*.{png,jpg,jpeg}',
                dest: '<%= config.app %>/js/libs/iea/core/images'
            }]
        },
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.app %>/images',
                src: '{,*/}*.{png,jpg,jpeg}',
                dest: '<%= config.dist %>/images'
            }]
        }
    };
}
