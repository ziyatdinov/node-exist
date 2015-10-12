var config = require('./modules/config'),
    functions = require('./modules/functions'),
    logger = require('./modules/logger');

functions.checkAuth(function (auth) {
    if (auth) {
        var i = 0,
            interval = setInterval(function () {
                var msg = '';
                i++;
                for (var j = 0; i != j; j++) {
                    msg += '.';
                }
                console.log(msg);
            }, 300);
        setTimeout(function () {
            clearInterval(interval);
            functions.search('C182/606', function (result) {
                if (result) {
                    functions.parse(result, function (data) {
                        if (data) {
                            console.log(data);
                        } else {
                            console.log('parse failed, something wrong bro!');
                        }
                    });
                } else {
                    console.log('search failed, something wrong bro!');
                }
            });
        }, 3000);
    } else {
        console.log('auth failed, something wrong bro!');
    }
});
