module.exports = function(grunt, options) {
    return {
        iea: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.lib %>',
                dest: '<%= config.app %>/js/libs/iea/core',
                src: [
                    'js/templates/{,*/}*.*',
                    'css/fonts/{,*/}*.*'
                ]
            }]
        },
        def: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/js/libs/iea/core/',
                dest: '<%= config.dist %>',
                src: [
                    'images/{,*/}*.*',
                    'js/{,*/}*.*',
                    'css/{,*/}*.*',
                    'css/fonts/{,*/}*.*'
                ]
            },
            {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '*.{ico,txt}',
                    'images/{,*/}*.{png,jpg,jpeg,gif}',
                    'css/fonts/{,*/}*.*',
                    'data/{,*/}*.*'
                ]
            },
            {
                expand: true,
                dot: true,
                cwd: '.tmp',
                dest: '<%= config.dist %>',
                src: [
                    'js/<%= config.name %>.components.js',
                    'js/<%= config.name %>.components.min.js',
                    'css/main.css',
                    'css/main.min.css'
                ]
            }]
        },
        source: {
            files: [{
                expand: true,
                dot: true,
                cwd: '.tmp',
                dest: '<%= config.dist %>',
                src: [
                    'css/iea.css'
                ]
            }]
        },
        cq: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.dist %>/images',
                dest: '<%= config.cq.images%>',
                src: '{,*/}*.*'
            }, {
                expand: true,
                dot: true,
                cwd: '<%= config.dist %>/css/',
                dest: '<%= config.cq.css%>',
                src: '*.css'
            }, {
                expand: true,
                dot: true,
                cwd: '<%= config.dist %>/css/fonts/',
                dest: '<%= config.cq.fonts%>',
                src: '{,*/}*.*'
            }, {
                expand: true,
                dot: true,
                cwd: '<%= config.dist %>/js/',
                dest: '<%= config.cq.js%>',
                src: '**/*.*'
            }, {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/js/templates',
                dest: '<%= config.cq.templates%>',
                src: '**/*'
            }]
        },
        webserver: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.dist %>',
                dest: 'C:/wamp/www',
                src: [
                    '*.{ico,txt}',
                    'images/{,*/}*.{png,jpg,jpeg,gif}',
                    'css/{,*/}*.*',
                    'js/{,*/}*.*',
                    'data/{,*/}*.*'
                ]
            }]
        },
        boilerplate: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: 'IEAApp',
                src: [
                    'generator/templates/{,*/}*.*',
                    'app/{,*/}*.*'
                ]
            }, {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: 'IEAApp/app',
                src: [
                    'app/{,*/}*.*'
                ]
            }]
        }
    };
}
