'use strict';

module('ksv');



/*
test('should create new validatable view model', function() {
    expect(5);

    var personModel = newPersonValidatableModel();
    try {
        personModel.model().firstName('FirstName');
        personModel.model().lastName('Lastname');
        personModel.model().email('myemail@mail.com');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().lastName(), 'Lastname', 'Last name');
        equal(personModel.model().email(), 'myemail@mail.com', 'E-mail');

        ok(personModel.isValid(), 'Model is valid');
        equal(personModel.errors().length, 0, 'Errors');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should validate model', function(){
    expect(8);

    var personModel = newPersonValidatableModel();
    try {
        personModel.model().firstName('FirstName');
        personModel.model().lastName('Lastname');
        personModel.model().email('myemail@mail.com');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().lastName(), 'Lastname', 'Last name');
        equal(personModel.model().email(), 'myemail@mail.com', 'E-mail');

        ok(personModel.model().firstName.isValid(), 'First name is valid');
        ok(personModel.model().lastName.isValid(), 'Last name is valid');
        ok(personModel.model().email.isValid(), 'Email is valid');

        ok(personModel.isValid(), 'Model is valid');
        equal(personModel.errors().length, 0, 'Errors');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should detect invalid model', function(){
    expect(9);

    var personModel = newPersonValidatableModel();
    try {
        personModel.model().firstName('FirstName');
        personModel.model().lastName('');
        personModel.model().email('myemail@mail.com');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().email(), 'myemail@mail.com', 'E-mail');

        ok(personModel.model().firstName.isValid(), 'First name is valid');
        ok(personModel.model().email.isValid(), 'Email is valid');

        equal(personModel.model().lastName(), '', 'Last name');
        ok(!personModel.model().lastName.isValid(), 'Last name is invalid');
        equal(personModel.model().lastName.error(), 'This field is required.', 'Last name validation message');

        ok(!personModel.isValid(), 'Model is valid');
        equal(personModel.errors().length, 1, 'Errors');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should validate deep properties', function(){
    expect(17);

    var personModel = newPersonValidatableModel({
        address: {
            street: null,
            city: null,
            state: null
        }
    }, {
        address: {
            street: {required: true},
            city: {required: true},
            state: {required: true}
        }
    }, {}, {
        grouping: {
            deep: true
        }
    });
    try {
        personModel.model().firstName('FirstName');
        personModel.model().lastName('Lastname');
        personModel.model().email('myemail@');
        personModel.model().address.street('Wall street');
        personModel.model().address.city('');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().lastName(), 'Lastname', 'Last name');
        equal(personModel.model().email(), 'myemail@', 'E-mail');
        equal(personModel.model().address.street(), 'Wall street', 'Street');
        equal(personModel.model().address.city(), '', 'City');
        equal(personModel.model().address.state(), null, 'State');

        ok(personModel.model().firstName.isValid(), 'First name is valid');
        ok(personModel.model().lastName.isValid(), 'Last name is valid');
        ok(!personModel.model().email.isValid(), 'Email is invalid');
        ok(personModel.model().address.street.isValid(), 'Street is invalid');
        ok(!personModel.model().address.city.isValid(), 'City is invalid');
        ok(!personModel.model().address.state.isValid(), 'State is invalid');

        equal(personModel.model().email.error(), 'Please enter a proper email address', 'Email validation message');
        equal(personModel.model().address.city.error(), 'This field is required.', 'Address city validation message');
        equal(personModel.model().address.state.error(), 'This field is required.', 'Address state validation message');

        ok(!personModel.isValid(), 'Model is invalid');
        equal(personModel.errors().length, 3, 'Errors');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should use custom validation rule', function(){
    expect(9);

    var personModel = newPersonValidatableModel({}, {
        lastName: {required: true, lastName: {self : null}}
    });
    try {
        personModel.instanceId = 'createByShouldUseCustomValidator';

        personModel.model().firstName('FirstName');
        personModel.model().lastName('lastName');
        personModel.model().email('myemail@mail.com');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().lastName(), 'lastName', 'Last name');
        equal(personModel.model().email(), 'myemail@mail.com', 'E-mail');

        ok(personModel.model().firstName.isValid(), 'First name is valid');
        ok(!personModel.model().lastName.isValid(), 'Last name is invalid');
        ok(personModel.model().email.isValid(), 'Email is valid');

        equal(personModel.model().lastName.error(), 'Invalid last name', 'Last name validation message');

        ok(!personModel.isValid(), 'Model is invalid');
        equal(personModel.errors().length, 1, 'Errors');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should use custom anonymous validation rule', function(){
    expect(9);

    var personModel = newPersonValidatableModel({}, {
        lastName: {
            required: true, 
            validation: {
                validator: function(val, validate) {
                    if (!validate) return true;
                    return !!val && /^[A-Z]/.test(val);
                },
                message: 'Invalid last name. Anonymous validator'
            }
        }
    });
    try {
        personModel.model().firstName('FirstName');
        personModel.model().lastName('lastName');
        personModel.model().email('myemail@mail.com');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().lastName(), 'lastName', 'Last name');
        equal(personModel.model().email(), 'myemail@mail.com', 'E-mail');

        ok(personModel.model().firstName.isValid(), 'First name is valid');
        ok(!personModel.model().lastName.isValid(), 'Last name is invalid');
        ok(personModel.model().email.isValid(), 'Email is valid');

        equal(personModel.model().lastName.error(), 'Invalid last name. Anonymous validator', 'Last name validation message');

        ok(!personModel.isValid(), 'Model is invalid');
        equal(personModel.errors().length, 1, 'Errors');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should get validation messages', function() {
    expect(11);

    var personModel = newPersonValidatableModel();
    try {
        personModel.model().firstName('');
        personModel.model().lastName('');
        personModel.model().email('myemail@.com');

        equal(personModel.model().firstName(), '', 'First name');
        equal(personModel.model().lastName(), '', 'Last name');
        equal(personModel.model().email(), 'myemail@.com', 'E-mail');

        ok(!personModel.model().firstName.isValid(), 'First name is invalid');
        ok(!personModel.model().lastName.isValid(), 'Last name is invalid');
        ok(!personModel.model().email.isValid(), 'Email is invalid');

        equal(personModel.model().firstName.error(), 'This field is required.', 'First name validation message');
        equal(personModel.model().lastName.error(), 'This field is required.', 'Last name validation message');
        equal(personModel.model().email.error(), 'Please enter a proper email address', 'Email validation message');

        ok(!personModel.isValid(), 'Model is valid');
        equal(personModel.errors().length, 3, 'Errors');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should notify when new errors are found', function(){
    expect(9);

    var personModel = newPersonValidatableModel();
    try {
        personModel.model().firstName('FirstName');
        personModel.model().lastName('Lastname');
        personModel.model().email('myemail@mail.com');

        personModel.errors.subscribe(function(newValue) {
            ok(!personModel.isValid(), 'Model is invalid');
            equal(personModel.errors().length, 1, 'Errors');
        });
        personModel.model().lastName('');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().lastName(), '', 'Last name');
        equal(personModel.model().email(), 'myemail@mail.com', 'E-mail');

        ok(personModel.model().firstName.isValid(), 'First name is valid');
        ok(!personModel.model().lastName.isValid(), 'Last name is invalid');
        ok(personModel.model().email.isValid(), 'Email is valid');

        equal(personModel.model().lastName.error(), 'This field is required.', 'Last name validation message');
    } finally {
        ko.cleanNode(getContainer());
    }
});

test('should notify when model is valid', function(){
    expect(9);

    var personModel = newPersonValidatableModel();

    try {
        personModel.model().firstName('FirstName');
        personModel.model().lastName('Lastname');
        personModel.model().email('myemail@mail.com');

        personModel.isValid.subscribe(function() {
            ok(!personModel.isValid(), 'Model is invalid');
            equal(personModel.errors().length, 1, 'Errors');
        });
        personModel.model().lastName('');

        equal(personModel.model().firstName(), 'FirstName', 'First name');
        equal(personModel.model().lastName(), '', 'Last name');
        equal(personModel.model().email(), 'myemail@mail.com', 'E-mail');

        ok(personModel.model().firstName.isValid(), 'First name is valid');
        ok(!personModel.model().lastName.isValid(), 'Last name is invalid');
        ok(personModel.model().email.isValid(), 'Email is valid');

        equal(personModel.model().lastName.error(), 'This field is required.', 'Last name validation message');
    } finally {
        ko.cleanNode(getContainer());
    }
});
*/