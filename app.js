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
            functions.search('Q20TT', 'Denso', function (result) {
                if (result) {
                    if(Type(result,String)===true){
                        //console.log(result);
                        functions.search_p(result,function(result){
                                functions.parse(result, function (data) {
                                    if (data) {
                                        console.log(data);
                                    } else {
                                        console.log('parse failed, something wrong bro!'.red);
                                    }
                                });
                            }
                        );
                    } else {
                        functions.parse(result, function (data) {
                            if (data) {
                                console.log(data);
                            } else {
                                console.log('parse failed, something wrong bro!'.red);
                            }
                        });
                    }
                } else {
                    console.log('search failed, something wrong bro!'.red);
                }
            });
        }, 3000);
    } else {
        console.log('auth failed, something wrong bro!'.red);
    }
});
