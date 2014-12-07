define(['knockout', 'ksv'], function(ko) {
    'use strict';

    QUnit.module('ksv.rule.email');

    test('should validate email', function() {
        QUnit.expect(8);
        var email = ko.observable().extend({validator: {email: true}});

        //Initially the observable is invalid but no error message is null
        QUnit.ok(!email.isValid());

        email('john');
        QUnit.ok(!email.isValid(), 'Expected invalid email');
        QUnit.equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

        email('john.galt@m.a');
        QUnit.ok(!email.isValid(), 'Expected invalid email');
        QUnit.equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

        //set valid email
        email('john.galt@email.com');
        QUnit.ok(email.isValid(), 'Expected valid email');
        QUnit.equal(email.error(), null, 'Email validation message should be null');
        QUnit.equal(email(), 'john.galt@email.com');
    });

    test('should validate required and email', function() {
        QUnit.expect(9);
        var email = ko.observable().extend({validator: {required: true, email: true}});

        //Initially the observable is invalid but no error message is null
        QUnit.ok(!email.isValid());

        email('john');
        QUnit.ok(!email.isValid(), 'Expected invalid email');
        QUnit.equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

        email('john.galt@m.a');
        QUnit.ok(!email.isValid(), 'Expected invalid email');
        QUnit.equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

        email(null);
        QUnit.ok(!email.isValid(), 'Expected invalid email');
        QUnit.equal(email.error(), 'This field is required.');

        //set valid email
        email('john.galt@email.com');
        QUnit.ok(email.isValid(), 'Expected valid email');
        QUnit.equal(email.error(), null, 'Email validation message should be null');
    });
});