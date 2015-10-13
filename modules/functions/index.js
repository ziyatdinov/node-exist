var config = require('../../modules/config'),
    request = require('../../modules/request'),
    cheerio = require('cheerio'),
    async = require('async'),
    urlencode = require('urlencode'),
    querystring = require('querystring');

var _self = module.exports = {
    checkAuth: function (callback) {
        console.log('check auth [fetch page]'.green);
        _self.getPage(config.url, function (html) {
            if (html) {
                console.log('check auth [check auth status]'.green);
                loginForm = html('input#login').length;
                if (loginForm === 0) {
                    console.log('check auth [already auth]'.blue);
                    callback(1);
                } else {
                    console.log('check auth [need auth]'.yellow);
                    console.log('check auth [do auth]'.yellow);
                    _self.doAuth(function (auth) {
                        if (auth === 1) {
                            console.log('check auth [success]'.blue);
                            callback(data);
                        } else {
                            console.log('check auth [failed]'.red);
                            callback(0);
                        }
                    })
                }
            }
        });
    },
    doAuth: function (callback) {
        console.log('do auth [send auth request]'.green);
        request({
            uri: config.auth,
            referer: config.url,
            formData: {
                'login': config.login,
                'pass': config.password,
                'save': 'yes'
            },
            method: 'POST'
        }, function (err, res) {
            if (!err && res.statusCode === 302) {
                console.log('do auth [success]'.blue);
                callback(1);
            } else {
                console.log('do auth [failed]'.red);
                callback(0);
            }
        });
    },
    search: function (string, firm, callback) {
        var url = config.search + urlencode(string);
        console.log('category (get) fetch page: '.green + url.bold.magenta);
        _self.getPage(url, function (page) {
            if (page) {
                console.log('category page [fetch success]'.blue);
                _self.getSystemVars(string, page, function (variables) {
                    console.log('emulate fetch alert'.green);
                    request({
                        url: config.alert,
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    }, function (err, res) {
                        if (!err && res.statusCode === 200) {
                            console.log('emulate fetch alert [fetch alert success]'.blue);
                            console.log('search (post) fetch page: '.green + url.bold.magenta);
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
                                request({
                                    uri: url,
                                    referer: config.url,
                                    formData: variables,
                                    method: 'POST'
                                }, function (err, res, body) {
                                    if (!err && res.statusCode === 200 && body != undefined) {
                                        console.log('search page (post) [fetch success]'.blue);
                                        var $ = cheerio.load(body);
                                        if ($ != undefined) {
                                            console.log('search (post) page [load success]'.blue);

                                            //console.log($.html());

                                            if ($('h1').text().split(' ')[1]==='Артикул'){
                                                $('tr').each(function(){

                                                    var children = $(this).children();
                                                    var firmItem = children.eq(0).children().eq(0);
                                                    var artItem  = children.eq(0).children().eq(1);
                                                    var urlItem  = children.eq(1).children().eq(0);

                                                    var row = {
                                                        'firm' : firmItem.text(),
                                                        'art' :  artItem.text(),
                                                        'url' :  urlItem.attr('href')
                                                    };

                                                    //console.log(row['firm']+' '+row['art']+' '+row['url']);

                                                    if(row['firm']===firm && row['art']===string){
                                                        console.log('firm: '.green + firm .blue)
                                                        callback(row['url'].substring(1));
                                                    }

                                                })
                                            } else {
                                                callback($);
                                            }
                                        } else {
                                            console.log('search (post) page [load failed]'.red);
                                            callback();
                                        }
                                    } else {
                                        console.log('search (post) page [fetch failed]'.red);
                                        callback();
                                    }
                                });
                            }, 3000);
                        } else {
                            console.log('emulate fetch alert [fetch alert failed]'.red);
                            callback();
                        }
                    });
                })
            } else {
                console.log('category (get) page [fetch failed]'.red);
                callback();
            }
        });
    },
    parse: function (html, callback) {
        callback(html('table').eq(2).text());
    },
    getSystemVars: function (string, html, callback) {
        console.log('get system variables'.green);
        callback({
            'ctl00$ctl00$b$tm': 'ctl00$ctl00$b$tm|ctl00$ctl00$b$b$btnPost',
            __EVENTTARGET: 'ctl00$ctl00$b$b$btnPost',
            __VIEWSTATE: html('input#__VIEWSTATE').attr('value'),
            __EVENTVALIDATION: html('input#__EVENTVALIDATION').attr('value'),
            'ctl00$ctl00$b$b$hdnPcode': string,
            __ASYNCPOST: 'true'
        });
    },
    getPage: function (url, callback) {
        request(url, function (err, res, body) {
            console.log('get page [fetch page: '.green + url.bold.magenta + ']'.green);
            if (!err && res.statusCode === 200 && body != undefined) {
                console.log('get page [fetch success]'.blue);
                console.log('get page [load html body]'.green);
                var $ = cheerio.load(body);
                if ($ != undefined) {
                    console.log('get page [load success]'.blue);
                    callback($);
                } else {
                    console.log('get page [load failed]'.red);
                    callback();
                }
            } else {
                console.log('get page [fetch failed: ' + err + ']'.red);
                callback();
            }
        });
    }
};