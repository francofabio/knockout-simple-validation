(function() {
    /*
     * A lista de testes do QUnit
     * Quando informado o arquivo com a extenção '.js', o requirejs entende que
     * a dependencia está localizada a partir do diretório corrente e não a partir
     * do diretorio especificado em baseUrl
     */
    var allTests = [
        'ksv.amd.require.test',
        'ksv.amd.email.test',
        'ksv.amd.number.test'
    ];

    //Resolve os modulos de teste and inicializa o QUnit
    require(allTests, function() {
        QUnit.load();
        QUnit.start();
    });
})();