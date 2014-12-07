define(['knockout', 'ksv'], function(ko) {
    'use strict';

    QUnit.module('ksv.test.number');

    test('should validate number', function() {
        QUnit.expect(8);
        var age = ko.observable().extend({validator: {number: true}});

        QUnit.ok(!age.isValid());

        age(new Date());
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'Please enter a number.');

        age('');
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'Please enter a number.');

        age(31);
        QUnit.ok(age.isValid());
        QUnit.equal(age.error(), null);
        QUnit.equal(age(), 31);
    });

    test('should validate number required', function() {
        QUnit.expect(10);
        var age = ko.observable().extend({validator: {required: true, number: true}});

        QUnit.ok(!age.isValid());

        age(undefined);
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'This field is required.');

        age(null);
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'This field is required.');

        age('');
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'This field is required.');

        age(31);
        QUnit.ok(age.isValid());
        QUnit.equal(age.error(), null);
        QUnit.equal(age(), 31);
    });

    test('should validate number with max', function() {
        QUnit.expect(6);
        var age = ko.observable().extend({validator: {number: true, max: 30}});

        QUnit.ok(!age.isValid());

        age(31);
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'Please enter a value less than or equal to 30');

        age(30);
        QUnit.ok(age.isValid());
        QUnit.equal(age.error(), null);
        QUnit.equal(age(), 30);
    });

    test('should validate number with min', function() {
        QUnit.expect(6);
        var age = ko.observable().extend({validator: {number: true, min: 18}});

        QUnit.ok(!age.isValid());

        age(15);
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'Please enter a value greater than or equal to 18');

        age(30);
        QUnit.ok(age.isValid());
        QUnit.equal(age.error(), null);
        QUnit.equal(age(), 30);
    });

    test('should validate number with min and max', function() {
        QUnit.expect(8);
        var age = ko.observable().extend({validator: {number: true, min: 18, max: 40}});

        QUnit.ok(!age.isValid());

        age(15);
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'Please enter a value greater than or equal to 18');

        age(41);
        QUnit.ok(!age.isValid());
        QUnit.equal(age.error(), 'Please enter a value less than or equal to 40');

        age(30);
        QUnit.ok(age.isValid());
        QUnit.equal(age.error(), null);
        QUnit.equal(age(), 30);
    });
});