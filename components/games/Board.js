import Square from './Square'
import Row from 'react-bootstrap/Row';
import styles from './board.module.css'
import Draggable from '../draggable.js'
import Piece from './GamePiece.js'


class Board extends React.Component {

	/**
	 * 
	 * @param {{gameState, moveHandler<parent, x, y>}, ...props} props 
	 */
	constructor(props) {
		super(props);

		this.state = {
			reload: true,
		}

		this.ref = React.createRef();
		this.getDefaultPieces = this.getDefaultPieces.bind(this);
	}

	getDefaultPieces() {

		const pieces = Array();

		for (const item of this.redSpawns){

			const squarePos = $(this.squareRefs[item].current).offset();
			pieces.push(<Draggable x={squarePos.x} y={squarePos.y} parent={this.ref}><Piece/></Draggable>)
		}

		return pieces;
	}

	renderRow(row, squares) {

		const cols = Array();

		for (let col = 0; col < 8; col++) {
			cols.push(this.renderSquare(squares[(row * 8) + col]));
		}

		return <div className={styles.row}>{cols}</div>
	}


	renderSquare(square) {

		return (
			<Square square={square} moveHandler={this.props.moveHandler}/>
		);
	}


	render(){
		const rows = Array();

		for (let row = 0; row < 8; row++) {
			rows.push(this.renderRow(row, this.props.gameState.squares))
		}

		return (
			<div ref={this.ref} className={styles.board}>
				{rows}
			</div>
		);
	}
}

export default Board;