import CheckersGameWidget from '../../components/games/checkers/checkers-game-widget'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import autoBind from 'auto-bind';
import GameController from '../GameControllers/GameController';

/**
 * Note that the state will allready be set, so dont overrwrite it in subclass, extend it.
 */
export default class GamesPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			errorText: ""
		}

		autoBind(this);

		this.gameController = new GameController()
		this.gameController.addListener('error', this.gameControllerError)
	}

	componentDidMount() {

	}

	/**
	 * If there is a current error alert, this function will return alert JSX,
	 * empty object otherwise.
	 */
	getAlertJSX(){

		if (this.state.error){
			return <Alert variant="danger" dismissible="true" onClose={this.hideError}>{this.state.errorText}</Alert>
		}

		return null;
	}

	hideError(){
		this.setState({error: false});
	}

	gameControllerError(err){

		console.log('Error in game controller.');
		this.setState({
			error: true,
			errorText: err
		})
	}


	getGameType(){
		throw Error("Must override AbstractGamePage.getGameType() in sub classes.");
	}

}