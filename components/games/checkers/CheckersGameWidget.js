import AbstractGameWidget from '../AbstractGameWidget';
import autoBind from 'auto-bind';


class CheckersGameWidget extends AbstractGameWidget {

	constructor(props) {
		super(props);
		autoBind(this);

		this.redSpawns = [
			40,
			42,
			44,
			46,
			49,
			51,
			53,
			55,
			56,
			58,
			60,
			62
		];

		this.blackSpawns = [
			1,
			3,
			5,
			7,
			8,
			10,
			12,
			14,
			17,
			19,
			21,
			23
		];

		this.pieceTypes = { // Do the same for colorClass?
			red: "red",
			black: "black"
		};


		// Bind netcode functions woohoo.
		this.gameController.addListener('stateRefresh', this.stateRefreshHandler);
	}

		/**
	 * Need to wait until the page renders once, so we have positions for the board squares, so
	 * we can center the pieces.
	 */
	componentDidMount() {
	
		this.setState({reload: false});
	}


	
	/**
	 * See base class.
	 */
	getGameType(){
		return 'checkers';
	}


	// GameController handlers.
	stateRefreshHandler(sGameState){

	}
}

export default CheckersGameWidget;