var debug = require('debug')('traffic-lights:source:checkserver')
	, q = require('q')
	, state = require('../indicator/state')
	, Source = require('./source')
	, util = require('util');


function CheckServer(config, request) {
	debug('created');
	Source.call(this, config);
	this.request = request;
}
util.inherits(CheckServer, Source);
module.exports = CheckServer;


CheckServer.prototype.getState = function getState() {
	debug('check server');

	var self = this
		, defered = q.defer()
		, url = this.getConfigValue('url');

	debug('try to connect to ' + url);

	this.request.get(url
		, function(error, response) {
			if(!error) {
				if(response.statusCode === (self.config.expectedHttpStatus || 200)) {
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
};
