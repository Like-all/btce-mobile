/**
 * Module dependencies.
 */

var express = require('express');
var settings = require('./settings.js')
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || settings.getPort());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.basicAuth(function(user, pass) {
  return user === settings.getUsername() && pass === settings.getPassword();
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.pairs);
app.get('/pair/:pair', routes.index);
app.get('/sell', routes.sell);
app.get('/buy', routes.buy);
app.get('/orders', routes.orders);
app.get('/cancel', routes.cancel);


fs.writeFileSync('/tmp/btce-mobile.pid', process.pid);

http.createServer(app).listen(app.get('port'), 'localhost',function(){
  console.log('Express server listening on port ' + app.get('port'));
});
