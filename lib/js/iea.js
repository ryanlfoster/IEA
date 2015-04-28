/*global require*/

'use strict';

require.config({
    shim: {
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        'relational': {
            deps: ['backbone']
        },
        'paginator': {
            deps: ['backbone'],
            exports: 'Backbone.Paginator'
        },
        'bootstrap/affix': {
            exports: '$.fn.affix'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'underscore': {
            exports: '_'
        },
        'iea': {
            deps: ['backbone','waypoints']
        },
        'waypoints': {
            exports: 'waypoints'
        },
        'addthis': {
            exports: 'addthis'
        },
        'video': {
            deps: ['youTubeApi']
        },
        'youTubeApi': {
            exports: 'YT'
        },
        'masonry': {
            exports: 'masonry'
        },
        'imagesloaded': {
            exports: 'imagesloaded'
        },
        'enquire': {
            exports: 'enquire',
            deps: ['matchMedia', 'matchMediaaddListener']
        },
        'bridget': {
            exports: 'bridget'
        }

    },
    paths: {
        'jquery': '../js/libs/vendor/jquery/dist/jquery',
        'underscore': '../js/libs/vendor/underscore/underscore',
        'backbone': '../js/libs/vendor/backbone/backbone',

        'relational': '../js/libs/vendor/backbone-relational/backbone-relational',
        'layoutmanager': '../js/libs/vendor/layoutmanager/backbone.layoutmanager',
        'validation' : '../js/libs/iea/backbone.validation/dist/backbone-validation-amd',
        'paginator': '../js/libs/vendor/backbone.paginator/lib/backbone.paginator',

        'matchMedia': '../js/libs/iea/matchMedia.js-master/matchMedia',
        'matchMediaaddListener': '../js/libs/iea/matchMedia.js-master/matchMedia.addListener',
        'bootstrap': '../js/libs/vendor/sass-bootstrap/dist/js/bootstrap',
        'handlebars': '../js/libs/vendor/handlebars/handlebars.amd',
        'enquire': '../js/libs/vendor/enquire/dist/enquire',
        'picturefill': '../js/libs/iea/picturefill/picturefill',
        'imagesloaded': '../js/libs/vendor/imagesloaded/imagesloaded.pkgd',


        'iea': 'iea.core',
        'helpers': 'modules/helpers',
        'validator': 'modules/validator',
        'popup': 'services/popup',
        'slider': 'services/slider',
        'video': 'services/video',
        'tooltip': '../js/services/tooltip',

        'bxSlider': '../js/libs/vendor/bolster.bxSlider/jquery.bxslider.min',
        'bootstrap_tabcollapse': '../js/helpers/bootstrap-tabcollapse',
        'vimeoAPI': '../js/libs/iea/vimeo/jquery.vimeo.api.min',
        'waypoints': '../js/libs/vendor/jquery-waypoints/waypoints.min',
        'uniform': '../js/libs/vendor/jquery.uniform/jquery.uniform.min',
        'magnificPopup': '../js/libs/vendor/magnific-popup/dist/jquery.magnific-popup.min',
        'brightcoveVideo': '../js/libs/iea/brightcove/jquery.brightcove-video',
        'datepicker' : '../js/libs/vendor/bootstrap-datepicker/js/bootstrap-datepicker',
        'addthis': '../js/libs/iea/addthis/addthis_widget',
        'tooltipster': '../js/libs/vendor/tooltipster/js/jquery.tooltipster.min',
        'masonry': '../js/libs/vendor/masonry/dist/masonry.pkgd',
        'bridget': '../js/libs/vendor/jquery-bridget/jquery.bridget',
        'youTubeApi': '//youtube.com/iframe_api?',
        'twitterWidget' : '//platform.twitter.com/widgets',
        'brightcoveAPI': '//admin.brightcove.com/js/APIModules_all',
        'brightcoveExperience': '//admin.brightcove.com/js/BrightcoveExperiences'
    }
});
