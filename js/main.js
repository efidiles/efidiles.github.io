(function(){
    $.getJSON( "data/articles.json", function( data ) {
      console.log(data.content);
    });
}())
