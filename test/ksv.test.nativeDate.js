'use strict';

module('ksv.rule.nativeDate');

test('should validate nativeDate', function() {
    expect(9);
    var data = ko.observable().extend({validator: {nativeDate: true}});
    //Initially the observable is invalid but no error message is null
    ok(!data.isValid());

    data(0);
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data("01/01/2014");
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data({day: 1, month: 2, year: 2014});
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data(new Date());
    ok(data.isValid());
    equal(data.error(), null);
});

test('should validate nativeDate required', function() {
    expect(11);
    var data = ko.observable().extend({validator: {required: true, nativeDate: true}});
    //Initially the observable is invalid but no error message is null
    ok(!data.isValid());

    data(0);
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data(null);
    ok(!data.isValid());
    equal(data.error(), 'This field is required.');

    data("01/01/2014");
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data({day: 1, month: 2, year: 2014});
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data(new Date());
    ok(data.isValid());
    equal(data.error(), null);
});

test('should validate nativeDate observable with max date', function() {
    expect(7);
    var maxdate = moment("01/01/1996", "DD/MM/YYYY").toDate();
    var birthday = ko.observable().extend({validator: {nativeDate: true, max: maxdate}});
    
    ok(!birthday.isValid());

    birthday(moment("01/01/2005", "DD/MM/YYYY").toDate());
    ok(!birthday.isValid());
    equal(birthday.error(), 'Please enter a value less than or equal to Mon Jan 01 1996 00:00:00 GMT-0200 (BRST)');

    birthday(moment("01/01/1996", "DD/MM/YYYY").toDate());
    ok(birthday.isValid());
    equal(birthday.error(), null);

    birthday(moment("06/05/1986", "DD/MM/YYYY").toDate());
    ok(birthday.isValid());
    equal(birthday.error(), null);
});

test('should validate nativeDate observable with min date', function() {
    expect(9);
    var mindate = moment("01/01/1996", "DD/MM/YYYY").toDate();
    var birthday = ko.observable().extend({validator: {nativeDate: true, min: mindate}});
    
    ok(!birthday.isValid());

    birthday(moment("01/01/1995", "DD/MM/YYYY").toDate());
    ok(!birthday.isValid());
    equal(birthday.error(), "Please enter a value greater than or equal to Mon Jan 01 1996 00:00:00 GMT-0200 (BRST)");

    birthday(moment("06/05/2000", "DD/MM/YYYY").toDate());
    ok(birthday.isValid());
    equal(birthday.error(), null);

    birthday(moment("01/01/1980", "DD/MM/YYYY").toDate());
    ok(!birthday.isValid());
    equal(birthday.error(), "Please enter a value greater than or equal to Mon Jan 01 1996 00:00:00 GMT-0200 (BRST)");

    birthday(moment("01/01/2005", "DD/MM/YYYY").toDate());
    ok(birthday.isValid());
    equal(birthday.error(), null);
});

test('should validate nativeDate observable with min and max date', function() {
    expect(7);
    var mindate = moment("01/01/1970", "DD/MM/YYYY").toDate();
    var maxdate = moment("01/01/2004", "DD/MM/YYYY").toDate();
    var birthday = ko.observable().extend({validator: {nativeDate: true, min: mindate, max: maxdate}});
    
    ok(!birthday.isValid());

    birthday(moment("01/01/1969", "DD/MM/YYYY").toDate());
    ok(!birthday.isValid());
    equal(birthday.error(), "Please enter a value greater than or equal to Thu Jan 01 1970 00:00:00 GMT-0200 (BRST)");

    birthday(moment("01/01/2005", "DD/MM/YYYY").toDate());
    ok(!birthday.isValid());
    equal(birthday.error(), 'Please enter a value less than or equal to Thu Jan 01 2004 00:00:00 GMT-0200 (BRST)');

    birthday(moment("01/01/1990", "DD/MM/YYYY").toDate());
    ok(birthday.isValid());
    equal(birthday.error(), null);
});