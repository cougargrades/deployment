import { downloadFile, extractBundle } from './_bundleHelper';
import { deleteCollection, firebase } from './_firebaseHelper'

async function main() {
  await downloadFile('https://github.com/cougargrades/publicdata/releases/latest/download/publicdata-testbundle-summer2020.tar.gz', 'bundle.tar.gz')
  //await extractBundle('bundle.tar.gz', 'test')

  await deleteCollection('groups')
}

main();
