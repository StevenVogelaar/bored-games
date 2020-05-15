const Message = require('./Message');
const autobind = require('autobind');

class RequestGameRoomsMessage extends Message {


	constructor(){

		super();

		autobind(this);
	}

}

modules.exports = RequestGameRoomsMessage;