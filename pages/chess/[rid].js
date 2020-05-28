
const AbstractGamgePage = require('../../lib/pages/AbstractGamePage');


class ChessPage extends AbstractGamgePage {


	constructor(props) {
		super(props);



	}


	getGameType() {
		return 'chess';
	}

}