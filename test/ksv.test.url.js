'use strict';

module('ksv.rule.url');

test('should validate url', function() {
    expect(27);
    var url = ko.observable().extend({validator: {url: true}});
    
    //Initially the observable is invalid but no error message is null
    ok(!url.isValid());

    url('localhost');
    ok(!url.isValid());
    equal(url.error(), 'Please enter a proper URL.');

    url('http://localhost');
    ok(!url.isValid());
    equal(url.error(), 'Please enter a proper URL.');

    url('https://localhost');
    ok(!url.isValid());
    equal(url.error(), 'Please enter a proper URL.');

    url('http://www.google.com');
    ok(url.isValid());
    equal(url.error(), null);

    url('https://www.google.com');
    ok(url.isValid());
    equal(url.error(), null);

    url('https://mail.google.com/mail/u/1/#inbox');
    ok(url.isValid());
    equal(url.error(), null);

    url('http://mail.google.com/mail/u/1/#inbox');
    ok(url.isValid());
    equal(url.error(), null);

    url('https://digg.com/reader/feed/http%3A%2F%2Fdigg.com%2Fuser%2Fc5e90de0d613438494f753e0ae66478c%2Fitems%2Fall.rss');
    ok(url.isValid());
    equal(url.error(), null);

    url('http://digg.com/reader/feed/http%3A%2F%2Fdigg.com%2Fuser%2Fc5e90de0d613438494f753e0ae66478c%2Fitems%2Fall.rss');
    ok(url.isValid());
    equal(url.error(), null);

    url('https://www.google.com.br/#q=javascript+regex');
    ok(url.isValid());
    equal(url.error(), null);

    url('http://www.google.com.br/#q=javascript+regex');
    ok(url.isValid());
    equal(url.error(), null);

    url('http://www.google.com.br/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&sqi=2&ved=0CC0QFjAB&url=https%3A%2F%2Fdeveloper.mozilla.org%2Fpt-BR%2Fdocs%2FWeb%2FJavaScript%2FGuide%2FRegular_Expressions&ei=LQcyVO7HDZDbsAT9w4CIBw&usg=AFQjCNEss2jWcJl6uhf-s99zzQx2UqfJ_A&sig2=UNdKaPwN68PSvHZtMCOwcg');
    ok(url.isValid());
    equal(url.error(), null);

    url('https://www.google.com.br/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&sqi=2&ved=0CC0QFjAB&url=https%3A%2F%2Fdeveloper.mozilla.org%2Fpt-BR%2Fdocs%2FWeb%2FJavaScript%2FGuide%2FRegular_Expressions&ei=LQcyVO7HDZDbsAT9w4CIBw&usg=AFQjCNEss2jWcJl6uhf-s99zzQx2UqfJ_A&sig2=UNdKaPwN68PSvHZtMCOwcg');
    ok(url.isValid());
    equal(url.error(), null);
});

test('should validate url', function() {
    expect(7);
    var url = ko.observable().extend({validator: {required: true, url: true}});

    ok(!url.isValid());

    url(null);
    ok(!url.isValid());
    equal(url.error(), 'This field is required.');

    url('localhost');
    ok(!url.isValid());
    equal(url.error(), 'Please enter a proper URL.');

    url('http://mail.google.com/mail/u/1/#inbox');
    ok(url.isValid());
    equal(url.error(), null);
});