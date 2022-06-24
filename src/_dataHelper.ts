
import core_curriculum from '@cougargrades/publicdata/bundle/edu.uh.publications.core/core_curriculum.json' assert { type: 'json' };
import { Group } from '@cougargrades/types';
import { firebase } from './_firebaseHelper.js';

export function getCoreCurriculumDocRefs(courseName: string): FirebaseFirestore.DocumentReference<Group>[] {
  const db = firebase.firestore();
  const [department, catalogNumber] = courseName.trim().split(' ')
  return core_curriculum
    .filter((e: any) => e.department === department && e.catalogNumber === catalogNumber) // finds matches
    .map((e: any) => e.coreCode) // "10"
    .map((e: any) => db.doc(`/groups/${e}`)) as FirebaseFirestore.DocumentReference<Group>[];
}
