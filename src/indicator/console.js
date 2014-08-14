/** Module: Console
 * An indicator for the console
 */

var debug = require('debug')('traffic-lights:indicator:console')
	, q = require('q')
	, states = require('./state')
	, Indicator = require('./indicator')
	, util = require('util');


function Console(config) {
	debug('created');
	Indicator.call(this, config);
}
util.inherits(Console, Indicator);
module.exports = Console;


Console.prototype.start = function start() {
	return q.when();
};

Console.prototype.stop = function stop() {
	return q.when();
};

Console.prototype.update = function update(state, lastState) {
	debug('Show state ' + state);

	if(state !== lastState) {
		debug('Update traffic lights');

		switch(state) {
			case states.OK :
			case states.OK_IMPORTANT :
				console.log('OK');
				break;
			case states.WARNING :
			case states.WARNING_IMPORTANT :
				console.log('WARNING');
				break;

			case states.ERROR :
			case states.ERROR_IMPORTANT :
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
};