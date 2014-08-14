function Indicator(config) {
	this.config = config;
}
module.exports = Indicator;

Indicator.prototype.start = function start() {
	throw new Error('Overwrite start in concrete source!');
};

Indicator.prototype.update = function update() {
	throw new Error('Overwrite update in concrete source!');
};

Indicator.prototype.stop = function stop() {
	throw new Error('Overwrite stop in concrete source!');
};
