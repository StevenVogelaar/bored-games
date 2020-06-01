import events from 'events';


/**
 * Events:
 * 		- pieceMoved -
 * 			(x, y)
 * 			// Fired when the piece has been dragged by another player.
 * 			// x and y are offsets.
 */
class AbstractPiece extends events.EventEmitter{

	/**
	 * 
	 * @param {String} owner 
	 * 		Example: p1
	 * 
	 * 
	 */
	constructor(owner, id){

		super();

		this.owner = owner;
		this.id = id;
	}

	/**
	 * @returns {String}
	 * 		Example: p1
	 */
	getPieceOwner(){
		return this.owner;
	}

	/**
	 * @returns {Number}
	 */
	getID(){
		return this.id;
	}

	/**
	 * @returns {String}
	 * 		Name representing this piece type.
	 */
	getType(){
		throw new Error("Must implement AbstractPiece.getType().");
	}

	/**
	 * @returns {*} 
	 * 		css modules style for the piece.
	 */
	getStyle(){
		throw new Error("Must implement AbstractPiece.getStyle().");
	}

	/**
	 * @returns {String}
	 * 		Asset path.
	 */
	getImageAsset(){
		throw new Error("Must implement AbstractPiece.getImageAsset().");
	}

	notifyMoved(x, y){
		this.emit('pieceMoved', x , y);
	}

}



export default AbstractPiece;