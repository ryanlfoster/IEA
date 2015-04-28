module.exports = function(grunt, options) {
    return {
        iea: {
            files: {
                '<%= config.app %>/js/libs/iea/core/css/iea.min.css': ['<%= config.app %>/js/libs/iea/core/css/iea.css'],
                '.tmp/css/main.min.css': ['.tmp/css/main.css']
            }
        },
        dist: {
            files: {
                '.tmp/css/main.css': ['<%= config.app %>/css/{,*/}*.css']
            }
        }
    };
}
