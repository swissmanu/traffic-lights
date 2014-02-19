var request = require('request')
	, prettyjson = require('prettyjson')
	, config = require('./config.json')
	, buildServer = require('./src/buildServer/' + config.source.type);

buildServer(config.source, request)
.then(function(latestBuildState) {
	console.log(latestBuildState);
})
.catch(function(error) {
	console.error(error);
});