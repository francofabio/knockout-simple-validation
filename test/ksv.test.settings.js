'use strict';

module('ksv.test.settings');

test('should apply invalid values global settings', function() {
    ksv.settings.applyInvalidValue = true;
    expect(4);
    var name = ko.observable().extend({validator: {required: true, minlength: 5}});
    
    equal(name(), null);

    name('Ivo');
    ok(!name.isValid());
    equal(name.error(), 'Please enter at least 5 characters.');
    equal(name(), 'Ivo');
    ksv.settings.applyInvalidValue = false;
});

test('should apply invalid values settings in params', function() {
    expect(4);
    var name = ko.observable().extend({validator: {required: true, minlength: 5, params: {applyInvalidValue: true}}});
    
    equal(name(), null);

    name('Ivo');
    ok(!name.isValid());
    equal(name.error(), 'Please enter at least 5 characters.');
    equal(name(), 'Ivo');
});

test('should validation on init global settings', function() {
    ksv.settings.validationOnInit = true;
    expect(6);
    var name = ko.observable().extend({validator: {required: true}});
    
    equal(name(), null);
    ok(!name.isValid());
    equal(name.error(), 'This field is required.');

    name('Ivo');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'Ivo');
    ksv.settings.validationOnInit = false;
});

test('should validation on init settings in params', function() {
    expect(6);
    var name = ko.observable().extend({validator: {required: true, params: {validationOnInit: true}}});
    
    equal(name(), null);
    ok(!name.isValid());
    equal(name.error(), 'This field is required.');

    name('Ivo');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'Ivo');
});

test('should not allow nested validators', function() {
    expect(1);
    throws(function() {
        ko.observable().extend({validator: {required: true}}).extend({validator: {min: 10}});
    }, Error);
});

test('should create custom rule', function() {
    expect(6);
    ksv.rules.register('choices', {
        init: function() {
            this.choices = this.params.choices;
        },
        rule: function(value) {
            if (value == undefined) {
                return true;
            }
            return this.choices.indexOf(value) > -1;
        },
        defaultMessage: 'Por favor, informe um valor entre as opções disponíveis'
    });
    var sexo = ko.observable().extend({validator: {choices: {choices: ['M', 'F']}}});

    sexo('X');
    ok(!sexo.isValid());
    equal(sexo.error(), 'Por favor, informe um valor entre as opções disponíveis');
    equal(sexo(), null);

    sexo('M');
    ok(sexo.isValid());
    equal(sexo.error(), null);
    equal(sexo(), 'M');
});

test('should create custom rule overridden', function() {
    expect(12);
    ksv.rules.register('sexo', {
        init: function() {
            this.choices = ['M', 'F'];
        },
        rule: function(value) {
            if (value == undefined) {
                return true;
            }
            return this.choices.indexOf(value) > -1;
        },
        defaultMessage: 'Por favor, o sexo da pessoa'
    });
    var sexo = ko.observable().extend({validator: {sexo: true}});

    sexo('X');
    ok(!sexo.isValid());
    equal(sexo.error(), 'Por favor, o sexo da pessoa');
    equal(sexo(), null);

    sexo('M');
    ok(sexo.isValid());
    equal(sexo.error(), null);
    equal(sexo(), 'M');

    ksv.rules.register('sexo', {
        init: function() {
            this.choices = ['Masculino', 'Feminino'];
        },
        rule: function(value) {
            if (value == undefined) return true;
            return this.choices.indexOf(value) > -1;
        },
        defaultMessage: 'Por favor, o sexo da pessoa'
    });

    var sexo = ko.observable().extend({validator: {sexo: true}});
    sexo('M');
    ok(!sexo.isValid());
    equal(sexo.error(), 'Por favor, o sexo da pessoa');
    equal(sexo(), null);

    sexo('Feminino');
    ok(sexo.isValid());
    equal(sexo.error(), null);
    equal(sexo(), 'Feminino');
});

test('should not allow override a unoverridden rule', function() {
    expect(7);
    ksv.rules.register('choicesX', {
        init: function() {
            this.choices = this.params.choices;
        },
        rule: function(value) {
            if (value == undefined) return true;
            return this.choices.indexOf(value) > -1;
        },
        defaultMessage: 'Por favor, informe um valor entre as opções disponíveis',
        override: false
    });
    var sexo = ko.observable().extend({validator: {choicesX: {choices: ['M', 'F']}}});

    sexo('X');
    ok(!sexo.isValid());
    equal(sexo.error(), 'Por favor, informe um valor entre as opções disponíveis');
    equal(sexo(), null);

    sexo('M');
    ok(sexo.isValid());
    equal(sexo.error(), null);
    equal(sexo(), 'M');

    throws(function() {
        ksv.rules.register('choicesX', {
            init: function() {
                this.choices = this.params.choices;
            },
            rule: function(value) {
                if (value == undefined) return true;
                return this.choices.indexOf(value) > -1;
            },
            defaultMessage: 'Por favor, informe um valor entre as opções disponíveis'
        });
    }, Error);
});

test('should create anonymous rule', function() {
    expect(6);
    var password = ko.observable().extend({validator: {required: true,
        strongPassword: function(value) {
            if (value == undefined || value === '') {
                return true;
            }
            var len = value.length;
            var seqPassword = '';
            var start = parseInt(value[0]);
            for (var i=1; i <= len; i++) {
                seqPassword += i;
            }
            if (value === seqPassword) {
                return {
                    valid: false,
                    message: 'A senha não pode utilizar numeros sequenciais'
                };
            }
            return true;
        }
    }});
    password('');
    ok(!password.isValid());
    equal(password.error(), 'This field is required.');

    password('1234');
    ok(!password.isValid());
    equal(password.error(), 'A senha não pode utilizar numeros sequenciais');

    password('210989');
    ok(password.isValid());
    equal(password.error(), null);
});

test('should validate properties in object', function() {
    expect(12);
    function Person() {
        this.id = 1000;
        ksv.notification.makeObservable(this);
        this.name = ko.observable().extend({validator: {required: true, params: {owner: this}}});
        this.email = ko.observable().extend({validator: {required: true, email: true, params: {owner: this}}});
    }
    var person = new Person();

    ok(!person.isValid());
    equal(person.errors().length, 0);

    person.name('');
    ok(!person.name.isValid());
    equal(person.name.error(), 'This field is required.');

    ok(!person.isValid());
    equal(person.errors().length, 1);

    person.id = 1001;

    person.email('john');
    ok(!person.email.isValid());
    equal(person.email.error(), 'Please enter a proper email address.');

    ok(!person.isValid());
    equal(person.errors().length, 2);

    person.name('John Galt');
    person.email('john.galt@mail.com');

    ok(person.isValid());
    equal(person.errors().length, 0);
});