import { db } from '@/utils/firebase'
import { doc, writeBatch } from 'firebase/firestore'

export const updateCollection = async (collectionName: string, id: string, data: any) => {
  const batch = writeBatch(db)

  batch.set(
    doc(db, collectionName, id),
    {
      ...data,
    },
    {
      merge: true,
    },
  )

  await batch.commit()

  return {
    status: true,
  }
}

export const deleteTransaction = async (certId: string, transId: string, examId: string) => {
  const batch = writeBatch(db)
  const doc1 = doc(db, 'certificates', certId)
  batch.delete(doc1)

  const doc2 = doc(db, 'transactions', transId)
  batch.delete(doc2)

  const doc3 = doc(db, 'exams_completed', examId)
  batch.set(
    doc3,
    {
      payment: 'Unpaid',
    },
    {
      merge: true,
    },
  )
  await batch.commit()
}
