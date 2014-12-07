'use strict';

module('ksv.test.max_min_length');

test('should accept only string in minlength', function() {
    expect(5);
    var name = ko.observable().extend({validator: {minlength: 3}});
    name(10);
    ok(!name.isValid());
    equal(name.error(), 'The minlength validator can be only used with number and date values');

    name('John');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'John');
});

test('should accept only string in minlength', function() {
    expect(5);
    var name = ko.observable().extend({validator: {maxlength: 80}});
    name({});
    ok(!name.isValid());
    equal(name.error(), 'The maxlength validator can be only used with number and date values');

    name('John');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'John');
});

test('should validade minlength', function() {
    expect(5);
    var name = ko.observable().extend({validator: {minlength: 5}});
    
    name('John');
    ok(!name.isValid());
    equal(name.error(), 'Please enter at least 5 characters.');

    name('John Galt');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'John Galt');
});

test('should validade maxlength', function() {
    expect(5);
    var name = ko.observable().extend({validator: {maxlength: 7}});
    
    name('John Galt');
    ok(!name.isValid());
    equal(name.error(), 'Please enter no more than 7 characters.');

    name('John');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'John');
});

test('should validade min and max length', function() {
    expect(7);
    var name = ko.observable().extend({validator: {minlength: 5, maxlength: 12}});
    
    name('John');
    ok(!name.isValid());
    equal(name.error(), 'Please enter at least 5 characters.');

    name('John Galt Taggart');
    ok(!name.isValid());
    equal(name.error(), 'Please enter no more than 12 characters.');

    name('John Galt');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'John Galt');
});

test('should validade rangelength', function() {
    expect(7);
    var name = ko.observable().extend({validator: {rangelength: {min: 5, max: 12}}});
    
    name('John');
    ok(!name.isValid());
    equal(name.error(), 'Please enter at least 5 characters.');

    name('John Galt Taggart');
    ok(!name.isValid());
    equal(name.error(), 'Please enter no more than 12 characters.');

    name('John Galt');
    ok(name.isValid());
    equal(name.error(), null);
    equal(name(), 'John Galt');
});