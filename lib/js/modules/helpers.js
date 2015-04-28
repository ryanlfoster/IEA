/* jshint quotmark:false */

define([
    'handlebars'
], function(
    Handlebars
) {
    'use strict';

    var Helper = IEA.module('helpers', function(module, app, iea) {
        var helpers = {},
            self = this;

        this.stringify = function(obj) {
            if ("JSON" in window) {
                return JSON.stringify(obj);
            }

            var t = typeof(obj);
            if (t !== "object" || obj === null) {
                // simple data type
                if (t === "string") {
                    obj = '"' + obj + '"';
                }

                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [],
                    arr = (obj && obj.constructor === Array);

                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t === "string") {
                            v = '"' + v + '"';
                        } else if (t === "object" && v !== null) {
                            v = jQuery.stringify(v);
                        }

                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };

        // all the helpers for handlebar goes here.
        _.extend(helpers, {
            /**
             * Description
             * @method include
             * @param {} contextData
             * @param {} path
             * @param {} c
             * @return NewExpression
             */
            include: function(contextData, path, c) {
                var datas = app.getTemplate('include', path)(contextData);
                return new Handlebars.SafeString(datas);
            },

            /**
             * Description
             * @method ifCond
             * @param {} v1
             * @param {} v2
             * @param {} options
             * @return CallExpression
             */
            ifCond: function(v1, v2, options) {
                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * Checks if the val is present in set of multiVal
             * @method ifCond
             * @param {} multiVal
             * @param {} val
             * @param {} options
             * @return CallExpression
             */
            hasValue: function(multiVal, val, options) {
                var strArray = multiVal.split(',');

                if(strArray.indexOf($.trim(val)) !== -1) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            ifCondx: function(v1, operator, v2, options) {
                switch (operator) {
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },

            eachUpTo: function(ary, max, options) {
                if(!ary || ary.length === 0) {
                    return options.inverse(this);
                }

                var result = [ ];
                for(var i = 0; i < max && i < ary.length; ++i) {
                    result.push(options.fn(ary[i]));
                }
                return result.join('');
            },

            media: function(bp, options) {
                if (app.getCurrentBreakpoint() === bp) {
                    return options.fn(this);
                }
            },

            stringify: function(data, options) {
                return self.stringify(data);
            },

            /**
             * Description
             * @method adaptive
             * @param {} url
             * @param {} ext
             * @param {} alt
             * @param {} title
             * @param {} filename
             * @return NewExpression
             */
            adaptive: function(url, ext, alt, title, filename) {
                var parsedURL = [],
                    imageExtension = (typeof ext !== 'undefined' && ext !== '' && typeof ext !== 'object') ? ext : app.getValue('extension'),
                    imageMarkup = '';
                /*
                    url : http://www.engagednow.com/content/dam/engagednow/hero-idea.jpg
                    url" /content/engagewithadobe/en_us/events/jcr:content/flexi_hero_par/adaptiveimage

                    selector : enscale

                    filename: hero-idea
                    filename: ''

                    extension: .jpg

                    http://www.engagednow.com/content/dam/engagednow/hero-idea.jpg.enscale.hero-idea.full.high.jpg
                    /content/engagewithadobe/en_us/events/jcr:content/flexi_hero_par/adaptiveimage.enscale.full.high.jpg

                */

                parsedURL.push(url);

                if (app.getValue('selector')) {
                    parsedURL.push(app.getValue('selector'));
                }

                if (typeof filename !== 'undefined' && filename !== '' && typeof filename !== 'object') {
                    parsedURL.push(filename);
                }

                parsedURL = parsedURL.join('.');

                if (typeof title !== 'undefined' && title !== '' && typeof title !== 'object') {
                    imageMarkup = '<img class="' + title + '" src="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" title="' + title + '" alt="' + alt + '">';
                } else {
                    imageMarkup = '<img src="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" alt="' + alt + '">';
                }

                return new Handlebars.SafeString(
                    '<picture class="lazy-load is-loading">' +
                    '<!--[if IE 9]><video style="display: none;"><![endif]-->' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" media="' + app.getValue('breakpoints').desktop.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').tabletLandscape.prefix + imageExtension + '" media="' + app.getValue('breakpoints').tabletLandscape.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').tablet.prefix + imageExtension + '" media="' + app.getValue('breakpoints').tablet.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').mobileLandscape.prefix + imageExtension + '" media="' + app.getValue('breakpoints').mobileLandscape.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').mobile.prefix + imageExtension + '" media="' + app.getValue('breakpoints').mobile.media + '">' +
                    '<!--[if IE 9]></video><![endif]-->' +
                    imageMarkup +
                    '</picture>'
                );
            },

            /**
             * Description
             * @method debug
             * @param {} value
             * @return CallExpression
             */
            debug: function(value) {
                console.log('===============DEBUG START==================');
                console.log('Context: ', this);
                console.log('Value: ', value);
                return console.log('=============DEBUG END====================');
            }

        });

        // register all helpers from the helper object into handlebars
        /**
         * Description
         * @method registerHelpers
         * @param {} options
         * @return
         */
        this.registerHelpers = function(options) {
            options = options || {};
            for (var helper in helpers) {
                if (helpers.hasOwnProperty(helper)) {
                    Handlebars.registerHelper(helper, helpers[helper]);
                }
            }
            this.triggerMethod('helper:registered');
        };

        // add self init code to fire register helper when module loaded.
        this.addInitializer(this.registerHelpers);

    });

    return Helper;
});
