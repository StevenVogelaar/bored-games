import styles from './checkers.module.css'

/**
 * 
 * @param {Any valid css color} color
 */
export default function Square({colorClass}){
	
	return (
		<div className={styles.square + ' ' + colorClass}></div>
	);
}