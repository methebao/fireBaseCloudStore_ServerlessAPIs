import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const app = express();
const main = express();

const tripsCollection = 'Trips';

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false}));


// Add new trip 
app.post('/trips', (req, res) => {
	firebaseHelper.firestore.creatNewDocument(db, tripsCollection, req.body);
	res.send('Create a new trip');
})
// Update new trip
app.patch('/trips/:tripId', (req, res) => {
	firebaseHelper.firestore.updateDocument(db, tripsCollection, req.params.tripId, req.body)
	res.send('Update a new trip');
})

//View a trip
app.get('trips/:tripId', (req, res) => {
	firebaseHelper.firestore.getDocument(db, tripsCollection, req.params.tripId)
	.then(doc => res.status(200).send(doc));
})

//View all trips
app.get('/trips', (req, res) => {
	firebaseHelper.firestore
		.backup(db, tripsCollection)
		.then(data => res.status(200).send(data))
})

// Delete a trip
app.delete('/trips/:tripId', (req, res) => {
	firebaseHelper.firestore.deleteDocument(db, tripsCollection, req.params.tripId);
	res.send('Trip deleted')
})

export const tadiApi = functions.https.onRequest(main);


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
