/** Module: ClewareTrafficLights
 *
 * See also:
 *     * http://www.cleware.net/neu/produkte/usbtischampel.html
 *     * https://blog.codecentric.de/en/2013/07/using-a-raspberry-pi-to-control-an-extreme-feedback-devices/
 */


var debug = require('debug')('traffic-lights:indicator:clewaretrafficlights')
	, q = require('q')
	, exec = require('child_process').exec
	, indicatorStates = require('./indicatorState');

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

/** Function: init
 *
 */
function init(config) {
	debug('Init cleware traffic lights');
	return playRoundAbout(config);
}

/** Function: stop
 *
 */
function stop(config) {
	debug('Stopping cleware traffic lights');
	return executeClewarecontrol(config, buildParameterString(false, false, false));
}

/** Function: update
 *
 */
function update(config, indicatorState, lastIndicatorState) {
	debug('Show state ' + indicatorState);

	var deferred = q.defer()
		, parameters;

	if(indicatorState !== lastIndicatorState) {
		debug('Update traffic lights');

		switch(indicatorState) {
			case indicatorStates.WARNING :
				parameters = buildParameterString(false, true, false);
				break;
			case indicatorStates.OK :
				parameters = buildParameterString(false, false, true);
				break;
			case indicatorStates.ERROR :
				parameters = buildParameterString(true, false, false);
				break;
			default:
				parameters = buildParameterString(false, false, false);
				break;
		}

		playRoundAbout(config)
		.then(executeClewarecontrol.bind(this, config, parameters))
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
}

module.exports = {
	init: init
	, update: update
	, stop: stop
};