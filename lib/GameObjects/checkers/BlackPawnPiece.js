import AbstractPiece from '../AbstractPiece';
import styles from '../../../components/games/checkers/checkers.module.css';

class BlackPawnPiece extends AbstractPiece{

		/**
	 * @returns {String}
	 * 		Name representing this piece type.
	 */
	getType(){
		return 'blackPawn';
	}

	/**
	 * @returns {*} 
	 * 		css modules style for the piece.
	 */
	getStyle(){
		return styles.redPawn;
	}

	/**
	 * @returns {String}
	 * 		Asset path.
	 */
	getImageAsset(){
		return '/images/checkers_piece_black.svg';
	}

}

export default BlackPawnPiece;