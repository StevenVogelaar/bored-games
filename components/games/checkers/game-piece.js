

/**
 * 
 * @param {"black" | "red"} pieceColor 
 */
export default function GamePiece({pieceColor, size, pieceID}){
	return (
		<img src={pieceColor == "black" ? "/images/checkers_piece_black.svg" : "/images/checkers_piece_red.svg"} width={size}/>
	);
}