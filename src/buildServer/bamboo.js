var q = require('q')
	, states = require('./states');

function latestBuildOnBamboo(config, request) {
	var defered = q.defer()
		, url = config.url;

	if(url.substr(-1) !== '/') {
		url += '/';
	}
	url += 'rest/api/latest/result/IB-IBP.json?max-result=1&os_authType=basic';

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
				var latestBuild = JSON.parse(body).results.result[0]
					, state = states.OTHER;

				if(latestBuild.state === 'Failed') {
					state = states.FAILED;
				} else if(latestBuild.state === 'Successful') {
					state = states.SUCCESS;
				}

				defered.resolve(state);
			} else {
				defered.reject(error);
			}
		}
	);

	return defered.promise;
}

module.exports = latestBuildOnBamboo;
