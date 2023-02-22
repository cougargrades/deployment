
import { parseCSV } from './_bundleHelper.js';
import { shuffle } from './_shuffle.js';
import { whenUploadQueueAdded } from './_upload.js'
import { CONCURRENT_WORKER_LIMIT } from './_firebaseHelper.js';
import { GradeDistributionCSVRow } from '@cougargrades/types/dist/GradeDistributionCSVRow';
import { Sema, RateLimit } from 'async-sema'
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
const semaphore = new Sema(workerLimit, { capacity: records.length });

async function task(record: GradeDistributionCSVRow) {
  await semaphore.acquire()
  try {
    const i = records.length - semaphore.nrWaiting();
    console.log(`Processed client-side: ${i+1} of ${records.length} (${((i+1)/records.length*100).toFixed(1)}%)`)
    await whenUploadQueueAdded(record);
  } finally {
    semaphore.release();
  }
}

console.log(chalk.blue(`CONCURRENT PROCESSING ENABLED\n\tWorker limit: ${workerLimit}`))

await Promise.all(records.map(task));

console.log(`Finished processing records (${records.length} processed)`)
