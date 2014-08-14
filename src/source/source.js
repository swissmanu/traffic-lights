function Source(config) {
	this.config = config || {};
}
module.exports = Source;

Source.prototype.getState = function getState() {
	throw new Error('Overwrite getState in concrete source!');
};