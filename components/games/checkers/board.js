import Square from './square'
import Row from 'react-bootstrap/Row';
import styles from './checkers.module.css'

/**
 * 
 * @param {Array} squares 
 */
export default function Board({ gameState }) {

	const rows = Array();

	for (let row = 0; row < 8; row ++){
		rows.push(renderRow(row, gameState))
	}

	return (
		<div className={styles.board}>
			{rows}
		</div>
	);
}

function renderRow(row, gameState){

	const cols = Array();

	for (let col = 0; col < 8; col ++){

		let square = gameState[(row * 8) + col];
		cols.push(renderSquare(square));
	}

	return <div className={styles.row}>{cols}</div>
}


function renderSquare(square){
	return (
		<Square colorClass={square.colorClass}/>
	);
}