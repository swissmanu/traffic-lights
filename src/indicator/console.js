/** Module: Console
 * An indicator for the console
 */

var debug = require('debug')('traffic-lights:indicator:console')
	, q = require('q')
	, states = require('./state');

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
function update(config, state, lastState) {
	debug('Show state ' + state);

	if(state !== lastState) {
		debug('Update traffic lights');

		switch(state) {
			case states.WARNING :
				console.log('WARNING');
				break;
			case states.OK :
				console.log('OK');
				break;
			case states.ERROR :
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