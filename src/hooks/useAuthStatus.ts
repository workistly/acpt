import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/utils/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { showNotification } from '@mantine/notifications'
import { useLingui } from '@lingui/react/macro'

export function useAuthStatus() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLingui()

  useEffect(() => {
    const checkUserStatus = async () => {
      if (session?.user?.id) {
        try {
          const userDocRef = doc(db, 'users', session.user.id)
          const userDoc = await getDoc(userDocRef)

          if (!userDoc.exists()) {
            showNotification({
              message: t`This user has been deleted.`,
              color: 'red',
            })
            await signOut({ redirect: false })
            router.push('/login')
            return
          }

          const userData = userDoc.data()

          if (userData.is_archived) {
            showNotification({
              message: t`You are no longer able to login. Please contact support should you have any queries.`,
              color: 'red',
            })
            await signOut({ redirect: false })
            router.push('/login')
            return
          }
        } catch (error) {
          console.error('Error checking user status:', error)
        }
      }
    }

    if (status === 'authenticated') {
      checkUserStatus()
    }
  }, [session, status, router, t])

  return { session, status }
}
