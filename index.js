var debug = require('debug')('traffic-lights')
	, config = require('./config.json')
	, BigBrother = require('./src/bigBrother')
	, bigBrother = new BigBrother(config);

bigBrother.watch();
