'use strict';

module('ksv.test.equalsTo');

test('expect Error when other parameter not found', function(assert) {
    expect(1);
    throws(function(){
        ko.observable().extend({validator: {equalsTo: {otherName: 'password'}}});
    }, Error);
});

test('expect Error when other parameter is null', function() {
    expect(1);
    throws(function() {
        ko.observable().extend({validator: {equalsTo: {other: null, otherName: 'password'}}});
    }, Error);
});

test('expect Error when other parameter not is a function', function() {
    expect(1);
    throws(function() {
        ko.observable().extend({validator: {equalsTo: {other: {}, otherName: 'password'}}});
    }, Error);
});

test('expect Error when otherName parameter not found', function() {
    expect(1);
    var password = ko.observable();
    throws(function() {
        ko.observable().extend({validator: {equalsTo: {other: password}}});
    }, Error);
});

test('expect Error when otherName parameter is null', function() {
    expect(1);
    var password = ko.observable();
    throws(function() {
        ko.observable().extend({validator: {equalsTo: {other: password, otherName: null}}});
    }, Error);
});

test('expect Error when otherName parameter is empty', function() {
    expect(1);
    var password = ko.observable();
    throws(function() {
        ko.observable().extend({validator: {equalsTo: {other: password, otherName: ''}}});
    }, Error);
});

test('should validate equalsTo', function() {
    expect(9);
    var password = ko.observable().extend({validator: {minlength: 6, maxlength: 12}});
    var passwordConfirmation = ko.observable().extend({validator: {equalsTo: {other: password, otherName: 'password'}, minlength: 6, maxlength: 12}});

    ok(!passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), null);

    password('12345678');

    ok(!passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), null);

    passwordConfirmation('123456');
    ok(!passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), 'Values must be equal to password');

    passwordConfirmation('12345678');
    ok(passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), null);
    equal(passwordConfirmation(), '12345678');
});

test('should validate equalsTo with subscribe uninitialized', function() {
    expect(10);
    var password = ko.observable().extend({validator: {minlength: 6, maxlength: 12}});
    var passwordConfirmation = ko.observable().extend({validator: {equalsTo: {other: password, otherName: 'password', validateUninitialized: true}, minlength: 6, maxlength: 12}});

    ok(!passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), null);

    password('12345678');

    ok(!passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), 'Values must be equal to password');

    passwordConfirmation('12345678');
    ok(passwordConfirmation.isValid());

    passwordConfirmation('123456');
    ok(!passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), 'Values must be equal to password');

    passwordConfirmation('12345678');
    ok(passwordConfirmation.isValid());
    equal(passwordConfirmation.error(), null);
    equal(passwordConfirmation(), '12345678');
});
