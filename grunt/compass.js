module.exports = function(grunt, options) {
    return {
        dist: {
            options: {
                sassDir: '<%= config.lib %>/sass',
                cssDir: '.tmp/cs',
                imagesDir: '<%= config.lib %>/images',
                javascriptsDir: '<%= config.lib %>/js',
                fontsDir: '<%= config.lib %>/sass/themes/<%= config.cq.theme%>/fonts',
                importPath: '<%= config.lib %>/js/libs/vendor',
                relativeAssets: true
            }
        },
        iea: {
            options: {
                sassDir: '<%= config.lib %>/sass',
                cssDir: '<%= config.app %>/js/libs/iea/core/css',
                imagesDir: '<%= config.lib %>/images',
                javascriptsDir: '<%= config.lib %>/js',
                fontsDir: '<%= config.lib %>/sass/themes/<%= config.dev.theme%>/fonts',
                importPath: '<%= config.lib %>/js/libs/vendor',
                relativeAssets: true
            }
        },
        app: {
            options: {
                sassDir: '<%= config.app %>/sass',
                cssDir: '.tmp/css',
                imagesDir: '<%= config.app %>/images',
                javascriptsDir: '<%= config.app %>/js',
                relativeAssets: true
            }
        }
    };
}
