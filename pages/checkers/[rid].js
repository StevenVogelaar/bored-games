import CheckersGameWidget from '../../components/games/checkers/checkers-game-widget'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import autoBind from 'auto-bind';
import Router from 'next/router';


export default class GameRoomPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			errorText: ""
		}

		autoBind(this);
	}

	componentDidMount() {
	}

	async getGameInfo() {

		
		this.roomID = Router.query.rid;
	
		// Check to see if the game room actualy exists.
		let init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ method: "getRoomInfo", roomID: Router.query.rid })
		};

		let request = new Request('../api/games', init);

		try {

			const res = await fetch(request);

			 if (res.status != 200) {

				var errorText;

				if (res.status === 404){

					errorText = res.statusText;
					console.error(res.statusText);
				} else {

					const jsonMsg = await res.json();
					errorText = jsonMsg.message;
					console.error(jsonMsg.message);
				}

				this.setState({error: true, errorText: errorText});
				
			} else {

				const resJson = await res.json();
				console.log(resJson);

				this.connectToRoom(resJson);
			}

		} catch (err) {
			console.log(err);
		}
	}


	hideError(){
		this.setState({error: false});
	}


	/**
	 * 
	 * @param Object} msg 
	 * 		Expecting:
	 * 			{type:<String>, roomID<String>, host:<String>, port:<Number>}
	 */
	connectToRoom(msg){

		console.log("1");

		this.webSocket = new WebSocket(msg.host + ':' + msg.port);

		console.log("2");
		this.webSocket.addEventListener('close', this.handleClose);
		this.webSocket.addEventListener('error', this.handleError);
		this.webSocket.addEventListener('message', this.handleMessage);
		this.webSocket.addEventListener('open', this.handleOpen);
	}

	// ===================== WebSocket Handlers ================

		handleOpen(){
			this.webSocket.send(JSON.stringify({method:'joinRoom', roomID: this.roomID, password:"", message: "Hello from client!"}));
		}

		handleClose(event){

			console.log();
		}

		handleError(event){


			console.error(event);

			this.setState({error: true, errorText: "An error has occured."});
		}

		handleMessage(event){

			console.log(event.data);

			const jsonData = JSON.parse(event.data);

			if (jsonData.error){
				this.setState({error: true, errorText: jsonData.message});
			}
		}

	// =========================================================


	render() {

		var alert;


		if (this.state.error){
			alert = <Alert variant="danger" dismissible="true" onClose={this.hideError}>{this.state.errorText}</Alert>
		}

		return (
			<Container className="center-block" style={{ textAlign: "center" }}>
				{alert}
				<CheckersGameWidget></CheckersGameWidget>
				<Button onClick={this.getGameInfo}>TEst</Button>
			</Container>
		);

	}

}


