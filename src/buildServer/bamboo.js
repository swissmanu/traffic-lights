var debug = require('debug')('traffic-lights:buildServer:bamboo')
	, q = require('q')
	, states = require('./states');

function latestBuildOnBamboo(config, request) {
	debug('fetch build from bamboo');

	var defered = q.defer()
		, url = config.url;

	if(url.substr(-1) !== '/') {
		url += '/';
	}
	url += 'rest/api/latest/result/IB-IBP.json?max-result=1&os_authType=basic';

	debug('fetching latest build from url');

	request.get(url
		, {
			auth: {
				user: config.username
				, password: config.password
				, sendImmediately: false
			}
		}
		, function(error, response, body) {
			if(!error) {
				debug('got valid response');

				var latestBuild = JSON.parse(body).results.result[0]
					, state = states.OTHER;

				if(latestBuild.state === 'Failed') {
					debug('build says it failed');
					state = states.FAILED;
				} else if(latestBuild.state === 'Successful') {
					debug('build says it was successful');
					state = states.SUCCESS;
				}

				defered.resolve(state);
			} else {
				debug('connection error');
				defered.reject(error);
			}
		}
	);

	return defered.promise;
}

module.exports = latestBuildOnBamboo;
