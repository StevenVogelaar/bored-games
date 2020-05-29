import events from 'events';
import autoBind from 'auto-bind';
import Router from 'next/router';


 /**
 *  Events: 
 * 		stateRefresh
 * 			Passed a gamestate object for the whole board. Exact structure depends on game type.
 * 		piecePosChange
 * 			(<Number> oX, <Number> oY, <Number> dX, <Number> dY)
 * 			The origin board coordinates of the moving piece, and an x and y offset for its position in pixels.
 * 		piecePlaced
 * 			(id <Number>, <Number> oX, <Number> oY <Number> dX, <Number> dY)
 * 			The origin and destination coordinates the moved piece, in board coodrinates.
 *  	invalidMove
 * 			(id <Number>, <Number> oX, <Number> oY, <Number> dX, <Number> dY)
 * 			the same data from piecePlaced for the invalid move.
 * 		error
 * 			(<String> msg)
 */
class GameController extends events.EventEmitter {


	/**
	 * 
	 * @param {String} gameType 
	 */
	constructor(gameType){
		super();
		this.gameType = gameType;

		autoBind(this);
	}


	/**
	 * Will retrieve game meta info on the game room with roomID,
	 * if the room exists and its the correct game type then will connect
	 * to the game server automaticaly, thows an exception otherwise.
	 * 
	 * @param {String} roomID 
	 * 
	 * @throws {Error} If respones status is not 200.
	 */
	async getGameInfo(roomID) {

		// Check to see if the game room actualy exists.
		let init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ method: "getRoomInfo", gameType: this.gameType, roomID: roomID})
		};

		let request = new Request('../api/games', init);

		try {

			const res = await fetch(request);

			if (res.status != 200) {

				var errorText;

				if (res.status === 404) {

					errorText = res.statusText;
					console.error(res.statusText);
				} else {

					const jsonMsg = await res.json();
					errorText = jsonMsg.message;
					console.error(jsonMsg.message);
				}

				//this.setState({error: true, errorText: errorText});
				//throw new Error(errorText);
				this.emit('error', errorText);

			} else {

				const resJson = await res.json();
				console.log(resJson);

				this.connectToRoom(resJson);
			}

		} catch (err) {
			console.error(err);
			this.emit('error', 'An error has occured.');
		}
	}


	/**
	 * 
	 * @param Object} msg 
	 * 		Expecting:
	 * 			{type:<String>, roomID<String>, host:<String>, port:<Number>}
	 */
	connectToRoom(msg) {


		this.roomID = msg.roomID;
		this.webSocket = new WebSocket(msg.host + ':' + msg.port);

		this.webSocket.addEventListener('close', this.handleClose);
		this.webSocket.addEventListener('error', this.handleError);
		this.webSocket.addEventListener('message', this.handleMessage);
		this.webSocket.addEventListener('open', this.handleOpen);
	}

	requestGameState(){

		this.webSocket.send(JSON.stringify({error: false, method: 'getGameState'}))
	}

	/**
	 * This method is for use when a piece has been placed client side, not from server side.
	 * 
	 * @param {Number} id
	 * @param {Number} oX
	 * @param {Number} oY
	 * @param {Number} dX
	 * @param {Number} dY
	 */
	piecePlaced(id, oX, oY, dX, dY){
		this.webSocket.send(JSON.stringify({error: false, method:'piecePlaced', id: id, oX: oX, oY: oY, dX: dX, dY: dY}));
	}

	/**
	 * 
	 * @param {Number} id 
	 * @param {Number} oX 
	 * @param {Number} oY 
	 * @param {Number} dX 
	 * @param {Number} dY 
	 */
	remotePiecePlaced(id, oX, oY, dX, dY){

	}


	// ===================== WebSocket Handlers ================

	handleOpen() {
		this.webSocket.send(JSON.stringify({ method: 'joinRoom', roomID: this.roomID, password: "", message: "Hello from client!" }));

	}

	handleClose(event) {

		console.log();
	}

	handleError(event) {


		console.error(event);

		//this.setState({ error: true, errorText: "An error has occured." });
		this.emit('error', "An error has occured.");
	}

	handleMessage(event) {

		console.log("=== " + event.data);

		const jsonData = JSON.parse(event.data);

		if (jsonData.error) {
			//this.setState({ error: true, errorText: jsonData.message });
			this.emit('error', jsonData.message)
		}

		switch (jsonData.method) {
			case 'heartBeat':
				this.webSocket.send(JSON.stringify({ error: false, method: 'heartBeat', id: jsonData.id, message: 'hello' }));
				break;

			case 'piecePosChange':
				this.emit('piecePosChange', jsonData.oX, jsonData.oY, jsonData.dX, jsonData.dY);
				break;

			case 'stateRefresh':
				console.log("Recieved state refresh.");
				this.emit('stateRefresh', jsonData.gameState);
				break;

			case 'piecePlaced':
				this.emit('piecePlaced', jsonData.id, jsonData.oX, jsonData.oY, jsonData.dX, jsonData.dY);
				break;

			case 'invalidMove':
				this.emit('invalidMove', jsonData.id, jsonData.oX, jsonData.oY, jsonData.dX, jsonData.dY);
				break;
			default:
				console.error("Unrecognized method recieved from server.");
		}
	}

	// =========================================================

}

module.exports = GameController;