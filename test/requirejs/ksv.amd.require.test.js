define(['knockout', 'ksv'], function(ko) {
    'use strict';

    QUnit.module('ksv.rule.required');

    QUnit.test('should validate required observable', function() {
        QUnit.expect(10);
        var name = ko.observable().extend({validator: {required: true}});
        
        //Initially the observable is invalid but no error message is null
        QUnit.ok(!name.isValid());

        //set invalid null string
        name(null);
        QUnit.ok(!name.isValid(), 'Expected invalid value for name');
        QUnit.equal(name.error(), 'This field is required.', 'Validaton message');

        //set invalid empty string
        name('');
        QUnit.ok(!name.isValid(), 'Expected invalid value for name');
        QUnit.equal(name.error(), 'This field is required.', 'Validation message');

        //set invalid while spaced string
        name(' ');
        QUnit.ok(!name.isValid(), 'Expected invalid value for name');
        QUnit.equal(name.error(), 'This field is required.', 'Validation message');

        //set valid data for name
        name('John Galt');
        QUnit.ok(name.isValid(), 'Expected valid value for name');
        QUnit.equal(name.error(), null, 'Required validation message should be null');
        QUnit.equal(name(), 'John Galt');
    });
});