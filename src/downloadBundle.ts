import { downloadFile, extractBundle, rimraf } from './_bundleHelper.js';

const DEFAULT_BUNDLE = 'publicdata-bundle.tar.gz';
const DEFAULT_MOCK_DATABASE = 'database.tar.gz'
export const SELECTED_BUNDLE = process.env.SELECTED_BUNDLE !== undefined ? process.env.SELECTED_BUNDLE : DEFAULT_BUNDLE;
export const SELECTED_MOCK_DATABASE = process.env.SELECTED_MOCK_DATABASE !== undefined ? process.env.SELECTED_MOCK_DATABASE : DEFAULT_MOCK_DATABASE;

// verify that the tmp folder is empty before putting new files there, we don't want old bundles laying around causing problems
await rimraf('tmp')

await downloadFile(
  //'https://github.com/cougargrades/publicdata/releases/latest/download/publicdata-testbundle-summer2020.tar.gz',
  `https://github.com/cougargrades/publicdata/releases/latest/download/${SELECTED_BUNDLE}`,
  'tmp/bundle.tar.gz'
)

await downloadFile(
  //'https://github.com/cougargrades/publicdata/releases/latest/download/publicdata-testbundle-summer2020.tar.gz',
  `https://github.com/cougargrades/publicdata/releases/latest/download/${SELECTED_MOCK_DATABASE}`,
  'tmp/database.tar.gz'
)

await extractBundle('tmp/bundle.tar.gz', 'tmp/test')
await extractBundle('tmp/database.tar.gz', 'tmp/firebaseFS')
