module.exports = function (grunt, options) {
    return {
            iea: {
                src: '<%= config.lib %>/core/iea.js',
                dest: '<%= config.app %>/js/libs/iea/core/js/iea.core.js'
            }
        };
}
