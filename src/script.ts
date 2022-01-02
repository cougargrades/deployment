import { downloadFile, extractBundle } from './_bundleHelper.js'
import { deleteCollection } from './_firebaseHelper.js'

await downloadFile(
  'https://github.com/cougargrades/publicdata/releases/latest/download/publicdata-testbundle-summer2020.tar.gz',
  'tmp/bundle.tar.gz'
)
await extractBundle('tmp/bundle.tar.gz', 'tmp/test')

await deleteCollection('groups')
