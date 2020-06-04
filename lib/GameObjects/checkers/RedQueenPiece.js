import AbstractPiece from '../AbstractPiece';
import styles from '../../../components/games/checkers/checkers.module.css';

class RedQueenPiece extends AbstractPiece{

		/**
	 * @returns {String}
	 * 		Name representing this piece type.
	 */
	getType(){
		return 'redQueen';
	}

	/**
	 * @returns {*} 
	 * 		css modules style for the piece.
	 */
	getStyle(){
		return styles.redQueen;
	}

	/**
	 * @returns {String}
	 * 		Asset path.
	 */
	getImageAsset(){
		return '/images/checkers_piece_red_queen.svg';
	}

}

export default RedQueenPiece;