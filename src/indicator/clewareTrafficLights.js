// http://www.cleware.net/neu/produkte/usbtischampel.html
// https://blog.codecentric.de/en/2013/07/using-a-raspberry-pi-to-control-an-extreme-feedback-devices/

var debug = require('debug')('traffic-lights:indicator:clewaretrafficlights')
	, q = require('q');

function showWithClewareTrafficLights(config, buildState) {
	debug('Show build state ' + buildState);

	var defered = q.defer();

	defered.resolve();

	return defered.promise;
}

module.exports = showWithClewareTrafficLights;