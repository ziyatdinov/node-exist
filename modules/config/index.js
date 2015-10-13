var config = module.exports = {};

var root = __dirname.split('/');
root = root.slice(0, root.length - 2).join('/');

config.proto = 'http';
config.hostname = 'localhost';
config.login = '180673';
config.password = '180673';
config.root = root;
config.cookie = config.root + '/modules/request/cookie.json';
config.url = config.proto + '://www.exist.ru/';
config.auth = config.url + 'Profile/Login.aspx?ReturnUrl=%2fProfile%2fExit.aspx';
config.alert = config.url + 'Profile/Api/Alerts.asmx/GetAlerts?a=null';
config.search = config.url + 'price.aspx?sr=-4&pcode=';
