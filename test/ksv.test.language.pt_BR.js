'use strict';

module('ksv.test.language.pt_BR');

test('should retrieve message for required, email and date in portuguese', function() {
    ksv.settings.lang = 'pt_BR';
    var email = ko.observable().extend({validator: {required: true, email: true}});
    email('');
    equal(email.error(), 'Este campo é obrigatório');
    email('john');
    equal(email.error(), 'Por favor, informe um e-mail válido');

    var data = ko.observable().extend({validator: {date: {}}});
    data(10);
    equal(data.error(), 'Por favor, informe uma data válida');
});