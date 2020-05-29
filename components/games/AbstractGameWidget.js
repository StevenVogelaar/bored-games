import styles from './board.module.css'
import GameController from '../../lib/GameControllers/GameController'
import autoBind from 'auto-bind';
import Alert from 'react-bootstrap/Alert';



class AbstractGameWidget extends React.Component{



	constructor(props){

		super(props);
		autoBind(this);

		this.state = {
			roomID: -1,
			gameState: {
				squares: this.getDefaultGameState(),
			},
		};


		this.gameController = new GameController(this.getGameType());
		this.gameController.addListener('error', this.gameControllerError);
		//this.gameController.addListener('piecePosChange', this.piecePosChangeHandler);
		this.gameController.addListener('piecePlaced', this.piecePlacedHandler);
		this.gameController.addListener('invalidMove', this.invalidMoveHandler);
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
				id: i, // Id for the square
				piece: null, // An instance of AbstractPiece or null.
				ref: React.createRef(),
				colorClass: (white ? styles.white : styles.black),
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
				
				console.log('square id: ' + square.id);
				gameState.squares[square.id].piece = gameState.squares[id].piece;
				gameState.squares[id].piece = null;

				this.setState({gameState: gameState});

				const dY = Math.trunc(square.id / 8);
				const dX = square.id % 8;
				const oY = Math.trunc(id / 8);
				const oX = id % 8;

				this.gameController.piecePlaced(gameState.squares[square.id].piece.id, oX, oY, dX, dY);
			}
		}
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
		});
	}


	getGameType(){
		throw Error("Must override AbstractGamePage.getGameType() in sub classes.");
	}


	// ========= GameController handlers ===========

	piecePosChangeHandler(oX, oY, dX, dY){

	}

	piecePlacedHandler(id, oX, oY, dX, dY){
		
		const gameState = {...this.state.gameState};

		const bO = (oY * 8) + oX;
		const bD = (dY * 8) + dX;


		console.log("bO: " + bO);
		console.log("bD: " + bD);
		const piece = gameState.squares[bO].piece;

		console.log(gameState.squares);

		console.log('pieceid: ' + piece.id);
		console.log('id: ' + id);
		if (piece.id != id) throw Error("Game state missmatch.");

		gameState.squares[bO].piece = null;
		gameState.squares[bD].piece = piece;

		this.setState({gameState: gameState});
	}

	invalidMoveHandler(id, oX, oY, dX, dY){
		console.log(oX);
		console.log(oY);
		console.log(dX);
		console.log(dY);
		this.piecePlacedHandler(id, dX, dY, oX, oY); // Reversed the coordinates.
	}

	// =============================================

	/**
	 * Just a default render, feel free to override.
	 */
	render(){
		const alertJSX = this.getAlertJSX();

		return (
			<Container className={styles.boardContainerContainer}>
				{alertJSX}
				<div className={styles.boardContainer}>
					<Board gameState={this.state.gameState} moveHandler={this.moveHandler} />
				</div>
			</Container>
		);
	}
}

export default AbstractGameWidget;