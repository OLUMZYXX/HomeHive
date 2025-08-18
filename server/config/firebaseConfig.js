import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'

// --- FIREBASE CONFIGS ---
const firebaseConfigUser = {
  apiKey: 'AIzaSyC_m8VXQdvOmium9hTTzK0RmdkAqgoCsL8',
  authDomain: 'home-hive-b9914.firebaseapp.com',
  projectId: 'home-hive-b9914',
  storageBucket: 'home-hive-b9914.appspot.com',
  messagingSenderId: '553080244929',
  appId: '1:553080244929:web:ad5167191de722b45aa240',
  measurementId: 'G-13WTPNSK7Q',
}

const firebaseConfigHost = {
  apiKey: 'AIzaSyC_m8VXQdvOmium9hTTzK0RmdkAqgoCsL8',
  authDomain: 'home-hive-b9914.firebaseapp.com',
  databaseURL: 'https://home-hive-b9914-default-rtdb.firebaseio.com',
  projectId: 'home-hive-b9914',
  storageBucket: 'home-hive-b9914.appspot.com',
  messagingSenderId: '553080244929',
  appId: '1:553080244929:web:d313116073d386805aa240',
  measurementId: 'G-2WTYL5Q9Y8',
}

// --- INITIALIZE FIREBASE ---
const userApp = initializeApp(firebaseConfigUser, 'userApp')
const hostApp = initializeApp(firebaseConfigHost, 'hostApp')

// --- AUTH INSTANCES ---
export const userAuth = getAuth(userApp)
export const hostAuth = getAuth(hostApp)

// --- DATABASE INSTANCES ---
export const userFirestore = getFirestore(userApp)
export const hostFirestore = getFirestore(hostApp)

// --- STORAGE INSTANCES ---
export const userStorage = getStorage(userApp)
export const hostStorage = getStorage(hostApp)

// --- REALTIME DATABASE INSTANCES ---
export const hostRealtimeDB = getDatabase(hostApp)

export const userProvider = new GoogleAuthProvider()
export const hostProvider = new GoogleAuthProvider()

// --- GOOGLE PROVIDER ---
export const provider = new GoogleAuthProvider()

// --- GOOGLE SIGN IN ---
export const signInUserWithGoogle = () => signInWithPopup(userAuth, provider)
export const signInHostWithGoogle = () => signInWithPopup(hostAuth, provider)

// --- ANALYTICS ---
export let userAnalytics = null
export let hostAnalytics = null

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      userAnalytics = getAnalytics(userApp)
      hostAnalytics = getAnalytics(hostApp)
    }
  })
}
