const EventEmitter = require('events');
const responseEmitter = new EventEmitter();
responseEmitter.setMaxListeners(50); 
module.exports = responseEmitter;