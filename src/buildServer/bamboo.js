var q = require('q');

function latestBuildOnBamboo(config, request) {
	var defered = q.defer();

	request.get(
		//'https://project-barcelona.ch/bamboo/rest/api/latest/plan.json?os_authType=basic'
		'https://project-barcelona.ch/bamboo/rest/api/latest/result/IB-IBP.json?os_authType=basic'
		, {
			auth: {
				user: config.username
				, password: config.password
				, sendImmediately: false
			}
		}
		, function(error, response, body) {
			if(error === null) {
				var latestBuild = JSON.parse(body).results.result[0];
				defered.resolve(latestBuild);
			} else {
				defered.reject(error);
			}
		}
	);

	return defered.promise;
}

module.exports = latestBuildOnBamboo;
