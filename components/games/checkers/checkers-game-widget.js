import styles from './checkers.module.css'
import Board from './board'
import Container from 'react-bootstrap/Container';


class CheckersGameWidget extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			roomID: -1,
			gameState: this.getDefaultGameState()
		};

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
			ar[i] = { id: i, colorClass: (white ? styles.white : styles.black) }

			if ((i + 1) % 8 != 0) {
				white = !white;
			}
		}

		return ar;
	}


	render() {
		return (
			<Container className={styles.boardContainerContainer}>
				<div className={styles.boardContainer}>
					<Board gameState={this.state.gameState} />
				</div>
			</Container>
		);
	}
}

export default CheckersGameWidget;