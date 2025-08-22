import { initializeApp } from 'firebase/app'
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

// --- DATABASE INSTANCES ---
export const userFirestore = getFirestore(userApp)
export const hostFirestore = getFirestore(hostApp)

// --- STORAGE INSTANCES ---
export const userStorage = getStorage(userApp)
export const hostStorage = getStorage(hostApp)

// --- REALTIME DATABASE INSTANCES ---
export const hostRealtimeDB = getDatabase(hostApp)
