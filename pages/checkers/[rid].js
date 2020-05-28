import CheckersGameWidget from '../../components/games/checkers/checkers-game-widget'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import autoBind from 'auto-bind';
import Router from 'next/router';
import AbstractGamePage from '../../lib/pages/AbstractGamePage';


export default class CheckersPage extends AbstractGamePage {

	constructor(props) {
		super(props);

		autoBind(this);
	}

	componentDidMount() {
	}




	getGameType() {
		return 'checkers';
	}

	render() {

		return (
			<Container className="center-block" style={{ textAlign: "center" }}>
				{this.getAlertJSX()}
				<CheckersGameWidget></CheckersGameWidget>
				<Button onClick={this.gameController.getGameInfo}>TEst</Button>
			</Container>
		);

	}

}


