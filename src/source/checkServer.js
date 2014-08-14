var debug = require('debug')('traffic-lights:source:checkserver')
	, q = require('q')
	, state = require('../indicator/state');

function latestBuildOnBamboo(config, request) {
	var defered = q.defer()
		, url = config.url;

	debug('try to connect to ' + url);

	request.get(url
		, function(error, response) {
			if(!error) {
				if(response.statusCode === (config.expectedHttpStatus || 200)) {
					debug('got expected http status code');
					defered.resolve(state.OK);
				} else {
					debug('got unexpected http status code ' + response.statusCode);
					defered.resolve(state.ERROR);
				}
			} else {
				debug('connection error');
				defered.resolve(state.ERROR);
			}
		}
	);

	return defered.promise;
}

module.exports = latestBuildOnBamboo;
