var debug = require('debug')('traffic-lights:source:checkserver')
	, q = require('q')
	, states = require('../indicator/state')
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
		, url = this.config.url;

	debug('try to connect to ' + url);

	this.request.get(url
		, function(error, response) {
			var state = states.NONE;

			if(!error) {
				if(response.statusCode === (self.config.expectedHttpStatus || 200)) {
					debug('got expected http status code');
					state = states.OK;
				} else {
					debug('got unexpected http status code ' + response.statusCode);
					state = states.ERROR;
				}
			} else {
				debug('connection error');
				state = states.ERROR;
			}

			if(this.config !== undefined && this.config.important === true) {
				state++;
			}

			defered.resolve(state);
		}
	);

	return defered.promise;
};
