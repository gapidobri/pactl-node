# Pulse Audio Control

## Installation
```bash
npm install pactl
```
## Usage
```js
const pactl = require('pactl');

pactl.info();
pactl.listShort('sinks');
pactl.list('sinks');
pactl.loadModule('module-null-sink', { // Pulse Audio Modules
	sink_name: 'MyNullSink'
});
pactl.unloadModule(12);
```
[Pulse Audio Modules](https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/Modules/)