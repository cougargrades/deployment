import _ from 'lodash'
import { firebase } from './_firebaseHelper.js'
import { get, listDocuments, synthesizeFirestoreData } from './_firestoreFS.js';

const courseDocuments = await listDocuments('catalog')
const instructorDocuments = await listDocuments('instructors')
const sectionDocuments = await listDocuments('sections')
const groupDocuments = await listDocuments('groups')

/**
 * This took some tweaking to make sure we didn't encounter the following error:
 * "INVALID_ARGUMENT: Request payload size exceeds the limit: 11534336 bytes."
 */
const CHUNK_SIZE = 100

const chunks = _.chunk([...groupDocuments, ...courseDocuments, ...instructorDocuments, ...sectionDocuments], CHUNK_SIZE)

const db = firebase.firestore()

for (let i = 0; i < chunks.length; i++) {
  console.log(`Preparing firehose chunk ${i} of ${chunks.length} (${((i+1)/chunks.length*100).toFixed(1)}%)...`)
  const batch = db.batch();
  for (let docName of chunks[i]) {
    const docData = synthesizeFirestoreData(await get(docName))
    batch.set(db.doc(docName), docData);
  }
  console.log(`Syncing firehose chunk ${i} of ${chunks.length} (${((i+1)/chunks.length*100).toFixed(1)}%)...`)
  await batch.commit()
  console.log(`Commit successful! Chunk ${i} of ${chunks.length} (${((i+1)/chunks.length*100).toFixed(1)}%) uploaded.`)
}
console.log('Done with all chunks')

