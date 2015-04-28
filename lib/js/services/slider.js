/*
Usage Example

//creating new instance of slider
var  slider = IEA.slider(element, config) // default configuration
or
var  slider = IEA.slider(elemnt, {auto: true}) // initialization with congiruation

// start the carousel
slider.enable();

//public methods
slider.disable();
slider.distroy();
slider.reload(); // just reload with set config
slider.reload({auto: false}); // reload the carousel with new configuration
slider.getCurrentSlide();
slider.getSlideCount();
slider.play();
slider.pause()

//Events
slider:load
slide:before
slide:after
slide:next
slide:prev
*/


define(['underscore',
    'iea',
    'bxSlider'
], function(_,
    iea,
    BXSlider) {
    'use strict';

    IEA.service('slider', function(service, app, iea) {

        /**
         * Slider class
         * @method Slider
         * @param {} options
         * @return ThisExpression
         */
        var Slider = function(options) {
            this.pluginName = 'bxSlider';
            this.isLoaded = false;
            return this;
        };

        // extend abstract Slider into iea Slider to give it more power.
        _.extend(Slider.prototype, {

            /**
             * slider intialize function
             * @method initialize
             * @param {jquery|string} el
             * @param {object} options
             * @return ThisExpression
             */
            initialize: function(el, options) {
                var self = this,
                    defaultSetting = {
                        // carousel settings
                        mode: 'horizontal',
                        speed: 500,
                        slideMargin: 0,
                        startSlide: 0,
                        randomStart: false,
                        slideSelector: '',
                        infiniteLoop: true,
                        hideControlOnEnd: false,
                        easing: 'easeInOutQuint',
                        captions: false,
                        ticker: false,
                        tickerHover: false,
                        adaptiveHeight: false,
                        adaptiveHeightSpeed: 500,
                        video: false,
                        responsive: true,
                        useCSS: true,
                        preloadImages: 'visible',
                        touchEnabled: true,
                        swipeThreshold: 50,
                        oneToOneTouch: true,
                        preventDefaultSwipeX: true,
                        preventDefaultSwipeY: false,

                        // pager settings
                        pager: true,
                        pagerType: 'full',
                        pagerShortSeparator: '/',
                        pagerSelector: '',
                        pagerCustom: null,
                        buildPager: null,

                        // control settings
                        controls: true,
                        nextText: '<i class="icon-arrow-right"></i>',
                        prevText: '<i class="icon-arrow-left"></i>',
                        /*nextSelector: null,
                        prevSelector: null,*/
                        autoControls: false,
                        startText: 'Start',
                        stopText: 'Stop',
                        autoControlsCombine: false,
                        autoControlsSelector: null,

                        auto: true,
                        pause: 4000,
                        autoStart: true,
                        autoDirection: 'next',
                        autoHover: false,
                        autoDelay: 0,
                        minSlides: 1,
                        maxSlides: 1,
                        moveSlides: 0,
                        slideWidth: 0,

                        //Callbacks

                        onSliderLoad: function(currentIndex) {
                            if(!self.isLoaded) {
                                self.triggerMethod('slider:load', currentIndex);
                                self.isLoaded = true;
                            }
                        },
                        onSlideBefore: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:before', $slideElement, oldIndex, newIndex);
                        },
                        onSlideAfter: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:after', $slideElement, oldIndex, newIndex);
                        },
                        onSlideNext: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:next', $slideElement, oldIndex, newIndex);
                        },
                        onSlidePrev: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:prev', $slideElement, oldIndex, newIndex);
                        },

                        // custom options
                        thumbnails: true

                    };

                this.options = _.extend(defaultSetting, options);
                this.$el = (el.jquery) ? el : $(el);

                this.pluginMethods = {
                    destroy: 'destroySlider',
                    reload: 'reloadSlider',
                    slideCount: 'getSlideCount',
                    currentSlide: 'getCurrentSlide',
                    goToSlide: 'goToSlide',
                    goToNextSlide: 'goToNextSlide',
                    goToPrevSlide: 'goToPrevSlide',
                    startAuto: 'startAuto',
                    stopAuto: 'stopAuto',
                    redraw: 'redrawSlider'
                };

                return this;
            },

            /**
             * Slider enable
             * @method enable
             * @param {object} options
             * @return ThisExpression
             */
            enable: function(options) {
                if (typeof options === 'object') {
                    this.options = _.extend(this.options, options);
                }

                /*if(this.options.thumbnails) {
                    this.options.pagerCustom = this._createImagePager();
                }*/

                this.instance = this.$el[this.pluginName](this.options);
                this.isSliderEnabled = true;

                //this._registerpluginMethods();
                // /_.extend(this, this.instance);

                return this;
            },

            /**
             * disable slider
             * @method disable
             * @return
             */
            disable: function() {
                this.pause();
            },

            /**
             * destroy slider
             * @method destroy
             * @return
             */
            destroy: function() {
                var self = this;
                if (_.isFunction(this.instance[this.pluginMethods.destroy])) {
                    setTimeout(function() {
                        self.instance[self.pluginMethods.destroy]();
                    }, 100);

                    return true;
                }
            },

            /**
             * reload slider
             * @method reload
             * @return
             */
            reload: function(options) {
                if (typeof options === 'object') {
                    this.options = _.extend(this.options, options);
                }

                if (_.isFunction(this.instance[this.pluginMethods.reload])) {
                    return this.instance[this.pluginMethods.reload](this.options);
                }
            },

            /**
             * get the current slider slide
             * @method getCurrentSlide
             * @return
             */
            getCurrentSlide: function() {
                if (_.isFunction(this.instance[this.pluginMethods.currentSlide])) {
                    return this.instance[this.pluginMethods.currentSlide]();
                }
            },

            /**
             * get slider slide count
             * @method getSlideCount
             * @return
             */
            getSlideCount: function() {
                if (_.isFunction(this.instance[this.pluginMethods.slideCount])) {
                    return this.instance[this.pluginMethods.slideCount]();
                }
            },

            /**
             * go to slide based on index
             * @method goToSlide
             * @return
             */
            goToSlide: function(index) {
                if (_.isFunction(this.instance[this.pluginMethods.goToSlide])) {
                    return this.instance[this.pluginMethods.goToSlide](index);
                }
            },

            /**
             * get correct slide index
             * @method currentSlide
             * @return
             */
            currentSlide: function() {
                if (_.isFunction(this.instance[this.pluginMethods.currentSlide])) {
                    return this.instance[this.pluginMethods.currentSlide]();
                }
            },

            /**
             * play slider
             * @method play
             * @return
             */
            play: function() {
                if (_.isFunction(this.instance[this.pluginMethods.startAuto])) {
                    return this.instance[this.pluginMethods.startAuto]();
                }
            },

            /**
             * pause slider
             * @method pause
             * @return
             */
            pause: function() {
                if (_.isFunction(this.instance[this.pluginMethods.stopAuto])) {
                    return this.instance[this.pluginMethods.stopAuto]();
                }
            },

            /**
             * create pager for slider
             * @method _createImagePager
             * @return
             */
            _createImagePager: function() {

            },

            /**
             * register all the plugin methods into the IEA.slider service
             * @method _registerpluginMethods
             * @return
             */
            _registerpluginMethods: function() {

                for (var method in this.pluginMethods) {
                    _.extend(this, this.instance[method]);
                }
            },

            /**
             * redraw slider
             * @method _redraw
             * @return
             */
            redraw: function() {
                if (_.isFunction(this.instance[this.pluginMethods.redraw])) {
                    return this.instance[this.pluginMethods.redraw]();
                }
            }

        });

        return Slider;
    });
});
