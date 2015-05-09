'use strict';

module('ksv.test.notifications');

test('should receive global noticiations', function() {
    expect(10);
    function Person() {
        var kvsForThis = ksv.notification.makeObservable(this);
        this.name = kvsForThis.validatable('name', {required: true});
        this.email = kvsForThis.validatable('email', {required: true, email: true});
    }
    var person1 = new Person();

    var handle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message, name) {
        if (valid) return;
        equal(owner, person1);
        equal(name, 'name');
        equal(rule, 'required');
        ok(!valid);
        equal(message, 'This field is required.');
    });
    person1.name('');
    ksv.notification.unsubscribe(handle);

    var person2 = new Person();
    handle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message, name) {
        if (valid) return;
        equal(owner, person2);
        equal(name, 'email');
        equal(rule, 'email');
        ok(!valid);
        equal(message, 'Please enter a proper email address.');
    });
    person2.email('john');
    ksv.notification.unsubscribe(handle);
});

test('should receive owner object noticiations', function() {
    expect(8);
    function Person() {
        var self = this;
        var kvsForThis = ksv.notification.makeObservable(this);
        this.name = kvsForThis.validatable('name', {required: true});
        this.email = kvsForThis.validatable('email', {required: true, email: true});

        this.validationNotification = function(target, rule, instanceId, valid, message, name) {
            if (valid) return;
            equal(this, self);
            if (name === 'name') {
                equal(rule, 'required');
                ok(!valid);
                equal(message, 'This field is required.');
            } else if (name === 'email') {
                equal(rule, 'email');
                ok(!valid);
                equal(message, 'Please enter a proper email address.');
            } else {
                throw 'Nome da propriedade invalido ' + name;
            }
        };
    }
    var person = new Person();
    person.name('');
    person.email('john');

    person.name('John Galt');
    person.email('john.galt@gmail.com');
});

test('should receive specific object noticiations', function() {
    expect(4);
    function Person() {
        var kvsForThis = ksv.notification.makeObservable(this);
        this.name = kvsForThis.validatable({required: true});
        this.email = kvsForThis.validatable({required: true, email: true});
    }
    var person1 = new Person();

    var handle = ksv.notification.subscribe(function(target, owner, rule, instanceId, valid, message) {
        if (valid) return;
        equal(owner, person1);
        equal(rule, 'required');
        ok(!valid);
        equal(message, 'This field is required.');
    }, person1);
    person1.name('');
    ksv.notification.unsubscribe(handle);

    var person2 = new Person();
    person2.name(null);
    person2.email('john');
});

test('should observe notifications for object', function() {
    expect(8);
    function Person() {
        var self = this;
        var kvsForThis = ksv.notification.makeObservable(this);
        this.name = kvsForThis.validatable('name', {required: true});
        this.email = kvsForThis.validatable('email', {required: true, email: true});
        
        var nameValidate = false;
        var emailValidate = false;
        this.errors.subscribe(function(val) {
            if (this.errors().length === 1 && !nameValidate) {
                nameValidate = true;
                var item = this.errors()[0];
                equal(item.owner, self);
                equal(item.rule, 'required');
                equal(item.name, 'name');
                equal(item.message, 'This field is required.');
            } else if (this.errors().length === 2 && !emailValidate) {
                emailValidate = true;
                var item = this.errors()[1];
                equal(item.owner, self);
                equal(item.rule, 'email');
                equal(item.name, 'email');
                equal(item.message, 'Please enter a proper email address.');
            } else if (this.errors().length > 2) {
                throw 'Eram esperados somente 2 errors';
            }
        }, this);
    }
    var person = new Person();
    person.name('');
    person.email('john');

    person.name('John Galt');
    person.email('john.galt@gmail.com');
});
