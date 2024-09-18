import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import 'server-only'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || '{}')
serviceAccount['private_key'] = serviceAccount['private_key'].replace(
  /\\n/g,
  '\n',
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'storage_bucket',
  })
}

const db = admin.firestore()
const bucket = admin.storage().bucket()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'api_key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'auth_domain',
  projectId: process.env.FIREBASE_PROJECT_ID || 'project_id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'storage_bucket',
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID || 'messaging_sender_id',
  appId: process.env.FIREBASE_APP_ID || 'app_id',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'measurement_id',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { app, auth, bucket, db, provider }
