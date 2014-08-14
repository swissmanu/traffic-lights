var debug = require('debug')('traffic-lights:source:checkserver')
	, q = require('q')
	, buildState = require('../buildState');

function latestBuildOnBamboo(config, request) {
	var defered = q.defer()
		, url = config.url;

	debug('try to connect to ' + url);

	request.get(url
		, function(error, response) {
			if(!error) {
				if(response.statusCode === (config.expectedHttpStatus || 200)) {
					debug('got expected http status code');
					defered.resolve(buildState.SUCCESS);
				} else {
					debug('got unexpected http status code ' + response.statusCode);
					defered.resolve(buildState.FAILED);
				}
			} else {
				debug('connection error');
				defered.resolve(buildState.FAILED);
			}
		}
	);

	return defered.promise;
}

module.exports = latestBuildOnBamboo;
