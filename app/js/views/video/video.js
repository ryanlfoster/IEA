/*global define*/

define(function() {

    'use strict';

    var Video = IEA.module('UI.video', function(video, app, iea) {
        _.extend(video, {
            // Extension to enable method
            onEnable: function (instance) {
                var self = this;

                this.$el.find('.play').on('click', function(evt){
                    evt.preventDefault();
                    self.play();
                });

                this.$el.find('.pause').on('click', function(evt){
                    evt.preventDefault();
                    self.pause();
                });
            }
        });
    });

    return Video;
});
