var Source = function(config) {
	this.config = config || {};
};

Source.prototype.getState = function getState() {
	throw new Error('Overwrite getState in concrete source!');
};

module.exports = Source;