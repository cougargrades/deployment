import fs from 'fs'
import { promisify } from 'util'
import admin from 'firebase-admin'
import { AsyncSemaphore, is } from '@cougargrades/types'
import { executePatchFile } from '@cougargrades/types/dist/PatchfileUtil.js'

export const fakeRequire = (filePath: string): any => JSON.parse(fs.readFileSync(new URL(filePath, import.meta.url), { encoding: 'utf8' }))

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : fakeRequire('../.secret/firebase-adminsdk.json');

export const firebase = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  : admin.app()

export async function listCollection(collectionPath: string): Promise<void> {
  const documents = await firebase
    .firestore()
    .collection(collectionPath)
    .listDocuments();
  for(let ref of documents) {
    console.log(`Found document with name '${ref.id}'`)
  }
}

export async function deleteCollection(collectionPath: string): Promise<void> {
  console.log(`Listing documents in collection: ${collectionPath}`)
  const documents = await firebase
    .firestore()
    .collection(collectionPath)
    .listDocuments()

  const workerLimit = 3;
  const semaphore = new AsyncSemaphore(workerLimit);

  for (let i = 0; i < documents.length; i++) {
    let ref = documents[i]
    await semaphore.withLockRunAndForget(async () => {
      await ref.delete()
      console.log(`Deleted ${ref.path} (${i + 1} of ${documents.length})`)
    });
  }
  await semaphore.awaitTerminate();
  console.log(`End of documents (${documents.length} deleted)`)
}

export async function processPatchfile(file: string): Promise<void> {
  const shortName = file.split('/').reverse()[0]
  const readFile = promisify(fs.readFile)
  try {
    const contents = await readFile(file, { encoding: 'utf8' });
    const decoded = JSON.parse(contents);
    if(is.Patchfile(decoded)) {
      //console.log(`- started executing ${shortName}`)
      await executePatchFile(firebase.firestore(), admin.firestore.FieldValue as any, decoded);
      console.log(`- finished executing ${shortName}`)
    }
  }
  catch(err) {
    console.error(`Failed to process patchfile ${shortName}:`,err);
  }
}

