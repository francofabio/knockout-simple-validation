'use strict';

module('ksv.test.remote');

test('should execute remote validate', function() {
    expect(9);
    stop();
    var username = ko.observable().extend({validator: {remote: {ident: 'username', url: '/api/users/check-username'}}});
    var subscribeHandle;
    ok(!username.isValid());
    var validate1 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate2();
        });
        username('john');
    };
    var validate2 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(!valid);
            equal(message, 'Este username já está em uso por outro usuário');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate3();
        });
        username('luana');
    };
    var validate3 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            start();
        });
        username('john');
    };
    validate1();
});

test('should execute remote validate checkResult', function() {
    expect(9);
    stop();
    var checkResult = function(value, httpStatusCode, remoteValidationResult) {
        if (httpStatusCode == 200) {
            return true;
        } else {
            return {valid: false, message: remoteValidationResult.validationMessage};
        }
    };
    var username = ko.observable().extend({validator: {remote: {ident: 'username', url: '/api/users/check-username-checkresult', checkResult: checkResult}}});
    var subscribeHandle;
    ok(!username.isValid());
    var validate1 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate2();
        });
        username('john');
    };
    var validate2 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(!valid);
            equal(message, 'Este username já está em uso por outro usuário');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate3();
        });
        username('luana');
    };
    var validate3 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            start();
        });
        username('john');
    };
    validate1();
});

test('should execute remote validate prepValidationData', function() {
    expect(11);
    stop();
    var prepValidationData = function(value, data) {
        if (value === 'token') {
            data['token'] = 1234;
        } else {
            data['token'] = 12345;
        }
    };
    var username = ko.observable().extend({validator: {remote: {ident: 'username', url: '/api/users/check-username-prepdata', prepValidationData: prepValidationData}}});
    var subscribeHandle;
    ok(!username.isValid());
    var validate1 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate2();
        });
        username('john');
    };
    var validate2 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(!valid);
            equal(message, 'Este username já está em uso por outro usuário');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate3();
        });
        username('luana');
    };
    var validate3 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(!valid);
            equal(message, 'Token inválido');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate4();
        });
        username('token');
    };
    var validate4 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            start();
        });
        username('john');
    };
    validate1();
});

test('should execute remote validate prepValidationData and checkResult', function() {
    expect(11);
    stop();
    var prepValidationData = function(value, data) {
        if (value === 'token') {
            data['token'] = 1234;
        } else {
            data['token'] = 12345;
        }
    };
    var checkResult = function(value, httpStatusCode, remoteValidationResult) {
        if (httpStatusCode == 200) {
            return true;
        } else {
            return {valid: false, message: remoteValidationResult.validationMessage};
        }
    };
    var username = ko.observable().extend({validator: {remote: {ident: 'username', url: '/api/users/check-username-prepdata-checkresult', prepValidationData: prepValidationData, checkResult: checkResult}}});
    var subscribeHandle;
    ok(!username.isValid());
    var validate1 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate2();
        });
        username('john');
    };
    var validate2 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(!valid);
            equal(message, 'Este username já está em uso por outro usuário');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate3();
        });
        username('luana');
    };
    var validate3 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(!valid);
            equal(message, 'Token inválido');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            validate4();
        });
        username('token');
    };
    var validate4 = function() {
        subscribeHandle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
            ok(valid);
            equal(message, null);
            equal(target(), 'john');
            //Remove subscribe because only one validation is need
            ksv.notification.unsubscribe(subscribeHandle);

            start();
        });
        username('john');
    };
    validate1();
});

test('should execute remote validate synchronous', function() {
    expect(9);
    var username = ko.observable().extend({validator: {remote: {ident: 'username', url: '/api/users/check-username', async: false}}});
    
    ok(!username.isValid());

    username('john');
    ok(username.isValid());
    equal(username.error(), null);
    equal(username(), 'john');

    username('luana');
    ok(!username.isValid());
    equal(username.error(), 'Este username já está em uso por outro usuário');

    username('john');
    ok(username.isValid());
    equal(username.error(), null);
    equal(username(), 'john');
});

test('should execute remote validate synchronous with url defined as function', function() {
    expect(9);
    var resolveUrl = function(value) {
        return '/api/users/check-username';
    };
    var username = ko.observable().extend({validator: {remote: {ident: 'username', url: resolveUrl, async: false}}});
    
    ok(!username.isValid());

    username('john');
    ok(username.isValid());
    equal(username.error(), null);
    equal(username(), 'john');

    username('luana');
    ok(!username.isValid());
    equal(username.error(), 'Este username já está em uso por outro usuário');

    username('john');
    ok(username.isValid());
    equal(username.error(), null);
    equal(username(), 'john');
});