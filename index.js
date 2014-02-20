var debug = require('debug')('traffic-lights')
	, request = require('request')
	, config = require('./config.json')
	, source = require('./src/source/' + config.source.type)
	, indicator = require('./src/indicator/' + config.indicator);

function poll() {
	source(config.source, request)
	.then(indicator)
	.then(function() {
		debug('schedule next poll in ' + (config.pollInterval / 1000) + 'seconds');
		setTimeout(poll, config.pollInterval);
	})
	.catch(function(error) {
		debug('error :(');
		console.error(error);
	});
}

poll();