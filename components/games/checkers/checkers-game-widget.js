import styles from './checkers.module.css'
import Board from './board'
import Container from 'react-bootstrap/Container';


class CheckersGameWidget extends React.Component {

	constructor(props) {
		super(props);

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


		this.state = {
			roomID: -1,
			gameState: {
				squares: this.getDefaultGameState(),
			},
		};

		this.moveHandler = this.moveHandler.bind(this);
	}

		/**
	 * Need to wait until the page renders once, so we have positions for the board squares, so
	 * we can center the pieces.
	 */
	componentDidMount() {
	
		this.setState({reload: false});
	}


	/**
	 * Returns the game state in the form of an array. Each board square has an id
	 * going from left to right starting at 0 for the top left square and 63 for
	 * bottom right square, indexes match ids.
	 */
	getDefaultGameState() {

		let ar = Array();
		let white = true;

		for (let i = 0; i < 64; i++) {
			ar[i] =
			{
				id: i,
				colorClass: (white ? styles.white : styles.black),
				piece: {
					//type: this.redSpawns.includes(i) ? this.pieceTypes.red : (this.blackSpawns.includes(i) ? this.pieceTypes.black : null),
					type: null,
				},
				ref: React.createRef(),
			} // square object

			if ((i + 1) % 8 != 0) {
				white = !white;
			}
		}

		return ar;
	}

	/**
	 * Removes the gamepiece from parent, and puts it in the square in which
	 * the x, y coordinates are.
	 * 
	 * If the coordinates are not in any square, then the piece is not moved (state is still updated)
	 * 
	 * @param {Number} id of parent square.
	 * 		The parent component of the movable (will be a game square).
	 * @param {*} x 
	 * @param {*} y 
	 */
	moveHandler(id, x, y) {

		for (const square of this.state.gameState.squares){

			const position = $(square.ref.current).offset();
			const width = $(square.ref.current).width();
		
			if (x > position.left && x < position.left + width && y > position.top && y < position.top + width){
				const gameState = {...this.state.gameState};
				
				gameState.squares[square.id].piece.type = gameState.squares[id].piece.type;
				gameState.squares[id].piece.type = null;

				this.setState({gameState: gameState});
			}
		}
	}


	render() {
		return (
			<Container className={styles.boardContainerContainer}>
				<div className={styles.boardContainer}>
					<Board gameState={this.state.gameState} moveHandler={this.moveHandler} />
				</div>
			</Container>
		);
	}
}

export default CheckersGameWidget;