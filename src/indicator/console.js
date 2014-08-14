/** Module: Console
 * An indicator for the console
 */

var debug = require('debug')('traffic-lights:indicator:console')
	, q = require('q')
	, indicatorStates = require('./indicatorState');

/** Function: init
 *
 */
function init(config) {
	debug('Init console indicator');
	return q.when();
}

/** Function: stop
 *
 */
function stop(config) {
	debug('Stopping console indicator');
	return q.when();
}

/** Function: update
 *
 */
function update(config, indicatorState, lastIndicatorState) {
	debug('Show state ' + indicatorState);

	if(indicatorState !== lastIndicatorState) {
		debug('Update traffic lights');

		switch(indicatorState) {
			case indicatorStates.WARNING :
				console.log('WARNING');
				break;
			case indicatorStates.OK :
				console.log('OK');
				break;
			case indicatorStates.ERROR :
				console.log('ERROR');
				break;
			default:
				console.log('NONE');
				break;
		}
	} else {
		debug('No need to update');
	}

	return q.when();
}

module.exports = {
	init: init
	, update: update
	, stop: stop
};