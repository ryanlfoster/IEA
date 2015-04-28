/*

Usage Example

// create new instance for popup
var popup = IEA.popup() // default configuraion
or
var popup = IEA.popup({type:inline}) // intialization with configuration

// open popup image
popup.open("http://path/to/image/jpg","image");

// open popup inline content
popup.open($('element'),'inline');

// open poup with IEA Model
var model = IEA.model([
      {
        src: 'path-to-image-1.jpg'
      },
      {
        src: 'http://vimeo.com/123123',
        type: 'iframe' // this overrides default type
      },
      {
        src: $('<div>Dynamically created element</div>'), // Dynamically created element
        type: 'inline'
      },
      {
        src: '<div>HTML string</div>',
        type: 'inline'
      },
      {
        src: '#my-popup', // CSS selector of an element on page that should be used as a popup
        type: 'inline'
      }
    ])
popup.open(model);

// close popup
popup.close();

//events
popup:open
popup:close
*/

define(['underscore',
    'iea',
    'magnificPopup'
], function(_,
    iea,
    MagnificPopup) {
    'use strict';

    // get a new service method reference to Popup.
    IEA.service('popup', function(service, app, iea) {

        // new popup class defenition

        /**
         * Description
         * @method Popup
         * @return ThisExpression
         */
        var Popup = function() {
            return this;
        };

        // extend Popup defenition prototype
        _.extend(Popup.prototype, {

            /**
             * Description
             * @method initialize
             * @param {} options
             * @return ThisExpression
             */
            initialize: function(options) {

                var self = this,
                    defaults = {
                        type: 'inline',
                        mainClass: 'iea-popup',
                        closeOnBgClick: true,
                        closeBtnInside: true,
                        closeMarkup: '<button title="%title%" class="mfp-close"><i class="mfp-close-icn icon-close-light">&times;</i></button>',
                        showCloseBtn: true,
                        enableEscapeKey: true,
                        modal: false,
                        fixedContentPos: 'auto',
                        midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                        ajax: {
                            settings: null, // Ajax settings object that will extend default one - http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings
                            // For example:
                            // settings: {cache:false, async:false}

                            cursor: 'mfp-ajax-cur', // CSS class that will be added to body during the loading (adds "progress" cursor)
                        },
                        iframe: {
                            markup: '<div class="mfp-iframe-scaler">'+
                                    '<button class="mfp-close"><i class="mfp-close-icn icon-close-light"></i></button>'+
                                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                                    '<div class="mfp-title">Some caption</div>'+
                                    '</div>'
                        },
                        // you may add other options here, e.g.:
                        preloader: true,

                        callbacks: {
                            beforeOpen: function () {
                                self.triggerMethod('popup:beforeOpen', self.instance);
                            },
                            open: function() {
                                // Attaching close button event
                                $('.mfp-close', self.instance.container).click(function() {
                                    self.close();
                                });
                                self.triggerMethod('popup:open', self.instance);
                            },
                            close: function() {
                                self.triggerMethod('popup:close', self.instance);
                            },
                            lazyLoad: function(item) {
                                self.triggerMethod('popup:lazyload', item, self.instance);
                            },
                            change: function (item) {
                                self.triggerMethod('popup:change', item, self.instance);
                            },
                            resize: function (item) {
                                self.triggerMethod('popup:resize', item, self.instance);
                            },
                            beforeClose: function (item) {
                                self.triggerMethod('popup:beforeClose', item, self.instance);
                            },
                            afterClose: function (item) {
                                self.triggerMethod('popup:afterClose', item, self.instance);
                            },
                            buildControls: function() {
                                // re-appends controls inside the main container
                                if(self.options.type === 'gallery') {
                                    this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
                                }
                            },
                            markupParse: function(template, values, item) {
                                //values.title = item.el.attr('title');
                            }
                        }
                    };

                if(typeof options !== 'undefined' && typeof options.type !== 'undefined' && options.type === 'gallery') {
                    defaults = _.extend(defaults, {
                        gallery: {
                            enabled: true, // set to true to enable gallery
                            preload: [1, 2], // read about this option in next Lazy-loading section
                            navigateByImgClick: true,
                            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-prevent-close %dir%"><i class="icon-arrow-%dir% mfp-prevent-close"></i></button>', // markup of an arrow button
                            tPrev: 'Previous (Left arrow key)', // title for left button
                            tNext: 'Next (Right arrow key)', // title for right button
                            tCounter: '<span class="mfp-counter">%curr% of %total%</span>' // markup of counter
                        }
                    });
                }

                this.options = _.extend(defaults, options);
                this.instance = $.magnificPopup.instance;

                return this;
            },

            /**
             * Description
             * @method open
             * @param {} el
             * @param {} type
             * @param {} options
             * @return ThisExpression
             */
            open: function(el, type, options) {
                var index = 0;

                // close currently open popup
                if(typeof this.instance !== 'undefined' && this.instance.isOpen) {
                    $.magnificPopup.instance.close();
                }

                // setup configuration and open the popup
                if(typeof el !== 'undefined') {
                    if(!isNaN(parseInt(el))) {
                        index = el;
                    } else {
                        this._setPopupData(el, type, options);
                    }
                }

                $.magnificPopup.open(this.options, index);

                this.instance = $.magnificPopup.instance;

                return this;
            },

            /**
             * Description
             * @method next
             * @return
             */
            next: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    this.instance.next();
                }
            },

            /**
             * Description
             * @method prev
             * @return
             */
            prev: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    this.instance.prev();
                }
            },

            /**
             * Description
             * @method getCurrentItem
             * @return
             */
            getCurrentItem: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    return this.instance.currItem;
                }
            },

            /**
             * Description
             * @method getCurrentItemIndex
             * @return
             */
            getCurrentItemIndex: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    return this.instance.index;
                }
            },

            /**
             * Description
             * @method goTo
             * @param {} index
             * @return
             */
            goTo: function (index) {
                this.instance = $.magnificPopup.instance;
                if(!this.instance.isOpen) {
                    this.open(index);
                } else {
                    this.instance.goTo(index);
                }

            },

            /**
             * Description
             * @method close
             * @return ThisExpression
             */
            close: function() {
                this.instance = $.magnificPopup.instance;
                if(typeof this.instance !== 'undefined') {
                    this.instance.close();
                }

                return this;
            },


             /* ----------------------------------------------------------------------------- *\
                 Private Methods
             \* ----------------------------------------------------------------------------- */

             /**
             * description
             * @method _setPopupData
             * @param {} el
             * @param {} type
             * @param {} options
             * @return
             */
            _setPopupData: function(el, type, options) {

                if (typeof type === 'undefined') {
                    type = 'inline';
                }

                if (_.isArray(el)) {
                    _.extend(this.options, {
                        items: el,
                        gallery: {
                            enabled: true
                        }
                    });

                } else if (el instanceof IEA.Model || el instanceof IEA.Collection) {
                    _.extend(this.options, {
                        items: el.toJSON(),
                        gallery: {
                            enabled: true
                        }
                    });

                } else if (el instanceof IEA.View) {
                    _.extend(this.options, {
                        items: {
                            src: el.render().$el,
                            type: type
                        }
                    });
                } else if (type === 'inline') {
                    _.extend(this.options, {
                        items: {
                            src: el,
                            type: type
                        }
                    });
                } else if (type === 'image') {
                    _.extend(this.options, {
                        items: {
                            src: el,
                            type: type
                        }
                    });
                }

                this.options = _.extend(this.options, options);
            }
        });

        return Popup;
    });
});
