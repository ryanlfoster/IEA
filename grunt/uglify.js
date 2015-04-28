module.exports = function(grunt, options) {
    return {
        iea: {
            files: {
                '<%= config.app %>/js/libs/iea/core/js/iea.min.js': ['<%= config.app %>/js/libs/iea/core/js/iea.js'],
                '<%= config.app %>/js/libs/iea/core/js/iea.components.min.js': ['<%= config.app %>/js/libs/iea/core/js/iea.components.js']
            }
        },

        dist: {
            files: {
                '<%= config.dist %>/js/<%= config.name %>.components.min.js': ['.tmp/js/<%= config.name %>.components.js'],
                '<%= config.dist %>/js/main.min.js': ['<%= config.dist %>/js/main.js']
            }
        }
    };
}
