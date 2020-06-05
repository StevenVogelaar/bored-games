import Square from './Square'
import Row from 'react-bootstrap/Row';
import styles from './board.module.css'
import Draggable from '../draggable.js'
import Piece from './GamePiece.js'
import $ from 'jquery';


class Board extends React.Component {

	/**
	 * 
	 * @param {{gameState, moveHandler(<Number> pieceID x, y), dragHandler(<Number> parent, x, y)}, player <Number>, ...props} props 
	 */
	constructor(props) {
		super(props);

		this.state = {
			reload: true,
		};



		this.ref = React.createRef();
		this.getDefaultPieces = this.getDefaultPieces.bind(this);
	}

	getDefaultPieces() {

		const pieces = Array();

		for (const item of this.redSpawns) {

			const squarePos = $(this.squareRefs[item].current).offset();
			pieces.push(<Draggable x={squarePos.x} y={squarePos.y} parent={this.ref}><Piece /></Draggable>)
		}

		return pieces;
	}

	renderRow(row, squares) {

		const cols = Array();

		if (this.props.player === 2){
			for (let col = 0; col < 8; col++) {
				cols.push(this.renderSquare(squares[(row * 8) + col]));
			}
		} else {
			for (let col = 7; col >= 0; col--) {
				cols.push(this.renderSquare(squares[(row * 8) + col]));
			}
		}


		return <div key={'row_' + row} className={styles.row}>{cols}</div>
	}


	renderSquare(square) {

		return (
			<Square key={square.id} square={square} moveHandler={this.props.moveHandler} dragHandler={this.props.dragHandler} />
		);
	}


	render() {
		const rows = Array();

		if (this.props.player === 2) {
			for (let row = 0; row < 8; row++) {
				rows.push(this.renderRow(row, this.props.gameState.squares))
			}
		} else {
			for (let row = 7; row >= 0; row--) {
				rows.push(this.renderRow(row, this.props.gameState.squares))
			}
		}

		return (
			<div ref={this.ref} className={styles.board}>
				{rows}
			</div>
		);
	}
}

export default Board;