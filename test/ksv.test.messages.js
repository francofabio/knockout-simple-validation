'use strict';

module('ksv.test.messages');

var defaultLang = ksv.settings.lang

QUnit.testDone(function() {
    ksv.settings.lang = defaultLang;
    ksv.utils.debug.enable = false;
});

test('should register message for specific language', function() {
    expect(2);
    ksv.settings.lang = 'pt_BR';
    ksv.rules.registerMessage('required', 'Informe o valor do campo ${params.name}', 'pt_BR');
    var name = ko.observable().extend({validator: {required: true, params: {name: 'name'}}});
    name(null);
    ok(!name.isValid());
    equal(name.error(), 'Informe o valor do campo name');
});

test('should register default message', function() {
    expect(2);
    ksv.rules.registerMessage('email', 'O e-mail ${value} não é válido');
    var email = ko.observable().extend({validator: {email: true, params: {name: 'email'}}});
    email('john');
    ok(!email.isValid());
    equal(email.error(), 'O e-mail john não é válido');
});

test('should by register multiples messages by language', function() {
    expect(4);
    ksv.settings.lang = 'pt_BR';
    ksv.rules.registerMessages({
        required: 'O campo ${params.name} deve ser informado',
        email: 'E-mail inválido'
    }, 'pt_BR');
    var name = ko.observable().extend({validator: {required: true, params: {name: 'name'}}});
    var email = ko.observable().extend({validator: {email: true, params: {name: 'email'}}});
    
    name(null);
    ok(!name.isValid());
    equal(name.error(), 'O campo name deve ser informado');

    email('john');
    ok(!email.isValid());
    equal(email.error(), 'E-mail inválido');
});

test('should by register multiples default messages', function() {
    expect(4);
    ksv.rules.registerMessages({
        required: 'Campo requerido - default',
        email: 'E-mail inválido - default'
    });
    var name = ko.observable().extend({validator: {required: true, params: {name: 'name'}}});
    var email = ko.observable().extend({validator: {email: true, params: {name: 'email'}}});
    
    name(null);
    ok(!name.isValid());
    equal(name.error(), 'Campo requerido - default');

    email('john');
    ok(!email.isValid());
    equal(email.error(), 'E-mail inválido - default');
});

test('should use custom messages from rule validation result (inline) - string', function() {
    expect(2);
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            if (value !== this.value) {
                return {
                    valid: false,
                    message: 'Neste campo é permitido somente o valor ${params.value}'
                };
            }
            return true;
        },
        defaultMessage: 'O valor deste campo deve ser ${params.value}'
    });
    var myDog = ko.observable().extend({validator: {fixedValue: 'Toby'}});
    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Neste campo é permitido somente o valor Toby');
});

test('should use custom messages from rule validation result (inline) - function', function() {
    expect(2);
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            var self = this;
            if (value !== this.value) {
                return {
                    valid: false,
                    message: function() {
                        return 'Neste campo é permitido somente o valor ' + self.value
                    }
                };
            }
            return true;
        },
        defaultMessage: 'O valor deste campo deve ser ${params.value}'
    });
    var myDog = ko.observable().extend({validator: {fixedValue: 'Toby'}});
    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Neste campo é permitido somente o valor Toby');
});

test('should use custom messages from rule validation result (inline) - object', function() {
    expect(6);
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            var self = this;
            if (typeof(value) !== typeof(this.value)) {
                return {
                    valid: false,
                    variation: 'type',
                    message: {
                        type: 'O tipo de dado deve ser ${typeof(params.value)} e não ${typeof(value)}'
                    }
                };
            }
            if (value !== this.value) {
                return {
                    valid: false,
                    variation: 'val',
                    message: {
                        val: 'Neste campo é permitido somente o valor ${params.value}'
                    }
                };
            }
            return true;
        },
        defaultMessage: 'O valor deste campo deve ser ${params.value}'
    });
    var myDog = ko.observable().extend({validator: {fixedValue: 'Toby'}});
    
    myDog({});
    ok(!myDog.isValid());
    equal(myDog.error(), 'O tipo de dado deve ser string e não object');

    myDog(10);
    ok(!myDog.isValid());
    equal(myDog.error(), 'O tipo de dado deve ser string e não number');

    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Neste campo é permitido somente o valor Toby');
});

test('should use custom messages from rule parameters (inline) - string', function() {
    expect(2);
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            return value === this.value;
        },
        defaultMessage: 'O valor deste campo deve ser ${params.value}'
    });
    var myDog = ko.observable().extend({validator: {fixedValue: {value: 'Toby', message: 'Informe o valor ${params.value}'}}});
    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Informe o valor Toby');
});

test('should use custom messages from rule parameters (inline) - function', function() {
    expect(2);
    var message = function(lang, variation, value, params, data) {
        return 'Era esperado o valor ' + params.value + '. Você informou o valor ' + value;
    };
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            return value === this.value;
        },
        defaultMessage: 'O valor deste campo deve ser ${params.value}'
    });
    var myDog = ko.observable().extend({validator: {fixedValue: {value: 'Toby', message: message}}});
    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Era esperado o valor Toby. Você informou o valor Beethoven');
});

test('should use custom messages from rule parameters (inline) - object', function() {
    expect(6);
    var messages = {
        type: 'O tipo de dado deve ser ${typeof(params.value)} e não ${typeof(value)}',
        val: 'Neste campo é permitido somente o valor ${params.value}'
    };
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            if (typeof(value) !== typeof(this.value)) {
                return {
                    valid: false,
                    variation: 'type'
                };
            }
            if (value !== this.value) {
                return {
                    valid: false,
                    variation: 'val'
                };
            }
            return true;
        },
        defaultMessage: 'O valor deste campo deve ser ${params.value}'
    });
    var myDog = ko.observable().extend({validator: {fixedValue: {value: 'Toby', message: messages}}});
    
    myDog({});
    ok(!myDog.isValid());
    equal(myDog.error(), 'O tipo de dado deve ser string e não object');

    myDog(10);
    ok(!myDog.isValid());
    equal(myDog.error(), 'O tipo de dado deve ser string e não number');

    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Neste campo é permitido somente o valor Toby');
});

test('should use default messages - string', function() {
    expect(2);
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            return value === this.value;
        },
        defaultMessage: 'O valor deste campo deve ser ${params.value}'
    });
    var myDog = ko.observable().extend({validator: {fixedValue: 'Toby'}});
    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'O valor deste campo deve ser Toby');
});

test('should use default messages - function', function() {
    expect(2);
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            return value === this.value;
        },
        defaultMessage: function(lang, variation, value, params, data) {
            return 'Informe ' + params.value;
        }
    });
    var myDog = ko.observable().extend({validator: {fixedValue: 'Toby'}});
    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Informe Toby');
});

test('should use default messages - object', function() {
    expect(6);
    ksv.rules.register('fixedValue', {
        init: function() {
            this.value = this.params.value;
        },
        rule: function(value) {
            if (typeof(value) !== typeof(this.value)) {
                return {
                    valid: false,
                    variation: 'type'
                };
            }
            if (value !== this.value) {
                return {
                    valid: false,
                    variation: 'val'
                };
            }
            return true;
        },
        defaultMessage: {
            type: 'O tipo de dado deve ser ${typeof(params.value)} e não ${typeof(value)} - defaultMessage',
            val: 'Neste campo é permitido somente o valor ${params.value} - defaultMessage'
        }
    });
    var myDog = ko.observable().extend({validator: {fixedValue: 'Toby'}});
    
    myDog({});
    ok(!myDog.isValid());
    equal(myDog.error(), 'O tipo de dado deve ser string e não object - defaultMessage');

    myDog(10);
    ok(!myDog.isValid());
    equal(myDog.error(), 'O tipo de dado deve ser string e não number - defaultMessage');

    myDog('Beethoven');
    ok(!myDog.isValid());
    equal(myDog.error(), 'Neste campo é permitido somente o valor Toby - defaultMessage');
});

test('should be change language - dynamic', function() {
    expect(4);
    ksv.settings.lang = 'pt_BR';
    ksv.rules.registerMessage('required', 'Informe o valor do campo ${params.name}', 'pt_BR');
    ksv.rules.registerMessage('required', 'The field ${params.name} is required', 'en');
    var name = ko.observable().extend({validator: {required: true, params: {name: 'name'}}});
    
    name(null);
    ok(!name.isValid());
    equal(name.error(), 'Informe o valor do campo name');

    ksv.settings.lang = 'en';
    name('');
    ok(!name.isValid());
    equal(name.error(), 'The field name is required');
});

test('should be use custom default message when message for language not found', function() {
    expect(4);
    ksv.rules.registerMessage('required', 'Informe o valor do campo ${params.name}');
    ksv.rules.registerMessage('required', 'The field ${params.name} is required', 'en');
    var name = ko.observable().extend({validator: {required: true, params: {name: 'name'}}});

    name(null);
    ok(!name.isValid());
    equal(name.error(), 'The field name is required');
    
    ksv.settings.lang = 'en_UK';
    name('');
    ok(!name.isValid());
    equal(name.error(), 'Informe o valor do campo name');
});
