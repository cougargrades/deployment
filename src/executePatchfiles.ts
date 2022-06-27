import { AsyncSemaphore } from '@cougargrades/types'
import { getPatchFiles } from './_bundleHelper.js'
import { processPatchfile, SEQUENTIAL_PROCESSING } from './_firebaseHelper.js'

const justFirstPhase = process.argv.includes('--just-first-phase');

const [files, maxFilePhase] = await getPatchFiles('tmp/test/io.cougargrades.publicdata.patchfile');

const startPhase = justFirstPhase ? 0 : 1;
const maxPhase = justFirstPhase ? 0 : maxFilePhase;

for(let i = startPhase; i <= maxPhase; i++) {
  console.log(`phase ${i} queue starting...`);
  console.time(`phase ${i} time`);
  const filesForCurrentPhase = files.filter(e => e.split('/').reverse()[0].startsWith(`patch-${i}`));

  const workerLimit = SEQUENTIAL_PROCESSING ? 1 : 2;
  const semaphore = new AsyncSemaphore(workerLimit);

  for(let file of filesForCurrentPhase) {
    await semaphore.withLockRunAndForget(async () => await processPatchfile(file));
  }
  await semaphore.awaitTerminate();
  console.log(`phase ${i} queue done!`);
  console.timeEnd(`phase ${i} time`);
}
