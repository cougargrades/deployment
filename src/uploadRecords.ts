import { firebase } from './_firebaseHelper.js';
import { parseCSV } from './_bundleHelper.js';
import { shuffle } from './_shuffle.js';

const records = await parseCSV('tmp/test/edu.uh.grade_distribution/records.csv');

if(records.length === 0) {
  console.error('This CSV file is empty! Exiting.')
  process.exit(1);
}

// mutates the records array in-place
// shuffles the records so that we prevent similar courses/sections from being adjacent
shuffle(records);
console.log('CSV records have been parsed and shuffled');

// current amount pending
let concurrencyCount = 0;
// max number to do in parallel
const concurrencyLimit = 2;
// number of rows processed so far
let totalProcessed = 0;
// dataset size
const initialRecordsCount = records.length;
// firebase document IDs of pending uploads
let pendingUploads: string[] = [];
// termination scheduled
let terminationScheduled = false;

// TODO: completely untested
// adapted from: https://github.com/cougargrades/web/blob/e0a245f47c4f69260ffdc4954d76738c655f11bc/components/uploader/uploader.tsx#L218
const unsubscribe = firebase.firestore().collection('upload_queue').onSnapshot(snapshot => {
  let removals = snapshot.docChanges().filter(e => e.type === 'removed').map(e => e.doc.id);
  let additions = snapshot.docChanges().filter(e => e.type === 'added').map(e => e.doc.id);

  // adjust pending upload queue
  // remove all removals
  for(let r of removals) {
    pendingUploads.splice(pendingUploads.indexOf(r), 1);
  }

  // add all additions
  for(let a of additions) {
    pendingUploads.push(a);
  }

  // Update counts
  concurrencyCount += additions.length - removals.length;
  totalProcessed += removals.length;

  // computes number of times we can add to the current queue
  const can_upload_next = concurrencyLimit - concurrencyCount;
  console.log(`[ ${totalProcessed} / ${initialRecordsCount}] concurrencyCount: ${concurrencyCount}, can_upload_next: ${can_upload_next}`)

  // if there is room in the upload_queue
  if(can_upload_next > 0) {
    // if there are no records left to upload
    if(records.length > 0) {
      // actually do the firestore upload
      const popped = records.pop();
      if(popped !== undefined) {
        firebase.firestore().collection('upload_queue').doc().set(popped).then(e => { if(terminationScheduled) console.log('record barely made the cut') })
      }
    }
    else {
      // unsubscribe to the event listener and attempt to terminate the program
      // give a 30 second grace period for snapshot listeners and document uploads to finalize
      terminationScheduled = true;
      console.log('termination has been scheduled')
      setTimeout(() => {
        unsubscribe();
        //firebase.delete().then(e => console.log('firebase terminated'))
      }, 30_000)
    }
  }
})