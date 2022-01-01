import { firebase } from './_firebaseHelper'

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};

function listCollection(): Promise<void> {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection('users').stream()
    .on('data', (documentSnapshot) => {
      console.log(`Found document with name '${documentSnapshot.id}'`);
    }).on('end', () => {
      console.log('End of documents');
      resolve()
    });
  });
}

sum(2,4)
listCollection();
console.log('hello world!')
