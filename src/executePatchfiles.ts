//import { AsyncSemaphore } from '@cougargrades/types'
import { Sema } from 'async-sema'
import { getPatchFiles } from './_bundleHelper.js'
import { processPatchfile, CONCURRENT_WORKER_LIMIT } from './_firebaseHelper.js'

const justFirstPhase = process.argv.includes('--just-first-phase');

const [files, maxFilePhase] = await getPatchFiles('tmp/test/io.cougargrades.publicdata.patchfile');

const startPhase = justFirstPhase ? 0 : 1;
const maxPhase = justFirstPhase ? 0 : maxFilePhase;

for(let i = startPhase; i <= maxPhase; i++) {
  console.log(`phase ${i} queue starting...`);
  console.time(`phase ${i} time`);
  const filesForCurrentPhase = files.filter(e => e.split('/').reverse()[0].startsWith(`patch-${i}`));

  const workerLimit = CONCURRENT_WORKER_LIMIT;
  const semaphore = new Sema(workerLimit, { capacity: filesForCurrentPhase.length });

  async function task(file: string) {
    await semaphore.acquire()
    try {
      await processPatchfile(file)
    } finally {
      semaphore.release();
    }
  }

  await Promise.all(filesForCurrentPhase.map(task));
  
  console.log(`phase ${i} queue done!`);
  console.timeEnd(`phase ${i} time`);
}
