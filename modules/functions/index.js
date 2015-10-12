var config = require('../../modules/config'),
    request = require('../../modules/request'),
    cheerio = require('cheerio'),
    async = require('async'),
    urlencode = require('urlencode'),
    querystring = require('querystring');

var _self = module.exports = {
    checkAuth: function (callback) {
        console.log('check auth [fetch page]');
        _self.getPage(config.url, function (html) {
            if (html) {
                console.log('check auth [check auth status]');
                loginForm = html('input#login').length;
                if (loginForm === 0) {
                    console.log('check auth [already auth]');
                    callback(1);
                } else {
                    console.log('check auth [need auth]');
                    console.log('check auth [do auth]');
                    _self.doAuth(function (auth) {
                        if (auth === 1) {
                            console.log('check auth [success]');
                            callback(data);
                        } else {
                            console.log('check auth [failed]');
                            callback(0);
                        }
                    })
                }
            }
        });
    },
    doAuth: function (callback) {
        console.log('do auth [send auth request]');
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
                console.log('do auth [success]');
                callback(1);
            } else {
                console.log('do auth [failed]');
                callback(0);
            }
        });
    },
    search: function (string, callback) {
        var url = config.search + urlencode(string);
        console.log('category (get) fetch page: ' + url);
        _self.getPage(url, function (page) {
            if (page) {
                console.log('category page [fetch success]');
                _self.getSystemVars(string, page, function (variables) {
                    console.log('emulate fetch alert');
                    request({
                        url: config.alert,
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    }, function (err, res) {
                        if (!err && res.statusCode === 200) {
                            console.log('emulate fetch alert [fetch alert success]');
                            console.log('search (post) fetch page: ' + url);
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
                                request({
                                    uri: url,
                                    referer: config.url,
                                    formData: variables,
                                    method: 'POST'
                                }, function (err, res, body) {
                                    if (!err && res.statusCode === 200 && body != undefined) {
                                        console.log('search page (post) [fetch success]');
                                        var $ = cheerio.load(body);
                                        if ($ != undefined) {
                                            console.log('search (post) page [load success]');
                                            callback($);
                                        } else {
                                            console.log('search (post) page [load failed]');
                                            callback();
                                        }
                                    } else {
                                        console.log('search (post) page [fetch failed]');
                                        callback();
                                    }
                                });
                            }, 3000);
                        } else {
                            console.log('emulate fetch alert [fetch alert failed]');
                            callback();
                        }
                    });
                })
            } else {
                console.log('category (get) page [fetch failed]');
                callback();
            }
        });
    },
    parse: function (html, callback) {
        callback(html('table').eq(2).text());
    },
    getSystemVars: function (string, html, callback) {
        console.log('get system variables');
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
            console.log('get page [fetch page: ' + url + ']');
            if (!err && res.statusCode === 200 && body != undefined) {
                console.log('get page [fetch success]');
                console.log('get page [load html body]');
                var $ = cheerio.load(body);
                if ($ != undefined) {
                    console.log('get page [load success]');
                    callback($);
                } else {
                    console.log('get page [load failed]');
                    callback();
                }
            } else {
                console.log('get page [fetch failed: ' + err + ']');
                callback();
            }
        });
    }
};