import CheckersGameWidget from '../../components/games/checkers/CheckersGameWidget'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import autoBind from 'auto-bind';
import GameController from '../GameControllers/GameController';

/**
 * Note that the state will allready be set, so dont overrwrite it in subclass, extend it.
 */
export default class AbstractGamesPage extends React.Component {

	constructor(props) {
		super(props);

		autoBind(this);

	}

	componentDidMount() {

	}



}