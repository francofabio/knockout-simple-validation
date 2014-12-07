'use strict';

module('ksv.test.number');

test('should validate number', function() {
    expect(8);
    var age = ko.observable().extend({validator: {number: true}});

    ok(!age.isValid());

    age(new Date());
    ok(!age.isValid());
    equal(age.error(), 'Please enter a number.');

    age('');
    ok(!age.isValid());
    equal(age.error(), 'Please enter a number.');

    age(31);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 31);
});

test('should validate number required', function() {
    expect(10);
    var age = ko.observable().extend({validator: {required: true, number: true}});

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

test('should validate number with max', function() {
    expect(6);
    var age = ko.observable().extend({validator: {number: true, max: 30}});

    ok(!age.isValid());

    age(31);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value less than or equal to 30');

    age(30);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 30);
});

test('should validate number with min', function() {
    expect(6);
    var age = ko.observable().extend({validator: {number: true, min: 18}});

    ok(!age.isValid());

    age(15);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value greater than or equal to 18');

    age(30);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 30);
});

test('should validate number with min and max', function() {
    expect(8);
    var age = ko.observable().extend({validator: {number: true, min: 18, max: 40}});

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
