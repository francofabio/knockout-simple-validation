/*
 * knockout-simple-validation v1.0.1 - 2015-05-09
 * Copyright (c) 2015 Binar Tecnologia;
 */
// Source: src/ksv.js
/*
 * Simple model validation for knockout.
 * Dependencies: jquery, knockout, moment, jscommons
 */
(function(factory) {
    'use strict';
    /* global require:false, module:false, exports:false, define:false */
    /* jshint -W067 */
    //Knockout solution based
    var window = this || (0, eval)('this');

    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target, require('jquery'), require('knockout'), require('moment'));
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports', 'jquery', 'knockout', 'moment'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory((window['ksv'] = {}), jQuery, ko, moment);
    }
}(function(exports, $, ko, moment) {
    'use strict';
    var ksv = (typeof(exports) !== "undefined") ? exports : {};

    ksv.settings = (function() {
        return {
            lang: 'en',
            applyInvalidValue: false,
            validationOnInit: false,
            getLang: function() {
                var lang = ksv.settings.lang;
                if (typeof(lang) === 'function') {
                    lang = lang();
                }
                return lang;
            },
            dateFormat: 'DD/MM/YYYY'
        };
    })();
    /**
     * Utility functions for ksv
     */
    ksv.utils = {
        debug: function(val) {
            if (ksv.utils.debug.enable) {
                console.log(val);
            }
        },
        isObject: function(instance) {
            return typeof(instance) === 'object';
        },
        get: function(obj, property) {
            if (!obj || !ksv.utils.isObject(obj)) {
                return undefined;
            }
            var pathToProperty = property.split('.');
            var value = obj;
            for (var i = 0; i < pathToProperty.length; i++) {
                var path = pathToProperty[i];
                if (value.hasOwnProperty(path)) {
                    value = value[path];
                    if (value === null || value === undefined) {
                        return undefined;
                    }
                } else {
                    return undefined;
                }
            }
            return value;
        },
        exists: function(obj, property) {
            if (ksv.utils.isObject(obj)) {
                var val = ksv.utils.get(obj, property);
                return val !== undefined;
            }
            return false;
        }
    };
    ksv.utils.debug.enable = false;

    /**
     * The validation notification center
     */
    ksv.notification = (function() {
        var subscribes = [];

        function ObservableInstance(obj) {
            this.obj = obj;
        }
        ObservableInstance.prototype.validatable = function () {
            var rules, name, value;
            if (typeof(arguments[0]) === 'string') {
                name = arguments[0];
                rules = arguments[1];
                value = arguments[2];
            } else {
                rules = arguments[0];
                value = arguments[1];
            }
            var validatorOptions = Object.create(rules);
            if (!validatorOptions.hasOwnProperty('params')) {
                validatorOptions.params = {};
            }
            validatorOptions.params['owner'] = this.obj;
            if (name) {
                validatorOptions.params['name'] = name;
            }
            return ko.observable(value).extend({validator: validatorOptions});
        };

        return {
            subscribe: function(fn, obj) {
                var subs = {fn: fn};
                if (obj) {
                    subs['owner'] = obj;
                }
                subscribes.push(subs);
                return subs;
            },
            unsubscribe: function(subs) {
                subscribes.pop(subs);
            },
            observeValidations: function(obj) {
                obj.__validationObserver__ = ko.observableArray([]);
                return obj.__validationObserver__;
            },
            makeObservable: function(obj, validationParams) {
                obj.validationParams = validationParams;
                obj.errors = ksv.notification.observeValidations(obj);
                obj.isValidationInitialized = ko.observable(false);
                obj.isValid = ko.pureComputed(function() {
                    if (!obj.isValidationInitialized()) {
                        return false;
                    }
                    return obj.errors().length === 0;
                }, obj);
                return new ObservableInstance(obj);
            },
            notify: function(target, owner, rule, instanceId, valid, message, name) {
                /* jshint shadow:true */ //Disable lint for use i in multiples for loop
                //Notify object
                if (owner && typeof(owner.validationNotification) === 'function') {
                    owner.validationNotification.call(owner, target, rule, instanceId, valid, message, name);
                }
                //Update validation observer
                if (owner && ko.isObservable(owner.isValidationInitialized)) {
                    owner.isValidationInitialized(true);
                }
                if (owner && ko.isObservable(owner.__validationObserver__)) {
                    var validationObserver = owner.__validationObserver__;
                    if (valid) {
                        validationObserver.remove(function(item) {
                            return item.instanceId === instanceId;
                        });
                    } else {
                        var exists = false;
                        var validationArray = validationObserver();
                        for (var x = 0; x < validationArray.length; x++) {
                            var item = validationArray[x];
                            if (item.instanceId === instanceId) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            validationObserver.push({
                                instanceId: instanceId,
                                rule: rule,
                                owner: owner,
                                target: target,
                                name: name,
                                message: message
                            });
                        }
                    }
                }
                //Notify subscribes
                for (var i = 0; i < subscribes.length; i++) {
                    var subscribe = subscribes[i];
                    if ('owner' in subscribe) {
                        /* jshint -W116 */ //Ignore hint to use simple equals (==)
                        if (subscribe.owner == owner) {
                            subscribe.fn(target, owner, rule, instanceId, valid, message, name);
                        }
                    } else {
                        subscribe.fn(target, owner, rule, instanceId, valid, message, name);
                    }
                }
            }
        };
    })();
    ksv.rules = (function(notification, utils) {
        var rules = {};
        /*
         * Store the rules messages:
         * {
         *   'lang': {
         *     'rule': 'message' //Without variation  
         *     'rule': { //With variation  
         *       'variation1': 'validation message'
         *     }
         *   }
         * }
         */
        var messages = {};

        var uniqueId = (function() {
            var id = 0;
            return function() {
                return ++id;
            };
        })();

        function resolveVars(message, context) {
            /* jshint -W061 */ //Ignore hint for eval use
            /* jshint unused:false */ //Ignore unused hint
            //context vars
            var lang = context.lang;
            var value = context.value;
            var params = context.params;
            var data = context.data;

            var result = [];
            var inVar = false;
            var varName = [];
            var oldChar = null;
            for (var i=0; i < message.length; i++) {
                var chr = message.charAt(i);
                if (chr === '{' && oldChar === '$') {
                    inVar = true;
                } else if (chr === '}') {
                    //remove the $ character
                    result.pop();
                    result.push(eval(varName.join('')));
                    varName = [];
                    inVar = false;
                } else if (inVar) {
                    varName.push(chr);
                } else {
                    result.push(chr);
                }
                oldChar = chr;
            }
            return result.join('');
        }

        function getMessagesForRule(ruleName, lang) {
            utils.debug('getting messages for rule ' + ruleName + ' and lang ' + lang);
            utils.debug('messages: ' + JSON.stringify(messages));
            if (messages[lang]) {
                return messages[lang][ruleName];
            } else {
                return (messages['default'] && messages['default'][ruleName]);
            }
        }

        function resolveMessageFromObject(messages, variation, context) {
            utils.debug('resolving message from object. variation: ' + variation + ', messages: ' + JSON.stringify(messages));
            var message = utils.get(messages, variation);
            if (message) {
                return resolveVars(message, context);
            }
            return undefined;
        }

        function evalMessage(message, ruleName, lang, variation, value, params, data) {
            var context = {
                lang: lang,
                value: value,
                params: params,
                data: data
            };
            switch (typeof(message)) {
                case 'string':
                    return resolveVars(message, context);
                case 'function':
                    return message(lang, variation, value, params, data);
                case 'object':
                    return resolveMessageFromObject(message, variation, context);
            }
            return undefined;
        }

        function resolveMessage(ruleName, ruleSettings, lang, variation, value, params, data) {
            if (ruleSettings.messageResolve) {
                return ruleSettings.messageResolve(ruleName, ruleSettings, lang, variation, value, params, data);
            }
            utils.debug('resolve message for rule ' + ruleName + '. lang: ' + lang + ', variation: ' + variation);
            if (utils.exists(params, 'message')) {
                utils.debug('using message from validation parameters');
                var paramMessage = params.message;
                //Check for needs merge to the message with registered and default messages
                var registeredMessages = getMessagesForRule(ruleName, lang);
                if (utils.isObject(paramMessage) && utils.isObject(registeredMessages)) {
                    paramMessage = $.extend(true, {}, registeredMessages, paramMessage);
                }
                if (utils.isObject(paramMessage) && utils.isObject(ruleSettings.defaultMessage)) {
                    paramMessage = $.extend(true, {}, ruleSettings.defaultMessage, paramMessage);
                }
                return evalMessage(paramMessage, ruleName, lang, variation, value, params, data);
            } else {
                //Registered messages
                var message = evalMessage(getMessagesForRule(ruleName, lang), ruleName, lang, variation, value, params, data);
                if (!message) {
                    utils.debug('using default message: ' + JSON.stringify(ruleSettings.defaultMessage));
                    message = evalMessage(ruleSettings.defaultMessage, ruleName, lang, variation, value, params, data);
                } else {
                    utils.debug('using message from registered messages');
                }
                utils.debug('resolved message ' + message);
                return message;
            }
        }

        function ValidationRuleExecutor(ruleName, settings, params, target, validatorExecutor) {
            utils.debug('creating validation executor for rule ' + ruleName + ' with params. settings: ' + JSON.stringify(settings) + ', params: ' + JSON.stringify(params));
            this.instanceId = uniqueId();
            this.ruleName = ruleName;
            this.settings = settings;
            this.params = params;
            this.target = target;
            this.validatorExecutor = validatorExecutor;

            this.forceValidation = function() {
                this.validatorExecutor.validate(this.target());
            };

            this.getParam = function(name) {
                return this.params[name];
            };

            this.getParamOrThrow = function(name) {
                if (!this.params.hasOwnProperty(name)) {
                    throw new Error('Parameter ' + name + ' not found in rule ' + ruleName);
                }
                return this.params[name];
            };

            this.validate = function(value) {
                utils.debug('executing validation rule ' + this.ruleName + ' whith params. value: ' + value + ', settings: ' + JSON.stringify(this.settings));
                var validationResult = this.settings.rule.call(this, value);
                utils.debug('validation rule ' + ruleName + ' result: ' + JSON.stringify(validationResult));
                return validationResult;
            };

            this.asyncValidate = function(value, callback) {
                return this.settings.rule.call(this, value, callback);
            };

            if (this.settings.init) {
                this.settings.init.call(this);
            }
        }

        function ValidatorExecutor(target, options) {
            function registerValidatorCreation(target, validator) {
                target.__validatorCreated__ = true;
                target.isValidatable = function() {
                    return true;
                };
                target.validator = validator;
            }

            //Each property in options is a validation rule, except by params.
            var self = this;
            this.target  = target;   //Target observable to validation
            this.options = options; //Con
            this.params  =  options.params; //Global parameters for validations rule

            var validationRules = []; //The rules for validation, each item is a instance of the ValidationRuleExecutor
            var applyInvalidValue = utils.get(this.params, 'applyInvalidValue');
            var validationOnInit = utils.get(this.params, 'validationOnInit');
            if (validationOnInit === undefined && this.params && this.params.owner && this.params.owner.validationParams) {
                validationOnInit = this.params.owner.validationParams.validationOnInit;
            }

            //One validator by observable is allowed
            if (target.__validatorCreated__ === undefined) {
                registerValidatorCreation(target, this);
            } else {
                throw new Error('Nested valitador not allowed. One validator already created by this observable, to add more validation rules, use addRule from validator instance in observable');
            }

            this.addRule = function(ruleName, ruleParams) {
                var rule = rules[ruleName];
                if (!rule) {
                    throw new Error('Rule ' + ruleName + ' not found');
                }
                if (!utils.isObject(ruleParams) || ruleParams.constructor === Date) {
                    ruleParams = {value: ruleParams};
                }
                //Whether some rule define the param applyInvalidValue or validationOnInit, the value will be assumed.
                if (applyInvalidValue === undefined && ruleParams.applyInvalidValue !== undefined) {
                    applyInvalidValue = ruleParams.applyInvalidValue;
                }
                if (validationOnInit === undefined && ruleParams.validationOnInit !== undefined) {
                    validationOnInit = ruleParams.validationOnInit;
                }
                $.extend(true, ruleParams, this.params);
                var validationRuleExecutor = new ValidationRuleExecutor(ruleName, rule.settings, ruleParams, target, this);
                validationRules.push(validationRuleExecutor);
            };

            //Extract all validation rules
            for (var prop in options) {
                if (prop !== 'params') {
                    var ruleName = prop;
                    var ruleParams = options[prop];
                    //Consider as an anonymous rule when parameter is a function and rule is not registered
                    if (typeof(ruleParams) === 'function' && !rules[ruleName]) {
                        var anonymousSettings = {rule: ruleParams};
                        var anonymousParams = $.extend(true, {}, this.params);
                        var validationRuleExecutor = new ValidationRuleExecutor(ruleName, anonymousSettings, anonymousParams, target, this);
                        validationRules.push(validationRuleExecutor);
                    } else {
                        this.addRule(ruleName, ruleParams);
                    }
                }
            }
            applyInvalidValue = applyInvalidValue || ksv.settings.applyInvalidValue;
            validationOnInit  = validationOnInit  || ksv.settings.validationOnInit;

            //Create validation info observable
            var isValidObservable = ko.observable(false);
            var errorObservable   = ko.observable(null);

            this.applyValidationResult = function(ruleExecutor, value, validationResult) {
                var lang = ksv.settings.getLang();
                var ruleName = ruleExecutor.ruleName;
                var ruleSettings = ruleExecutor.settings;
                var ruleParams = ruleExecutor.params;
                var owner = ruleParams.owner;
                var instanceId = ruleExecutor.instanceId;
                var valid, variation, message, data;
                if (utils.isObject(validationResult)) {
                    valid = validationResult.valid;
                    variation = validationResult.variation;
                    data = validationResult.data;
                    message = validationResult.message;
                } else {
                    valid = validationResult;
                }
                if (!valid) {
                    if (message) {
                        message = evalMessage(message, ruleName, lang, variation, value, ruleParams, data);
                    } else {
                        message = resolveMessage(ruleName, ruleSettings, lang, variation, value, ruleParams, data);
                    }
                    isValidObservable(false);
                    errorObservable(message);
                } else {
                    isValidObservable(true);
                    errorObservable(null);
                }
                utils.debug('notify validation for rule ' + ruleName + '. valid: ' + valid + ', message: ' + message + ', name: ' + ruleParams.name);
                notification.notify(target, owner, ruleName, instanceId, valid, message, ruleParams.name);
                return valid;
            };

            this.validate = function(value) {
                var valid = false;
                function asyncCallback(ruleExecutor) {
                    return function(validationResult) {
                        self.applyValidationResult(ruleExecutor, value, validationResult);
                    };
                }
                function forceSyncInAsyncContext(ruleExecutor) {
                    return function(validationResult) {
                        valid = self.applyValidationResult(ruleExecutor, value, validationResult);
                    };
                }
                for (var i = 0; i < validationRules.length; i++) {
                    var ruleExecutor = validationRules[i];
                    if (ruleExecutor.settings.async) {
                        //When rule is async on callback but the param async is disable, force synchronous execution 
                        if (ruleExecutor.params.async !== undefined && !ruleExecutor.params.async) {
                            ruleExecutor.asyncValidate(value, forceSyncInAsyncContext(ruleExecutor));
                        } else {
                            valid = ruleExecutor.asyncValidate(value, asyncCallback(ruleExecutor));
                        }
                    } else {
                        var validationResult = ruleExecutor.validate(value);
                        valid = this.applyValidationResult(ruleExecutor, value, validationResult);
                        if (!valid) {
                            break;
                        }
                    }
                }
                if (applyInvalidValue || valid) {
                    target(value);
                }
                if (valid) {
                    isValidObservable(true);
                    errorObservable(null);
                }
            };

            //Target wrapper used to validate all new value of the observable
            this.targetWrapper = ko.pureComputed({
                read: target,
                write: function(newValue) {
                    this.validate(newValue);
                }
            }, this);
            this.targetWrapper.isValid = isValidObservable;
            this.targetWrapper.error   = errorObservable;
            this.targetWrapper.validate = function() {
                self.validate(target());
                return this;
            };
            if (validationOnInit) {
                this.targetWrapper(target());
            }
            //Register validation creation to prevent to extend validation over validation
            registerValidatorCreation(this.targetWrapper, this);
        }

        //The validator extender
        ko.extenders.validator = function(target, options) {
            var validatorExecutor = new ValidatorExecutor(target, options);
            return validatorExecutor.targetWrapper;
        };

        return {
            /**
             Register a rule.
             @param ruleName 
               Name of the validation rule
             @param settings The settings of de rule. Avaliable settings:
               rule*: function(value) -> The rule function.
                  The return of the function is boolean or object when rule use variations, in this case return properties {valid: boolean, variation: string}
               defaultMessage*: string | function | object -> Default validation message.
                  When 
                     * string: Is the default validation message
                     * function: Callback function to determine the default validation message. Params: (lang, value, variation, params)
                     * object: Object to represents the message with variations
               messageResolve: function -> Function to resolve validation message for this rule. Params: (lang, value, variation, params, data)
               override: boolean -> Indicates that this rule can be overridden. The default value is true
             */
            register: function(ruleName, settings) {
                var currentRule = rules[ruleName];
                if (currentRule !== undefined) {
                    if (!currentRule.settings.override) {
                        throw new Error('The rule ' + ruleName + ' can not be overridden');
                    }
                }
                if (!ruleName || typeof(ruleName) !== 'string') {
                    throw new Error('Invalid rule name');
                }
                if (typeof(settings) === 'function') {
                    throw new Error('Invalid settings for rule. Expected object but found ' + typeof(settings));
                }
                if (!('rule' in settings) || typeof(settings.rule) !== 'function') {
                    throw new Error('Invalid value for rule property. Rule name: ' + ruleName);
                }
                if ('init' in settings && typeof(settings.init) !== 'function') {
                    throw new Error('Invalid value for init property. Rule name: ' + ruleName);
                }
                if (!('defaultMessage' in settings)) {
                    throw new Error('Property defaultMessage not found');
                }
                if (('defaultMessage' in settings) && typeof(settings.defaultMessage) !== 'string' &&
                        typeof(settings.defaultMessage) !== 'function' && !utils.isObject(settings.defaultMessage)) {
                    throw new Error('Invalid value for defaultMessage property. Rule name: ' + ruleName);
                }
                if ('messageResolve' in settings && typeof(settings.messageResolve) !== 'function') {
                    throw new Error('Invalid value for messageResolve property. Rule name: ' + ruleName);
                }
                if (!('override' in settings)) {
                    settings.override = true;
                }
                if ('override' in settings && typeof(settings.override) !== 'boolean') {
                    throw new Error('Invalid value for override property. Rule name: ' + ruleName);
                }
                if (!('async' in settings)) {
                    settings.async = false;
                }
                if ('async' in settings && typeof(settings.async) !== 'boolean') {
                    throw new Error('Invalid value for async property. Rule name: ' + ruleName);
                }
                utils.debug('registring rule ' + ruleName + ', settings: ' + JSON.stringify(settings));
                rules[ruleName] = {
                    name: ruleName,
                    settings: settings
                };
            },
            registerMessage: function(ruleName, message, lang) {
                if (!lang) {
                    lang = 'default';
                }
                if (!messages[lang]) {
                    messages[lang] = {};
                }
                if (typeof(message) === 'string') {
                    messages[lang][ruleName] = message;
                } else {
                    $.extend(true, messages[lang][ruleName], message);
                }
                utils.debug('registered message for rule ' + ruleName + ', message: ' + message + ', lang: ' + lang);
                utils.debug('messages after register ' + JSON.stringify(messages));
            },
            registerMessages: function(newMessages, lang) {
                if (!utils.isObject(newMessages)) {
                    throw new Error('New messages should be an object instance');
                }
                if (!lang) {
                    lang = 'default';
                }
                if (!messages[lang]) {
                    messages[lang] = {};
                }
                $.extend(true, messages[lang], newMessages);
            }
        };
    })(ksv.notification, ksv.utils);

    ksv.builtin = (function(utils) {
        /* jshint -W116 */ //Ignore hint to use simple diff operator (!=)
        /* jshint unused:false */ //Ignore hint to unused variable
        var builtinRules = {
            required: {
                rule: function(value) {
                    if (typeof(value) === 'string') {
                        return !!value.trim();
                    } else {
                        return (value != undefined);
                    }
                },
                defaultMessage: 'This field is required.'
            },
            email: {
                rule: function(value) {
                    if (typeof(value) !== 'string') {
                        return false;
                    }
                    if (!value) {
                        return true;
                    }
                    return (/[\w.%+-]{2,}@[\w.-]{2,}.[\w]{2,4}[.]*[\w]*?/g).test(value);
                },
                defaultMessage: 'Please enter a proper email address.'
            },
            url: {
                rule: function(value) {
                    if (typeof(value) !== 'string') {
                        return false;
                    }
                    if (!value) {
                        return true;
                    }
                    return (/^(http|https)\:\/\/[\w%-]+[.]{1}[:]*[/]*[\w.?#-]*?/g).test(value);
                },
                defaultMessage: 'Please enter a proper URL.'
            },
            nativeDate: {
                rule: function(value) {
                    if (value === undefined) {
                        return true;
                    }
                    if (value.constructor !== Date) {
                        return false;
                    }
                    return true;
                },
                defaultMessage: 'Please enter a proper date.'
            },
            date: {
                rule: function(value) {
                    var params = this.params;
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'string') {
                        return {
                            valid: false,
                            variation: 'type'
                        };
                    }
                    var format = params.format || ksv.settings.dateFormat;
                    var momentDate = moment(value, format, true);
                    if (!momentDate.isValid()) {
                        return {
                            valid: false,
                            variation: 'type'
                        };
                    }
                    var dateValue = momentDate.toDate();
                    if (utils.exists(params, 'min')) {
                        var min = params.min;
                        if (dateValue < min) {
                            return {
                                valid: false,
                                variation: 'min'
                            };
                        }
                    }
                    if (utils.exists(params, 'max')) {
                        var max = params.max;
                        if (dateValue > max) {
                            return {
                                valid: false,
                                variation: 'max'
                            };
                        }
                    }
                    return true;
                },
                defaultMessage: {
                    'type': 'Please enter a proper date.',
                    'min': 'Please enter a value greater than or equal to ${params.min}',
                    'max': 'Please enter a value less than or equal to ${params.max}'
                }
            },
            number: {
                rule: function(value) {
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'number') {
                        return false;
                    }
                    return true;
                },
                defaultMessage: 'Please enter a number.'
            },
            integer: {
                rule: function(value) {
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'number') {
                        return false;
                    }
                    var asStr = value.toString();
                    var end = asStr.indexOf('.');
                    if (end === -1) {
                        end = asStr.length;
                    }
                    var truncated = parseFloat(asStr.substring(0, end));
                    var mod = value % truncated;
                    if (mod > 0) {
                        return false;
                    }
                    return true;
                },
                defaultMessage: 'Please enter a valid integer number.'
            },
            max: {
                rule: function (value) {
                    var params = this.params;
                    var settings = this.settings;
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'number' && value.constructor !== Date) {
                        return {
                            valid: false,
                            variation: 'type'
                        };
                    }
                    var maxValue = params.value;
                    if (value > maxValue) {
                        return {
                            valid: false,
                            variation: 'max'
                        };
                    }
                    return true;
                },
                defaultMessage: {
                    'type': 'The max validator can be only used with number and date values',
                    'max': 'Please enter a value less than or equal to ${params.value}'
                }
            },
            min: {
                rule: function (value) {
                    var params = this.params;
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'number' && value.constructor !== Date) {
                        return {
                            valid: false,
                            variation: 'type'
                        };
                    }
                    var minValue = params.value;
                    if (value < minValue) {
                        return {
                            valid: false,
                            variation: 'min'
                        };
                    }
                    return true;
                },
                defaultMessage: {
                    'type': 'The min validator can be only used with number and date values',
                    'min': 'Please enter a value greater than or equal to ${params.value}'
                }
            },
            maxlength: {
                rule: function(value) {
                    var params = this.params;
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'string') {
                        return {
                            valid: false,
                            variation: 'type'
                        };
                    }
                    if (value.trim().length > params.value) {
                        return {
                            valid: false,
                            variation: 'maxlength'
                        };
                    }
                    return true;
                },
                defaultMessage: {
                    'type': 'The maxlength validator can be only used with number and date values',
                    'maxlength': 'Please enter no more than ${params.value} characters.'
                }
            },
            minlength: {
                rule: function(value) {
                    var params = this.params;
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'string') {
                        return {
                            valid: false,
                            variation: 'type'
                        };
                    }
                    if (value.trim().length < params.value) {
                        return {
                            valid: false,
                            variation: 'minlength'
                        };
                    }
                    return true;
                },
                defaultMessage: {
                    'type': 'The minlength validator can be only used with number and date values',
                    'minlength': 'Please enter at least ${params.value} characters.'
                }
            },
            rangelength: {
                rule: function(value) {
                    var params = this.params;
                    if (value == undefined) {
                        return true;
                    }
                    if (typeof(value) !== 'string') {
                        return {
                            valid: false,
                            variation: 'type'
                        };
                    }
                    var min = (utils.exists(params, 'min')) ? params.min : -1;
                    var max = (utils.exists(params, 'max')) ? params.max : -1;
                    if (min > -1 && value.trim().length < min) {
                        return {
                            valid: false,
                            variation: 'min'
                        };
                    }
                    if (max > -1 && value.trim().length > max) {
                        return {
                            valid: false,
                            variation: 'max'
                        };
                    }
                    return true;
                },
                defaultMessage: {
                    'type': 'The rangelength validator can be only used with number and date values',
                    'min': 'Please enter at least ${params.min} characters.',
                    'max': 'Please enter no more than ${params.max} characters.'
                }
            },
            equalsTo: {
                init: function() {
                    var self = this;
                    this.other = this.getParamOrThrow('other');
                    this.otherName = this.getParamOrThrow('otherName');
                    this.validateUninitialized = this.params.validateUninitialized || false;
                    if (this.other == undefined) {
                        throw new Error('The other parameter not found');
                    }
                    if (typeof(this.other) !== 'function') {
                        throw new Error('The other parameter should be a function');
                    }
                    if (typeof(this.otherName) !== 'string' || !this.otherName) {
                        throw new Error('The otherName parameter invalid');
                    }
                    if (ko.isObservable(this.other)) {
                        this.other.subscribe(function() {
                            var run = (self.target() != undefined || (self.target() == undefined && self.validateUninitialized));
                            utils.debug('other changed. force validation: ' + run);
                            if (run) {
                                self.forceValidation();
                            }
                        });
                    }
                },
                rule: function(value) {
                    return (value === this.other());
                },
                defaultMessage: 'Values must be equal to ${params.otherName}'
            },
            remote: {
                init: function() {
                    this.ident = this.params.ident;
                    if (this.ident == undefined || this.ident === '') {
                        throw new Error('The ident parameter not found');
                    }
                    if (typeof(this.ident) !== 'string') {
                        throw new Error('The ident parameter should be a string');
                    }

                    this.url = this.params.url;
                    if (this.url == undefined || this.url === '') {
                        throw new Error('The url parameter not found');
                    }
                    if (typeof(this.ident) !== 'string' && typeof(this.ident) !== 'function') {
                        throw new Error('The url parameter should be a string or a function');
                    }
                    
                    this.async = (this.params.async !== undefined) ? this.params.async : true;

                    this.prepValidationData = this.params.prepValidationData;
                    if (this.prepValidationData && typeof(this.prepValidationData) !== 'function') {
                        throw new Error('The prepValidationData parameter should be a function');
                    }

                    this.checkResult = this.params.checkResult;
                    if (this.checkResult && typeof(this.checkResult) !== 'function') {
                        throw new Error('The checkResult parameter should be a function');
                    }
                },
                rule: function(value, callback) {
                    var self = this;
                    var url = this.url;
                    if (typeof(url) === 'function') {
                        url = url.call(this, value);
                    }
                    var data = {};
                    data[this.ident] = value;
                    if (this.prepValidationData) {
                        var prep = this.prepValidationData.call(this, value, data);
                        if (prep) {
                            data = prep;
                        }
                    }
                    data = JSON.stringify(data);
                    $.ajax({
                        url: url,
                        async: this.async,
                        type: 'POST',
                        data: data,
                        dataType: 'json',
                        contentType: 'application/json',
                        cache: false,
                        complete: function(jqXHR, httpStatus) {
                            var validationResult;
                            var httpStatusCode = jqXHR.status;
                            var remoteValidationResult = {};
                            if (jqXHR.responseText) {
                                remoteValidationResult = $.parseJSON(jqXHR.responseText);
                            }
                            if (self.checkResult) {
                                validationResult = self.checkResult(value, httpStatusCode, remoteValidationResult);
                            } else {
                                if (httpStatusCode === 200) {
                                    validationResult = true;
                                } else {
                                    validationResult = {};
                                    validationResult['valid'] = false;
                                    if ('message' in remoteValidationResult) {
                                        validationResult['message'] = remoteValidationResult.message;
                                    }
                                }
                            }
                            callback(validationResult);
                        }
                    });
                    return true;
                },
                defaultMessage: 'Please entrer a proper value',
                async: true
            }
        };
        for (var ruleName in builtinRules) {
            var ruleSettings = builtinRules[ruleName];
            ksv.rules.register(ruleName, ruleSettings);
        }
    })(ksv.utils);
}));