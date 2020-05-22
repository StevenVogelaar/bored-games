import Button from 'react-bootstrap/Button';
import autoBind from 'auto-bind';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Router from 'next/router';

class NewGameButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			requestInProgress: false,
			showModal: false,
			password: "",
			error: false,
			errorMessage: ""
		};

		autoBind(this);
	}


	render() {

		var modal;
		var error;

		if (this.state.error) {
			error = (
				<Alert variant="danger" dismissible="true" onClose={this.handleHideError}>{this.state.errorMessage}</Alert>
			);
		}


		if (this.state.showModal) {
			modal = (

				<Modal show={this.state.showModal} onHide={this.hideModal}>
					<Modal.Dialog>
						<Modal.Header closeButton>
							<Modal.Title>Create Checkers Room</Modal.Title>
						</Modal.Header>

						<Modal.Body style={{ textAlign: "center" }}>
							{error}
							<p>Enter a password to optionaly make the game room private.</p>
							<input style={{ textAlign: "center" }} type="password" onChange={this.handlePassInput}></input>
						</Modal.Body>

						<Modal.Footer style={{ textAlign: "center" }}>
							<Button block="true" variant="secondary" onClick={this.hideModal}>Close</Button>
							<Button block="true" variant="primary" onClick={this.createGame}>Create Game</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal>
			);
		}

		return (
			<div>
				{modal}
				<Button size="lg" onClick={this.onNewGame}>New Game</Button>
			</div>
		);
	}

	handleHideError(e) {
		this.setState({ error: false });
	}

	handlePassInput(e) {

		this.setState({ password: e.target.value })
	}

	hideModal() {

		this.setState({ showModal: false });
	}


	async onNewGame(e) {

		this.setState({ showModal: true });
	}

	async createGame(e) {

		if (this.state.requestInProgress) {
			alert('Allready creating a new game.');
			return;
		}

		const init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ method: "startNewGame", password: this.state.password, type: "checkers" })
		};

		const request = new Request('api/games', init);
		this.setState({ requestInProgress: true });

		try {
			// Make the actual request.
			const res = await fetch(request);
			const msgJson = await res.json();

			if (res.status != 200) {

				this.setState({ error: true, errorMessage: msgJson.message });
				console.error(msgJson.message);
			} else {
				//console.log("JSON response: " + msgJson.message);
				console.log("Should have redirected...");
				Router.push('/checkers/' + msgJson.roomID);
				
			}
		} catch (err) {
			console.error(err);
		}

		this.setState({ requestInProgress: false });
	}
}

export default NewGameButton;