/*global define*/

define(function() {

    'use strict';

    var Carousel = IEA.module('UI.carousel', function(carousel, app, iea) {


        _.extend(carousel, {
            onInit: function() {
                this.updateSetting({
                    touchEnabled: false
                });
            },

            onEnable: function() {

                var self = this;

                //Method - distroy
                this.$el.find('.carousel-destroy').on('click', function(evt) {
                    evt.preventDefault();
                    self.destroy();
                });

                //Method - Reload
                this.$el.find('.carousel-reload').on('click', function(evt) {
                    evt.preventDefault();
                    self.reload();
                });

                //Method - getCurrentSlide
                this.$el.find('.carousel-slideNumber').on('click', function(evt) {
                    evt.preventDefault();
                    //alert('Slide Number: ' + self.getCurrentSlide());
                });

                //Method - getSlideCount
                this.$el.find('.carousel-slideCount').on('click', function(evt) {
                    evt.preventDefault();
                    //alert('Total slide: ' + self.getSlideCount());
                });

                //Method - Play
                this.$el.find('.carousel-play').on('click', function(evt) {
                    evt.preventDefault();
                    self.play();
                });

                //Method - Pause
                this.$el.find('.carousel-pause').on('click', function(evt) {
                    evt.preventDefault();
                    self.pause();
                });

                //Method - Next
                this.$el.find('.carousel-next').on('click', function(evt) {
                    self.slider.pause();
                    if ((self.getCurrentSlide() + 1) < self.getSlideCount()) {
                        self.goToSlide(self.getCurrentSlide() + 1);
                    } else {
                        self.goToSlide(0);
                    }
                    evt.preventDefault();
                });

                //Events - load
                self.slider.on('slider:load', function(currentIndex) {

                });

                //Events - before
                self.slider.on('slide:before', function(el, oldIndex, newIndex) {

                });

                //Events - after
                self.slider.on('slide:after', function(el, oldIndex, newIndex) {

                });

                //Events - next
                self.slider.on('slide:next', function(el, oldIndex, newIndex) {

                });

                //Events - next
                self.slider.on('slide:prev', function(el, oldIndex, newIndex) {

                });



            }

        });

    });

    return Carousel;
});
