import AbstractPiece from '../AbstractPiece';
import styles from '../../../components/games/checkers/checkers.module.css';

class BlackQueenPiece extends AbstractPiece{

		/**
	 * @returns {String}
	 * 		Name representing this piece type.
	 */
	getType(){
		return 'blackQueen';
	}

	/**
	 * @returns {*} 
	 * 		css modules style for the piece.
	 */
	getStyle(){
		return styles.blackQueen;
	}

	/**
	 * @returns {String}
	 * 		Asset path.
	 */
	getImageAsset(){
		return '/images/checkers_piece_black_queen.svg';
	}

}

export default BlackQueenPiece;