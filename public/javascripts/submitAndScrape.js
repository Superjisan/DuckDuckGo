$(function(){
  //on submit click
  $('#submit').on("click", function(e){
      e.preventDefault();
      console.log('submit clicked');
        //value to post
        var searchQuery = $("#searchQuery").val();
        //data to post to /search
        var data = {};
        data.title = "title";
        data.message = "message";
        if(searchQuery){
          data.searchQuery = searchQuery;
        } else {
          data.searchQuery  = ''; }

      //ajax request
      $.ajax({
        context: $("#json"),
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/search',
        //on success change #json innerhtml
        success: function(data) {
          console.log('success');
          var queryResult = data.searchResult;
          $("#json").remove()
          $(".queryResult").append("<p id='json'></p>")
          $("#json").append("<span> DuckDuckGo API JSON results: <span>");
          $("#json").jsontree(queryResult);
          }
        });
      });

  //on scrape click
  $('#scrape').on('click', function(e){
    e.preventDefault();

    console.log("scrape button clicked");
     var searchQuery = $("#searchQuery").val();
      //data to post to /scrape
      var data = {};
      data.title = "title";
      data.message = "message";
      if(searchQuery){
        data.searchQuery = searchQuery;
      } else {
        data.searchQuery  = ''; }

    //ajax request
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/scrape',
      //on success change #json innerhtml
      success: function(data) {
        console.log('success');
        var queryResult = data.resultArray;
        $("#json").remove()
        $(".queryResult").append("<p id='json'></p>");
        $("#json").append("<span> DuckDuckGo Scrape Results: <span>");
        $("#json").jsontree(queryResult)
        }
      });
    });
});
