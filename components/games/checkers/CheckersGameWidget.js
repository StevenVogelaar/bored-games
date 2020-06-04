import AbstractGameWidget from '../AbstractGameWidget';
import autoBind from 'auto-bind';
import Button from 'react-bootstrap/Button';
import Board from '../Board'
import Container from 'react-bootstrap/Container';
import styles from '../board.module.css'
import Router from 'next/router';
import RedPawnPiece from '../../../lib/GameObjects/checkers/RedPawnPiece';
import BlackPawnPiece from '../../../lib/GameObjects/checkers/BlackPawnPiece';
import BlackQueenPiece from '../../../lib/GameObjects/checkers/BlackQueenPiece';
import RedQueenPiece from '../../../lib/GameObjects/checkers/RedQueenPiece';


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
		this.gameController.addListener('changePieceType', this.changePieceTypeHandler);
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
						if (sGameState.board[row][col].owner === 1){
							piece = new RedQueenPiece(sGameState.board[row][col].owner,sGameState.board[row][col].id );
						} else {
							piece = new BlackQueenPiece(sGameState.board[row][col].owner, sGameState.board[row][col].id);
						}
					}

					gameState.squares[(row * 8) + col].piece = piece;
				}
			}
		}

		this.setState({gameState: gameState, playerTurn: sGameState.player});
	}

	changePieceTypeHandler(id, x, y, type){

		const gameState = {...this.state.gameState};
		const index = (y * 8) + x
		const piece = gameState.squares[index].piece;

		if (!piece || piece.getID() !== id) {
			console.error('Game state missmatch.');
			this.gameController.requestGameState();
			return;
		}

		if (type === 'queen'){

			if (piece.getPieceOwner() === 1){
				gameState.squares[index].piece = new RedQueenPiece(1, id);
			} else {
				gameState.squares[index].piece = new BlackQueenPiece(1, id);
			}
			
			this.setState({gameState: gameState});

		} else {
			this.setState({error: true, errorText: 'Invalid piece type recieved from server.'});
		}
	}

	// =============================================


	buttonHandler(e) {
		this.gameController.getGameInfo(Router.query.rid);
	}

	render() {

		const alertJSX = this.getAlertJSX();

		if (this.state.winningPlayer > 0){
			var turnText = this.state.winningPlayer === 1 ? "Red has won!" : "Black has won!";
			var turnStyle = this.state.winningPlayer === 1 ? styles.turnIndicatorRed : styles.turnIndicatorBlack;
		} else {
			var turnText = this.state.playerTurn === 1 ? "Red's turn" : "Black's turn";
			var turnStyle = this.state.playerTurn === 1 ? styles.turnIndicatorRed : styles.turnIndicatorBlack;
		}

		return (
			<Container className={styles.boardContainerContainer}>
				{alertJSX}
				<Button onClick={this.buttonHandler}>TEst</Button>
				<div className={styles.boardContainer}>
					<div className={turnStyle}>{turnText}</div>
					<Board gameState={this.state.gameState} moveHandler={this.moveHandler} dragHandler={this.dragHandler} player={this.gameController.getPlayer()}/>
				</div>
			</Container>
		);
	}
}

export default CheckersGameWidget;