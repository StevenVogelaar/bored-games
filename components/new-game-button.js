import Button from 'react-bootstrap/Button';
import autoBind from 'auto-bind';

class NewGameButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			requestInProgress: false,
		};

		autoBind(this);
	}


	render() {

		return (
			<Button size="lg" onClick={this.onNewGame}>New Game</Button>
		);
	}


	async onNewGame(e) {

		if (this.state.requestInProgress) {
			alert('Allready creating a new game.');
			return;
		}

		const init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ method: "startNewGame" })
		};

		const request = new Request('api/games', init);
		this.setState({ requestInProgress: true });

		try {
			// Make the actual request.
			const res = await fetch(request);
			const msgJson = await res.json();

			if (res.status != 200) {
				console.error(msgJson.message);
			} else {
				console.log("JSON response: " + msgJson.message);
			}
		} catch (err) {
			console.error(err);
		}

		this.setState({ requestInProgress: false });
	}
}

export default NewGameButton;