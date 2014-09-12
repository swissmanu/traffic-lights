var debug = require('debug')('traffic-lights:indicator:clewaretrafficlights')
	, q = require('q')
	, exec = require('child_process').exec
	, states = require('./state')
	, Indicator = require('./indicator')
	, util = require('util');

/** Module: ClewareTrafficLights
 *
 * See also:
 *     * http://www.cleware.net/neu/produkte/usbtischampel.html
 *     * https://blog.codecentric.de/en/2013/07/using-a-raspberry-pi-to-control-an-extreme-feedback-devices/
 */
function ClewareTrafficLights(config) {
	Indicator.call(this, config);

	this.blinking = false;
}
util.inherits(ClewareTrafficLights, Indicator);
module.exports = ClewareTrafficLights;


/** Function: buildParameterString
 *
 */
function buildParameterString(redOn, yellowOn, greenOn) {
	var parameterString = ' -c 1 -as 0 ' + (redOn ? '1' : '0');
	parameterString += ' -as 1 ' + (yellowOn ? '1' : '0');
	parameterString += ' -as 2 ' + (greenOn ? '1' : '0');

	debug('parameter string: ' + parameterString);

	return parameterString;
}

/** Function: executeClewarecontrol
 *
 */
function executeClewarecontrol(config, parameters) {
	debug('execute clewarecontrol using parameters "' + parameters + '"');

	var deferred = q.defer();

	exec(config.clewarecontrolBinary + parameters, function(err) {
		if(err) {
			debug('error while executing clewarecontrol: ' + err);
			deferred.reject(err);
		} else {
			debug('clewarecontrol executed successfully');
			deferred.resolve();
		}
	});

	return deferred.promise;
}

/** Function: delay
 *
 */
function delay(ms) {
	var runner = function() {
		var deferred = q.defer();

		setTimeout(function() {
			deferred.resolve();
		}, ms);

		return deferred.promise;
	};

	return runner.bind(this);
}

/** Function: playRoundAbout
 * Lights each traffic light on and off in fancy order.
 */
function playRoundAbout(config) {
	return executeClewarecontrol(config, buildParameterString(false, false, false))
	.then(executeClewarecontrol.bind(this, config, buildParameterString(true, false, false)))
	.then(delay(150))
	.then(executeClewarecontrol.bind(this, config, buildParameterString(false, true, false)))
	.then(delay(150))
	.then(executeClewarecontrol.bind(this, config, buildParameterString(false, false, true)))
	.then(delay(150))
	.then(executeClewarecontrol.bind(this, config, buildParameterString(false, false, false)))
	.then(delay(150))
	.then(executeClewarecontrol.bind(this, config, buildParameterString(true, true, true)))
	.then(delay(150))
	.then(executeClewarecontrol.bind(this, config, buildParameterString(false, false, false)))
	.then(delay(150))
	.then(executeClewarecontrol.bind(this, config, buildParameterString(true, true, true)));
}






ClewareTrafficLights.prototype.start = function start() {
	debug('Start cleware traffic lights');
	return playRoundAbout(this.config);
};

ClewareTrafficLights.prototype.stop = function stop() {
	debug('Stopping cleware traffic lights');
	return executeClewarecontrol(this.config, buildParameterString(false, false, false));
};

ClewareTrafficLights.prototype.update = function update(state, lastState) {
	debug('Show state ' + state);

	var deferred = q.defer()
		, parameters;

	if(state !== lastState) {
		debug('Update traffic lights');

		switch(state) {
			case states.WARNING :
			case states.WARNING_IMPORTANT :
				parameters = buildParameterString(false, true, false);
				break;
			case states.OK :
			case states.OK_IMPORTANT :
				parameters = buildParameterString(false, false, true);
				break;
			case states.ERROR :
			case states.ERROR_IMPORTANT :
				parameters = buildParameterString(true, false, false);
				break;
			default:
				parameters = buildParameterString(false, false, false);
				break;
		}

		executeClewarecontrol.call(this, this.config, parameters)
		.then(function() {
			deferred.resolve();
		})
		.catch(function(err) {
			deferred.reject(err);
		});

	} else {
		debug('No need to update traffic lights');
		deferred.resolve();
	}

	return deferred.promise;
};