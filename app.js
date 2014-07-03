
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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function ddgJSONRequest(string){
  if (typeof string !== "string"){
    console.log("Please put a string as an argument")
  } else{
    var query = string.split(' ').join('+')
    console.log("query: ", query);
    var result = "http://api.duckduckgo.com/?q="+ query +"&format=json&pretty=1";
    console.log("json result: ", result)
    return result
  }
}

var url = ddgJSONRequest("George Washington");

http.get(url, function(res){
  var body = '';

  res.on('data', function(chunk){
    body += chunk;
  });

  res.on('end', function(){
    var duckduckgoResponse = JSON.parse(body)
    console.log("Got response:", duckduckgoResponse);
  })
}).on('error', function(err){
  console.log("GOT Error:", err)
})

//ddg query
// ddg.query("Google", function(err, data){
//     console.log("Result of ddg query: ", data) // logs a dictionary with all return fields
// });

// app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
