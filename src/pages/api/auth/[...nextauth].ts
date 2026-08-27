// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { auth as firebaseAuth } from '@/utils/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { db } from '@/utils/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          // First, check if user exists in Firestore
          const q = query(collection(db, 'users'), where('email', '==', credentials.email))
          const querySnapshot = await getDocs(q)

          if (querySnapshot.empty) {
            throw new Error('User not found')
          }

          const userDoc = querySnapshot.docs[0]
          const userData = userDoc.data()

          // Check if this is a new user (has password field) or old user
          if (userData.password) {
            // New user - verify with bcrypt
            const isValid = await compare(credentials.password, userData.password)

            if (!isValid) {
              throw new Error('Invalid password')
            }

            return {
              id: userDoc.id,
              email: String(userData.email ?? ''),
              name: `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim(),
              firstName: userData.firstName ?? '',
              lastName: userData.lastName ?? '',
            }
          } else {
            // Old user - try Firebase Auth
            try {
              const userCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                credentials.email,
                credentials.password,
              )

              const user = userCredential.user

              return {
                id: user.uid,
                email: user.email ?? '',
                name: userData.firstName
                  ? `${userData.firstName} ${userData.lastName ?? ''}`.trim()
                  : (user.displayName ?? ''),
                firstName: userData.firstName ?? '',
                lastName: userData.lastName ?? '',
              }
            } catch (firebaseError: any) {
              console.error('Firebase auth error:', firebaseError)
              if (firebaseError.code === 'auth/wrong-password') {
                throw new Error('Invalid password')
              }
              throw new Error('Authentication failed')
            }
          }
        } catch (error: any) {
          console.error('Auth error:', error)
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
