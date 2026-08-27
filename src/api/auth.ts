import { auth, db } from '@/utils/firebase'
import { useLingui } from '@lingui/react/macro'
import { showNotification } from '@mantine/notifications'
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  NextOrObserver,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { signOut } from 'next-auth/react'
import { useCallback } from 'react'

export const useLogout = () => {
  return useCallback(async () => {
    try {
      sessionStorage.clear()
      localStorage.clear()

      await signOut({
        redirect: false,
        callbackUrl: '/',
      })

      showNotification({
        message: 'Successfully logged out',
        color: 'green',
      })

      location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      showNotification({
        message: 'Error logging out',
        color: 'red',
      })
    }
  }, [])
}

export const createUserDocumentFromAuth = async (userAuth: User, additionalInformation = {}) => {
  if (!userAuth) return

  const userDocRef = doc(db, 'users', userAuth.uid)
  const userSnapshot = await getDoc(userDocRef)

  if (!userSnapshot.exists()) {
    const { email } = userAuth
    const createdAt = new Date()

    return setDoc(userDocRef, {
      email,
      createdAt,
      type: 'user',
      ...additionalInformation,
    })
  }

  return userSnapshot
}

export const createAuthUserWithEmailAndPassword = async (email: string, password: string) => {
  if (!email || !password) return

  return createUserWithEmailAndPassword(auth, email, password)
}

export const googleAuthentication = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    await createUserDocumentFromAuth(user, { provider: 'google' })
    return {
      status: true,
    }
  } catch (error) {
    return {
      status: false,
    }
  }
}

export const checkIfGoogleAuthEmail = async (email: string) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs.length > 0) {
      const docData = querySnapshot.docs[0].data()
      if (docData.provider === 'google') {
        return {
          googleEmail: true,
        }
      } else {
        return {
          googleEmail: false,
        }
      }
    } else {
      return {
        googleEmail: false,
      }
    }
  } catch (error) {
    return {
      status: false,
    }
  }
}

export const useSignInAuthUserWithEmailAndPassword = () => {
  const { t } = useLingui()

  return useCallback(
    async (email: string, password: string) => {
      if (!email || !password) return

      const resp = await checkIfGoogleAuthEmail(email)

      if (resp.googleEmail) {
        showNotification({
          message: t`Login failed - this E-mail is associated with a Google Authentication account.`,
          color: 'red',
        })

        return null
      }

      return signInWithEmailAndPassword(auth, email, password)
    },
    [t],
  )
}

export const sendPasswordResetEmailFunc = async (email: string) => {
  if (!email) return

  return sendPasswordResetEmail(auth, email, {
    url: `${process.env.NEXT_PUBLIC_URL}/login`,
  })
}

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) => onAuthStateChanged(auth, callback)

export const checkAccountExists = async (matchVal: string) => {
  const q = query(collection(db, 'users'), where('email', '==', matchVal))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.docs.length > 0) {
    return {
      status: true,
      exists: true,
    }
  } else {
    return {
      status: true,
      exists: false,
    }
  }
}

export const checkOldPassword = async (email: string, password: string) =>
  reauthenticateWithCredential(auth.currentUser as User, EmailAuthProvider.credential(email, password))
