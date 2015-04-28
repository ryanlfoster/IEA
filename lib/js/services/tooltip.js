/*
Usage Example

//creating new instance of tootltip
var  tooltip = IEA.tooltip(element) // default configuration & element can be string or jQuery Object
ex. IEA.tooltip('.class-elem')
or
IEA.tooltip('#class-elem')
or
IEA.tooltip($('.class-elem')
NOTE: to use it with default config, do add 'title' attribute to your HTML element
or
var  tooltip = IEA.tooltip(element, {theme: 'my-custom-theme'}) // initialization with congiruation

//creating new instance of tootltip with content as markup
var  tooltip = IEA.tooltip(element, {content: '<div> Tooltip content as markup</div>', contentAsMarkup: true})

// creating tooltip instance with cross icon
var  tooltip = IEA.tooltip(element, {trigger: 'click'})

//public methods
tooltip.show();
tooltip.hide();
tooltip.disable();
tooltip.enable();
tooltip.destroy()
tooltip.content();
tooltip.updateContent();
tooltip.reposition();
tooltip.getTooltipElement();
tooltip.getIconElement();

//Events

*/

define(['underscore',
    'iea',
    'tooltipster'
], function(_,
    IEA,
    Tooltipster) {

    'use strict';

    // get a new service method reference to Tooltip.
    IEA.service('tooltip', function(service, app, iea) {

        // new tooltip class defenition

        /**
        * Description
        * @method Tooltip
        * @return ThisExpression
        */
        var Tooltip = function(options) {
            return this;
        };

        // extend Tooltip defenition prototype
        _.extend(Tooltip.prototype, {

            initialize: function(element, options) {

                // Checking for the type of element to make it compatible
                if($.type(element) === 'string') {
                    this.element  = $(element);
                } else {
                    this.element  = element;
                }

                var self = this;
                var defaults = {
                    animation: 'fade',
                    arrow: true,
                    arrowColor: '',
                    autoClose: true,
                    content: null,
                    contentAsHTML: false,
                    contentCloning: true,
                    debug: true,
                    delay: 200,
                    minWidth: 0,
                    maxWidth: null,
                    icon: '(?)',
                    //If you provide a jQuery object to the 'icon' option, this sets if it is a clone of this object that should actually be used.
                    iconCloning: true,
                    //Generate an icon next to your content that is responsible for activating the tooltip on non-touch devices
                    iconDesktop: false,
                    iconTheme: 'tooltipster-icon',
                    iconTouch: false,
                    interactive: false,
                    interactiveTolerance: 350,
                    multiple: false,
                    offsetX: 0,
                    offsetY: 0,
                    onlyOne: false,
                    position: 'bottom',
                    speed: 350,
                    timer: 0,
                    theme: 'tooltipster-default',
                    touchDevices: true,
                    trigger: 'hover',
                    updateAnimation: true,
                    contentAsMarkup: false,

                    //Create a custom function to be fired only once at instantiation
                    functionInit: function(origin, content) {
                        self.triggerMethod('tooltip:init', origin, content);
                    },
                    //Create a custom function to be fired before the tooltip opens
                    functionBefore: function(origin, continueTooltip) {
                        continueTooltip();
                        self.triggerMethod('tooltip:before', origin, self);
                    },
                    //Create a custom function to be fired once the tooltip has been closed and removed from the DOM
                    functionAfter: function(origin) {
                        self.triggerMethod('tooltip:after', origin);
                    },
                    //Create a custom function to be fired when the tooltip and its contents have been added to the DOM
                    functionReady: function(origin, tooltip) {
                        self.triggerMethod('tooltip:ready', origin, tooltip, self);
                    }

                };

                this.options = _.extend(defaults, options);

                // If content is markup
                if(this.options.contentAsMarkup) {
                    this.options.content = $(this.options.content);
                }

                this._checkForCrossIcon();
                this.instance = this.element.tooltipster(this.options);

                return this;
            },


            /**
             * Checks for the trigger option if it is click then only add the icon
             * @method show
             * @return
             */
            _checkForCrossIcon: function() {
                var self = this;
                //If trigger is click add closs icon to let it close
                if(this.options.trigger === 'click') {
                    var crossIcon = $('<span class="cross-icon-tooltip"><i class="icon-close-light"></i></span>');

                    this.options.content.append(crossIcon);

                    // attaching event to cross icon
                    this.options.content.find('.cross-icon-tooltip').click(function() {
                        self.hide();
                    });

                    this.options.autoClose = false;
                    this.options.interactive = true;
                }
            },

            /**
             * Displays tooltip and callback is called
             * @method show
             * @return
             */
            show: function(callback) {
                this.element.tooltipster('show', callback);
                this.triggerMethod('tooltip:show');
            },

            /**
             * Hides tooltip and callback is called
             * @method hide
             * @return
             */
            hide: function(callback) {
                this.element.tooltipster('hide', callback);
                this.triggerMethod('tooltip:hide');
            },

            /**
             * Temporarily disable a tooltip from being able to open
             * @method disable
             * @return
             */
            disable: function() {
                this.element.tooltipster('disable');
                this.triggerMethod('tooltip:disable');
            },

            /**
             * If a tooltip was disabled from opening, reenable its previous functionality
             * @method enable
             * @return
             */
            enable: function() {
                this.element.tooltipster('enable');
                this.triggerMethod('tooltip:enable');
            },

            /**
             * Hide and destroy tooltip functionality
             * @method destroy
             * @return
             */
            destroy: function() {
                this.element.tooltipster('destroy');
                this.triggerMethod('tooltip:destroy');
            },

            /**
             * Return a tooltip's current content (if selector contains multiple origins, only the value of the first will be returned)
             * @method content
             * @return String
             */
            content: function() {
                return this.element.tooltipster('content');
            },

            /**
             * Update tooltip content
             * @method updateContent
             * @return
             */
            updateContent: function(newContent) {
                this.element.tooltipster('content', newContent);
                this.triggerMethod('tooltip:updateContent');
            },

            /**
             * Reposition and resize the tooltip
             * @method reposition
             * @return
             */
            reposition: function() {
                this.element.tooltipster('reposition');
                this.triggerMethod('tooltip:reposition');
            },

            /**
             * Return the HTML root element of the tooltip
             * @method getTooltipElement
             * @return HTML Element
             */
            getTooltipElement: function() {
                return this.element.tooltipster('elementTooltip');
            },

            /**
             * Return the HTML root element of the icon if there is one, 'undefined' otherwise
             * @method getIconElement
             * @return HTML Element
             */
            getIconElement: function() {
                return this.element.tooltipster('elementIcon');
            }
        });

        return Tooltip;
    });

});
