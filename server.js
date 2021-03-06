var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

//handle errors from malformed JSON payload provided in a request
app.use(function(error, request, response, next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) 
  {
  	response.set("Content-Type", "application/json");
    response.status(400).send({"error": "Could not decode request: JSON parsing failed"});
  }
});

//use post route to get the request payload and process data according to requirements/ constrains
app.post('/', function(request, response){
	response.set("Content-Type", "application/json");
	var jsonObj = request.body;
	var responseJson = {};
	if(jsonObj.hasOwnProperty("payload"))
	{
		var keyResponse = "response";
		responseJson[keyResponse] = [];
		for(var key in jsonObj.payload)
		{
			var jsonItem = jsonObj.payload[key];
			if(jsonItem.hasOwnProperty("image") && jsonItem.hasOwnProperty("slug") && jsonItem.hasOwnProperty("title") && jsonItem.hasOwnProperty("drm") && jsonItem.hasOwnProperty("episodeCount"))
			{
				if(jsonItem.drm == true && jsonItem.episodeCount>0)
				{
					var showTitle = jsonItem.title;
					var showImage = jsonItem.image.showImage;
					var showSlug = jsonItem.slug;
					responseJson[keyResponse].push({"image" : showImage, "slug" : showSlug, "title" : showTitle});
				}
			}
		}
		response.status(200);
	}
	else
	{
		response.status(400);
		var keyResponse = "error";
		responseJson[keyResponse] = "Could not decode request: JSON parsing failed";
	}
	response.send(responseJson);
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Sever is up and listening on port "+port);