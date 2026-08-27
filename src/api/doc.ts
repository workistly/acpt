import { db } from '@/utils/firebase'
import { showNotification } from '@mantine/notifications'
import { collection, getDocs, getDoc, query, doc, writeBatch, where, deleteDoc } from 'firebase/firestore'

export const getAllDocs = async (collectionName: string) => {
  try {
    const q = query(collection(db, collectionName))
    const querySnapshot = await getDocs(q)
    const data: any = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), docId: doc.id })
    })
    return {
      status: true,
      data: data[0],
      fullData: data,
    }
  } catch (error) {
    showNotification({
      message: 'An unknown error occurred. Try again later.',
      color: 'red',
    })

    return {
      status: false,
    }
  }
}

export const getDocument = async (id: string, collectionName: string) => {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return {
      exists: true,
      status: true,
      data: docSnap.data(),
    }
  } else {
    return {
      exists: false,
      status: true,
    }
  }
}

export const deleteDocumentQuery = async (param: string, value: string, tableName: string) => {
  const batch = writeBatch(db)
  const docQuery = query(collection(db, tableName), where(param, '==', value))
  const docsData = await getDocs(docQuery)
  docsData.forEach((doc) => {
    batch.delete(doc.ref)
  })
  await batch.commit()
}

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)
}
