import styles from './draggable.module.css'
import ReactDOM from 'react-dom';

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
	 * 		id of the parent square element (yeah it makes Draggable less)
	 * @param {} childSize
	 * 		The size of the child element, so it can be properly centered
	 * 		TODO: Get ridd of this, can just use the size of draggable.
	 * @param {function(parent, x, y)} movedHandler
	 * @param  {...any} props 
	 */
	constructor(props) {
		super(props);
		this.state = {
			pos: { x: props.x, y: props.y },
			dragging: false,
			rel: null
		}

		this.ref = React.createRef();
		this.topOffset = 0;
		this.leftOffset = 0;
		this.parent = this.props.parent;

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);

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
		})
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
				className={styles.draggable}>{this.props.children}
			</div>
		);
	}

}

export default Draggable;