
import { parseCSV } from './_bundleHelper.js';
import { shuffle } from './_shuffle.js';
import { whenUploadQueueAdded } from './_upload.js'
import { CONCURRENT_WORKER_LIMIT } from './_firebaseHelper.js';
import { AsyncSemaphore } from '@cougargrades/types'
import chalk from 'chalk'

const records = await parseCSV('tmp/test/edu.uh.grade_distribution/records.csv');

if(records.length === 0) {
  console.error('This CSV file is empty! Exiting.')
  process.exit(1);
}

// mutates the records array in-place
// shuffles the records so that we prevent similar courses/sections from being adjacent
shuffle(records);
console.log('CSV records have been parsed and shuffled');

const workerLimit = CONCURRENT_WORKER_LIMIT;
const semaphore = new AsyncSemaphore(workerLimit);

console.log(chalk.blue(`CONCURRENT PROCESSING ENABLED\n\tWorker limit: ${workerLimit}`))

for(let i = 0; i < records.length; i++) {
  await semaphore.withLockRunAndForget(async () => {
    await whenUploadQueueAdded(records[i]);
    console.log(`Processed client-side: ${i+1} of ${records.length} (${((i+1)/records.length*100).toFixed(1)}%)`)
  })
}
await semaphore.awaitTerminate();
console.log(`Finished processing records (${records.length} processed)`)
