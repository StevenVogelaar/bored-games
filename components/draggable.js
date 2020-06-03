import styles from './draggable.module.css'
import ReactDOM from 'react-dom';
import AbstractPiece from '../lib/GameObjects/AbstractPiece';
import autoBind from 'auto-bind';

/**
 * https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable
 */
class Draggable extends React.Component {

	/**
	 * 
	 * @param {Float} x
	 * @param {Float} y
	 * @param {ref} parent
	 * @param {Number} parentSquareID
	 * 		id of the parent square element (yeah it makes Draggable less general)
	 * @param {AbstractPiece} pieceObj
	 * @param {} childSize
	 * 		The size of the child element, so it can be properly centered
	 * 		TODO: Get ridd of this, can just use the size of draggable.
	 * @param {function(<Number> parent, x, y)} moveHandler
	 * @param {function(<Number> parent, squareIDx, y)} dragHandler
	 * 			// x and y are a position offset.
	 * @param  {...any} props 
	 */
	constructor(props) {
		super(props);
		autoBind(this);

		this.state = {
			pos: { x: props.x, y: props.y },
			dragging: false,
			rel: null
		}

		this.ref = React.createRef();
		this.topOffset = 0;
		this.leftOffset = 0;
		this.parent = this.props.parent;

		props.pieceObj.addListener('pieceMoved', this.pieceMovedHandler);
	}

	componentWillUnmount(){
		this.props.pieceObj.removeListener('pieceMoved', this.pieceMovedHandler);
	}

	componentDidUpdate(props, state) {

		if (this.state.dragging && !state.dragging) {
			document.addEventListener('mousemove', this.onMouseMove)
			document.addEventListener('mouseup', this.onMouseUp)
		} else if (!this.state.dragging && state.dragging) {
			document.removeEventListener('mousemove', this.onMouseMove)
			document.removeEventListener('mouseup', this.onMouseUp)
		}
	}

	onMouseMove(e) {
		if (!this.state.dragging) return
		this.setState({
			pos: {
				x: e.pageX - this.state.rel.x,
				y: e.pageY - this.state.rel.y
			}
		});

		const boardWidth = $(this.parent.current).width(); // TODO: Grab this only on size change events?

		const adjustedX = (e.pageX - this.state.rel.x) / boardWidth;
		const adjustedY = ( e.pageY - this.state.rel.y) / boardWidth;

		this.props.dragHandler(this.props.parentSquareID,  adjustedX, adjustedY);

		e.stopPropagation()
		e.preventDefault()
	}

	onMouseUp(e) {
		this.setState({ dragging: false })
		e.stopPropagation()
		e.preventDefault()
		
		if (typeof this.props.moveHandler === "function"){
			const offset = $(this.ref.current).offset();
			this.props.moveHandler(this.props.parentSquareID, offset.left + (this.props.childSize/2), offset.top + (this.props.childSize/2));
		}
	}

	onMouseDown(e) {

		// only left mouse button
		if (e.button !== 0) return;
		var pos = $(this.ref.current).offset();
		var parentPos = $(this.parent.current).offset();
		this.setState({
			dragging: true,
			rel: {
				x: e.pageX - (pos.left - parentPos.left - this.leftOffset),
				y: e.pageY - (pos.top - parentPos.top - this.topOffset)
			}
		});
		e.stopPropagation();
		e.preventDefault();
	}

	/**
	 * 
	 * Handlers external move events (other player moving the piece).
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	pieceMovedHandler(x, y){

		const pos = {...this.state.pos};


		const boardWidth = $(this.parent.current).width();

		pos.x = x * boardWidth;
		pos.y = y * boardWidth;

		// TODO: maybe clamp the values?
		this.setState({pos: pos});
	}


	render() {
		var { children, ...other } = this.props;

	
		let pieceEdge = 20;

		if (this.parent.current) { // Calculate offset to center draggable in parent
			this.leftOffset = ($(this.parent.current).width() - this.props.childSize) / 2;
			this.topOffset = ($(this.parent.current).height() - this.props.childSize) / 2;
		}

		return (
			<div ref={this.ref}
				onMouseDown={this.onMouseDown}
				style={{ position: "absolute", left: this.state.pos.x + this.leftOffset + "px", top: this.state.pos.y + this.topOffset + "px" }}
				className={styles.draggable + ' ' + (this.state.dragging ? styles.active : null)}>{this.props.children}
			</div>
		);
	}

}

export default Draggable;