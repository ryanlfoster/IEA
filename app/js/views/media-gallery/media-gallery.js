/*global define*/

define(function() {

    'use strict';

    var MediaGallery = IEA.module('UI.media-gallery', function(module, app, iea) {

        _.extend(module, {

            onEnable: function() {

            },

            onPopupEnable: function() {


                // Popup open
                this.popup.on('popup:open', function() {

                });

                // Popup close
                this.popup.on('popup:close', function() {

                });

                // Popup change
                this.popup.on('popup:change', function() {

                });

                // Popup before close
                this.popup.on('popup:beforeClose', function() {

                });

                // Popup after close
                this.popup.on('popup:afterClose', function() {

                });

                // Methods can be used as
                // this.popup.next()
                // this.popup.prev()
            },

            onSliderEnable: function() {


                this.slider.on('slider:load', function(currentIndex){

                });

                //Events - before
                this.slider.on('slide:before', function(el, oldIndex, newIndex){

                });

                //Events - after
                this.slider.on('slide:after', function(el, oldIndex, newIndex){

                });

                //Events - next
                this.slider.on('slide:next', function(el, oldIndex, newIndex){

                });

                //Events - next
                this.slider.on('slide:prev', function(el, oldIndex, newIndex){

                });
            }

        });

    });

    return MediaGallery;
});
