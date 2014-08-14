var debug = require('debug')('traffic-lights:bigbrother')
	, request = require('request')
	, lastIndicatorState
	, buildStates = require('./buildState')
	, indicatorStates = require('./indicator/indicatorState');

/** Function: poll
 *
 */
function poll(source,  config, indicator) {
	debug('polling...');

	var self = this;

	source(config.source, request)
	.then(function(buildState) {

		var indicatorState;

		switch(buildState) {
			case buildStates.RUNNING :
				indicatorState = indicatorStates.WARNING;
				break;
			case buildStates.SUCCESS :
				indicatorState = indicatorStates.OK;
				break;
			case buildStates.FAILED :
				indicatorState = indicatorStates.ERROR;
				break;
			default:
				indicatorState = indicatorStates.NONE;
				break;
		}

		var promise = indicator.update(config.indicator, indicatorState, lastIndicatorState);
		lastIndicatorState = indicatorState;
		return promise;
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
	this.source = require('./source/' + config.source.type);
	this.indicator = require('./indicator/' + config.indicator.type);

	return this;
};

/** Function: watch
 *
 */
BigBrother.prototype.watch = function watch() {
	if(!this.isWatching()) {
		debug('Start watching you');
		var self = this;

		this.indicator.init(this.config.indicator)
		.then(function() {
			poll.call(self, self.source, self.config, self.indicator);
		});
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

		this.indicator.stop(this.config.indicator);
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