'use strict';

module('ksv.rule.date');

test('should validate date', function() {
    expect(9);
    var data = ko.observable().extend({validator: {date: true}});
    //Initially the observable is invalid but no error message is null
    ok(!data.isValid());

    data(0);
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data('25/13/2014');
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data({day: 1, month: 2, year: 2014});
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data('01/01/2014');
    ok(data.isValid());
    equal(data.error(), null);
});

test('should validate date required', function() {
    expect(12);
    var data = ko.observable().extend({validator: {required: true, date: true}});
    //Initially the observable is invalid but no error message is null
    ok(!data.isValid());

    data(null);
    ok(!data.isValid());
    equal(data.error(), 'This field is required.');

    data('');
    ok(!data.isValid());
    equal(data.error(), 'This field is required.');

    data('   ');
    ok(!data.isValid());
    equal(data.error(), 'This field is required.');

    data(new Date());
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data('01/01/2005');
    ok(data.isValid());
    equal(data.error(), null);
    equal(data(), '01/01/2005');
});

test('should validate date with custom format in params', function() {
    expect(6);
    var data = ko.observable().extend({validator: {date: {format: 'YYYY-MM-DD'}}});
    //Initially the observable is invalid but no error message is null
    ok(!data.isValid());

    data('01/01/2014');
    ok(!data.isValid());
    equal(data.error(), 'Please enter a proper date.');

    data('2008-12-13');
    ok(data.isValid());
    equal(data.error(), null);
    equal(data(), '2008-12-13');
});

test('should validate date with global custom format', function() {
    var oldDateFormat = ksv.settings.dateFormat;
    try {
        ksv.settings.dateFormat = 'MM/DD/YYYY';
        expect(6);
        var data = ko.observable().extend({validator: {date: true}});
        //Initially the observable is invalid but no error message is null
        ok(!data.isValid());

        data('13/12/2008');
        ok(!data.isValid());
        equal(data.error(), 'Please enter a proper date.');

        data('12/13/2008');
        ok(data.isValid());
        equal(data.error(), null);
        equal(data(), '12/13/2008');
    } finally {
        ksv.settings.dateFormat = oldDateFormat;
    }
});

test('should validate date observable with max date', function() {
    expect(7);
    var maxdate = moment('01/01/1996', 'DD/MM/YYYY').toDate();
    var birthday = ko.observable().extend({validator: {date: {max: maxdate}}});
    
    ok(!birthday.isValid());

    birthday('01/01/2005');
    ok(!birthday.isValid());
    equal(birthday.error(), 'Please enter a value less than or equal to Mon Jan 01 1996 00:00:00 GMT-0200 (BRST)');

    birthday('01/01/1996');
    ok(birthday.isValid());
    equal(birthday.error(), null);

    birthday('06/05/1986', 'DD/MM/YYYY');
    ok(birthday.isValid());
    equal(birthday.error(), null);
});

test('should validate date observable with min date', function() {
    expect(9);
    var mindate = moment('01/01/1996', 'DD/MM/YYYY').toDate();
    var birthday = ko.observable().extend({validator: {date: {min: mindate}}});
    
    ok(!birthday.isValid());

    birthday('01/01/1995');
    ok(!birthday.isValid());
    equal(birthday.error(), 'Please enter a value greater than or equal to Mon Jan 01 1996 00:00:00 GMT-0200 (BRST)');

    birthday('06/05/2000');
    ok(birthday.isValid());
    equal(birthday.error(), null);

    birthday('01/01/1980');
    ok(!birthday.isValid());
    equal(birthday.error(), 'Please enter a value greater than or equal to Mon Jan 01 1996 00:00:00 GMT-0200 (BRST)');

    birthday('01/01/2005');
    ok(birthday.isValid());
    equal(birthday.error(), null);
});

test('should validate date observable with min and max date', function() {
    expect(7);
    var mindate = moment('01/01/1970', 'DD/MM/YYYY').toDate();
    var maxdate = moment('01/01/2004', 'DD/MM/YYYY').toDate();
    var birthday = ko.observable().extend({validator: {date: {min: mindate, max: maxdate}}});
    
    ok(!birthday.isValid());

    birthday('01/01/1969');
    ok(!birthday.isValid());
    equal(birthday.error(), 'Please enter a value greater than or equal to Thu Jan 01 1970 00:00:00 GMT-0200 (BRST)');

    birthday('01/01/2005');
    ok(!birthday.isValid());
    equal(birthday.error(), 'Please enter a value less than or equal to Thu Jan 01 2004 00:00:00 GMT-0200 (BRST)');

    birthday('01/01/1990');
    ok(birthday.isValid());
    equal(birthday.error(), null);
});
