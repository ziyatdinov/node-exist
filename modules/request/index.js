var request = require('request'),
    random_ua = require('random-ua'),
    FileCookieStore = require('tough-cookie-filestore'),
    fs = require('fs'),
    config = require('../../modules/config');

var cookie = request.jar(new FileCookieStore(config.cookie));
request = request.defaults({
    jar: cookie,
    headers: {
        'User-Agent': random_ua.generate()
    }
});

module.exports = request;