module.exports = function(grunt, options) {
    return {
        version: '<%= package.version %>',
        corebanner: '// IEA\n' +
            '// ----------------------------------\n' +
            '// v<%= package.version %>\n' +
            '//\n' +
            '// Copyright (c)<%= grunt.template.today("yyyy") %> Sapient.com.\n' +
            '\n',
        banner: '<%= meta.corebanner %>\n' +
            '/*!\n' +
            ' */\n\n\n'
    };
}
