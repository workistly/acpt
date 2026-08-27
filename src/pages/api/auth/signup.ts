import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import { db } from '@/utils/firebase'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { format } from 'date-fns'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must have at least 8 characters' })
    }

    const usersCollection = collection(db, 'users')
    const q = query(usersCollection, where('email', '==', email))

    let querySnapshot
    try {
      querySnapshot = await getDocs(q)
    } catch (queryError: any) {
      throw queryError
    }

    if (!querySnapshot.empty) {
      return res.status(409).json({ error: 'An account already exists with this email address' })
    }

    const hashedPassword = await hash(password, 12)

    const userId = doc(collection(db, 'users')).id

    const userDocRef = doc(db, 'users', userId)
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      type: 'user',
    }

    try {
      await setDoc(userDocRef, userData)
    } catch (createError: any) {
      throw createError
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        firstName,
        lastName,
      },
    })
  } catch (error: any) {
    return res.status(500).json({
      error: 'An error occurred while creating your account',
      details: error.message,
      code: error.code,
    })
  }
}
