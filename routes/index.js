var http = require('http');
var express = require('express');
var request = require('request');
var cheerio = require('cheerio')
var app = express();
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * POST JSON result
 */
exports.search = function(req,res){
  //post data
  var searchQuery = req.body.searchQuery;
  console.log("req body", req.body)
  //variables to be declared later
  var duckduckgoResponse;

  console.log("searchQuery:", searchQuery);

  //converts the string to be the proper URL for the get request
  function ddgJSONRequest(string){
      if (typeof string !== "string"){
        console.log("Please put a string as an argument")
      } else{
        var query = string.split(' ').join('+')
        console.log("query: ", query);
        if(query == ''){
          console.log("query is empty")
        } else {
          var result = "http://api.duckduckgo.com/?q="+ query +"&format=json&pretty=1";
          console.log("json result: ", result)
          return result
        }

      }
    }
    var searchInput = ddgJSONRequest(searchQuery);
    console.log("searchInput", searchInput)

    //GET request for the ddg json
    //param searchInput - or the URL to go to
    //callback - after going there, using response as opposed to res, to not confuse express and http calls
    if (searchInput){
      http.get(searchInput, function(response){
        var body = '';

        response.on('data', function(chunk){
          body += chunk;
        });

        response.on('end', function(){
          duckduckgoResponse = JSON.parse(body);
          console.log("searchResult: ", duckduckgoResponse);
          var ddgResponseJsonString = JSON.stringify(duckduckgoResponse);
          var ddgResponsePretty = JSON.stringify(JSON.parse(ddgResponseJsonString), null, 2)

          res.json(200, {searchResult: ddgResponsePretty});
        }).on('error', function(err){
          console.log("GOT Error:", err)
        });
      })
    } else {
      console.log("searchInput is empty")
    }

};


/*
* POST TOPIC SUMMARY SCRAPED result
*/
exports.scrape = function(req, res){

  function ddgURL(string){
      if (typeof string !== "string"){
        console.log("Please put a string as an argument")
      } else{
        var query = string.split(' ').join('+')
        console.log("query: ", query);
        var result = "http://api.duckduckgo.com/?q="+ query;
        console.log("url result: ", result)
        return result
      }
    };

  var searchQuery = req.body.searchQuery;
  var urlToScrape = ddgJSONRequest(searchQuery);
  console.log("URL TO SCRAPE:",  urlToScrape);

  res.redirect('/')

};
