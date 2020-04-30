import styles from './checkers.module.css'
import GamePiece from './game-piece.js'
import Draggable from '../../draggable';


class Square extends React.Component {

	/**
	 * 
	 * @param {square, moveHandler<parent, x, y>, ...props} props 
	 */
	constructor(props) {

		super(props);

		this.id = props.square.id;
		this.ref = this.props.square.ref;
	}


	render() {

		let p = null;
		let pieceSize = 50;

		if (this.ref.current) {
			pieceSize = $(this.ref.current).width() * 0.8;
		}

		if (this.props.square.piece.type != null) {
			p = <Draggable x={0} y={0} parentSquareID={this.props.square.id} parent={this.ref} childSize={pieceSize} moveHandler={this.props.moveHandler}>
				<GamePiece pieceID={this.props.square.piece.id} pieceColor={this.props.square.piece.type} size={pieceSize}/>
			</Draggable>
		}

		return <div ref={this.ref} id={this.props.square.id + "_square"} className={styles.square + ' ' + this.props.square.colorClass}>{this.props.square.id} {p}</div>
	}

}
export default Square;

