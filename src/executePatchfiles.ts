import { AsyncSemaphore } from '@cougargrades/types'
import { getPatchFiles } from './_bundleHelper.js'
import { processPatchfile } from './_firebaseHelper.js'

const [files, maxPhase] = await getPatchFiles('tmp/test/io.cougargrades.publicdata.patchfile')

for(let i = 0; i <= maxPhase; i++) {
  console.log(`phase ${i} queue starting...`);
  console.time(`phase ${i} time`);
  const filesForCurrentPhase = files.filter(e => e.split('/').reverse()[0].startsWith(`patch-${i}`));

  const workerLimit = 2;
  const semaphore = new AsyncSemaphore(workerLimit);

  for(let file of filesForCurrentPhase) {
    await semaphore.withLockRunAndForget(async () => await processPatchfile(file));
  }
  await semaphore.awaitTerminate();
  console.log(`phase ${i} queue done!`);
  console.timeEnd(`phase ${i} time`);
}
