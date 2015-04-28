/*jshint bitwise:false */

define([
    'iea',
    'validation',
], function(
    IEA,
    Validation
) {
    'use strict';

    var Validator = IEA.module('form.validator', function(module, app, iea) {

        // Validate the card number based on prefix (IIN ranges) and length
        var cards = {
            AMERICAN_EXPRESS: {
                length: [15],
                prefix: ['34', '37']
            },
            DINERS_CLUB: {
                length: [14],
                prefix: ['300', '301', '302', '303', '304', '305', '36']
            },
            DINERS_CLUB_US: {
                length: [16],
                prefix: ['54', '55']
            },
            DISCOVER: {
                length: [16],
                prefix: ['6011', '622126', '622127', '622128', '622129', '62213',
                    '62214', '62215', '62216', '62217', '62218', '62219',
                    '6222', '6223', '6224', '6225', '6226', '6227', '6228',
                    '62290', '62291', '622920', '622921', '622922', '622923',
                    '622924', '622925', '644', '645', '646', '647', '648',
                    '649', '65'
                ]
            },
            JCB: {
                length: [16],
                prefix: ['3528', '3529', '353', '354', '355', '356', '357', '358']
            },
            LASER: {
                length: [16, 17, 18, 19],
                prefix: ['6304', '6706', '6771', '6709']
            },
            MAESTRO: {
                length: [12, 13, 14, 15, 16, 17, 18, 19],
                prefix: ['5018', '5020', '5038', '6304', '6759', '6761', '6762', '6763', '6764', '6765', '6766']
            },
            MASTERCARD: {
                length: [16],
                prefix: ['51', '52', '53', '54', '55']
            },
            SOLO: {
                length: [16, 18, 19],
                prefix: ['6334', '6767']
            },
            UNIONPAY: {
                length: [16, 17, 18, 19],
                prefix: ['622126', '622127', '622128', '622129', '62213', '62214',
                    '62215', '62216', '62217', '62218', '62219', '6222', '6223',
                    '6224', '6225', '6226', '6227', '6228', '62290', '62291',
                    '622920', '622921', '622922', '622923', '622924', '622925'
                ]
            },
            VISA: {
                length: [16],
                prefix: ['4']
            }
        };

        _.extend(this, Backbone.Validation);

        Backbone.Validation.configure({
            selector: 'form-validate'
        });

        Backbone.Validation.helpers = {
            /**
             * Execute a callback function
             *
             * @param {String|Function} functionName Can be
             * - name of global function
             * - name of namespace function (such as A.B.C)
             * - a function
             * @param {Array} args The callback arguments
             */
            call: function(functionName, args) {
                if ('function' === typeof functionName) {
                    return functionName.apply(this, args);
                } else if ('string' === typeof functionName) {
                    if ('()' === functionName.substring(functionName.length - 2)) {
                        functionName = functionName.substring(0, functionName.length - 2);
                    }
                    var ns = functionName.split('.'),
                        func = ns.pop(),
                        context = window;
                    for (var i = 0; i < ns.length; i++) {
                        context = context[ns[i]];
                    }

                    return (typeof context[func] === 'undefined') ? null : context[func].apply(this, args);
                }
            },

            /**
             * Format a string
             * It's used to format the error message
             * format('The field must between %s and %s', [10, 20]) = 'The field must between 10 and 20'
             *
             * @param {String} message
             * @param {Array} parameters
             * @returns {String}
             */
            format: function(message, parameters) {
                if (!$.isArray(parameters)) {
                    parameters = [parameters];
                }

                for (var i in parameters) {
                    message = message.replace('%s', parameters[i]);
                }

                return message;
            },

            /**
             * Validate a date
             *
             * @param {Number} year The full year in 4 digits
             * @param {Number} month The month number
             * @param {Number} day The day number
             * @param {Boolean} [notInFuture] If true, the date must not be in the future
             * @returns {Boolean}
             */
            date: function(year, month, day, notInFuture) {
                if (isNaN(year) || isNaN(month) || isNaN(day)) {
                    return false;
                }
                if (day.length > 2 || month.length > 2 || year.length > 4) {
                    return false;
                }

                day = parseInt(day, 10);
                month = parseInt(month, 10);
                year = parseInt(year, 10);

                if (year < 1000 || year > 9999 || month <= 0 || month > 12) {
                    return false;
                }
                var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                // Update the number of days in Feb of leap year
                if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                    numDays[1] = 29;
                }

                // Check the day
                if (day <= 0 || day > numDays[month - 1]) {
                    return false;
                }

                if (notInFuture === true) {
                    var currentDate = new Date(),
                        currentYear = currentDate.getFullYear(),
                        currentMonth = currentDate.getMonth(),
                        currentDay = currentDate.getDate();
                    return (year < currentYear || (year === currentYear && month - 1 < currentMonth) || (year === currentYear && month - 1 === currentMonth && day < currentDay));
                }

                return true;
            },

            /**
             * Implement Luhn validation algorithm
             * Credit to https://gist.github.com/ShirtlessKirk/2134376
             *
             * @see http://en.wikipedia.org/wiki/Luhn
             * @param {String} value
             * @returns {Boolean}
             */
            luhn: function(value) {
                var length = value.length,
                    mul = 0,
                    prodArr = [
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
                    ],
                    sum = 0;

                while (length--) {
                    sum += prodArr[mul][parseInt(value.charAt(length), 10)];
                    mul ^= 1;
                }

                return (sum % 10 === 0 && sum > 0);
            },

            /**
             * Implement modulus 11, 10 (ISO 7064) algorithm
             *
             * @param {String} value
             * @returns {Boolean}
             */
            mod11And10: function(value) {
                var check = 5,
                    length = value.length;
                for (var i = 0; i < length; i++) {
                    check = (((check || 10) * 2) % 11 + parseInt(value.charAt(i), 10)) % 10;
                }
                return (check === 1);
            },

            /**
             * Implements Mod 37, 36 (ISO 7064) algorithm
             * Usages:
             * mod37And36('A12425GABC1234002M')
             * mod37And36('002006673085', '0123456789')
             *
             * @param {String} value
             * @param {String} [alphabet]
             * @returns {Boolean}
             */
            mod37And36: function(value, alphabet) {
                alphabet = alphabet || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var modulus = alphabet.length,
                    length = value.length,
                    check = Math.floor(modulus / 2);
                for (var i = 0; i < length; i++) {
                    check = (((check || modulus) * 2) % (modulus + 1) + alphabet.indexOf(value.charAt(i))) % modulus;
                }
                return (check === 1);
            }
        };

        // Extend the callbacks to work with Bootstrap, as used in this example
        // See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
        _.extend(Backbone.Validation.callbacks, {
            valid: function(view, attr, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');
                if($group.children('.multivalue').length > 0) {
                    var $parent = $('input[name='+attr+']').parents('.multivalue-field');
                    $parent.removeClass('has-error');
                    $parent.find('.help-block').html('').addClass('hidden');
                } else {
                    $group.removeClass('has-error');
                    $group.find('.help-block').html('').addClass('hidden');
                }
            },

            invalid: function(view, attr, error, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');

                if($group.children('.multivalue').length > 0) {
                    var $parent = $('input[name='+attr+']').parents('.multivalue-field');
                    $parent.addClass('has-error');
                    $parent.find('.help-block').html(error).removeClass('hidden');
                } else {
                    $group.addClass('has-error');
                    $group.find('.help-block').html(error).removeClass('hidden');
                }


            }
        });

        // add custom validators
        _.extend(Backbone.Validation.validators, {
            required: function(value, attr, required, model, computed) {

                var isCheckbox = $('[name=' + attr + ']:checkbox', model.$el);
                var isRequired = _.isFunction(required) ? required.call(model, value, attr, computed) : required;

                if (!isRequired && !value) {
                    return false;
                }

                if (isCheckbox.length && !isCheckbox.filter(':checked').length) {
                    return true;
                }

                if (isRequired && !value) {
                    return true;
                }
            },

            cvv: function(value, attr, options, model, computed) {

                if (value === '') {
                    return true;
                }

                if (!Backbone.Validation.patterns.cvv.test(value)) {
                    return true;
                }
            },

            xss: function(value, attr, options, model, computed) {

                if (Backbone.Validation.patterns.xss.test(value)) {
                    return true;
                }
            },

            creditcard: function(value, attr, options, model, computed) {
                var type, i;

                if (value === '') {
                    return true;
                }

                // Accept only digits, dashes or spaces
                if (/[^0-9-\s]+/.test(value)) {
                    return true; //error
                }

            //    value = value.replace(/\D/g, '');

                if (!Backbone.Validation.helpers.luhn(value)) {
                    return true; // error
                }

                for (type in cards) {
                    for (i in cards[type].prefix) {
                        if (value.substr(0, cards[type].prefix[i].length) === cards[type].prefix[i] && $.inArray(value.length, cards[type].length) !== -1) // and length
                        {
                            return false; // valid card
                        }
                    }
                }

                return true; //its an invalid card
            },
        });

        // application level patterns for validation added
        _.extend(Backbone.Validation.patterns, {
            cvv: /^[0-9]{3,4}$/,
            xss: /<[^<]+?>/
        });

        /* ----------------------------------------------------------------------------- *\
           Public Methods
        \* ----------------------------------------------------------------------------- */

        this.addRules = function(view, validation) {
            var model = validation.model || view.model;

            if (typeof model !== 'undefined') {

                // if the model does not have a validation object, then add it and then add the rules
                // otherwise just keep on adding new rules into the validation object.
                if (typeof model.validation === 'undefined') {
                    _.extend(model, {
                        validation: validation.rules
                    });
                } else {
                    _.extend(model.validation, validation.rules);
                }
            }
        };

        this.addValidation = function(view, options) {
            Backbone.Validation.bind(view, options);
        };

        this.removeValidation = function(view, options) {
            Backbone.Validation.bind(view, options);
        };

    });

    return Validator;
});
