module.exports = function(grunt, options) {
    return {
        server: {
            path: 'http://localhost:<%= port %>'
        },
        test: {
            path: 'http://localhost:<%= connect.test.options.port %>'
        }
    };
}
