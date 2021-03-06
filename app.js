
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ddg = require('ddg');
var swig = require('swig');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

// Swig Setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
swig.setDefaults({ cache: false });

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser()); //to receive proper data via ajax
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.post('/search', routes.search);
app.post('/scrape', routes.scrape);

//set up bower access on the front-end
app.use('/bower_components', express.static(__dirname + '/bower_components'));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
