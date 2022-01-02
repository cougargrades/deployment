import { deleteCollection } from './_firebaseHelper.js'

for(let name of ['catalog', 'groups', 'instructors', 'meta', 'sections']) {
  await deleteCollection(name);
}