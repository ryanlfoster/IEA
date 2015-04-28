module.exports = function (grunt, options) {
    return {
            /********************************************************************************************************/
            iea: ['<%= config.app %>/js/libs/iea/core'],
            iearesidue: ['<%= config.app %>/js/libs/iea/core/js/iea.core.js','<%= config.app %>/js/libs/iea/core/js/iea.templates.js'],
            /********************************************************************************************************/
            app: ['.tmp'],
            dist: ['<%= config.dist %>/*'],
            /********************************************************************************************************/
            cq: ['<%= config.dist %>/*','!<%= config.dist %>/etc']
        };
}
