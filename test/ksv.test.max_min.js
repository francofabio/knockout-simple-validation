'use strict';

module('ksv.test.max_and_min');

test('should validade max number', function() {
    expect(5);
    var age = ko.observable().extend({validator: {max: 10}});
    
    age(11);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value less than or equal to 10');

    age(5);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 5);
});

test('should validade max date', function() {
    expect(5);
    var maxdate = moment('31/12/2014', 'DD/MM/YYYY', true).toDate();
    var age = ko.observable().extend({validator: {max: maxdate}});
    
    age(moment('01/01/2015', 'DD/MM/YYYY', true).toDate());
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value less than or equal to Wed Dec 31 2014 00:00:00 GMT-0200 (BRST)');

    var val1 = moment('01/12/2014', 'DD/MM/YYYY', true).toDate();
    var val2 = moment('01/12/2014', 'DD/MM/YYYY', true).toDate();
    age(val1);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age().getTime(), val2.getTime());
});

test('should validade min number', function() {
    expect(5);
    var age = ko.observable().extend({validator: {min: 10}});
    
    age(5);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value greater than or equal to 10');

    age(11);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 11);
});

test('should validade min date', function() {
    expect(5);
    var mindate = moment('01/01/2014', 'DD/MM/YYYY', true).toDate();
    var age = ko.observable().extend({validator: {min: mindate}});
    
    age(moment('01/01/2005', 'DD/MM/YYYY', true).toDate());
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value greater than or equal to Wed Jan 01 2014 00:00:00 GMT-0200 (BRST)');

    age(moment('01/12/2014', 'DD/MM/YYYY', true).toDate());
    ok(age.isValid());
    equal(age.error(), null);
    equal(age().getTime(), moment('01/12/2014', 'DD/MM/YYYY', true).toDate().getTime());
});

test('should validade min and max number', function() {
    expect(7);

    var age = ko.observable().extend({validator: {min: 18, max: 100}});
    age(11);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value greater than or equal to 18');

    age(101);
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value less than or equal to 100');

    age(31);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 31);
});

test('should validade min and max date', function() {
    expect(7);
    var mindate = moment('01/01/2014', 'DD/MM/YYYY', true).toDate();
    var maxdate = moment('31/12/2014', 'DD/MM/YYYY', true).toDate();
    var age = ko.observable().extend({validator: {min: mindate, max: maxdate}});

    age(moment('01/01/2005', 'DD/MM/YYYY', true).toDate());
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value greater than or equal to Wed Jan 01 2014 00:00:00 GMT-0200 (BRST)');

    age(moment('01/01/2015', 'DD/MM/YYYY', true).toDate());
    ok(!age.isValid());
    equal(age.error(), 'Please enter a value less than or equal to Wed Dec 31 2014 00:00:00 GMT-0200 (BRST)');

    age(moment('01/12/2014', 'DD/MM/YYYY', true).toDate());
    ok(age.isValid());
    equal(age.error(), null);
    equal(age().getTime(), moment('01/12/2014', 'DD/MM/YYYY', true).toDate().getTime());
});

test('should accept only number or date in min', function() {
    expect(5);
    var age = ko.observable().extend({validator: {min: 10}});
    age('1o');
    ok(!age.isValid());
    equal(age.error(), 'The min validator can be only used with number and date values');

    age(31);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 31);
});

test('should accept only number or date in max', function() {
    expect(5);
    var age = ko.observable().extend({validator: {max: 10}});
    age('1o');
    ok(!age.isValid());
    equal(age.error(), 'The max validator can be only used with number and date values');

    age(7);
    ok(age.isValid());
    equal(age.error(), null);
    equal(age(), 7);
});