import * as admin from 'firebase-admin'

console.log('what is: ',process.env.FIREBASE_PRODUCTION_SERVICE_ACCOUNT)

const serviceAccount = process.env.FIREBASE_PRODUCTION_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_PRODUCTION_SERVICE_ACCOUNT) : require('../.secret/firebase-adminsdk.json');

export const firebase = !admin.apps.length ? admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cougargrades-aefb6.firebaseio.com"
}) : admin.app();