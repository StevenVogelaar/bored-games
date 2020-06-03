import AbstractGameWidget from '../AbstractGameWidget';
import autoBind from 'auto-bind';
import Button from 'react-bootstrap/Button';
import Board from '../Board'
import Container from 'react-bootstrap/Container';
import styles from '../board.module.css'
import Router from 'next/router';
import RedPawnPiece from '../../../lib/GameObjects/checkers/RedPawnPiece';
import BlackPawnPiece from '../../../lib/GameObjects/checkers/BlackPawnPiece';


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

		this.setState({ reload: false });
	}



	/**
	 * See base class.
	 */
	getGameType() {
		return 'checkers';
	}


	/**
	 * handler for the draggable event.
	 * 
	 * @param {Number} squareID 
	 * @param {Number} x 
	 * 		offset
	 * @param {Number} y 
	 * 		offset
	 */
	dragHandler(squareID, x, y){
		this.gameController.notifyPieceMoved(squareID, x, y);
	}

	// ========= GameController handlers ===========

	/**
	 * 
	 * @param {Object} sGameState 
	 * 		Expected form:
	 * 			{
	 * 				board: [ List containing lists. Each inner list is a row containing square contents ]
	 * 			}
	 */
	stateRefreshHandler(sGameState) {
		console.log('stateRefreshHandler');

		console.log(sGameState);
		const gameState = this.state.gameState;

		// Remember that the gamestate.squares array is 1D, 0-63 for checkers.
		for (var row = 0; row < sGameState.board.length; row++) {
			for (var col = 0; col < sGameState.board[row].length; col++) {

				let piece = null;

				if (sGameState.board[row][col] != null) {
					if (sGameState.board[row][col].pieceType === 'pawn') {
						if (sGameState.board[row][col].owner === 1){
							piece = new RedPawnPiece(sGameState.board[row][col].owner,sGameState.board[row][col].id );
						} else {
							piece = new BlackPawnPiece(sGameState.board[row][col].owner, sGameState.board[row][col].id);
						}
					} else {
						
					}

					gameState.squares[(row * 8) + col].piece = piece;
				}
			}
		}

		this.setState({gameState: gameState, playerTurn: sGameState.player});
	}

	// =============================================


	buttonHandler(e) {
		this.gameController.getGameInfo(Router.query.rid);
	}

	render() {

		const alertJSX = this.getAlertJSX();

		return (
			<Container className={styles.boardContainerContainer}>
				{alertJSX}
				<Button onClick={this.buttonHandler}>TEst</Button>
				<div className={styles.boardContainer}>
					<div className={this.state.playerTurn === 1 ? styles.turnIndicatorRed : styles.turnIndicatorBlack}>{this.state.playerTurn === 1 ? "Red's turn" : "Black's turn"}</div>
					<Board gameState={this.state.gameState} moveHandler={this.moveHandler} dragHandler={this.dragHandler} player={this.gameController.getPlayer()}/>
				</div>
			</Container>
		);
	}
}

export default CheckersGameWidget;