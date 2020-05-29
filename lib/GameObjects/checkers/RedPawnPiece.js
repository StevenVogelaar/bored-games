import AbstractPiece from '../AbstractPiece';
import styles from '../../../components/games/checkers/checkers.module.css';

class RedPawnPiece extends AbstractPiece{

		/**
	 * @returns {String}
	 * 		Name representing this piece type.
	 */
	getType(){
		return 'redPawn';
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
		return '/images/checkers_piece_red.svg';
	}

}

export default RedPawnPiece;