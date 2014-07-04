var http = require('http');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.search = function(req,res){
  var searchQuery = req.body.searchQuery;
  var duckduckgoResponse;
  var searchResult;
  console.log("searchQuery:", searchQuery);

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

    var searchInput = ddgJSONRequest(searchQuery);
    console.log("searchInput", searchInput)

    var ddgResponse = http.get(searchInput, function(res){
      var body = '';

      res.on('data', function(chunk){
        body += chunk;
      });

      res.on('end', function(){
        duckduckgoResponse = JSON.parse(body);
        // console.log("Got response:", duckduckgoResponse);
        // })
        searchResult = duckduckgoResponse;
        console.log("searchResult: ", searchResult);
        //res.send(200, {searchResult: searchResult});
      }).on('error', function(err){
        console.log("GOT Error:", err)
      });
    })


}
