module.exports = function(grunt, options) {
    return {
        options: {
            //Shared Options Hash
        },
        dev: {
            NODE_ENV: 'development',
            src : "config/config.js",
            DEST: '.tmp'
        },
        build: {
            NODE_ENV: 'production',
            src : "config/config.js",
            DEST: 'dist',
        }
    };
}
