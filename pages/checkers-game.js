import CheckersGameWidget from '../components/games/checkers/checkers-game-widget'
import Container from 'react-bootstrap/Container'


export default function checkersGame(props) {

	return (

		<Container className="center-block" style={{textAlign: "center"}}>
			<CheckersGameWidget></CheckersGameWidget>
		</Container>
	);

}