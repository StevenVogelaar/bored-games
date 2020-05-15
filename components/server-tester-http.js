import Button from 'react-bootstrap/Button';
import autoBind from 'auto-bind';

class ServerTesterHTTP extends React.Component {


	constructor(props) {
		super(props);

		autoBind(this);

	}


	onClick(e) {



		let headers = new Headers();
		//headers.append('Access-Control-Allow-Origin', '*')
		let init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({method: "getPublicGames"})
		};

		let request = new Request('api/games', init);

		fetch(request)
			.then(res => res.json())
			.then(result => {
				console.log("JSON response: " + JSON.stringify(result));
			})
			.catch(err => {
				console.log(err);
			});



		/*fetch(request)
			.then(async function (res) {

				if (res.status == 200) {
					const reader = res.body.getReader();
					const text = await reader.read();
					console.log("Body response: " + new TextDecoder("utf-8").decode(text.value));
				} else {
					console.log("Did not get 200");
				}
			})
			.catch(err => {
				console.log(err);
			});*/

	}

	render() {


		return (
			<Button onClick={this.onClick}>
				Test HTTP Server
			</Button>
		);
	}


}

export default ServerTesterHTTP;