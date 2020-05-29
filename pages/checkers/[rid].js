import CheckersGameWidget from '../../components/games/checkers/CheckersGameWidget'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import autoBind from 'auto-bind';



export default class CheckersPage extends React.Component {

	constructor(props) {
		super(props);

		autoBind(this);
	}

	componentDidMount() {
	}


	render() {

		return (
			<Container className="center-block" style={{ textAlign: "center" }}>
				<CheckersGameWidget></CheckersGameWidget>
			</Container>
		);

	}

}


