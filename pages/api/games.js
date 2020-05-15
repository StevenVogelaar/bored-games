import MongoDB from 'mongodb';
import ConfigManager from '../../lib/ConfigManager';
import http from 'http';

const publicFunctions = {

	getPublicGames: getPublicGames,
};

var dbConnected = false;


ConfigManager.openConfig();
const config = ConfigManager.readConfig();
var mongoClient = null;
var boredDB = null;
var gservers = null;



export default async function handler(req, res) {

	if (!dbConnected) {

		try {
			console.log("calling");
			await connectToDB();
			console.log("finished");
		} catch (err) {
			console.log(err);
			res.status(500).json(JSON.stringify("Error with configuration. Please contact site admin."));
			return;
		}
	}

	if ('content-type' in req.headers === false || req.headers['content-type'] !== 'application/json') {

		res.status(400).json(JSON.stringify("Incorrect content-type"));
		return;
	}


	if (req.method === 'POST') {

		console.log(req.body.method);

		if ('method' in req.body === false || req.body.method in publicFunctions === false) {
			res.status(400).json(JSON.stringify({ message: "Invalid api method." }));
			return;
		}

		await publicFunctions[req.body.method](res); // Expecting these functions to handle sending the response.

		return;
	} else {

		res.status(400).json(JSON.stringify({ message: "Invalid http method." }));
	}


}

async function connectToDB() {

	mongoClient = await MongoDB.connect(config.dbConnectString, { useUnifiedTopology: true });

	boredDB = mongoClient.db('boredDB');
	gservers = boredDB.collection('gservers');
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
 * @param {http.ServerResponse} res 
 *
 */
async function getPublicGames(res) {

	const results = await gservers.find({}).toArray();
	console.log(results);
	res.status(200).json(JSON.stringify(results));
}