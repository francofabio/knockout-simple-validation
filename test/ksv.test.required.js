'use strict';

module('ksv.rule.required');

test('should validate required observable', function() {
    expect(10);
    var name = ko.observable().extend({validator: {required: true}});
    
    //Initially the observable is invalid but no error message is null
    ok(!name.isValid());

    //set invalid null string
    name(null);
    ok(!name.isValid(), 'Expected invalid value for name');
    equal(name.error(), 'This field is required.', 'Validaton message');

    //set invalid empty string
    name('');
    ok(!name.isValid(), 'Expected invalid value for name');
    equal(name.error(), 'This field is required.', 'Validation message');

    //set invalid while spaced string
    name(' ');
    ok(!name.isValid(), 'Expected invalid value for name');
    equal(name.error(), 'This field is required.', 'Validation message');

    //set valid data for name
    name('John Galt');
    ok(name.isValid(), 'Expected valid value for name');
    equal(name.error(), null, 'Required validation message should be null');
    equal(name(), 'John Galt');
});