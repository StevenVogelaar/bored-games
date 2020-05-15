
class Message {


	constructor(){

		this.version = 1.0;
	}


	/**
	 * Left intentionaly unbinded.
	 */
	getName(){
		return typeof this; 
	}


	/**
	 * Left intentionaly unbinded.
	 */
	toJSON(){

		const json = JSON.stringify(this);
		json.type = this.getName();
	}

}

module.exports = Message;