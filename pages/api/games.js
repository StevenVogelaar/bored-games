import MongoDB from 'mongodb';
import ConfigManager from '../../lib/ConfigManager';
import http from 'http';
import WebSocket from 'ws';
import sanitize from 'mongo-sanitize';

const publicFunctions = {

	getPublicGames: getPublicGames,
	startNewGame: startNewGame,
	getRoomInfo: getRoomInfo
};

var dbConnected = false;


ConfigManager.openConfig();
const config = ConfigManager.readConfig();
var mongoClient = null;
var boredDB = null;
var gservers = null;
var rooms = null;



export default async function handler(req, res) {

	if (!dbConnected) {

		try {
			console.log("calling");
			await connectToDB();
			console.log("finished");
		} catch (err) {
			console.log(err);
			res.status(500).json(JSON.stringify({ message: "Error with configuration. Please contact site admin." }));
			return;
		}
	}

	if ('content-type' in req.headers === false || req.headers['content-type'] !== 'application/json') {

		res.status(400).json(JSON.stringify({ message: "Incorrect content-type" }));
		return;
	}


	if (req.method === 'POST') {

		console.log(req.body.method);

		if ('method' in req.body === false || req.body.method in publicFunctions === false) {
			res.status(400).json(JSON.stringify({ message: "Invalid api method." }));
			return;
		}

		try {
			publicFunctions[req.body.method](req, res); // Expecting these functions to handle sending the response.
		} catch (err) {
			console.error(err);
			res.status(400).json(JSON.stringify({ message: "Internal error." }));
		}

		return;
	} else {

		res.status(400).json(JSON.stringify({ message: "Invalid http method." }));
	}


}

async function connectToDB() {

	mongoClient = await MongoDB.connect(config.dbConnectString, { useUnifiedTopology: true });

	boredDB = mongoClient.db('boredDB');
	gservers = boredDB.collection('gservers');
	rooms = boredDB.collection('rooms');

	dbConnected = true;
	console.log("Connection established with db.");
}

/**
 * 
 * Sends an array of server info objects.
 * 
 * Example:
 * 
 * [{"_id":"5ebee25ebf151017e01b906f","host":"127.0.0.1","port":3820}, 
 * {"_id":"5ebee25ebf151017e01b906G","host":"127.0.0.1","port":3820}]
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 *
 */
async function getPublicGames(req, res) {

	const results = await rooms.find({password: ""}).toArray();
	console.log(results);
	res.status(200).json(JSON.stringify(results));
}

/**
 * 
 * @param {http.IncomingMessage} req 
 * 		Expecting a json object in the form:
 * 			{method:"getGameInfo", roomID:"F2B5BC1"}
 * @param {http.ServerResponse} res 
 * 
 * Example response:
 * 
 * 		{"roomID":"fa2g5a1j", "host":"localhost", "port":1234, password:true}
 */
async function getRoomInfo(req, res){


	if ("roomID" in req.body === false){
		res.status(400).json(JSON.stringify({message: 'roomID was not specified.'}));
		return;
	}

	const result = await rooms.findOne({roomID: sanitize(req.body.roomID)});

	if (result){

		const {type, roomID, host, port} = result;
		res.status(200).json(JSON.stringify({type, roomID, host, port}));
		return;
	} else {
		res.status(500).json(JSON.stringify({message: 'Specified room was not found.'}));
		return;
	}
}

/**
 * 
 * Randomly selects a game server to start a new game lobby in.
 * 
 * TODO: Change to round robin or finish the load balancer
 * 
 * @param {http.IncomingMessage} req 
 * 		Expects json data. Example:
 * 			{type:"checkers", password:""} 
 * 			or
 * 			{type:"checkers", password:"pass123"}
 * @param {http.ServerResponse} res 
 *   
 * 	Example response:
 * 
 * 		{"roomID":"fa2g5a1j", "host":"localhost", "port":1234, password:""}
 */
async function startNewGame(req, res) {


	const results = await gservers.find({}).toArray();

	if (results.length === 0) {
		res.status(500).json(JSON.stringify({ message: "No available game servers." }));
		return;
	}

	if ("password" in req.body === false){
		res.status(400).json(JSON.stringify({ message: '"Password" parameter not specified (can be empty).' }));
		return;
	}
	if ("type" in req.body === false){
		res.status(400).json(JSON.stringify({ message: '"type" parameter not specified.' }));
		return;
	}


	const server = results[Math.round(Math.random() * (results.length - 1))];
	const webSocket = new WebSocket(server.host + ":" + server.port);

	webSocket.onopen = (e) => {

		webSocket.send(JSON.stringify({ method: "startNewGame", password: req.body.password, type:req.body.type}));
	};

	webSocket.onmessage = (messageEvent) => {

		console.log("Recieved message: " + messageEvent.data);

		const jsonMessage = JSON.parse(messageEvent.data);

		if (jsonMessage.error) {
			console.error(jsonMessage.message);
			res.status(500).json(JSON.stringify({ message: jsonMessage.message }));
		} else {
			res.status(200).json(JSON.stringify({
				message: "Room created successfully",
				roomID: jsonMessage.roomID,
				host: jsonMessage.host,
				port: jsonMessage.port
			}));
		}


		webSocket.close();
	};

	webSocket.onerror = (err) => {
		console.error(err);
		res.status(500).json(JSON.stringify({ message: "An error has occured." }));
		webSocket.close();
	};

}