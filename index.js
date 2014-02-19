var request = require('request')
	, prettyjson = require('prettyjson')
	, config = require('./config.json')
	, buildServer = require('./src/buildServer/' + config.source.type);

buildServer(config.source, request)
.then(function(latestBuild) {
	console.log(prettyjson.render(latestBuild));
})
.catch(function(error) {
	console.error(error);
});