import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// getApps() guards against re-initialising across hot reloads. getApp() returns the instance that
// already exists, so `app` is always a FirebaseApp — previously it was left undefined on every
// import after the first, and the SDK only tolerated that by falling back to the default app.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const imageDb = getStorage(app)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Point the client SDK at the local emulator suite. Opt-in via NEXT_PUBLIC_FIREBASE_EMULATORS, so
// a deployed build can never reach this. See docs/ENVIRONMENTS.md.
//
// The globalThis flag is for Next's hot reload: the module can be re-evaluated while Firestore is
// already running, and connecting a second time throws.
const globalRef = globalThis as typeof globalThis & { __acptEmulatorsConnected?: boolean }

if (process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === 'true' && !globalRef.__acptEmulatorsConnected) {
  globalRef.__acptEmulatorsConnected = true

  const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || '127.0.0.1'

  connectFirestoreEmulator(db, host, 8080)
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true })

  // Storage has no emulator here on purpose — the Storage emulator requires a `storage` rules
  // target in firebase.json, and adding one would make a bare `firebase deploy` overwrite the
  // production rules with the ones committed to this repo. See docs/ENVIRONMENTS.md.
}
