//for searchable
(function () {
    $.mockjaxSettings.responseTime = 100;
    $.mockjaxSettings.status = 200;
    $.mockjaxSettings.contentType = 'application/json';

    var allUsers = [
        { username: 'franco' },
        { username: 'karol' },
        { username: 'gabi' },
        { username: 'toby' },
    ];

    function find(username) {
        for (var i in allUsers) {
            if (allUsers[i].username === username) {
                return allUsers[i];
            }
        }
        return null;
    }

    $.mockjax({
        url: '/api/users/check-username',
        type: 'POST',
        contentType: 'application/json',
        response: function(settings) {
            var data = $.parseJSON(settings.data);
            var username = data.username;
            var user;
            if (username) {
                user = find(username);
            }
            if (!user) {
                this.status = 200;
            } else {
                this.status = 400;
                this.responseText = JSON.stringify({
                    message: 'Este username já está em uso por outro usuário'
                });
                this.headers = {
                    'Content-Type': 'application/json'
                };
            }
        }
    });
    $.mockjax({
        url: '/api/users/check-username-checkresult',
        type: 'POST',
        contentType: 'application/json',
        response: function(settings) {
            var data = $.parseJSON(settings.data);
            var username = data.username;
            var user;
            if (username) {
                user = find(username);
            }
            if (!user) {
                this.status = 200;
            } else {
                this.status = 400;
                this.responseText = JSON.stringify({
                    validationMessage: 'Este username já está em uso por outro usuário'
                });
                this.headers = {
                    'Content-Type': 'application/json'
                };
            }
        }
    });
    $.mockjax({
        url: '/api/users/check-username-prepdata',
        type: 'POST',
        contentType: 'application/json',
        response: function(settings) {
            var data = $.parseJSON(settings.data);
            var username = data.username;
            var token = data.token;
            if (token !== 12345) {
                this.status = 400;
                this.responseText = JSON.stringify({
                    message: 'Token inválido'
                });
            } else {
                var user;
                if (username) {
                    user = find(username);
                }
                if (!user) {
                    this.status = 200;
                } else {
                    this.status = 400;
                    this.responseText = JSON.stringify({
                        message: 'Este username já está em uso por outro usuário'
                    });
                    this.headers = {
                        'Content-Type': 'application/json'
                    };
                }
            }
        }
    });
    $.mockjax({
        url: '/api/users/check-username-prepdata-checkresult',
        type: 'POST',
        contentType: 'application/json',
        response: function(settings) {
            var data = $.parseJSON(settings.data);
            var username = data.username;
            var token = data.token;
            if (token !== 12345) {
                this.status = 400;
                this.responseText = JSON.stringify({
                    validationMessage: 'Token inválido'
                });
            } else {
                var user;
                if (username) {
                    user = find(username);
                }
                if (!user) {
                    this.status = 200;
                } else {
                    this.status = 400;
                    this.responseText = JSON.stringify({
                        validationMessage: 'Este username já está em uso por outro usuário'
                    });
                    this.headers = {
                        'Content-Type': 'application/json'
                    };
                }
            }
        }
    });
})();