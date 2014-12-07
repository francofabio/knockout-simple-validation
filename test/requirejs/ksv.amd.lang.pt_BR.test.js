define(['knockout', 'ksv', 'ksv.pt_BR'], function(ko, ksv) {
    'use strict';

    QUnit.module('ksv.test.language.pt_BR');

    test('should retrieve message for required, email and date in portuguese', function() {
        ksv.settings.lang = 'pt_BR';
        var email = ko.observable().extend({validator: {required: true, email: true}});
        email('');
        QUnit.equal(email.error(), 'Este campo é obrigatório');
        email('john');
        QUnit.equal(email.error(), 'Por favor, informe um e-mail válido');

        var data = ko.observable().extend({validator: {date: {}}});
        data(10);
        QUnit.equal(data.error(), 'Por favor, informe uma data válida');
    });
});