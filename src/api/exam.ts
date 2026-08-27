import { db } from '@/utils/firebase'
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore'

export const getActiveExam = async (matchVal: string) => {
  const q = query(
    collection(db, 'exams'),
    where('language', '==', matchVal),
    where('is_archived', '==', false),
    where('is_active', '==', true),
  )
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
}

export const queryData = async (collectionName: string, field: string, matchVal: any) => {
  let q = query(collection(db, collectionName), where(field, '==', matchVal))
  if (collectionName === 'exams_questions') {
    q = query(collection(db, collectionName), where(field, '==', matchVal), where('is_archived', '==', false))
  }

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
}

export const addDocInCollection = async (
  collectionName: string,
  data: any,
  examsCompleted?: number,
  examsAttempted?: number,
) => {
  const batch = writeBatch(db)
  const docRef = doc(collection(db, collectionName))
  batch.set(docRef, data)

  if (collectionName === 'exams_completed') {
    const userId = data.user_id
    batch.set(
      doc(db, 'users', userId as string),
      {
        attempted_exams: examsAttempted ? examsAttempted + 1 : 1,
        completed_exams: examsCompleted ? examsCompleted + 1 : 1,
      },
      { merge: true },
    )
  }

  await batch.commit()

  return {
    status: true,
    docId: docRef && docRef.id ? docRef.id : '',
  }
}
