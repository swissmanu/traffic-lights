# Traffic Lights
[![NPM version](https://badge.fury.io/js/traffic-lights.png)](http://badge.fury.io/js/traffic-lights)

Display Build Status on a indicators like the [Cleware USB Traffic Light](http://www.cleware.net/neu/produkte/usbtischampel.html).


## Requirements
* node.js 0.10
* Raspberry Pi with latest Raspbian
	* Might work on other systems too, but not tested.
* [Atlassian Bamboo](https://www.atlassian.com/software/bamboo) CI server
	* Other build servers can be integrated easily. Though, only Bamboo is implemented currently.
* [Cleware USB Traffic Light](http://www.cleware.net/neu/produkte/usbtischampel.html)
	* Other build status indicators can be integrated easily. Only the Cleware USB traffic light is implemented at the moment.

## Usage
### Prepare clewarecontrol
* Download and build the [Linux version](http://www.vanheusden.com/clewarecontrol/) of `clewarecontrol`
* Connect your traffic light to the Raspberry Pi

### Prepare `traffic-lights`
* Clone this repository on the Pi, copy `config.default.json` to `config.json` and adjust the configuration to your needs.

### Monitor Builds
Start `traffic-lights` with `$ npm start`. If your current user is not allowed to access the USB traffic light device, you may need to start the process with root privileges.

## Run as Daemon
You may consider [forever](https://github.com/nodejitsu/forever) to run `traffic-lights` as system daemon.

## Debug
`traffic-lights` makes use of [debug](https://github.com/visionmedia/debug). Start using `DEBUG=* npm start` will print helpful traces to stdout.


## License
Copyright (c) 2014 Manuel Alabor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.