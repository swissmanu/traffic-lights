var debug = require('debug')('traffic-lights:source:bamboo')
	, q = require('q')
	, states = require('../indicator/state')
	, Source = require('./source')
	, util = require('util')
	, isNumber = require('amp-is-number')
	, isUndefined = require('amp-is-undefined');

function Bamboo(config, request) {
	debug('created');
	Source.call(this, config);
	this.request = request;
}
util.inherits(Bamboo, Source);
module.exports = Bamboo;


Bamboo.prototype.getState = function getState() {
	debug('fetch build from bamboo');

	var self = this
		, defered = q.defer()
		, url = self.config.url;

	if(url.substr(-1) !== '/') {
		url += '/';
	}
	url += 'rest/api/latest/result/' + self.config.planId + '.json?max-result=1&os_authType=basic';

	debug('fetching latest build from ' + url);

	self.request.get(url
		, {
			auth: {
				user: self.config.username
				, password: self.config.password
				, sendImmediately: false
			}
		}
		, function(error, response, body) {
			if(!error && response.statusCode === 200) {
				debug('got valid response');

				var latestBuild = JSON.parse(body).results.result[0]
					, state = states.NONE;

				if(latestBuild.state === 'Failed') {
					debug('build says it failed');
					state = states.ERROR;
				} else if(latestBuild.state === 'Successful') {
					debug('build says it was successful');
					state = states.OK;
				}

				if(!isUndefined(self.config)) {
					// Limit state value if given in config:
					if(isNumber(self.config.maxState)) {
						debug('Limit state to ' + self.config.maxState);
						state = Math.min(state, self.config.maxState);
					}

					// If necessary, make this source more important:
					if(self.config.important === true) {
						debug('Make source more important');
						state++;
					}
				}

				defered.resolve(state);
			} else {
				debug('connection error');
				defered.reject(error);
			}
		}
	);

	return defered.promise;
};
