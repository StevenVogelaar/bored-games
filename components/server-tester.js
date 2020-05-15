import Button from 'react-bootstrap/Button';
import autoBind from 'auto-bind';

class ServerTester extends React.Component{

	constructor(props){
		super(props);

		autoBind(this);

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount(){

		this.webSocket = new WebSocket("ws://localhost:3820");
		this.webSocket.addEventListener('close', this.handleClose);
		this.webSocket.addEventListener('error', this.handleError);
		this.webSocket.addEventListener('message', this.handleMessage);
	}

	render(){
		return (
			<Button onClick={this.handleClick}>Test Server</Button>
		);
	}

	handleClick(){

		if (this.webSocket){
			this.webSocket.send("HELLO FROM CLIENT!");
		}
	}


	handleClose(event){

		console.log("Connection closed: " + event);
	}

	handleError(event){

		console.log('Connection error: ' + event);
	}

	handleMessage(event){
		
		console.log('Recieved message: ' + event.data);
	}


}

export default ServerTester;