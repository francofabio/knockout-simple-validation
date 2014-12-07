/*
 * knockout-simple-validation v1.0.0 - 2014-12-07
 * Copyright (c) 2014 Binar Tecnologia;
 */
// Source: src/ksv.pt_BR.js
/*
 * Simple model validation for knockout.
 * Dependencies: jquery, knockout, moment, jscommons
 */
(function(factory) {
    'use strict';
    /* global require:false, module:false, exports:false, define:false, ksv:false */
    
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        factory(require('ksv'));
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['ksv'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(ksv);
    }
}(function(ksv) {
    'use strict';
    /* global ksv:false */
    var pt_BR_lang = 'pt_BR';
    ksv.settings.lang = pt_BR_lang;
    ksv.rules.registerMessages({
        required: 'Este campo é obrigatório',
        email: 'Por favor, informe um e-mail válido',
        url: 'Por favor, informe uma URL válida',
        nativeDate: 'Por favor, informe uma data válida',
        date: {
            type: 'Por favor, informe uma data válida',
            min: 'Por favor, informe uma data maior ou igual a ${params.min}',
            max: 'Por favor, informe uma data menor ou igual a ${params.max}'
        },
        number: 'Por favor, informe um valor numérico válido',
        integer: 'Por favor, informe um número inteiro válido',
        max: {
            type: 'O validador \'max\' só pode ser aplicado a propriedades de tipos numéricos ou data',
            max: 'Por favor, informe um valor menor ou igual a ${params.value}'
        },
        min: {
            'type': 'O validador \'min\' só pode ser aplicado a propriedades de tipos numéricos ou data',
            'min': 'Por favor, informe um valor maior ou igual a ${params.value}'
        },
        maxlength: {
            'type': 'O validador \'maxlength\' só pode ser aplicado a propriedades do tipo string',
            'maxlength': 'O valor não pode conter mais de ${params.value} caracteres'
        },
        minlength: {
            'type': 'O validador \'minlength\' só pode ser aplicado a propriedades do tipo string',
            'minlength': 'O valor não pode conter menos de ${params.value} caracteres'
        },
        rangelength: {
            'type': 'O validador \'rangelength\' só pode ser aplicado a propriedades do tipo string',
            'min': 'O valor não pode conter menos de ${params.min} caracteres',
            'max': 'O valor não pode conter mais de ${params.max} caracteres'
        },
        equalsTo: 'Por favor, informe o mesmo valor do atributo ${params.otherName}',
        remote: 'Por favor, informe um valor válido'
    }, pt_BR_lang);
}));