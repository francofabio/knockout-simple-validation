'use strict';

module('ksv.test.integer');

test('should validate integer', function() {
    expect(8);
    var age = ko.observable().extend({validator: {integer: true}});

    ok(!age.isValid());

    age(10.10);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a valid integer number.');

    age('');
    ok(!age.isValid());
    equal(age.error(), 'Please enter a valid integer number.');

    age(31);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 31);
});

test('should validate integer required', function() {
    expect(10);
    var age = ko.observable().extend({validator: {required: true, integer: true}});

    ok(!age.isValid());

    age(undefined);
    ok(!age.isValid());
    equal(age.error(), 'This field is required.');

    age(null);
    ok(!age.isValid());
    equal(age.error(), 'This field is required.');

    age('');
    ok(!age.isValid());
    equal(age.error(), 'This field is required.');

    age(31);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 31);
});

test('should validate integer with max', function() {
    expect(8);
    var age = ko.observable().extend({validator: {integer: true, max: 30}});

    ok(!age.isValid());

    age(31);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value less than or equal to 30');

    age(12.55);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a valid integer number.');

    age(30);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 30);
});

test('should validate integer with min', function() {
    expect(6);
    var age = ko.observable().extend({validator: {integer: true, min: 18}});

    ok(!age.isValid());

    age(15);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value greater than or equal to 18');

    age(30);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 30);
});

test('should validate integer with min and max', function() {
    expect(8);
    var age = ko.observable().extend({validator: {integer: true, min: 18, max: 40}});

    ok(!age.isValid());

    age(15);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value greater than or equal to 18');

    age(41);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value less than or equal to 40');

    age(30);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 30);
});
