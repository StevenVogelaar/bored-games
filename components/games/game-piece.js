

/**
 * 
 * @param {AbstractPiece} pieceObj
 * @param {Number} size
 */
export default function GamePiece({pieceObj, size}){
	return (
		<img src={pieceObj.getImageAsset()} className={pieceObj.getStyle()} width={size}/>
	);
}