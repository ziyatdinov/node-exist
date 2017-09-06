//####
var config = require('./modules/config'),
    functions = require('./modules/functions'),
    logger = require('./modules/logger'),
    colors = require('colors'),
    Type = require('type-of-is');


functions.checkAuth(function (auth) {
    if (auth) {
        var i = 0,
            interval = setInterval(function () {
                var msg = '';
                i++;
                for (var j = 0; i != j; j++) {
                    msg += '.';
                }
                msg = 'Timeout' + msg;
                process.stdout.write(msg.rainbow + "\r");
            }, 100);
        setTimeout(function () {
            console.log();
            clearInterval(interval);
            var row = {'firm': 'MGA','art': 'W683','url': 'pcode'}
            functions.search(row, function (result) {
                if (result) {
                    console.log('*'.red);
                    functions.parse(result, function (data) {
                        if (data) {
                            console.log(data);
                        } else {
                            console.log('parse failed, something wrong bro!'.red);
                        }
                    });
                } else {
                    console.log('search failed, something wrong bro!'.red);
                }
            });
        }, 3000);
    } else {
        console.log('auth failed, something wrong bro!'.red);
    }
});
