module.exports = function(grunt, options) {
    return {
        options: {
            data: {
                version: grunt.option('version'),
                theme: '<%= config.theme%>',
                fontPath: '<%= config.dev.fontPath%>',
                imagePath: '<%= config.dev.imagePath%>',
                breakpointSmall: '<%= config.breakpoints.deviceSmall%>',
                breakpointMedium: '<%= config.breakpoints.deviceMedium%>',
                breakpointLarge: '<%= config.breakpoints.deviceLarge%>',
                breakpointXlarge: '<%= config.breakpoints.deviceXlarge%>',

                containerSmall: '<%= config.breakpoints.containerSmall%>',
                containerMedium: '<%= config.breakpoints.containerMedium%>',
                containerLarge: '<%= config.breakpoints.containerLarge%>',
                containerXLarge: '<%= config.breakpoints.containerXLarge%>',
            }
        },
        iea: {
            'files': {
                '<%= preprocess.iea.dest %>': ['<%= preprocess.iea.dest %>'],
                '<%= config.lib %>/sass/iea.scss': ['<%= config.lib %>/sass/_base.scss']
            }
        },
        app: {
            'files': {
                '<%= config.app %>/sass/_<%= config.theme%>.scss': ['<%= config.app %>/sass/_base.scss'],
                '<%= config.app %>/sass/main.scss': ['<%= config.app %>/sass/_main.scss']
            }
        },
        source: {
            options: {
                data: {
                    version: grunt.option('version'),
                    theme: '<%= config.theme%>',
                    fontPath: '<%= config.source.fontPath%>',
                    imagePath: '<%= config.source.imagePath%>',
                    breakpointSmall: '<%= config.breakpoints.deviceSmall%>',
                    breakpointMedium: '<%= config.breakpoints.deviceMedium%>',
                    breakpointLarge: '<%= config.breakpoints.deviceLarge%>',
                    breakpointXlarge: '<%= config.breakpoints.deviceXlarge%>',

                    containerSmall: '<%= config.breakpoints.containerSmall%>',
                    containerMedium: '<%= config.breakpoints.containerMedium%>',
                    containerLarge: '<%= config.breakpoints.containerLarge%>',
                    containerXLarge: '<%= config.breakpoints.containerXLarge%>',
                }
            },
            'files': {
                '<%= preprocess.iea.dest %>': ['<%= preprocess.iea.dest %>'],
                '<%= config.app %>/sass/_<%= config.theme%>.scss': ['<%= config.app %>/sass/_base.scss'],
                '<%= config.app %>/sass/main.scss': ['<%= config.app %>/sass/_main.scss'],
                '<%= config.lib %>/sass/iea.scss': ['<%= config.lib %>/sass/_base.scss']
            }
        },
        cq: {
            options: {
                data: {
                    version: grunt.option('version'),
                    theme: '<%= config.theme%>',
                    fontPath: '<%= config.cq.fontPath%>',
                    imagePath: '<%= config.cq.imagePath%>',
                    breakpointSmall: '<%= config.breakpoints.deviceSmall%>',
                    breakpointMedium: '<%= config.breakpoints.deviceMedium%>',
                    breakpointLarge: '<%= config.breakpoints.deviceLarge%>',
                    breakpointXlarge: '<%= config.breakpoints.deviceXlarge%>',

                    containerSmall: '<%= config.breakpoints.containerSmall%>',
                    containerMedium: '<%= config.breakpoints.containerMedium%>',
                    containerLarge: '<%= config.breakpoints.containerLarge%>',
                    containerXLarge: '<%= config.breakpoints.containerXLarge%>',
                }
            },
            'files': {
                '<%= preprocess.iea.dest %>': ['<%= preprocess.iea.dest %>'],
                '<%= config.app %>/sass/_<%= config.theme%>.scss': ['<%= config.app %>/sass/_base.scss'],
                '<%= config.app %>/sass/main.scss': ['<%= config.app %>/sass/_main.scss'],
                '<%= config.lib %>/sass/iea.scss': ['<%= config.lib %>/sass/_base.scss']
            }
        }
    };
}
