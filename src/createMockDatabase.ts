
import { firebase } from './_firebaseHelper.js'
import _ from 'lodash'
import { FS_DOC_REF_SENTINEL, isFSDocumentReference, synthesizeFirestoreData } from './_firestoreFS.js'

// const db = firebase.firestore();

// const docRef = db.doc('catalog/ENGL 1304')

// console.log(docRef)

const sample = {
  _id: 'string',
  _path: 'string',
  department: 'string',
  catalogNumber: 'string',
  description: 'string',
  GPA: {
    gpa: 2.0
  },
  sections: [
    {
      __meta__: FS_DOC_REF_SENTINEL,
      __path__: '/catalog/FAKE 1234',
    },
    {
      __meta__: FS_DOC_REF_SENTINEL,
      __path__: '/catalog/FAKE 1234',
    },
  ],
  instructors: [
    {
      __meta__: FS_DOC_REF_SENTINEL,
      __path__: '/catalog/FAKE 1234',
    },
    {
      __meta__: FS_DOC_REF_SENTINEL,
      __path__: '/catalog/FAKE 1234',
    },
  ],
}

const data = synthesizeFirestoreData(sample)
console.log('data: ', data)
