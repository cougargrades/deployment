import * as admin from 'firebase-admin'

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : require('../.secret/firebase-adminsdk.json');

export const firebase = !admin.apps.length ? admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
}) : admin.app();


export function listCollection(): Promise<void> {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection('users').stream()
    .on('data', (documentSnapshot) => {
      console.log(`Found document with name '${documentSnapshot.id}'`);
    }).on('end', () => {
      console.log('End of documents');
      resolve()
    })
    .on('error', (...args) => reject(...args));
  });
}

export async function deleteCollection(collectionPath: string): Promise<void> {
  console.log(`Listing documents in collection: ${collectionPath}`)
  const documents = await firebase.firestore().collection(collectionPath).listDocuments();
  for(let i = 0; i < documents.length; i++) {
    let ref = documents[i];
    await ref.delete();
    console.log(`Deleted ${ref.path} (${i+1} of ${documents.length})`)
  }
  console.log(`End of documents (${documents.length} deleted)`);
}

// export function deleteCollection(collectionPath: string): Promise<void> {
//   let count = 0;
//   return new Promise((resolve, reject) => {

//     console.log(`Deleting collection ${collectionPath}`)
//     firebase.firestore().collection(collectionPath).
//     firebase.firestore().collection(collectionPath).stream()
//     .on('data', async (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
//       await snap.ref.delete()
//       console.log(`Deleted ${snap.ref.path}`)
//       ++count;
//     }).on('end', () => {
//       console.log(`End of documents (${count} deleted)`);
//       resolve()
//     })
//     .on('error', (...args) => reject(...args));
//   });
// }