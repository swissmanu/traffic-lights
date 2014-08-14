var debug = require('debug')('traffic-lights:bigbrother')
	, request = require('request')
	, states = require('./indicator/state')
	, lastState
	, q = require('q');

/** Function: poll
 *
 */
function poll(sources,  config, indicator) {
	debug('polling...');

	var self = this;

	q.all(sources.map(function(source, index) {
		return source(config.sources[index], request);
	}))
	.then(function(sourceStates) {
		var maxState = states.NONE;

		sourceStates.forEach(function(state) {
			maxState = Math.max(state, maxState);
		});

		var promise = indicator.update(config.indicator, maxState, lastState);
		lastState = maxState;
		return promise;
	})
	.then(function() {
		debug('schedule next poll in ' + (config.pollInterval / 1000) + ' seconds');
		self.timeoutId = setTimeout(poll.bind(self, sources, config, indicator), config.pollInterval);
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

	var self = this;

	self.config = config;
	self.sources = [];
	self.indicator = require('./indicator/' + config.indicator.type);


	config.sources.forEach(function(source) {
		self.sources.push(require('./source/' + source.type));
	});

	return self;
};

/** Function: watch
 *
 */
BigBrother.prototype.watch = function watch() {
	if(!this.isWatching()) {
		debug('Start watching you');

		this.indicator.init(this.config.indicator)
		.then(poll.bind(this, this.sources, this.config, this.indicator));
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
};

module.exports = BigBrother;