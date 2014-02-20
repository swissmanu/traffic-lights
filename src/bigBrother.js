var debug = require('debug')('traffic-lights:bigbrother')
	, request = require('request');

/** Function: poll
 *
 */
function poll(source,  config, indicator) {
	var self = this;

	source(config.source, request)
	.then(function(buildState) {
		return indicator(config.indicator, buildState);
	})
	.then(function() {
		debug('schedule next poll in ' + (config.pollInterval / 1000) + ' seconds');
		self.timeoutId = setTimeout(poll.bind(self, source, config, indicator), config.pollInterval);
	})
	.catch(function(error) {
		debug('error :(');
		console.error(error);
	});
}

/** Object: BigBrother
 * <BigBrother> watches your configured build server and updates specific
 * indicators with the latest build state.
 *
 * Parameters:
 *     (Object) config - Configuration values to setup <BigBrother>.
 */
var BigBrother = function(config) {
	debug('Setting up Big Brother');

	if(!config) {
		throw new Error('Big Brother cannot watch you without proper config!');
	}

	this.config = config;
	this.source = require('./source/' + config.source.type)
	this.indicator = require('./indicator/' + config.indicator);

	return this;
};

/** Function: watch
 *
 */
BigBrother.prototype.watch = function watch() {
	if(!this.isWatching()) {
		debug('Start watching you');
		poll.call(this, this.source, this.config, this.indicator);
	} else {
		debug('I\'m already watching you :-|');
	}
};

/** Function: stop
 *
 */
BigBrother.prototype.stop = function stop() {
	if(this.isWatching()) {
		debug('Stop watching you');
		clearTimeout(this.timeoutId);
		delete this.timeoutId;
	} else {
		debug('I\'m not watching you');
		result = false;
	}
};

/** Function: isWatching
 *
 */
BigBrother.prototype.isWatching = function isWatching() {
	return this.timeoutId !== undefined;
}

module.exports = BigBrother;