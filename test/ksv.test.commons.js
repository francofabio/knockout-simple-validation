'use strict';

ksv.utils.debug.enable = false;

function getContainer() {
    return $('#qunit-fixture')[0];
}

function PersonValidatableModel() {
    this.firstName = ko.observable().extend({required: true, ragelength: {max: 30, min: 2}});
    this.lastName = ko.observable().extend({required: true, ragelength: {max: 30, min: 2}});
    this.email = ko.observable().extend({required: true, email: true});
    this.url = ko.observable().extend({url: true});
    this.age = ko.observable().extend({number: true, min: 18, max: 70});
}

function newPersonValidatableModel() {
    var person = new PersonValidatableModel();
    ko.applyBindings(person, getContainer());
    return person;
}