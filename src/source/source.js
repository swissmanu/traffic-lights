var Source = function(config) {
	this.config = config || {};
};

Source.prototype.getState = function getState() {
	throw new Error('Overwrite getState in concrete source!');
};

Source.prototype.getConfigValue = function getConfigValue(key) {
	return this.config[key];
};

module.exports = Source;