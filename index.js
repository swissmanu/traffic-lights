var debug = require('debug')('traffic-lights')
	, request = require('request')
	, prettyjson = require('prettyjson')
	, Timestring = require('timestring')
	, config = require('./config.json')
	, buildServer = require('./src/buildServer/' + config.source.type)

function poll() {
	buildServer(config.source, request)
	.then(function(latestBuildState) {
		debug('got build state ' + latestBuildState);
		console.log(latestBuildState);
	})
	.catch(function(error) {
		debug('error while fetching build state :(');
		console.error(error);
	});

	debug('schedule next poll in ' + (config.pollInterval / 1000) + 'seconds');
	setTimeout(poll, config.pollInterval);
}

poll();