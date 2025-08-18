import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore'
import { userFirestore, hostFirestore } from '../config/firebaseConfig.js'

// Database service for User operations
export class UserDatabaseService {
  constructor() {
    this.db = userFirestore
  }

  // Create a new document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  }

  // Read a single document
  async read(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error reading document:', error)
      throw error
    }
  }

  // Read multiple documents
  async readAll(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName))
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      return documents
    } catch (error) {
      console.error('Error reading documents:', error)
      throw error
    }
  }

  // Update a document
  async update(collectionName, docId, data) {
    try {
      const docRef = doc(this.db, collectionName, docId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      })
      return true
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  // Delete a document
  async delete(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  // Query documents with filters
  async query(
    collectionName,
    filters = [],
    orderByField = null,
    limitCount = null
  ) {
    try {
      let q = collection(this.db, collectionName)

      // Apply filters
      filters.forEach((filter) => {
        q = query(q, where(filter.field, filter.operator, filter.value))
      })

      // Apply ordering
      if (orderByField) {
        q = query(
          q,
          orderBy(orderByField.field, orderByField.direction || 'asc')
        )
      }

      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const querySnapshot = await getDocs(q)
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      return documents
    } catch (error) {
      console.error('Error querying documents:', error)
      throw error
    }
  }

  // Real-time listener
  subscribe(collectionName, callback, filters = []) {
    let q = collection(this.db, collectionName)

    filters.forEach((filter) => {
      q = query(q, where(filter.field, filter.operator, filter.value))
    })

    return onSnapshot(q, (querySnapshot) => {
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      callback(documents)
    })
  }
}

// Database service for Host operations
export class HostDatabaseService {
  constructor() {
    this.db = hostFirestore
  }

  // All the same methods as UserDatabaseService but using hostFirestore
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  }

  async read(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error reading document:', error)
      throw error
    }
  }

  async readAll(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName))
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      return documents
    } catch (error) {
      console.error('Error reading documents:', error)
      throw error
    }
  }

  async update(collectionName, docId, data) {
    try {
      const docRef = doc(this.db, collectionName, docId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      })
      return true
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  async delete(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  async query(
    collectionName,
    filters = [],
    orderByField = null,
    limitCount = null
  ) {
    try {
      let q = collection(this.db, collectionName)

      filters.forEach((filter) => {
        q = query(q, where(filter.field, filter.operator, filter.value))
      })

      if (orderByField) {
        q = query(
          q,
          orderBy(orderByField.field, orderByField.direction || 'asc')
        )
      }

      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const querySnapshot = await getDocs(q)
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      return documents
    } catch (error) {
      console.error('Error querying documents:', error)
      throw error
    }
  }

  subscribe(collectionName, callback, filters = []) {
    let q = collection(this.db, collectionName)

    filters.forEach((filter) => {
      q = query(q, where(filter.field, filter.operator, filter.value))
    })

    return onSnapshot(q, (querySnapshot) => {
      const documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      callback(documents)
    })
  }
}

// Export instances
export const userDB = new UserDatabaseService()
export const hostDB = new HostDatabaseService()
