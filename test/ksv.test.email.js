'use strict';

module('ksv.rule.email');

test('should validate email', function() {
    expect(8);
    var email = ko.observable().extend({validator: {email: true}});

    //Initially the observable is invalid but no error message is null
    ok(!email.isValid());

    email('john');
    ok(!email.isValid(), 'Expected invalid email');
    equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

    email('john.galt@m.a');
    ok(!email.isValid(), 'Expected invalid email');
    equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

    //set valid email
    email('john.galt@email.com');
    ok(email.isValid(), 'Expected valid email');
    equal(email.error(), null, 'Email validation message should be null');
    equal(email(), 'john.galt@email.com');
});

test('should validate required and email', function() {
    expect(9);
    var email = ko.observable().extend({validator: {required: true, email: true}});

    //Initially the observable is invalid but no error message is null
    ok(!email.isValid());

    email('john');
    ok(!email.isValid(), 'Expected invalid email');
    equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

    email('john.galt@m.a');
    ok(!email.isValid(), 'Expected invalid email');
    equal(email.error(), 'Please enter a proper email address.', 'E-mail validaton message');

    email(null);
    ok(!email.isValid(), 'Expected invalid email');
    equal(email.error(), 'This field is required.');

    //set valid email
    email('john.galt@email.com');
    ok(email.isValid(), 'Expected valid email');
    equal(email.error(), null, 'Email validation message should be null');

});