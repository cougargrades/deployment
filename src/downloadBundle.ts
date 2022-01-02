import { downloadFile, extractBundle } from './_bundleHelper.js';

await downloadFile(
  'https://github.com/cougargrades/publicdata/releases/latest/download/publicdata-testbundle-summer2020.tar.gz',
  //'https://github.com/cougargrades/publicdata/releases/latest/download/publicdata-bundle.tar.gz',
  'tmp/bundle.tar.gz'
)

await extractBundle('tmp/bundle.tar.gz', 'tmp/test')