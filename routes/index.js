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
  //post data/ajax data
  var searchQuery = req.body.searchQuery;
  var searchInput = ddgJSONRequest(searchQuery);

    /**
    * GET request for the ddg json
    * argument1 searchInput- the URL to go to
    * argument2 callback - after going there, using response as opposed to res, to not confuse express and http calls
    **/
    if (searchInput){ //to check if searchInput exists
      http.get(searchInput, function(response){
        var body = '';

        response.on('data', function(chunk){
          body += chunk;
        });

        response.on('end', function(){
          var duckduckgoResponse = JSON.parse(body); //the link is json formatted, so we need to parse it
          var ddgResponseJsonString = JSON.stringify(duckduckgoResponse);
          var ddgResponsePretty = JSON.stringify(JSON.parse(ddgResponseJsonString), null, 2)

          res.json(200, {searchResult: ddgResponseJsonString});
        }).on('error', function(err){
          console.log("GOT Error:", err)
        });
      })
    } else {
      console.log("searchInput is empty"); //error exception
    }

};


/*
* POST TOPIC SUMMARY SCRAPED result
*/
exports.scrape = function(req, res){

  var searchQuery = req.body.searchQuery;
  var urlToScrape = ddgURL(searchQuery);
  var pageHTML = request({url: urlToScrape}, function(err,response,body){

    console.log("Scraping URL:", urlToScrape);

   //Just a basic error check
    if(err && response.statusCode !== 200){
      console.log('Request error:', err);
    }

    var $ = cheerio.load(body)

    //TODO: clean these data up
    var titleArray = [];
    var $resultTitles = $(".large");
    $resultTitles.each(function(i,elem){
      titleArray[i] = $(this).text()
    })

    var snippetArray = [];
    $(".snippet").each(function(i, elem){
      snippetArray[i] = $(this).text()
    })

    var resultArray = []
    for(var j = 0; j < titleArray.length; j++){
      var result = {};
      result.title = titleArray[j];
      result.snippet = snippetArray[j];

      resultArray.push(result);
    }

    var JSONresultArray = JSON.stringify(resultArray)
    res.json(200, {resultArray: JSONresultArray});
  })

}



//converts the string to be the proper URL for the get request
function ddgJSONRequest(string){
    if (typeof string !== "string"){
      console.log("Please put a string as an argument")
    } else{
      var query = string.split(' ').join('+')
      //error message if query is empty
      if(query == ''){
        console.log("query is empty")
        return '';
      } else {
        var result = "http://api.duckduckgo.com/?q="+ query +"&format=json&pretty=1";

        return result
      }
    }
  }
//convert the input into the ddg url to scrape
function ddgURL(string){
      if (typeof string !== "string"){
        console.log("Please put a string as an argument")
      } else{
        var query = string.split(' ').join('+')
        var result = "http://duckduckgo.com/html/?q="+ query;
        return result
      }
    };
